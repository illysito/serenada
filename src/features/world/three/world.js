import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

// Shaders
import frag_bg from '../shaders/bg_frag'
import frag from '../shaders/type_frag'
import vert from '../shaders/vertexShader'
// import vert_2 from './shaders/gradient_vertexShader_2'

const UNIFORMS = {
  u_distFactor: { value: 6 },
  u_scroll: { value: 1 },
  u_scrollDistortion: { value: 1 },
}

function isMobile() {
  return window.matchMedia('(max-width: 667px)').matches
}

function githubToJsDelivr(permalink) {
  return permalink
    .replace('github.com', 'cdn.jsdelivr.net/gh')
    .replace('/blob/', '@')
}

async function world() {
  //#region SETUP

  // -------------------------------------------------------------- Setup --------------------------------------------------------------

  const canvas = document.getElementById('three-canvas')

  // Scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x060606)

  let resolution = { x: 0, y: 0 }
  if (isMobile()) {
    resolution.x = canvas.clientWidth
    resolution.y = canvas.clientHeight
  } else {
    resolution.x = window.innerWidth
    resolution.y = window.innerHeight
  }

  // Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    resolution.x / resolution.y,
    1,
    2000
  )
  console.log(canvas.clientHeight)
  camera.position.z = 600
  function updateCamera() {
    camera.fov =
      (2 * Math.atan(window.innerHeight / 2 / camera.position.z) * 180) /
      Math.PI
    camera.updateProjectionMatrix()
  }
  updateCamera()

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  })
  renderer.setSize(resolution.x, resolution.y)
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  //#endregion

  //#region TEXTURE
  const textureLoader = new THREE.TextureLoader()

  const backgroundTexture = textureLoader.load(
    githubToJsDelivr(
      'https://github.com/illysito/serenada/blob/a82f1f6605618f967a0fcf2942f8ade14449d68e/textures/Serenada_BG.jpg'
    )
  )

  const woodTexture = textureLoader.load(
    githubToJsDelivr(
      'https://github.com/illysito/serenada/blob/a82f1f6605618f967a0fcf2942f8ade14449d68e/textures/Serenada%20Main%20-%20little%20-%204.png'
    )
  )
  // const reflectionTexture = textureLoader.load(
  //   githubToJsDelivr(
  //     'https://github.com/illysito/serenada/blob/9731d7b2b3e2a32f7d19c3c233565d83e669040b/textures/Serenada%20Reflection%20-%20little.png'
  //   )
  // )
  const reflectionTexture = textureLoader.load(
    githubToJsDelivr(
      'https://github.com/illysito/serenada/blob/1886790a9bb4a7814a2f6be6c27f8464608056ad/textures/Serenada%20Reflection%20-%20little%20-%202.png'
    )
  )

  const perlinTexture = textureLoader.load(
    'https://cdn.jsdelivr.net/gh/illysito/amorenelaire@0714d117d78e43ca5310ea45c9e93b48ece7e576/textures/perlinSquare.jpg'
  )

  woodTexture.wrapS = THREE.RepeatWrapping
  woodTexture.wrapT = THREE.RepeatWrapping
  woodTexture.colorSpace = THREE.SRGBColorSpace // if it's a color image

  //#endregion
  //#region BACKGROUND PLANE

  // -------------------------------------------------------------- Background Plane --------------------------------------------------------------

  const segments = isMobile() ? 60 : 200

  const verticalSegments = segments
  let horizontalSegments = 0

  if (isMobile()) {
    horizontalSegments = Math.round(
      (verticalSegments * window.innerWidth) / window.innerHeight
    )
  } else {
    horizontalSegments = 140
  }

  console.log('v ', verticalSegments)
  console.log('h ', horizontalSegments)

  const planeGeometry = new THREE.PlaneGeometry(
    canvas.clientWidth,
    canvas.clientHeight,
    horizontalSegments,
    verticalSegments
  )
  const seed = Math.random() * 20
  // console.log('Seed: ', seed)
  const backgroundPlaneMaterial = new THREE.ShaderMaterial({
    // fragmentShader: woodFrag,
    fragmentShader: frag_bg,
    vertexShader: vert,
    uniforms: {
      u_time: { value: 0 },
      u_bg: { value: backgroundTexture },
      u_resolution: {
        value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
      },
    },
    transparent: true,
    depthWrite: false,
  })
  const planeMaterial = new THREE.ShaderMaterial({
    // fragmentShader: woodFrag,
    fragmentShader: frag,
    vertexShader: vert,
    uniforms: {
      u_time: { value: 0 },
      u_seed: { value: seed },
      u_mouseX: { value: 0.0 },
      u_mouseY: { value: 0.0 },
      u_distFactor: { value: UNIFORMS.u_distFactor.value },
      u_wood: { value: woodTexture },
      u_reflection: { value: reflectionTexture },
      u_perlin: { value: perlinTexture },
      u_scroll: { value: UNIFORMS.u_scroll.value },
      u_scrollDistortion: { value: UNIFORMS.u_scrollDistortion.value },
      u_resolution: {
        value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
      },
    },
    transparent: true,
    depthWrite: false,
  })
  const backgroundPlane = new THREE.Mesh(planeGeometry, backgroundPlaneMaterial)
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  let planeScale = 1
  if (isMobile()) {
    planeScale = 1.8
  }
  // plane.rotation.x = 0.1
  // plane.rotation.z = Math.PI / 2
  backgroundPlane.position.z = -0.1
  plane.position.z = 0
  plane.scale.set(planeScale, planeScale, planeScale)

  // Avoid the plane from going OVER the SPHERE
  plane.renderOrder = 0
  plane.material.depthWrite = false
  plane.material.depthTest = true

  scene.add(backgroundPlane)
  scene.add(plane)

  //#endregion

  //#region LOOP

  // -------------------------------------------------------------- Loop --------------------------------------------------------------

  // normal counter
  let planeCounter = 0

  let targetX = 0
  let targetY = 0

  let currentX = 0
  let currentY = 0

  let lerpFactor = 0.002

  function lerp(start, end, t) {
    return start + (end - start) * t
  }

  function animate() {
    currentX = lerp(currentX, targetX, lerpFactor)
    currentY = lerp(currentY, targetY, lerpFactor)
    // Background plane
    planeCounter = (planeCounter + 0.002) % 5000 // safeguard to not let counter evolve endlessly
    planeMaterial.uniforms.u_time.value = planeCounter
    backgroundPlaneMaterial.uniforms.u_time.value = planeCounter
    planeMaterial.uniforms.u_distFactor.value = UNIFORMS.u_distFactor.value
    planeMaterial.uniforms.u_scroll.value = UNIFORMS.u_scroll.value
    planeMaterial.uniforms.u_scrollDistortion.value =
      UNIFORMS.u_scrollDistortion.value
    // planeMaterial.uniforms.u_mouseX.value = currentX
    // planeMaterial.uniforms.u_mouseY.value = currentY

    // console.log(currentX, currentY)
    // if (!isMobile()) {
    //   plane.rotation.z = Math.PI * Math.cos(0.25 * planeCounter)
    // }

    // Render and RAF
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }
  animate()

  const heroSection = document.querySelector('.hero__section')
  function initDistortion() {
    gsap.to(UNIFORMS.u_distFactor, {
      value: 0.11,
      duration: 2.4,
      delay: 0.1,
      ease: 'expo.out',
    })
    gsap.to(UNIFORMS.u_scroll, {
      value: 0,
      scrollTrigger: {
        trigger: heroSection,
        start: 'bottom 100%',
        end: 'bottom 32%',
        scrub: 0.5,
        // markers: true,
      },
    })
    gsap.to(UNIFORMS.u_scrollDistortion, {
      value: 4,
      scrollTrigger: {
        trigger: heroSection,
        start: 'bottom 100%',
        end: 'bottom 20%',
        scrub: 1.2,
        // markers: true,
      },
    })
  }
  initDistortion()

  //#endregion

  //#region RESIZE

  // -------------------------------------------------------------- Resize --------------------------------------------------------------

  window.addEventListener('resize', () => {
    if (isMobile()) {
      resolution.x = canvas.clientWidth
      resolution.y = canvas.clientHeight
    } else {
      resolution.x = window.innerWidth
      resolution.y = window.innerHeight
    }
    camera.aspect = resolution.x / resolution.y
    camera.updateProjectionMatrix()
    renderer.setSize(resolution.x, resolution.y)
  })

  //#endregion

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX / window.innerWidth
    targetY = 1.0 - e.clientY / window.innerHeight
  })
}

export default world
