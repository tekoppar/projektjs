import { CanvasDrawer, MasterObject, Vector2D, Cobject } from '../internal.js';

/**
 * Enum for input state
 * @readonly
 * @enum {number}
 */
const InputState = {
	OnPressed: 0,
	Pressed: 1,
	OnReleased: 2,
	Released: 3,
	Null: 4,
}

/**
 * Enum for input type
 * @readonly
 * @enum {number}
 */
const InputType = {
	keyboard: 0,
	mouse: 1,
}

/**
 * @readonly
 * @enum {string}
 */
const KeyEnum = {
	zero: 'zero',
	one: 'one',
	two: 'two',
	three: 'three',
	four: 'four',
	five: 'five',
	six: 'six',
	seven: 'seven',
	eigth: 'eigth',
	nine: 'nine',
	a: 'a',
	d: 'd',
	w: 'w',
	s: 's',
	e: 'e',
	i: 'i',
	q: 'q',
	c: 'c',
	p: 'p',
	g: 'g',
	b: 'b',
	k: 'k',
	tab: 'tab',
	escape: 'escape',
	backspace: 'backspace',
	leftMouse: 'leftMouse',
	middleMouse: 'middleMouse',
	rightMouse: 'rightMouse',
	shiftLeft: 'shiftLeft',
	shiftRight: 'shiftRight',
	ctrlLeft: 'ctrlLeft',
	altLeft: 'altLeft',
	arrowUp: 'arrowUp',
	arrowLeft: 'arrowLeft',
	arrowDown: 'arrowDown',
	arrowRight: 'arrowRight',
}

/**
 * @readonly
 * @enum {number}
 */
const InputEnum = {
	zero: 48,
	one: 49,
	two: 50,
	three: 51,
	four: 52,
	five: 53,
	six: 54,
	seven: 55,
	eigth: 56,
	nine: 57,
	a: 65,
	d: 68,
	w: 87,
	s: 83,
	e: 69,
	i: 73,
	q: 81,
	c: 67,
	p: 80,
	g: 71,
	b: 66,
	k: 75,
	tab: 9,
	escape: 27,
	backspace: 8,
	shift: 16,
	ctrl: 17,
	alt: 18,
	arrowUp: 38,
	arrowLeft: 37,
	arrowDown: 40,
	arrowRight: 39,
};

let ReverseInputEnum = {};
let InputEnumKeys = Object.keys(InputEnum);

for (let i = 0, l = InputEnumKeys.length; i < l; ++i) {
	ReverseInputEnum[InputEnum[InputEnumKeys[i]]] = InputEnumKeys[i];
}

/**
 * @readonly
 * @enum {number}
 */
const InputSideEnum = {
	None: 0,
	Left: 1,
	Right: 2,
}

/**
 * @readonly
 * @enum {string}
 */
const ReverseInputSideEnum = {
	0: 'None',
	1: 'Left',
	2: 'Right',
}

/**
 * @readonly
 * @enum {number}
 */
const MouseEnum = {
	leftMouse: 0,
	middleMouse: 1,
	rightMouse: 2,
};

/**
 * @readonly
 * @enum {string}
 */
const ReverseMouseEnum = {
	0: 'leftMouse',
	1: 'middleMouse',
	2: 'rightMouse',
};

/**
 * @class
 * @constructor
 */
class Input {

	/**
	 * Creates a new Input
	 * @param {(InputEnum|MouseEnum)} key 
	 * @param {InputType} inputType 
	 * @param {InputSideEnum} side
	 */
	constructor(key, inputType = InputType.keyboard, side = InputSideEnum.None) {
		/** @type {(InputEnum|MouseEnum)} */ this.key = key;
		/** @type {InputState} */ this.state = InputState.Null;
		/** @type {Vector2D} */ this.position = new Vector2D(0, 0);
		/** @type {InputType} */ this.inputType = inputType;
		/** @type {InputSideEnum} */ this.side = side;
	}

	/**
	 * Updates the state of the input
	 * @param {InputState} s 
	 * @param {Vector2D} p 
	 * @returns {boolean}
	 */
	State(s, p) {
		switch (s) {
			case InputState.OnPressed:
				if (this.state !== InputState.Pressed) {
					this.state = s;
					this.position = p;
					return true;
				} else if (s === InputState.OnPressed && this.state === InputState.Pressed) {
					this.state = InputState.Pressed;
					this.position = p;
					return true;
				}
				return false;

			case InputState.Pressed:
				this.state = s;
				this.position = p;
				return true;

			case InputState.OnReleased:
				if (this.state !== InputState.Released) {
					this.state = s;
					this.position = p;
					return true;
				} else if (s === InputState.OnReleased && this.state === InputState.Released) {
					this.state = InputState.Released;
					this.position = p;
					return true;
				}
				return false;

			case InputState.Released:
				this.state = s;
				this.position = p;
				return true;

			case InputState.Null:
				this.state = InputState.Null;
				this.position = p;
				return true;
		}

		return false;
	}
}

/**
 * @class
 * @constructor
 */
class InputHandler {
	/** @type {InputHandler} */ static GIH = new InputHandler();

	constructor() {
		/** @type {HTMLCanvasElement} */ this.gameCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById('game-canvas'));
		/** @type {Object.<string, Input>} */ this.inputs = {
			'zero': new Input(InputEnum.zero),
			'one': new Input(InputEnum.one),
			'two': new Input(InputEnum.two),
			'three': new Input(InputEnum.three),
			'four': new Input(InputEnum.four),
			'five': new Input(InputEnum.five),
			'six': new Input(InputEnum.six),
			'seven': new Input(InputEnum.seven),
			'eigth': new Input(InputEnum.eigth),
			'nine': new Input(InputEnum.nine),
			'a': new Input(InputEnum.a),
			'd': new Input(InputEnum.d),
			'w': new Input(InputEnum.w),
			's': new Input(InputEnum.s),
			'e': new Input(InputEnum.e),
			'i': new Input(InputEnum.i),
			'q': new Input(InputEnum.q),
			'c': new Input(InputEnum.c),
			'p': new Input(InputEnum.p),
			'g': new Input(InputEnum.g),
			'b': new Input(InputEnum.b),
			'k': new Input(InputEnum.k),
			'tab': new Input(InputEnum.tab),
			'escape': new Input(InputEnum.escape),
			'backspace': new Input(InputEnum.backspace),
			'leftMouse': new Input(MouseEnum.leftMouse, InputType.mouse),
			'middleMouse': new Input(MouseEnum.middleMouse, InputType.mouse),
			'rightMouse': new Input(MouseEnum.rightMouse, InputType.mouse),
			'shiftLeft': new Input(InputEnum.shift, InputType.keyboard, InputSideEnum.Left),
			'shiftRight': new Input(InputEnum.shift, InputType.keyboard, InputSideEnum.Right),
			'ctrlLeft': new Input(InputEnum.ctrl, InputType.keyboard, InputSideEnum.Left),
			'altLeft': new Input(InputEnum.alt, InputType.keyboard, InputSideEnum.Left),
			'arrowUp': new Input(InputEnum.arrowUp),
			'arrowLeft': new Input(InputEnum.arrowLeft),
			'arrowDown': new Input(InputEnum.arrowDown),
			'arrowRight': new Input(InputEnum.arrowRight),
		};

		this.registeredListeners = {};
		/** @type {Object.<string, Array<{state:InputState, position:Vector2D}>>} */ this.inputQueue = {};

		this.FillInputQueue();
		this.AttachInputListener();
	}

	/**
	 * 
	 * @param {(InputEnum|MouseEnum)} input 
	 * @param {InputSideEnum} side 
	 * @returns 
	 */
	GetInputKey(input, side) {
		if (ReverseInputEnum[input] !== undefined)
			return ReverseInputEnum[input] + (side === InputSideEnum.None ? '' : ReverseInputSideEnum[side]);
		else if (ReverseMouseEnum[input] !== undefined)
			return ReverseMouseEnum[input];
	}

	FillInputQueue() {
		let keys = Object.keys(this.inputs);

		for (let i = 0, l = keys.length; i < l; ++i) {
			let inputKey = this.GetInputKey(this.inputs[keys[i]].key, this.inputs[keys[i]].side);
			this.inputQueue[inputKey] = [];
			this.registeredListeners[inputKey] = [];
		}
	}

	AttachInputListener() {
		document.addEventListener('keydown', this);
		document.addEventListener('keyup', this);
		this.gameCanvas.addEventListener('mousedown', this);
		this.gameCanvas.addEventListener('mouseup', this);
	}

	/**
	 * 
	 * @param {Object} object 
	 * @param {Function} object.CEvent
	 */
	OldAddListener(object) {
		this.registeredListeners.push(object);
	}

	/**
	 * 
	 * @param {Object} object 
	 * @param {Function} object.CEvent
	 * @param {(InputEnum|MouseEnum)} input
	 * @param {InputSideEnum} side 
	 */
	AddListener(object, input, side = InputSideEnum.None) {
		let inputKey = this.GetInputKey(input, side);

		if (this.registeredListeners[inputKey] !== undefined)
			this.registeredListeners[inputKey].push(object);
	}

	/**
	 * 
	 * @param {Object} object 
	 * @param {Function} object.CEvent
	 * @return {boolean}
	 */
	OldRemoveListener(object) {
		for (let i = 0, l = this.registeredListeners.length; i < l; ++i) {
			if (this.registeredListeners[i] === object) {
				this.registeredListeners.splice(i, 1);
				return true;
			}
		}

		return false;
	}

	/**
	 * 
	 * @param {Object} object 
	 * @param {Function} object.CEvent
	 * @param {(InputEnum|MouseEnum)} input
	 * @param {InputSideEnum} side
	 * @return {boolean}
	 */
	RemoveListener(object, input, side = InputSideEnum.None) {
		let inputKey = this.GetInputKey(input, side);

		if (this.registeredListeners[inputKey] !== undefined) {
			for (let i = 0, l = this.registeredListeners[inputKey].length; i < l; ++i) {
				if (this.registeredListeners[inputKey][i] === object) {
					this.registeredListeners[inputKey].splice(i, 1);
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * 
	 * @param {Object} object 
	 * @param {Function} object.CEvent
	 */
	RemoveListenerFromAll(object) {
		let keys = Object.keys(this.registeredListeners);

		for (let i = 0, l = keys.length; i < l; ++i) {
			for (let i2 = 0, l2 = this.registeredListeners[keys[i]].length; i2 < l2; ++i2) {
				if (this.registeredListeners[keys[i]][i2] === object) {
					this.registeredListeners[keys[i]].splice(i2, 1);
					i2--;
					l2--;
				}
			}
		}
	}

	/**
	 * 
	 * @param {(InputEnum|MouseEnum)} key 
	 * @param {InputSideEnum} side
	 * @param {InputState} state 
	 * @param {Vector2D} position 
	 */
	AddInput(key, side, state, position = undefined) {
		let inputKey = this.GetInputKey(key, side);

		this.inputQueue[inputKey].push({ state: state, position: position });
	}

	/**
	 * 
	 * @param {(InputEnum|MouseEnum)} key 
	 * @param {InputSideEnum} side
	 * @param {InputState} state 
	 * @param {Vector2D} position 
	 * @returns {boolean}
	 */
	ChangeState(key, side, state, position = undefined) {
		let inputKey = this.GetInputKey(key, side);

		return this.inputs[inputKey].State(state, position);
	}

	handleEvent(e) {
		switch (e.type) {
			case 'keydown':
				switch (e.keyCode) {
					case 8: this.AddInput(InputEnum.backspace, InputSideEnum.None, InputState.OnPressed); e.preventDefault(); break;
					case 9: this.AddInput(InputEnum.tab, InputSideEnum.None, InputState.OnPressed); e.preventDefault(); break;
					case 16:
						if (e.location === 1) {
							this.AddInput(InputEnum.shift, InputSideEnum.Left, InputState.OnPressed);
						} else {
							this.AddInput(InputEnum.shift, InputSideEnum.Right, InputState.OnPressed);
						}
						e.preventDefault();
						break;
					case 17: this.AddInput(InputEnum.ctrl, InputSideEnum.Left, InputState.OnPressed); e.preventDefault(); break;
					case 18: this.AddInput(InputEnum.alt, InputSideEnum.Left, InputState.OnPressed); e.preventDefault(); break;
					case 27: this.AddInput(InputEnum.escape, InputSideEnum.None, InputState.OnPressed); e.preventDefault(); break;
					case 37: this.AddInput(InputEnum.arrowLeft, InputSideEnum.None, InputState.OnPressed); break;
					case 38: this.AddInput(InputEnum.arrowUp, InputSideEnum.None, InputState.OnPressed); break;
					case 39: this.AddInput(InputEnum.arrowRight, InputSideEnum.None, InputState.OnPressed); break;
					case 40: this.AddInput(InputEnum.arrowDown, InputSideEnum.None, InputState.OnPressed); break;
					case 48: this.AddInput(InputEnum.zero, InputSideEnum.None, InputState.OnPressed); break;
					case 49: this.AddInput(InputEnum.one, InputSideEnum.None, InputState.OnPressed); break;
					case 50: this.AddInput(InputEnum.two, InputSideEnum.None, InputState.OnPressed); break;
					case 51: this.AddInput(InputEnum.three, InputSideEnum.None, InputState.OnPressed); break;
					case 52: this.AddInput(InputEnum.four, InputSideEnum.None, InputState.OnPressed); break;
					case 53: this.AddInput(InputEnum.five, InputSideEnum.None, InputState.OnPressed); break;
					case 54: this.AddInput(InputEnum.six, InputSideEnum.None, InputState.OnPressed); break;
					case 55: this.AddInput(InputEnum.seven, InputSideEnum.None, InputState.OnPressed); break;
					case 56: this.AddInput(InputEnum.eigth, InputSideEnum.None, InputState.OnPressed); break;
					case 57: this.AddInput(InputEnum.nine, InputSideEnum.None, InputState.OnPressed); break;
					case 65: this.AddInput(InputEnum.a, InputSideEnum.None, InputState.OnPressed); break;
					case 66: this.AddInput(InputEnum.b, InputSideEnum.None, InputState.OnPressed); break;
					case 67: this.AddInput(InputEnum.c, InputSideEnum.None, InputState.OnPressed); break;
					case 68: this.AddInput(InputEnum.d, InputSideEnum.None, InputState.OnPressed); break;
					case 69: this.AddInput(InputEnum.e, InputSideEnum.None, InputState.OnPressed); break;
					case 71: this.AddInput(InputEnum.g, InputSideEnum.None, InputState.OnPressed); break;
					case 73: this.AddInput(InputEnum.i, InputSideEnum.None, InputState.OnPressed); break;
					case 75: this.AddInput(InputEnum.k, InputSideEnum.None, InputState.OnPressed); break;
					case 80: this.AddInput(InputEnum.p, InputSideEnum.None, InputState.OnPressed); break;
					case 81: this.AddInput(InputEnum.q, InputSideEnum.None, InputState.OnPressed); break;
					case 83: this.AddInput(InputEnum.s, InputSideEnum.None, InputState.OnPressed); break;
					case 87: this.AddInput(InputEnum.w, InputSideEnum.None, InputState.OnPressed); break;
				}
				break;
			case 'keyup':
				switch (e.keyCode) {
					case 8: this.AddInput(InputEnum.backspace, InputSideEnum.None, InputState.OnReleased); break;
					case 9: this.AddInput(InputEnum.tab, InputSideEnum.None, InputState.OnReleased); break;
					case 16:
						if (e.location === 1) {
							this.AddInput(InputEnum.shift, InputSideEnum.Left, InputState.OnReleased);
						} else {
							this.AddInput(InputEnum.shift, InputSideEnum.Right, InputState.OnReleased);
						}
						e.preventDefault();
						break;
					case 17: this.AddInput(InputEnum.ctrl, InputSideEnum.Left, InputState.OnReleased); e.preventDefault(); break;
					case 18: this.AddInput(InputEnum.alt, InputSideEnum.Left, InputState.OnReleased); e.preventDefault(); break;
					case 27: this.AddInput(InputEnum.escape, InputSideEnum.None, InputState.OnReleased); break;
					case 37: this.AddInput(InputEnum.arrowLeft, InputSideEnum.None, InputState.OnReleased); break;
					case 38: this.AddInput(InputEnum.arrowUp, InputSideEnum.None, InputState.OnReleased); break;
					case 39: this.AddInput(InputEnum.arrowRight, InputSideEnum.None, InputState.OnReleased); break;
					case 40: this.AddInput(InputEnum.arrowDown, InputSideEnum.None, InputState.OnReleased); break;
					case 48: this.AddInput(InputEnum.zero, InputSideEnum.None, InputState.OnReleased); break;
					case 49: this.AddInput(InputEnum.one, InputSideEnum.None, InputState.OnReleased); break;
					case 50: this.AddInput(InputEnum.two, InputSideEnum.None, InputState.OnReleased); break;
					case 51: this.AddInput(InputEnum.three, InputSideEnum.None, InputState.OnReleased); break;
					case 52: this.AddInput(InputEnum.four, InputSideEnum.None, InputState.OnReleased); break;
					case 53: this.AddInput(InputEnum.five, InputSideEnum.None, InputState.OnReleased); break;
					case 54: this.AddInput(InputEnum.six, InputSideEnum.None, InputState.OnReleased); break;
					case 55: this.AddInput(InputEnum.seven, InputSideEnum.None, InputState.OnReleased); break;
					case 56: this.AddInput(InputEnum.eigth, InputSideEnum.None, InputState.OnReleased); break;
					case 57: this.AddInput(InputEnum.nine, InputSideEnum.None, InputState.OnReleased); break;
					case 65: this.AddInput(InputEnum.a, InputSideEnum.None, InputState.OnReleased); break;
					case 66: this.AddInput(InputEnum.b, InputSideEnum.None, InputState.OnReleased); break;
					case 68: this.AddInput(InputEnum.d, InputSideEnum.None, InputState.OnReleased); break;
					case 67: this.AddInput(InputEnum.c, InputSideEnum.None, InputState.OnReleased); break;
					case 69: this.AddInput(InputEnum.e, InputSideEnum.None, InputState.OnReleased); break;
					case 71: this.AddInput(InputEnum.g, InputSideEnum.None, InputState.OnReleased); MasterObject.MO.NextFrame(); break;
					case 73: this.AddInput(InputEnum.i, InputSideEnum.None, InputState.OnReleased); break;
					case 75: this.AddInput(InputEnum.k, InputSideEnum.None, InputState.OnReleased); break;
					case 80: this.AddInput(InputEnum.p, InputSideEnum.None, InputState.OnReleased); MasterObject.MO.ToggleFrameStepping(); break;
					case 81: this.AddInput(InputEnum.q, InputSideEnum.None, InputState.OnReleased); break;
					case 83: this.AddInput(InputEnum.s, InputSideEnum.None, InputState.OnReleased); break;
					case 87: this.AddInput(InputEnum.w, InputSideEnum.None, InputState.OnReleased); break;
				}
				break;
			case 'mousedown':
				switch (e.button) {
					case 0: this.AddInput(MouseEnum.leftMouse, InputSideEnum.None, InputState.OnPressed, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
					case 1: this.AddInput(MouseEnum.middleMouse, InputSideEnum.None, InputState.OnPressed, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
					case 2: this.AddInput(MouseEnum.rightMouse, InputSideEnum.None, InputState.OnPressed, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
				}
				break;
			case 'mouseup':
				switch (e.button) {
					case 0: this.AddInput(MouseEnum.leftMouse, InputSideEnum.None, InputState.OnReleased, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
					case 1: this.AddInput(MouseEnum.middleMouse, InputSideEnum.None, InputState.OnReleased, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
					case 2: this.AddInput(MouseEnum.rightMouse, InputSideEnum.None, InputState.OnReleased, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
				}
				break;
		}
	}

	FixedUpdate() {
		let keys = Object.keys(this.inputs);

		for (let i = 0, l = keys.length; i < l; ++i) {
			let inputKey = this.GetInputKey(this.inputs[keys[i]].key, this.inputs[keys[i]].side);
			if (this.inputQueue[inputKey].length > 0 && this.ChangeState(this.inputs[keys[i]].key, this.inputs[keys[i]].side, this.inputQueue[keys[i]][0].state, this.inputQueue[keys[i]][0].position)) {
				this.inputQueue[inputKey].splice(0, 1);
				continue;
			}
		}

		for (let x = 0, xl = keys.length; x < xl; ++x) {
			if (this.inputs[keys[x]].state !== InputState.Null) {
				const inputKeyValue = this.GetInputKey(this.inputs[keys[x]].key, this.inputs[keys[x]].side);
				for (let i2 = 0, l2 = this.registeredListeners[inputKeyValue].length; i2 < l2; ++i2) {
					if (this.registeredListeners[inputKeyValue][i2] === undefined) {
						this.RemoveListenerFromAll(this.registeredListeners[inputKeyValue][i2]);
						--i2;
						--l2;
						continue;
					}

					switch (this.inputs[keys[x]].inputType) {
						case InputType.keyboard:
							this.registeredListeners[inputKeyValue][i2].CEvent('input', keys[x], { eventType: this.inputs[keys[x]].state });
							break;

						case InputType.mouse:
							this.registeredListeners[inputKeyValue][i2].CEvent('input', keys[x], { eventType: this.inputs[keys[x]].state, position: this.inputs[keys[x]].position });
							break;
					}
				}
			}
		}

		for (let x = 0, l = keys.length; x < l; ++x) {
			switch (this.inputs[keys[x]].state) {
				case InputState.OnPressed: this.inputs[keys[x]].State(InputState.Pressed, undefined); break;
				case InputState.OnReleased: this.inputs[keys[x]].State(InputState.Released, undefined); break;
				case InputState.Released: this.inputs[keys[x]].State(InputState.Null, undefined); break;
			}
		}

		keys = null;
	}
}

export { InputHandler, InputState, KeyEnum, InputEnum, InputSideEnum, MouseEnum, ReverseInputEnum, ReverseInputSideEnum, ReverseMouseEnum };