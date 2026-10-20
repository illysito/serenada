import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function tags() {
  const tags = [...document.querySelectorAll('.tag')]
  const tagLines = [...document.querySelectorAll('.tag-line')]

  // set things up
  gsap.set(tagLines, {
    scaleX: 0,
    transformOrigin: 'left center',
  })

  gsap.set(tags, {
    opacity: 0,
    yPercent: 100,
  })

  // move them on scroll
  tagLines.forEach((line) => {
    gsap.to(line, {
      scaleX: 1,
      duration: 2.2,
      ease: 'expo.inOut',
      scrollTrigger: {
        trigger: line,
        start: 'top 98%',
      },
    })
  })

  tags.forEach((line) => {
    gsap.to(line, {
      opacity: 1,
      yPercent: 0,
      duration: 1.4,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: line,
        start: 'top 98%',
      },
    })
  })
}

export default tags
