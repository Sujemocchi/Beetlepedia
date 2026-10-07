package com.example.beetlepedia

import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

/** The static site (src/main/resources/static) is served by Spring Boot. */
@SpringBootTest
@AutoConfigureMockMvc
class StaticSiteTests(@Autowired val mockMvc: MockMvc) {

	@ParameterizedTest
	@ValueSource(
		strings = [
			"/index.html", "/group.html", "/genus.html", "/taxon.html",
			"/css/style.css",
			"/js/boot.js", "/js/main.js", "/js/home.js", "/js/group.js", "/js/genus.js", "/js/taxon.js", "/js/map.js", "/js/size-compare.js",
			"/data/i18n.js", "/data/silhouettes.js",
			"/assets/maps/africa.js", "/assets/maps/southeast-asia.js", "/assets/maps/neotropics.js",
			"/assets/images/cutouts/elapus.webp", "/assets/images/silhouettes/lucanidae.webp",
		]
	)
	fun `serves every page, script and data file`(path: String) {
		mockMvc.get(path).andExpect { status { isOk() } }
	}

	@ParameterizedTest
	@ValueSource(strings = ["/genus.html", "/taxon.html", "/group.html", "/index.html"])
	fun `pages load their data from the API through boot js`(path: String) {
		mockMvc.get(path).andExpect {
			status { isOk() }
			content { string(org.hamcrest.Matchers.containsString("<script src=\"js/boot.js\" data-scripts=\"js/main.js")) }
			content { string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("data/genera/"))) }
			content { string(org.hamcrest.Matchers.containsString("<script src=\"data/silhouettes.js\"></script>")) }
		}
	}

	@ParameterizedTest
	@ValueSource(strings = ["africa", "southeast-asia", "neotropics"])
	fun `region maps carry first-level administrative regions with names and country names`(region: String) {
		mockMvc.get("/assets/maps/$region.js").andExpect {
			content { string(org.hamcrest.Matchers.containsString("\"admin\":[[")) }
			content { string(org.hamcrest.Matchers.containsString("\"islands\":{")) }
			content { string(org.hamcrest.Matchers.containsString("\"countries\":{")) }
		}
	}

	@org.junit.jupiter.api.Test
	fun `island provinces are named with their island`() {
		val js = mockMvc.get("/assets/maps/southeast-asia.js").andReturn().response.contentAsByteArray.toString(Charsets.UTF_8)
		// [iso, outline, lon, lat, en, ko, ja, island]
		kotlin.test.assertTrue(Regex("""\["IDN","[^"]+",[\d.-]+,[\d.-]+,"Bengkulu","벵쿨루","ブンクル州","sumatra"]""").containsMatchIn(js))
		kotlin.test.assertTrue(""""sumatra":{"en":"Sumatra","ko":"수마트라섬","ja":"スマトラ島"}""" in js)
	}
}
