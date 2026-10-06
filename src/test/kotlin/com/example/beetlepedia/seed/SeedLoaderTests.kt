package com.example.beetlepedia.seed

import com.example.beetlepedia.domain.TaxonRank
import com.example.beetlepedia.repository.AreaRepository
import com.example.beetlepedia.repository.BaseRankRepository
import com.example.beetlepedia.repository.CountryRepository
import com.example.beetlepedia.repository.GenusRepository
import com.example.beetlepedia.repository.ImageRepository
import com.example.beetlepedia.repository.MapRegionRepository
import com.example.beetlepedia.repository.SourceRepository
import com.example.beetlepedia.repository.TaxonGroupRepository
import com.example.beetlepedia.repository.TaxonRepository
import com.example.beetlepedia.validation.RangeContext
import com.example.beetlepedia.validation.TaxonomyValidator
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

/** The application starts with the seed loaded; the seed itself follows every data rule. */
@SpringBootTest
@Transactional
class SeedLoaderTests(
	@Autowired val importer: SeedImporter,
	@Autowired val validator: TaxonomyValidator,
	@Autowired val groups: TaxonGroupRepository,
	@Autowired val genera: GenusRepository,
	@Autowired val taxa: TaxonRepository,
	@Autowired val sources: SourceRepository,
	@Autowired val images: ImageRepository,
	@Autowired val countries: CountryRepository,
	@Autowired val areas: AreaRepository,
	@Autowired val maps: MapRegionRepository,
	@Autowired val baseRanks: BaseRankRepository,
) {

	@Test
	fun `seed follows every data rule`() {
		val graph = importer.read()
		val problems = graph.problems + validator.validateAll(graph.groups, graph.genera, RangeContext(graph.countries.keys, graph.areas))
		assertEquals(emptyList(), problems.map { it.toString() })
	}

	@Test
	fun `everything from the old data files is in the database`() {
		assertEquals(listOf("cetoniinae", "lucanidae", "dynastinae"), groups.findAllByOrderBySortOrder().map { it.id })
		assertEquals(listOf("goliathus", "cyclommatus", "dynastes"), genera.findAllByOrderBySortOrder().map { it.id })
		assertEquals(28, taxa.count())
		assertEquals(5, taxa.findAllByGenusIdOrderBySortOrder("goliathus").size)
		assertEquals(10, taxa.findAllByGenusIdOrderBySortOrder("cyclommatus").size)
		assertEquals(13, taxa.findAllBySpeciesSciOrderBySortOrder("Dynastes hercules").size)
		assertEquals(142, sources.count())
		assertEquals(3, maps.count())
		assertEquals(13, areas.count())
		assertEquals(61, countries.count())
		assertEquals(listOf("Animalia", "Arthropoda", "Insecta", "Coleoptera", "Scarabaeoidea"), baseRanks.findAllByOrderByPosition().map { it.name })
		assertTrue(images.count() > 20)
	}

	@Test
	fun `taxa keep their details, Japanese and sources`() {
		val elaphus = taxa.findById("cyclommatus-elaphus-elaphus").orElseThrow()
		assertEquals(TaxonRank.SUBSPECIES, elaphus.rank)
		assertEquals("Cyclommatus elaphus", elaphus.speciesSci)
		assertNull(elaphus.size.male?.min, "only a maximum is published")
		assertEquals(109.0, elaphus.size.male?.max)
		assertEquals(listOf("sumatra"), elaphus.distribution)
		assertNotNull(elaphus.name.ja)

		val lichyi = taxa.findById("dynastes-hercules-lichyi").orElseThrow()
		assertEquals(listOf(85.0, 180.4), listOf(lichyi.size.male?.min, lichyi.size.male?.max))
		assertEquals(4, lichyi.images.size)
		assertTrue(lichyi.images.first().white)
		assertTrue(lichyi.issues.isNotEmpty() && lichyi.issues.all { !it.text.ja.isNullOrBlank() })
		assertTrue(lichyi.sources.isNotEmpty() && lichyi.sources.all { it.id.startsWith("dy-") })

		// History entry with an unknown year
		val truncatus = taxa.findById("cyclommatus-truncatus").orElseThrow()
		assertTrue(truncatus.history.any { it.year == null })

		// Same photo row shared by the genus hero and a subspecies
		val dynastes = genera.findById("dynastes").orElseThrow()
		val ecuatorianus = taxa.findById("dynastes-hercules-ecuatorianus").orElseThrow()
		assertEquals(dynastes.heroImage?.id, ecuatorianus.images.first().id)
	}

	@Test
	fun `genus content survives the move`() {
		val goliathus = genera.findById("goliathus").orElseThrow()
		assertEquals(4, goliathus.lifecycleStages.size)
		assertEquals(2, goliathus.weights.size)
		assertEquals(listOf("goliathus-goliatus", "goliathus-regius", "goliathus-albosignatus"), goliathus.sizeDefaults)
		assertEquals("africa", goliathus.mapRegion?.id)
		val dynastes = genera.findById("dynastes").orElseThrow()
		assertEquals("Dynastes hercules", dynastes.speciesInfo.single().speciesSci)
		assertTrue(dynastes.weights.all { it.sources.isNotEmpty() })
	}
}
