package com.example.beetlepedia.domain

import org.junit.jupiter.api.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class ValuesTests {

	@Test
	fun `size range allows a missing minimum but not a missing maximum`() {
		assertTrue(SizeRange(24.0, 70.0).isValid())
		assertTrue(SizeRange(null, 109.0).isValid())
		assertFalse(SizeRange(80.0, null).isValid())
		assertFalse(SizeRange(90.0, 70.0).isValid())
		assertFalse(SizeRange(0.0, 70.0).isValid())
	}

	@Test
	fun `geo box contains points on its edges`() {
		val sumatra = GeoBox(95.0, -6.2, 106.2, 6.0)
		assertTrue(sumatra.contains(100.0, 0.0))
		assertTrue(sumatra.contains(95.0, 6.0))
		assertFalse(sumatra.contains(110.0, 0.0))
	}

	@Test
	fun `localized text is empty only when every language is blank`() {
		assertTrue(LocalizedText().isEmpty())
		assertTrue(LocalizedText(" ", "", null).isEmpty())
		assertFalse(LocalizedText(ja = "クワガタムシ").isEmpty())
	}
}
