import { CraftingRecipe, CraftingCategory, ResourceItemList } from '../../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeListSawTable = {};

CraftingRecipeListSawTable.flitch = new CraftingRecipe(ResourceItemList.Flitch.name, 4, 2, CraftingCategory.RefinedResource, [
	{ amount: 1, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListSawTable.birchPlank = new CraftingRecipe(ResourceItemList.BirchPlank.name, 7, 1, CraftingCategory.RefinedResource, [
	{ amount: 2, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListSawTable.birchBeam = new CraftingRecipe(ResourceItemList.BirchBeam.name, 12, 2, CraftingCategory.RefinedResource, [
	{ amount: 4, item: ResourceItemList.BirchLog },
]);


export { CraftingRecipeListSawTable };