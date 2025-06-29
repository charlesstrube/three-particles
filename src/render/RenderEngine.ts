import * as THREE from "three";

interface RenderEngineParams {
  width: number;
  height: number;
  fov: number;
  near: number;
  far: number;
}

export class RenderEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private _deltaTime: number = 0;

  constructor({ width, height, fov = 75, near = 0.01, far = 1000 }: RenderEngineParams) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333);
    this.camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
    this.camera.position.z = 5
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    document.body.appendChild(this.renderer.domElement);
  }

  setup() {
    const color = new THREE.Color(0x00ff00);
    const geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3);
    const material = new THREE.PointsMaterial({ color });
    material.size = .1;
    material.sizeAttenuation = true;
    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);
  }

  render() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this._deltaTime;
    this._deltaTime = currentTime;


    this.renderer.render(this.scene, this.camera);
  }

  loop() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }
} 