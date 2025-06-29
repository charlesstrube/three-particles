import * as THREE from "three";
import getInfluence from "../helpers/getInfluence";
import getMagnitude from "../helpers/getMagnitude";
import type { TurbulenceFieldSchema, TurbulencePoint } from "../schemas";

export class TurbulenceField implements TurbulenceFieldSchema {
  private _points: TurbulencePoint[] = [];

  get points(): TurbulencePoint[] {
    return this._points
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

  createRandomPattern(
    position: THREE.Vector3,
    radius: number,
    count: number,
    force: number,
    pointRadius: number
  ): void {
    const points: TurbulencePoint[] = [];
    for (let i = 0; i < count; i++) {
      // Position aléatoire dans la sphère
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random()); // Distribution uniforme dans la sphère

      const particlePosition: THREE.Vector3 = new THREE.Vector3(
        position.x + r * Math.sin(angle2) * Math.cos(angle1),
        position.y + r * Math.sin(angle2) * Math.sin(angle1),
        position.z + r * Math.cos(angle2)
      );

      const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );

      // Normaliser et appliquer la force
      const magnitude = getMagnitude(direction);
      if (magnitude > 0) {
        direction.x = (direction.x / magnitude) * force;
        direction.y = (direction.y / magnitude) * force;
        direction.z = (direction.z / magnitude) * force;
      }

      const point: TurbulencePoint = {
        position: particlePosition,
        direction,
        radius: pointRadius
      }

      points.push(point);
    }

    this._points = points;
  }
} 