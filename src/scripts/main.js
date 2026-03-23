import rosetta from 'rosetta'

// ===============
// Storage
// ===============

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

// ===============
// i18n
// ===============

const LANG_KEY = 'lang'
const LANG_EN = 'en'
const LANG_RU = 'ru'

const i18n = rosetta({
  en: {
    heroName: 'Vladislav Romanovsky',
    heroTitle: 'Tech Leader & Serial Entrepreneur',
    heroTagline: 'Building products, teams, and companies',
    resumeTitle: 'Hire Me',
    resumePdf: 'PDF',
    resumeWord: 'Word',
    footer: `© ${new Date().getFullYear()} Vladislav Romanovsky`,
    pageTitle: 'Vladislav Romanovsky — Tech Leader & Serial Entrepreneur',
    metaDescription: 'Tech Leader & Serial Entrepreneur with 15+ years in software engineering and 8+ years leading teams. Engineering Manager, Technical Lead, CTO, and startup founder. Expert in Node.js, React, TypeScript, and cloud architecture. Built products for Fintech, Gaming, SaaS, and AI domains.',
    ogTitle: 'Vladislav Romanovsky — Tech Leader & Serial Entrepreneur',
    ogDescription: '15+ years in software engineering, 8+ years leading teams. Engineering Manager, Tech Lead, CTO & Startup Founder. Node.js, React, TypeScript, Cloud.',
    twitterTitle: 'Vladislav Romanovsky — Tech Leader & Serial Entrepreneur',
    twitterDescription: '15+ years in software engineering, 8+ years leading teams. Engineering Manager, Tech Lead, CTO & Startup Founder.',
    ogLocale: 'en_US',
    switchLang: 'Switch language',
    toggleTheme: 'Toggle theme',
    avatarAlt: 'Vladislav Romanovsky',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    telegram: 'Telegram',
  },
  ru: {
    heroName: 'Владислав Романовский',
    heroTitle: 'Технический лидер и серийный предприниматель',
    heroTagline: 'Создаю продукты, команды и компании',
    resumeTitle: 'Резюме',
    resumePdf: 'PDF',
    resumeWord: 'Word',
    footer: `© ${new Date().getFullYear()} Владислав Романовский`,
    pageTitle: 'Владислав Романовский — Технический лидер и серийный предприниматель',
    metaDescription: 'Технический лидер и серийный предприниматель с 15+ годами в разработке ПО и 8+ годами управления командами. Engineering Manager, Tech Lead, CTO и основатель стартапов. Эксперт в Node.js, React, TypeScript и облачной архитектуре. Создавал продукты для Fintech, Gaming, SaaS и AI.',
    ogTitle: 'Владислав Романовский — Технический лидер и серийный предприниматель',
    ogDescription: '15+ лет в разработке ПО, 8+ лет управления командами. Engineering Manager, Tech Lead, CTO и основатель стартапов. Node.js, React, TypeScript, Cloud.',
    twitterTitle: 'Владислав Романовский — Технический лидер и серийный предприниматель',
    twitterDescription: '15+ лет в разработке ПО, 8+ лет управления командами. Engineering Manager, Tech Lead, CTO и основатель стартапов.',
    ogLocale: 'ru_RU',
    switchLang: 'Сменить язык',
    toggleTheme: 'Сменить тему',
    avatarAlt: 'Владислав Романовский',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    telegram: 'Telegram',
  }
})

const setMeta = (selector, attr, value) => {
  const el = document.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

const applyLang = (lang) => {
  i18n.locale(lang)

  document.documentElement.setAttribute('lang', lang)
  document.documentElement.setAttribute('data-lang', lang)

  // Update all data-i18n elements (textContent)
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n')
    const value = i18n.t(key)
    if (value) el.textContent = value
  })

  // Update title attributes
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const value = i18n.t(el.getAttribute('data-i18n-title'))
    if (value) el.setAttribute('title', value)
  })

  // Update aria-label attributes
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const value = i18n.t(el.getAttribute('data-i18n-aria'))
    if (value) el.setAttribute('aria-label', value)
  })

  // Update alt attributes
  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const value = i18n.t(el.getAttribute('data-i18n-alt'))
    if (value) el.setAttribute('alt', value)
  })

  // Update document title
  document.title = i18n.t('pageTitle')

  // Update meta tags
  setMeta('meta[name="title"]', 'content', i18n.t('pageTitle'))
  setMeta('meta[name="description"]', 'content', i18n.t('metaDescription'))
  setMeta('meta[property="og:title"]', 'content', i18n.t('ogTitle'))
  setMeta('meta[property="og:description"]', 'content', i18n.t('ogDescription'))
  setMeta('meta[property="og:locale"]', 'content', i18n.t('ogLocale'))
  setMeta('meta[name="twitter:title"]', 'content', i18n.t('twitterTitle'))
  setMeta('meta[name="twitter:description"]', 'content', i18n.t('twitterDescription'))
}

const getSystemLang = () => {
  const browserLang = navigator.language || ''
  return browserLang.startsWith('ru') ? LANG_RU : LANG_EN
}

const initLang = () => {
  const langSwitch = document.querySelector('.lang-switch')
  const label = langSwitch?.querySelector('.lang-switch__label')

  const savedLang = storage.get(LANG_KEY)
  const initialLang = savedLang || getSystemLang()

  applyLang(initialLang)

  const updateLabel = (lang) => {
    if (label) label.textContent = lang === LANG_EN ? 'EN' : 'RU'
  }

  updateLabel(initialLang)

  if (!langSwitch) return

  langSwitch.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-lang') || LANG_EN
    const next = current === LANG_EN ? LANG_RU : LANG_EN
    applyLang(next)
    updateLabel(next)
    storage.set(LANG_KEY, next)
  })
}

// ===============
// Theme Switcher
// ===============

const THEME_KEY = 'theme'
const THEME_DARK = 'dark'
const THEME_LIGHT = 'light'
const THEME_ATTR = 'data-theme'

const initTheme = () => {
  const themeSwitch = document.querySelector('.theme-switch')
  if (!themeSwitch) return

  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT
  }

  const savedTheme = storage.get(THEME_KEY)
  const initialTheme = savedTheme || getSystemTheme()

  document.documentElement.setAttribute(THEME_ATTR, initialTheme)

  const getCurrentTheme = () => {
    return document.documentElement.getAttribute(THEME_ATTR) || THEME_LIGHT
  }

  themeSwitch.addEventListener('click', () => {
    const current = getCurrentTheme()
    const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK

    document.documentElement.setAttribute(THEME_ATTR, next)
    storage.set(THEME_KEY, next)
  })

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches }) => {
    if (!storage.get(THEME_KEY)) {
      const systemTheme = matches ? THEME_DARK : THEME_LIGHT
      document.documentElement.setAttribute(THEME_ATTR, systemTheme)
    }
  })
}

// ===============
// Entrance Animations
// ===============

const animateOnLoad = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const selectors = [
    { selector: '.hero', delay: 0 },
    { selector: '.resume', delay: 150 },
    { selector: '.controls', delay: 300 },
    { selector: '.footer', delay: 400 }
  ]

  const elements = selectors
    .map(({ selector, delay }) => ({
      element: document.querySelector(selector),
      delay
    }))
    .filter(({ element }) => element)

  elements.forEach(({ element }) => {
    element.classList.add('animate-hidden')
  })

  requestAnimationFrame(() => {
    elements.forEach(({ element, delay }) => {
      setTimeout(() => {
        element.classList.remove('animate-hidden')
        element.classList.add('animate-visible')
      }, delay)
    })
  })
}

// ===============
// Initialize
// ===============

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initTheme()
    initLang()
    animateOnLoad()
  })
} else {
  initTheme()
  initLang()
  animateOnLoad()
}
