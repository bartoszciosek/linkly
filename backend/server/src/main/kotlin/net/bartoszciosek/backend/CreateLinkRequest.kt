package net.bartoszciosek.backend

import kotlinx.serialization.Serializable

@Serializable
data class CreateLinkRequest(
    val url: String
)