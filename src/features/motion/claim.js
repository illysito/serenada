import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

function manifest() {
  const claimLines = [...document.querySelectorAll('.manifest-h')]

  // wrap in overflow hidden

  claimLines.forEach((text) => {
    const split = new SplitType(text, {
      types: 'lines',
    })

    split.lines.forEach((line) => {
      const wrapper = document.createElement('div')
      wrapper.classList.add('overflow-hidden')

      line.parentNode.insertBefore(wrapper, line)
      wrapper.appendChild(line)

      gsap.set(line, {
        opacity: 0,
        yPercent: 100,
      })
    })
  })

  // move things on scroll
  claimLines.forEach((t) => {
    const lines = t.querySelectorAll('.line')
    gsap.to(lines, {
      opacity: 1,
      yPercent: 0,
      duration: 1.8,
      scrollTrigger: {
        trigger: t,
        start: 'top 98%',
        // end: 'top 20%',
        // scrub: 1.5,
        // markers: true,
      },
    })
  })
}

export default manifest
