import { Vector2D, ExtendedProp, Item, OperationType, Shadow2D, BWDrawingType } from '../../internal.js';

/**
 * @class
 * @constructor
 * @extends ExtendedProp
 */
class ItemProp extends ExtendedProp {

	/**
	 * Creates a new ItemProp
	 * @param {string} name 
	 * @param {Vector2D} position 
	 * @param {*} animations 
	 * @param {string} canvasName 
	 * @param {Item} item 
	 */
	constructor(name, position, animations, canvasName, item = undefined) {
		super(name, position, animations, canvasName);

		/** @type {number} */ this.life = 100;
		/** @type {Item} */ this.item = item;
		/** @type {number} */ this.amount = (item !== undefined ? item.GetAmountAsNumber() : 0);
	}

	GameBegin() {
		let frame = this.currentAnimation.GetFrame();
		super.GameBegin(undefined, this.GetPosition().Clone(), this.currentAnimation.GetSize().Clone(), new Vector2D(frame.x, frame.y), false);
	}

	Delete() {
		super.Delete();

		if (this.realtimeShadow !== undefined)
			this.realtimeShadow.Delete();

		this.item = undefined;
		this.currentAnimation = undefined;
	}

	OnHit(damage, source) {
		this.life -= damage;
		super.OnHit(source);

		if (this.life <= 0) {
			this.Delete();
		}
	}

	PickupItem(otherObject) {
		if (otherObject.inventory !== undefined) {
			this.isVisible = false;

			if (this.item !== undefined)
				otherObject.inventory.AddItem(this.item);
			else {
				otherObject.inventory.AddNewItem(`${this.name}`);
			}

			window.requestAnimationFrame(() => this.Delete());
		}
	}

	CEvent(eventType, otherObject) {
		switch (eventType) {
			case 'use':
				if (this.isVisible === true)
					this.PickupItem(otherObject);
				break;
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

			if (this.realtimeShadow === undefined) {
				this.realtimeShadow = new Shadow2D(this, this.canvasName, this.GetPosition(), new Vector2D(frame.w, frame.h), this.drawingOperation.tile);
				this.realtimeShadow.GameBegin();
			}

			this.realtimeShadow.SetPosition(new Vector2D(this.position.x + (this.realtimeShadow.shadowObject.GetSizeX() - this.size.x) / 2, this.position.y));
			this.realtimeShadow.shadowObject.DrawToShadowCanvas(this.drawingOperation.tile);
			this.realtimeShadow.UpdateShadow(this.drawingOperation.tile);
		}
	}
}

export { ItemProp };