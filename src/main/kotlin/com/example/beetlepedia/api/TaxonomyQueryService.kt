package com.example.beetlepedia.api

import com.example.beetlepedia.domain.Taxon
import com.example.beetlepedia.domain.TaxonRank
import com.example.beetlepedia.repository.AreaRepository
import com.example.beetlepedia.repository.BaseRankRepository
import com.example.beetlepedia.repository.CountryRepository
import com.example.beetlepedia.repository.GenusRepository
import com.example.beetlepedia.repository.MapRegionRepository
import com.example.beetlepedia.repository.SourceRepository
import com.example.beetlepedia.repository.TaxonGroupRepository
import com.example.beetlepedia.repository.TaxonRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.text.Normalizer

class NotFoundException(what: String, id: String) : RuntimeException("$what '$id' not found")

/** How much of the taxonomy /api/bootstrap returns in full. */
sealed interface BootstrapScope {
	data object All : BootstrapScope
	data object Summary : BootstrapScope
	data class Genus(val id: String) : BootstrapScope
	/** The genus of this taxon. */
	data class Taxon(val id: String) : BootstrapScope
}

/** Filters for [TaxonomyQueryService.search]; every field is optional. */
data class TaxonSearch(
	/** Matches scientific name (also abbreviated, e.g. "D. h. lichyi"), common names in any language and genus names. */
	val q: String? = null,
	val group: String? = null,
	val genus: String? = null,
	/** "species" or "subspecies" */
	val rank: String? = null,
	/** Maximum male body length (mm) at least / at most this. */
	val minLength: Double? = null,
	val maxLength: Double? = null,
	/** ISO-3 code; matches taxa listed in the country or in an area that lies in it. */
	val country: String? = null,
	val hasImage: Boolean? = null,
)

@Service
@Transactional(readOnly = true)
class TaxonomyQueryService(
	private val groups: TaxonGroupRepository,
	private val genera: GenusRepository,
	private val taxa: TaxonRepository,
	private val sources: SourceRepository,
	private val countries: CountryRepository,
	private val areas: AreaRepository,
	private val maps: MapRegionRepository,
	private val baseRanks: BaseRankRepository,
	private val mapper: ApiMapper,
) {

	/**
	 * Page data in the shape of window.BP.
	 * - [BootstrapScope.All]: everything in full.
	 * - [BootstrapScope.Summary]: home and group pages — every genus and taxon without long texts.
	 * - [BootstrapScope.Genus]: genus and taxon pages — one genus and its taxa in full, the rest summarised,
	 *   and only the sources that genus cites.
	 */
	fun bootstrap(scope: BootstrapScope = BootstrapScope.All): BootstrapDto {
		val focus: String? = when (scope) {
			is BootstrapScope.Genus -> scope.id.also { if (!genera.existsById(it)) throw NotFoundException("genus", it) }
			is BootstrapScope.Taxon -> taxa.findById(scope.id).orElseThrow { NotFoundException("taxon", scope.id) }.genus!!.id
			else -> null
		}
		fun full(genusId: String) = scope == BootstrapScope.All || genusId == focus
		val groupList = groups.findAllByOrderBySortOrder()
		val genusList = genera.findAllByOrderBySortOrder()
		val taxonList = orderedTaxa()

		val sourceMap = when {
			scope == BootstrapScope.All -> sources.findAll()
			else -> {
				val ids = linkedSetOf<String>()
				groupList.forEach { g -> g.sources.forEach { ids += it.id } }
				genusList.filter { full(it.id) }.forEach { g ->
					g.sources.forEach { ids += it.id }
					g.speciesInfo.forEach { s -> s.sources.forEach { ids += it.id } }
				}
				taxonList.filter { full(it.genus!!.id) }.forEach { x ->
					(x.sources + x.sizeSources + x.issues.flatMap { it.sources }).forEach { ids += it.id }
				}
				sources.findAllById(ids)
			}
		}
		return BootstrapDto(
			baseTaxonomy = baseRanks.findAllByOrderByPosition().map(mapper::rank),
			groups = groupList.map(mapper::group),
			genera = genusList.map { if (full(it.id)) mapper.genus(it) else mapper.genusLite(it) },
			taxa = taxonList.map { if (full(it.genus!!.id)) mapper.taxon(it) else mapper.taxonLite(it) },
			countries = countries.findAll().sortedBy { it.code }.associate { it.code to mapper.text(it.name)!! },
			areas = areas.findAll().sortedBy { it.code }.associate { it.code to mapper.area(it) },
			sources = sourceMap.sortedBy { it.id }.associate { it.id to mapper.source(it) },
			maps = maps.findAll().sortedBy { it.id }.associate { it.id to MapDto(mapper.text(it.name)!!) },
		)
	}

	fun groups() = groups.findAllByOrderBySortOrder().map { g ->
		GroupDetailDto(mapper.group(g), genera.findAllByGroupIdOrderBySortOrder(g.id).map(mapper::genusSummary))
	}

	fun group(id: String): GroupDetailDto {
		val g = groups.findById(id).orElseThrow { NotFoundException("group", id) }
		return GroupDetailDto(mapper.group(g), genera.findAllByGroupIdOrderBySortOrder(id).map(mapper::genusSummary))
	}

	fun genera() = genera.findAllByOrderBySortOrder().map(mapper::genusSummary)

	fun genus(id: String): GenusDetailDto {
		val g = genera.findById(id).orElseThrow { NotFoundException("genus", id) }
		return GenusDetailDto(mapper.genus(g), taxa.findAllByGenusIdOrderBySortOrder(id).map(mapper::taxon))
	}

	fun taxon(id: String): TaxonDto = mapper.taxon(taxa.findById(id).orElseThrow { NotFoundException("taxon", id) })

	fun search(s: TaxonSearch): SearchResultDto {
		val rank = s.rank?.let { r ->
			TaxonRank.entries.firstOrNull { it.name.equals(r, ignoreCase = true) }
				?: throw IllegalArgumentException("rank must be 'species' or 'subspecies'")
		}
		val countryAreas = s.country?.let { c -> areas.findAll().filter { c in it.countries }.map { it.code }.toSet() + c }
		val query = s.q?.let(::normalize)?.takeIf { it.isNotBlank() }
		val hits = orderedTaxa().filter { x ->
			(s.group == null || x.genus!!.group!!.id == s.group) &&
				(s.genus == null || x.genus!!.id == s.genus) &&
				(rank == null || x.rank == rank) &&
				(s.minLength == null || (x.size.male?.max ?: -1.0) >= s.minLength) &&
				(s.maxLength == null || (x.size.male?.max ?: Double.MAX_VALUE) <= s.maxLength) &&
				(countryAreas == null || x.distribution.any { it in countryAreas }) &&
				(s.hasImage == null || x.images.isNotEmpty() == s.hasImage) &&
				(query == null || haystack(x).contains(query))
		}
		return SearchResultDto(hits.size, hits.map(mapper::summary))
	}

	/** Taxa in display order: by genus, then within the genus. */
	private fun orderedTaxa(): List<Taxon> =
		genera.findAllByOrderBySortOrder().flatMap { taxa.findAllByGenusIdOrderBySortOrder(it.id) }

	private fun haystack(x: Taxon): String {
		val g = x.genus!!
		val parts = listOf(
			x.sci, abbreviate(x.sci), x.speciesSci, x.name.ko, x.name.en, x.name.ja,
			g.sci, g.name.ko, g.name.en, g.name.ja,
		)
		return normalize(parts.filterNotNull().joinToString(" "))
	}

	/** "Dynastes hercules lichyi" → "D. h. lichyi" */
	private fun abbreviate(sci: String): String {
		val w = sci.split(" ")
		return w.mapIndexed { i, s -> if (i < w.size - 1) s.first() + "." else s }.joinToString(" ")
	}

	// Case-insensitive, and full-/half-width insensitive for Japanese input.
	private fun normalize(s: String) = Normalizer.normalize(s, Normalizer.Form.NFKC).lowercase().replace(Regex("\\s+"), " ")
}
