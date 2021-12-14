import { CraftingRecipe, CraftingCategory } from '../../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeListStoneCutter = {};

CraftingRecipeListStoneCutter.stoneBlock = new CraftingRecipe('Stone Block', 3, 1, CraftingCategory.RefinedResource, [
    {amount: 4, resource:'stonePiece', name: 'Stone Piece'},
]);

export { CraftingRecipeListStoneCutter };