package net.bartoszciosek.backend

import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.linkRouting(
    repository: LinkRepository,
    metadataService: MetadataService
) {
    route("/api/links") {
        
        // GET /api/links
        get {
            call.respond(repository.getAll())
        }

        // POST /api/links
        post {
            val request = call.receive<CreateLinkRequest>()
            val rawUrl = request.url.trim()

            if (rawUrl.isBlank()) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Adres URL nie może być pusty"))
                return@post
            }

            val (title, imageUrl) = metadataService.fetchMetadata(rawUrl)
            val domain = metadataService.extractDomain(rawUrl)

            val newLink = repository.add(
                url = rawUrl,
                title = title,
                imageUrl = imageUrl,
                domain = domain
            )

            call.respond(HttpStatusCode.Created, newLink)
        }

        // DELETE /api/links/{id}
        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id != null && repository.delete(id)) {
                call.respond(HttpStatusCode.NoContent)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Nie znaleziono linku"))
            }
        }
    }
}