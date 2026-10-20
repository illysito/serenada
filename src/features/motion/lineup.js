import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function lineup() {
  const dayTitles = [...document.querySelectorAll('.day-title')]
  const showTitles = [...document.querySelectorAll('.show-title')]
  const showInfos = [...document.querySelectorAll('.show-info')]

  const texts = [...dayTitles, ...showTitles, ...showInfos]

  texts.forEach((el) => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('overflow-hidden')

    el.parentNode.insertBefore(wrapper, el)
    wrapper.appendChild(el)
  })

  gsap.set(texts, {
    opacity: 0,
    yPercent: 100,
  })

  // move things on scroll
  dayTitles.forEach((t) => {
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

  showInfos.forEach((t) => {
    gsap.to(t, {
      opacity: 1,
      duration: 0.8,
      yPercent: 0,
      scrollTrigger: {
        trigger: t,
        start: 'top 98%',
        // end: 'top 20%',
        // scrub: 1.5,
        // markers: true,
      },
    })
  })

  showTitles.forEach((t) => {
    gsap.to(t, {
      opacity: 1,
      duration: 0.8,
      yPercent: 0,
      scrollTrigger: {
        trigger: t,
        start: 'top 98%',
        // end: 'top 60%',
        // scrub: 1.5,
        // markers: true,
      },
    })
  })
}

export default lineup
