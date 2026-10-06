package com.example.beetlepedia.domain

import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Embedded
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.OrderColumn
import jakarta.persistence.Table

/** Top of the hierarchy: 꽃무지 (Cetoniinae), 사슴벌레 (Lucanidae), 장수풍뎅이 (Dynastinae). */
@Entity
@Table(name = "taxon_group")
class TaxonGroup(
	@Id @Column(length = 32) var id: String = "",
	@Column(nullable = false) var sci: String = "",
	var authority: String? = null,
	@Column(nullable = false, length = 7) var color: String = "#888888",
	@Column(nullable = false) var sortOrder: Int = 0,
	@Embedded var name: LocalizedText = LocalizedText(),
	@Embedded var lead: LocalizedText = LocalizedText(),
	@Embedded var body: LocalizedText = LocalizedText(),
) {
	/** Ranks below the shared superfamily level down to this group, e.g. Family · Scarabaeidae, Subfamily · Cetoniinae. */
	@ElementCollection
	@CollectionTable(name = "group_rank", joinColumns = [JoinColumn(name = "group_id")])
	@OrderColumn(name = "position")
	var ranks: MutableList<RankEntry> = mutableListOf()

	@ManyToMany
	@JoinTable(
		name = "group_source",
		joinColumns = [JoinColumn(name = "group_id")],
		inverseJoinColumns = [JoinColumn(name = "source_id")],
	)
	@OrderColumn(name = "position")
	var sources: MutableList<Source> = mutableListOf()
}
