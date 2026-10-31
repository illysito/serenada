import artists from './features/motion/artists'
import manifest from './features/motion/claim'
import hero from './features/motion/hero'
import info from './features/motion/info'
import lineup from './features/motion/lineup'
import menu from './features/motion/menu'
import nav from './features/motion/nav'
import preloader from './features/motion/preloader'
import tags from './features/motion/tags'
import world from './features/world/three/world'

import './styles/style.css'

console.log('Serenada 26')

function isMobile() {
  return window.matchMedia('(max-width: 667px)').matches
}

world()
nav()
if (isMobile()) {
  menu()
}
if (!isMobile()) {
  hero()
}
manifest()
tags()
lineup()
artists()
info()
preloader()

// force scroll to top
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

window.addEventListener('load', () => {
  window.scrollTo(0, 0)
})
