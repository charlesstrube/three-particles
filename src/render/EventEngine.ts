import * as THREE from 'three';

export class EventEngine {
  private rayCaster: THREE.Raycaster;

  constructor() {
    this.rayCaster = new THREE.Raycaster();
    this.rayCaster.params.Points.threshold = 0.001;
  }
}