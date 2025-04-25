// This is a compatibility layer for components that need headers functionality
// but might be used in both pages/ and app/ directories

export function getHeaders() {
  // In pages/ directory, we return empty headers
  // In app/ directory, this would use the real headers API
  return new Map()
}

export function getCookies() {
  // Safe fallback for pages/ directory
  return {}
}
