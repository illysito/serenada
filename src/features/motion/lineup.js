import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function lineup() {
  const dayTitles = [...document.querySelectorAll('.day-title')]
  const showTitles = [...document.querySelectorAll('.show-title')]
  const showInfos = [...document.querySelectorAll('.show-info')]
  const dayShowWrappers = [...document.querySelectorAll('.day-show-wrapper')]

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

  const duration = 0.8
  dayShowWrappers.forEach((w) => {
    const texts = w.querySelectorAll('h4')
    const button = w.querySelector('.button')
    const buttonText = w.querySelector('.is--button')
    const overlay = w.lastElementChild
    w.addEventListener('mouseenter', () => {
      gsap.to(overlay, {
        yPercent: 100,
        duration: duration,
        ease: 'power2.out',
      })
      gsap.to(texts, {
        color: '#548945',
        duration: duration,
        ease: 'power2.out',
      })
      gsap.to(button, {
        backgroundColor: '#548945',
        duration: duration,
        ease: 'power2.out',
      })
      gsap.to(buttonText, {
        color: '#f4ff64',
        duration: duration,
        ease: 'power2.out',
      })
    })
    w.addEventListener('mouseleave', () => {
      gsap.to(overlay, {
        yPercent: 0,
        duration: duration,
        ease: 'power2.out',
      })
      gsap.to(texts, {
        color: '#f4ff64',
        duration: duration,
        ease: 'power2.out',
      })
      gsap.to(button, {
        backgroundColor: '#f4ff64',
        duration: duration,
        ease: 'power2.out',
      })
      gsap.to(buttonText, {
        color: '#548945',
        duration: duration,
        ease: 'power2.out',
      })
    })
  })
}

export default lineup
