import { CraftingRecipe } from '../../internal.js';

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

CraftingRecipeList.ironSword = new CraftingRecipe('ironSword', 20, 1, CraftingCategory.Weapon, [
    {amount: 1, resource:'ironBar', name: 'Iron Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeList.steelSword = new CraftingRecipe('steelSword', 20, 1, CraftingCategory.Weapon, [
    {amount: 2, resource:'steelBar', name: 'Steel Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeList.goldSword = new CraftingRecipe('goldSword', 20, 1, CraftingCategory.Weapon, [
    {amount: 4, resource:'goldBar', name: 'Gold Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);

CraftingRecipeList.ironBattleAxe = new CraftingRecipe('ironBattleAxe', 20, 1, CraftingCategory.Weapon, [
    {amount: 2, resource:'ironBar', name: 'Iron Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeList.steelBattleAxe = new CraftingRecipe('steelBattleAxe', 20, 1, CraftingCategory.Weapon, [
    {amount: 4, resource:'steelBar', name: 'Steel Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeList.goldBattleAxe = new CraftingRecipe('goldBattleAxe', 20, 1, CraftingCategory.Weapon, [
    {amount: 5, resource:'goldBar', name: 'Gold Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);

CraftingRecipeList.ironBattleHammer = new CraftingRecipe('ironBattleHammer', 20, 1, CraftingCategory.Weapon, [
    {amount: 3, resource:'ironBar', name: 'Iron Bar'},
    {amount: 3, resource:'birchLog', name: 'Birch Log'},
]);
CraftingRecipeList.steelBattleHammer = new CraftingRecipe('steelBattleHammer', 20, 1, CraftingCategory.Weapon, [
    {amount: 5, resource:'steelBar', name: 'Steel Bar'},
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

CraftingRecipeList.coal = new CraftingRecipe('coal', 1, 3, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'coalLump', name: 'CoalLump'},
]);
CraftingRecipeList.ironBar = new CraftingRecipe('ironBar', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'iron', name: 'Iron'},
    {amount: 1, resource:'coal', name: 'Coal'},
]);
CraftingRecipeList.tinBar = new CraftingRecipe('tinBar', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'tin', name: 'Tin'},
    {amount: 1, resource:'coal', name: 'Coal'},
]);
CraftingRecipeList.copperBar = new CraftingRecipe('copperBar', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'copper', name: 'Copper'},
    {amount: 1, resource:'coalB', name: 'Coal'},
]);
CraftingRecipeList.silverBar = new CraftingRecipe('silverBar', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'silver', name: 'Silver'},
    {amount: 1, resource:'coal', name: 'Coal'},
]);
CraftingRecipeList.goldBar = new CraftingRecipe('goldBar', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'gold', name: 'Gold'},
    {amount: 1, resource:'coal', name: 'Coal'},
]);
CraftingRecipeList.bronzeBar = new CraftingRecipe('bronzeBar', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 1, resource:'copper', name: 'Copper'},
    {amount: 1, resource:'tin', name: 'Tin'},
    {amount: 1, resource:'coal', name: 'Coal'},
]);
CraftingRecipeList.steelBar = new CraftingRecipe('steelBar', 1, 1, CraftingCategory.RefinedResource, [
    {amount: 2, resource:'iron', name: 'Iron'},
    {amount: 1, resource:'tin', name: 'Tin'},
    {amount: 1, resource:'coal', name: 'Coal'},
]);

export { CraftingRecipeList, CraftingCategory };