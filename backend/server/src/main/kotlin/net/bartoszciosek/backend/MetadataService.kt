package net.bartoszciosek.backend

import org.jsoup.Jsoup
import java.net.URI

class MetadataService {

    fun fetchMetadata(rawUrl: String): Pair<String, String?> {
        val formattedUrl = if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
            "https://$rawUrl"
        } else rawUrl

        return try {
            val doc = Jsoup.connect(formattedUrl)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .timeout(5000)
                .get()

            val title = doc.select("meta[property=og:title]").attr("content")
                .ifBlank { doc.title() }
                .ifBlank { formattedUrl }

            var imageUrl: String? = doc.select("meta[property=og:image]").attr("content")
            if (imageUrl.isNullOrBlank()) imageUrl = null

            Pair(title, imageUrl)
        } catch (e: Exception) {
            Pair(formattedUrl, null)
        }
    }

    fun extractDomain(rawUrl: String): String {
        val formattedUrl = if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
            "https://$rawUrl"
        } else rawUrl

        return try {
            URI(formattedUrl).host ?: "nieznana strona"
        } catch (e: Exception) {
            "błędny adres"
        }
    }
}