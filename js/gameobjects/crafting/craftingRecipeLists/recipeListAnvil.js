import { CraftingRecipe, CraftingCategory } from '../../../internal.js';

/** @type {Object.<string, CraftingRecipe>} */
let CraftingRecipeListAnvil = {};

CraftingRecipeListAnvil.copingSaw = new CraftingRecipe('copingSaw', 1, 1, CraftingCategory.Tool, [
    {amount: 1, resource:'ironBar', name: 'Iron Bar'},
    {amount: 2, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListAnvil.ironHandSaw = new CraftingRecipe('ironHandSaw', 1, 1, CraftingCategory.Tool, [
    {amount: 2, resource:'ironBar', name: 'Iron Bar'},
    {amount: 1, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListAnvil.plane = new CraftingRecipe('plane', 1, 1, CraftingCategory.Tool, [
    {amount: 1, resource:'ironBar', name: 'Iron Bar'},
    {amount: 2, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListAnvil.ironHammer = new CraftingRecipe('ironHammer', 1, 1, CraftingCategory.Tool, [
    {amount: 2, resource:'ironBar', name: 'Iron Bar'},
    {amount: 2, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListAnvil.layoutSquare = new CraftingRecipe('layoutSquare', 1, 1, CraftingCategory.Tool, [
    {amount: 2, resource:'ironBar', name: 'Iron Bar'},
]);
CraftingRecipeListAnvil.brace = new CraftingRecipe('brace', 1, 1, CraftingCategory.Tool, [
    {amount: 2, resource:'ironBar', name: 'Iron Bar'},
    {amount: 2, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListAnvil.rawhideHammer = new CraftingRecipe('rawhideHammer', 1, 1, CraftingCategory.Tool, [
    {amount: 3, resource:'ironBar', name: 'Iron Bar'},
    {amount: 1, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListAnvil.chisel = new CraftingRecipe('chisel', 1, 1, CraftingCategory.Tool, [
    {amount: 1, resource:'ironBar', name: 'Iron Bar'},
    {amount: 1, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListAnvil.pincer = new CraftingRecipe('pincer', 1, 1, CraftingCategory.Tool, [
    {amount: 3, resource:'ironBar', name: 'Iron Bar'},
]);


CraftingRecipeListAnvil.ironSword = new CraftingRecipe('ironSword', 20, 1, CraftingCategory.Weapon, [
    {amount: 1, resource:'ironBar', name: 'Iron Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListAnvil.steelSword = new CraftingRecipe('steelSword', 20, 1, CraftingCategory.Weapon, [
    {amount: 2, resource:'steelBar', name: 'Steel Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListAnvil.goldSword = new CraftingRecipe('goldSword', 20, 1, CraftingCategory.Weapon, [
    {amount: 4, resource:'goldBar', name: 'Gold Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);

CraftingRecipeListAnvil.ironBattleAxe = new CraftingRecipe('ironBattleAxe', 20, 1, CraftingCategory.Weapon, [
    {amount: 2, resource:'ironBar', name: 'Iron Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListAnvil.steelBattleAxe = new CraftingRecipe('steelBattleAxe', 20, 1, CraftingCategory.Weapon, [
    {amount: 4, resource:'steelBar', name: 'Steel Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListAnvil.goldBattleAxe = new CraftingRecipe('goldBattleAxe', 20, 1, CraftingCategory.Weapon, [
    {amount: 5, resource:'goldBar', name: 'Gold Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);

CraftingRecipeListAnvil.ironBattleHammer = new CraftingRecipe('ironBattleHammer', 20, 1, CraftingCategory.Weapon, [
    {amount: 3, resource:'ironBar', name: 'Iron Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeListAnvil.steelBattleHammer = new CraftingRecipe('steelBattleHammer', 20, 1, CraftingCategory.Weapon, [
    {amount: 5, resource:'steelBar', name: 'Steel Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);

export { CraftingRecipeListAnvil };