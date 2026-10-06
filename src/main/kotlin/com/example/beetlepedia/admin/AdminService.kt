package com.example.beetlepedia.admin

import com.example.beetlepedia.domain.Image
import com.example.beetlepedia.domain.LanguageFlags
import com.example.beetlepedia.domain.LocalizedText
import com.example.beetlepedia.domain.SizeInfo
import com.example.beetlepedia.domain.SizeRange
import com.example.beetlepedia.domain.Source
import com.example.beetlepedia.domain.Taxon
import com.example.beetlepedia.domain.TaxonRank
import com.example.beetlepedia.repository.AreaRepository
import com.example.beetlepedia.repository.CountryRepository
import com.example.beetlepedia.repository.GenusRepository
import com.example.beetlepedia.repository.ImageRepository
import com.example.beetlepedia.repository.SourceRepository
import com.example.beetlepedia.repository.TaxonGroupRepository
import com.example.beetlepedia.repository.TaxonRepository
import com.example.beetlepedia.validation.Problem
import com.example.beetlepedia.validation.RangeContext
import com.example.beetlepedia.validation.TaxonomyValidator
import jakarta.persistence.EntityManager
import jakarta.persistence.FlushModeType
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.interceptor.TransactionAspectSupport

/** Counts and every data problem, for the dashboard. */
data class Overview(
	val groups: Long,
	val genera: Long,
	val taxa: Long,
	val sources: Long,
	val images: Long,
	val withoutImage: Int,
	val problems: List<Problem>,
)

/** One row of the admin taxon list (built inside the transaction). */
data class TaxonRow(
	val id: String,
	val sci: String,
	val name: String?,
	val subspecies: Boolean,
	val color: String,
	val size: String,
	val distribution: String,
	val images: Int,
)

/** A genus and its taxa for the admin list. */
data class GenusRows(val id: String, val sci: String, val name: String?, val taxa: List<TaxonRow>)

/**
 * Edits made in the admin screen. Every save runs the data rules ([TaxonomyValidator]);
 * when any rule fails nothing is written (the transaction is rolled back) and the problems are returned.
 */
@Service
@Transactional
class AdminService(
	private val groups: TaxonGroupRepository,
	private val genera: GenusRepository,
	private val taxa: TaxonRepository,
	private val sources: SourceRepository,
	private val images: ImageRepository,
	private val countries: CountryRepository,
	private val areas: AreaRepository,
	private val validator: TaxonomyValidator,
	private val em: EntityManager,
) {

	private fun rangeContext() = RangeContext(countries.findAll().map { it.code }.toSet(), areas.findAll().associateBy { it.code })

	@Transactional(readOnly = true)
	fun overview(): Overview {
		val genusList = genera.findAllByOrderBySortOrder()
		val all = taxa.findAll()
		return Overview(
			groups.count(), genusList.size.toLong(), all.size.toLong(), sources.count(), images.count(),
			all.count { it.images.isEmpty() },
			validator.validateAll(groups.findAllByOrderBySortOrder(), genusList, rangeContext()),
		)
	}

	/** Genera with their taxa, for the list page. */
	@Transactional(readOnly = true)
	fun generaWithTaxa() = genera.findAllByOrderBySortOrder().map { g ->
		GenusRows(g.id, g.sci, g.name.ko, taxa.findAllByGenusIdOrderBySortOrder(g.id).map { x ->
			val m = x.size.male
			TaxonRow(
				x.id, x.sci, x.name.ko, x.rank == TaxonRank.SUBSPECIES, x.color,
				when { m?.max == null -> "—"; m.min == null -> "≤ ${m.max} mm"; else -> "${m.min}–${m.max} mm" },
				x.distribution.joinToString(" "), x.images.size,
			)
		})
	}

	@Transactional(readOnly = true)
	fun taxonForm(id: String): TaxonForm? = taxa.findById(id).orElse(null)?.let(TaxonForm::of)

	@Transactional(readOnly = true)
	fun newTaxonForm(genusId: String): TaxonForm? {
		val g = genera.findById(genusId).orElse(null) ?: return null
		val next = taxa.findAllByGenusIdOrderBySortOrder(genusId).maxOfOrNull { it.sortOrder }?.plus(1) ?: 0
		return TaxonForm(id = "${g.id}-", genusId = g.id, sci = "${g.sci} ", color = g.color, sortOrder = next)
	}

	@Transactional(readOnly = true)
	fun genusOptions() = genera.findAllByOrderBySortOrder().map { it.id to it.sci }

	/** Creates ([existingId] null) or updates a taxon. Returns the problems; empty means saved. */
	fun saveTaxon(existingId: String?, f: TaxonForm): List<Problem> {
		// Lookups below must not flush the half-edited taxon before it is validated.
		em.flushMode = FlushModeType.COMMIT
		val problems = mutableListOf<Problem>()
		val where = "taxon ${f.id}"
		val genus = genera.findById(f.genusId).orElse(null)
			?: return listOf(Problem(where, "unknown genus '${f.genusId}'"))
		val creating = existingId == null
		val x: Taxon = if (creating) {
			if (taxa.existsById(f.id.trim())) problems += Problem(where, "id already exists")
			Taxon(id = f.id.trim(), genus = genus)
		} else {
			taxa.findById(existingId!!).orElse(null) ?: return listOf(Problem(where, "not found"))
		}
		taxa.findBySci(f.sci.trim())?.let { other -> if (other.id != x.id) problems += Problem(where, "scientific name already used by ${other.id}") }

		x.genus = genus
		x.rank = runCatching { TaxonRank.valueOf(f.rank) }.getOrElse { problems += Problem(where, "unknown rank ${f.rank}"); TaxonRank.SPECIES }
		x.sci = f.sci.trim().replace(Regex("\\s+"), " ")
		x.speciesSci = f.speciesSci.clean()
		x.authority = f.authority.clean()
		x.describedYear = f.describedYear
		x.color = f.color.trim()
		x.sortOrder = f.sortOrder
		x.name = f.name.toText() ?: LocalizedText()
		x.nameInformal = LanguageFlags(f.informalKo, f.informalEn, f.informalJa)
		x.nameNote = f.nameNote.toText()
		x.size = SizeInfo(range(f.maleMin, f.maleMax), range(f.femaleMin, f.femaleMax), f.sizeNote.toText())
		x.pattern = f.pattern.toText()
		x.morphology = f.morphology.toText()
		x.distributionNote = f.distributionNote.toText()
		x.habitat = f.habitat.toText()
		x.ecology = f.ecology.toText()
		x.captivityNote = f.captivityNote.toText()
		x.conservationStatus = f.conservationStatus.toText()
		x.conservationText = f.conservationText.toText()
		x.distribution.replace(f.distribution.tokens())
		x.images.replace(f.images.nonEmptyLines().mapNotNull { file ->
			images.findByFile(file) ?: null.also { problems += Problem(where, "unknown image '$file'") }
		})
		x.sources.replace(resolveSources(where, f.sources, problems))
		x.sizeSources.replace(resolveSources(where, f.sizeSources, problems))

		problems += validator.validateTaxon(x, rangeContext())
		if (problems.isNotEmpty()) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly()
			em.clear() // drop the unvalidated edits from the persistence context too
			return problems
		}
		if (creating) taxa.save(x)
		return emptyList()
	}

	fun deleteTaxon(id: String) {
		val x = taxa.findById(id).orElse(null) ?: return
		x.genus?.sizeDefaults?.remove(id)
		taxa.delete(x)
	}

	@Transactional(readOnly = true)
	fun sources() = sources.findAll().sortedBy { it.id }

	@Transactional(readOnly = true)
	fun sourceForm(id: String) = sources.findById(id).orElse(null)?.let(SourceForm::of)

	fun saveSource(existingId: String?, f: SourceForm): List<Problem> {
		val id = f.id.trim()
		val where = "source $id"
		val problems = mutableListOf<Problem>()
		if (!Regex("^[a-z0-9][a-z0-9-]{1,63}$").matches(id)) problems += Problem(where, "id must be 2–64 lowercase letters, digits or '-'")
		if (f.title.isBlank()) problems += Problem(where, "needs a title")
		f.url.clean()?.let { if (!Regex("^https?://\\S+$").matches(it)) problems += Problem(where, "url must start with http:// or https://") }
		if (existingId == null && sources.existsById(id)) problems += Problem(where, "id already exists")
		if (problems.isNotEmpty()) return problems
		val s = if (existingId == null) Source(id) else sources.findById(existingId).orElse(null) ?: return listOf(Problem(where, "not found"))
		s.title = f.title.trim()
		s.url = f.url.clean()
		sources.save(s)
		return emptyList()
	}

	@Transactional(readOnly = true)
	fun images() = images.findAll().sortedBy { it.file.lowercase() }

	@Transactional(readOnly = true)
	fun imageForm(id: Long) = images.findById(id).orElse(null)?.let(ImageForm::of)

	fun saveImage(existingId: Long?, f: ImageForm): List<Problem> {
		em.flushMode = FlushModeType.COMMIT
		val file = f.file.trim()
		val where = "image $file"
		val problems = mutableListOf<Problem>()
		images.findByFile(file)?.let { other -> if (other.id != existingId) problems += Problem(where, "this file is already registered") }
		val img = if (existingId == null) Image(file) else images.findById(existingId).orElse(null) ?: return listOf(Problem(where, "not found"))
		img.file = file
		img.author = f.author.trim()
		img.license = f.license.trim()
		img.licenseUrl = f.licenseUrl.clean()
		img.white = f.white
		img.alt = f.alt.toText() ?: LocalizedText()
		problems += validator.validateImage("image", img)
		if (problems.isNotEmpty()) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly()
			em.clear() // drop the unvalidated edits from the persistence context too
			return problems
		}
		images.save(img)
		return emptyList()
	}

	private fun resolveSources(where: String, text: String, problems: MutableList<Problem>): List<Source> =
		text.tokens().distinct().mapNotNull { id -> sources.findById(id).orElse(null) ?: null.also { problems += Problem(where, "unknown source '$id'") } }

	private fun range(min: Double?, max: Double?) = if (min == null && max == null) null else SizeRange(min, max)

	private fun <T> MutableList<T>.replace(items: List<T>) {
		clear()
		addAll(items)
	}
}
