import * as THREE from 'three';
import type { TurbulenceSchema } from '../schemas';

export class Turbulence implements TurbulenceSchema {
  readonly threeLine: THREE.Line;
  constructor(
    public position: THREE.Vector3,
    public direction: THREE.Vector3,
    public radius: number
  ) {
    this.threeLine = this.createLine()
  }


  createLine() {
    const points = [];
    points.push(this.position);

    // Calculer le point final en utilisant la direction normalisée multipliée par le radius
    const direction = this.direction.clone().normalize();
    const endPoint = this.position.clone().add(direction.multiplyScalar(this.radius));
    points.push(endPoint);

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 100 });

    const line = new THREE.Line(geometry, material);

    return line;
  }
}