import { CanvasDrawer, Vector2D, Cobject, Rectangle, CMath, TileMaker } from '../../internal.js';
import { Tile } from '../tiles/tile.js';

class Particle {
    constructor(tile) {
        this.particleTile = tile;
        this.particleImage = TileMaker.CanvasPortionToImage2(this.particleTile);
        this.position = new Vector2D(0, 0);
        this.lifeTime = 1;
        this.filterLifetimes = {};
    }
}

class ParticleGeneratorSettings {
    constructor(spawn, spawnRate, lifetime) {
        this.spawn = spawn;
        this.spawnRate = spawnRate;
        this.lifetime = lifetime;
    }
}

class ParticleGenerator {
    constructor(particles, settings = new ParticleGeneratorSettings(25, 25, 1)) {
        this.particles = particles;
        this.generatedParticles = [];
        this.ParticleGeneratorSettings = settings;
    }

    GenerateParticles(delta, filters) {
        let newParticles = [];

        for (let i = 0; i < filters.length; i++) {
            if (filters[i].runOnce === true)
                filters[i].hasRun = false;
        }

        for (let i = 0; i < this.particles.length; i++) {
            for (let i2 = 0; i2 < this.ParticleGeneratorSettings.spawn; i2++) {
                let newParticle = new Particle(this.particles[i].particleTile);
                newParticle.lifeTime = this.ParticleGeneratorSettings.lifetime;
                newParticles.push(newParticle);
            }
        }

        this.UpdateParticles(delta, filters, newParticles);
        this.generatedParticles = this.generatedParticles.concat(newParticles);
    }

    UpdateParticles(delta, filters, particles) {
        for (let i = 0; i < filters.length; i++) {
            for (let particle of particles) {
                if (filters[i].runOnce === false || (filters[i].runOnce === true && filters[i].hasRun === false))
                    filters[i].ApplyFilter(particle, delta);
            }
        }

        for (let i = 0; i < filters.length; i++) {
            if (filters[i].runOnce === true)
                filters[i].hasRun = true;
        }
    }

    UpdateLifeTime(delta) {
        for (let i = 0; i < this.generatedParticles.length; i++) {
            this.generatedParticles[i].lifeTime -= delta;

            if (this.generatedParticles[i].lifeTime <= 0) {
                this.generatedParticles.splice(i, 1);
                i--;
            }
        }
    }
}

class ParticleFilter {
    constructor(runOnce = false) {
        this.runOnce = runOnce;
        this.hasRun = false;
    }

    ApplyFilter(particle, delta) {
        this.hasRun = true;
    }
}

class ParticleFilterSize extends ParticleFilter {
    constructor(size, uniform = false) {
        super(true);
        this.size = size;
        this.uniform = uniform;
    }

    ApplyFilter(particle, delta) {
        let tempSize = this.size.Clone();
        if (this.uniform === true) {
            tempSize.x = CMath.RandomFloat(1 * particle.particleTile.size.x, this.size.x * particle.particleTile.size.x);
            tempSize.y = CMath.RandomFloat(1 * particle.particleTile.size.y, this.size.y * particle.particleTile.size.y);
        } else {
            let randomVal = CMath.RandomFloat(1, this.size.x);
            tempSize.x = randomVal * particle.particleTile.size.x;
            tempSize.y = randomVal * particle.particleTile.size.y;
        }
        particle.particleImage = TileMaker.ResizeImage(particle.particleImage, tempSize);
    }
}

class ParticleFilter2DMovement extends ParticleFilter {
    constructor(movement = new Vector2D(1, 1)) {
        super(false);
        this.movement = movement;
    }

    ApplyFilter(particle, delta) {
        if (particle.filterLifetimes['ParticleFilter2DMovement'] === undefined) {
            particle.filterLifetimes['ParticleFilter2DMovement'] = { values: new Vector2D(this.movement.x * 0.5, this.movement.y * 0.5) };
        } else {
            particle.filterLifetimes['ParticleFilter2DMovement'].values.x += CMath.RandomFloat(0.1 * (this.movement.x * -1), 0.25 * this.movement.x);
            particle.filterLifetimes['ParticleFilter2DMovement'].values.x = CMath.Clamp(particle.filterLifetimes['ParticleFilter2DMovement'].values.x, this.movement.x * -1, this.movement.x);
            particle.filterLifetimes['ParticleFilter2DMovement'].values.y += CMath.RandomFloat(0.25 * (this.movement.y * -1), 0.25 * this.movement.y);
            particle.filterLifetimes['ParticleFilter2DMovement'].values.y = CMath.Clamp(particle.filterLifetimes['ParticleFilter2DMovement'].values.y, this.movement.y * -1, this.movement.y);
        }

        particle.position.x += particle.filterLifetimes['ParticleFilter2DMovement'].values.x;
        particle.position.y += particle.filterLifetimes['ParticleFilter2DMovement'].values.y;
    }
}

class ParticleFilterRandomPosition extends ParticleFilter {
    constructor(minRange = new Vector2D(-32, 32), maxRange = new Vector2D(-32, 32)) {
        super(true);
        this.minRange = minRange;
        this.maxRange = maxRange;
    }

    ApplyFilter(particle, delta) {
        particle.position.x = CMath.RandomFloat(this.minRange.x, this.maxRange.x);
        particle.position.y = CMath.RandomFloat(this.minRange.y, this.maxRange.y);
    }
}

class ParticleSystem extends Cobject {
    constructor(particles, size) {
        super(new Vector2D(0, 0));
        this.particleGenerator = undefined;
        this.size = size;
        this.particles = particles;
        this.particleFilters = [];
        this.particleCanvas = document.createElement('canvas');
        this.particleCanvasCtx = this.particleCanvas.getContext('2d');
        this.oneSecond = 1;

        this.particleCanvas.setAttribute('width', size.x);
        this.particleCanvas.setAttribute('height', size.y);

        document.body.appendChild(this.particleCanvas);

        //this.particleCanvasCtx.webkitImageSmoothingEnabled = false;
        //this.particleCanvasCtx.msImageSmoothingEnabled = false;
        //this.particleCanvasCtx.imageSmoothingEnabled = false;
    }

    FixedUpdate(delta) {
        super.FixedUpdate(delta);
        this.DrawParticles(delta);
    }

    Delete() {
        super.Delete();
    }

    CEvent(eventType, data) {

    }

    GameBegin() {
        super.GameBegin();
        this.SetupGenerator();
    }

    AddFilter(filter) {
        this.particleFilters.push(filter);
    }

    DrawParticles(delta) {
        if (this.oneSecond >= 4) {
            this.particleGenerator.GenerateParticles(delta, this.particleFilters);
            this.oneSecond = 0;
        }
        this.oneSecond += delta;

        this.particleGenerator.UpdateParticles(delta, this.particleFilters, this.particleGenerator.generatedParticles);

        this.particleCanvasCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        for (let particle of this.particleGenerator.generatedParticles) {
            this.particleCanvasCtx.drawImage(particle.particleImage, particle.position.x, particle.position.y);
        }

        CanvasDrawer.GCD.mainCanvasCtx.drawImage(this.particleCanvas, this.particleCanvas.width, this.particleCanvas.height);
    }

    SetupGenerator() {
        this.particleGenerator = new ParticleGenerator(this.particles, new ParticleGeneratorSettings(1, 1, 10));
    }
}

/*
let particleSystem = new ParticleSystem([
            new Particle(new Tile(new Vector2D(0, 0), new Vector2D(0, 0), new Vector2D(96, 32), true, 'clouds')),
            new Particle(new Tile(new Vector2D(0, 0), new Vector2D(1, 0), new Vector2D(96, 32), true, 'clouds')),
            new Particle(new Tile(new Vector2D(0, 0), new Vector2D(0, 1), new Vector2D(96, 32), true, 'clouds')),
            new Particle(new Tile(new Vector2D(0, 0), new Vector2D(1, 1), new Vector2D(96, 32), true, 'clouds'))
        ], new Vector2D(1024, 1024));
        particleSystem.AddFilter(new ParticleFilterRandomPosition(new Vector2D(0, 0), new Vector2D(0, 1024)));
        particleSystem.AddFilter(new ParticleFilter2DMovement(new Vector2D(0.5, 0.1)));
        particleSystem.AddFilter(new ParticleFilterSize(new Vector2D(5, 5)));
        particleSystem.GameBegin();
        particleSystem.DrawParticles(0.0016);
*/

export { ParticleSystem, ParticleGenerator, ParticleGeneratorSettings, Particle, ParticleFilterRandomPosition, ParticleFilterSize, ParticleFilter2DMovement };