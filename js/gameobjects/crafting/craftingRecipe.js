import { Recipe, ResourceItem } from '../../internal.js'

/**
 * @readonly
 * @enum {number}
 */
const CraftingCategory = {
	Tool: 0,
	Weapon: 1,
	RefinedResource: 2,
}

/**
 * @class
 * @constructor
 * @extends Recipe
 */
class CraftingRecipe extends Recipe {

	/**
	 * 
	 * @param {string} name 
	 * @param {number} time 
	 * @param {number} amount 
	 * @param {CraftingCategory} craftingCategory 
	 * @param {Array<{amount: number, item: ResourceItem}>} resourceList 
	 */
	constructor(name, time, amount, craftingCategory, resourceList) {
		super(name, time, amount, resourceList);

		/** @type {CraftingCategory} */ this.category = craftingCategory;
	}
}

export { CraftingRecipe, CraftingCategory };