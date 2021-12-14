import { CraftingRecipe, CraftingCategory } from '../../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeListSmelter = {};

CraftingRecipeListSmelter.coal = new CraftingRecipe('coal', 1, 3, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'coalLump', name: 'CoalLump'},
]);
CraftingRecipeListSmelter.ironBar = new CraftingRecipe('ironBar', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'iron', name: 'Iron'},
    {amount: 1, resource:'coal', name: 'Coal'},
]);
CraftingRecipeListSmelter.tinBar = new CraftingRecipe('tinBar', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'tin', name: 'Tin'},
    {amount: 1, resource:'coal', name: 'Coal'},
]);
CraftingRecipeListSmelter.copperBar = new CraftingRecipe('copperBar', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'copper', name: 'Copper'},
    {amount: 1, resource:'coal', name: 'Coal'},
]);
CraftingRecipeListSmelter.silverBar = new CraftingRecipe('silverBar', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'silver', name: 'Silver'},
    {amount: 1, resource:'coal', name: 'Coal'},
]);
CraftingRecipeListSmelter.goldBar = new CraftingRecipe('goldBar', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'gold', name: 'Gold'},
    {amount: 1, resource:'coal', name: 'Coal'},
]);
CraftingRecipeListSmelter.bronzeBar = new CraftingRecipe('bronzeBar', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'copper', name: 'Copper'},
    {amount: 1, resource:'tin', name: 'Tin'},
    {amount: 1, resource:'coal', name: 'Coal'},
]);
CraftingRecipeListSmelter.steelBar = new CraftingRecipe('steelBar', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 2, resource:'iron', name: 'Iron'},
    {amount: 1, resource:'tin', name: 'Tin'},
    {amount: 1, resource:'coal', name: 'Coal'},
]);

export { CraftingRecipeListSmelter };