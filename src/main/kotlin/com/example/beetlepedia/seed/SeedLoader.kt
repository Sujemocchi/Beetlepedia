package com.example.beetlepedia.seed

import com.example.beetlepedia.repository.TaxonGroupRepository
import com.example.beetlepedia.validation.RangeContext
import com.example.beetlepedia.validation.TaxonomyValidator
import jakarta.persistence.EntityManager
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

/** Raised when the seed breaks a data rule; lists every problem. */
class InvalidSeedException(val problems: List<Any>) :
	IllegalStateException("The seed data has ${problems.size} problem(s):\n" + problems.joinToString("\n") { "  - $it" })

/**
 * Fills an empty database from src/main/resources/seed at start-up.
 * Does nothing when the database already has data. Disable with `beetlepedia.seed.enabled=false`.
 */
@Component
@ConditionalOnProperty(name = ["beetlepedia.seed.enabled"], havingValue = "true", matchIfMissing = true)
class SeedLoader(
	private val importer: SeedImporter,
	private val validator: TaxonomyValidator,
	private val groups: TaxonGroupRepository,
	private val em: EntityManager,
) : ApplicationRunner {

	private val log = LoggerFactory.getLogger(javaClass)

	@Transactional
	override fun run(args: ApplicationArguments) {
		if (groups.count() > 0) {
			log.info("Database already has data; seed not loaded")
			return
		}
		val graph = importer.read()
		val problems = graph.problems + validator.validateAll(
			graph.groups, graph.genera, RangeContext(graph.countries.keys, graph.areas),
		)
		if (problems.isNotEmpty()) throw InvalidSeedException(problems)

		// Everything is new: persist (not merge) so the whole graph is written as built, in one transaction.
		(graph.sources.values + graph.images.values + graph.countries.values + graph.maps.values + graph.areas.values +
			graph.baseRanks + graph.groups + graph.genera + graph.taxa).forEach(em::persist)
		log.info(
			"Seed loaded: {} groups, {} genera, {} taxa, {} sources, {} images",
			graph.groups.size, graph.genera.size, graph.taxa.size, graph.sources.size, graph.images.size,
		)
	}
}
