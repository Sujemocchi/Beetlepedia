package com.example.beetlepedia.api

import com.fasterxml.jackson.annotation.JsonInclude

/*
 * Response bodies of the read API. Field names and nesting match the objects the pages
 * work with (window.BP), so the front end can switch from the JS data files to the API
 * without changing its rendering code. Null fields are left out.
 */

@JsonInclude(JsonInclude.Include.NON_NULL)
data class TextDto(val ko: String?, val en: String?, val ja: String?)

data class FlagsDto(val ko: Boolean, val en: Boolean, val ja: Boolean)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class RankDto(val rank: TextDto, val name: String, val common: TextDto?)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class SourceDto(val title: String, val url: String?)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class MapDto(val name: TextDto)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class AreaDto(
	val name: TextDto,
	val countries: List<String>,
	/** [lonMin, latMin, lonMax, latMax] */
	val box: List<Double>?,
	val exclude: List<List<Double>>?,
	/** [lon, lat] */
	val point: List<Double>?,
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ImageDto(
	val file: String,
	val author: String,
	val license: String,
	val licenseUrl: String?,
	val white: Boolean,
	val alt: TextDto,
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class GroupDto(
	val id: String,
	val sci: String,
	val authority: String?,
	val color: String,
	val name: TextDto,
	val lead: TextDto?,
	val body: TextDto?,
	val taxonomy: List<RankDto>,
	val sources: List<String>,
)

data class HeroStatDto(val value: String, val unit: String?, val label: TextDto)
data class CardDto(val title: TextDto, val text: TextDto)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class OverviewDto(val kicker: TextDto?, val body: TextDto?, val cards: List<CardDto>, val speciesNote: TextDto?)

data class StageDto(val stage: String, val title: TextDto, val time: TextDto, val text: TextDto)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class LifecycleDto(val lead: TextDto?, val stages: List<StageDto>)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class DefaultsDto(val dimorphism: TextDto?, val food: TextDto?, val season: TextDto?)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class WeightItemDto(
	val label: TextDto,
	val value: Double,
	val approx: Boolean,
	val estimate: Boolean,
	val reported: Boolean,
	val plus: Boolean,
	val note: TextDto?,
	val color: String?,
	val sources: List<String>,
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class WeightsDto(val note: TextDto?, val items: List<WeightItemDto>)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class SpeciesInfoDto(val authority: String?, val name: TextDto?, val text: TextDto?, val sources: List<String>)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class GenusImagesDto(val hero: ImageDto?, val overview: ImageDto?)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class GenusDto(
	val id: String,
	val group: String,
	val sci: String,
	val authority: String?,
	val map: String,
	val color: String,
	val name: TextDto,
	val shortName: TextDto?,
	val taxonomy: List<RankDto>,
	val eyebrow: TextDto?,
	val lead: TextDto?,
	val heroStats: List<HeroStatDto>?,
	val speciesInfo: Map<String, SpeciesInfoDto>?,
	val overview: OverviewDto,
	val lifecycle: LifecycleDto,
	val conservation: TextDto?,
	val care: List<TextDto>,
	val facts: List<TextDto>,
	val defaults: DefaultsDto,
	val weights: WeightsDto?,
	val latin: List<String>,
	val images: GenusImagesDto,
	val sizeDefaults: List<String>?,
	/** Sources cited on the genus page, keyed by id. */
	val sources: Map<String, SourceDto>,
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class SizeDto(
	/** [min, max] in mm; min may be null. */
	val male: List<Double?>?,
	val female: List<Double?>?,
	val note: TextDto?,
	val sources: List<String>,
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class SubspeciesDto(val sci: String, val authority: String?, val note: TextDto?)

/** Flat like the data files: { year, ko, en, ja }. */
@JsonInclude(JsonInclude.Include.NON_NULL)
data class HistoryDto(val year: Int?, val ko: String?, val en: String?, val ja: String?)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class IssueDto(val title: TextDto?, val text: TextDto, val sources: List<String>)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ConservationDto(val status: TextDto?, val text: TextDto?)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Model3dDto(val id: String?, val url: String?, val author: String?, val license: String?)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class TaxonDto(
	val id: String,
	/** "species" or "subspecies" */
	val rank: String,
	val sci: String,
	val species: String?,
	val authority: String?,
	val year: Int?,
	val color: String,
	val genus: String,
	val group: String,
	val name: TextDto,
	val nameInformal: FlagsDto,
	val nameNote: TextDto?,
	val subspecies: List<SubspeciesDto>?,
	val size: SizeDto,
	val pattern: TextDto?,
	val morphology: TextDto?,
	val distribution: List<String>,
	val distributionNote: TextDto?,
	val habitat: TextDto?,
	val ecology: TextDto?,
	val captivityNote: TextDto?,
	val dimorphism: TextDto?,
	val food: TextDto?,
	val season: TextDto?,
	val conservation: ConservationDto,
	val facts: List<TextDto>,
	val history: List<HistoryDto>,
	val issues: List<IssueDto>,
	val images: List<ImageDto>,
	val model3d: Model3dDto?,
	val sources: List<String>,
)

/** Everything the pages need, in the shape of window.BP. */
data class BootstrapDto(
	val baseTaxonomy: List<RankDto>,
	val groups: List<GroupDto>,
	val genera: List<GenusDto>,
	val taxa: List<TaxonDto>,
	val countries: Map<String, TextDto>,
	val areas: Map<String, AreaDto>,
	val sources: Map<String, SourceDto>,
	val maps: Map<String, MapDto>,
)

/** One row of a search result. */
@JsonInclude(JsonInclude.Include.NON_NULL)
data class TaxonSummaryDto(
	val id: String,
	val rank: String,
	val sci: String,
	val authority: String?,
	val color: String,
	val genus: String,
	val group: String,
	val name: TextDto,
	/** [min, max] in mm */
	val male: List<Double?>?,
	val distribution: List<String>,
	val image: ImageDto?,
)

data class SearchResultDto(val total: Int, val items: List<TaxonSummaryDto>)

/** A group with its genera (for /api/groups). */
data class GroupDetailDto(val group: GroupDto, val genera: List<GenusSummaryDto>)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class GenusSummaryDto(
	val id: String,
	val group: String,
	val sci: String,
	val authority: String?,
	val color: String,
	val name: TextDto,
	val map: String,
	val taxa: Int,
	val maxMale: Double?,
	val image: ImageDto?,
)

/** A genus page: the genus and all of its taxa. */
data class GenusDetailDto(val genus: GenusDto, val taxa: List<TaxonDto>)
