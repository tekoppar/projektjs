import { CraftingRecipe, CraftingCategory, ResourceItemList } from '../../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeList = {};

CraftingRecipeList.ironAxe = new CraftingRecipe(ResourceItemList.IronAxe.name, 20, 1, CraftingCategory.Tool, [
	{ amount: 2, item: ResourceItemList.IronBar },
	{ amount: 1, item: ResourceItemList.BirchLog },
]);
CraftingRecipeList.shovel = new CraftingRecipe(ResourceItemList.Shovel.name, 20, 1, CraftingCategory.Tool, [
	{ amount: 2, item: ResourceItemList.IronBar },
	{ amount: 2, item: ResourceItemList.BirchLog },
]);
CraftingRecipeList.pickaxe = new CraftingRecipe(ResourceItemList.Pickaxe.name, 20, 1, CraftingCategory.Tool, [
	{ amount: 4, item: ResourceItemList.IronBar },
	{ amount: 1, item: ResourceItemList.BirchLog },
]);
CraftingRecipeList.hoe = new CraftingRecipe(ResourceItemList.Hoe.name, 20, 1, CraftingCategory.Tool, [
	{ amount: 1, item: ResourceItemList.IronBar },
	{ amount: 3, item: ResourceItemList.BirchLog },
]);

export { CraftingRecipeList };