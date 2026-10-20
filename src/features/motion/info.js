import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

function info() {
  const infoTitles = [...document.querySelectorAll('.info-title')]
  const infoDescs = [...document.querySelectorAll('.info-desc')]

  // wrap in overflow hidden
  infoTitles.forEach((el) => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('overflow-hidden')

    el.parentNode.insertBefore(wrapper, el)
    wrapper.appendChild(el)
  })

  infoDescs.forEach((text) => {
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

  // set things up
  gsap.set(infoTitles, {
    opacity: 0,
    yPercent: 100,
  })

  // move things on scroll
  infoTitles.forEach((t) => {
    gsap.to(t, {
      opacity: 1,
      yPercent: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: t,
        start: 'top 98%',
        // end: 'top 20%',
        // scrub: 1.5,
        // markers: true,
      },
    })
  })

  infoDescs.forEach((text) => {
    const lines = text.querySelectorAll('.line')

    gsap.to(lines, {
      yPercent: 0,
      opacity: 1,
      duration: 1.6,
      stagger: 0.02,
      // ease: 'power3.out',
      scrollTrigger: {
        trigger: text,
        start: 'top 98%',
        once: true,
      },
    })
  })
}

export default info
