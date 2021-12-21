import { Item, Plant, CollisionHandler, Collision, CustomEventHandler, GUI, CanvasDrawer, DebugDrawer } from '../../../internal.js';

/**
 * @readonly
 * @enum {Number}
 */
const SeedTypeEnum = {
	PotatoSeed: 0
}

/**
 * @class
 * @constructor
 * @extends Item
 */
class Seed extends Item {

	/**
	 * Creates a new Seed
	 * @param {string} name 
	 * @param {Number} amount 
	 * @param {SeedTypeEnum} seedType 
	 */
	constructor(name, amount, seedType = SeedTypeEnum.PotatoSeed) {
		super(name, amount);
		this.SeedType = seedType;
	}

	/**
	 * 
	 * @param {Collision} ownerCollision 
	 * @returns {void}
	 */
	UseItem(ownerCollision) {
		let overlap = CollisionHandler.GCH.GetOverlap(ownerCollision);
		let a = ownerCollision.collisionOwner.BoxCollision.GetCenterPositionV2();
		a.SnapToGridF(32);
		let b = ownerCollision.position.Clone();
		b.SnapToGridF(32);

		DebugDrawer.AddDebugOperation(a, 2, 'pink');
		DebugDrawer.AddDebugOperation(b, 2, 'red');

		if (overlap === undefined && a.CheckInRange(b, 96)) {

			let checkPos = ownerCollision.collisionOwner.GetPosition().Clone();
			checkPos.ToGrid(32);
			let tiles = CanvasDrawer.GCD.GetTileAtPosition(checkPos, false);

			if (tiles !== undefined) {
				for (let tile of tiles) {
					if (tile.tile.tileSet !== 'soilTiled' && tile.tile.tileSet !== 'soilTiledCorner')
						return
				}

				let plantName = this.name.replace('Seed', '');
				b.y -= 32;
				let newPlant = new Plant('crops', plantName, b);
				CustomEventHandler.AddListener(newPlant);

				super.UseItem(ownerCollision);
			}
		}
	}

	GetHTMLInformation() {
		super.GetHTMLInformation();
		let sprite = GUI.CreateSprite(this);
		sprite.style.alignSelf = 'center';
		return [sprite, GUI.CreateParagraph(this.GetRealName()), GUI.CreateParagraph('Amount: ' + this.amount), GUI.CreateParagraph('Cost: ' + this.value)];
	}
}

export { Seed };