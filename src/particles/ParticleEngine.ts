import type { ParticleSchema, ParticleEngineSchema, ParticleFactorySchema, TurbulenceFieldSchema } from "../schemas"
import { DefaultParticleFactory } from "./ParticleFactory"

export class ParticleEngine implements ParticleEngineSchema {

  private _particles: (ParticleSchema | undefined)[] = Array.from({ length: 10000 }, () => undefined)
  private _particleFactory: ParticleFactorySchema

  constructor(
    private _turbulenceField: TurbulenceFieldSchema
  ) {
    this._particleFactory = new DefaultParticleFactory()
    this.spawnParticles(0, 0, 0, 10000)
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