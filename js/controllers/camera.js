import { Cobject, Rectangle, Vector2D } from '../internal.js';

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class Camera extends Cobject {

	/**
	 * 
	 * @param {Object} parent 
	 * @param {Vector2D} size 
	 */
	constructor(parent, size) {
		super();
		this.cameraSize = size;
		this.parent = parent;
	}

	FixedUpdate() {
		super.FixedUpdate();
	}

	Delete() {
		super.Delete();
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 */
	SetCameraPosition(position) {
		this.position.x = position.x;// Math.max(position.x, this.cameraSize.x * 0.5);
		this.position.y = position.y;//Math.max(position.y, this.cameraSize.y * 0.5);
	}

	/**
	 * 
	 * @returns {Rectangle}
	 */
	GetRect() {
		return new Rectangle(this.position.x - (this.cameraSize.x * 0.5), this.position.y - (this.cameraSize.y * 0.5), this.cameraSize.x, this.cameraSize.y);
	}
}

export { Camera };