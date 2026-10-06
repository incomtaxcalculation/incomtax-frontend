// app/sitemap.ts
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.incometaxcalculation.pk'
const API_URL = 'https://api.incometaxcalculation.pk/api'
const PAGE_SIZE = 50

// Revalidate the sitemap at most once per hour
export const revalidate = 3600

// Match your real URL format (trailing slash)
const withSlash = (path: string) =>
  `${BASE_URL}${path}${path.endsWith('/') ? '' : '/'}`

type ContentItem = {
  slug: string
  status?: string
  updatedAt?: string
  createdAt?: string
}

/**
 * Fetches every item from a paginated endpoint.
 * `resource` is the path ("blogs" | "services"), `key` is the array name in the
 * response, and `status` is the value the API expects for live content.
 */
async function fetchAll(
  resource: 'blogs' | 'services',
  status: 'published' | 'active'
): Promise<ContentItem[]> {
  const all = new Map<string, ContentItem>() // keyed by slug, prevents duplicates

  try {
    for (let page = 1; page <= 50; page++) {
      const res = await fetch(
        `${API_URL}/${resource}?limit=${PAGE_SIZE}&page=${page}&status=${status}`,
        { next: { revalidate: 3600 } }
      )
      if (!res.ok) break

      const data = await res.json()
      const items: ContentItem[] = Array.isArray(data?.[resource])
        ? data[resource]
        : []

      const before = all.size
      for (const item of items) {
        // Skip anything that isn't live, even if the API filter misses it
        if (item.slug && item.status === status) all.set(item.slug, item)
      }

      // Stop on the last page, or if the API ignores `page` and repeats results
      if (items.length < PAGE_SIZE || all.size === before) break
    }
  } catch (error) {
    console.error(`Sitemap: failed to fetch ${resource}`, error)
  }

  return Array.from(all.values())
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services] = await Promise.all([
    fetchAll('blogs', 'published'),
    fetchAll('services', 'active'),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: withSlash('/'), changeFrequency: 'weekly', priority: 1 },
    { url: withSlash('/services'), changeFrequency: 'monthly', priority: 0.9 },
    { url: withSlash('/blog'), changeFrequency: 'weekly', priority: 0.8 },
    { url: withSlash('/videos'), changeFrequency: 'monthly', priority: 0.6 },
    { url: withSlash('/about'), changeFrequency: 'yearly', priority: 0.5 },
    { url: withSlash('/contact'), changeFrequency: 'yearly', priority: 0.5 },
  ]

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: withSlash(`/services/${s.slug}`),
    lastModified: new Date(s.updatedAt ?? s.createdAt ?? Date.now()),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: withSlash(`/blog/${p.slug}`),
    lastModified: new Date(p.updatedAt ?? p.createdAt ?? Date.now()),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...servicePages, ...blogPages]
}