package com.example.beetlepedia.api

import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice

/** Read-only API over the taxonomy (groups → genera → taxa). */
@RestController
@RequestMapping("/api")
class TaxonomyApiController(private val service: TaxonomyQueryService) {

	/**
	 * Page data in the shape of window.BP.
	 * `?scope=summary` for the home and group pages, `?genus=<id>` or `?taxon=<id>` for one genus in full;
	 * no parameter returns everything.
	 */
	@GetMapping("/bootstrap")
	fun bootstrap(
		@RequestParam(required = false) scope: String?,
		@RequestParam(required = false) genus: String?,
		@RequestParam(required = false) taxon: String?,
	) = service.bootstrap(
		when {
			genus != null -> BootstrapScope.Genus(genus)
			taxon != null -> BootstrapScope.Taxon(taxon)
			scope == null || scope == "all" -> BootstrapScope.All
			scope == "summary" -> BootstrapScope.Summary
			else -> throw IllegalArgumentException("scope must be 'all' or 'summary'")
		},
	)

	@GetMapping("/groups")
	fun groups() = service.groups()

	@GetMapping("/groups/{id}")
	fun group(@PathVariable id: String) = service.group(id)

	@GetMapping("/genera")
	fun genera() = service.genera()

	@GetMapping("/genera/{id}")
	fun genus(@PathVariable id: String) = service.genus(id)

	@GetMapping("/taxa/{id}")
	fun taxon(@PathVariable id: String) = service.taxon(id)

	@GetMapping("/taxa")
	fun search(
		@RequestParam(required = false) q: String?,
		@RequestParam(required = false) group: String?,
		@RequestParam(required = false) genus: String?,
		@RequestParam(required = false) rank: String?,
		@RequestParam(required = false) minLength: Double?,
		@RequestParam(required = false) maxLength: Double?,
		@RequestParam(required = false) country: String?,
		@RequestParam(required = false) hasImage: Boolean?,
	) = service.search(TaxonSearch(q, group, genus, rank, minLength, maxLength, country, hasImage))
}

@RestControllerAdvice(assignableTypes = [TaxonomyApiController::class])
class ApiExceptionHandler {

	@ExceptionHandler(NotFoundException::class)
	fun notFound(e: NotFoundException): ProblemDetail =
		ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.message ?: "not found")

	@ExceptionHandler(IllegalArgumentException::class)
	fun badRequest(e: IllegalArgumentException): ProblemDetail =
		ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.message ?: "bad request")
}
