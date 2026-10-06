package com.example.beetlepedia.admin

import com.example.beetlepedia.seed.InvalidSeedException
import com.example.beetlepedia.seed.SeedExporter
import com.example.beetlepedia.seed.SeedService
import org.springframework.http.ContentDisposition
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.servlet.mvc.support.RedirectAttributes
import java.time.LocalDate

/** The admin screen (/admin): dashboard, taxa, sources, images, seed export and reload. */
@Controller
@RequestMapping("/admin")
class AdminController(
	private val admin: AdminService,
	private val exporter: SeedExporter,
	private val seed: SeedService,
) {

	@ModelAttribute("user")
	fun user(auth: Authentication?) = auth?.name

	@GetMapping("/login")
	fun login() = "admin/login"

	@GetMapping
	fun dashboard(model: Model): String {
		model.addAttribute("o", admin.overview())
		return "admin/dashboard"
	}

	// ---------- taxa ----------
	@GetMapping("/taxa")
	fun taxa(model: Model): String {
		model.addAttribute("genera", admin.generaWithTaxa())
		return "admin/taxa"
	}

	@GetMapping("/taxa/new")
	fun newTaxon(@RequestParam genus: String, model: Model): String {
		val form = admin.newTaxonForm(genus) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
		return taxonForm(model, form, creating = true)
	}

	@PostMapping("/taxa/new")
	fun createTaxon(@ModelAttribute("form") form: TaxonForm, model: Model, flash: RedirectAttributes): String {
		val problems = admin.saveTaxon(null, form)
		if (problems.isNotEmpty()) return taxonForm(model, form, creating = true, problems = problems)
		flash.addFlashAttribute("message", "${form.sci} 을(를) 추가했습니다.")
		return "redirect:/admin/taxa/${form.id.trim()}"
	}

	@GetMapping("/taxa/{id}")
	fun editTaxon(@PathVariable id: String, model: Model): String {
		val form = admin.taxonForm(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
		return taxonForm(model, form, creating = false)
	}

	@PostMapping("/taxa/{id}")
	fun updateTaxon(@PathVariable id: String, @ModelAttribute("form") form: TaxonForm, model: Model, flash: RedirectAttributes): String {
		val problems = admin.saveTaxon(id, form)
		if (problems.isNotEmpty()) return taxonForm(model, form, creating = false, problems = problems)
		flash.addFlashAttribute("message", "저장했습니다.")
		return "redirect:/admin/taxa/$id"
	}

	@PostMapping("/taxa/{id}/delete")
	fun deleteTaxon(@PathVariable id: String, flash: RedirectAttributes): String {
		admin.deleteTaxon(id)
		flash.addFlashAttribute("message", "$id 을(를) 삭제했습니다.")
		return "redirect:/admin/taxa"
	}

	private fun taxonForm(model: Model, form: TaxonForm, creating: Boolean, problems: List<Any> = emptyList()): String {
		model.addAttribute("form", form)
		model.addAttribute("creating", creating)
		model.addAttribute("problems", problems)
		model.addAttribute("genera", admin.genusOptions())
		return "admin/taxon-form"
	}

	// ---------- sources ----------
	@GetMapping("/sources")
	fun sources(model: Model): String {
		model.addAttribute("sources", admin.sources())
		return "admin/sources"
	}

	@GetMapping("/sources/new")
	fun newSource(model: Model) = sourceForm(model, SourceForm(), creating = true)

	@PostMapping("/sources/new")
	fun createSource(@ModelAttribute("form") form: SourceForm, model: Model, flash: RedirectAttributes): String {
		val problems = admin.saveSource(null, form)
		if (problems.isNotEmpty()) return sourceForm(model, form, creating = true, problems = problems)
		flash.addFlashAttribute("message", "출처 ${form.id} 을(를) 추가했습니다.")
		return "redirect:/admin/sources"
	}

	@GetMapping("/sources/{id}")
	fun editSource(@PathVariable id: String, model: Model): String =
		sourceForm(model, admin.sourceForm(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND), creating = false)

	@PostMapping("/sources/{id}")
	fun updateSource(@PathVariable id: String, @ModelAttribute("form") form: SourceForm, model: Model, flash: RedirectAttributes): String {
		form.id = id
		val problems = admin.saveSource(id, form)
		if (problems.isNotEmpty()) return sourceForm(model, form, creating = false, problems = problems)
		flash.addFlashAttribute("message", "저장했습니다.")
		return "redirect:/admin/sources"
	}

	private fun sourceForm(model: Model, form: SourceForm, creating: Boolean, problems: List<Any> = emptyList()): String {
		model.addAttribute("form", form)
		model.addAttribute("creating", creating)
		model.addAttribute("problems", problems)
		return "admin/source-form"
	}

	// ---------- images ----------
	@GetMapping("/images")
	fun images(model: Model): String {
		model.addAttribute("images", admin.images())
		return "admin/images"
	}

	@GetMapping("/images/new")
	fun newImage(model: Model) = imageForm(model, ImageForm(), creating = true)

	@PostMapping("/images/new")
	fun createImage(@ModelAttribute("form") form: ImageForm, model: Model, flash: RedirectAttributes): String {
		val problems = admin.saveImage(null, form)
		if (problems.isNotEmpty()) return imageForm(model, form, creating = true, problems = problems)
		flash.addFlashAttribute("message", "사진을 추가했습니다.")
		return "redirect:/admin/images"
	}

	@GetMapping("/images/{id}")
	fun editImage(@PathVariable id: Long, model: Model): String =
		imageForm(model, admin.imageForm(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND), creating = false)

	@PostMapping("/images/{id}")
	fun updateImage(@PathVariable id: Long, @ModelAttribute("form") form: ImageForm, model: Model, flash: RedirectAttributes): String {
		form.id = id
		val problems = admin.saveImage(id, form)
		if (problems.isNotEmpty()) return imageForm(model, form, creating = false, problems = problems)
		flash.addFlashAttribute("message", "저장했습니다.")
		return "redirect:/admin/images"
	}

	private fun imageForm(model: Model, form: ImageForm, creating: Boolean, problems: List<Any> = emptyList()): String {
		model.addAttribute("form", form)
		model.addAttribute("creating", creating)
		model.addAttribute("problems", problems)
		return "admin/image-form"
	}

	// ---------- seed ----------
	/** The database as seed files (zip), to unpack into src/main/resources/seed and commit. */
	@GetMapping("/export")
	fun export(): ResponseEntity<ByteArray> = ResponseEntity.ok()
		.header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename("beetlepedia-seed-${LocalDate.now()}.zip").build().toString())
		.contentType(MediaType.parseMediaType("application/zip"))
		.body(exporter.exportZip())

	/** Throws away the database and loads the seed again. */
	@PostMapping("/reseed")
	fun reseed(flash: RedirectAttributes): String {
		try {
			seed.reload()
			flash.addFlashAttribute("message", "시드에서 다시 불러왔습니다.")
		} catch (e: InvalidSeedException) {
			flash.addFlashAttribute("error", e.message)
		}
		return "redirect:/admin"
	}
}
