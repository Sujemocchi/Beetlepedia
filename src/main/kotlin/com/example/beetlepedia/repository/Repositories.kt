package com.example.beetlepedia.repository

import com.example.beetlepedia.domain.Area
import com.example.beetlepedia.domain.BaseRank
import com.example.beetlepedia.domain.Country
import com.example.beetlepedia.domain.Genus
import com.example.beetlepedia.domain.Image
import com.example.beetlepedia.domain.MapRegion
import com.example.beetlepedia.domain.Source
import com.example.beetlepedia.domain.Taxon
import com.example.beetlepedia.domain.TaxonGroup
import org.springframework.data.jpa.repository.JpaRepository

interface TaxonGroupRepository : JpaRepository<TaxonGroup, String> {
	fun findAllByOrderBySortOrder(): List<TaxonGroup>
}

interface GenusRepository : JpaRepository<Genus, String> {
	fun findAllByOrderBySortOrder(): List<Genus>
	fun findAllByGroupIdOrderBySortOrder(groupId: String): List<Genus>
}

interface TaxonRepository : JpaRepository<Taxon, String> {
	fun findBySci(sci: String): Taxon?
	fun findAllByGenusIdOrderBySortOrder(genusId: String): List<Taxon>
	fun findAllByGenusGroupIdOrderByGenusSortOrderAscSortOrderAsc(groupId: String): List<Taxon>
	/** Subspecies of one species, e.g. all of "Dynastes hercules". */
	fun findAllBySpeciesSciOrderBySortOrder(speciesSci: String): List<Taxon>
}

interface SourceRepository : JpaRepository<Source, String>

interface ImageRepository : JpaRepository<Image, Long> {
	fun findByFile(file: String): Image?
}

interface CountryRepository : JpaRepository<Country, String>

interface AreaRepository : JpaRepository<Area, String>

interface MapRegionRepository : JpaRepository<MapRegion, String>

interface BaseRankRepository : JpaRepository<BaseRank, Long> {
	fun findAllByOrderByPosition(): List<BaseRank>
}
