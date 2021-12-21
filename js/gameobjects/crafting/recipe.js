/**
 * @class
 * @constructor
 */
class ResourceItem {
	
	/**
	 * 
	 * @param {string} name 
	 */
	constructor(name) {
		/** @type {string} */ this.resource = name[0].toLowerCase() + name.substring(1, name.length).replace(/\s/gi, '');;
		/** @type {string} */ this.name = name;
	}
}

/**
 * @readonly
 * @enum {ResourceItem}
 */
const ResourceItemList = {
	BirchLog: new ResourceItem('Birch Log'),
	Flitch: new ResourceItem('Flitch'),
	BirchPlank: new ResourceItem('Birch Plank'),
	BirchBeam: new ResourceItem('Birch Beam'),

	StonePiece: new ResourceItem('Stone Piece'),
	StoneBlock: new ResourceItem('Stone Block'),

	Nails: new ResourceItem('Nails'),

	Coal: new ResourceItem('Coal'),
	CoalLump: new ResourceItem('Coal Lump'),
	Iron: new ResourceItem('Iron'),
	IronBar: new ResourceItem('Iron Bar'),
	Copper: new ResourceItem('Copper'),
	CopperBar: new ResourceItem('Copper Bar'),
	Tin: new ResourceItem('Tin'),
	TinBar: new ResourceItem('Tin Bar'),
	Silver: new ResourceItem('Silver'),
	SilverBar: new ResourceItem('Silver Bar'),
	Gold: new ResourceItem('Gold'),
	GoldBar: new ResourceItem('Gold Bar'),
	BronzeBar: new ResourceItem('Bronze Bar'),
	SteelBar: new ResourceItem('Steel Bar'),

	IronAxe: new ResourceItem('Iron Axe'),
	SteelAxe: new ResourceItem('Steel Axe'),
	GoldAxe: new ResourceItem('Gold Axe'),

	Mallet: new ResourceItem('Mallet'),
	Bucket: new ResourceItem('Bucket'),
	CopingSaw: new ResourceItem('Coping Saw'),
	IronHandSaw: new ResourceItem('Iron Hand Saw'),
	Plane: new ResourceItem('Plane'),
	IronHammer: new ResourceItem('Iron Hammer'),
	LayoutSquare: new ResourceItem('Layout Square'),
	Brace: new ResourceItem('Brace'),
	RawhideHammer: new ResourceItem('Rawhide Hammer'),
	Chisel: new ResourceItem('Chisel'),
	Pincer: new ResourceItem('Pincer'),
	Shovel: new ResourceItem('Shovel'),
	Pickaxe: new ResourceItem('Pickaxe'),
	Hoe: new ResourceItem('Hoe'),

	ShortBow: new ResourceItem('Short Bow'),
	CompositeBow: new ResourceItem('Composite Bow'),

	IronSword: new ResourceItem('Iron Sword'),
	SteelSword: new ResourceItem('Steel Sword'),
	GoldSword: new ResourceItem('Gold Sword'),

	IronBattleAxe: new ResourceItem('Iron Battle Axe'),
	SteelBattleAxe: new ResourceItem('Steel Battle Axe'),
	GoldBattleAxe: new ResourceItem('Gold Battle Axe'),

	IronBattleHammer: new ResourceItem('Iron Battle Hammer'),
	SteelBattleHammer: new ResourceItem('Steel Battle Hammer'),
};

/**
 * @class
 * @constructor
 */
class Recipe {

	/**
	 * 
	 * @param {string} name 
	 * @param {number} time 
	 * @param {number} amount 
	 * @param {Array<{amount: number, item: ResourceItem}>} resourceList 
	 */
	constructor(name, time, amount, resourceList) {
		/** @type {string} */ this.name = name[0].toLowerCase() + name.substring(1, name.length).replace(/\s/gi, '');
		/** @type {string} */ this.displayName = name;
		/** @type {number} */ this.time = time;
		/** @type {number} */ this.amount = amount
		/** @type {Array<{amount: number, item: ResourceItem}>} */ this.resourceList = resourceList;
	}
}

export { Recipe, ResourceItemList, ResourceItem };