import { CraftingRecipe } from '../../internal.js';

let CraftingRecipeList = {};

CraftingRecipeList.axe = new CraftingRecipe('axe', 20, [
    {amount: 2, resource:'stonePiece', name: 'Stone Piece'},
    {amount: 1, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeList.shovel = new CraftingRecipe('shovel', 20, [
    {amount: 2, resource:'stonePiece', name: 'Stone Piece'},
    {amount: 2, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeList.pickaxe = new CraftingRecipe('pickaxe', 20, [
    {amount: 4, resource:'stonePiece', name: 'Stone Piece'},
    {amount: 1, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeList.hoe = new CraftingRecipe('hoe', 20, [
    {amount: 1, resource:'stonePiece', name: 'Stone Piece'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);

export { CraftingRecipeList };