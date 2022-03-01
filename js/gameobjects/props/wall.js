import { ExtendedProp, Tile, AtlasController, ArrayUtility, AllBlockingCollisions, Vector4D, Vector2D, TileULDR } from '../../internal.js';

class Wall extends ExtendedProp {

	/**
	 * Creates a new ExtendedProp
	 * @param {string} name 
	 * @param {Vector2D} position 
	 * @param {*} animations 
	 * @param {string} canvasName 
	 * @param {(Vector4D|Object)} blockingCollisionSize 
	 */
	constructor(name, position, animations, canvasName, blockingCollisionSize = new Vector4D(16, 16, 0, 0)) {
		super(name, position, animations, canvasName, blockingCollisionSize);
	}

	/**
	 * 
	 * @param {Tile} tile 
	 */
	UpdateTile(tile) {
		this.drawingOperation.tile.tileULDR = tile.tileULDR;
		this.drawingOperation.tile.ChangeSprite(tile);
		this.drawingOperation.targetCanvas = AtlasController.GetAtlas(tile.atlas).GetCanvas();
		this.FlagDrawingUpdate(this.position);

		if (this.BlockingCollision !== undefined) {
			this.BlockingCollision.Delete();
			this.drawingOperation.collisionSize.y = 0;
		}

		const tileULDRString = /** @type {string} */ /** @type {unknown} */ (this.drawingOperation.tile.tileULDR);

		if (tileULDRString === 'DownLeft' || tileULDRString === 'Down' || tileULDRString === 'DownRight') {
			this.CreateBlockingCollision(ArrayUtility.CloneObjects(AllBlockingCollisions.wallsBottom));
			this.drawingOperation.collisionSize.y = 32;
		}
	}
}

export { Wall };