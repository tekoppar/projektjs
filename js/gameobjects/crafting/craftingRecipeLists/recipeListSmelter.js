import { CraftingRecipe, CraftingCategory, ResourceItemList } from '../../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeListSmelter = {};

CraftingRecipeListSmelter.coal = new CraftingRecipe(ResourceItemList.Coal.name, 1, 3, CraftingCategory.RefinedResource, [
	{ amount: 1, item: ResourceItemList.CoalLump },
]);
CraftingRecipeListSmelter.ironBar = new CraftingRecipe(ResourceItemList.IronBar.name, 1, 1, CraftingCategory.RefinedResource, [
	{ amount: 1, item: ResourceItemList.Iron },
	{ amount: 1, item: ResourceItemList.Coal },
]);
CraftingRecipeListSmelter.tinBar = new CraftingRecipe(ResourceItemList.TinBar.name, 1, 1, CraftingCategory.RefinedResource, [
	{ amount: 1, item: ResourceItemList.Tin },
	{ amount: 1, item: ResourceItemList.Coal },
]);
CraftingRecipeListSmelter.copperBar = new CraftingRecipe(ResourceItemList.CopperBar.name, 1, 1, CraftingCategory.RefinedResource, [
	{ amount: 1, item: ResourceItemList.Copper },
	{ amount: 1, item: ResourceItemList.Coal },
]);
CraftingRecipeListSmelter.silverBar = new CraftingRecipe(ResourceItemList.SilverBar.name, 1, 1, CraftingCategory.RefinedResource, [
	{ amount: 1, item: ResourceItemList.Silver },
	{ amount: 1, item: ResourceItemList.Coal },
]);
CraftingRecipeListSmelter.goldBar = new CraftingRecipe(ResourceItemList.GoldBar.name, 1, 1, CraftingCategory.RefinedResource, [
	{ amount: 1, item: ResourceItemList.Gold },
	{ amount: 1, item: ResourceItemList.Coal },
]);
CraftingRecipeListSmelter.bronzeBar = new CraftingRecipe(ResourceItemList.BronzeBar.name, 1, 1, CraftingCategory.RefinedResource, [
	{ amount: 1, item: ResourceItemList.Copper },
	{ amount: 1, item: ResourceItemList.Tin },
	{ amount: 1, item: ResourceItemList.Coal },
]);
CraftingRecipeListSmelter.steelBar = new CraftingRecipe(ResourceItemList.SteelBar.name, 1, 1, CraftingCategory.RefinedResource, [
	{ amount: 2, item: ResourceItemList.Iron },
	{ amount: 1, item: ResourceItemList.Tin },
	{ amount: 1, item: ResourceItemList.Coal },
]);

export { CraftingRecipeListSmelter };