import { Cobject, ItemStats, Vector2D, Inventory, Collision, inventoryItemIcons, CustomEventHandler, CollisionHandler, CanvasDrawer, Tile, TileType, TileF, TileLUT, ItemValues, CanvasSprite, CMath, Vector4D, AtlasController } from '../../internal.js';


/**
 * @readonly
 * @enum {boolean}
 */
const stackableItems = {
	shovel: false,
	ironAxe: false,
	steelAxe: false,
	goldAxe: false,
	hoe: false,
	pickaxe: false,
	ironSword: false,
	steelSword: false,
	goldSword: false,
	mallet: false,
	copingSaw: false,
	ironHandSaw: false,
	plane: false,
	ironHammer: false,
	layoutSquare: false,
	brace: false,
	rawhideHammer: false,
	chisel: false,
	pincer: false,
};

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class Item extends Cobject {

	/**
	 * Creates a new Item
	 * @param {string} name 
	 * @param {number} amount 
	 */
	constructor(name, amount = 0) {
		super();

		/** @type {string} */ this.name = name;
		/** @type {number} */ this.amount = amount;
		/** @type {Vector4D} */ this.sprite = inventoryItemIcons[name].sprite;
		/** @type {Vector2D} */ this.atlasSize = inventoryItemIcons[name].atlasSize;
		/** @type {string} */ this.url = inventoryItemIcons[name].url;
		/** @type {string} */ this.atlas = AtlasController.GetAtlas(this.url).name;
		/** @type {boolean} */ this.isUsableItem = this.amount > 0 ? true : false;
		/** @type {boolean} */ this.isStackable = stackableItems[this.name] === undefined ? true : stackableItems[this.name];
		/** @type {number} */ this.value = ItemValues[this.name] !== undefined ? ItemValues[this.name] : 0;
		/** @type {Inventory} */ this.inventory = undefined;
	}

	Delete() {
		super.Delete();
	}

	/**
	 * 
	 * @returns {string}
	 */
	GetRealName() {
		let realName = this.name.replace(/([A-Z])/g, ' $1');
		return realName.charAt(0).toUpperCase() + realName.slice(1, realName.length);
	}

	/**
	 * 
	 * @param {number} value 
	 */
	AddAmount(value) {
		this.amount += Number(value);
	}

	/**
	 * 
	 * @param {number} value 
	 */
	RemoveAmount(value) {
		this.amount -= Number(value);
	}

	/**
	 * 
	 * @param {number} amount 
	 * @returns {boolean}
	 */
	HasAmount(amount) {
		return this.amount >= amount;
	}

	/**
	 * 
	 * @returns {(number|string)}
	 */
	GetAmount() {
		if (this.amount < 1000)
			return this.amount;
		else if (this.amount > 1000 && this.amount < 1000000)
			return Math.floor(this.amount / 1000) + 'k';
		else if (this.amount > 1000000 && this.amount < 1000000000)
			return Math.floor(this.amount / 1000 / 1000) + 'm';
		else
			return Math.floor(this.amount / 1000 / 1000 / 1000) + 'b';
	}

	/**
	 * 
	 * @returns {number} 
	 */
	GetAmountAsNumber() {
		return this.amount;
	}

	/**
	 * 
	 * @param {Collision} ownerCollision 
	 */
	//@ts-ignore
	UseItem(ownerCollision) {
		this.RemoveAmount(1);
		this.inventory.didInventoryChange = true;

		if (this.amount <= 0 && this.isUsableItem === true) {
			this.inventory.RemoveItem(this);
			this.Delete();
		}
	}

	GetHTMLInformation() {

	}
}

/**
 * @class
 * @constructor
 * @extends Item
 */
class UsableItem extends Item {

	/**
	 * 
	 * @param {string} name 
	 * @param {number} amount 
	 */
	constructor(name, amount) {
		super(name, amount);
		/** @type {number} */ this.durability = ItemStats[this.name].durability;
		/** @type {boolean} */ this.drawTilePreview = ItemStats[this.name].tilePreview;
	}

	Delete() {
		this.inventory.RemoveItem(this);
		super.Delete();
	}

	/**
	 * 
	 * @returns {string}
	 */
	GetRealName() {
		return super.GetRealName();
	}

	/**
	 * 
	 * @param {number} value 
	 */
	AddAmount(value) {
		super.AddAmount(value);
	}

	/**
	 * 
	 * @param {number} value 
	 */
	RemoveAmount(value) {
		super.RemoveAmount(value);
	}

	/**
	 * 
	 * @param {number} amount 
	 * @returns {boolean}
	 */
	HasAmount(amount) {
		return super.HasAmount(amount);
	}

	/**
	 * 
	 * @returns {(number|string)}
	 */
	GetAmount() {
		return super.GetAmount();
	}

	Durability() {
		this.durability--;

		if (this.durability <= 0) {
			this.Delete();
		}
	}

	UseItem(ownerCollision) {
		super.UseItem(ownerCollision);
	}
}


/**
 * @class
 * @constructor
 * @extends UsableItem
 */
class Hoe extends UsableItem {

	/**
	 * 
	 * @param {string} name 
	 * @param {number} amount 
	 */
	constructor(name, amount) {
		super(name, amount);
	}

	/**
	 * 
	 * @param {Collision} ownerCollision 
	 */
	UseItem(ownerCollision) {
		let overlap = CollisionHandler.GCH.GetOverlap(ownerCollision);

		if (overlap !== undefined) {
			if (overlap.collisionOwner !== undefined && overlap.collisionOwner.plantData !== undefined && ownerCollision.collisionOwner.BoxCollision.CheckInRealRange(overlap, 112)) {
				overlap.collisionOwner.Delete();
			}
		}

		if (ownerCollision.CheckInRealRange(ownerCollision.collisionOwner.BoxCollision, 112)) {
			let pos = ownerCollision.position.Clone();
			pos.Div(new Vector2D(32, 32));
			pos.Floor();
			let operations = CanvasDrawer.GCD.GetTileAtPosition(pos, false);

			for (let i = 0, l = operations.length; i < l; ++i) {
				if (operations[i].tile.tileType === TileType.Ground) {
					TileF.PaintTile(new Tile(new Vector2D(0, 0), new Vector2D(6, 18), new Vector2D(32, 32), TileLUT.terrain[18][6].transparent, 'terrain'), pos);
					operations[i].tile.ChangeSprite(new Tile(new Vector2D(0, 0), new Vector2D(6, 18), new Vector2D(32, 32), TileLUT.terrain[18][6].transparent, 'terrain'));
					CanvasDrawer.UpdateTerrainOperation(operations[i]);
					this.Durability();
				}
			}
		}
		CustomEventHandler.NewCustomEvent(this.name, this);
		super.UseItem(ownerCollision);
	}
}

/**
 * @class
 * @constructor
 * @extends UsableItem
 */
class Shovel extends UsableItem {

	/**
	 * 
	 * @param {string} name 
	 * @param {number} amount 
	 */
	constructor(name, amount) {
		super(name, amount);
	}

	/**
	 * 
	 * @param {Collision} ownerCollision 
	 */
	UseItem(ownerCollision) {
		let overlap = CollisionHandler.GCH.GetOverlap(ownerCollision);

		if (overlap !== undefined) {
			console.log('shovelOverlap');
		}
		CustomEventHandler.NewCustomEvent(this.name, this);
		super.UseItem(ownerCollision);
	}
}

/**
 * @class
 * @constructor
 * @extends UsableItem
 */
class Axe extends UsableItem {

	/**
	 * 
	 * @param {string} name 
	 * @param {number} amount 
	 */
	constructor(name, amount) {
		super(name, amount);
	}

	/**
	 * 
	 * @param {Collision} ownerCollision 
	 */
	UseItem(ownerCollision) {
		let overlap = CollisionHandler.GCH.GetOverlapByClass(ownerCollision, 'Tree');

		if (overlap !== undefined && overlap !== false && ownerCollision.DoOverlap(overlap.collisionOwner.BlockingCollision, true) && ownerCollision.collisionOwner.position.CheckInRange(overlap.GetCenterPosition(), 48)) { // ownerCollision.CheckInRealRange(ownerCollision.collisionOwner.BoxCollision, 112)) {
			let objPrototype = Object.getPrototypeOf(overlap.collisionOwner);
			if (objPrototype.constructor.name === 'Tree') {
				let damage = ownerCollision.collisionOwner.characterAttributes.GetDamage();

				damage += CMath.RandomFloat(ItemStats[this.name].damage.x, ItemStats[this.name].damage.y);

				overlap.OnHit(damage, ownerCollision);
				this.Durability();
			}
		}
		CustomEventHandler.NewCustomEvent(this.name, this);
		super.UseItem(ownerCollision);
	}
}

/**
 * @class
 * @constructor
 * @extends UsableItem
 */
class Pickaxe extends UsableItem {

	/**
	 * 
	 * @param {string} name 
	 * @param {number} amount 
	 */
	constructor(name, amount) {
		super(name, amount);
	}

	/**
	 * 
	 * @param {Collision} ownerCollision 
	 */
	UseItem(ownerCollision) {
		let overlap = CollisionHandler.GCH.GetOverlapByClass(ownerCollision, 'Rock');

		if (overlap !== undefined && overlap !== false && ownerCollision.DoOverlap(overlap.collisionOwner.BlockingCollision, true)) { // ownerCollision.CheckInRealRange(ownerCollision.collisionOwner.BoxCollision, 112)) {
			let damage = ownerCollision.collisionOwner.characterAttributes.GetDamage();

			damage += CMath.RandomFloat(ItemStats[this.name].damage.x, ItemStats[this.name].damage.y);

			overlap.OnHit(damage, ownerCollision);
			this.Durability();
		}
		CustomEventHandler.NewCustomEvent(this.name, this);
		super.UseItem(ownerCollision);
	}
}

/**
 * @class
 * @constructor
 * @extends UsableItem
 */
class Weapon extends UsableItem {

	/**
	 * 
	 * @param {string} name 
	 * @param {number} amount 
	 */
	constructor(name, amount) {
		super(name, amount);
	}

	/**
	 * 
	 * @param {Collision} ownerCollision 
	 */
	UseItem(ownerCollision) {
		let overlap = CollisionHandler.GCH.GetOverlapByClass(ownerCollision, 'Character');

		if (overlap !== undefined && overlap !== false && overlap.collisionOwner !== null && ownerCollision.DoOverlap(overlap.collisionOwner.BlockingCollision, true)) { // ownerCollision.CheckInRealRange(ownerCollision.collisionOwner.BoxCollision, 112)) {

			let guiPos = overlap.collisionOwner.GetPosition().Clone(),
				damage = ownerCollision.collisionOwner.characterAttributes.GetDamage();

			damage += CMath.RandomFloat(ItemStats[this.name].damage.x, ItemStats[this.name].damage.y);


			guiPos.y -= overlap.collisionOwner.drawingOperation.GetSize().y;

			CanvasDrawer.GCD.UIDrawer.DrawUIElement(
				new CanvasSprite(
					inventoryItemIcons[this.name].sprite.x,
					inventoryItemIcons[this.name].sprite.y,
					inventoryItemIcons[this.name].sprite.z,
					inventoryItemIcons[this.name].sprite.a,
					inventoryItemIcons[this.name].url
				),
				' ' + damage.toFixed(2),
				guiPos
			);
			overlap.OnHit(damage * -1, ownerCollision);
			this.Durability();
		}
		CustomEventHandler.NewCustomEvent(this.name, this);
		super.UseItem(ownerCollision);
	}
}

/** @readonly @type {Object.<string, Object>} */ let ItemPrototypeList = {};
/** @lends {Pickaxe.prototype} */ ItemPrototypeList.pickaxe = Pickaxe.prototype;
/** @lends {Axe.prototype} */ ItemPrototypeList.axe = Axe.prototype;
/** @lends {Shovel.prototype} */ ItemPrototypeList.shovel = Shovel.prototype;
/** @lends {Hoe.prototype} */ ItemPrototypeList.hoe = Hoe.prototype;
/** @lends {Weapon.prototype} */ ItemPrototypeList.weapon = Weapon.prototype;

export { Item, UsableItem, Shovel, Hoe, Axe, Pickaxe, Weapon, ItemPrototypeList };