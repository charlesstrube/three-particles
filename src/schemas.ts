import * as THREE from "three";

export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface TurbulencePoint {
  readonly position: THREE.Vector3;
  readonly direction: THREE.Vector3;
  readonly radius: number;
}

export interface TurbulenceFieldSchema {
  readonly points: TurbulencePoint[];
  getTurbulenceAt(position: THREE.Vector3): THREE.Vector3;
  createRandomPattern(
    position: THREE.Vector3,
    radius: number, count: number, force: number, pointRadius: number
  ): void;
}


export interface ParticleRendererSchema {
  drawParticle(particle: ParticleSchema): void;
  clear(): void;
  drawParticlesBatch(particles: ParticleSchema[]): void;
}

export interface TurbulenceRendererSchema {
  drawTurbulencePoints(points: TurbulencePoint[]): void;
  clear(): void;
}




export interface ParticleSchema {
  readonly position: THREE.Vector3;
  readonly color: Color;
  readonly alpha: number;
  readonly size: number;
  update(deltaTime: number): void;
  isAlive(): boolean;
  addVelocity(x: number, y: number, z: number): void;
  addForce(x: number, y: number, z: number): void;
  applyTurbulence(turbulence: THREE.Vector3): void;
}

export interface ParticleFactorySchema {
  createParticle(x: number, y: number, z: number): ParticleSchema;
}

export interface ParticleEngineSchema {
  particles: ParticleSchema[];
  spawnParticles(x: number, y: number, z: number, amount: number): void;
  update(deltaTime: number): void;
  sortParticles(): void;
  set particleFactory(factory: ParticleFactorySchema);
}