import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function hero() {
  const metaLines = [...document.querySelectorAll('.hero-meta')]
  const heroSeparator = document.querySelector('.hero__separator')
  const heroImg = document.querySelector('.hero-img-title')

  // move things on scroll
  metaLines.forEach((line) => {
    gsap.to(line, {
      yPercent: -100,
      opacity: 0,
      // ease: 'power2.inOut',
      scrollTrigger: {
        trigger: heroSeparator,
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: 1.5,
        // markers: true,
      },
    })
  })

  gsap.to(heroImg, {
    // yPercent: -100,
    opacity: 0,
    // ease: 'power2.inOut',
    scrollTrigger: {
      trigger: heroSeparator,
      start: 'bottom bottom',
      end: 'bottom 32%',
      scrub: 1.5,
      // markers: true,
    },
  })
}

export default hero
