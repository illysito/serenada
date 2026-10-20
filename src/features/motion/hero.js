import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function hero() {
  const metaLines = [...document.querySelectorAll('.hero-meta')]

  // move things on scroll
  metaLines.forEach((line) => {
    gsap.to(line, {
      yPercent: -100,
      opacity: 0,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: metaLines[0],
        start: 'top 80%',
        end: 'top 40%',
        scrub: 1.5,
        // markers: true,
      },
    })
  })
}

export default hero
