import { BuildingRecipe, ResourceItemList } from '../../internal.js';


/** @type {Object.<string, BuildingRecipe>} */ let BuildingRecipeList = {};

/**
 * @enum {number}
 * @readonly
 */
const BuildingCategory = {
	Crafting: 0,
	Resource: 1,
	Props: 2,
	Storage: 3,
	Floor:4,
}

BuildingRecipeList.woodenChest = new BuildingRecipe('Wooden Chest', 5, 1, BuildingCategory.Storage, [
	{ amount: 10, item: ResourceItemList.Flitch },
]);
BuildingRecipeList.stoneSmelter = new BuildingRecipe('Stone Smelter', 40, 1, BuildingCategory.Crafting, [
	{ amount: 25, item: ResourceItemList.StoneBlock },
]);
BuildingRecipeList.anvil = new BuildingRecipe('Anvil', 30, 1, BuildingCategory.Crafting, [
	{ amount: 15, item: ResourceItemList.IronBar },
]);
BuildingRecipeList.workbench = new BuildingRecipe('Workbench', 15, 1, BuildingCategory.Crafting, [
	{ amount: 20, item: ResourceItemList.Flitch },
	{ amount: 10, item: ResourceItemList.StoneBlock },
]);
BuildingRecipeList.choppingBlock = new BuildingRecipe('Chopping Block', 5, 1, BuildingCategory.Crafting, [
	{ amount: 10, item: ResourceItemList.BirchLog },
]);
BuildingRecipeList.stoneCutter = new BuildingRecipe('Stone Cutter', 5, 1, BuildingCategory.Crafting, [
	{ amount: 10, item: ResourceItemList.BirchLog },
	{ amount: 5, item: ResourceItemList.StonePiece },
]);
BuildingRecipeList.planerBench = new BuildingRecipe('Planer Bench', 5, 1, BuildingCategory.Crafting, [
	{ amount: 35, item: ResourceItemList.BirchPlank },
	{ amount: 5, item: ResourceItemList.IronBar },
	{ amount: 15, item: ResourceItemList.Nails },
]);
BuildingRecipeList.sawTable = new BuildingRecipe('Saw Table', 5, 1, BuildingCategory.Crafting, [
	{ amount: 40, item: ResourceItemList.BirchPlank },
	{ amount: 15, item: ResourceItemList.IronBar },
	{ amount: 20, item: ResourceItemList.Nails },
]);

BuildingRecipeList.woodenFloor = new BuildingRecipe('Wooden Floor', 1, 1, BuildingCategory.Floor, [
	{ amount: 1, item: ResourceItemList.BirchLog }
]);

export { BuildingRecipeList, BuildingCategory };