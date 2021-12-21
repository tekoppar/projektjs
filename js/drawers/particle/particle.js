import { CanvasDrawer, Vector2D, Cobject, Rectangle, CMath, TileMaker, Tile, DrawingOperation, OperationType, Mastertime } from '../../internal.js';

/**
 * Enum for particle type
 * @readonly
 * @enum {Number}
 */
const ParticleType = {
	Sprite: 0,
	Color: 1,
}

//@ts-ignore
function generateImageFromColor(color, rectangle) {
	let tempCanvas = document.createElement('canvas');
	tempCanvas.width = rectangle.w;
	tempCanvas.height = rectangle.h;
	let ctx = tempCanvas.getContext('2d');

	ctx.fillStyle = color;
	ctx.fillRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);

	let img = new Image(rectangle.w, rectangle.h);
	img.src = tempCanvas.toDataURL('image/png');

	return img;
}

/**
 * @class
 * @constructor
 * @public
 */
class Particle {

	constructor() {
		 /** @type {HTMLImageElement} */
		this.particleImage;
		this.position = new Vector2D(0, 0);
		this.lifeTime = 1;
		this.filterLifetimes = {};
	}
}

/**
 * @class
 * @constructor
 * @public
 * @extends Particle
 */
class SpriteParticle extends Particle {
	constructor(tile) {
		super();
		this.particleTile = tile;
		this.particleImage = TileMaker.CanvasPortionToImage2(this.particleTile);
	}
}

class ColorParticle extends Particle {
	constructor(color, rectangle = new Rectangle(0, 0, 1, 1)) {
		super();
		this.color = color;
		this.rectangle = rectangle;
		this.path = [new Vector2D(0, 0), new Vector2D(rectangle.w, rectangle.h)];
	}
}

class ParticleGeneratorSettings {
	constructor(spawn, spawnRate, lifetime, particleType = ParticleType.Sprite) {
		this.spawn = spawn;
		this.spawnRate = spawnRate;
		this.lifetime = lifetime;
		this.particleType = particleType;
	}
}

class ParticleGenerator {
	constructor(particles, settings = new ParticleGeneratorSettings(25, 25, 1)) {
		this.particles = particles;
		this.generatedParticles = [];
		this.ParticleGeneratorSettings = settings;
	}

	GenerateParticles(delta, filters) {
		if (this.ParticleGeneratorSettings.spawnRate === 0 && this.generatedParticles.length > 0)
			return;

		let newParticles = [];

		for (let i = 0, l = filters.length; i < l; ++i) {
			if (filters[i].runOnce === true)
				filters[i].hasRun = false;
		}

		for (let i = 0, l = this.particles.length; i < l; ++i) {
			for (let i2 = 0; i2 < this.ParticleGeneratorSettings.spawn; i2++) {
				if (this.ParticleGeneratorSettings.particleType === ParticleType.Sprite && this.particles[i] instanceof SpriteParticle) {
					let newParticle = new SpriteParticle(this.particles[i].particleTile);
					newParticle.lifeTime = this.ParticleGeneratorSettings.lifetime;
					newParticles.push(newParticle);
				} else if (this.ParticleGeneratorSettings.particleType === ParticleType.Color && this.particles[i] instanceof ColorParticle) {
					let newParticle = new ColorParticle(this.particles[i].color, this.particles[i].rectangle.Clone());
					newParticle.lifeTime = this.ParticleGeneratorSettings.lifetime;
					newParticles.push(newParticle);
				}
			}
		}

		this.UpdateParticles(delta, filters, newParticles);
		this.generatedParticles = this.generatedParticles.concat(newParticles);
	}

	UpdateParticles(delta, filters, particles) {
		for (let i = 0, l = filters.length; i < l; ++i) {
			for (let particle of particles) {
				if (filters[i].runOnce === false || (filters[i].runOnce === true && filters[i].hasRun === false))
					filters[i].ApplyFilter(particle, delta);
			}
		}

		for (let i = 0, l = filters.length; i < l; ++i) {
			if (filters[i].runOnce === true)
				filters[i].hasRun = true;
		}
	}

	UpdateLifeTime(delta) {
		for (let i = 0, l = this.generatedParticles.length; i < l; ++i) {
			this.generatedParticles[i].lifeTime -= delta;

			if (this.generatedParticles[i].lifeTime <= 0) {
				this.generatedParticles.splice(i, 1);
				i--;
			}
		}
	}
}

/**
 * @interface
 */
class ParticleFilter {
	constructor(runOnce = false) {
		this.runOnce = runOnce;
		this.hasRun = false;
	}

	//@ts-ignore
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

	//@ts-ignore
	ApplyFilter(particle, delta) {
		let tempSize = this.size.Clone();

		if (particle instanceof SpriteParticle) {
			if (this.uniform === true) {
				tempSize.x = CMath.RandomFloat(1 * particle.particleTile.size.x, this.size.x * particle.particleTile.size.x);
				tempSize.y = CMath.RandomFloat(1 * particle.particleTile.size.y, this.size.y * particle.particleTile.size.y);
			} else {
				let randomVal = CMath.RandomFloat(1, this.size.x);
				tempSize.x = randomVal * particle.particleTile.size.x;
				tempSize.y = randomVal * particle.particleTile.size.y;
			}
			particle.particleImage = TileMaker.ResizeImage(particle.particleImage, tempSize);
		} else if (particle instanceof ColorParticle) {
			tempSize.x = CMath.RandomFloat(0, this.size.x * particle.path[1].x);
			tempSize.y = CMath.RandomFloat(0, this.size.y * particle.path[1].y);

			particle.path[1].x += tempSize.x;
			particle.path[1].y += tempSize.y;
		}
	}
}

class ParticleFilter2DMovement extends ParticleFilter {
	constructor(minMovement = new Vector2D(1, 1), maxMovement = new Vector2D(1, 1)) {
		super(false);
		this.minMovement = minMovement;
		this.maxMovement = maxMovement;
	}

	//@ts-ignore
	ApplyFilter(particle, delta) {
		if (particle instanceof SpriteParticle) {
			if (particle.filterLifetimes['ParticleFilter2DMovement'] === undefined) {
				particle.filterLifetimes['ParticleFilter2DMovement'] = { values: new Vector2D(this.maxMovement.x * 0.5, this.maxMovement.y * 0.5) };
			} else {
				particle.filterLifetimes['ParticleFilter2DMovement'].values.x += CMath.RandomFloat(0.1 * (this.minMovement.x * -1), 0.25 * this.maxMovement.x);
				particle.filterLifetimes['ParticleFilter2DMovement'].values.x = CMath.Clamp(particle.filterLifetimes['ParticleFilter2DMovement'].values.x, this.minMovement.x * -1, this.maxMovement.x);
				particle.filterLifetimes['ParticleFilter2DMovement'].values.y += CMath.RandomFloat(0.25 * (this.minMovement.y * -1), 0.25 * this.maxMovement.y);
				particle.filterLifetimes['ParticleFilter2DMovement'].values.y = CMath.Clamp(particle.filterLifetimes['ParticleFilter2DMovement'].values.y, this.minMovement.y * -1, this.maxMovement.y);
			}

			particle.position.x += particle.filterLifetimes['ParticleFilter2DMovement'].values.x;
			particle.position.y += particle.filterLifetimes['ParticleFilter2DMovement'].values.y;
		} else if (particle instanceof ColorParticle) {
			if (particle.filterLifetimes['ParticleFilter2DMovement'] === undefined) {
				particle.filterLifetimes['ParticleFilter2DMovement'] = { values: new Vector2D(this.maxMovement.x * 0.5, this.maxMovement.y * 0.5) };
			} else {
				particle.filterLifetimes['ParticleFilter2DMovement'].values.x += CMath.RandomFloat(0.1 * (this.minMovement.x * -1), 0.25 * this.maxMovement.x);
				particle.filterLifetimes['ParticleFilter2DMovement'].values.x = CMath.Clamp(particle.filterLifetimes['ParticleFilter2DMovement'].values.x, this.minMovement.x * -1, this.maxMovement.x);
				particle.filterLifetimes['ParticleFilter2DMovement'].values.y += CMath.RandomFloat(0.25 * (this.minMovement.y * -1), 0.25 * this.maxMovement.y);
				particle.filterLifetimes['ParticleFilter2DMovement'].values.y = CMath.Clamp(particle.filterLifetimes['ParticleFilter2DMovement'].values.y, this.minMovement.y * -1, this.maxMovement.y);
			}

			particle.position.x += particle.filterLifetimes['ParticleFilter2DMovement'].values.x;
			particle.position.y += particle.filterLifetimes['ParticleFilter2DMovement'].values.y;
		}
	}
}

class ParticleFilterRandomPosition extends ParticleFilter {
	constructor(minRange = new Vector2D(-32, 32), maxRange = new Vector2D(-32, 32)) {
		super(true);
		this.minRange = minRange;
		this.maxRange = maxRange;
	}

	//@ts-ignore
	ApplyFilter(particle, delta) {
		particle.position.x = CMath.RandomFloat(this.minRange.x, this.maxRange.x);
		particle.position.y = CMath.RandomFloat(this.minRange.y, this.maxRange.y);
	}
}

class ParticleFilterRotate extends ParticleFilter {
	constructor(minRotate = 0, maxRotate = 45, runOnce = false) {
		super(runOnce);
		this.range = new Vector2D(minRotate, maxRotate);
	}

	//@ts-ignore
	ApplyFilter(particle, delta) {
		particle.path[0] = CMath.Rotate(particle.path[0], particle.path[0], CMath.RandomFloat(this.range.x, this.range.y));
		particle.path[1] = CMath.Rotate(particle.path[0], particle.path[1], CMath.RandomFloat(this.range.x, this.range.y));
	}
}

class ParticleFilterFadeSize extends ParticleFilter {
	constructor(min = 0, max = 1, time = 1, inverse = false) {
		super(false);
		this.min = min;
		this.max = max;
		this.time = time;
		this.inverse = inverse;
	}

	ApplyFilter(particle, delta) {
		if (particle.filterLifetimes['ParticleFilterFadeSize'] === undefined) {
			particle.filterLifetimes['ParticleFilterFadeSize'] = { time: this.min, defaultValue: particle.path[1].Clone() };
		}

		if (particle.filterLifetimes['ParticleFilterFadeSize'].time <= this.max) {
			let val;
			if (this.inverse)
				val = particle.filterLifetimes['ParticleFilterFadeSize'].time.mapRange(this.max, this.min * this.time, 0, 1);
			else
				val = particle.filterLifetimes['ParticleFilterFadeSize'].time.mapRange(this.min, this.max * this.time, 0, 1);

			particle.path[1] = particle.path[0].Lerp(particle.filterLifetimes['ParticleFilterFadeSize'].defaultValue.Clone(), val);
			particle.filterLifetimes['ParticleFilterFadeSize'].time += delta;
		}
	}
}

/**
 * @class
 * @constructor
 * @public
 * @extends Cobject
 */
class ParticleSystem extends Cobject {
	constructor(particles, size, position, particleFilters = [], lifeTime = 1) {
		super(new Vector2D(0, 0));
		this.particleGenerator = undefined;
		this.size = size;
		this.position = position;
		this.particles = particles;
		this.particleFilters = particleFilters;
		this.lifeTime = lifeTime;
		this.particleCanvas = document.createElement('canvas');
		this.particleCanvasCtx = this.particleCanvas.getContext('2d');
		this.oneSecond = 1;
		this.drawingOperation = undefined;

		this.particleCanvas.setAttribute('width', size.x);
		this.particleCanvas.setAttribute('height', size.y);
		this.particleCanvas.style.position = 'absolute';
		this.particleCanvas.style.top = '15%';

		//document.getElementById('container-game').appendChild(this.particleCanvas);
		//document.getElementById('game-canvas').style.filter = 'brightness(0.3)';

		//this.particleCanvasCtx.imageSmoothingEnabled = false;
	}

	FixedUpdate() {
		super.FixedUpdate();

		if (this.particleGenerator !== undefined)
			this.DrawParticles(Mastertime.Delta());
	}

	Delete() {
		this.particleCanvas.remove();
		this.drawingOperation.Delete();
		this.particleCanvas = null;
		this.particleCanvasCtx = null;
		this.particleFilters = null;
		this.particles = null;
		this.position = null;
		this.size = null;
		this.particleGenerator = null;
		super.Delete();
	}

	//@ts-ignore
	CEvent(eventType, data) {

	}

	GameBegin() {
		super.GameBegin();
	}

	AddFilter(filter) {
		this.particleFilters.push(filter);
	}

	DrawParticles(delta) {
		if (this.oneSecond >= 0.016 && this.lifeTime > 0) {
			this.particleGenerator.GenerateParticles(delta, this.particleFilters);
			this.oneSecond = 0;
		}
		this.oneSecond += delta;
		this.lifeTime -= delta;

		this.particleGenerator.UpdateParticles(delta, this.particleFilters, this.particleGenerator.generatedParticles);

		this.particleCanvasCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
		this.particleCanvasCtx.beginPath();
		for (let particle of this.particleGenerator.generatedParticles) {

			if (particle instanceof SpriteParticle) {
				this.particleCanvasCtx.drawImage(particle.particleImage, particle.position.x, particle.position.y);
			} else if (particle instanceof ColorParticle) {
				this.particleCanvasCtx.strokeStyle = particle.color;
				this.particleCanvasCtx.moveTo(particle.path[0].x + particle.position.x, particle.path[0].y + particle.position.y);
				this.particleCanvasCtx.lineTo(particle.path[1].x + particle.position.x, particle.path[1].y + particle.position.y);
			}
		}
		this.particleCanvasCtx.stroke();

		if (this.drawingOperation === undefined) {
			this.drawingOperation = new DrawingOperation(
				this,
				new Tile(this.position.Clone(), new Vector2D(0, 0), this.size.Clone(), true, 'particles'),
				CanvasDrawer.GCD.frameBuffer,
				this.particleCanvas,
				OperationType.particles
			);
			CanvasDrawer.GCD.AddDrawOperation(this.drawingOperation, OperationType.particles);
		} else
			this.drawingOperation.Update(this.position.Clone());

		this.particleGenerator.UpdateLifeTime(delta);

		if (this.lifeTime <= 0)
			this.Delete();
	}

	SetupGenerator(generator = new ParticleGeneratorSettings(35, 35, 1, ParticleType.Color)) {
		this.particleGenerator = new ParticleGenerator(this.particles, generator);
		this.particleGenerator.GenerateParticles(0.016, this.particleFilters);
	}
}


//let particleSystem = new ParticleSystem([], new Vector2D(1920, 1080));


export { ParticleSystem, ParticleGenerator, ParticleGeneratorSettings, Particle, SpriteParticle, ParticleType, ColorParticle, ParticleFilterRandomPosition, ParticleFilterSize, ParticleFilter2DMovement, ParticleFilterFadeSize, ParticleFilterRotate };