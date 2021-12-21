import { Resource, Rectangle, Vector4D, Vector2D } from '../../../internal.js';

/**
 * @class
 * @constructor
 * @extends Resource
 */
class Rock extends Resource {

	/**
	 * Creates a new Rock
	 * @param {string} name 
	 * @param {Vector2D} position 
	 * @param {*} animations 
	 * @param {string} canvasName 
	 * @param {Vector4D} blockingCollisionSize 
	 * @param {Rectangle} secondStageFrame 
	 */
	constructor(name, position, animations, canvasName, blockingCollisionSize = new Vector4D(16, 16, 0, 0), secondStageFrame = new Rectangle(27, 25, 64, 32)) {
		super(name, position, animations, canvasName, blockingCollisionSize, secondStageFrame);

		/** @type {boolean} */ this.isVisible = true;
		/** @type {number} */ this.life = 100;
	}

	GameBegin() {
		super.GameBegin();
	}

	Delete() {
		super.Delete();
	}

	SecondStage() {
		super.SecondStage();
	}

	CreateSecondStage() {
		super.CreateSecondStage();
	}

	OnHit(damage, source) {
		super.OnHit(damage, source);
	}

	SaveToFile() {
		return "new Rock('" + this.name + "', " + this.position.SaveToFile() + ', ' + (this.animationsName !== undefined ? "'" + this.animationsName + "'" : undefined) + ", '" + this.canvasName + "', " + this.blockingCollisionSize.SaveToFile() + ", '" + this.resourceName + "', " + this.secondStageFrame.SaveToFile() + ')';
	}

	SaveObject() {
		return "{ class: 'Rock', name: '" + this.name + "', canvasName: '" + this.canvasName + "', position: " + this.position.SaveToFile() + ' }';
	}
}

export { Rock };