import gsap from 'gsap'

function menu() {
  const menuSection = document.querySelector('.menu__section')
  const button = document.querySelector('.burger-wrapper')
  const lines = [...button.querySelectorAll('.burger-line')]
  const linkWrappers = [...document.querySelectorAll('.menu-link')]
  const links = [...document.querySelectorAll('.menu-p')]

  let isMenuDisplayed = false

  function manageMenu() {
    // OPEN MENU
    if (!isMenuDisplayed) {
      gsap.to(menuSection, {
        x: 0,
        duration: 1.2,
        ease: 'expo.inOut',
      })
      gsap.to(links, {
        yPercent: 100,
        duration: 1.2,
        ease: 'expo.inOut',
      })
    } else {
      // CLOSE MENU
    }
  }

  button.addEventListener('click', () => {
    isMenuDisplayed = !isMenuDisplayed
    manageMenu()
  })
}

export default menu
