import { CraftingRecipe, CraftingCategory, ResourceItemList } from '../../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeListStoneCutter = {};

CraftingRecipeListStoneCutter.stoneBlock = new CraftingRecipe(ResourceItemList.StoneBlock.name, 3, 1, CraftingCategory.RefinedResource, [
	{ amount: 4, item: ResourceItemList.StonePiece },
]);

export { CraftingRecipeListStoneCutter };