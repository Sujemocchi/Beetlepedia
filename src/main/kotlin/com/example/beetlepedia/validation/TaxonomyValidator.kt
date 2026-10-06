package com.example.beetlepedia.validation

import com.example.beetlepedia.domain.Area
import com.example.beetlepedia.domain.Genus
import com.example.beetlepedia.domain.Image
import com.example.beetlepedia.domain.LocalizedText
import com.example.beetlepedia.domain.SizeRange
import com.example.beetlepedia.domain.Taxon
import com.example.beetlepedia.domain.TaxonGroup
import com.example.beetlepedia.domain.TaxonRank
import com.example.beetlepedia.seed.MapGeometry
import jakarta.persistence.Embeddable
import org.springframework.stereotype.Component
import kotlin.reflect.full.memberProperties

/** A rule violation: where it is (e.g. "taxon dynastes-hercules-lichyi") and what is wrong. */
data class Problem(val where: String, val message: String) {
	override fun toString() = "$where: $message"
}

/** What range codes may refer to. */
class RangeContext(val countries: Set<String>, val areas: Map<String, Area>)

/**
 * Data rules for the taxonomy, applied to the seed at start-up and to edits.
 * (Formerly tools/validate-data.js.)
 */
@Component
class TaxonomyValidator(private val geometry: MapGeometry) {

	private val color = Regex("^#[0-9A-Fa-f]{6}$")

	fun validateAll(groups: List<TaxonGroup>, genera: List<Genus>, ctx: RangeContext): List<Problem> {
		val problems = mutableListOf<Problem>()
		groups.forEach { problems += validateGroup(it) }
		genera.forEach { problems += validateGenus(it, ctx) }
		val ids = genera.flatMap { g -> g.taxa.map { it.id } }
		ids.groupingBy { it }.eachCount().filterValues { it > 1 }.keys.forEach { problems += Problem("taxon $it", "duplicate id") }
		val scis = genera.flatMap { g -> g.taxa.map { it.sci } }
		scis.groupingBy { it }.eachCount().filterValues { it > 1 }.keys.forEach { problems += Problem("taxon $it", "duplicate scientific name") }
		ctx.areas.values.forEach { a ->
			val where = "area ${a.code}"
			if (a.name.ko.isNullOrBlank() || a.name.en.isNullOrBlank()) problems += Problem(where, "needs a Korean and an English name")
			a.countries.filterNot { it in ctx.countries }.forEach { problems += Problem(where, "unknown country $it") }
			if ((a.box == null) == (a.point == null)) problems += Problem(where, "needs either a box or a point")
			problems += missingJapanese(where, a.name)
		}
		return problems
	}

	fun validateGroup(g: TaxonGroup): List<Problem> {
		val where = "group ${g.id}"
		val problems = mutableListOf<Problem>()
		if (!color.matches(g.color)) problems += Problem(where, "colour must be #RRGGBB")
		if (g.name.ko.isNullOrBlank() || g.name.en.isNullOrBlank()) problems += Problem(where, "needs a Korean and an English name")
		problems += missingJapanese(where, g)
		return problems
	}

	fun validateGenus(g: Genus, ctx: RangeContext): List<Problem> {
		val where = "genus ${g.id}"
		val problems = mutableListOf<Problem>()
		if (g.group == null) problems += Problem(where, "has no group")
		if (g.mapRegion == null) problems += Problem(where, "has no map")
		else if (geometry.regions[g.mapRegion!!.id] == null) problems += Problem(where, "no map file for region '${g.mapRegion!!.id}'")
		if (!color.matches(g.color)) problems += Problem(where, "colour must be #RRGGBB")
		if (g.name.ko.isNullOrBlank() || g.name.en.isNullOrBlank()) problems += Problem(where, "needs a Korean and an English name")
		if (g.taxa.isEmpty()) problems += Problem(where, "has no taxa")
		g.sizeDefaults.filter { id -> g.taxa.none { it.id == id } }.forEach { problems += Problem(where, "size default '$it' is not a taxon of this genus") }
		listOfNotNull(g.heroImage, g.overviewImage).forEach { problems += validateImage(where, it) }
		problems += missingJapanese(where, g)
		g.weights.forEach { problems += missingJapanese("$where weight", it) }
		g.speciesInfo.forEach { problems += missingJapanese("$where species ${it.speciesSci}", it) }
		g.taxa.forEach { problems += validateTaxon(it, ctx) }
		return problems
	}

	fun validateTaxon(x: Taxon, ctx: RangeContext): List<Problem> {
		val where = "taxon ${x.id.ifBlank { "(no id)" }}"
		val problems = mutableListOf<Problem>()
		val g = x.genus
		if (g == null) {
			problems += Problem(where, "has no genus")
		} else {
			if (!x.id.startsWith(g.id + "-")) problems += Problem(where, "id should start with '${g.id}-'")
			if (!x.sci.startsWith(g.sci + " ")) problems += Problem(where, "scientific name should start with '${g.sci} '")
		}
		val words = x.sci.trim().split(Regex("\\s+")).size
		when (x.rank) {
			TaxonRank.SPECIES -> if (words != 2) problems += Problem(where, "a species needs a binomial name")
			TaxonRank.SUBSPECIES -> {
				if (words != 3) problems += Problem(where, "a subspecies needs a trinomial name")
				if (x.speciesSci.isNullOrBlank()) problems += Problem(where, "a subspecies must name its species")
				else if (!x.sci.startsWith(x.speciesSci + " ")) problems += Problem(where, "name does not start with its species '${x.speciesSci}'")
			}
		}
		if (!color.matches(x.color)) problems += Problem(where, "colour must be #RRGGBB")
		if (x.name.ko.isNullOrBlank() && x.name.en.isNullOrBlank()) problems += Problem(where, "needs a common name")
		x.size.male?.let { if (!it.isValidOrEmpty()) problems += Problem(where, "bad male size ${it.describe()}") }
		x.size.female?.let { if (!it.isValidOrEmpty()) problems += Problem(where, "bad female size ${it.describe()}") }

		if (x.distribution.isEmpty()) problems += Problem(where, "has no distribution")
		x.distribution.forEach { code ->
			when {
				code !in ctx.countries && code !in ctx.areas -> problems += Problem(where, "unknown range code $code")
				g?.mapRegion != null && !geometry.covers(g.mapRegion!!.id, code, ctx.areas) ->
					problems += Problem(where, "range code $code matches nothing on map ${g.mapRegion!!.id}")
			}
		}
		x.images.forEach { problems += validateImage(where, it) }
		problems += missingJapanese(where, x)
		x.issues.forEach { problems += missingJapanese("$where issue", it) }
		return problems
	}

	fun validateImage(owner: String, img: Image): List<Problem> {
		val problems = mutableListOf<Problem>()
		if (img.file.isBlank() || img.author.isBlank() || img.license.isBlank()) problems += Problem(owner, "image ${img.file} needs file, author and licence")
		if (img.licenseUrl.isNullOrBlank()) problems += Problem(owner, "image ${img.file} needs a licence URL")
		if (img.alt.ko.isNullOrBlank() || img.alt.en.isNullOrBlank()) problems += Problem(owner, "image ${img.file} needs Korean and English alt text")
		problems += missingJapanese("$owner image ${img.file}", img.alt)
		return problems
	}

	/**
	 * Every text that has English must have Japanese. Walks [LocalizedText] fields and lists of them,
	 * and embeddables containing them; entity references (genus, images, sources …) are checked on their own.
	 */
	fun missingJapanese(where: String, root: Any): List<Problem> {
		val problems = mutableListOf<Problem>()
		fun check(path: String, t: LocalizedText) {
			if (!t.en.isNullOrBlank() && t.ja.isNullOrBlank()) problems += Problem(where, "missing Japanese for $path: \"${t.en!!.take(60)}\"")
		}
		fun walk(path: String, value: Any?) {
			when (value) {
				null -> {}
				is LocalizedText -> check(path, value)
				is List<*> -> value.forEachIndexed { i, v -> if (v is LocalizedText || v?.isEmbeddable() == true) walk("$path[$i]", v) }
				else -> if (value.isEmbeddable()) properties(value).forEach { (n, v) -> walk("$path.$n", v) }
			}
		}
		if (root is LocalizedText) check("text", root) else properties(root).forEach { (n, v) -> walk(n, v) }
		return problems
	}

	private fun Any.isEmbeddable() = this::class.java.isAnnotationPresent(Embeddable::class.java)

	private fun properties(o: Any): List<Pair<String, Any?>> =
		o::class.memberProperties.map { p -> p.name to runCatching { p.getter.call(o) }.getOrNull() }

	private fun SizeRange.isValidOrEmpty() = (min == null && max == null) || isValid()
	private fun SizeRange.describe() = "[${min ?: "null"}, ${max ?: "null"}]"
}
