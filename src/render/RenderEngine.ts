import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js'

import img from '../textures/disc.png'
import type { ParticleEngineSchema, TurbulenceFieldSchema, TurbulenceSchema } from "../schemas";

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
  private particlesGeometry?: THREE.BufferGeometry;
  private showTurbulenceGeometry: boolean = false;

  constructor(
    { width, height, fov = 75, near = 0.01, far = 1000 }: RenderEngineParams,
    private particle: ParticleEngineSchema,
    private turbulenceField: TurbulenceFieldSchema
  ) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333);
    this.camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
    const axesHelper = new THREE.AxesHelper(1);
    this.scene.add(axesHelper);
    this.camera.position.z = 5
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
    document.body.appendChild(stats.dom);
    return stats;
  }

  createParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    const particles = this.particle.particles;

    for (let i = 0; i < particles.length; i++) {

      const particle = particles[i];
      if (!particle) {
        vertices.push(0, 0, 0);
        colors.push(1, 1, 1); // Couleur blanche par défaut
      } else {
        vertices.push(particle.position.x, particle.position.y, particle.position.z);
        // Utiliser la couleur individuelle de la particule
        colors.push(particle.color.r, particle.color.g, particle.color.b);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    return geometry;
  }

  set showVectors(value: boolean) {
    this.showTurbulenceGeometry = value
    if (value) {
      this.drawTurbulence()
    } else {
      this.clearTurbulence()
    }
  }

  clearTurbulence() {
    const points = this.turbulenceField.points;
    for (let i = 0; i < points.length; i++) {
      this.scene.remove(points[i].threeLine)
    }
  }

  get showVectors(): boolean {
    return this.showTurbulenceGeometry
  }

  drawTurbulence() {
    if (!this.showTurbulenceGeometry) return;
    const points = this.turbulenceField.points;
    for (let i = 0; i < points.length; i++) {
      this.scene.add(points[i].threeLine)
    }
  }

  setup() {
    // const texture = new THREE.TextureLoader().load(img)
    const geometry = this.createParticles();
    this.drawTurbulence();
    this.particlesGeometry = geometry;
    const material = new THREE.PointsMaterial();
    material.size = .015;
    // material.map = texture;
    material.transparent = true;
    material.sizeAttenuation = true;
    material.vertexColors = true;
    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);
  }

  updateGeometry(deltaTime: number) {
    if (!this.particlesGeometry) return;
    const positions = this.particlesGeometry.attributes.position.array;
    const colors = this.particlesGeometry.attributes.color.array;
    const particles = this.particle.particles;
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      if (!particle) continue

      const x = particle.position.x;
      const y = particle.position.y;
      const z = particle.position.z;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Mettre à jour les couleurs
      colors[i * 3] = particle.color.r;
      colors[i * 3 + 1] = particle.color.g;
      colors[i * 3 + 2] = particle.color.b;
    }
    this.particlesGeometry.attributes.position.needsUpdate = true;
    this.particlesGeometry.attributes.color.needsUpdate = true;
  }

  render() {
    this._state.begin();
    const currentTime = performance.now();
    const deltaTime = currentTime - this._deltaTime;
    this._deltaTime = currentTime;

    this.particle.update(deltaTime);
    this.updateGeometry(deltaTime);

    this.renderer.render(this.scene, this.camera);
    this._state.end();
  }

  loop() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }
} 