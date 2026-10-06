package com.example.beetlepedia.domain

import jakarta.persistence.CascadeType
import jakarta.persistence.CollectionTable
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Column
import jakarta.persistence.Convert
import jakarta.persistence.Converter
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

enum class TaxonRank { SPECIES, SUBSPECIES }

/** Stores the rank by name in a plain varchar, so the schema is the same on H2 and PostgreSQL (no native enum type). */
@Converter
class TaxonRankConverter : AttributeConverter<TaxonRank, String> {
	override fun convertToDatabaseColumn(rank: TaxonRank?) = rank?.name
	override fun convertToEntityAttribute(value: String?) = value?.let { TaxonRank.valueOf(it) }
}

/**
 * A species or subspecies with its own page. A subspecies names its species in [speciesSci];
 * species-level text for it lives in [SpeciesInfo].
 */
@Entity
@Table(name = "taxon")
class Taxon(
	@Id @Column(length = 64) var id: String = "",
	@ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "genus_id")
	var genus: Genus? = null,
	@Convert(converter = TaxonRankConverter::class) @Column(name = "taxon_rank", nullable = false, length = 16)
	var rank: TaxonRank = TaxonRank.SPECIES,
	@Column(nullable = false, unique = true) var sci: String = "",
	/** Binomial of the species a subspecies belongs to, e.g. "Dynastes hercules". */
	var speciesSci: String? = null,
	var authority: String? = null,
	/** Year of description, when recorded. */
	var describedYear: Int? = null,
	@Column(nullable = false, length = 7) var color: String = "#888888",
	@Column(nullable = false) var sortOrder: Int = 0,

	@Embedded var name: LocalizedText = LocalizedText(),
	@Embedded var nameInformal: LanguageFlags = LanguageFlags(),
	@Embedded var nameNote: LocalizedText? = null,

	@Embedded var size: SizeInfo = SizeInfo(),

	@Embedded var pattern: LocalizedText? = null,
	@Embedded var morphology: LocalizedText? = null,
	@Embedded var distributionNote: LocalizedText? = null,
	@Embedded var habitat: LocalizedText? = null,
	@Embedded var ecology: LocalizedText? = null,
	@Embedded var captivityNote: LocalizedText? = null,

	/** Overrides of the genus defaults. */
	@Embedded var dimorphism: LocalizedText? = null,
	@Embedded var food: LocalizedText? = null,
	@Embedded var season: LocalizedText? = null,

	@Embedded var conservationStatus: LocalizedText? = null,
	@Embedded var conservationText: LocalizedText? = null,

	@Embedded var model3d: Model3d? = null,
) {
	/** Range codes: ISO 3166-1 alpha-3 countries or [Area] codes. */
	@ElementCollection
	@CollectionTable(name = "taxon_range", joinColumns = [JoinColumn(name = "taxon_id")])
	@Column(name = "code", length = 48, nullable = false)
	@OrderColumn(name = "position")
	var distribution: MutableList<String> = mutableListOf()

	@ElementCollection
	@CollectionTable(name = "taxon_subspecies", joinColumns = [JoinColumn(name = "taxon_id")])
	@OrderColumn(name = "position")
	var subspecies: MutableList<SubspeciesNote> = mutableListOf()

	@ElementCollection
	@CollectionTable(name = "taxon_history", joinColumns = [JoinColumn(name = "taxon_id")])
	@OrderColumn(name = "position")
	var history: MutableList<HistoryEntry> = mutableListOf()

	@ElementCollection
	@CollectionTable(name = "taxon_fact", joinColumns = [JoinColumn(name = "taxon_id")])
	@OrderColumn(name = "position")
	var facts: MutableList<LocalizedText> = mutableListOf()

	@OneToMany(mappedBy = "taxon", cascade = [CascadeType.ALL], orphanRemoval = true)
	// Insertion order (identity ids); @OrderColumn is not supported on the mappedBy side
	@OrderBy("id")
	var issues: MutableList<TaxonIssue> = mutableListOf()

	@ManyToMany
	@JoinTable(
		name = "taxon_image",
		joinColumns = [JoinColumn(name = "taxon_id")],
		inverseJoinColumns = [JoinColumn(name = "image_id")],
	)
	@OrderColumn(name = "position")
	var images: MutableList<Image> = mutableListOf()

	/** Sources behind the body-length figures. */
	@ManyToMany
	@JoinTable(
		name = "taxon_size_source",
		joinColumns = [JoinColumn(name = "taxon_id")],
		inverseJoinColumns = [JoinColumn(name = "source_id")],
	)
	@OrderColumn(name = "position")
	var sizeSources: MutableList<Source> = mutableListOf()

	@ManyToMany
	@JoinTable(
		name = "taxon_source",
		joinColumns = [JoinColumn(name = "taxon_id")],
		inverseJoinColumns = [JoinColumn(name = "source_id")],
	)
	@OrderColumn(name = "position")
	var sources: MutableList<Source> = mutableListOf()

	fun addIssue(issue: TaxonIssue) = issue.also { it.taxon = this; issues.add(it) }
}

/** A notable issue (rank dispute, hybrid, record, protection …) with its own sources. */
@Entity
@Table(name = "taxon_issue")
class TaxonIssue(
	@Embedded var title: LocalizedText? = null,
	@Embedded var text: LocalizedText = LocalizedText(),
) {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	var id: Long? = null

	@ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "taxon_id")
	var taxon: Taxon? = null

	@ManyToMany
	@JoinTable(
		name = "taxon_issue_source",
		joinColumns = [JoinColumn(name = "issue_id")],
		inverseJoinColumns = [JoinColumn(name = "source_id")],
	)
	@OrderColumn(name = "position")
	var sources: MutableList<Source> = mutableListOf()
}
