package com.example.beetlepedia.api

import com.example.beetlepedia.domain.Area
import com.example.beetlepedia.domain.BaseRank
import com.example.beetlepedia.domain.Genus
import com.example.beetlepedia.domain.Image
import com.example.beetlepedia.domain.LocalizedText
import com.example.beetlepedia.domain.RankEntry
import com.example.beetlepedia.domain.SizeRange
import com.example.beetlepedia.domain.Source
import com.example.beetlepedia.domain.Taxon
import com.example.beetlepedia.domain.TaxonGroup
import com.example.beetlepedia.domain.TaxonRank
import org.springframework.stereotype.Component

/**
 * Entity → response mapping. Must run inside a transaction (lazy collections).
 * Empty optional lists become null where the pages treat "missing" as "use the default"
 * (hero stats, size defaults, species info, subspecies).
 */
@Component
class ApiMapper {

	fun text(t: LocalizedText?): TextDto? = t?.takeUnless { it.isEmpty() }?.let { TextDto(it.ko, it.en, it.ja) }
	private fun textOrEmpty(t: LocalizedText?) = text(t) ?: TextDto(null, null, null)
	private fun <T> List<T>.orNullIfEmpty() = ifEmpty { null }
	private fun ids(sources: List<Source>) = sources.map { it.id }

	fun rank(r: RankEntry) = RankDto(textOrEmpty(r.rank), r.name, text(r.common))
	fun rank(r: BaseRank) = RankDto(textOrEmpty(r.rank), r.name, text(r.common))
	fun source(s: Source) = SourceDto(s.title, s.url)

	fun image(i: Image) = ImageDto(i.file, i.author, i.license, i.licenseUrl, i.white, textOrEmpty(i.alt), i.cutout)

	fun area(a: Area) = AreaDto(
		name = textOrEmpty(a.name),
		countries = a.countries.toList(),
		box = a.box?.let { listOf(it.lonMin, it.latMin, it.lonMax, it.latMax) },
		exclude = a.excludes.map { listOf(it.lonMin, it.latMin, it.lonMax, it.latMax) }.orNullIfEmpty(),
		point = a.point?.let { listOf(it.lon, it.lat) },
	)

	fun group(g: TaxonGroup) = GroupDto(
		id = g.id, sci = g.sci, authority = g.authority, color = g.color,
		name = textOrEmpty(g.name), lead = text(g.lead), body = text(g.body),
		taxonomy = g.ranks.map(::rank), sources = ids(g.sources),
	)

	fun genus(g: Genus) = GenusDto(
		id = g.id,
		group = g.group!!.id,
		sci = g.sci,
		authority = g.authority,
		map = g.mapRegion!!.id,
		color = g.color,
		name = textOrEmpty(g.name),
		shortName = text(g.shortName),
		taxonomy = g.ranks.map(::rank),
		eyebrow = text(g.eyebrow),
		lead = text(g.lead),
		heroStats = g.heroStats.map { HeroStatDto(it.figure, it.unit, textOrEmpty(it.label)) }.orNullIfEmpty(),
		speciesInfo = g.speciesInfo.associate { it.speciesSci to SpeciesInfoDto(it.authority, text(it.name), text(it.text), ids(it.sources)) }
			.ifEmpty { null },
		overview = OverviewDto(
			text(g.overviewKicker), text(g.overviewBody),
			g.overviewCards.map { CardDto(textOrEmpty(it.title), textOrEmpty(it.text)) }, text(g.speciesNote),
		),
		lifecycle = LifecycleDto(
			text(g.lifecycleLead),
			g.lifecycleStages.map { StageDto(it.stage, textOrEmpty(it.title), textOrEmpty(it.time), textOrEmpty(it.text)) },
		),
		conservation = text(g.conservation),
		care = g.care.map(::textOrEmpty),
		facts = g.facts.map(::textOrEmpty),
		defaults = DefaultsDto(text(g.dimorphism), text(g.food), text(g.season)),
		latin = g.latinTerms.toList(),
		images = GenusImagesDto(g.heroImage?.let(::image), g.overviewImage?.let(::image)),
		sizeDefaults = g.sizeDefaults.toList().orNullIfEmpty(),
		sources = g.sources.associate { it.id to source(it) },
	)

	private fun range(r: SizeRange?): List<Double?>? = r?.takeIf { it.max != null }?.let { listOf(it.min, it.max) }

	fun rankName(r: TaxonRank) = r.name.lowercase()

	fun taxon(x: Taxon): TaxonDto {
		val g = x.genus!!
		return TaxonDto(
			id = x.id,
			rank = rankName(x.rank),
			sci = x.sci,
			species = x.speciesSci,
			authority = x.authority,
			year = x.describedYear,
			color = x.color,
			genus = g.id,
			group = g.group!!.id,
			name = textOrEmpty(x.name),
			nameInformal = FlagsDto(x.nameInformal.ko, x.nameInformal.en, x.nameInformal.ja),
			nameNote = text(x.nameNote),
			subspecies = x.subspecies.map { SubspeciesDto(it.sci, it.authority, text(it.note)) }.orNullIfEmpty(),
			size = SizeDto(range(x.size.male), range(x.size.female), text(x.size.note), ids(x.sizeSources)),
			pattern = text(x.pattern),
			morphology = text(x.morphology),
			distribution = x.distribution.toList(),
			distributionNote = text(x.distributionNote),
			habitat = text(x.habitat),
			ecology = text(x.ecology),
			captivityNote = text(x.captivityNote),
			dimorphism = text(x.dimorphism),
			food = text(x.food),
			season = text(x.season),
			conservation = ConservationDto(text(x.conservationStatus), text(x.conservationText)),
			facts = x.facts.map(::textOrEmpty),
			history = x.history.map { HistoryDto(it.year, it.text.ko, it.text.en, it.text.ja) },
			issues = x.issues.map { IssueDto(text(it.title), textOrEmpty(it.text), ids(it.sources)) },
			images = x.images.map(::image),
			model3d = x.model3d?.takeIf { it.modelId != null || it.url != null }?.let { Model3dDto(it.modelId, it.url, it.author, it.license) },
			sources = ids(x.sources),
		)
	}

	/**
	 * A taxon as listed on the home and group pages and in other genera's references:
	 * names, sizes, range and the first photo — none of the long texts.
	 */
	fun taxonLite(x: Taxon): TaxonDto {
		val g = x.genus!!
		return TaxonDto(
			id = x.id, rank = rankName(x.rank), sci = x.sci, species = x.speciesSci, authority = x.authority,
			year = x.describedYear, color = x.color, genus = g.id, group = g.group!!.id,
			name = textOrEmpty(x.name),
			nameInformal = FlagsDto(x.nameInformal.ko, x.nameInformal.en, x.nameInformal.ja),
			nameNote = null,
			subspecies = x.subspecies.map { SubspeciesDto(it.sci, it.authority, null) }.orNullIfEmpty(),
			size = SizeDto(range(x.size.male), range(x.size.female), null, emptyList()),
			pattern = null, morphology = null,
			distribution = x.distribution.toList(),
			distributionNote = null, habitat = null, ecology = null, captivityNote = null,
			dimorphism = null, food = null, season = null,
			conservation = ConservationDto(text(x.conservationStatus), null),
			facts = emptyList(), history = emptyList(), issues = emptyList(),
			images = x.images.take(1).map(::image),
			model3d = null,
			sources = emptyList(),
		)
	}

	/** A genus as needed by cards, the tree and Latin-name highlighting on other pages. */
	fun genusLite(g: Genus) = GenusDto(
		id = g.id, group = g.group!!.id, sci = g.sci, authority = g.authority, map = g.mapRegion!!.id, color = g.color,
		name = textOrEmpty(g.name), shortName = text(g.shortName),
		taxonomy = g.ranks.map(::rank),
		eyebrow = null, lead = text(g.lead), heroStats = null,
		speciesInfo = g.speciesInfo.associate { it.speciesSci to SpeciesInfoDto(it.authority, text(it.name), null, emptyList()) }.ifEmpty { null },
		overview = OverviewDto(null, null, emptyList(), null),
		lifecycle = LifecycleDto(null, emptyList()),
		conservation = null, care = emptyList(), facts = emptyList(),
		defaults = DefaultsDto(null, null, null),
		latin = g.latinTerms.toList(),
		images = GenusImagesDto(g.heroImage?.let(::image), null),
		sizeDefaults = null,
		sources = emptyMap(),
	)

	fun summary(x: Taxon) = TaxonSummaryDto(
		id = x.id,
		rank = rankName(x.rank),
		sci = x.sci,
		authority = x.authority,
		color = x.color,
		genus = x.genus!!.id,
		group = x.genus!!.group!!.id,
		name = textOrEmpty(x.name),
		male = range(x.size.male),
		distribution = x.distribution.toList(),
		image = x.images.firstOrNull()?.let(::image),
	)

	fun genusSummary(g: Genus) = GenusSummaryDto(
		id = g.id,
		group = g.group!!.id,
		sci = g.sci,
		authority = g.authority,
		color = g.color,
		name = textOrEmpty(g.name),
		map = g.mapRegion!!.id,
		taxa = g.taxa.size,
		maxMale = g.taxa.mapNotNull { it.size.male?.max }.maxOrNull(),
		image = g.heroImage?.let(::image),
	)
}
