package com.example.beetlepedia.validation

import com.example.beetlepedia.domain.Area
import com.example.beetlepedia.domain.GeoBox
import com.example.beetlepedia.domain.GeoPoint
import com.example.beetlepedia.domain.Genus
import com.example.beetlepedia.domain.Image
import com.example.beetlepedia.domain.LocalizedText
import com.example.beetlepedia.domain.MapRegion
import com.example.beetlepedia.domain.SizeInfo
import com.example.beetlepedia.domain.SizeRange
import com.example.beetlepedia.domain.Taxon
import com.example.beetlepedia.domain.TaxonGroup
import com.example.beetlepedia.domain.TaxonRank
import com.example.beetlepedia.seed.MapGeometry
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@SpringBootTest(properties = ["beetlepedia.seed.enabled=false"])
class TaxonomyValidatorTests(
	@Autowired val validator: TaxonomyValidator,
	@Autowired val geometry: MapGeometry,
) {
	private fun t(ko: String, en: String = ko, ja: String? = "ja") = LocalizedText(ko, en, ja)

	private val sumatra = Area("sumatra", t("수마트라섬", "Sumatra"), box = GeoBox(95.0, -6.2, 106.2, 6.0)).apply { countries.add("IDN") }
	private val tuxtlas = Area("los-tuxtlas", t("로스툭스틀라스", "Los Tuxtlas"), point = GeoPoint(-95.1, 18.45)).apply { countries.add("MEX") }
	private val ctx = RangeContext(setOf("IDN", "BRA", "MEX"), mapOf("sumatra" to sumatra, "los-tuxtlas" to tuxtlas))

	private val group = TaxonGroup("lucanidae", "Lucanidae", null, "#D9B44A", 0, t("사슴벌레", "Stag beetles"))
	private val genus = Genus("cyclommatus", group, "Cyclommatus", null, MapRegion("southeast-asia"), "#D9B44A", 0, t("가위사슴벌레속", "Cyclommatus"))

	private fun taxon(
		id: String = "cyclommatus-tarandus",
		sci: String = "Cyclommatus tarandus",
		rank: TaxonRank = TaxonRank.SPECIES,
		species: String? = null,
		color: String = "#D8A06C",
		male: SizeRange? = SizeRange(24.0, 70.0),
		range: List<String> = listOf("sumatra"),
	) = Taxon(id, genus, rank, sci, species, color = color, name = t("타란두스가위사슴벌레", ""), size = SizeInfo(male)).apply {
		distribution.addAll(range)
	}

	private fun messages(x: Taxon) = validator.validateTaxon(x, ctx).map { it.message }

	@Test
	fun `region maps are read from the site's map files`() {
		assertEquals(setOf("africa", "southeast-asia", "neotropics"), geometry.regions.keys)
		assertTrue(geometry.covers("southeast-asia", "sumatra", ctx.areas))
		assertTrue(geometry.covers("neotropics", "los-tuxtlas", ctx.areas), "point areas always show")
		assertTrue(!geometry.covers("southeast-asia", "BRA", ctx.areas))
	}

	@Test
	fun `a correct taxon has no problems`() {
		assertEquals(emptyList(), messages(taxon()))
	}

	@Test
	fun `ids and names must fit the genus and the rank`() {
		assertTrue("id should start with 'cyclommatus-'" in messages(taxon(id = "tarandus")))
		assertTrue("scientific name should start with 'Cyclommatus '" in messages(taxon(sci = "Lucanus tarandus")))
		assertTrue("a species needs a binomial name" in messages(taxon(sci = "Cyclommatus tarandus tarandus")))
		val sub = messages(taxon(id = "cyclommatus-tarandus-x", sci = "Cyclommatus tarandus", rank = TaxonRank.SUBSPECIES))
		assertTrue("a subspecies needs a trinomial name" in sub)
		assertTrue("a subspecies must name its species" in sub)
		assertTrue("colour must be #RRGGBB" in messages(taxon(color = "brown")))
	}

	@Test
	fun `sizes may lack a minimum but must be ordered`() {
		assertEquals(emptyList(), messages(taxon(male = SizeRange(null, 109.0))))
		assertTrue(messages(taxon(male = SizeRange(90.0, 70.0))).any { it.startsWith("bad male size") })
	}

	@Test
	fun `range codes must exist and appear on the genus map`() {
		assertTrue("unknown range code XYZ" in messages(taxon(range = listOf("XYZ"))))
		assertTrue("range code BRA matches nothing on map southeast-asia" in messages(taxon(range = listOf("BRA"))))
		assertTrue("has no distribution" in messages(taxon(range = emptyList())))
	}

	@Test
	fun `texts and images need Japanese and complete credits`() {
		val x = taxon().apply {
			morphology = LocalizedText("큰턱이 길다.", "Long mandibles.", null)
			images.add(Image("x.jpg", "someone", "CC BY 4.0", null, true, LocalizedText("표본", "", null)))
		}
		val m = messages(x)
		assertTrue(m.any { it.startsWith("missing Japanese for morphology") })
		assertTrue("image x.jpg needs a licence URL" in m)
		assertTrue("image x.jpg needs Korean and English alt text" in m)
	}

	@Test
	fun `a cut-out must be an existing file under assets images cutouts`() {
		val alt = LocalizedText("표본", "Specimen", "標本")
		fun cutout(path: String) = Image("x.jpg", "someone", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0", true, alt, path)
		assertEquals(emptyList(), validator.validateImage("t", cutout("cutouts/elapus.webp")).map { it.message })
		assertEquals(listOf("image x.jpg: cut-out file cutouts/nope.webp is missing"), validator.validateImage("t", cutout("cutouts/nope.webp")).map { it.message })
		assertEquals(listOf("image x.jpg: cut-out must look like cutouts/<name>.webp or .png"), validator.validateImage("t", cutout("../secret.webp")).map { it.message })
	}
}
