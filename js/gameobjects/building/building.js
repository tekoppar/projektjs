import {
	ExtendedProp, Tile, AtlasController, Vector4D, Vector2D, BuildingCategory, CollisionHandler,
	CollisionCheckEnum, CollisionTypeCheck, Collision, BuildingZone, BuildingRecipe, TileF, GameObject
} from '../../internal.js';

/**
 * @class
 * @constructor
 * @extends ExtendedProp
 */
class Building extends ExtendedProp {

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
		super(name, position, animations, canvasName, blockingCollisionSize);

		/** @type {BuildingCategory} */ this.category = category;
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
	}

	/**
	 * 
	 * @param {GameObject} building 
	 * @returns {string}
	 */
	static GetBuildingULDR(building) {
		let uldr = TileF.GetObjectULDR(building, building.drawingOperation.tile.tileSet);

		if (uldr === 'CopyNeighbour') {
			let neighbouringObjects = TileF.GetNeighbourObjects(building, building.drawingOperation.tile.tileSet);
			let foundTile = neighbouringObjects.find(element => (element !== undefined && element !== null && element.owner !== this && element.tile.tileULDR !== 'Middle'));
			
			if (foundTile !== undefined) {
				return /** @type {string} */ (foundTile.tile.tileULDR);
			} else {
				return 'Middle';
			}
		} else
			return uldr;
	}

	/**
	 * 
	 * @param {string} uldr 
	 * @returns {string}
	 */
	static ULDRToBuilding(uldr) {
		switch (uldr) {
			case 'Center': return undefined;

			case 'UpLeft': return 'wallTopLeft';
			case 'Up': return 'wallTop';
			case 'UpRight': return 'wallTopRight';

			case 'Left': return 'wallLeft';
			case 'Middle': return 'wallMiddle';
			case 'Right': return 'wallRight';

			case 'DownLeft': return 'wallBottomLeft';
			case 'Down': return 'wallBottom';
			case 'DownRight': return 'wallBottomRight';
		}

		return 'wallMiddle';
	}

	/**
	 * 
	 * @param {BuildingZone} building 
	 * @param {BuildingRecipe} buildingRecipe
	 * @param {boolean} isAnchored
	 * @returns 
	 */
	static CheckOverlap(building, buildingRecipe, isAnchored) {
		let overlaps = CollisionHandler.GCH.GetOverlaps(building.BoxCollision, CollisionCheckEnum.Inside, CollisionTypeCheck.All),
			doesOverlap = false;

		for (let i = 0, l = overlaps.length; i < l; ++i) {
			if (overlaps[i].collisionOwner instanceof Building) {
				if (buildingRecipe.category !== BuildingCategory.Floor && overlaps[i].collisionOwner.category !== BuildingCategory.Floor)
					doesOverlap = true;
				if (buildingRecipe.category === BuildingCategory.Floor && overlaps[i].collisionOwner.category === BuildingCategory.Floor)
					doesOverlap = true;
			} else if (overlaps[i].collisionOwner instanceof BuildingZone) {
				if (buildingRecipe.category !== BuildingCategory.Floor && overlaps[i].collisionOwner.buildingRecipe.category !== BuildingCategory.Floor)
					doesOverlap = true;
				if (buildingRecipe.category === BuildingCategory.Floor && overlaps[i].collisionOwner.buildingRecipe.category === BuildingCategory.Floor)
					doesOverlap = true;
			} else {
				doesOverlap = true;
			}
		}

		if (doesOverlap === false) {
			return false;
		} else if (isAnchored === true && Building.CheckAnchorOverlaps(overlaps, building) === false) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * 
	 * @param {Collision[]} overlaps 
	 * @param {BuildingZone} building
	 * @returns {boolean}
	 */
	static CheckAnchorOverlaps(overlaps, building) {
		let returnBool = false;

		for (let i = 0, l = overlaps.length; i < l; ++i) {
			if (overlaps[i].collisionOwner.position.NearlyEqual(building.position) === true) {
				if (building.drawingOperation.Get3DPositionY() === overlaps[i].collisionOwner.drawingOperation.Get3DPositionY()) {
					returnBool = true;
				}
			}
		}

		return returnBool;
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
	}
}

export { Building };