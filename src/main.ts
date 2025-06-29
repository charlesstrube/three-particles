import { ParticleEngine } from './particles/ParticleEngine'
import { TurbulenceField } from './particles/TurbulenceField'
import { RenderEngine } from './render/RenderEngine'
import './style.css'
import { GUI } from 'dat.gui'

const params = {
  amount: 10000,
}
const turbulenceParams = {
  force: .01,
  radius: 1,
  count: 200,
}

const cameraParams = {
  fov: 90,
  near: 0.01,
  far: 100,
}

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
}



const turbulenceField = new TurbulenceField(
  turbulenceParams.force,
  turbulenceParams.count,
  turbulenceParams.radius
)
const Particles = new ParticleEngine(params.amount, turbulenceField)

const render = new RenderEngine({
  width: size.width,
  height: size.height,
  fov: cameraParams.fov,
  near: cameraParams.near,
  far: cameraParams.far,
},
  Particles,
  turbulenceField
)



const gui = new GUI({ name: 'params' })

const cameraGui = gui.addFolder('camera')
cameraGui.open()
cameraGui.add(cameraParams, 'fov', 20, 120).onChange(value => {
  render.camera.fov = value
  render.camera.updateProjectionMatrix()
})
cameraGui.add(cameraParams, 'near', 0.01, 100).onChange(value => {
  render.camera.near = value
  render.camera.updateProjectionMatrix()
})
cameraGui.add(cameraParams, 'far', 0.01, 100).onChange(value => {
  render.camera.far = value
  render.camera.updateProjectionMatrix()
})
const turbulenceGui = gui.addFolder('turbulence')
turbulenceGui.open()
turbulenceGui.add(render, 'showVectors').onChange(value => {
  render.showVectors = value
})
turbulenceGui.add(turbulenceParams, 'force', 0, 5).onChange(value => {
  turbulenceField.force = value
  turbulenceField.updateTurbulence()
})
turbulenceGui.add(turbulenceParams, 'radius', 0, 5).onChange(value => {
  turbulenceField.radius = value
  turbulenceField.updateTurbulence()
})

render.setup()
render.loop()