/**
 * @class
 * @constructor
 */
class Mastertime {
	/** @type {Mastertime} */ static _Instance = new Mastertime();
	/** @readonly @type {number} */ static HalfADay = (24 * 60 * 60) * 0.5;
	/** @readonly @type {number} */ static ADay = (24 * 60 * 60);

	constructor() {
		/** @type {number} @private */ this.DeltaTime = Date.now();
		/** @type {number} @private */ this.PreviousTime = 0;
		/** @type {number} @private */ this.GlobalFrameCounter = 0;
		/** @type {Date} @private */ this.TimeOfDay = new Date('1995-12-17T24:00:00');
	}

	Next() {
		this.DeltaTime = Date.now() - this.PreviousTime;
		this.PreviousTime = Date.now();
		this.GlobalFrameCounter++;
		this.UpdateTime();
	}

	static Next() {
		Mastertime._Instance.Next();
	}

	UpdateTime() {
		if (this.DeltaTime < 10000)
			this.TimeOfDay = new Date(this.TimeOfDay.valueOf() + (this.DeltaTime * 1));
	}

	/**
	 * 
	 * @returns {number}
	 */
	GetSeconds() {
		let seconds = this.TimeOfDay.getHours() * 60;
		seconds = (this.TimeOfDay.getMinutes() + seconds) * 60;
		seconds = this.TimeOfDay.getSeconds() + seconds;
		return seconds;
	}

	/**
	 * Returns the current time of day in seconds
	 * @returns {number}
	 */
	static GetSeconds() {
		return Mastertime._Instance.GetSeconds();
	}

	/**
	 * Returns the current delta value
	 * @returns {number}
	 */
	Delta() {
		return this.DeltaTime / 1000;
	}

	/**
	 * Returns the current delta value
	 * @returns {number}
	 */
	static Delta() {
		return Mastertime._Instance.DeltaTime / 1000;
	}

	/**
	 * Returns the current frame count
	 * @returns {number}
	 */
	FC() {
		return this.GlobalFrameCounter;
	}

	/**
	 * Returns the current frame count
	 * @returns {number}
	 */
	static Frame() {
		return Mastertime._Instance.GlobalFrameCounter;
	}
}

export { Mastertime };