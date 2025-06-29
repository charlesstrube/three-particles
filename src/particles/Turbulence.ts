import * as THREE from 'three';
import type { TurbulenceSchema } from '../schemas';
import getMagnitude from '../helpers/getMagnitude';

export class Turbulence implements TurbulenceSchema {
  readonly threeLine: THREE.Line;
  public direction: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private _initialDirection: THREE.Vector3;
  constructor(
    public position: THREE.Vector3,
    public _radius: number,
    force: number
  ) {
    this._initialDirection = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    );

    this.updateForce(force)
    this.threeLine = this.createLine()
  }

  updateForce(force: number): void {
    const direction = this._initialDirection.clone()
    const magnitude = getMagnitude(direction);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * force;
      direction.y = (direction.y / magnitude) * force;
      direction.z = (direction.z / magnitude) * force;
    }
    this.direction = direction
  }

  set force(force: number) {
    this.updateForce(force)
  }

  set radius(radius: number) {
    this._radius = radius
  }

  get radius(): number {
    return this._radius
  }

  createLine() {
    const points = [];
    points.push(this.position);

    // Calculer le point final en utilisant la direction normalisée multipliée par le radius
    const direction = this.direction.clone().normalize();
    const endPoint = this.position.clone().add(direction.multiplyScalar(this._radius));
    points.push(endPoint);

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Créer des couleurs pour le gradient (rouge au début, blanc à la fin)
    const colors = [
      1.0, 0.0, 0.0,  // Rouge au début
      1.0, 1.0, .5   // Blanc à la fin
    ];

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: 2
    });

    const line = new THREE.Line(geometry, material);

    return line;
  }

  updateLine(): void {
    const direction = this.direction.clone().normalize();
    const endPoint = this.position.clone().add(direction.multiplyScalar(this._radius));

    const geometry = new THREE.BufferGeometry().setFromPoints([this.position, endPoint]);

    // Maintenir les couleurs du gradient
    const colors = [
      1.0, 0.0, 0.0,  // Rouge au début
      1.0, 1.0, 1.0   // Blanc à la fin
    ];

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    this.threeLine.geometry = geometry;
  }
}