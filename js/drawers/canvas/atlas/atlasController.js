import { CanvasAtlas, CanvasAtlasObject, CanvasDrawer } from '../../../internal.js';

/**
 * @class
 * @constructor
 */
class AtlasController {
	/** @type {AtlasController} */ static _Instance;

	constructor(canvasDrawer) {
		AtlasController._Instance = this;
		/** @type {CanvasDrawer} */ this.canvasDrawer = canvasDrawer;
		this.atlasesUrl = {};
		this.canvasAtlases = {};
		this.loadedImages = [];
		this.hasLoadedAllImages = {};
		/** @type {boolean} */ this.isLoadingFinished = false;
	}

	/**
	 * Gets the CanvasAtlas by name
	 * @param {string} name 
	 * @returns {CanvasAtlas}
	 */
	GetAtlas(name) {
		if (this.canvasAtlases[name] !== undefined) {
			return this.canvasAtlases[name];
		} else {
			let keys = Object.keys(this.atlasesUrl);
			for (let i = 0; i < keys.length; ++i) {
				if (keys[i] === name)
					return this.canvasAtlases[this.atlasesUrl[keys[i]]];
			}
		}

		return undefined;
	}

	/**
	 * 
	 * @param {string} name 
	 * @returns {CanvasAtlas}
	 */
	static GetAtlas(name) {
		return AtlasController._Instance.GetAtlas(name);
	}

	/**
	 * Gets the CanvasAtlas by name
	 * @param {string} name 
	 * @returns {CanvasAtlasObject}
	 */
	GetAtlasObject(name) {
		if (this.canvasAtlases[name] !== undefined && this.canvasAtlases[name] instanceof CanvasAtlasObject) {
			return this.canvasAtlases[name];
		} else {
			let keys = Object.keys(this.atlasesUrl);
			for (let i = 0; i < keys.length; ++i) {
				if (keys[i] === name && this.canvasAtlases[this.atlasesUrl[keys[i]]] instanceof CanvasAtlasObject)
					return this.canvasAtlases[this.atlasesUrl[keys[i]]];
			}
		}

		return undefined;
	}

	/**
	 * 
	 * @param {string} name 
	 * @returns {CanvasAtlasObject}
	 */
	static GetAtlasObject(name) {
		return AtlasController._Instance.GetAtlasObject(name);
	}

	/**
	 * Adds a new CanvasAtlas
	 * @param {CanvasAtlas} atlas 
	 * @param {string} name 
	 */
	AddAtlas(atlas, name) {
		if (this.canvasAtlases[name] === undefined) {
			this.canvasAtlases[name] = atlas;
			this.hasLoadedAllImages[name] = false;
			this.isLoadingFinished = false;
		}
	}

	static AddAtlas(atlas, name) {
		return AtlasController._Instance.AddAtlas(atlas, name);
	}

	LoadNewSpriteAtlas(url, width, height, atlasSize, name) {
		if (this.canvasAtlases[name] === undefined) {
			this.LoadSpriteAtlas(url, width, height, atlasSize, name);
			this.hasLoadedAllImages[name] = false;
			this.isLoadingFinished = false;

			this.atlasesUrl[url] = name;
		}
	}

	LoadSpriteAtlas(url, width, height, atlasSize, name) {
		if (this.canvasAtlases[name] === undefined) {
			this.canvasAtlases[name] = new CanvasAtlas(this.canvasDrawer, url, width, height, atlasSize, name);
			this.atlasesUrl[url] = name;
			this.hasLoadedAllImages[name] = false;
		}
	}

	LoadAllAtlases() {
		this.LoadSpriteAtlas('/content/sprites/terrain_atlas.png', 1024, 1216, 32, 'terrain');
		//this.hasLoadedAllImages['terrain'] = false;
		this.LoadSpriteAtlas('/content/sprites/Collection/TerrainOutside.png', 1024, 1216, 32, 'terrainoutside');
		//this.hasLoadedAllImages['terrainoutside'] = false;

		this.LoadSpriteAtlas('/content/sprites/crops.png', 1024, 1024, 32, 'crops');
		//this.hasLoadedAllImages['crops'] = false;
		this.LoadSpriteAtlas('/content/sprites/fence.png', 96, 192, 32, 'fence');
		//this.hasLoadedAllImages['fence'] = false;

		this.LoadSpriteAtlas('/content/sprites/fruits-veggies.png', 1024, 1536, 32, 'fruitsveggies');
		//this.hasLoadedAllImages['fruitsveggies'] = false;
		this.LoadSpriteAtlas('/content/sprites/fruits-veggies-seeds.png', 1024, 512, 32, 'fruitsveggiesseeds');
		//this.hasLoadedAllImages['fruitsveggiesseeds'] = false;
		this.LoadSpriteAtlas('/content/sprites/farming_fishing.png', 640, 640, 32, 'farmingfishing');
		//this.hasLoadedAllImages['farmingfishing'] = false;

		this.LoadSpriteAtlas('/content/sprites/Collection/victorian-streets.png', 512, 3072, 32, 'victorianstreets');
		//this.hasLoadedAllImages['victorianstreets'] = false;
		this.LoadSpriteAtlas('/content/sprites/Collection/walls.png', 2048, 3072, 32, 'walls');
		//this.hasLoadedAllImages['walls'] = false;
		this.LoadSpriteAtlas('/content/sprites/Collection/windows-doors.png', 1024, 1024, 32, 'windowsdoors');
		//this.hasLoadedAllImages['windowsdoors'] = false;
		this.LoadSpriteAtlas('/content/sprites/Collection/roofs.png', 2048, 2048, 32, 'roofs');
		//this.hasLoadedAllImages['windowsdoors'] = false;
		this.LoadSpriteAtlas('/content/sprites/Collection/floors.png', 1024, 2048, 32, 'floors');
		//this.hasLoadedAllImages['floors'] = false;

		this.LoadSpriteAtlas('/content/sprites/Collection/wallsPremade.png', 96, 288, 32, 'wallsPremade');
		//this.hasLoadedAllImages['wallsPremade'] = false;
		
		this.LoadSpriteAtlas('/content/sprites/items/items1.png', 512, 512, 32, 'items1');
		//this.hasLoadedAllImages['items1'] = false;
		this.LoadSpriteAtlas('/content/sprites/items/ore.png', 512, 512, 32, 'ore');
		//this.hasLoadedAllImages['ore'] = false;
		this.LoadSpriteAtlas('/content/sprites/clouds-small.png', 224, 64, 32, 'clouds');
		//this.hasLoadedAllImages['clouds'] = false;
		this.LoadSpriteAtlas('/content/sprites/cottage.png', 512, 512, 32, 'cottage');
		//this.hasLoadedAllImages['cottage'] = false;
		this.LoadSpriteAtlas('/content/sprites/Collection/container.png', 512, 2048, 32, 'container');
		//this.hasLoadedAllImages['container'] = false;

		this.LoadSpriteAtlas('/content/sprites/Collection/blacksmith-smelter.png', 1024, 1024, 32, 'blacksmithsmelter');
		//this.hasLoadedAllImages['blacksmithsmelter'] = false;
		this.LoadSpriteAtlas('/content/sprites/Collection/woodshop.png', 512, 512, 32, 'woodshop');
		//this.hasLoadedAllImages['woodshop'] = false;
		this.LoadSpriteAtlas('/content/sprites/Collection/victorian-market.png', 512, 2560, 32, 'victorianmarket');
		//this.hasLoadedAllImages['victorianmarket'] = false;

		this.LoadSpriteAtlas('/content/sprites/Collection/Exterior_Tiles.png', 1024, 1024, 32, 'exteriorobjects');
		//this.hasLoadedAllImages['exteriorobjects'] = false;
		this.LoadSpriteAtlas('/content/sprites/Collection/Interior.png', 1024, 1024, 32, 'interiorobjects');
		//this.hasLoadedAllImages['interiorobjects'] = false;
		this.LoadSpriteAtlas('/content/sprites/Collection/Outside-Objects.png', 1024, 1024, 32, 'outsideobjects');
		//this.hasLoadedAllImages['outsideobjects'] = false;
		this.LoadSpriteAtlas('/content/sprites/Collection/tailor.png', 512, 512, 32, 'tailor');
		//this.hasLoadedAllImages['tailor'] = false;

		this.LoadSpriteAtlas('/content/sprites/Collection/lpc-ship-accessories.png', 512, 1024, 32, 'shipAccessories');
		//this.hasLoadedAllImages['shipAccessories'] = false;

		this.LoadSpriteAtlas('/content/sprites/items/documents.png', 128, 96, 32, 'documents');
		//this.hasLoadedAllImages['documents'] = false;

		this.LoadSpriteAtlas('/content/sprites/lpcfemalelight_updated.png', 832, 1856, 64, 'femaleLight');
		//this.hasLoadedAllImages['femaleLight'] = false;
		this.LoadSpriteAtlas('/content/sprites/red.png', 832, 1344, 64, 'redHair');
		//this.hasLoadedAllImages['redHair'] = false;
		this.LoadSpriteAtlas('/content/sprites/lpcfemaleunderdress.png', 832, 1344, 64, 'underDress');
		//this.hasLoadedAllImages['underDress'] = false;
		this.LoadSpriteAtlas('./content/sprites/lpc_shadow.png', 832, 1344, 64, 'humanAdultShadow');
		//this.hasLoadedAllImages['humanAdultShadow'] = false;

		this.LoadSpriteAtlas('/content/sprites/npcs/male/lpcmalelight_updated.png', 832, 1856, 64, 'maleLight');
		//this.hasLoadedAllImages['maleLight'] = false;

		this.LoadSpriteAtlas('/content/sprites/npcs/lpc_leather_hood.png', 832, 1856, 64, 'leatherHood');
		//this.hasLoadedAllImages['leatherHood'] = false;
		this.LoadSpriteAtlas('/content/sprites/npcs/lpc_leather_shoes.png', 832, 1856, 64, 'leatherShoes');
		//this.hasLoadedAllImages['leatherShoes'] = false;
		this.LoadSpriteAtlas('/content/sprites/npcs/lpc_leather_armor.png', 832, 1856, 64, 'leatherArmor');
		//this.hasLoadedAllImages['leatherArmor'] = false;
		this.LoadSpriteAtlas('/content/sprites/npcs/lpc_leather_skirt.png', 832, 1856, 64, 'leatherSkirt');
		//this.hasLoadedAllImages['leatherSkirt'] = false;
		this.LoadSpriteAtlas('/content/sprites/npcs/lpc_cloth_pants_green.png', 832, 1856, 64, 'clothPantsGreen');
		//this.hasLoadedAllImages['clothPantsGreen'] = false;

		this.LoadSpriteAtlas('/content/sprites/npcs/lpc_chain_armor_hood.png', 832, 1856, 64, 'chainArmorHood');
		//this.hasLoadedAllImages['chainArmorHood'] = false;
		this.LoadSpriteAtlas('/content/sprites/npcs/lpc_chain_armor_torso.png', 832, 1856, 64, 'chainArmorTorso');
		//this.hasLoadedAllImages['chainArmorTorso'] = false;

		this.LoadSpriteAtlas('/content/sprites/npcs/lpc_plate_armor_gloves.png', 832, 1856, 64, 'plateArmorGloves');
		//this.hasLoadedAllImages['plateArmorGloves'] = false;
		this.LoadSpriteAtlas('/content/sprites/npcs/lpc_plate_armor_helmet.png', 832, 1856, 64, 'plateArmorHelmet');
		//this.hasLoadedAllImages['plateArmorHelmet'] = false;
		this.LoadSpriteAtlas('/content/sprites/npcs/lpc_plate_armor_pants.png', 832, 1856, 64, 'plateArmorPants');
		//this.hasLoadedAllImages['plateArmorPants'] = false;
		this.LoadSpriteAtlas('/content/sprites/npcs/lpc_plate_armor_shoes.png', 832, 1856, 64, 'plateArmorShoes');
		//this.hasLoadedAllImages['plateArmorShoes'] = false;
		this.LoadSpriteAtlas('/content/sprites/npcs/lpc_plate_armor_shoulders.png', 832, 1856, 64, 'plateArmorShoulders');
		//this.hasLoadedAllImages['plateArmorShoulders'] = false;
		this.LoadSpriteAtlas('/content/sprites/npcs/lpc_plate_armor_torso.png', 832, 1856, 64, 'plateArmorTorso');
		//this.hasLoadedAllImages['plateArmorTorso'] = false;

		this.LoadSpriteAtlas('/content/sprites/npcs/hair/idol/male.png', 832, 1344, 64, 'maleHairIdol');
		//this.hasLoadedAllImages['maleHairIdol'] = false;
		this.LoadSpriteAtlas('/content/sprites/npcs/hair/natural/male.png', 832, 1344, 64, 'maleHairNatural');
		//this.hasLoadedAllImages['maleHairNatural'] = false;
		this.LoadSpriteAtlas('/content/sprites/npcs/hair/part2/male.png', 832, 1344, 64, 'maleHairPart2');
		//this.hasLoadedAllImages['maleHairPart2'] = false;
		this.LoadSpriteAtlas('/content/sprites/npcs/hair/messy3/male.png', 832, 1344, 64, 'maleHairMessy3');
		//this.hasLoadedAllImages['maleHairMessy3'] = false;

		this.LoadSpriteAtlas('/content/sprites/animals/chicken_walk.png', 128, 128, 32, 'chickenWalk');
		//this.hasLoadedAllImages['chickenWalk'] = false;
		this.LoadSpriteAtlas('/content/sprites/animals/duck_walk.png', 128, 160, 32, 'duckWalk');
		//this.hasLoadedAllImages['duckWalk'] = false;
		this.LoadSpriteAtlas('/content/sprites/animals/duck_shadow.png', 128, 160, 32, 'duckWalkShadow');
		//this.hasLoadedAllImages['duckWalkShadow'] = false;

		this.LoadSpriteAtlas('/content/sprites/ui/inputLeft.png', 16, 26, 16, 'inputLeft');
		//this.hasLoadedAllImages['inputLeft'] = false;
		this.LoadSpriteAtlas('/content/sprites/ui/inputRight.png', 16, 26, 16, 'inputRight');
		//this.hasLoadedAllImages['inputRight'] = false;
		this.LoadSpriteAtlas('/content/sprites/ui/inputMiddle.png', 32, 26, 32, 'inputMiddle');
		//this.hasLoadedAllImages['inputMiddle'] = false;

		this.LoadSpriteAtlas('/content/sprites/items/weapons/short_sword_female.png', 384, 256, 32, 'shortSwordFemale');
		//this.hasLoadedAllImages['shortSwordFemale'] = false;

		this.LoadSpriteAtlas('/content/sprites/ui_big_pieces.png', 864, 568, 32, 'uipieces');
		//this.hasLoadedAllImages['uipieces'] = false;
	}
}

export { AtlasController };