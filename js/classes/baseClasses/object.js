import { Vector2D } from '../../internal.js';

/**
 * Creates a new Cobject
 * @class
 * @constructor
 * @public
 */
class Cobject {
	/** @type {Object<string, Cobject>} */ static AllCobjects = {};
	/** @type {string[]} */ static KeysAllCobjects = [];

	/**
	 * Create an Object
	 * @param {Vector2D} position - position vector of the object
	 */
	constructor(position = new Vector2D(0, 0)) {
		/** @type {Vector2D} */ this.position = position;
		/** @type {Vector2D} */ this.fakePosition = new Vector2D(0, 0);
		/** @type {Vector2D} */ this.size = new Vector2D(1, 1);
		/** @type {string} */ this.name = '';
		/** @type {Object} @public */ this.UID;
		/** @type {Cobject} @private */ this.Parent = undefined;
		/** @type {Cobject[]} @private */ this.Children = [];

		Cobject.AddObject(this);
	}

	/**
	 * 
	 * @returns {Vector2D}
	 */
	GetPosition() {
		this.fakePosition.x = this.position.x - this.size.x / 2;
		this.fakePosition.y = this.position.y - this.size.y;
		return this.fakePosition;//new Vector2D(this.position.x - this.size.x / 2, this.position.y - this.size.y);
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 */
	SetPosition(position) {
		this.position.Set(position);

		if (this.Children.length > 0) {
			for (let i = 0, l = this.Children.length; i < l; ++i) {
				this.Children[i].SetPosition(position);
			}
		}

		//this.position.x += this.size.x / 2;
		//this.position.y += this.size.y;
	}

	/**
	 * 
	 * @returns {Cobject}
	 */
	GetParent() {
		return this.Parent;
	}

	/**
	 * 
	 * @param {Cobject} parent 
	 */
	SetParent(parent) {
		this.Parent = parent;
	}

	/**
	 * 
	 * @param {Cobject} child 
	 */
	AddChild(child) {
		child.SetParent(this);
		this.Children.push(child);
	}

	/**
	 * 
	 * @param {(Cobject|string)} value 
	 */
	RemoveChild(value) {
		let index = -1;
		if (value instanceof Cobject)
			index = this.GetChildIndex(value.name);
		else
			index = this.GetChildIndex(value);

		if (index !== -1) {
			this.Children[index].Parent = undefined;
			this.Children.splice(index, 1);
		}
	}

	/**
	 * 
	 * @private
	 * @param {string} name 
	 * @returns {Cobject}
	 */
	FindChild(name) {
		for (let i = 0, l = this.Children.length; i < l; ++i) {
			if (this.Children[i].name === name)
				return this.Children[i];
		}

		return undefined;
	}

	/**
	 * 
	 * @private
	 * @param {string} name 
	 * @returns {number}
	 */
	GetChildIndex(name) {
		for (let i = 0, l = this.Children.length; i < l; ++i) {
			if (this.Children[i].name === name)
				return i;
		}

		return -1;
	}

	/**
	 * 
	 * @param {string} name 
	 * @returns {Cobject}
	 */
	GetChild(name) {
		return this.FindChild(name);
	}

	/**
	 * 
	 * @param {(Cobject|string)} value 
	 * @returns {boolean}
	 */
	HasChild(value) {
		if (value instanceof Cobject)
			return (this.FindChild(value.name) !== undefined ? true : false);
		else
			return (this.FindChild(value) !== undefined ? true : false);
	}

	/**
	 * 
	 * @param {string} uid 
	 * @returns {Object} 
	 */
	static GetObjectFromUID(uid) {
		return Cobject.AllCobjects[uid];
	}

	/**
	 * 
	 * @param {Object} object 
	 * @returns {void}
	 */
	static DeleteObject(object) {
		if (Cobject.AllCobjects[object.UID] === undefined)
			return;

		Cobject.KeysAllCobjects.splice(Cobject.KeysAllCobjects.indexOf(object.UID), 1);
		delete Cobject.AllCobjects[object.UID];
	}

	/**
	 * 
	 * @returns {string}
	 */
	static GenerateUID() {
		let array = new Uint32Array(3);
		window.crypto.getRandomValues(array);
		let uid = '';

		for (let i = 0, l = array.length; i < l; ++i) {
			uid += array[i];
		}

		if (Cobject.AllCobjects[uid] !== undefined) {
			uid = Cobject.GenerateUID();
		}
		return uid;
	}

	/**
	 * 
	 * @param {Object} object 
	 */
	static AddObject(object) {
		object.UID = Cobject.GenerateUID();
		Cobject.AllCobjects[object.UID] = object;
		Cobject.KeysAllCobjects.push(object.UID);
	}

	/**
	 * 
	 */
	FixedUpdate() {
	}

	/**
	 * 
	 */
	EndOfFrameUpdate() {

	}

	/**
	 * 
	 */
	Delete() {
		Cobject.DeleteObject(this);

		if (this.Children.length > 0) {
			for (let i = 0, l = this.Children.length; i < l; ++i) {
				this.Children[i].Delete();
			}
		}

		this.Parent = undefined;
		this.Children = undefined;
	}

	//@ts-ignore
	CEvent(eventType, data) {

	}

	/**
	 * 
	 * @param {Vector2D} checkPos 
	 * @param {number} range 
	 * @returns {boolean}
	 */
	CheckInRange(checkPos, range = 100.0) {
		return this.position.Distance(checkPos) < range;
	}

	/**
	 * 
	 */
	GameBegin() { }
}

export { Cobject };