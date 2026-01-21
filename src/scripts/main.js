// Theme Switcher
// ===============

// Constants
const THEME_KEY = 'theme'
const THEME_DARK = 'dark'
const THEME_LIGHT = 'light'
const THEME_ATTR = 'data-theme'

// Safe localStorage wrapper (handles private browsing mode)
const storage = {
  get: (key) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch {
      // Ignore - storage unavailable
    }
  }
}

const initTheme = () => {
  const themeSwitch = document.querySelector('.theme-switch')
  if (!themeSwitch) return

  // Detect system theme preference
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT
  }

  // Get saved theme or use system preference
  const savedTheme = storage.get(THEME_KEY)
  const initialTheme = savedTheme || getSystemTheme()

  // Apply theme
  document.documentElement.setAttribute(THEME_ATTR, initialTheme)

  // Get current effective theme
  const getCurrentTheme = () => {
    return document.documentElement.getAttribute(THEME_ATTR) || THEME_LIGHT
  }

  // Toggle theme
  themeSwitch.addEventListener('click', () => {
    const current = getCurrentTheme()
    const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK

    document.documentElement.setAttribute(THEME_ATTR, next)
    storage.set(THEME_KEY, next)
  })

  // Listen for system theme changes (only if user hasn't manually selected)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches }) => {
    if (!storage.get(THEME_KEY)) {
      const systemTheme = matches ? THEME_DARK : THEME_LIGHT
      document.documentElement.setAttribute(THEME_ATTR, systemTheme)
    }
  })
}

// Entrance animations
// Staggered reveal on page load

const animateOnLoad = () => {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const selectors = [
    { selector: '.hero', delay: 0 },
    { selector: '.resume', delay: 150 },
    { selector: '.theme-switch', delay: 300 },
    { selector: '.footer', delay: 400 }
  ]

  // Cache DOM elements once
  const elements = selectors
    .map(({ selector, delay }) => ({
      element: document.querySelector(selector),
      delay
    }))
    .filter(({ element }) => element)

  // Set initial hidden state
  elements.forEach(({ element }) => {
    element.classList.add('animate-hidden')
  })

  // Animate in with stagger
  requestAnimationFrame(() => {
    elements.forEach(({ element, delay }) => {
      setTimeout(() => {
        element.classList.remove('animate-hidden')
        element.classList.add('animate-visible')
      }, delay)
    })
  })
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initTheme()
    animateOnLoad()
  })
} else {
  initTheme()
  animateOnLoad()
}
