import { CraftingRecipe, CraftingCategory } from '../../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeListWorkbench = {};

CraftingRecipeListWorkbench.mallet = new CraftingRecipe('Mallet', 1, 1, CraftingCategory.Tool, [
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListWorkbench.bucket = new CraftingRecipe('Bucket', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
    {amount: 1, resource:'iron', name: 'Iron'},
]);
CraftingRecipeListWorkbench.flitch = new CraftingRecipe('Flitch', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'birchLog', name: 'Birch Log'},
]);

export { CraftingRecipeListWorkbench };