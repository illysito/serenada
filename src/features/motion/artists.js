import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

function artists() {
  const artistImages = [...document.querySelectorAll('.artist-img')]
  const artistNames = [...document.querySelectorAll('.artist-name')]
  const artistArrows = [...document.querySelectorAll('.artist-arrow')]
  const artistDescriptions = [
    ...document.querySelectorAll('.artist-decription'),
  ]

  const texts = [...artistNames, ...artistArrows]

  // wrap in overflow hidden
  texts.forEach((el) => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('overflow-hidden')

    el.parentNode.insertBefore(wrapper, el)
    wrapper.appendChild(el)
  })

  artistDescriptions.forEach((text) => {
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
  gsap.set(texts, {
    opacity: 0,
    yPercent: 100,
  })

  // move things on scroll
  artistNames.forEach((t) => {
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

  artistArrows.forEach((t) => {
    gsap.to(t, {
      delay: 0.2,
      opacity: 1,
      duration: 1.2,
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

  artistDescriptions.forEach((text) => {
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

  artistImages.forEach((img) => {
    gsap.to(img, {
      y: 20,
      scrollTrigger: {
        trigger: img,
        start: 'top 100%',
        end: 'top 0%',
      },
    })
  })
}

export default artists
