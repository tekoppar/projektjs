import {
	ExtendedProp, Vector2D, Vector4D, CustomEventHandler, OperationType,
	AtlasController, Inventory, AllCollisions, BWDrawingType, ArrayUtility
} from "../../internal.js";

/**
 * @class
 * @constructor
 * @extends ExtendedProp
 */
class Storage extends ExtendedProp {

	/**
	 * @param {string} name 
	 * @param {Vector2D} position 
	 * @param {*} animations 
	 * @param {string} canvasName 
	 * @param {Vector4D} blockingCollisionSize 
	 */
	constructor(name, position, animations, canvasName, blockingCollisionSize = new Vector4D(16, 16, 0, 0)) {
		super(name, position, animations, canvasName, blockingCollisionSize);

		/** @type {boolean} */ this.isVisible = true;
		/** @type {Number} */ this.life = 100;
		/** @type {Inventory} */ this.inventory = new Inventory(this);
	}

	//@ts-ignore
	CEvent(eventType, key, data) {
		switch (eventType) {
			case 'use':
				if (this.BoxCollision.GetRealCenterPosition().CheckInRange(key.BoxCollision.GetRealCenterPosition().Clone(), 75.0) === true) {
					this.inventory.ShowInventory();
					key.inventory.ShowInventory();
					this.gameObjectUsing = this.isVisible === false ? key : undefined;
				}
				break;
		}
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
		CustomEventHandler.AddListener(this);
		this.inventory.SetupInventory();

		if (AllCollisions[this.canvasName] !== undefined) {
			polygonCollision = AllCollisions[this.canvasName];
			size.x = AtlasController.GetAtlas(this.canvasName).width;
			size.y = AtlasController.GetAtlas(this.canvasName).height;
			super.GameBegin(
				ArrayUtility.CloneObjects(polygonCollision),
				position,
				size,
				tilePosition,
				createShadow
			);
		}
	}

	Delete() {
		super.Delete();
		this.currentAnimation = undefined;
	}

	OnHit(damage, source) {
		this.life -= damage;
		super.OnHit(source);

		if (this.life <= 0) {
			this.Delete();
		}
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
		}
	}

	SaveToFile() {
		return "new Storage('" + this.name + "', " + this.position.SaveToFile() + ', ' + (this.animationsName !== undefined ? "'" + this.animationsName + "'" : undefined) + ', ' + this.canvasName + "', " + this.blockingCollisionSize.SaveToFile() + ")";
	}

	SaveObject() {
		return "{ class: 'Storage', name: '" + this.name + "', canvasName: '" + this.canvasName + "', position: " + this.position.SaveToFile() + ' }';
	}
}

export { Storage };