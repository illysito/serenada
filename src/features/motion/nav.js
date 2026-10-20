import gsap from 'gsap'

function nav() {
  const navItems = [...document.querySelectorAll('.nav-p')]

  navItems.forEach((i) => {
    i.addEventListener('mouseenter', () => {
      gsap.to(i, {
        opacity: 0.72,
        duration: 0.12,
        ease: 'linear',
      })
    })

    i.addEventListener('mouseleave', () => {
      gsap.to(i, {
        opacity: 1,
        duration: 0.12,
        ease: 'linear',
      })
    })
  })
}

export default nav
