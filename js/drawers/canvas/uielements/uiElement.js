import { DrawingOperation, TextOperation } from '../../../internal.js';

/**
 * @class
 * @constructor
 */
class UIElement {
	/**
	 * 
	 * @param {Number} lifeTime 
	 */
	constructor(lifeTime = 1) {
		/** @type {Array<(DrawingOperation|TextOperation)>} */
		this.drawingOperations = [];
		this.lifeTime = lifeTime;
	}

	AddOperations(delta) {
		for (let i = 0, l = this.drawingOperations.length; i < l; ++i) {
			this.drawingOperations[i].Update();
			this.drawingOperations[i].GetPosition().y -= delta * 25;

		}
		this.lifeTime -= delta;
	}

	RemoveUI() {
		for (let i = 0, l = this.drawingOperations.length; i < l; ++i) {
			this.drawingOperations[i].Delete();
		}
	}
}

export { UIElement };