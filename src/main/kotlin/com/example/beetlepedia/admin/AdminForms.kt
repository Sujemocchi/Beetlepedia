package com.example.beetlepedia.admin

import com.example.beetlepedia.domain.Image
import com.example.beetlepedia.domain.LocalizedText
import com.example.beetlepedia.domain.Source
import com.example.beetlepedia.domain.Taxon

/*
 * Form objects bound by the admin templates. Mutable with defaults so Spring can bind them.
 */

class TextForm(var ko: String? = null, var en: String? = null, var ja: String? = null) {
	fun toText(): LocalizedText? = LocalizedText(ko.clean(), en.clean(), ja.clean()).takeUnless { it.isEmpty() }

	companion object {
		fun of(t: LocalizedText?) = TextForm(t?.ko, t?.en, t?.ja)
	}
}

internal fun String?.clean(): String? = this?.trim()?.takeIf { it.isNotEmpty() }

/** Splits "a, b  c\nd" into [a, b, c, d]. */
internal fun String?.tokens(): List<String> = this.orEmpty().split(Regex("[\\s,]+")).filter { it.isNotBlank() }

/** One entry per line (file names may contain spaces and commas). */
internal fun String?.nonEmptyLines(): List<String> = this.orEmpty().split('\n').map { it.trim() }.filter { it.isNotEmpty() }

class TaxonForm(
	var id: String = "",
	var genusId: String = "",
	var rank: String = "SPECIES",
	var sci: String = "",
	var speciesSci: String? = null,
	var authority: String? = null,
	var describedYear: Int? = null,
	var color: String = "#888888",
	var sortOrder: Int = 0,
	var name: TextForm = TextForm(),
	var informalKo: Boolean = false,
	var informalEn: Boolean = false,
	var informalJa: Boolean = false,
	var nameNote: TextForm = TextForm(),
	var maleMin: Double? = null,
	var maleMax: Double? = null,
	var femaleMin: Double? = null,
	var femaleMax: Double? = null,
	var sizeNote: TextForm = TextForm(),
	var pattern: TextForm = TextForm(),
	var morphology: TextForm = TextForm(),
	/** Range codes separated by spaces or commas. */
	var distribution: String = "",
	var distributionNote: TextForm = TextForm(),
	var habitat: TextForm = TextForm(),
	var ecology: TextForm = TextForm(),
	var captivityNote: TextForm = TextForm(),
	var conservationStatus: TextForm = TextForm(),
	var conservationText: TextForm = TextForm(),
	/** Image file names, one per line, in display order. */
	var images: String = "",
	/** Source ids separated by spaces, commas or new lines. */
	var sources: String = "",
	var sizeSources: String = "",
) {
	companion object {
		fun of(x: Taxon) = TaxonForm(
			id = x.id,
			genusId = x.genus!!.id,
			rank = x.rank.name,
			sci = x.sci,
			speciesSci = x.speciesSci,
			authority = x.authority,
			describedYear = x.describedYear,
			color = x.color,
			sortOrder = x.sortOrder,
			name = TextForm.of(x.name),
			informalKo = x.nameInformal.ko,
			informalEn = x.nameInformal.en,
			informalJa = x.nameInformal.ja,
			nameNote = TextForm.of(x.nameNote),
			maleMin = x.size.male?.min,
			maleMax = x.size.male?.max,
			femaleMin = x.size.female?.min,
			femaleMax = x.size.female?.max,
			sizeNote = TextForm.of(x.size.note),
			pattern = TextForm.of(x.pattern),
			morphology = TextForm.of(x.morphology),
			distribution = x.distribution.joinToString(" "),
			distributionNote = TextForm.of(x.distributionNote),
			habitat = TextForm.of(x.habitat),
			ecology = TextForm.of(x.ecology),
			captivityNote = TextForm.of(x.captivityNote),
			conservationStatus = TextForm.of(x.conservationStatus),
			conservationText = TextForm.of(x.conservationText),
			images = x.images.joinToString("\n") { it.file },
			// Ids never contain spaces; space-separated also survives single-line inputs (which drop new lines).
			sources = x.sources.joinToString(" ") { it.id },
			sizeSources = x.sizeSources.joinToString(" ") { it.id },
		)
	}
}

class SourceForm(var id: String = "", var title: String = "", var url: String? = null) {
	companion object {
		fun of(s: Source) = SourceForm(s.id, s.title, s.url)
	}
}

class ImageForm(
	var id: Long? = null,
	var file: String = "",
	var author: String = "",
	var license: String = "",
	var licenseUrl: String? = null,
	var white: Boolean = false,
	var alt: TextForm = TextForm(),
) {
	companion object {
		fun of(i: Image) = ImageForm(i.id, i.file, i.author, i.license, i.licenseUrl, i.white, TextForm.of(i.alt))
	}
}
