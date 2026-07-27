package net.bartoszciosek.backend

import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger

class LinkRepository {
    private val linksStorage = ConcurrentHashMap<Int, SavedLink>()
    private val idCounter = AtomicInteger(1)

    fun getAll(): List<SavedLink> {
        return linksStorage.values.toList().reversed()
    }

    fun add(url: String, title: String, imageUrl: String?, domain: String): SavedLink {
        val id = idCounter.getAndIncrement()
        val link = SavedLink(id = id, url = url, title = title, imageUrl = imageUrl, domain = domain)
        linksStorage[id] = link
        return link
    }

    fun delete(id: Int): Boolean {
        return linksStorage.remove(id) != null
    }
}