import { CanvasDrawer, MasterObject, Vector2D } from '../internal.js';

/**
 * Enum for input state
 * @readonly
 * @enum {Number}
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
 * @enum {Number}
 */
const InputType = {
    keyboard: 0,
    mouse: 1,
}

/**
 * @class
 * @constructor
 */
class Input {

    /**
     * 
     * @param {string} key 
     * @param {InputType} inputType 
     */
    constructor(key, inputType = InputType.keyboard) {

        /** @type {string} */
        this.key = key;

        /** @type {InputState} */
        this.state = InputState.Null;

        /** @type {Vector2D} */
        this.position = new Vector2D(0, 0);

        /** @type {InputType} */
        this.inputType = inputType;
    }

    State(s, p) {
        switch (s) {
            case InputState.OnPressed:
                if (this.state !== InputState.Pressed) {
                    this.state = s;
                    this.position = p;
                } else if (s === InputState.OnPressed && this.state === InputState.Pressed) {
                    this.state = InputState.Pressed;
                    this.position = p;
                }
                break;

            case InputState.Pressed:
                this.state = s;
                this.position = p;
                break;

            case InputState.OnReleased:
                if (this.state !== InputState.Released) {
                    this.state = s;
                    this.position = p;
                } else if (s === InputState.OnReleased && this.state === InputState.Released) {
                    this.state = InputState.Released;
                    this.position = p;
                }
                break;

            case InputState.Released:
                this.state = s;
                this.position = p;
                break;

            case InputState.Null: this.state = null; this.position = p; break;
        }
    }
}

/**
 * @class
 * @constructor
 */
class InputHandler {
    static GIH = new InputHandler();

    constructor() {
        this.gameCanvas = document.getElementById('game-canvas');

        /** @type {Object.<string, Input>} */
        this.keysPressed = {
            '0': new Input('0'),
            '1': new Input('1'),
            '2': new Input('2'),
            '3': new Input('3'),
            '4': new Input('4'),
            '5': new Input('5'),
            '6': new Input('6'),
            '7': new Input('7'),
            '8': new Input('8'),
            '9': new Input('9'),
            'a': new Input('a'),
            'd': new Input('d'),
            'w': new Input('w'),
            's': new Input('s'),
            'e': new Input('e'),
            'i': new Input('i'),
            'q': new Input('q'),
            'c': new Input('c'),
            'p': new Input('p'),
            'g': new Input('g'),
            'b': new Input('b'),
            'tab': new Input('tab'),
            'escape': new Input('escape'),
            'backspace': new Input('backspace'),
            'leftMouse': new Input('leftMouse', InputType.mouse),
            'middleMouse': new Input('middleMouse', InputType.mouse),
            'rightMouse': new Input('rightMouse', InputType.mouse),
            'leftShift': new Input('leftShift'),
            'rightShift': new Input('rightShift'),
            'leftCtrl': new Input('leftCtrl'),
            'arrowUp': new Input('arrowUp'),
            'arrowLeft': new Input('arrowLeft'),
            'arrowDown': new Input('arrowDown'),
            'arrowRight': new Input('arrowRight'),
        };
        this.registeredListeners = [];
        this.AttachInputListener();
    }

    AttachInputListener() {
        document.addEventListener('keydown', this);
        document.addEventListener('keyup', this);
        this.gameCanvas.addEventListener('mousedown', this);
        this.gameCanvas.addEventListener('mouseup', this);
    }

    AddListener(object) {
        this.registeredListeners.push(object);
    }

    RemoveListener(object) {
        for (let i = 0, l = this.registeredListeners.length; i < l; ++i) {
            if (this.registeredListeners[i] === object)
                this.registeredListeners.splice(i, 1);
        }
    }

    AddInput(key, state, position = new Vector2D(0, 0)) {
        this.keysPressed[key].State(state, position);
    }

    handleEvent(e) {
        switch (e.type) {
            case 'keydown':
                switch (e.keyCode) {
                    case 8: this.AddInput('backspace', InputState.OnPressed); break;
                    case 9: this.AddInput('tab', InputState.OnPressed); break;
                    case 16: this.AddInput(e.location === 1 ? 'leftShift' : 'rightShift', InputState.OnPressed); break;
                    case 17: this.AddInput('leftCtrl', InputState.OnPressed); break;
                    case 27: this.AddInput('escape', InputState.OnPressed); break;
                    case 37: this.AddInput('arrowLeft', InputState.OnPressed); break;
                    case 38: this.AddInput('arrowUp', InputState.OnPressed); break;
                    case 39: this.AddInput('arrowRight', InputState.OnPressed); break;
                    case 40: this.AddInput('arrowDown', InputState.OnPressed); break;
                    case 48: this.AddInput('0', InputState.OnPressed); break;
                    case 49: this.AddInput('1', InputState.OnPressed); break;
                    case 50: this.AddInput('2', InputState.OnPressed); break;
                    case 51: this.AddInput('3', InputState.OnPressed); break;
                    case 52: this.AddInput('4', InputState.OnPressed); break;
                    case 53: this.AddInput('5', InputState.OnPressed); break;
                    case 54: this.AddInput('6', InputState.OnPressed); break;
                    case 55: this.AddInput('7', InputState.OnPressed); break;
                    case 56: this.AddInput('8', InputState.OnPressed); break;
                    case 57: this.AddInput('9', InputState.OnPressed); break;
                    case 65: this.AddInput('a', InputState.OnPressed); break;
                    case 66: this.AddInput('b', InputState.OnPressed); break;
                    case 67: this.AddInput('c', InputState.OnPressed); break;
                    case 68: this.AddInput('d', InputState.OnPressed); break;
                    case 69: this.AddInput('e', InputState.OnPressed); break;
                    case 71: this.AddInput('g', InputState.OnPressed); break;
                    case 73: this.AddInput('i', InputState.OnPressed); break;
                    case 80: this.AddInput('p', InputState.OnPressed); break;
                    case 81: this.AddInput('q', InputState.OnPressed); break;
                    case 83: this.AddInput('s', InputState.OnPressed); break;
                    case 87: this.AddInput('w', InputState.OnPressed); break;
                }
                break;
            case 'keyup':
                switch (e.keyCode) {
                    case 8: this.AddInput('backspace', InputState.OnReleased); break;
                    case 9: this.AddInput('tab', InputState.OnReleased); break;
                    case 16: this.keysPressed[e.location === 1 ? 'leftShift' : 'rightShift'].State(InputState.OnReleased); break;
                    case 17: this.AddInput('leftCtrl', InputState.OnReleased); break;
                    case 27: this.AddInput('escape', InputState.OnReleased); break;
                    case 37: this.AddInput('arrowLeft', InputState.OnReleased); break;
                    case 38: this.AddInput('arrowUp', InputState.OnReleased); break;
                    case 39: this.AddInput('arrowRight', InputState.OnReleased); break;
                    case 40: this.AddInput('arrowDown', InputState.OnReleased); break;
                    case 48: this.AddInput('0', InputState.OnReleased); break;
                    case 49: this.AddInput('1', InputState.OnReleased); break;
                    case 50: this.AddInput('2', InputState.OnReleased); break;
                    case 51: this.AddInput('3', InputState.OnReleased); break;
                    case 52: this.AddInput('4', InputState.OnReleased); break;
                    case 53: this.AddInput('5', InputState.OnReleased); break;
                    case 54: this.AddInput('6', InputState.OnReleased); break;
                    case 55: this.AddInput('7', InputState.OnReleased); break;
                    case 56: this.AddInput('8', InputState.OnReleased); break;
                    case 57: this.AddInput('9', InputState.OnReleased); break;
                    case 65: this.AddInput('a', InputState.OnReleased); break;
                    case 66: this.AddInput('b', InputState.OnReleased); break;
                    case 68: this.AddInput('d', InputState.OnReleased); break;
                    case 67: this.AddInput('c', InputState.OnReleased); break;
                    case 69: this.AddInput('e', InputState.OnReleased); break;
                    case 71: this.AddInput('g', InputState.OnReleased); MasterObject.MO.NextFrame(); break;
                    case 73: this.AddInput('i', InputState.OnReleased); break;
                    case 80: this.AddInput('p', InputState.OnReleased); MasterObject.MO.ToggleFrameStepping(); break;
                    case 81: this.AddInput('q', InputState.OnReleased); break;
                    case 83: this.AddInput('s', InputState.OnReleased); break;
                    case 87: this.AddInput('w', InputState.OnReleased); break;
                }
                break;
            case 'mousedown':
                switch (e.button) {
                    case 0: this.AddInput('leftMouse', InputState.OnPressed, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
                    case 1: this.AddInput('middleMouse', InputState.OnPressed, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
                    case 2: this.AddInput('rightMouse', InputState.OnPressed, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
                }
                break;
            case 'mouseup':
                switch (e.button) {
                    case 0: this.AddInput('leftMouse', InputState.OnReleased, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
                    case 1: this.AddInput('middleMouse', InputState.OnReleased, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
                    case 2: this.AddInput('rightMouse', InputState.OnReleased, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
                }
                break;
        }
    }

    //@ts-ignore
    FixedUpdate(delta) {
        let keys = Object.keys(this.keysPressed);

        for (let x = 0; x < keys.length; x++) {
            if (this.keysPressed[keys[x]].state !== InputState.Null) {
                for (let i = 0, l = this.registeredListeners.length; i < l; ++i) {
                    if (this.registeredListeners[i] === undefined) {
                        this.RemoveListener(this.registeredListeners[i]);
                        continue;
                    }

                    switch (this.keysPressed[keys[x]].inputType) {
                        case InputType.keyboard:
                            this.registeredListeners[i].CEvent('input', keys[x], { eventType: this.keysPressed[keys[x]].state });
                            break;

                        case InputType.mouse:
                            this.registeredListeners[i].CEvent('input', keys[x], { eventType: this.keysPressed[keys[x]].state, position: this.keysPressed[keys[x]].position });
                            break;
                    }
                }
            }
        }

        for (let x = 0, l = keys.length; x < l; ++x) {
            switch (this.keysPressed[keys[x]].state) {
                case InputState.OnPressed: this.keysPressed[keys[x]].State(InputState.Pressed); break;
                case InputState.OnReleased: this.keysPressed[keys[x]].State(InputState.Released); break;
                case InputState.Released: this.keysPressed[keys[x]].State(InputState.Null); break;
            }
        }

        keys = null;
    }
}

export { InputHandler, InputState };