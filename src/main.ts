import { ParticleEngine } from './particles/ParticleEngine'
import { TurbulenceField } from './particles/TurbulenceField'
import { RenderEngine } from './render/RenderEngine'
import * as THREE from 'three'
import './style.css'
import { GUI } from 'dat.gui'

const params = {
  amount: 1000,
}
const turbulenceParams = {
  force: 10,
  radius: 100,
  count: 50,
}
const cameraParams = {
  fov: 90,
  near: 0.01,
  far: 1000,
}

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
}





// const turbulenceField = new TurbulenceField()
// const Particular = new ParticleEngine(turbulenceField)

// // Configuration initiale du champ de turbulence
// turbulenceField.createRandomPattern(
//   new THREE.Vector3(size.width / 2, size.height / 2, 0),           // Centre
//   300,                // Rayon de la zone
//   turbulenceParams.count, // Nombre de points
//   turbulenceParams.force, // Force
//   turbulenceParams.radius    // Rayon d'influence de chaque point
// )

const render = new RenderEngine({
  width: size.width,
  height: size.height,
  fov: cameraParams.fov,
  near: cameraParams.near,
  far: cameraParams.far,
})

const gui = new GUI({ name: 'params' })


const cameraGui = gui.addFolder('camera')
cameraGui.open()
cameraGui.add(cameraParams, 'fov', 20, 120).onChange(value => {
  render.camera.fov = value
  render.camera.updateProjectionMatrix()
})
cameraGui.add(cameraParams, 'near', 0.01, 1000).onChange(value => {
  render.camera.near = value
  render.camera.updateProjectionMatrix()
})
cameraGui.add(cameraParams, 'far', 0.01, 1000).onChange(value => {
  render.camera.far = value
  render.camera.updateProjectionMatrix()
})

render.setup()
render.loop()