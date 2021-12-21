import { Cobject } from '../internal.js';

/**
 * @class
 * @constructor
 */
class CustomEventData {
	constructor(eventName, otherObject) {
		this.eventName = eventName;
		this.otherObject = otherObject;
	}
}

/**
 * @class
 * @constructor
 */
class CustomEventHandler {
	/** @type {CustomEventHandler} */ static GCEH = new CustomEventHandler();

	constructor() {
		/** @type {Cobject[]} */ this.registeredListeners = [];
		/** @type {CustomEventData[]} */ this.customEvents = [];
	}

	FixedUpdate() {
		if (this.customEvents.length > 0) {
			for (let y = 0, lY = this.customEvents.length; y < lY; ++y) {
				for (let i = 0, lX = this.registeredListeners.length; i < lX; ++i) {
					this.registeredListeners[i].CEvent(this.customEvents[y].eventName, this.customEvents[y].otherObject);
				}
			}

			this.customEvents = [];
		}
	}

	/**
	 * 
	 * @param {Cobject} object 
	 */
	static AddListener(object) {
		CustomEventHandler.GCEH.registeredListeners.push(object);
	}

	/**
	 * 
	 * @param {string} eventName 
	 * @param {Cobject} caller 
	 */
	static NewCustomEvent(eventName, caller) {
		CustomEventHandler.GCEH.customEvents.push(new CustomEventData(eventName, caller));
	}
}

export { CustomEventData, CustomEventHandler };