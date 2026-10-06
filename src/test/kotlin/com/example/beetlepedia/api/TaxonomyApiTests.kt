package com.example.beetlepedia.api

import org.hamcrest.Matchers.contains
import org.hamcrest.Matchers.containsInAnyOrder
import org.hamcrest.Matchers.everyItem
import org.hamcrest.Matchers.greaterThanOrEqualTo
import org.hamcrest.Matchers.hasSize
import org.hamcrest.Matchers.nullValue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

@SpringBootTest
@AutoConfigureMockMvc
class TaxonomyApiTests(@Autowired val mvc: MockMvc) {

	@Test
	fun `bootstrap has everything the pages need, in their shape`() {
		mvc.get("/api/bootstrap").andExpect {
			status { isOk() }
			jsonPath("$.groups[*].id", contains("cetoniinae", "lucanidae", "dynastinae"))
			jsonPath("$.genera[*].id", contains("goliathus", "cyclommatus", "dynastes"))
			jsonPath("$.taxa", hasSize<Any>(28))
			jsonPath("$.baseTaxonomy[0].name") { value("Animalia") }
			jsonPath("$.sources.length()") { value(142) }
			jsonPath("$.areas.length()") { value(13) }
			jsonPath("$.countries.length()") { value(61) }
			jsonPath("$.maps.length()") { value(3) }
			// Taxa carry their genus and group, like registerGenus() used to add
			jsonPath("$.taxa[0].id") { value("goliathus-goliatus") }
			jsonPath("$.taxa[0].genus") { value("goliathus") }
			jsonPath("$.taxa[0].group") { value("cetoniinae") }
			// Japanese is inline now
			jsonPath("$.groups[1].name.ja") { value("クワガタムシ") }
			// Optional lists are left out when empty, as in the data files
			jsonPath("$.genera[1].heroStats") { doesNotExist() }
			jsonPath("$.genera[1].sizeDefaults") { doesNotExist() }
			jsonPath("$.genera[0].sizeDefaults[0]") { value("goliathus-goliatus") }
			jsonPath("$.areas['los-tuxtlas'].point", contains(-95.1, 18.45))
			jsonPath("$.areas.sumatra.box[0]") { value(95.0) }
		}
	}

	@Test
	fun `taxon detail keeps sizes, history and issues`() {
		mvc.get("/api/taxa/cyclommatus-elaphus-elaphus").andExpect {
			status { isOk() }
			jsonPath("$.rank") { value("subspecies") }
			jsonPath("$.species") { value("Cyclommatus elaphus") }
			jsonPath("$.size.male[0]", nullValue())
			jsonPath("$.size.male[1]") { value(109.0) }
			jsonPath("$.size.female") { doesNotExist() }
			jsonPath("$.distribution", contains("sumatra"))
			jsonPath("$.name.ja") { exists() }
		}
		mvc.get("/api/taxa/cyclommatus-truncatus").andExpect {
			// Unknown year: the field is left out (the page shows "—")
			jsonPath("$.history[-1].year") { doesNotExist() }
			jsonPath("$.history[-1].ko") { exists() }
		}
		mvc.get("/api/taxa/dynastes-hercules-lichyi").andExpect {
			jsonPath("$.issues[0].title.ko") { value("아종인가, 종인가") }
			jsonPath("$.issues[0].sources[0]") { exists() }
			jsonPath("$.images", hasSize<Any>(4))
			jsonPath("$.images[0].white") { value(true) }
		}
	}

	@Test
	fun `genus and group detail`() {
		mvc.get("/api/genera/dynastes").andExpect {
			status { isOk() }
			jsonPath("$.genus.map") { value("neotropics") }
			jsonPath("$.genus.speciesInfo['Dynastes hercules'].authority") { value("(Linnaeus, 1758)") }
			jsonPath("$.genus.weights.items[1].value") { value(185.0) }
			jsonPath("$.taxa", hasSize<Any>(13))
			jsonPath("$.taxa[0].id") { value("dynastes-hercules-hercules") }
		}
		mvc.get("/api/groups/lucanidae").andExpect {
			jsonPath("$.genera[0].id") { value("cyclommatus") }
			jsonPath("$.genera[0].taxa") { value(10) }
			jsonPath("$.genera[0].maxMale") { value(109.0) }
		}
		mvc.get("/api/groups").andExpect { jsonPath("$", hasSize<Any>(3)) }
		mvc.get("/api/genera").andExpect { jsonPath("$[*].id", contains("goliathus", "cyclommatus", "dynastes")) }
	}

	@Test
	fun `unknown ids are 404 problems`() {
		mvc.get("/api/taxa/nope").andExpect {
			status { isNotFound() }
			jsonPath("$.detail") { value("taxon 'nope' not found") }
		}
		mvc.get("/api/genera/nope").andExpect { status { isNotFound() } }
		mvc.get("/api/groups/nope").andExpect { status { isNotFound() } }
	}

	@Test
	fun `search matches names in every language and abbreviations`() {
		mvc.get("/api/taxa?q=hercules").andExpect { jsonPath("$.total") { value(13) } }
		mvc.get("/api/taxa?q=D. h. lichyi").andExpect { jsonPath("$.items[*].id", contains("dynastes-hercules-lichyi")) }
		mvc.get("/api/taxa?q=골리앗").andExpect { jsonPath("$.total") { value(5) } }
		mvc.get("/api/taxa?q=メタリフェル").andExpect { jsonPath("$.items[*].id", contains("cyclommatus-metallifer-finae")) }
		mvc.get("/api/taxa?q=GOLIATH beetle").andExpect { jsonPath("$.total", greaterThanOrEqualTo(1)) }
	}

	@Test
	fun `search filters combine`() {
		mvc.get("/api/taxa?group=lucanidae").andExpect { jsonPath("$.total") { value(10) } }
		mvc.get("/api/taxa?rank=subspecies&genus=dynastes").andExpect { jsonPath("$.total") { value(13) } }
		mvc.get("/api/taxa?minLength=150").andExpect {
			jsonPath("$.total") { value(7) }
			jsonPath("$.items[*].genus", everyItem(org.hamcrest.Matchers.equalTo("dynastes")))
		}
		mvc.get("/api/taxa?maxLength=60").andExpect {
			jsonPath("$.items[*].id", containsInAnyOrder("cyclommatus-pulchellus", "cyclommatus-lunifer", "cyclommatus-speciosus-speciosus"))
		}
		// Countries also match the islands and regions that lie in them (Sumatra, Borneo … → IDN)
		mvc.get("/api/taxa?country=IDN").andExpect { jsonPath("$.total") { value(8) } }
		mvc.get("/api/taxa?hasImage=false").andExpect { jsonPath("$.total") { value(12) } }
		mvc.get("/api/taxa?rank=genus").andExpect { status { isBadRequest() } }
	}
}
