import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js'

import img from '../textures/disc.png'


interface RenderEngineParams {
  width: number;
  height: number;
  fov: number;
  near: number;
  far: number;
}

export class RenderEngine {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;

  private _deltaTime: number = 0;
  private _state: Stats;
  private geometry?: THREE.BufferGeometry;

  constructor({ width, height, fov = 75, near = 0.01, far = 1000 }: RenderEngineParams) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333);
    this.camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
    this.camera.position.z = 2
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    document.body.appendChild(this.renderer.domElement);
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;
    this._state = this.initState();
  }

  private initState() {
    const stats = new Stats();
    // stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    return stats;
  };


  createGeometry() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 10000; i++) {

      const x = 40 * Math.random() - 20;
      const y = 40 * Math.random() - 20;
      const z = 40 * Math.random() - 20;

      vertices.push(x, y, z);

    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // const geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3);
    return geometry;
  }

  setup() {
    const texture = new THREE.TextureLoader().load(img);

    const color = new THREE.Color(0x00ff00);
    const geometry = this.createGeometry();
    this.geometry = geometry;
    const material = new THREE.PointsMaterial();
    material.size = .1;
    material.color = color;
    material.map = texture;
    material.transparent = true;
    material.sizeAttenuation = true;
    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);
  }

  updateGeometry(deltaTime: number) {
    if (!this.geometry) return;
    const positions = this.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const y = positions[i + 1];
      positions[i + 1] = y + Math.sin(deltaTime * 0.001 + i) * 0.001; // petit mouvement
    }
    this.geometry.attributes.position.needsUpdate = true;
  }


  render() {
    this._state.begin();
    const currentTime = performance.now();
    const deltaTime = currentTime - this._deltaTime;
    this._deltaTime = currentTime;

    this.updateGeometry(deltaTime);

    this.renderer.render(this.scene, this.camera);
    this._state.end();
  }

  loop() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }
} 