import * as THREE from "three";
import type { Color } from "../schemas";
import type { ParticleSchema } from "../schemas";

const white = 0xffffff;

const RED_VARIANTS: number[] = [
  0xff0000,  // Rouge vif
  0xff3232,  // Rouge clair
  0xc80000,  // Rouge foncé
  0xff6464,  // Rouge pâle
  0xb40000,  // Rouge bordeaux
  white
];

const DEFAULT_CONFIG = {
  SIZE: 3,
  MAX_LIFETIME: 4000,
  LIFETIME_VARIATION: 2000,
  AIR_RESISTANCE: 0.00008,
  INITIAL_FORCE: 200
};

export class Particle implements ParticleSchema {
  private readonly _size: number = DEFAULT_CONFIG.SIZE;
  private lifetime: number = 0;
  private readonly maxLifetime: number;
  private velocity: THREE.Vector3;
  readonly position: THREE.Vector3;
  private readonly airResistance: number = DEFAULT_CONFIG.AIR_RESISTANCE;
  readonly color: Color;

  constructor(x: number, y: number, z: number) {
    this.position = new THREE.Vector3(x, y, z);
    this.velocity = this.normalizeVelocity(DEFAULT_CONFIG.INITIAL_FORCE);
    this.maxLifetime = DEFAULT_CONFIG.MAX_LIFETIME + (Math.random() - 0.5) * DEFAULT_CONFIG.LIFETIME_VARIATION;
    this.color = this.generateColor();
  }

  get alpha(): number {
    return 1 - this.lifeTimePercentage();
  }

  get size(): number {
    return this._size;
  }

  private generateColor(): THREE.Color {
    const color = RED_VARIANTS[Math.floor(Math.random() * RED_VARIANTS.length)];

    return new THREE.Color(color);
  }

  private normalizeVelocity(force: number): THREE.Vector3 {
    const x = (Math.random() - 0.5) * 2;
    const y = (Math.random() - 0.5) * 2;
    const z = (Math.random() - 0.5) * 2;
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    if (magnitude === 0) {
      return new THREE.Vector3(0, 0, 0);
    }

    return new THREE.Vector3(
      (x / magnitude) * force,
      (y / magnitude) * force,
      (z / magnitude) * force
    );
  }

  private getVelocityMagnitude(): number {
    return Math.sqrt(
      this.velocity.x * this.velocity.x +
      this.velocity.y * this.velocity.y +
      this.velocity.z * this.velocity.z
    );
  }

  private applyAirResistance(deltaTime: number): void {
    const speed = this.getVelocityMagnitude();
    if (speed === 0) return;

    const dragForce = this.airResistance * speed * speed;
    const reductionFactor = 1 - (dragForce * deltaTime / 1000);

    this.velocity.x *= reductionFactor;
    this.velocity.y *= reductionFactor;
    this.velocity.z *= reductionFactor;
  }

  update(deltaTime: number): void {
    this.applyAirResistance(deltaTime);

    this.position.x += this.velocity.x * (deltaTime / 1000);
    this.position.y += this.velocity.y * (deltaTime / 1000);
    this.position.z += this.velocity.z * (deltaTime / 1000);

    this.lifetime += deltaTime;
  }

  // Nouvelle méthode pour appliquer la turbulence externe
  applyTurbulence(turbulence: THREE.Vector3): void {
    this.velocity.x += turbulence.x;
    this.velocity.y += turbulence.y;
    this.velocity.z += turbulence.z;
  }

  isAlive(): boolean {
    return this.lifetime < this.maxLifetime;
  }

  private lifeTimePercentage(): number {
    return this.lifetime / this.maxLifetime;
  }

  addVelocity(x: number, y: number, z: number): void {
    this.velocity.add(new THREE.Vector3(x, y, z));
  }

  addForce(x: number, y: number, z: number): void {
    this.velocity.x += x;
    this.velocity.y += y;
    this.velocity.z += z;
  }
}