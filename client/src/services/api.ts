// API service functions
import { supabase } from '../utils/supabase'

// Use a relative URL so the Vite proxy works across environments.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

// Pages API
export async function fetchPage(slug: string, language: string) {
  return fetchAPI(`/pages/${slug}/${language}`)
}

export async function fetchPages(language: string) {
  return fetchAPI(`/pages/${language}`)
}

// Blog API
export async function fetchBlogPosts(
  language: string,
  limit: number = 10,
  category?: string
) {
  const params = new URLSearchParams({ limit: limit.toString() })
  if (category) {
    params.append('category', category)
  }
  return fetchAPI(`/blog/${language}?${params}`)
}

export async function fetchBlogPost(language: string, slug: string) {
  return fetchAPI(`/blog/${language}/${slug}`)
}

export async function fetchCategories(language: string) {
  return fetchAPI(`/blog/${language}/categories/list`)
}

// References API
export async function fetchReferences(language: string, featured?: boolean) {
  const params = featured ? '?featured=true' : ''
  return fetchAPI(`/references/${language}${params}`)
}

// Media API
export async function fetchMedia(limit: number = 50) {
  return fetchAPI(`/media?limit=${limit}`)
}

// Services API
export async function fetchServices(language: string, published: boolean = true) {
  const params = published ? '?published=true' : ''
  return fetchAPI(`/services/${language}${params}`)
}

export async function fetchService(slug: string, language: string) {
  return fetchAPI(`/services/${language}/${slug}`)
}

export async function fetchMediaItem(id: string) {
  return fetchAPI(`/media/${id}`)
}

// Menu API
export async function fetchMenu(language: string) {
  return fetchAPI(`/menu/${language}`)
}

// Newsletter API
export async function subscribeNewsletter(email: string, name?: string, language?: string, source?: string) {
  return fetchAPI('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email, name, language, source }),
  })
}

export async function unsubscribeNewsletter(email: string) {
  return fetchAPI('/newsletter/unsubscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

// Analytics API
export async function trackVisit(data: {
  page_path: string
  page_title?: string
  referrer?: string
  user_agent?: string
  ip_address?: string
  country?: string
  language?: string
  session_id?: string
  duration_seconds?: number
}) {
  return fetchAPI('/analytics/visit', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Settings API
export async function fetchSettings(category?: string, language?: string) {
  const params = new URLSearchParams()
  if (category) params.append('category', category)
  if (language) params.append('language', language)
  const query = params.toString()
  return fetchAPI(`/settings${query ? `?${query}` : ''}`)
}

export async function fetchSetting(key: string, language?: string) {
  const query = language ? `?language=${language}` : ''
  return fetchAPI(`/settings/${key}${query}`)
}

// Contact form API
export async function submitContactForm(data: {
  name: string
  email: string
  subject: string
  message: string
  service_type?: string
}) {
  return fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Admin API - requires authentication
async function fetchAdminAPI(endpoint: string, options: RequestInit = {}) {
  // Read the auth token from the current Supabase session.
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    throw new Error('Not authenticated')
  }

  if (!session) {
    throw new Error('Not authenticated')
  }

  const token = session.access_token

  return fetchAPI(endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })
}

// Dashboard Statistics
export async function fetchDashboardStats() {
  return fetchAdminAPI('/admin/dashboard/stats')
}

export async function fetchAnalyticsStats() {
  return fetchAdminAPI('/admin/analytics/stats')
}

// Admin Pages API
export async function fetchAdminPages() {
  return fetchAdminAPI('/admin/pages')
}

export async function createAdminPage(page: any) {
  return fetchAdminAPI('/admin/pages', {
    method: 'POST',
    body: JSON.stringify(page),
  })
}

export async function updateAdminPage(id: string, page: any) {
  return fetchAdminAPI(`/admin/pages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(page),
  })
}

export async function deleteAdminPage(id: string) {
  return fetchAdminAPI(`/admin/pages/${id}`, {
    method: 'DELETE',
  })
}

// Admin Blog API
export async function fetchAdminBlogPosts() {
  return fetchAdminAPI('/admin/blog')
}

export async function createAdminBlogPost(post: any) {
  return fetchAdminAPI('/admin/blog', {
    method: 'POST',
    body: JSON.stringify(post),
  })
}

export async function updateAdminBlogPost(id: string, post: any) {
  return fetchAdminAPI(`/admin/blog/${id}`, {
    method: 'PUT',
    body: JSON.stringify(post),
  })
}

export async function deleteAdminBlogPost(id: string) {
  return fetchAdminAPI(`/admin/blog/${id}`, {
    method: 'DELETE',
  })
}

// Admin Services API
export async function fetchAdminServices() {
  return fetchAdminAPI('/admin/services')
}

export async function createAdminService(service: any) {
  return fetchAdminAPI('/admin/services', {
    method: 'POST',
    body: JSON.stringify(service),
  })
}

export async function updateAdminService(id: string, service: any) {
  return fetchAdminAPI(`/admin/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(service),
  })
}

export async function deleteAdminService(id: string) {
  return fetchAdminAPI(`/admin/services/${id}`, {
    method: 'DELETE',
  })
}

// Admin References API
export async function fetchAdminReferences() {
  return fetchAdminAPI('/admin/references')
}

export async function createAdminReference(reference: any) {
  return fetchAdminAPI('/admin/references', {
    method: 'POST',
    body: JSON.stringify(reference),
  })
}

export async function updateAdminReference(id: string, reference: any) {
  return fetchAdminAPI(`/admin/references/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reference),
  })
}

export async function deleteAdminReference(id: string) {
  return fetchAdminAPI(`/admin/references/${id}`, {
    method: 'DELETE',
  })
}

// Admin Media API
export async function fetchAdminMedia() {
  return fetchAdminAPI('/admin/media')
}

export async function deleteAdminMedia(id: string) {
  return fetchAdminAPI(`/admin/media/${id}`, {
    method: 'DELETE',
  })
}

// Admin Menu API
export async function fetchAdminMenu(lang: string = 'en') {
  return fetchAdminAPI(`/admin/menu?lang=${lang}`)
}

export async function createAdminMenuItem(menuItem: any) {
  return fetchAdminAPI('/admin/menu', {
    method: 'POST',
    body: JSON.stringify(menuItem),
  })
}

export async function updateAdminMenuItem(id: string, menuItem: any) {
  return fetchAdminAPI(`/admin/menu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(menuItem),
  })
}

export async function deleteAdminMenuItem(id: string) {
  return fetchAdminAPI(`/admin/menu/${id}`, {
    method: 'DELETE',
  })
}

// Admin Analytics API
export async function fetchAdminAnalytics(params?: any) {
  const query = params ? `?${new URLSearchParams(params)}` : ''
  return fetchAdminAPI(`/admin/analytics/stats${query}`)
}

// Admin Newsletter API
export async function fetchAdminNewsletterSubscribers() {
  return fetchAdminAPI('/admin/newsletter/subscribers')
}

export async function deleteAdminNewsletterSubscriber(id: string) {
  return fetchAdminAPI(`/admin/newsletter/subscribers/${id}`, {
    method: 'DELETE',
  })
}

// Admin Settings API
export async function fetchAdminSettings(category?: string) {
  const query = category ? `?category=${category}` : ''
  return fetchAdminAPI(`/admin/settings${query}`)
}

export async function updateAdminSetting(key: string, value: string, language?: string) {
  return fetchAdminAPI(`/admin/settings/key/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value, language }),
  })
}

// Admin Contact API
export async function fetchAdminContactMessages() {
  return fetchAdminAPI('/contact')
}

export async function deleteAdminContactMessage(id: string) {
  return fetchAdminAPI(`/contact/${id}`, {
    method: 'DELETE',
  })
}

export async function markAdminContactMessageAsRead(id: string) {
  return fetchAdminAPI(`/contact/${id}/read`, {
    method: 'PUT',
  })
}

// Client Logos API
export async function fetchClientLogos() {
  const { data, error } = await supabase
    .from('client_logos')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

// Admin Client Logos API
export async function fetchAdminClientLogos() {
  return fetchAdminAPI('/admin/client-logos')
}

export async function createAdminClientLogo(logo: any) {
  return fetchAdminAPI('/admin/client-logos', {
    method: 'POST',
    body: JSON.stringify(logo),
  })
}

export async function updateAdminClientLogo(id: string, logo: any) {
  return fetchAdminAPI(`/admin/client-logos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(logo),
  })
}

export async function deleteAdminClientLogo(id: string) {
  return fetchAdminAPI(`/admin/client-logos/${id}`, {
    method: 'DELETE',
  })
}


