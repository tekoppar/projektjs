import { BuildingRecipe } from '../../internal.js';

/**
 * @type {Object.<string, BuildingRecipe>}
 */
let BuildingRecipeList = {};

/**
 * @enum {Number}
 * @readonly
 */
const BuildingCategory = {
    Crafting: 0,
    Resource: 1,
    Props: 2,
    Storage:3,
}

BuildingRecipeList.woodenChest = new BuildingRecipe('Wooden Chest', 5, 1, BuildingCategory.Storage, [
    {amount: 10, resource:'flitch', name: 'Flitch'},
]);
BuildingRecipeList.stoneSmelter = new BuildingRecipe('Stone Smelter', 40, 1, BuildingCategory.Crafting, [
    {amount: 25, resource:'stonePiece', name: 'Stone Piece'},
]);
BuildingRecipeList.anvil = new BuildingRecipe('Anvil', 30, 1, BuildingCategory.Crafting, [
    {amount: 15, resource:'ironBar', name: 'Iron Bar'},
]);
BuildingRecipeList.workbench = new BuildingRecipe('Workbench', 15, 1, BuildingCategory.Crafting, [
    {amount: 20, resource:'flitch', name: 'Flitch'},
    {amount: 10, resource:'stonePiece', name: 'Stone Piece'},
]);
BuildingRecipeList.choppingBlock = new BuildingRecipe('Chopping Block', 5, 1, BuildingCategory.Crafting, [
    {amount: 10, resource:'birchLog', name: 'Birch Log'},
]);

export { BuildingRecipeList, BuildingCategory };