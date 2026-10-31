import gsap from 'gsap'

function menu() {
  const menuSection = document.querySelector('.menu__section')
  const button = document.querySelector('.burger-wrapper')
  const closeButton = document.querySelector('.close-button-wrapper')
  // const lines = [...button.querySelectorAll('.burger-line')]
  // const linkWrappers = [...document.querySelectorAll('.menu-link')]
  const links = [...document.querySelectorAll('.menu-p')]

  gsap.set(links, {
    yPercent: -100,
  })

  function manageMenu(needToOpen) {
    // OPEN MENU
    if (needToOpen) {
      gsap.to(menuSection, {
        x: 0,
        duration: 1.2,
        ease: 'expo.inOut',
      })
      gsap.to(closeButton, {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.inOut',
      })
      gsap.to(links, {
        opacity: 1,
        yPercent: 0,
        duration: 1.2,
        ease: 'power2.inOut',
      })
    } else {
      gsap.to(links, {
        opacity: 0,
        yPercent: -100,
        duration: 1.2,
        ease: 'power2.inOut',
      })
      gsap.to(closeButton, {
        opacity: 0,
        duration: 1.2,
        ease: 'power2.inOut',
      })
      gsap.to(menuSection, {
        xPercent: 100,
        duration: 1.2,
        ease: 'expo.inOut',
      })
      // CLOSE MENU
    }
    isMenuDisplayed = !isMenuDisplayed
  }

  button.addEventListener('click', () => {
    const needsToOpen = true
    manageMenu(needsToOpen)
  })
  closeButton.addEventListener('click', () => {
    const needsToOpen = false
    manageMenu(needsToOpen)
  })
}

export default menu
