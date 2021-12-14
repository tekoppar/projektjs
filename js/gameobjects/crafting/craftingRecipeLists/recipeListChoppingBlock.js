import { CraftingRecipe, CraftingCategory } from '../../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeListChoppingBlock = {};

CraftingRecipeListChoppingBlock.flitch = new CraftingRecipe('Flitch', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 2, resource:'birchLog', name: 'Birch Log'},
]);

export { CraftingRecipeListChoppingBlock };