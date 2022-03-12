import {
	Building, Tile, BuildingCategory, ArrayUtility, AllBlockingCollisions,
	Vector4D, Vector2D, TileF, PawnSetupParams, AtlasController
} from '../../../internal.js';

/**
 * @class
 * @constructor
 * @extends Building
 */
class Wall extends Building {

	/**
	 * Creates a new ExtendedProp
	 * @param {string} name 
	 * @param {Vector2D} position 
	 * @param {*} animations 
	 * @param {string} canvasName 
	 * @param {(Vector4D|Object)} blockingCollisionSize 
	 * @param {BuildingCategory} category
	 */
	constructor(name, position, animations, canvasName, blockingCollisionSize = new Vector4D(16, 16, 0, 0), category, tileSet) {
		super(name, position, animations, canvasName, blockingCollisionSize, category);

		/** @type {string} */ this.name = 'wall' + this.UID;
		this.tileSet = tileSet;
	}

	/**
	 * 
	 * @param {Vector2D[]} polygonCollision 
	 * @param {Vector2D} position 
	 * @param {Vector2D} size 
	 * @param {Vector2D} tilePosition 
	 * @param {boolean} createShadow 
	 */
	GameBegin(polygonCollision = undefined, position = new Vector2D(this.position.x, this.position.y), size = new Vector2D(0, 0), tilePosition = new Vector2D(0, 0), createShadow = false) {
		super.GameBegin(polygonCollision, position, size, tilePosition, createShadow);

		if (this?.drawingOperation?.tile !== undefined)
			this.drawingOperation.tile.tileSet = this.tileSet;

		this.UpdateWall();
	}

	/**
	 * Updates the sprite of the wall according to the ULDR
	 */
	UpdateWall() {
		let nearbyObjects = TileF.GetNeighbourObjects(this, this.drawingOperation.tile.tileSet);
		for (let i = 0, l = nearbyObjects.length; i < l; ++i) {
			if (nearbyObjects[i] !== null && nearbyObjects[i].owner instanceof Wall && nearbyObjects[i].owner !== this) {
				let tempUldr = Building.GetBuildingULDR(nearbyObjects[i].owner);
				let tempName = Building.ULDRToBuilding(tempUldr);

				if (PawnSetupParams[tempName] !== undefined) {
					let atlas = AtlasController.GetAtlas(PawnSetupParams[tempName][3]);

					if (atlas !== undefined) {
						nearbyObjects[i].tile.atlas = PawnSetupParams[tempName][3];
						nearbyObjects[i].tile.tileULDR = tempUldr;
						nearbyObjects[i].targetCanvas = atlas.GetCanvas();
						nearbyObjects[i].owner.FlagDrawingUpdate(nearbyObjects[i].owner.position);
						nearbyObjects[i].owner.CreateBlockingCollision(ArrayUtility.CloneObjects(AllBlockingCollisions[PawnSetupParams[tempName][3]]));
					}
				}
			}
		}

		let buildingUldr = Building.GetBuildingULDR(this);
		let buildingName = Building.ULDRToBuilding(buildingUldr);
		if (PawnSetupParams[buildingName] !== undefined) {
			let atlas = AtlasController.GetAtlas(PawnSetupParams[buildingName][3]);

			if (atlas !== undefined) {
				this.drawingOperation.tile.atlas = PawnSetupParams[buildingName][3];
				this.drawingOperation.tile.tileULDR = buildingUldr;
				this.drawingOperation.targetCanvas = atlas.GetCanvas();
				this.FlagDrawingUpdate(this.position);
				this.CreateBlockingCollision(ArrayUtility.CloneObjects(AllBlockingCollisions[PawnSetupParams[buildingName][3]]));
			}
		}
	}

	/**
	 * 
	 * @param {Tile} tile 
	 */
	UpdateTile(tile) {
		super.UpdateTile(tile);

		if (this.BlockingCollision !== undefined) {
			//this.BlockingCollision.Delete();
			//this.drawingOperation.collisionSize.y = 0;
		}

		const tileULDRString = /** @type {string} */ /** @type {unknown} */ (this.drawingOperation.tile.tileULDR);

		if (tileULDRString === 'DownLeft' || tileULDRString === 'Down' || tileULDRString === 'DownRight') {
			//this.CreateBlockingCollision(ArrayUtility.CloneObjects(AllBlockingCollisions.wallsBottom));
			//this.drawingOperation.collisionSize.y = 32;
		}
	}
}

export { Wall };