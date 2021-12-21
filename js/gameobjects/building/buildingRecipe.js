import { BuildingCategory, Recipe, ResourceItem } from '../../internal.js';

/**
 * @class
 * @constructor
 * @extends Recipe
 */
class BuildingRecipe extends Recipe {

	/**
	 * 
	 * @param {string} name 
	 * @param {number} time 
	 * @param {number} amount 
	 * @param {BuildingCategory} buildingCategory 
	 * @param {Array<{amount: number, item: ResourceItem}>} resourceList 
	 */
	constructor(name, time, amount, buildingCategory, resourceList) {
		super(name, time, amount, resourceList);
		/** @type {BuildingCategory} */ this.category = buildingCategory;
	}

	/**
	 * 
	 * @returns {number}
	 */
	GetTotalResourceCost() {
		let total = 0;

		for (let i = 0, l = this.resourceList.length; i < l; ++i) {
			total += this.resourceList[i].amount;
		}

		return total;
	}

	/**
	 * 
	 * @returns {BuildingRecipe}
	 */
	Clone() {
		return new BuildingRecipe(this.name, this.time, this.amount, this.category, JSON.parse(JSON.stringify(this.resourceList)));
	}
}

export { BuildingRecipe };