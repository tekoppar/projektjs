import { CMath, CharacterSheetUI } from '../../../internal.js';

/**
 * @class
 * @constructor
 */
class CharacterStats {

	/**
	 * 
	 * @param {number} maxHealth 
	 */
	constructor(maxHealth) {
		/** @type {number} */ this.health = maxHealth;
		/** @type {number} */ this.maxHealth = maxHealth;
	}
}

/**
 * @readonly
 * @enum {number}
 */
const AttributeEnum = {
	Strength: 0,
	Constitution: 1,
	Dexterity: 2,
	Agility: 3,
	Intelligence: 4,
	Wisdom: 5,
	Charisma: 6,
	Luck: 7,
}

/**
 * @class
 * @constructor
 */
class CharacterAttributes {

	/**
	 * 
	 * @param {Object} owner
	 * @param {number} strength 
	 * @param {number} constituion 
	 * @param {number} dexterity 
	 * @param {number} agility 
	 * @param {number} intelligence 
	 * @param {number} wisdom 
	 * @param {number} luck 
	 * @param {number} charisma 
	 */
	constructor(owner, strength, constituion, dexterity, agility, intelligence, wisdom, luck, charisma) {
		/** @type {number} */ this.Strength = strength;
		/** @type {number} */ this.Constitution = constituion;
		/** @type {number} */ this.Dexterity = dexterity;
		/** @type {number} */ this.Agility = agility;
		/** @type {number} */ this.Intelligence = intelligence;
		/** @type {number} */ this.Wisdom = wisdom;
		/** @type {number} */ this.Luck = luck;
		/** @type {number} */ this.Charisma = charisma;
		/** @type {CharacterStats} */  this.CharacterStats = new CharacterStats(this.Constitution * 17);
		/** @type {CharacterSheetUI} */ this.characterSheet = new CharacterSheetUI(owner);

		this.CalculateStats();
	}

	/**
	 * 
	 * @param {AttributeEnum} attribute 
	 * @param {number} value 
	 */
	IncreaseAttribute(attribute = AttributeEnum.Strength, value = 1) {
		switch (attribute) {
			case AttributeEnum.Strength: this.Strength += value; break;
			case AttributeEnum.Constitution: this.Constitution += value; break;
			case AttributeEnum.Dexterity: this.Dexterity += value; break;
			case AttributeEnum.Agility: this.Agility += value; break;
			case AttributeEnum.Intelligence: this.Intelligence += value; break;
			case AttributeEnum.Wisdom: this.Wisdom += value; break;
			case AttributeEnum.Luck: this.Luck += value; break;
			case AttributeEnum.Charisma: this.Charisma += value; break;
		}

		this.CalculateStats();
	}

	CalculateStats() {
		let percent = this.CharacterStats.health / this.CharacterStats.maxHealth;
		this.CharacterStats.maxHealth = this.Constitution * 17;
		this.CharacterStats.health = percent * this.CharacterStats.maxHealth;
	}

	/**
	 * 
	 * @param {number} value 
	 */
	UpdateHealth(value) {
		this.CharacterStats.health += Number(value);
	}

	/**
	 * 
	 * @returns {number}
	 */
	GetHealth() {
		return this.CharacterStats.health;
	}

	/**
	 * 
	 * @returns {number}
	 */
	GetDamage() {
		return CMath.RandomFloat(this.Strength * 0.69 + this.Dexterity * 0.34, this.Strength * 1.72 + this.Dexterity * 0.41);
	}
}

export { CharacterStats, AttributeEnum, CharacterAttributes };