package com.example.beetlepedia.seed

import com.example.beetlepedia.domain.Area
import org.springframework.core.io.support.PathMatchingResourcePatternResolver
import org.springframework.stereotype.Component
import tools.jackson.databind.JsonNode
import tools.jackson.databind.json.JsonMapper

/** One polygon part of a region map: its country and the centroid used for area matching. */
data class MapPart(val iso: String, val lon: Double, val lat: Double)

/**
 * The polygon parts of every region map, read from the map files the pages use
 * (static/assets/maps/<region>.js: `window.BP_MAPS["<region>"] = {...};`).
 * Used to check that a range code shows up on its genus' map.
 */
@Component
class MapGeometry(jsonMapper: JsonMapper) {

	val regions: Map<String, List<MapPart>> = PathMatchingResourcePatternResolver()
		.getResources("classpath:static/assets/maps/*.js")
		.associate { res ->
			val js = res.inputStream.use { it.readBytes().toString(Charsets.UTF_8) }
			val match = Regex("""BP_MAPS\["([\w-]+)"]\s*=\s*""").find(js) ?: error("not a region map: ${res.filename}")
			val json = js.substring(match.range.last + 1).trimEnd().removeSuffix(";")
			val paths = jsonMapper.readTree(json).get("paths")
			val parts = (0 until paths.size()).map { i ->
				val p: JsonNode = paths.get(i)
				MapPart(p.get("iso").asString(), p.get("lon").asDouble(), p.get("lat").asDouble())
			}
			match.groupValues[1] to parts
		}

	/**
	 * Whether [code] (a country code or an [Area]) matches at least one polygon part of [region].
	 * Point areas are drawn as dots at their own coordinates, so they always show.
	 */
	fun covers(region: String, code: String, areas: Map<String, Area>): Boolean {
		val parts = regions[region] ?: return false
		val area = areas[code] ?: return parts.any { it.iso == code }
		if (area.point != null) return true
		return parts.any { p ->
			p.iso in area.countries &&
				(area.box?.contains(p.lon, p.lat) ?: true) &&
				area.excludes.none { it.contains(p.lon, p.lat) }
		}
	}
}
