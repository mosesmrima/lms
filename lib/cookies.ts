"use client"

/**
 * Sets a cookie with the given name, value, and expiration days
 */
export function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

/**
 * Gets a cookie by name
 */
export function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(";").shift()!)
  }
  return null
}

/**
 * Removes a cookie by name
 */
export function removeCookie(name: string) {
  document.cookie = `${name}=; Max-Age=-99999999; path=/`
}

// Previously named eraseCookie, now renamed to removeCookie for consistency
export function eraseCookie(name: string) {
  removeCookie(name)
}
