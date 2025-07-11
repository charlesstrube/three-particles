import type { ParticleSchema, ParticleEngineSchema, ParticleFactorySchema, TurbulenceFieldSchema } from "../schemas"
import { DefaultParticleFactory } from "./ParticleFactory"

export class ParticleEngine implements ParticleEngineSchema {

  private _particles: (ParticleSchema | undefined)[] = Array.from({ length: 30000 }, () => undefined)
  private _particleFactory: ParticleFactorySchema

  constructor(
    count: number,
    private _turbulenceField: TurbulenceFieldSchema
  ) {
    this._particleFactory = new DefaultParticleFactory()
    this.spawnParticles(0, 0, 0, count)
  }

  get particles() {
    return this._particles
  }

  set particleFactory(factory: ParticleFactorySchema) {
    this._particleFactory = factory
  }

  spawnParticles(x: number, y: number, z: number, amount: number): void {
    for (let i = 0; i < amount; i++) {
      const particle = this._particleFactory.createParticle(x, y, z)
      this._particles[i] = particle
    }
  }

  update(deltaTime: number): void {
    for (let i = 0; i < this._particles.length; i++) {
      const particle = this._particles[i]

      if (!particle) continue

      const turbulence = this._turbulenceField.getTurbulenceAt(particle.position)
      particle.applyTurbulence(turbulence)

      particle.update(deltaTime)
    }
  }
}