package com.example.beetlepedia.admin

import com.example.beetlepedia.repository.TaxonRepository
import com.example.beetlepedia.seed.SeedExporter
import com.example.beetlepedia.seed.SeedImporter
import com.example.beetlepedia.seed.TaxonSeed
import org.hamcrest.Matchers.containsString
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.formLogin
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl
import org.springframework.transaction.annotation.Transactional
import java.io.ByteArrayInputStream
import java.util.zip.ZipInputStream
import kotlin.reflect.full.memberProperties
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.assertTrue

/** Turns a form object into request parameters the way the template names its fields (name.ko …). */
private fun formParams(form: Any, prefix: String = ""): Map<String, String> =
	form::class.memberProperties.flatMap { p ->
		val v = p.getter.call(form)
		when (v) {
			null -> emptyList()
			is TextForm -> formParams(v, "$prefix${p.name}.").toList()
			else -> listOf("$prefix${p.name}" to v.toString())
		}
	}.toMap()

@SpringBootTest
@AutoConfigureMockMvc
class AdminSecurityTests(@Autowired val mvc: MockMvc) {

	@Test
	fun `admin pages need a login, public pages and the API do not`() {
		mvc.get("/admin").andExpect { status { is3xxRedirection() }; redirectedUrl("/admin/login") }
		mvc.get("/admin/taxa").andExpect { status { is3xxRedirection() } }
		mvc.get("/admin/login").andExpect { status { isOk() } }
		mvc.get("/api/genera").andExpect { status { isOk() } }
		mvc.get("/index.html").andExpect { status { isOk() } }
	}

	@Test
	fun `login with the configured password`() {
		mvc.perform(formLogin("/admin/login").user("admin").password("test-password")).andExpect(redirectedUrl("/admin"))
		mvc.perform(formLogin("/admin/login").user("admin").password("wrong")).andExpect(redirectedUrl("/admin/login?error"))
	}

	@Test
	fun `forms are protected against CSRF`() {
		mvc.post("/admin/reseed") { with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user("admin").roles("ADMIN")) }
			.andExpect { status { isForbidden() } }
	}
}

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(roles = ["ADMIN"])
@Transactional
class AdminEditTests(
	@Autowired val mvc: MockMvc,
	@Autowired val admin: AdminService,
	@Autowired val taxa: TaxonRepository,
) {

	private fun post(url: String, form: Any) = mvc.post(url) {
		with(csrf())
		formParams(form).forEach { (k, v) -> param(k, v) }
	}

	@Test
	fun `dashboard and lists render`() {
		mvc.get("/admin").andExpect {
			status { isOk() }
			content { string(containsString("모든 규칙을 통과했습니다")) }
		}
		mvc.get("/admin/taxa").andExpect { content { string(containsString("Dynastes hercules lichyi")) } }
		mvc.get("/admin/taxa/cyclommatus-chewi").andExpect { content { string(containsString("츄위가위사슴벌레")) } }
		mvc.get("/admin/sources").andExpect { content { string(containsString("dy-gbif-dh")) } }
		mvc.get("/admin/images").andExpect { content { string(containsString("Dynastes hercules ecuatorianus MHNT.jpg")) } }
	}

	@Test
	fun `saving a taxon updates what the API serves`() {
		val form = admin.taxonForm("cyclommatus-chewi")!!.apply {
			name.ko = "츄위가위사슴벌레 (수정)"
			maleMin = 40.0
		}
		post("/admin/taxa/cyclommatus-chewi", form).andExpect { status { is3xxRedirection() } }
		mvc.get("/api/taxa/cyclommatus-chewi").andExpect {
			jsonPath("$.name.ko") { value("츄위가위사슴벌레 (수정)") }
			jsonPath("$.size.male[0]") { value(40.0) }
		}
	}

	@Test
	fun `a save that breaks a rule shows the problems and changes nothing`() {
		val form = admin.taxonForm("dynastes-hercules-lichyi")!!.apply {
			color = "brown"
			distribution = "VEN XYZ"
			sources = "dy-gbif-dh no-such-source"
			name.ko = "바뀌면 안 됨"
		}
		post("/admin/taxa/dynastes-hercules-lichyi", form).andExpect {
			status { isOk() }
			content { string(containsString("colour must be #RRGGBB")) }
			content { string(containsString("unknown range code XYZ")) }
			content { string(containsString("unknown source &#39;no-such-source&#39;")) }
		}
		assertEquals("헤라클레스 리키", taxa.findById("dynastes-hercules-lichyi").orElseThrow().name.ko)
	}

	@Test
	fun `an unchanged form saves as is, with several sources in a single-line field`() {
		// Browsers drop new lines from single-line inputs, so the form must not rely on them to separate ids.
		val form = admin.taxonForm("cyclommatus-lunifer")!!
		assertTrue(form.sizeSources.trim().split(" ").size > 1)
		post("/admin/taxa/cyclommatus-lunifer", form.apply { sizeSources = sizeSources.replace("\n", "") })
			.andExpect { status { is3xxRedirection() } }
	}

	@Test
	fun `create and delete a taxon`() {
		val form = admin.newTaxonForm("cyclommatus")!!.apply {
			id = "cyclommatus-testus"
			sci = "Cyclommatus testus"
			name.ko = "시험가위사슴벌레"; name.en = "Test stag beetle"; name.ja = "テストホソアカクワガタ"
			maleMax = 50.0
			distribution = "sumatra"
			conservationStatus.ko = "평가되지 않음"
		}
		post("/admin/taxa/new", form).andExpect { status { is3xxRedirection() } }
		mvc.get("/api/taxa/cyclommatus-testus").andExpect { jsonPath("$.size.male[1]") { value(50.0) } }

		mvc.post("/admin/taxa/cyclommatus-testus/delete") { with(csrf()) }.andExpect { status { is3xxRedirection() } }
		mvc.get("/api/taxa/cyclommatus-testus").andExpect { status { isNotFound() } }
	}

	@Test
	fun `a new taxon needs Japanese for every English text`() {
		val form = admin.newTaxonForm("cyclommatus")!!.apply {
			id = "cyclommatus-nojapanese"
			sci = "Cyclommatus nojapanese"
			name.ko = "일본어 없음"; name.en = "No Japanese"
			maleMax = 50.0
			distribution = "sumatra"
		}
		post("/admin/taxa/new", form).andExpect { content { string(containsString("missing Japanese for name")) } }
		assertNull(taxa.findById("cyclommatus-nojapanese").orElse(null))
	}

	@Test
	fun `sources and images are validated`() {
		post("/admin/sources/new", SourceForm("Bad Id!", "", "ftp://x")).andExpect {
			content { string(containsString("id must be")) }
			content { string(containsString("needs a title")) }
		}
		post("/admin/sources/new", SourceForm("dy-new-paper", "Someone (2026) A new paper.", "https://example.org/p")).andExpect { status { is3xxRedirection() } }
		post("/admin/images/new", ImageForm(file = "New beetle.jpg", author = "Someone", license = "CC BY 4.0", alt = TextForm("표본", "Specimen", null))).andExpect {
			content { string(containsString("needs a licence URL")) }
			content { string(containsString("missing Japanese")) }
		}
	}
}

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(roles = ["ADMIN"])
class SeedExportTests(
	@Autowired val mvc: MockMvc,
	@Autowired val exporter: SeedExporter,
	@Autowired val importer: SeedImporter,
) {

	@Test
	fun `exporting the unedited database reproduces the seed files`() {
		val files = exporter.export()
		val core = importer.readCore()
		assertEquals(core.groups, files.core.groups)
		assertEquals(core.baseTaxonomy, files.core.baseTaxonomy)
		assertEquals(core.countries, files.core.countries)
		assertEquals(core.maps, files.core.maps)
		assertEquals(core.sources, files.core.sources)
		val genera = importer.readGenera()
		assertEquals(genera.map { it.id }, files.genera.map { it.id })
		genera.zip(files.genera).forEach { (seed, exported) ->
			// An all-false nameInformal and a missing one mean the same thing
			fun TaxonSeed.norm() = copy(nameInformal = nameInformal?.takeIf { it.ko || it.en || it.ja })
			seed.taxa.zip(exported.taxa).forEach { (a, b) -> assertEquals(a.norm(), b.norm(), "taxon ${a.id}") }
			assertEquals(seed.copy(taxa = emptyList()), exported.copy(taxa = emptyList()), "genus ${seed.id}")
		}
	}

	@Test
	fun `export downloads a zip of seed files`() {
		val bytes = mvc.get("/admin/export").andExpect {
			status { isOk() }
			header { string("Content-Type", "application/zip") }
		}.andReturn().response.contentAsByteArray
		val names = mutableListOf<String>()
		ZipInputStream(ByteArrayInputStream(bytes)).use { z -> generateSequence { z.nextEntry }.forEach { names += it.name } }
		assertEquals(listOf("core.json", "genera/goliathus.json", "genera/cyclommatus.json", "genera/dynastes.json"), names)
	}
}
