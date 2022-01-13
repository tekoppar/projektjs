import { Rectangle, Vector2D } from '../../internal.js';

/** 
 * @typedef {Object} TreeGeneric
 * @property {Vector2D} position
 */

/**
 * @template {TreeGeneric} treeObjects
 * @class
 * @constructor
 */
class TQuadTree {
	/**
	 * Creates a new TQuadTree
	 * @param {number} level 
	 * @param {Rectangle} bounds 
	 * @param {TQuadTree} topParent
	 * @param {number} maxObjects
	 * @param {number} maxLevel
	 */
	constructor(level, bounds, topParent = undefined, maxObjects = -1, maxLevel = -1) {
		/** @type {number} */ this.level = level;
		/** @type {treeObjects[]} */ this.objects = [];
		/** @type {Rectangle} */ this.bounds = bounds;
		/** @type {TQuadTree[]} */ this.nodes = [];
		/**
		 * If undefined is top parent of the quad tree
		 *  @type {TQuadTree}
		 */ this.topParent = topParent;
		/** @type {number} */ this.MAX_OBJECTS = maxObjects;
		/** @type {number} */ this.MAX_LEVEL = maxLevel;
	}

	Clear() {
		this.objects = null;
		this.level = null;
		this.bounds = null;

		for (let i = 0; i < this.nodes.length; ++i) {
			this.nodes[i].Clear();
		}
		this.nodes = null;
	}

	Split() {
		let boundsW = this.bounds.w * 0.5,
			boundsH = this.bounds.h * 0.5;

		this.nodes = [
			new TQuadTree(this.level + 1, new Rectangle(this.bounds.x, this.bounds.y, boundsW, boundsH), this.topParent),
			new TQuadTree(this.level + 1, new Rectangle(this.bounds.x + boundsW, this.bounds.y, boundsW, boundsH), this.topParent),
			new TQuadTree(this.level + 1, new Rectangle(this.bounds.x, this.bounds.y + boundsH, boundsW, boundsH), this.topParent),
			new TQuadTree(this.level + 1, new Rectangle(this.bounds.x + boundsW, this.bounds.y + boundsH, boundsW, boundsH), this.topParent)
		];

		/** @type {treeObjects[]} */ let outsideObjects = [];
		for (let i = 0, l = this.objects.length; i < l; ++i) {
			if (this.objects[i].position !== null) {
				if (this.bounds.OutsideXY(this.objects[i].position.x, this.objects[i].position.y)) {
					outsideObjects.push(this.objects[i]);
				} else {
					if (this.nodes[0].bounds.InsideXY(this.objects[i].position.x, this.objects[i].position.y))
						this.nodes[0].Add(this.objects[i]);
					if (this.nodes[1].bounds.InsideXY(this.objects[i].position.x, this.objects[i].position.y))
						this.nodes[1].Add(this.objects[i]);
					if (this.nodes[2].bounds.InsideXY(this.objects[i].position.x, this.objects[i].position.y))
						this.nodes[2].Add(this.objects[i]);
					if (this.nodes[3].bounds.InsideXY(this.objects[i].position.x, this.objects[i].position.y))
						this.nodes[3].Add(this.objects[i]);
				}
			}
		}

		for (let i = 0, l = outsideObjects.length; i < l; ++i) {
			this.topParent.Remove(outsideObjects[i]);
		}
		for (let i = 0, l = outsideObjects.length; i < l; ++i) {
			this.topParent.Add(outsideObjects[i]);
		}

		this.objects = [];
	}

	/**
	 * 
	 * @param {Rectangle} bounds 
	 * @returns {number[]}
	 */
	GetIndex(bounds) {
		/** @type {number[]} */ let index = [];
		if (this.nodes[0].bounds.Overlaps(bounds))
			index.push(0);
		if (this.nodes[1].bounds.Overlaps(bounds))
			index.push(1);
		if (this.nodes[2].bounds.Overlaps(bounds))
			index.push(2);
		if (this.nodes[3].bounds.Overlaps(bounds))
			index.push(3);

		return index;
	}

	/**
	 * 
	 * @param {treeObjects} object 
	 * @returns {void}
	 */
	Add(object) {
		if (object.position === null)
			return;

		if (this.nodes.length === 0) {
			this.objects.push(object);

			if (this.objects.length >= this.topParent.MAX_OBJECTS && this.level <= this.topParent.MAX_LEVEL) {
				this.Split();
			}
		} else {
			if (this.nodes[0].bounds.InsideXY(object.position.x, object.position.y))
				this.nodes[0].Add(object);
			if (this.nodes[1].bounds.InsideXY(object.position.x, object.position.y))
				this.nodes[1].Add(object);
			if (this.nodes[2].bounds.InsideXY(object.position.x, object.position.y))
				this.nodes[2].Add(object);
			if (this.nodes[3].bounds.InsideXY(object.position.x, object.position.y))
				this.nodes[3].Add(object);
		}
	}

	/**
	 * 
	 * @param {treeObjects} object 
	 * @returns {void}
	 */
	Remove(object) {
		if (this.nodes.length === 0) {
			for (let i = 0, l = this.objects.length; i < l; ++i) {
				if (this.objects[i] === object) {
					this.objects.splice(i, 1);
					return;
				}
			}
		} else {
			if (this.nodes[0].bounds.InsideXY(object.position.x, object.position.y))
				this.nodes[0].Remove(object);
			if (this.nodes[1].bounds.InsideXY(object.position.x, object.position.y))
				this.nodes[1].Remove(object);
			if (this.nodes[2].bounds.InsideXY(object.position.x, object.position.y))
				this.nodes[2].Remove(object);
			if (this.nodes[3].bounds.InsideXY(object.position.x, object.position.y))
				this.nodes[3].Remove(object);
		}
	}

	/**
	 * 
	 * @param {Rectangle} bounds 
	 * @returns {treeObjects[]}
	 */
	Get(bounds) {
		if (this.nodes.length > 0) {
			//let index = this.GetIndex(bounds);

			let objects = [],
				temp = [];
			/*for (let i = 0, l = index.length; i < l; ++i) {
				temp = this.nodes[index[i]].Get(bounds);
				for (let i2 = 0, l2 = temp.length; i2 < l2; ++i2) {
					objects.push(temp[i2]);
				}
			}*/
			let i = 0, l = 0;
			if (this.nodes[0].bounds.Overlaps(bounds)) {
				temp = this.nodes[0].Get(bounds);
				for (i = 0, l = temp.length; i < l; ++i) {
					objects.push(temp[i]);
				}
			}
			if (this.nodes[1].bounds.Overlaps(bounds)) {
				temp = this.nodes[1].Get(bounds);
				for (i = 0, l = temp.length; i < l; ++i) {
					objects.push(temp[i]);
				}
			}
			if (this.nodes[2].bounds.Overlaps(bounds)) {
				temp = this.nodes[2].Get(bounds);
				for (i = 0, l = temp.length; i < l; ++i) {
					objects.push(temp[i]);
				}
			}
			if (this.nodes[3].bounds.Overlaps(bounds)) {
				temp = this.nodes[3].Get(bounds);
				for (i = 0, l = temp.length; i < l; ++i) {
					objects.push(temp[i]);
				}
			}
			return objects;
		} else {
			for (let i = 0, l = this.objects.length; i < l; ++i) {
				if (this.objects[i].position === null) {
					this.objects.splice(i, 1);
					--i;
					--l;
				}
			}

			return this.objects;
		}
	}

	/**
	 * 
	 * @param {Rectangle} bounds 
	 * @param {treeObjects[]} objects
	 */
	GetNew(bounds, objects) {
		if (this.nodes.length > 0) {
			if (this.nodes[0].bounds.IsRectOverlappingOrInside(bounds)) {
				this.nodes[0].GetNew(bounds, objects);
			}
			if (this.nodes[1].bounds.IsRectOverlappingOrInside(bounds)) {
				this.nodes[1].GetNew(bounds, objects);
			}
			if (this.nodes[2].bounds.IsRectOverlappingOrInside(bounds)) {
				this.nodes[2].GetNew(bounds, objects);
			}
			if (this.nodes[3].bounds.IsRectOverlappingOrInside(bounds)) {
				this.nodes[3].GetNew(bounds, objects);
			}
		} else {
			for (let i = 0, l = this.objects.length; i < l; ++i) {
				if (this.objects[i].position === null) {
					this.objects.splice(i, 1);
					--i;
					--l;
				}
			}

			for (let i = 0, l = this.objects.length; i < l; ++i) {
				objects.push(this.objects[i]);
			}
		}
	}

	/**
	 * 
	 * @param {treeObjects[]} objects 
	 */
	GetAll(objects) {
		if (this.nodes.length > 0) {
			this.nodes[0].GetAll(objects);
			this.nodes[1].GetAll(objects);
			this.nodes[2].GetAll(objects);
			this.nodes[3].GetAll(objects);
		} else {
			for (let i = 0, l = this.objects.length; i < l; ++i) {
				objects.push(this.objects[i]);
			}
		}
	}
}

export { TQuadTree };