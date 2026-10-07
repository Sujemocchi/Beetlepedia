package com.example.beetlepedia.seed

/*
 * Shape of the JSON seed in src/main/resources/seed (core.json + genera/<id>.json).
 * It mirrors the data the pages used to load from the data JS files, with Japanese merged in.
 */

data class TextSeed(val ko: String? = null, val en: String? = null, val ja: String? = null)

data class FlagsSeed(val ko: Boolean = false, val en: Boolean = false, val ja: Boolean = false)

data class RankSeed(val rank: TextSeed, val name: String, val common: TextSeed? = null)

data class SourceSeed(val title: String, val url: String? = null)

data class MapSeed(val name: TextSeed)

data class GroupSeed(
	val id: String,
	val sci: String,
	val authority: String? = null,
	val color: String,
	val name: TextSeed,
	val taxonomy: List<RankSeed> = emptyList(),
	val lead: TextSeed? = null,
	val body: TextSeed? = null,
	val sources: List<String> = emptyList(),
)

data class CoreSeed(
	val baseTaxonomy: List<RankSeed> = emptyList(),
	val groups: List<GroupSeed> = emptyList(),
	val countries: Map<String, TextSeed> = emptyMap(),
	val maps: Map<String, MapSeed> = emptyMap(),
	val sources: Map<String, SourceSeed> = emptyMap(),
	/** Areas no genus uses (genera normally define their own). */
	val areas: Map<String, AreaSeed> = emptyMap(),
)

data class ImageSeed(
	val file: String,
	val author: String,
	val license: String,
	val licenseUrl: String? = null,
	val white: Boolean = false,
	val alt: TextSeed = TextSeed(),
)

/** [box] = [lonMin, latMin, lonMax, latMax]; [point] = [lon, lat]. */
data class AreaSeed(
	val name: TextSeed,
	val countries: List<String> = emptyList(),
	val box: List<Double>? = null,
	val exclude: List<List<Double>> = emptyList(),
	val point: List<Double>? = null,
)

data class HeroStatSeed(val value: String, val unit: String? = null, val label: TextSeed)
data class CardSeed(val title: TextSeed, val text: TextSeed)
data class OverviewSeed(
	val kicker: TextSeed? = null,
	val body: TextSeed? = null,
	val cards: List<CardSeed> = emptyList(),
	val speciesNote: TextSeed? = null,
)
data class StageSeed(val stage: String, val title: TextSeed, val time: TextSeed, val text: TextSeed)
data class LifecycleSeed(val lead: TextSeed? = null, val stages: List<StageSeed> = emptyList())
data class DefaultsSeed(val dimorphism: TextSeed? = null, val food: TextSeed? = null, val season: TextSeed? = null)
data class SpeciesInfoSeed(
	val authority: String? = null,
	val name: TextSeed? = null,
	val text: TextSeed? = null,
	val sources: List<String> = emptyList(),
)
data class GenusImagesSeed(val hero: ImageSeed? = null, val overview: ImageSeed? = null)

data class GenusSeed(
	val id: String,
	val group: String,
	val sci: String,
	val authority: String? = null,
	val map: String,
	val color: String,
	val sortOrder: Int = 0,
	val name: TextSeed,
	val shortName: TextSeed? = null,
	val taxonomy: List<RankSeed> = emptyList(),
	val eyebrow: TextSeed? = null,
	val lead: TextSeed? = null,
	val heroStats: List<HeroStatSeed> = emptyList(),
	/** Keyed by the species binomial, e.g. "Dynastes hercules". */
	val speciesInfo: Map<String, SpeciesInfoSeed> = emptyMap(),
	val overview: OverviewSeed? = null,
	val lifecycle: LifecycleSeed? = null,
	val conservation: TextSeed? = null,
	val care: List<TextSeed> = emptyList(),
	val facts: List<TextSeed> = emptyList(),
	val defaults: DefaultsSeed? = null,
	val latin: List<String> = emptyList(),
	val images: GenusImagesSeed? = null,
	val sizeDefaults: List<String> = emptyList(),
	val taxa: List<TaxonSeed> = emptyList(),
	val sources: Map<String, SourceSeed> = emptyMap(),
	val areas: Map<String, AreaSeed> = emptyMap(),
)

/** [male] / [female] = [min, max] in mm; min may be null. */
data class SizeSeed(
	val male: List<Double?>? = null,
	val female: List<Double?>? = null,
	val note: TextSeed? = null,
	val sources: List<String> = emptyList(),
)

/** History entries are flat in the data: { year, ko, en, ja }. */
data class HistorySeed(val year: Int? = null, val ko: String? = null, val en: String? = null, val ja: String? = null)
data class IssueSeed(val title: TextSeed? = null, val text: TextSeed, val sources: List<String> = emptyList())
data class ConservationSeed(val status: TextSeed? = null, val text: TextSeed? = null)
data class SubspeciesSeed(val sci: String, val authority: String? = null, val note: TextSeed? = null)
data class Model3dSeed(val id: String? = null, val url: String? = null, val author: String? = null, val license: String? = null)

data class TaxonSeed(
	val id: String,
	/** "species" or "subspecies". */
	val rank: String,
	val sci: String,
	/** Binomial of the species, for subspecies. */
	val species: String? = null,
	val authority: String? = null,
	val year: Int? = null,
	val color: String,
	val name: TextSeed = TextSeed(),
	val nameInformal: FlagsSeed? = null,
	val nameNote: TextSeed? = null,
	val subspecies: List<SubspeciesSeed> = emptyList(),
	val size: SizeSeed? = null,
	val pattern: TextSeed? = null,
	val morphology: TextSeed? = null,
	val distribution: List<String> = emptyList(),
	val distributionNote: TextSeed? = null,
	val habitat: TextSeed? = null,
	val ecology: TextSeed? = null,
	val captivityNote: TextSeed? = null,
	val dimorphism: TextSeed? = null,
	val food: TextSeed? = null,
	val season: TextSeed? = null,
	val conservation: ConservationSeed? = null,
	val facts: List<TextSeed> = emptyList(),
	val history: List<HistorySeed> = emptyList(),
	val issues: List<IssueSeed> = emptyList(),
	val images: List<ImageSeed> = emptyList(),
	val model3d: Model3dSeed? = null,
	val sources: List<String> = emptyList(),
)
