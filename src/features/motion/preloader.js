import gsap from 'gsap'

function preloader() {
  const preloaderSection = document.querySelector('.preloader__section')
  const line = document.querySelector('.loading-line')
  const header = document.querySelector('.preloader-h')
  const numbers = document.querySelector('.preloader-numbers')
  const nav = document.querySelector('.nav__section')
  const metaLines = [...document.querySelectorAll('.hero-meta')]

  gsap.set(line, {
    scaleX: 0,
    transformOrigin: 'left center',
  })

  metaLines.forEach((line) => {
    gsap.set(line, {
      yPercent: -100,
      opacity: 0,
      duration: 2,
      ease: 'power2.inOut',
    })
  })

  function setProgress(percent, duration) {
    gsap.to(line, {
      opacity: percent,
      scaleX: percent,
      duration: duration,
    })
  }

  let progress = 0
  // console.log(progress)
  // let speed = 0.8
  let targetProgress = 100

  function fakePreloader() {
    // target moves in chunks, like real loading

    targetProgress = 100

    // progress catches up smoothly
    progress += (targetProgress - progress) * 0.04

    if (progress > 99.5) {
      progress = 100
    }

    numbers.textContent = `${Math.floor(progress)}`
    setProgress(progress / 100, 0.4)

    if (progress < 100) {
      requestAnimationFrame(fakePreloader)
    } else {
      gsap.to(preloaderSection, {
        yPercent: -100,
        duration: 1.8,
        ease: 'expo.inOut',
      })
      gsap.to([header, numbers], {
        yPercent: 100,
        delay: 0.2,
        duration: 0.8,
        ease: 'power2.inOut',
      })
      gsap.to(line, {
        opacity: 0,
        yPercent: 100,
        delay: 0.2,
        duration: 0.8,
        ease: 'power2.inOut',
      })
      gsap.to(nav, {
        opacity: 1,
        delay: 1,
        duration: 1.2,
        ease: 'power2.inOut',
      })
      metaLines.forEach((line) => {
        gsap.to(line, {
          yPercent: 0,
          opacity: 1,
          duration: 2,
          ease: 'power2.inOut',
        })
      })
      window.dispatchEvent(
        new CustomEvent('preloaderIsReady', {
          detail: {
            delay: 0.32,
          },
        })
      )
    }
  }

  fakePreloader()
}

export default preloader
