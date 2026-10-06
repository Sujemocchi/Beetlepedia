package com.example.beetlepedia.domain

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.persistence.Embedded

/*
 * Value types shared by the entities. Column names come from the attribute path
 * (ImplicitNamingStrategyComponentPathImpl), e.g. `name.ko` → `name_ko`,
 * so the same embeddable can appear several times in one table without overrides.
 */

/** A reader-facing text in Korean, English and Japanese. */
@Embeddable
class LocalizedText(
	@Column(length = 4000) var ko: String? = null,
	@Column(length = 4000) var en: String? = null,
	@Column(length = 4000) var ja: String? = null,
) {
	fun isEmpty() = ko.isNullOrBlank() && en.isNullOrBlank() && ja.isNullOrBlank()
}

/** Per-language flag, e.g. "this common name is informal". */
@Embeddable
class LanguageFlags(
	var ko: Boolean = false,
	var en: Boolean = false,
	var ja: Boolean = false,
)

/**
 * Body length in mm. [min] is null when only a maximum (e.g. a size record) is published,
 * so no minimum is ever made up.
 */
@Embeddable
class SizeRange(
	var min: Double? = null,
	var max: Double? = null,
) {
	fun isValid() = max != null && max!! > 0 && (min == null || (min!! > 0 && min!! <= max!!))
}

/** Male and female body length of a taxon with an optional note (records, caveats). */
@Embeddable
class SizeInfo(
	@Embedded var male: SizeRange? = null,
	@Embedded var female: SizeRange? = null,
	@Embedded var note: LocalizedText? = null,
)

/** One row of a classification ladder, e.g. Family · Lucanidae · 사슴벌레과. */
@Embeddable
class RankEntry(
	@Embedded var rank: LocalizedText = LocalizedText(),
	@Column(nullable = false) var name: String = "",
	@Embedded var common: LocalizedText? = null,
)

/** Longitude / latitude bounding box: [lonMin, latMin, lonMax, latMax]. */
@Embeddable
class GeoBox(
	var lonMin: Double = 0.0,
	var latMin: Double = 0.0,
	var lonMax: Double = 0.0,
	var latMax: Double = 0.0,
) {
	fun contains(lon: Double, lat: Double) = lon in lonMin..lonMax && lat in latMin..latMax
}

@Embeddable
class GeoPoint(
	var lon: Double = 0.0,
	var lat: Double = 0.0,
)

/** A titled paragraph (overview cards). */
@Embeddable
class Card(
	@Embedded var title: LocalizedText = LocalizedText(),
	@Embedded var text: LocalizedText = LocalizedText(),
)

/** A large figure in the genus hero, e.g. "184.3 mm · max. male length". */
@Embeddable
class HeroStat(
	@Column(nullable = false) var figure: String = "",
	var unit: String? = null,
	@Embedded var label: LocalizedText = LocalizedText(),
)

/** One stage of the life cycle timeline. */
@Embeddable
class LifecycleStage(
	@Column(nullable = false, length = 16) var stage: String = "",
	@Embedded var title: LocalizedText = LocalizedText(),
	@Embedded var time: LocalizedText = LocalizedText(),
	@Embedded var text: LocalizedText = LocalizedText(),
)

/** A dated entry in a taxon's naming and research history. */
@Embeddable
class HistoryEntry(
	@Column(name = "event_year", nullable = false) var year: Int = 0,
	@Embedded var text: LocalizedText = LocalizedText(),
)

/** A subspecies that is listed on its species' page but has no page of its own. */
@Embeddable
class SubspeciesNote(
	@Column(nullable = false) var sci: String = "",
	var authority: String? = null,
	@Embedded var note: LocalizedText? = null,
)

/** Reference to a 3D model (viewer on hold). */
@Embeddable
class Model3d(
	var modelId: String? = null,
	@Column(length = 1000) var url: String? = null,
	var author: String? = null,
	var license: String? = null,
)
