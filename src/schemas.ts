import * as THREE from "three";

export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface TurbulenceSchema {
  position: THREE.Vector3;
  direction: THREE.Vector3;
  get radius(): number;
  set radius(radius: number);
  set force(force: number);
  readonly threeLine: THREE.Line;
  updateLine(): void;
}

export interface TurbulenceFieldSchema {
  readonly points: TurbulenceSchema[];
  getTurbulenceAt(position: THREE.Vector3): THREE.Vector3;
}


export interface ParticleRendererSchema {
  drawParticle(particle: ParticleSchema): void;
  clear(): void;
  drawParticlesBatch(particles: ParticleSchema[]): void;
}

export interface TurbulenceRendererSchema {
  drawTurbulencePoints(points: TurbulenceSchema[]): void;
  clear(): void;
}


export interface ParticleSchema {
  readonly position: THREE.Vector3;
  readonly color: Color;
  readonly size: number;
  update(deltaTime: number): void;
  addVelocity(x: number, y: number, z: number): void;
  addForce(x: number, y: number, z: number): void;
  applyTurbulence(turbulence: THREE.Vector3): void;
}

export interface ParticleFactorySchema {
  createParticle(x: number, y: number, z: number): ParticleSchema;
}

export interface ParticleEngineSchema {
  particles: (ParticleSchema | undefined)[];
  spawnParticles(x: number, y: number, z: number, amount: number): void;
  update(deltaTime: number): void;
  set particleFactory(factory: ParticleFactorySchema);
}