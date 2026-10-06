package com.example.beetlepedia.seed

import com.example.beetlepedia.domain.Area
import com.example.beetlepedia.domain.Genus
import com.example.beetlepedia.domain.Image
import com.example.beetlepedia.domain.LocalizedText
import com.example.beetlepedia.domain.RankEntry
import com.example.beetlepedia.domain.SizeRange
import com.example.beetlepedia.domain.Source
import com.example.beetlepedia.domain.Taxon
import com.example.beetlepedia.domain.TaxonRank
import com.example.beetlepedia.repository.AreaRepository
import com.example.beetlepedia.repository.BaseRankRepository
import com.example.beetlepedia.repository.CountryRepository
import com.example.beetlepedia.repository.GenusRepository
import com.example.beetlepedia.repository.MapRegionRepository
import com.example.beetlepedia.repository.SourceRepository
import com.example.beetlepedia.repository.TaxonGroupRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import tools.jackson.databind.SerializationFeature
import tools.jackson.databind.json.JsonMapper
import tools.jackson.module.kotlin.KotlinModule
import java.io.ByteArrayOutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

/** The database written back as seed files: core.json + genera/<id>.json. */
data class SeedFiles(val core: CoreSeed, val genera: List<GenusSeed>)

/**
 * Exports the database in the seed format, so edits made in the admin screen can be
 * committed to src/main/resources/seed. The inverse of [SeedImporter].
 */
@Component
class SeedExporter(
	private val groups: TaxonGroupRepository,
	private val genera: GenusRepository,
	private val sources: SourceRepository,
	private val countries: CountryRepository,
	private val areas: AreaRepository,
	private val maps: MapRegionRepository,
	private val baseRanks: BaseRankRepository,
) {

	private val json = JsonMapper.builder()
		.addModule(KotlinModule.Builder().build())
		.enable(SerializationFeature.INDENT_OUTPUT)
		.build()

	@Transactional(readOnly = true)
	fun export(): SeedFiles {
		val genusList = genera.findAllByOrderBySortOrder()
		val allAreas = areas.findAll().sortedBy { it.code }
		// Areas are not tied to a genus in the database: give each to the first genus that uses it.
		val areaOwner = allAreas.associate { a ->
			a.code to genusList.firstOrNull { g -> g.taxa.any { a.code in it.distribution } }?.id
		}
		val genusSourceIds = genusList.flatMap { g -> g.sources.map { it.id } }.toSet()

		val core = CoreSeed(
			baseTaxonomy = baseRanks.findAllByOrderByPosition().map { RankSeed(text(it.rank)!!, it.name, text(it.common)) },
			groups = groups.findAllByOrderBySortOrder().map { g ->
				GroupSeed(g.id, g.sci, g.authority, g.color, text(g.name)!!, g.ranks.map(::rank), text(g.lead), text(g.body), g.sources.map { it.id })
			},
			countries = countries.findAll().sortedBy { it.code }.associate { it.code to text(it.name)!! },
			maps = maps.findAll().sortedBy { it.id }.associate { it.id to MapSeed(text(it.name)!!) },
			sources = sources.findAll().filter { it.id !in genusSourceIds }.sortedBy { it.id }.associate { it.id to source(it) },
			areas = allAreas.filter { areaOwner[it.code] == null }.associate { it.code to area(it) },
		)
		val generaSeed = genusList.map { g ->
			genus(g, allAreas.filter { areaOwner[it.code] == g.id }.associate { it.code to area(it) })
		}
		return SeedFiles(core, generaSeed)
	}

	/** The export as a zip: core.json and genera/<id>.json, ready to unpack into src/main/resources/seed. */
	@Transactional(readOnly = true)
	fun exportZip(): ByteArray {
		val files = export()
		val out = ByteArrayOutputStream()
		ZipOutputStream(out).use { zip ->
			fun put(name: String, value: Any) {
				zip.putNextEntry(ZipEntry(name))
				zip.write(json.writeValueAsBytes(value))
				zip.write('\n'.code)
				zip.closeEntry()
			}
			put("core.json", files.core)
			files.genera.forEach { put("genera/${it.id}.json", it) }
		}
		return out.toByteArray()
	}

	fun toJson(value: Any): String = json.writeValueAsString(value)

	private fun genus(g: Genus, ownAreas: Map<String, AreaSeed>) = GenusSeed(
		id = g.id,
		group = g.group!!.id,
		sci = g.sci,
		authority = g.authority,
		map = g.mapRegion!!.id,
		color = g.color,
		sortOrder = g.sortOrder,
		name = text(g.name)!!,
		shortName = text(g.shortName),
		taxonomy = g.ranks.map(::rank),
		eyebrow = text(g.eyebrow),
		lead = text(g.lead),
		heroStats = g.heroStats.map { HeroStatSeed(it.figure, it.unit, text(it.label)!!) },
		speciesInfo = g.speciesInfo.associate { it.speciesSci to SpeciesInfoSeed(it.authority, text(it.name), text(it.text), it.sources.map(Source::id)) },
		overview = OverviewSeed(
			text(g.overviewKicker), text(g.overviewBody),
			g.overviewCards.map { CardSeed(text(it.title)!!, text(it.text)!!) }, text(g.speciesNote),
		),
		lifecycle = LifecycleSeed(
			text(g.lifecycleLead),
			g.lifecycleStages.map { StageSeed(it.stage, text(it.title)!!, text(it.time)!!, text(it.text)!!) },
		),
		conservation = text(g.conservation),
		care = g.care.map { text(it)!! },
		facts = g.facts.map { text(it)!! },
		defaults = DefaultsSeed(text(g.dimorphism), text(g.food), text(g.season)),
		weights = if (g.weights.isEmpty() && g.weightsNote == null) null else WeightsSeed(
			text(g.weightsNote),
			g.weights.map {
				WeightItemSeed(text(it.label)!!, it.grams, it.approx, it.estimate, it.reported, it.plus, text(it.note), it.color, it.sources.map(Source::id))
			},
		),
		latin = g.latinTerms.toList(),
		images = if (g.heroImage == null && g.overviewImage == null) null
			else GenusImagesSeed(g.heroImage?.let(::image), g.overviewImage?.let(::image)),
		sizeDefaults = g.sizeDefaults.toList(),
		taxa = g.taxa.sortedBy { it.sortOrder }.map(::taxon),
		sources = g.sources.associate { it.id to source(it) },
		areas = ownAreas,
	)

	private fun taxon(x: Taxon) = TaxonSeed(
		id = x.id,
		rank = if (x.rank == TaxonRank.SUBSPECIES) "subspecies" else "species",
		sci = x.sci,
		species = x.speciesSci,
		authority = x.authority,
		year = x.describedYear,
		color = x.color,
		name = text(x.name) ?: TextSeed(),
		nameInformal = x.nameInformal.takeIf { it.ko || it.en || it.ja }?.let { FlagsSeed(it.ko, it.en, it.ja) },
		nameNote = text(x.nameNote),
		subspecies = x.subspecies.map { SubspeciesSeed(it.sci, it.authority, text(it.note)) },
		size = SizeSeed(range(x.size.male), range(x.size.female), text(x.size.note), x.sizeSources.map(Source::id)),
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
		conservation = ConservationSeed(text(x.conservationStatus), text(x.conservationText)),
		facts = x.facts.map { text(it)!! },
		history = x.history.map { HistorySeed(it.year, it.text.ko, it.text.en, it.text.ja) },
		issues = x.issues.map { IssueSeed(text(it.title), text(it.text)!!, it.sources.map(Source::id)) },
		images = x.images.map(::image),
		model3d = x.model3d?.takeIf { it.modelId != null || it.url != null }?.let { Model3dSeed(it.modelId, it.url, it.author, it.license) },
		sources = x.sources.map(Source::id),
	)

	private fun text(t: LocalizedText?) = t?.takeUnless { it.isEmpty() }?.let { TextSeed(it.ko, it.en, it.ja) }
	private fun rank(r: RankEntry) = RankSeed(text(r.rank)!!, r.name, text(r.common))
	private fun source(s: Source) = SourceSeed(s.title, s.url)
	private fun image(i: Image) = ImageSeed(i.file, i.author, i.license, i.licenseUrl, i.white, text(i.alt) ?: TextSeed())
	private fun range(r: SizeRange?): List<Double?>? = r?.takeIf { it.max != null }?.let { listOf(it.min, it.max) }
	private fun area(a: Area) = AreaSeed(
		name = text(a.name)!!,
		countries = a.countries.toList(),
		box = a.box?.let { listOf(it.lonMin, it.latMin, it.lonMax, it.latMax) },
		exclude = a.excludes.map { listOf(it.lonMin, it.latMin, it.lonMax, it.latMax) },
		point = a.point?.let { listOf(it.lon, it.lat) },
	)
}
