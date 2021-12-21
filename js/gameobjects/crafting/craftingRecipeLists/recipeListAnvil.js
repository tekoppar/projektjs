import { CraftingRecipe, CraftingCategory, ResourceItemList } from '../../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeListAnvil = {};

CraftingRecipeListAnvil.copingSaw = new CraftingRecipe(ResourceItemList.CopingSaw.name, 1, 1, CraftingCategory.Tool, [
	{ amount: 1, item: ResourceItemList.IronBar },
	{ amount: 2, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListAnvil.ironHandSaw = new CraftingRecipe(ResourceItemList.IronHandSaw.name, 1, 1, CraftingCategory.Tool, [
	{ amount: 2, item: ResourceItemList.IronBar },
	{ amount: 1, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListAnvil.plane = new CraftingRecipe(ResourceItemList.Plane.name, 1, 1, CraftingCategory.Tool, [
	{ amount: 1, item: ResourceItemList.IronBar },
	{ amount: 2, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListAnvil.ironHammer = new CraftingRecipe(ResourceItemList.IronHammer.name, 1, 1, CraftingCategory.Tool, [
	{ amount: 2, item: ResourceItemList.IronBar },
	{ amount: 2, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListAnvil.layoutSquare = new CraftingRecipe(ResourceItemList.LayoutSquare.name, 1, 1, CraftingCategory.Tool, [
	{ amount: 2, item: ResourceItemList.IronBar },
]);
CraftingRecipeListAnvil.brace = new CraftingRecipe(ResourceItemList.Brace.name, 1, 1, CraftingCategory.Tool, [
	{ amount: 2, item: ResourceItemList.IronBar },
	{ amount: 2, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListAnvil.rawhideHammer = new CraftingRecipe(ResourceItemList.RawhideHammer.name, 1, 1, CraftingCategory.Tool, [
	{ amount: 3, item: ResourceItemList.IronBar },
	{ amount: 1, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListAnvil.chisel = new CraftingRecipe(ResourceItemList.Chisel.name, 1, 1, CraftingCategory.Tool, [
	{ amount: 1, item: ResourceItemList.IronBar },
	{ amount: 1, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListAnvil.pincer = new CraftingRecipe(ResourceItemList.Pincer.name, 1, 1, CraftingCategory.Tool, [
	{ amount: 3, item: ResourceItemList.IronBar },
]);

CraftingRecipeListAnvil.nails = new CraftingRecipe(ResourceItemList.Nails.name, 1, 8, CraftingCategory.RefinedResource, [
	{ amount: 1, item: ResourceItemList.IronBar },
]);

CraftingRecipeListAnvil.steelAxe = new CraftingRecipe(ResourceItemList.SteelAxe.name, 40, 1, CraftingCategory.Tool, [
	{ amount: 15, item: ResourceItemList.SteelBar },
	{ amount: 10, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListAnvil.goldAxe = new CraftingRecipe(ResourceItemList.GoldAxe.name, 60, 1, CraftingCategory.Tool, [
	{ amount: 50, item: ResourceItemList.GoldBar },
	{ amount: 40, item: ResourceItemList.BirchLog },
]);


CraftingRecipeListAnvil.ironSword = new CraftingRecipe(ResourceItemList.IronSword.name, 20, 1, CraftingCategory.Weapon, [
	{ amount: 1, item: ResourceItemList.IronBar },
	{ amount: 3, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListAnvil.steelSword = new CraftingRecipe(ResourceItemList.SteelSword.name, 20, 1, CraftingCategory.Weapon, [
	{ amount: 2, item: ResourceItemList.SteelBar },
	{ amount: 3, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListAnvil.goldSword = new CraftingRecipe(ResourceItemList.GoldSword.name, 20, 1, CraftingCategory.Weapon, [
	{ amount: 4, item: ResourceItemList.GoldBar },
	{ amount: 3, item: ResourceItemList.BirchLog },
]);

CraftingRecipeListAnvil.ironBattleAxe = new CraftingRecipe(ResourceItemList.IronBattleAxe.name, 20, 1, CraftingCategory.Weapon, [
	{ amount: 2, item: ResourceItemList.IronBar },
	{ amount: 3, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListAnvil.steelBattleAxe = new CraftingRecipe(ResourceItemList.SteelBattleAxe.name, 20, 1, CraftingCategory.Weapon, [
	{ amount: 4, item: ResourceItemList.SteelBar },
	{ amount: 3, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListAnvil.goldBattleAxe = new CraftingRecipe(ResourceItemList.GoldBattleAxe.name, 20, 1, CraftingCategory.Weapon, [
	{ amount: 5, item: ResourceItemList.GoldBar },
	{ amount: 3, item: ResourceItemList.BirchLog },
]);

CraftingRecipeListAnvil.ironBattleHammer = new CraftingRecipe(ResourceItemList.IronBattleHammer.name, 20, 1, CraftingCategory.Weapon, [
	{ amount: 3, item: ResourceItemList.IronBar },
	{ amount: 3, item: ResourceItemList.BirchLog },
]);
CraftingRecipeListAnvil.steelBattleHammer = new CraftingRecipe(ResourceItemList.SteelBattleHammer.name, 20, 1, CraftingCategory.Weapon, [
	{ amount: 5, item: ResourceItemList.SteelBar },
	{ amount: 3, item: ResourceItemList.BirchLog },
]);

export { CraftingRecipeListAnvil };