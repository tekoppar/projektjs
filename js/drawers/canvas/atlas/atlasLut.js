import { Vector2D } from '../../../internal.js';

let AtlasLUT = {};
let ReverseAtlasLUT = {};

AtlasLUT.shortSwordFemale = { url: '/content/sprites/items/weapons/short_sword_female.png', size: new Vector2D(384, 256), tileSize: new Vector2D(64, 64), name: 'shortSwordFemale' };
AtlasLUT.terrain = { url: '/content/sprites/terrain_atlas.png', size: new Vector2D(1024, 1056), tileSize: new Vector2D(32, 32), name: 'terrain' };
AtlasLUT.crops = { url: '/content/sprites/crops.png', size: new Vector2D(1024, 1024), tileSize: new Vector2D(32, 32), name: 'crops' };
AtlasLUT.fence = { url: '/content/sprites/fence.png', size: new Vector2D(1024, 1024), tileSize: new Vector2D(32, 32), name: 'fence' };
AtlasLUT.victorianstreets = { url: '/content/sprites/Collection/victorian-streets.png', size: new Vector2D(512, 3072), tileSize: new Vector2D(32, 32), name: 'victorianstreets' };
AtlasLUT.uipieces = { url: '/content/sprites/ui_big_pieces.png', size: new Vector2D(864, 568), tileSize: new Vector2D(32, 32), name: 'uipieces' };
AtlasLUT.fruitsveggies = { url: '/content/sprites/fruits-veggies.png', size: new Vector2D(1024, 1536), tileSize: new Vector2D(32, 32), name: 'fruitsveggies' };
AtlasLUT.fruitsveggiesseeds = { url: '/content/sprites/fruits-veggies-seeds.png', size: new Vector2D(1024, 512), tileSize: new Vector2D(32, 32), name: 'fruitsveggiesseeds' };
AtlasLUT.farmingfishing = { url: '/content/sprites/farming_fishing.png', size: new Vector2D(640, 640), tileSize: new Vector2D(32, 32), name: 'farmingfishing' };
AtlasLUT.terrainoutside = { url: '/content/sprites/Collection/TerrainOutside.png', size: new Vector2D(1024, 1216), tileSize: new Vector2D(32, 32), name: 'terrainoutside' };
AtlasLUT.items1 = { url: '/content/sprites/items/items1.png', size: new Vector2D(512, 512), tileSize: new Vector2D(32, 32), name: 'items1' };
AtlasLUT.clouds = { url: '/content/sprites/clouds-small.png', size: new Vector2D(224, 64), tileSize: new Vector2D(32, 32), name: 'clouds' };
AtlasLUT.chickenWalk = { url: '/content/sprites/animals/chicken_walk.png', size: new Vector2D(128, 128), tileSize: new Vector2D(32, 32), name: 'chickenWalk' };
AtlasLUT.duckWalk = { url: '/content/sprites/animals/duck_walk.png', size: new Vector2D(128, 160), tileSize: new Vector2D(32, 32), name: 'duckWalk' };
AtlasLUT.inputLeft = { url: '/content/sprites/ui/inputLeft.png', size: new Vector2D(16, 16), tileSize: new Vector2D(16, 16), name: 'inputLeft' };
AtlasLUT.inputRight = { url: '/content/sprites/ui/inputRight.png', size: new Vector2D(16, 16), tileSize: new Vector2D(16, 16), name: 'inputRight' };
AtlasLUT.inputMiddle = { url: '/content/sprites/ui/inputMiddle.png', size: new Vector2D(32, 26), tileSize: new Vector2D(32, 32), name: 'inputMiddle' };
AtlasLUT.floors = { url: '/content/sprites/Collection/floors.png', size: new Vector2D(1024, 2048), tileSize: new Vector2D(32, 32), name: 'floors' };

let AtlasKeys = Object.keys(AtlasLUT);

for (let i = 0, l = AtlasKeys.length; i < l; ++i) {
	ReverseAtlasLUT[AtlasLUT[AtlasKeys[i]].url] = AtlasLUT[AtlasKeys[i]].name;
}

export { AtlasLUT, ReverseAtlasLUT };