import { CraftingRecipe, CraftingCategory, ResourceItemList } from '../../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeListWorkbench = {};

CraftingRecipeListWorkbench.mallet = new CraftingRecipe(ResourceItemList.Mallet.name, 1, 1, CraftingCategory.Tool, [
	{ amount: 3, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListWorkbench.bucket = new CraftingRecipe(ResourceItemList.Bucket.name, 1, 1, CraftingCategory.Tool, [
	{ amount: 3, item: ResourceItemList.BirchLog },
	{ amount: 1, item: ResourceItemList.Iron },
]);
CraftingRecipeListWorkbench.flitch = new CraftingRecipe(ResourceItemList.Flitch.name, 1, 1, CraftingCategory.RefinedResource, [
	{ amount: 1, item: ResourceItemList.BirchLog },
]);

CraftingRecipeListWorkbench.nails = new CraftingRecipe(ResourceItemList.Nails.name, 1, 3, CraftingCategory.RefinedResource, [
	{ amount: 1, item: ResourceItemList.IronBar },
]);

CraftingRecipeListWorkbench.ironAxe = new CraftingRecipe(ResourceItemList.IronAxe.name, 20, 1, CraftingCategory.Tool, [
	{ amount: 1, item: ResourceItemList.IronBar },
	{ amount: 1, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListWorkbench.shovel = new CraftingRecipe(ResourceItemList.Shovel.name, 20, 1, CraftingCategory.Tool, [
	{ amount: 1, item: ResourceItemList.IronBar },
	{ amount: 2, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListWorkbench.pickaxe = new CraftingRecipe(ResourceItemList.Pickaxe.name, 20, 1, CraftingCategory.Tool, [
	{ amount: 2, item: ResourceItemList.IronBar },
	{ amount: 1, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListWorkbench.hoe = new CraftingRecipe(ResourceItemList.Hoe.name, 20, 1, CraftingCategory.Tool, [
	{ amount: 1, item: ResourceItemList.IronBar },
	{ amount: 2, item: ResourceItemList.BirchLog },
]);

export { CraftingRecipeListWorkbench };