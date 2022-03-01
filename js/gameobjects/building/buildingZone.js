import {
	GameObject, Vector2D, BuildingRecipe, ExtendedProp, AllBlockingCollisions, CanvasSprite,
	CanvasDrawer, inventoryItemIcons, Tile, OperationType, AtlasController, CustomEventHandler,
	ObjectClassLUT, PolygonCollision, ArrayUtility, PawnSetupController, Mastertime, BuildingCategory,
	TileF, TileType, PawnSetupParams, TileData, DebugDrawer, Rectangle, TileULDR
} from '../../internal.js';

/**
 * @readonly
 * @enum {number}
 */
const BuildingZoneState = {
	None: 0,
	Progress: 1,
	Finished: 2,
}

/**
 * @class
 * @constructor
 * @extends GameObject
 */
class BuildingZone extends GameObject {
	/** @type {Array<BuildingZone>} */ static _BuildingZones = [];

	/**
	 * 
	 * @param {string} canvasName
	 * @param {Vector2D} position  
	 * @param {ExtendedProp} building 
	 * @param {BuildingRecipe} recipe 
	 */
	constructor(canvasName, position, building, recipe) {
		super(canvasName, position, false);

		/** @type {Tile} */ this.building = building.drawingOperation.tile.Clone();
		/** @type {BuildingRecipe} */ this.buildingRecipe = recipe.Clone();
		/** @type {BuildingZoneState} */ this.zoneState = BuildingZoneState.None;
		/** @type {Vector2D} */ this.size = this.building.size.Clone();
		this.objectBuilding = undefined;
		/** @type {number} */ this.progress = 0;
		/** @type {number} */ this.progressFinished = this.buildingRecipe.GetTotalResourceCost();
		/** @type {number} */ this.secondsPerResource = this.buildingRecipe.time / this.progressFinished;
		/** @type {string} */ this.name = 'buildingZone' + this.UID;

		BuildingZone._BuildingZones.push(this);
	}

	ProgressBuilding() {
		if (this.progress >= this.secondsPerResource) {
			this.progress = 0;
			for (let i = 0, l = this.buildingRecipe.resourceList.length; i < l; ++i) {
				if (this.buildingRecipe.resourceList[i].amount > 0) {
					if (this.objectBuilding.inventory.HasItemAmount(this.buildingRecipe.resourceList[i].item.resource, 1)) {
						let item = this.objectBuilding.inventory.GetItem(this.buildingRecipe.resourceList[i].item.resource);
						this.objectBuilding.inventory.RemoveAmount(this.buildingRecipe.resourceList[i].item.resource, 1);
						this.buildingRecipe.resourceList[i].amount--;

						let sprite = inventoryItemIcons[this.buildingRecipe.resourceList[i].item.resource].sprite;
						CanvasDrawer.GCD.UIDrawer.DrawUIElement(new CanvasSprite(sprite.x, sprite.y, sprite.z, sprite.a, AtlasController.GetAtlas(item.url).name, true), ' -1', this.GetPosition());
						break;
					}
				}
			}

			if (this.buildingRecipe.GetTotalResourceCost() === 0)
				this.zoneState = BuildingZoneState.Finished;
		}
	}

	BuildingFinished() {
		if (ObjectClassLUT[this.buildingRecipe.name] !== undefined) {
			let finishedBuilding = PawnSetupController.CreateNewObject(this.buildingRecipe.name, false, this.position.Clone());

			if (this.buildingRecipe.category === BuildingCategory.Floor || this.buildingRecipe.category === BuildingCategory.Wall) {
				let pos = this.position.Clone();
				pos.DivF(32);
				pos.Floor();
				//let operations = CanvasDrawer.GCD.GetTileAtPosition(pos, false);
				let params = PawnSetupParams[this.buildingRecipe.name];
				let tileData = TileData.GetTileLUT(params[6]).Middle;

				finishedBuilding.drawingOperation.tile.tilePosition.x = tileData.tilePosition.x;
				finishedBuilding.drawingOperation.tile.tilePosition.y = tileData.tilePosition.y;
				finishedBuilding.drawingOperation.tile.atlas = tileData.atlas;
				finishedBuilding.drawingOperation.tile.UpdateTileData();

				TileF.GetPaintedTileData(finishedBuilding);
				
				/*for (let i = 0, l = operations.length; i < l; ++i) {
					if (operations[i].tile.tileType === TileType.Ground) {
						//TileF.PaintTile(new Tile(new Vector2D(0, 0), tileData.tilePosition, new Vector2D(32, 32), TileLUT.terrain[18][6].transparent, tileData.atlas), pos);
					}
				}*/
			}
		}
	}

	FixedUpdate() {
		super.FixedUpdate();

		if (this.zoneState === BuildingZoneState.Progress) {
			this.progress += Mastertime.Delta();
			this.ProgressBuilding();

			if (this.zoneState === BuildingZoneState.Finished) {
				this.BuildingFinished();
				this.Delete();
			}
		}
	}

	EndOfFrameUpdate() {
		super.EndOfFrameUpdate();
	}

	Delete() {
		super.Delete();

		if (BuildingZone._BuildingZones.indexOf(this) !== -1)
			BuildingZone._BuildingZones.splice(BuildingZone._BuildingZones.indexOf(this));
	}

	CEvent(eventType, key) {
		switch (eventType) {
			case 'use':
				if (key !== undefined && key.inventory !== undefined) {
					this.zoneState = BuildingZoneState.Progress;
					this.objectBuilding = key;
				}
				break;

			case 'useStopped':
				if (key !== undefined && key.inventory !== undefined) {
					this.zoneState = BuildingZoneState.None;
					this.objectBuilding = undefined;
				}
				break;
		}

	}

	GameBegin() {
		super.GameBegin();

		this.CreateDrawOperation(
			{ x: this.building.tilePosition.x, y: this.building.tilePosition.y, w: this.building.size.x, h: this.building.size.y },
			this.position,
			false,
			AtlasController.GetAtlas(this.canvasName).GetCanvas(),
			OperationType.gameObjects
		);

		if (this.BoxCollision !== undefined) {
			this.BoxCollision.size = this.size.Clone();
			this.BoxCollision.CalculateBoundingBox();
			this.BoxCollision.SetPosition(this.BoxCollision.position);
		}

		if (AllBlockingCollisions[this.building.atlas] !== undefined) {
			let tempArr = AllBlockingCollisions[this.building.atlas];
			let polygonCollision = ArrayUtility.CloneObjects(tempArr);

			this.BlockingCollision = new PolygonCollision(
				this.BoxCollision.position.Clone(),
				this.size.Clone(),
				polygonCollision,
				true,
				this,
				true
			);
		}

		CustomEventHandler.AddListener(this);
	}
}

export { BuildingZone };