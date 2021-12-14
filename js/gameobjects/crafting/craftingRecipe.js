import { CraftingCategory } from '../../internal.js';

/**
 * @class
 * @constructor
 */
class CraftingRecipe {

    /**
     * 
     * @param {string} name 
     * @param {Number} time 
     * @param {Number} amount 
     * @param {CraftingCategory} craftingCategory 
     * @param {Array<{amount: Number, resource:string, name:string}>} resourceList 
     */
    constructor(name, time, amount, craftingCategory, resourceList) {
        this.name = name[0].toLowerCase() + name.substring(1, name.length).replace(/\s/i, '');
        this.displayName = name;
        this.time = time;
        this.amount = amount
        this.category = craftingCategory;
        this.resourceList = resourceList;
    }
}

export { CraftingRecipe };