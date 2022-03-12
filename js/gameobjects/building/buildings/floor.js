import { Building, Tile, BuildingCategory, Vector4D, Vector2D } from '../../../internal.js';

class Floor extends Building {

	/**
	 * Creates a new ExtendedProp
	 * @param {string} name 
	 * @param {Vector2D} position 
	 * @param {*} animations 
	 * @param {string} canvasName 
	 * @param {(Vector4D|Object)} blockingCollisionSize 
	 * @param {BuildingCategory} category
	 */
	constructor(name, position, animations, canvasName, blockingCollisionSize = new Vector4D(16, 16, 0, 0), category) {
		super(name, position, animations, canvasName, blockingCollisionSize, category);

		/** @type {string} */ this.name = 'floor' + this.UID;
	}

	/**
	 * 
	 * @param {Tile} tile 
	 */
	UpdateTile(tile) {
		super.UpdateTile(tile);
	}
}

export { Floor };