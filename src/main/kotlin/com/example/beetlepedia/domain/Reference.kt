package com.example.beetlepedia.domain

import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Embedded
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OrderColumn
import jakarta.persistence.Table

/** A cited reference. Ids carry a per-genus prefix, e.g. `cy-wiki-en-genus`. */
@Entity
@Table(name = "source")
class Source(
	@Id @Column(length = 64) var id: String = "",
	@Column(nullable = false, length = 500) var title: String = "",
	@Column(length = 1000) var url: String? = null,
)

/** A Wikimedia Commons photo. The same file can be used by a genus and by several taxa. */
@Entity
@Table(name = "image")
class Image(
	@Column(nullable = false, unique = true, length = 300) var file: String = "",
	@Column(nullable = false, length = 300) var author: String = "",
	@Column(nullable = false, length = 100) var license: String = "",
	@Column(length = 500) var licenseUrl: String? = null,
	/** Specimen photographed on a plain white background (shown whole on a light plate). */
	@Column(nullable = false) var white: Boolean = false,
	@Embedded var alt: LocalizedText = LocalizedText(),
	/** Background-removed copy under static/assets/images (e.g. "cutouts/elapus.webp"); the page falls back to the original. */
	@Column(length = 200) var cutout: String? = null,
) {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	var id: Long? = null
}

/** ISO 3166-1 alpha-3 country (plus territories split out of France on the maps, e.g. GLP). */
@Entity
@Table(name = "country")
class Country(
	@Id @Column(length = 8) var code: String = "",
	@Embedded var name: LocalizedText = LocalizedText(),
)

/** A region map (assets/maps/<id>.js). */
@Entity
@Table(name = "map_region")
class MapRegion(
	@Id @Column(length = 32) var id: String = "",
	@Embedded var name: LocalizedText = LocalizedText(),
)

/**
 * An island or sub-national region used in ranges where a whole-country fill would mislead.
 * Either a [box] (map polygons of [countries] whose centroid falls inside, minus [excludes])
 * or a [point] drawn as a dot for narrow endemics.
 */
@Entity
@Table(name = "area")
class Area(
	@Id @Column(length = 48) var code: String = "",
	@Embedded var name: LocalizedText = LocalizedText(),
	@Embedded var box: GeoBox? = null,
	@Embedded var point: GeoPoint? = null,
) {
	@ElementCollection
	@CollectionTable(name = "area_country", joinColumns = [JoinColumn(name = "area_code")])
	@Column(name = "country_code", length = 8, nullable = false)
	var countries: MutableSet<String> = linkedSetOf()

	@ElementCollection
	@CollectionTable(name = "area_exclude", joinColumns = [JoinColumn(name = "area_code")])
	@OrderColumn(name = "position")
	var excludes: MutableList<GeoBox> = mutableListOf()
}

/** Ranks shared by every group, from kingdom down to superfamily. */
@Entity
@Table(name = "base_rank")
class BaseRank(
	@Column(nullable = false) var position: Int = 0,
	@Embedded var rank: LocalizedText = LocalizedText(),
	@Column(nullable = false) var name: String = "",
	@Embedded var common: LocalizedText? = null,
) {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	var id: Long? = null
}
