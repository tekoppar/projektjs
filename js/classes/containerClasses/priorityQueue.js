
/**
 * @template Value
 * @class
 * @constructor
 */
class QueueItem {

	/**
	 * 
	 * @param {Value} value 
	 * @param {number} priority 
	 */
	constructor(value, priority) {
		/** @type {Value} */ this.value = value;
		/** @type {number} */ this.priority = priority;
	}
}

/**
 * @template Value
 * @class
 * @constructor
 */
class PriorityQueue {
	constructor() {
		/** @type {QueueItem<Value, number>[]} */ this.items = [];
	}

	/**
	 * 
	 * @param {Value} v 
	 * @param {number} p 
	 */
	Put(v, p) {
		let qItem = new QueueItem(v, p),
			contain = false;

		for (var i = 0; i < this.items.length; i++) {
			if (this.items[i].priority > qItem.priority) {
				this.items.splice(i, 0, qItem);
				contain = true;
				break;
			}
		}

		if (contain === false) {
			this.items.push(qItem);
		}
	}

	/**
	 * 
	 * @returns {Value}
	 */
	Get() {
		if (this.Empty() === false) {
			let val = this.items.splice(0, 1);
			return val[0].value;
		}

		return undefined;
	}

	/**
	 * 
	 * @returns {QueueItem<Value, number>}
	 */
	Last() {
		if (this.Empty() === false)
			return this.items[this.items.length - 1];

		return undefined;
	}

	Remove() {
		if (this.Empty() === false)
			return this.items.shift();

		return undefined;
	}

	/**
	 * 
	 * @returns {boolean}
	 */
	Empty() {
		return this.items.length == 0;
	}
}

export { PriorityQueue };