import { CraftingRecipe } from '../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeList = {};

/**
 * @enum {Number}
 * @readonly
 */
const CraftingCategory = {
    Tool: 0,
    Weapon: 1,
    RefinedResource: 2,
}

CraftingRecipeList.ironAxe = new CraftingRecipe('ironAxe', 20, 1, CraftingCategory.Tool, [
    {amount: 2, resource:'ironBar', name: 'Iron Bar'},
    {amount: 1, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeList.steelAxe = new CraftingRecipe('steelAxe', 40, 1, CraftingCategory.Tool, [
    {amount: 15, resource:'steelBar', name: 'Steel Bar'},
    {amount: 10, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeList.goldAxe = new CraftingRecipe('goldAxe', 60, 1, CraftingCategory.Tool, [
    {amount: 50, resource:'goldBar', name: 'Gold Bar'},
    {amount: 40, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeList.shovel = new CraftingRecipe('shovel', 20, 1, CraftingCategory.Tool, [
    {amount: 2, resource:'stonePiece', name: 'Stone Piece'},
    {amount: 2, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeList.pickaxe = new CraftingRecipe('pickaxe', 20, 1, CraftingCategory.Tool, [
    {amount: 4, resource:'stonePiece', name: 'Stone Piece'},
    {amount: 1, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeList.hoe = new CraftingRecipe('hoe', 20, 1, CraftingCategory.Tool, [
    {amount: 1, resource:'stonePiece', name: 'Stone Piece'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);

CraftingRecipeList.shortBow = new CraftingRecipe('shortBow', 20, 1, CraftingCategory.Weapon, [
    {amount: 1, resource:'stonePiece', name: 'Stone Piece'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeList.compositeBow = new CraftingRecipe('compositeBow', 20, 1, CraftingCategory.Weapon, [
    {amount: 1, resource:'stonePiece', name: 'Stone Piece'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);

export { CraftingRecipeList, CraftingCategory };