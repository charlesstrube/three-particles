import * as THREE from "three";
import getInfluence from "../helpers/getInfluence";
import type { TurbulenceFieldSchema, TurbulenceSchema } from "../schemas";
import { Turbulence } from "./Turbulence";

export class TurbulenceField implements TurbulenceFieldSchema {
  private _points: TurbulenceSchema[] = [];

  get points(): TurbulenceSchema[] {
    return this._points
  }
  constructor(
    force: number,
    count: number,
    pointRadius: number
  ) {
    const radius = 5
    this.createRandomPattern(
      count,
      radius,
      force,
      pointRadius
    )
  }

  set force(value: number) {
    for (const point of this._points) {
      point.force = value
    }
  }

  set radius(value: number) {
    for (const point of this._points) {
      point.radius = value
    }
  }

  updateTurbulence(): void {
    for (const point of this._points) {
      point.updateLine()
    }
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
    count: number,
    radius: number,
    force: number,
    pointRadius: number
  ): void {
    const points: TurbulenceSchema[] = [];
    for (let i = 0; i < count; i++) {
      // Position aléatoire dans la sphère
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random()); // Distribution uniforme dans la sphère

      const particlePosition: THREE.Vector3 = new THREE.Vector3(
        r * Math.sin(angle2) * Math.cos(angle1),
        r * Math.sin(angle2) * Math.sin(angle1),
        r * Math.cos(angle2)
      );

      const point = new Turbulence(
        particlePosition,
        pointRadius,
        force
      )

      points.push(point);
    }

    this._points = points;
  }


} 