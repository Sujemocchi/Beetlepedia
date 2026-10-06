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
			"/js/main.js", "/js/home.js", "/js/group.js", "/js/genus.js", "/js/taxon.js", "/js/map.js", "/js/size-compare.js",
			"/data/i18n.js", "/data/core.js",
			"/data/genera/goliathus.js",
			"/assets/maps/africa.js", "/assets/maps/southeast-asia.js", "/assets/maps/neotropics.js",
		]
	)
	fun `serves every page, script and data file`(path: String) {
		mockMvc.get(path).andExpect { status { isOk() } }
	}

	@ParameterizedTest
	@ValueSource(strings = ["/genus.html", "/taxon.html", "/group.html", "/index.html"])
	fun `pages load the shared runtime`(path: String) {
		mockMvc.get(path).andExpect {
			status { isOk() }
			content { string(org.hamcrest.Matchers.containsString("js/main.js")) }
		}
	}
}
