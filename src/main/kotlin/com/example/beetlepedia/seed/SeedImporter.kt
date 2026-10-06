package com.example.beetlepedia.seed

import com.example.beetlepedia.domain.Area
import com.example.beetlepedia.domain.BaseRank
import com.example.beetlepedia.domain.Card
import com.example.beetlepedia.domain.Country
import com.example.beetlepedia.domain.GeoBox
import com.example.beetlepedia.domain.GeoPoint
import com.example.beetlepedia.domain.Genus
import com.example.beetlepedia.domain.GenusWeight
import com.example.beetlepedia.domain.HeroStat
import com.example.beetlepedia.domain.HistoryEntry
import com.example.beetlepedia.domain.Image
import com.example.beetlepedia.domain.LanguageFlags
import com.example.beetlepedia.domain.LifecycleStage
import com.example.beetlepedia.domain.LocalizedText
import com.example.beetlepedia.domain.MapRegion
import com.example.beetlepedia.domain.Model3d
import com.example.beetlepedia.domain.RankEntry
import com.example.beetlepedia.domain.SizeInfo
import com.example.beetlepedia.domain.SizeRange
import com.example.beetlepedia.domain.Source
import com.example.beetlepedia.domain.SpeciesInfo
import com.example.beetlepedia.domain.SubspeciesNote
import com.example.beetlepedia.domain.Taxon
import com.example.beetlepedia.domain.TaxonGroup
import com.example.beetlepedia.domain.TaxonIssue
import com.example.beetlepedia.domain.TaxonRank
import com.example.beetlepedia.validation.Problem
import org.springframework.core.io.support.PathMatchingResourcePatternResolver
import org.springframework.stereotype.Component
import tools.jackson.databind.DeserializationFeature
import tools.jackson.databind.json.JsonMapper
import tools.jackson.module.kotlin.KotlinModule
import tools.jackson.module.kotlin.readValue

/** Everything read from the seed, as unsaved entities, plus any problems found while linking it. */
class SeedGraph(
	val sources: Map<String, Source>,
	val images: Map<String, Image>,
	val countries: Map<String, Country>,
	val maps: Map<String, MapRegion>,
	val areas: Map<String, Area>,
	val baseRanks: List<BaseRank>,
	val groups: List<TaxonGroup>,
	val genera: List<Genus>,
	val problems: List<Problem>,
) {
	val taxa: List<Taxon> get() = genera.flatMap { it.taxa }
}

/** Reads src/main/resources/seed and converts it into entities. */
@Component
class SeedImporter {

	// Strict: a misspelt field in the seed should fail loudly rather than be dropped.
	private val json = JsonMapper.builder()
		.addModule(KotlinModule.Builder().build())
		.enable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
		.build()

	fun readCore(): CoreSeed =
		PathMatchingResourcePatternResolver().getResource("classpath:seed/core.json").inputStream.use { json.readValue(it) }

	fun readGenera(): List<GenusSeed> =
		PathMatchingResourcePatternResolver().getResources("classpath:seed/genera/*.json")
			.map { res -> res.inputStream.use { json.readValue<GenusSeed>(it) } }
			.sortedBy { it.sortOrder }

	fun read(): SeedGraph = build(readCore(), readGenera())

	fun build(core: CoreSeed, generaSeed: List<GenusSeed>): SeedGraph {
		val problems = mutableListOf<Problem>()

		// ---- sources: shared ids must mean the same reference ----
		val sources = linkedMapOf<String, Source>()
		fun addSources(owner: String, map: Map<String, SourceSeed>) = map.forEach { (id, s) ->
			val existing = sources[id]
			if (existing != null && (existing.title != s.title || existing.url != s.url)) {
				problems += Problem(owner, "source '$id' is defined twice with different contents")
			} else {
				sources[id] = Source(id, s.title, s.url)
			}
		}
		addSources("core", core.sources)
		generaSeed.forEach { addSources("genus ${it.id}", it.sources) }
		fun src(owner: String, ids: List<String>): MutableList<Source> = ids.mapNotNullTo(mutableListOf()) { id ->
			sources[id] ?: null.also { problems += Problem(owner, "unknown source '$id'") }
		}

		// ---- images: one row per file, shared by every taxon / genus that shows it ----
		val images = linkedMapOf<String, Image>()
		fun image(owner: String, s: ImageSeed): Image {
			images[s.file]?.let { existing ->
				if (existing.author != s.author || existing.license != s.license) {
					problems += Problem(owner, "image '${s.file}' appears with different author or licence")
				}
				return existing
			}
			return Image(s.file, s.author, s.license, s.licenseUrl, s.white, s.alt.toText()).also { images[s.file] = it }
		}

		val countries = core.countries.mapValuesTo(linkedMapOf()) { (code, name) -> Country(code, name.toText()) }
		val maps = core.maps.mapValuesTo(linkedMapOf()) { (id, m) -> MapRegion(id, m.name.toText()) }
		val baseRanks = core.baseTaxonomy.mapIndexed { i, r -> BaseRank(i, r.rank.toText(), r.name, r.common?.toText()) }

		val areas = linkedMapOf<String, Area>()
		generaSeed.forEach { g ->
			g.areas.forEach { (code, a) ->
				if (code in areas) problems += Problem("genus ${g.id}", "area '$code' is defined by more than one genus")
				areas[code] = Area(code, a.name.toText(), a.box?.toBox(), a.point?.let { GeoPoint(it[0], it[1]) }).apply {
					this.countries.addAll(a.countries)
					excludes.addAll(a.exclude.map { it.toBox() })
				}
			}
		}

		val groups = core.groups.mapIndexed { i, g ->
			TaxonGroup(g.id, g.sci, g.authority, g.color, i, g.name.toText(), g.lead.toTextOrEmpty(), g.body.toTextOrEmpty()).apply {
				ranks.addAll(g.taxonomy.map { it.toRank() })
				this.sources.addAll(src("group ${g.id}", g.sources))
			}
		}
		val groupsById = groups.associateBy { it.id }

		val genera = generaSeed.map { g ->
			val where = "genus ${g.id}"
			Genus(
				id = g.id,
				group = groupsById[g.group] ?: null.also { problems += Problem(where, "unknown group '${g.group}'") },
				sci = g.sci,
				authority = g.authority,
				mapRegion = maps[g.map] ?: null.also { problems += Problem(where, "unknown map '${g.map}'") },
				color = g.color,
				sortOrder = g.sortOrder,
				name = g.name.toText(),
				shortName = g.shortName?.toText(),
				eyebrow = g.eyebrow?.toText(),
				lead = g.lead?.toText(),
				overviewKicker = g.overview?.kicker?.toText(),
				overviewBody = g.overview?.body?.toText(),
				speciesNote = g.overview?.speciesNote?.toText(),
				lifecycleLead = g.lifecycle?.lead?.toText(),
				conservation = g.conservation?.toText(),
				weightsNote = g.weights?.note?.toText(),
				dimorphism = g.defaults?.dimorphism?.toText(),
				food = g.defaults?.food?.toText(),
				season = g.defaults?.season?.toText(),
				heroImage = g.images?.hero?.let { image(where, it) },
				overviewImage = g.images?.overview?.let { image(where, it) },
			).apply {
				ranks.addAll(g.taxonomy.map { it.toRank() })
				heroStats.addAll(g.heroStats.map { HeroStat(it.value, it.unit, it.label.toText()) })
				overviewCards.addAll(g.overview?.cards.orEmpty().map { Card(it.title.toText(), it.text.toText()) })
				lifecycleStages.addAll(g.lifecycle?.stages.orEmpty().map { LifecycleStage(it.stage, it.title.toText(), it.time.toText(), it.text.toText()) })
				care.addAll(g.care.map { it.toText() })
				facts.addAll(g.facts.map { it.toText() })
				latinTerms.addAll(g.latin)
				sizeDefaults.addAll(g.sizeDefaults)
				g.weights?.items.orEmpty().forEach { w ->
					addWeight(GenusWeight(w.label.toText(), w.value, w.note?.toText(), w.color, w.approx, w.plus, w.estimate, w.reported))
						.sources.addAll(src("$where weight", w.sources))
				}
				g.speciesInfo.forEach { (sci, s) ->
					addSpeciesInfo(SpeciesInfo(sci, s.authority, s.name?.toText(), s.text?.toText())).sources.addAll(src("$where species $sci", s.sources))
				}
				this.sources.addAll(src(where, g.sources.keys.toList()))
				g.taxa.forEachIndexed { i, t -> taxa.add(taxon(this, i, t, ::image, ::src, problems)) }
			}
		}

		return SeedGraph(sources, images, countries, maps, areas, baseRanks, groups, genera, problems)
	}

	private fun taxon(
		genus: Genus,
		index: Int,
		t: TaxonSeed,
		image: (String, ImageSeed) -> Image,
		src: (String, List<String>) -> MutableList<Source>,
		problems: MutableList<Problem>,
	): Taxon {
		val where = "taxon ${t.id}"
		val rank = when (t.rank) {
			"species" -> TaxonRank.SPECIES
			"subspecies" -> TaxonRank.SUBSPECIES
			else -> TaxonRank.SPECIES.also { problems += Problem(where, "unknown rank '${t.rank}'") }
		}
		return Taxon(
			id = t.id,
			genus = genus,
			rank = rank,
			sci = t.sci,
			speciesSci = t.species,
			authority = t.authority,
			describedYear = t.year,
			color = t.color,
			sortOrder = index,
			name = t.name.toText(),
			nameInformal = t.nameInformal?.let { LanguageFlags(it.ko, it.en, it.ja) } ?: LanguageFlags(),
			nameNote = t.nameNote?.toText(),
			size = SizeInfo(t.size?.male?.toRange(), t.size?.female?.toRange(), t.size?.note?.toText()),
			pattern = t.pattern?.toText(),
			morphology = t.morphology?.toText(),
			distributionNote = t.distributionNote?.toText(),
			habitat = t.habitat?.toText(),
			ecology = t.ecology?.toText(),
			captivityNote = t.captivityNote?.toText(),
			dimorphism = t.dimorphism?.toText(),
			food = t.food?.toText(),
			season = t.season?.toText(),
			conservationStatus = t.conservation?.status?.toText(),
			conservationText = t.conservation?.text?.toText(),
			model3d = t.model3d?.let { Model3d(it.id, it.url, it.author, it.license) },
		).apply {
			distribution.addAll(t.distribution)
			subspecies.addAll(t.subspecies.map { SubspeciesNote(it.sci, it.authority, it.note?.toText()) })
			history.addAll(t.history.map { HistoryEntry(it.year, LocalizedText(it.ko, it.en, it.ja)) })
			facts.addAll(t.facts.map { it.toText() })
			t.issues.forEach { i -> addIssue(TaxonIssue(i.title?.toText(), i.text.toText())).sources.addAll(src("$where issue", i.sources)) }
			images.addAll(t.images.map { image(where, it) })
			sizeSources.addAll(src("$where size", t.size?.sources.orEmpty()))
			sources.addAll(src(where, t.sources))
		}
	}

	private fun TextSeed.toText() = LocalizedText(ko, en, ja)
	private fun TextSeed?.toTextOrEmpty() = this?.toText() ?: LocalizedText()
	private fun RankSeed.toRank() = RankEntry(rank.toText(), name, common?.toText())
	private fun List<Double>.toBox() = GeoBox(this[0], this[1], this[2], this[3])
	private fun List<Double?>.toRange() = SizeRange(getOrNull(0), getOrNull(1))
}
