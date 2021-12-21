import { CraftingRecipe, CraftingCategory, ResourceItemList } from '../../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeListPlanerBench = {};

CraftingRecipeListPlanerBench.flitch = new CraftingRecipe(ResourceItemList.Flitch.name, 3, 1, CraftingCategory.RefinedResource, [
	{ amount: 1, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListPlanerBench.birchPlank = new CraftingRecipe(ResourceItemList.BirchPlank.name, 6, 1, CraftingCategory.RefinedResource, [
	{ amount: 3, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListPlanerBench.birchBeam = new CraftingRecipe(ResourceItemList.BirchBeam.name, 8, 2, CraftingCategory.RefinedResource, [
	{ amount: 5, item: ResourceItemList.BirchLog },
]);

CraftingRecipeListPlanerBench.shortBow = new CraftingRecipe(ResourceItemList.ShortBow.name, 20, 1, CraftingCategory.Weapon, [
	{ amount: 1, item: ResourceItemList.StonePiece },
	{ amount: 3, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListPlanerBench.compositeBow = new CraftingRecipe(ResourceItemList.CompositeBow.name, 20, 1, CraftingCategory.Weapon, [
	{ amount: 1, item: ResourceItemList.StonePiece },
	{ amount: 3, item: ResourceItemList.BirchLog },
]);

export { CraftingRecipeListPlanerBench };