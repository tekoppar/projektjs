import { CraftingRecipe, CraftingCategory } from '../../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeListPlanerBench = {};

CraftingRecipeListPlanerBench.flitch = new CraftingRecipe('Flitch', 3, 2, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListPlanerBench.birchPlank = new CraftingRecipe('Birch Plank', 4, 1, CraftingCategory.RefinedResource, [
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListPlanerBench.birchBeam = new CraftingRecipe('Birch Beam', 7, 2, CraftingCategory.RefinedResource, [
    {amount: 5, resource:'birchLog', name: 'Birch Log'},
]);

export { CraftingRecipeListPlanerBench };