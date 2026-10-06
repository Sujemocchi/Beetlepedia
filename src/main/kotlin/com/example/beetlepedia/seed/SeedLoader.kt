package com.example.beetlepedia.seed

import com.example.beetlepedia.repository.AreaRepository
import com.example.beetlepedia.repository.BaseRankRepository
import com.example.beetlepedia.repository.CountryRepository
import com.example.beetlepedia.repository.GenusRepository
import com.example.beetlepedia.repository.ImageRepository
import com.example.beetlepedia.repository.MapRegionRepository
import com.example.beetlepedia.repository.SourceRepository
import com.example.beetlepedia.repository.TaxonGroupRepository
import com.example.beetlepedia.repository.TaxonRepository
import com.example.beetlepedia.validation.RangeContext
import com.example.beetlepedia.validation.TaxonomyValidator
import jakarta.persistence.EntityManager
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/** Raised when the seed breaks a data rule; lists every problem. */
class InvalidSeedException(val problems: List<Any>) :
	IllegalStateException("The seed data has ${problems.size} problem(s):\n" + problems.joinToString("\n") { "  - $it" })

/** Validates the seed and writes it to the database; can also wipe the database first. */
@Service
class SeedService(
	private val importer: SeedImporter,
	private val validator: TaxonomyValidator,
	private val em: EntityManager,
	private val sources: SourceRepository,
	private val images: ImageRepository,
	private val countries: CountryRepository,
	private val maps: MapRegionRepository,
	private val areas: AreaRepository,
	private val baseRanks: BaseRankRepository,
	private val groups: TaxonGroupRepository,
	private val genera: GenusRepository,
	private val taxa: TaxonRepository,
) {
	private val log = LoggerFactory.getLogger(javaClass)

	fun isEmpty() = groups.count() == 0L

	/** Loads the seed into an empty database. */
	@Transactional
	fun load() {
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

	/**
	 * Replaces the whole database with the seed. The seed is validated after the old rows are
	 * deleted but in the same transaction, so an invalid seed leaves the database untouched.
	 */
	@Transactional
	fun reload() {
		taxa.deleteAll()
		em.flush()
		genera.deleteAll()
		em.flush()
		listOf(groups, areas, baseRanks, maps, countries, images, sources).forEach { it.deleteAll() }
		em.flush()
		em.clear()
		load()
	}
}

/**
 * Fills an empty database from src/main/resources/seed at start-up.
 * Does nothing when the database already has data. Disable with `beetlepedia.seed.enabled=false`.
 */
@Component
@ConditionalOnProperty(name = ["beetlepedia.seed.enabled"], havingValue = "true", matchIfMissing = true)
class SeedLoader(private val seed: SeedService) : ApplicationRunner {

	private val log = LoggerFactory.getLogger(javaClass)

	override fun run(args: ApplicationArguments) {
		if (!seed.isEmpty()) {
			log.info("Database already has data; seed not loaded")
			return
		}
		seed.load()
	}
}
