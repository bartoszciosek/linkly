package net.bartoszciosek.backend

import kotlinx.serialization.Serializable

@Serializable
data class SavedLink(
    val id: Int,
    val url: String,
    val title: String,
    val imageUrl: String? = null,
    val domain: String
)