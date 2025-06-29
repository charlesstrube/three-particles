import * as THREE from "three";
import getInfluence from "../helpers/getInfluence";
import getMagnitude from "../helpers/getMagnitude";
import type { TurbulenceFieldSchema, TurbulenceSchema } from "../schemas";
import { Turbulence } from "./Turbulence";

export class TurbulenceField implements TurbulenceFieldSchema {
  private _points: TurbulenceSchema[] = [];

  get points(): TurbulenceSchema[] {
    return this._points
  }
  constructor(
    public force: number,
    readonly count: number,
    public radius: number
  ) {
    this.createRandomPattern(
      5,
    )
  }

  getTurbulenceAt(position: THREE.Vector3): THREE.Vector3 {
    const totalTurbulence: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

    for (const point of this._points) {

      const distance = position.distanceTo(point.position);

      // Ignorer les points trop éloignés pour les performances
      if (distance > point.radius) continue;

      // Calculer l'influence avec une fonction gaussienne
      const influence = getInfluence(distance, point.radius);

      // Appliquer la direction du point avec l'influence
      totalTurbulence.x += point.direction.x * influence;
      totalTurbulence.y += point.direction.y * influence;
      totalTurbulence.z += point.direction.z * influence;
    }

    return totalTurbulence;
  }

  update(deltaTime: number): void {
    // Pour l'instant, les points sont statiques
    // On pourrait ajouter ici de l'animation des points si nécessaire
  }

  private createRandomPattern(
    radius: number,
  ): void {
    const points: TurbulenceSchema[] = [];
    for (let i = 0; i < this.count; i++) {
      // Position aléatoire dans la sphère
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random()); // Distribution uniforme dans la sphère

      const particlePosition: THREE.Vector3 = new THREE.Vector3(
        r * Math.sin(angle2) * Math.cos(angle1),
        r * Math.sin(angle2) * Math.sin(angle1),
        + r * Math.cos(angle2)
      );

      const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );

      // Normaliser et appliquer la force
      const magnitude = getMagnitude(direction);
      if (magnitude > 0) {
        direction.x = (direction.x / magnitude) * this.force;
        direction.y = (direction.y / magnitude) * this.force;
        direction.z = (direction.z / magnitude) * this.force;
      }

      const point = new Turbulence(particlePosition, direction, this.radius)

      points.push(point);
    }

    this._points = points;
  }
} 