import { CraftingRecipe, CraftingCategory, ResourceItemList } from '../../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeListChoppingBlock = {};

CraftingRecipeListChoppingBlock.flitch = new CraftingRecipe(ResourceItemList.Flitch.name, 1, 1, CraftingCategory.RefinedResource, [
	{ amount: 2, item: ResourceItemList.BirchLog },
	{ amount: 0, item: ResourceItemList.IronAxe },
]);

export { CraftingRecipeListChoppingBlock };