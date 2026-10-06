package com.example.beetlepedia.repository

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
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager
import org.springframework.dao.DataIntegrityViolationException
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertSame
import kotlin.test.assertTrue

/**
 * Runs against the Flyway schema (V1__init.sql) with `ddl-auto=validate`,
 * so these tests also prove the entities and the migration agree.
 */
@DataJpaTest
class DomainRepositoryTests(
	@Autowired val em: TestEntityManager,
	@Autowired val groups: TaxonGroupRepository,
	@Autowired val genera: GenusRepository,
	@Autowired val taxa: TaxonRepository,
	@Autowired val images: ImageRepository,
	@Autowired val areas: AreaRepository,
	@Autowired val baseRanks: BaseRankRepository,
) {
	private fun t(ko: String, en: String = ko, ja: String? = null) = LocalizedText(ko, en, ja)

	private lateinit var lucanidae: TaxonGroup
	private lateinit var dynastinae: TaxonGroup
	private lateinit var cyclommatus: Genus
	private lateinit var dynastes: Genus
	private lateinit var bekuwa: Source
	private lateinit var gbif: Source
	private lateinit var sharedPhoto: Image

	@BeforeEach
	fun seed() {
		bekuwa = em.persist(Source("cy-bekuwa2022", "BE-KUWA record list 2022", "https://example.org/bekuwa"))
		gbif = em.persist(Source("dy-gbif-dh", "GBIF: Dynastes hercules", "https://www.gbif.org/species/1"))
		sharedPhoto = em.persist(Image("Dynastes hercules ecuatorianus MHNT.jpg", "Didier Descouens", "CC BY-SA 4.0", null, true, t("헤라클레스 표본", "Hercules specimen")))
		val seAsia = em.persist(MapRegion("southeast-asia", t("동남아시아", "Southeast Asia")))
		val neo = em.persist(MapRegion("neotropics", t("중남미", "Neotropics")))

		lucanidae = em.persist(TaxonGroup("lucanidae", "Lucanidae", "Latreille, 1804", "#D9B44A", 2, t("사슴벌레", "Stag beetles", "クワガタムシ")).apply {
			ranks.add(RankEntry(t("과", "Family"), "Lucanidae", t("사슴벌레과", "Stag beetles")))
			sources.add(bekuwa)
		})
		dynastinae = em.persist(TaxonGroup("dynastinae", "Dynastinae", "MacLeay, 1819", "#9FBF4A", 3, t("장수풍뎅이", "Rhinoceros beetles")))

		cyclommatus = em.persist(Genus("cyclommatus", lucanidae, "Cyclommatus", "Parry, 1863", seAsia, "#D9B44A", 1, t("가위사슴벌레속", "Cyclommatus stag beetles")).apply {
			ranks.add(RankEntry(t("족", "Tribe"), "Cyclommatini"))
			heroStats.add(HeroStat("109", " mm", t("수컷 최대", "Max. male")))
			overviewCards.add(Card(t("이름의 유래", "Name"), t("둥근 눈", "Round eye")))
			lifecycleStages.add(LifecycleStage("larva", t("유충", "Larva"), t("3~11개월", "3–11 months"), t("썩은 나무를 먹는다.", "Feeds on rotting wood.")))
			care.add(t("서늘하게 기른다.", "Keep cool."))
			latinTerms.addAll(listOf("Cyclommatinus", "Lucanus metallifer"))
			sources.add(bekuwa)
		})
		dynastes = em.persist(Genus("dynastes", dynastinae, "Dynastes", "MacLeay, 1819", neo, "#9FBF4A", 2, t("헤라클레스장수풍뎅이속", "Hercules beetles")).apply {
			heroImage = sharedPhoto
			addWeight(GenusWeight(t("유충 (사육 최대)", "Larva (captive max.)"), 185.0, reported = true)).sources.add(gbif)
			addSpeciesInfo(SpeciesInfo("Dynastes hercules", "(Linnaeus, 1758)", t("헤라클레스장수풍뎅이", "Hercules beetle"))).sources.add(gbif)
		})

		// Inserted out of display order on purpose
		em.persist(Taxon("cyclommatus-truncatus", cyclommatus, TaxonRank.SPECIES, "Cyclommatus truncatus", null, "Schenk, 2000", color = "#B9BC55", sortOrder = 9))
		em.persist(Taxon("cyclommatus-elaphus-elaphus", cyclommatus, TaxonRank.SUBSPECIES, "Cyclommatus elaphus elaphus", "Cyclommatus elaphus", "Gestro, 1881", color = "#E8B04B", sortOrder = 1,
			name = t("엘라푸스가위사슴벌레", "", "エラフスホソアカクワガタ"),
			size = SizeInfo(male = SizeRange(null, 109.0), note = t("야외 기록 109.0mm", "Wild record 109.0 mm")),
		).apply {
			distribution.add("sumatra")
			history.add(HistoryEntry(1881, t("Gestro가 기재했다.", "Described by Gestro.")))
			sizeSources.add(bekuwa)
			sources.add(bekuwa)
		})
		for ((i, ep) in listOf("lichyi", "hercules").withIndex()) {
			em.persist(Taxon("dynastes-hercules-$ep", dynastes, TaxonRank.SUBSPECIES, "Dynastes hercules $ep", "Dynastes hercules", color = "#E2C14B", sortOrder = if (ep == "hercules") 0 else 1 + i).apply {
				images.add(sharedPhoto)
				size = SizeInfo(SizeRange(50.0, 180.0), SizeRange(50.0, 82.0))
				nameInformal = LanguageFlags(ko = true)
				distribution.addAll(if (ep == "hercules") listOf("GLP", "DMA") else listOf("VEN", "COL"))
				addIssue(TaxonIssue(t("아종인가, 종인가", "Subspecies or species?"), t("Huang(2017)이 종으로 승격했다.", "Raised to species by Huang (2017)."))).sources.add(gbif)
			})
		}
		em.flush()
		em.clear()
	}

	@Test
	fun `taxon round-trips with localized texts, size, range and history`() {
		val x = taxa.findBySci("Cyclommatus elaphus elaphus")
		assertNotNull(x)
		assertEquals(TaxonRank.SUBSPECIES, x.rank)
		assertEquals("Cyclommatus elaphus", x.speciesSci)
		assertEquals("엘라푸스가위사슴벌레", x.name.ko)
		assertEquals("エラフスホソアカクワガタ", x.name.ja)
		// Only a maximum is published: the minimum stays null instead of being made up.
		assertNull(x.size.male?.min)
		assertEquals(109.0, x.size.male?.max)
		assertNull(x.size.female)
		assertEquals("Wild record 109.0 mm", x.size.note?.en)
		assertEquals(listOf("sumatra"), x.distribution)
		assertEquals(1881, x.history.single().year)
		assertEquals(listOf("cy-bekuwa2022"), x.sizeSources.map { it.id })
		assertEquals("cyclommatus", x.genus?.id)
		assertEquals("lucanidae", x.genus?.group?.id)
	}

	@Test
	fun `genus keeps its ordered collections, weights and species info`() {
		val g = genera.findById("cyclommatus").orElseThrow()
		assertEquals("Cyclommatini", g.ranks.single().name)
		assertEquals("109", g.heroStats.single().figure)
		assertEquals("Round eye", g.overviewCards.single().text.en)
		assertEquals("larva", g.lifecycleStages.single().stage)
		assertEquals(listOf("Cyclommatinus", "Lucanus metallifer"), g.latinTerms)
		assertEquals("southeast-asia", g.mapRegion?.id)
		// Read side of the relation comes back in display order, not insertion order
		assertEquals(listOf("cyclommatus-elaphus-elaphus", "cyclommatus-truncatus"), g.taxa.map { it.id })

		val d = genera.findById("dynastes").orElseThrow()
		assertEquals(185.0, d.weights.single().grams)
		assertTrue(d.weights.single().reported)
		assertEquals(listOf("dy-gbif-dh"), d.weights.single().sources.map { it.id })
		assertEquals("Dynastes hercules", d.speciesInfo.single().speciesSci)
		assertEquals("Didier Descouens", d.heroImage?.author)
	}

	@Test
	fun `issues keep their own sources and the same photo is shared`() {
		val h = taxa.findById("dynastes-hercules-hercules").orElseThrow()
		val l = taxa.findById("dynastes-hercules-lichyi").orElseThrow()
		assertEquals("Subspecies or species?", h.issues.single().title?.en)
		assertEquals(listOf("dy-gbif-dh"), h.issues.single().sources.map { it.id })
		assertSame(h.images.single(), l.images.single())
		assertEquals(1, images.count())
		assertTrue(images.findByFile("Dynastes hercules ecuatorianus MHNT.jpg")!!.white)
		assertEquals(listOf("GLP", "DMA"), h.distribution)
		assertTrue(h.nameInformal.ko)
	}

	@Test
	fun `lookups follow the hierarchy and display order`() {
		assertEquals(listOf("lucanidae", "dynastinae"), groups.findAllByOrderBySortOrder().map { it.id })
		assertEquals(listOf("cyclommatus"), genera.findAllByGroupIdOrderBySortOrder("lucanidae").map { it.id })
		assertEquals(
			listOf("cyclommatus-elaphus-elaphus", "cyclommatus-truncatus"),
			taxa.findAllByGenusIdOrderBySortOrder("cyclommatus").map { it.id },
		)
		assertEquals(
			listOf("dynastes-hercules-hercules", "dynastes-hercules-lichyi"),
			taxa.findAllBySpeciesSciOrderBySortOrder("Dynastes hercules").map { it.id },
		)
		assertEquals(
			listOf("dynastes-hercules-hercules", "dynastes-hercules-lichyi"),
			taxa.findAllByGenusGroupIdOrderByGenusSortOrderAscSortOrderAsc("dynastinae").map { it.id },
		)
	}

	@Test
	fun `scientific names are unique`() {
		taxa.save(Taxon("cyclommatus-duplicate", em.find(Genus::class.java, "cyclommatus"), TaxonRank.SPECIES, "Cyclommatus truncatus", color = "#000000"))
		assertFailsWith<DataIntegrityViolationException> { taxa.flush() }
	}

	@Test
	fun `areas store a box with exclusions or a point`() {
		em.persist(Country("IDN", t("인도네시아", "Indonesia")))
		areas.save(Area("new-guinea-id", t("뉴기니섬 서부", "Western New Guinea"), box = GeoBox(131.6, -9.2, 141.1, -0.6)).apply {
			countries.add("IDN")
			excludes.add(GeoBox(133.8, -7.3, 135.0, -5.2))
		})
		areas.save(Area("los-tuxtlas", t("로스툭스틀라스", "Los Tuxtlas"), point = GeoPoint(-95.1, 18.45)).apply { countries.add("MEX") })
		areas.flush()
		em.clear()

		val ng = areas.findById("new-guinea-id").orElseThrow()
		assertEquals(setOf("IDN"), ng.countries)
		assertTrue(ng.box!!.contains(138.0, -4.0))
		assertTrue(ng.excludes.single().contains(134.5, -6.0))
		assertNull(ng.point)
		val lt = areas.findById("los-tuxtlas").orElseThrow()
		assertNull(lt.box)
		assertEquals(-95.1, lt.point?.lon)
	}

	@Test
	fun `base ranks come back in position order`() {
		baseRanks.save(BaseRank(1, t("문", "Phylum"), "Arthropoda"))
		baseRanks.save(BaseRank(0, t("계", "Kingdom"), "Animalia"))
		assertEquals(listOf("Animalia", "Arthropoda"), baseRanks.findAllByOrderByPosition().map { it.name })
	}
}
