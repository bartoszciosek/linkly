package net.bartoszciosek

import io.ktor.server.engine.*
import io.ktor.server.application.*
import net.bartoszciosek.backend.LinkRepository

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.calllogging.CallLogging
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.routing.*
import net.bartoszciosek.backend.MetadataService
import net.bartoszciosek.backend.linkRouting

fun main() {
    val linkRepository = LinkRepository()
    val metadataService = MetadataService()

    embeddedServer(Netty, port = 8080) {
        install(CallLogging)
        install(ContentNegotiation) {
            json()
        }
        install(CORS) {
            allowHost("localhost:5173")
            allowHeader(HttpHeaders.ContentType)
            allowMethod(HttpMethod.Options)
            allowMethod(HttpMethod.Post)
            allowMethod(HttpMethod.Get)
            allowMethod(HttpMethod.Delete)
        }
        routing {
            linkRouting(linkRepository, metadataService)
        }
    }.start(wait = true)
}