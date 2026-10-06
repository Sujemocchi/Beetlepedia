package com.example.beetlepedia.domain

import jakarta.persistence.CascadeType
import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Embedded
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.OrderBy
import jakarta.persistence.OrderColumn
import jakarta.persistence.Table

/**
 * A genus with everything its page shows: overview, life cycle, care, facts,
 * weights and the defaults its taxa inherit (diet, season, sexual dimorphism).
 */
@Entity
@Table(name = "genus")
class Genus(
	@Id @Column(length = 32) var id: String = "",
	@ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "group_id")
	var group: TaxonGroup? = null,
	@Column(nullable = false, unique = true) var sci: String = "",
	var authority: String? = null,
	@ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "map_region_id")
	var mapRegion: MapRegion? = null,
	@Column(nullable = false, length = 7) var color: String = "#888888",
	@Column(nullable = false) var sortOrder: Int = 0,

	@Embedded var name: LocalizedText = LocalizedText(),
	@Embedded var shortName: LocalizedText? = null,
	@Embedded var eyebrow: LocalizedText? = null,
	@Embedded var lead: LocalizedText? = null,

	@Embedded var overviewKicker: LocalizedText? = null,
	@Embedded var overviewBody: LocalizedText? = null,
	@Embedded var speciesNote: LocalizedText? = null,
	@Embedded var lifecycleLead: LocalizedText? = null,
	@Embedded var conservation: LocalizedText? = null,
	@Embedded var weightsNote: LocalizedText? = null,

	/** Defaults shown on taxon pages unless the taxon overrides them. */
	@Embedded var dimorphism: LocalizedText? = null,
	@Embedded var food: LocalizedText? = null,
	@Embedded var season: LocalizedText? = null,

	@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "hero_image_id")
	var heroImage: Image? = null,
	@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "overview_image_id")
	var overviewImage: Image? = null,
) {
	/** Ranks below the group, e.g. Subfamily · Lucaninae, Tribe · Cyclommatini, Genus · Cyclommatus. */
	@ElementCollection
	@CollectionTable(name = "genus_rank", joinColumns = [JoinColumn(name = "genus_id")])
	@OrderColumn(name = "position")
	var ranks: MutableList<RankEntry> = mutableListOf()

	@ElementCollection
	@CollectionTable(name = "genus_hero_stat", joinColumns = [JoinColumn(name = "genus_id")])
	@OrderColumn(name = "position")
	var heroStats: MutableList<HeroStat> = mutableListOf()

	@ElementCollection
	@CollectionTable(name = "genus_overview_card", joinColumns = [JoinColumn(name = "genus_id")])
	@OrderColumn(name = "position")
	var overviewCards: MutableList<Card> = mutableListOf()

	@ElementCollection
	@CollectionTable(name = "genus_lifecycle_stage", joinColumns = [JoinColumn(name = "genus_id")])
	@OrderColumn(name = "position")
	var lifecycleStages: MutableList<LifecycleStage> = mutableListOf()

	@ElementCollection
	@CollectionTable(name = "genus_care", joinColumns = [JoinColumn(name = "genus_id")])
	@OrderColumn(name = "position")
	var care: MutableList<LocalizedText> = mutableListOf()

	@ElementCollection
	@CollectionTable(name = "genus_fact", joinColumns = [JoinColumn(name = "genus_id")])
	@OrderColumn(name = "position")
	var facts: MutableList<LocalizedText> = mutableListOf()

	/** Extra Latin names that appear in the text and are set in italics. */
	@ElementCollection
	@CollectionTable(name = "genus_latin_term", joinColumns = [JoinColumn(name = "genus_id")])
	@Column(name = "term", nullable = false)
	@OrderColumn(name = "position")
	var latinTerms: MutableList<String> = mutableListOf()

	/** Taxon ids pre-selected in the size comparison. */
	@ElementCollection
	@CollectionTable(name = "genus_size_default", joinColumns = [JoinColumn(name = "genus_id")])
	@Column(name = "taxon_id", length = 64, nullable = false)
	@OrderColumn(name = "position")
	var sizeDefaults: MutableList<String> = mutableListOf()

	@OneToMany(mappedBy = "genus", cascade = [CascadeType.ALL], orphanRemoval = true)
	@OrderColumn(name = "position")
	var weights: MutableList<GenusWeight> = mutableListOf()

	@OneToMany(mappedBy = "genus", cascade = [CascadeType.ALL], orphanRemoval = true)
	@OrderColumn(name = "position")
	var speciesInfo: MutableList<SpeciesInfo> = mutableListOf()

	@ManyToMany
	@JoinTable(
		name = "genus_source",
		joinColumns = [JoinColumn(name = "genus_id")],
		inverseJoinColumns = [JoinColumn(name = "source_id")],
	)
	@OrderColumn(name = "position")
	var sources: MutableList<Source> = mutableListOf()

	/** Taxa of this genus in display order (read side; [Taxon.genus] owns the relation). */
	@OneToMany(mappedBy = "genus")
	@OrderBy("sortOrder")
	var taxa: MutableList<Taxon> = mutableListOf()

	fun addWeight(weight: GenusWeight) = weight.also { it.genus = this; weights.add(it) }
	fun addSpeciesInfo(info: SpeciesInfo) = info.also { it.genus = this; speciesInfo.add(it) }
}

/** A bar in the weight comparison (e.g. maximum larval weight), with its own sources. */
@Entity
@Table(name = "genus_weight")
class GenusWeight(
	@Embedded var label: LocalizedText = LocalizedText(),
	@Column(name = "weight_grams", nullable = false) var grams: Double = 0.0,
	@Embedded var note: LocalizedText? = null,
	@Column(length = 7) var color: String? = null,
	/** Shown with "≈". */
	@Column(nullable = false) var approx: Boolean = false,
	/** Shown with "+" (can exceed the value). */
	@Column(nullable = false) var plus: Boolean = false,
	@Column(nullable = false) var estimate: Boolean = false,
	@Column(nullable = false) var reported: Boolean = false,
) {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	var id: Long? = null

	@ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "genus_id")
	var genus: Genus? = null

	@ManyToMany
	@JoinTable(
		name = "genus_weight_source",
		joinColumns = [JoinColumn(name = "weight_id")],
		inverseJoinColumns = [JoinColumn(name = "source_id")],
	)
	@OrderColumn(name = "position")
	var sources: MutableList<Source> = mutableListOf()
}

/**
 * Species-level text for a species whose subspecies have their own pages
 * (e.g. Dynastes hercules and its 13 subspecies).
 */
@Entity
@Table(name = "species_info")
class SpeciesInfo(
	@Column(nullable = false) var speciesSci: String = "",
	var authority: String? = null,
	@Embedded var name: LocalizedText? = null,
	@Embedded var text: LocalizedText? = null,
) {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	var id: Long? = null

	@ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "genus_id")
	var genus: Genus? = null

	@ManyToMany
	@JoinTable(
		name = "species_info_source",
		joinColumns = [JoinColumn(name = "species_info_id")],
		inverseJoinColumns = [JoinColumn(name = "source_id")],
	)
	@OrderColumn(name = "position")
	var sources: MutableList<Source> = mutableListOf()
}
