package com.example.beetlepedia.admin

import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.factory.PasswordEncoderFactories
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import org.springframework.security.web.SecurityFilterChain
import java.security.SecureRandom
import java.util.Base64

/** `beetlepedia.admin.*` — the single admin account. */
@ConfigurationProperties("beetlepedia.admin")
data class AdminProperties(val username: String = "admin", val password: String? = null)

/**
 * Only /admin needs a login; the public pages and the read API stay open.
 * CSRF protection stays on (the admin forms carry the token).
 */
@Configuration
@EnableConfigurationProperties(AdminProperties::class)
class SecurityConfig {

	private val log = LoggerFactory.getLogger(javaClass)

	@Bean
	fun securityFilterChain(http: HttpSecurity): SecurityFilterChain = http
		.authorizeHttpRequests {
			it.requestMatchers("/admin/login").permitAll()
				.requestMatchers("/admin/**").hasRole("ADMIN")
				.anyRequest().permitAll()
		}
		.formLogin { it.loginPage("/admin/login").defaultSuccessUrl("/admin", true).permitAll() }
		.logout { it.logoutUrl("/admin/logout").logoutSuccessUrl("/") }
		.build()

	@Bean
	fun passwordEncoder(): PasswordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder()

	@Bean
	fun adminUsers(props: AdminProperties, encoder: PasswordEncoder): UserDetailsService {
		val password = props.password?.takeIf { it.isNotBlank() } ?: generatedPassword().also {
			log.warn("No beetlepedia.admin.password set. Admin login for this run: {} / {}", props.username, it)
		}
		return InMemoryUserDetailsManager(
			User.withUsername(props.username).password(encoder.encode(password)).roles("ADMIN").build(),
		)
	}

	private fun generatedPassword(): String =
		Base64.getUrlEncoder().withoutPadding().encodeToString(ByteArray(15).also { SecureRandom().nextBytes(it) })
}
