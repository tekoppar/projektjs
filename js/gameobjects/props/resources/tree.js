import { Resource, Rectangle, Vector4D, Vector2D, Shadow2D, OperationType, BWDrawingType } from '../../../internal.js';

/**
 * @class
 * @constructor
 * @extends Resource
 */
class Tree extends Resource {

	/**
	 * Creates a new Tree
	 * @param {string} name 
	 * @param {Vector2D} position 
	 * @param {*} animations 
	 * @param {string} canvasName 
	 * @param {Vector4D} blockingCollisionSize 
	 * @param {Rectangle} secondStageFrame 
	 */
	constructor(name, position, animations, canvasName, blockingCollisionSize = new Vector4D(16, 16, 0, 0), secondStageFrame = new Rectangle(23, 18, 32, 32)) {
		super(name, position, animations, canvasName, blockingCollisionSize, secondStageFrame);

		/** @type {boolean} */ this.isVisible = true;
		/** @type {number} */ this.life = 100;
	}

	/**
	* 
	* @param {Vector2D[]} polygonCollision 
	* @param {Vector2D} position 
	* @param {Vector2D} size 
	* @param {Vector2D} tilePosition 
	* @param {boolean} createShadow 
	*/
	GameBegin(polygonCollision = undefined, position = new Vector2D(0, 0), size = new Vector2D(0, 0), tilePosition = new Vector2D(0, 0), createShadow = false) {
		super.GameBegin(polygonCollision, position, size, tilePosition, createShadow);
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

	/**
	 * Creates a new DrawingOperation
	 * @param {*} frame 
	 * @param {Vector2D} position 
	 * @param {boolean} clear 
	 * @param {HTMLCanvasElement} canvas
	 * @param {OperationType} operationType 
	 */
	CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.gameObjects) {
		super.CreateDrawOperation(frame, position, clear, canvas, operationType);

		if (this.drawingOperation.shadowOperation !== undefined) {
			this.drawingOperation.shadowOperation.drawType = BWDrawingType.Front;
			this.drawingOperation.shadowOperation.UpdateShadow(this.drawingOperation.tile);

			if (this.realtimeShadow === undefined) {
				this.realtimeShadow = new Shadow2D(this, this.canvasName, this.GetPosition().Clone(), new Vector2D(frame.w, frame.h), this.drawingOperation.tile);
				this.realtimeShadow.GameBegin();
			}

			this.realtimeShadow.SetPosition(new Vector2D(this.position.x + (this.realtimeShadow.shadowObject.GetSizeX() - this.size.x) / 2, this.position.y));
			this.realtimeShadow.AddShadow(this.drawingOperation.tile);
			this.realtimeShadow.UpdateShadow(this.drawingOperation.tile);
		}
	}

	SaveToFile() {
		return "new Tree('" + this.name + "', " + this.position.SaveToFile() + ', ' + (this.animationsName !== undefined ? "'" + this.animationsName + "'" : undefined) + ", '" + this.canvasName + "', " + this.blockingCollisionSize.SaveToFile() + ", '" + this.resourceName + "', " + this.secondStageFrame.SaveToFile() + ')';
	}

	SaveObject() {
		return "{ class: 'Tree', name: '" + this.name + "', canvasName: '" + this.canvasName + "', position: " + this.position.SaveToFile() + ' }';
	}
}

export { Tree };