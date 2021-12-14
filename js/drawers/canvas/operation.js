import { Vector2D, Rectangle, ShadowCanvasOperation, ObjectType, AmbientLight, Tile, CFrame } from '../../internal.js';

/**
 * Enum for frustum culling state
 * @readonly
 * @enum {Number}
 */
const FrustumCullingState = {
    NotChecked: 0,
    Culled: 1,
    Visible: 2,
    PartiallyCulled: 3,
}
/**
 * Enum for operation type
 * @readonly
 * @enum {Number}
 */
const OperationType = {
    terrain: 0,
    gameObjects: 1,
    gui: 2,
    previewTerrain: 3,
    shadow: 4,
    particles: 5,
    lighting: 6,
    shadow2D: 7,
}

/**
 * @class
 * @constructor
 */
class Operation {
    /**
     * Creates a Operation
     * @param {HTMLCanvasElement} drawingCanvas 
     * @param {OperationType} operationType 
     */
    constructor(drawingCanvas, operationType = OperationType.terrain) {
        /** @type {Vector2D} */
        this.oldPosition = new Vector2D(0, 0);

        /** @type {boolean} */
        this.isVisible = false;

        /** @type {boolean} */
        this.shouldDelete = false;

        /** @type {HTMLCanvasElement} */
        this.drawingCanvas = drawingCanvas;

        /** @type {OperationType} */
        this.operationType = operationType;

        /** @type {boolean} */
        this.frustumCulled = false;

        /** @type {FrustumCullingState} */
        this.frustumState = FrustumCullingState.NotChecked;

        /** @type {boolean} */
        this.debugDraw = false;
    }

    Delete() {
        this.shouldDelete = true;
    }

    /**
     * 
     * @param {Vector2D} position 
     */
    Update(position) {
        if (position !== undefined) {
            this.oldPosition.x = position.x;
            this.oldPosition.y = position.y;
            //this.oldPosition.Set(position);
        }

        this.isVisible = false;
    }

    /**
     * Checks if the operation is inside the view frustum
     * @param {Rectangle} frustum 
     */
    FrustumCulling(frustum) {
        let tPos = this.GetPosition();
        let newState = frustum.InsideXY(tPos.x, tPos.y) || frustum.InsideXY(tPos.x + this.GetDrawSize().x, tPos.y + this.GetDrawSize().y);
        //CustomLogger.Log(this.GetOwner(), [frustum.ToString(), newState, this.frustumCulled, this.oldPosition.ToString()]);

        if (this.frustumCulled === true && newState === true && this.frustumState !== FrustumCullingState.Visible) {
            this.UpdateDrawState(true);
            this.frustumState = FrustumCullingState.Visible;
        } else if (frustum.InsideXY(tPos.x, tPos.y) === false && frustum.InsideXY(tPos.x + this.GetDrawSize().x, tPos.y + this.GetDrawSize().y) === true) {
            this.UpdateDrawState(true);
            this.frustumState = FrustumCullingState.PartiallyCulled;
        } else if (frustum.InsideXY(tPos.x, tPos.y) === true && frustum.InsideXY(tPos.x + this.GetDrawSize().x, tPos.y + this.GetDrawSize().y) === false) {
            this.UpdateDrawState(true);
            this.frustumState = FrustumCullingState.PartiallyCulled;
        }

        this.frustumCulled = !newState;
        if (this.frustumCulled === true) {
            this.UpdateDrawState(false);
            this.frustumState = FrustumCullingState.Culled;
        }
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetPreviousPosition() {
        return this.oldPosition;
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetPosition() {
        return this.oldPosition;
    }


    /**
     * 
     * @returns {Vector2D}
     */
    GetDrawSize() {
        return new Vector2D(32, 32);
    }

    /**
     * 
     * @returns {Rectangle}
     */
    GetBoundingBox() {
        return new Rectangle(0, 0, 32, 32);
    }

    /**
     * 
     * @returns {ObjectType}
     */
    GetObjectType() {
        return ObjectType.Pawn;
    }

    /**
     * 
     * @returns {Object}
     */
    GetOwner() {
        return undefined;
    }

    /**
     * 
     * @param {boolean} state 
     */
    UpdateDrawState(state) {
        this.frustumCulled = state;
    }

    /**
     * 
     * @returns {boolean}
     */
    DrawState() {
        return false;
    }

    /**
     * 
     * @param {Number} delta 
     */
    //@ts-ignore
    Tick(delta) {

    }
}

/**
 * @class
 * @constructor
 * @extends Operation
 */
class TextOperation extends Operation {

    /**
     * 
     * @param {string} text 
     * @param {Vector2D} pos 
     * @param {boolean} clear 
     * @param {HTMLCanvasElement} drawingCanvas 
     * @param {string} font 
     * @param {Number} size 
     * @param {string} color 
     * @param {Number} drawIndex 
     */
    constructor(text, pos, clear, drawingCanvas, font = 'sans-serif', size = 18, color = 'rgb(243, 197, 47)', drawIndex = 0) {
        super(drawingCanvas, OperationType.gui);

        /** @type {string} */
        this.text = text;

        /** @type {Vector2D} */
        this.pos = new Vector2D(pos.x, pos.y + (size / 2) - 5);

        /** @type {boolean} */
        this.clear = clear;

        /** @type {string} */
        this.font = font;

        /** @type {Number} */
        this.size = size;

        /** @type {string} */
        this.color = color;

        /** @type {Number} */
        this.drawIndex = drawIndex;

        /** @type {boolean} */
        this.needsToBeRedrawn = true;

    }

    GetDrawIndex() {
        return this.drawIndex;
    }

    GetPosition() {
        return this.pos;
    }

    /**
     * 
     * @returns {Number}
     */
    GetSize() {
        return this.text.length * this.size;
    }

    Update(pos = undefined) {
        this.needsToBeRedrawn = true;
        super.Update(pos === undefined ? this.pos : pos);
    }

    UpdateDrawState(state) {
        this.needsToBeRedrawn = state;
    }

    GetPreviousPosition() {
        return this.oldPosition === undefined ? this.pos : this.oldPosition;
    }

    DrawState() {
        return this.needsToBeRedrawn;
    }
}

/**
 * @class
 * @constructor
 * @extends Operation
 */
class RectOperation extends Operation {

    /**
     * 
     * @param {Vector2D} pos 
     * @param {Vector2D} size 
     * @param {HTMLCanvasElement} drawingCanvas 
     * @param {string} color 
     * @param {boolean} clear 
     * @param {Number} drawIndex 
     * @param {Number} lifetime 
     * @param {Number} alpha 
     * @param {boolean} fillOrOutline 
     */
    constructor(pos, size = new Vector2D(32, 32), drawingCanvas, color = 'rgb(243, 197, 47)', clear, drawIndex = 0, lifetime = -1, alpha = 0.3, fillOrOutline = false) {
        super(drawingCanvas, OperationType.gui);

        /** @type {Vector2D} */
        this.position = pos;

        /** @type {boolean} */
        this.clear = clear;

        /** @type {Array<Rectangle>} */
        this.updateRects = undefined;

        /** @type {Vector2D} */
        this.size = size;

        /** @type {string} */
        this.color = color;

        /** @type {Number} */
        this.drawIndex = drawIndex;

        /** @type {boolean} */
        this.needsToBeRedrawn = true;

        /** @type {Number} */
        this.lifeTime = lifetime;

        /** @type {Number} */
        this.alpha = alpha;

        /** @type {boolean} */
        this.fillOrOutline = fillOrOutline;
    }

    GetDrawIndex() {
        return this.drawIndex;
    }

    GetPosition() {
        return this.position;
    }

    GetDrawPosition() {
        return Vector2D.Add(this.position, this.size);
    }

    GetDrawPositionY() {
        return this.position.y + this.size.y;
    }

    GetSize() {
        return this.size;
    }

    GetBoundingBox() {
        return new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);
    }

    Update(pos) {
        this.needsToBeRedrawn = true;
        super.Update(pos === undefined ? this.position : pos);
    }

    UpdateDrawState(state) {
        this.needsToBeRedrawn = state;
        this.updateRects = undefined;
    }

    AddUpdateRect(rect) {
        if (this.needsToBeRedrawn === false) {
            if (this.updateRects === undefined)
                this.updateRects = [];

            for (let i = 0, l = this.updateRects.length; i < l; ++i) {
                if (this.updateRects[i].GetOverlappingCorners(rect).length >= 4)
                    return;
            }

            this.updateRects.push(rect);
        }
    }

    GetPreviousPosition() {
        return this.oldPosition === undefined ? this.position : this.oldPosition;
    }

    DrawState() {
        return this.needsToBeRedrawn;
    }

    Tick(delta) {
        this.lifeTime -= delta;

        if (this.lifeTime <= 0) {
            this.Delete();
        }
    }
}

/**
 * @class
 * @constructor
 * @public
 * @extends Operation
 */
class DrawingOperation extends Operation {

    /**
     * Creates a DrawingOperation
     * @param {Object} owner 
     * @param {Tile} tile 
     * @param {HTMLCanvasElement} drawingCanvas 
     * @param {HTMLCanvasElement} targetCanvas 
     * @param {OperationType} operationType 
     * @param {Vector2D} drawSize 
     * @param {Vector2D} centerPosition 
     * @param {ObjectType} objectType 
     */
    constructor(owner, tile, drawingCanvas, targetCanvas, operationType = OperationType.gameObjects, drawSize = new Vector2D(0, 0), centerPosition = new Vector2D(tile.position.x, tile.position.y), objectType = ObjectType.Pawn, canvasObject = undefined) {
        super(drawingCanvas, operationType);

        /** @type {Object} */
        this.owner = owner;

        /** @type {Tile} */
        this.tile = tile;

        /** @type {HTMLCanvasElement} */
        this.targetCanvas = targetCanvas;

        /** @type {Vector2D} */
        this.collisionSize = undefined;

        /** @type {Array<Rectangle>} */
        this.updateRects = undefined;

        /** @type {Vector2D} */
        this.drawSize = drawSize;

        /** @type {Vector2D} */
        this.centerPosition = centerPosition;

        /** @type {ObjectType} */
        this.objectType = objectType;

        /** @type {ShadowCanvasOperation} */
        this.shadowOperation = undefined;

        if (canvasObject !== undefined)
            this.shadowOperation = new ShadowCanvasOperation(canvasObject);
    }

    Clone() {
        return new DrawingOperation(
            this,
            this.tile,
            this.drawingCanvas,
            this.targetCanvas
        )
    }

    /**
     * 
     * @param {Vector2D} position 
     */
    Update(position = undefined) {
        super.Update(position);

        if (position !== undefined) {
            this.centerPosition.x = position.x;
            this.centerPosition.y = position.y;
        }

        if (this.frustumState !== FrustumCullingState.Culled)
            this.tile.needsToBeRedrawn = true;
        //this.updateRects = undefined;
    }

    /**
     * 
     * @param {CFrame} frame 
     * @param {Vector2D} position 
     * @param {HTMLCanvasElement} canvas 
     */
    UpdateOperation(frame, position, canvas) {
        this.Update(this.tile.position);
        this.tile.position = position;

        if (frame !== undefined && frame !== null) {
            this.tile.tilePosition.x = frame.x;
            this.tile.tilePosition.y = frame.y;
            this.tile.size.x = frame.w;
            this.tile.size.y = frame.h;
        }
        //this.drawingOperation.tile.clear = clear;
        this.tile.atlas = canvas.id;
        this.targetCanvas = canvas;
    }

    /**
     * 
     * @param {boolean} state 
     */
    UpdateDrawState(state) {
        this.tile.needsToBeRedrawn = state;
        this.updateRects = undefined;
    }

    /**
     * 
     * @param {Rectangle} rect 
     * @returns {void}
     */
    AddUpdateRect(rect) {
        if (this.tile.needsToBeRedrawn === false) {
            if (this.updateRects === undefined)
                this.updateRects = [];

            for (let i = 0, l = this.updateRects.length; i < l; ++i) {
                if (this.updateRects[i].GetOverlappingCorners(rect).length >= 4)
                    return;
            }

            this.updateRects.push(rect);
        }
    }

    /**
     * 
     * @returns {Number}
     */
    GetDrawIndex() {
        return this.tile.drawIndex;
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetPosition() {
        return this.tile.position;
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetDrawSize() {
        return this.drawSize.x !== 0 && this.drawSize.y !== 0 ? this.drawSize : this.tile.size;
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetSize() {
        return this.collisionSize !== undefined ? this.collisionSize : this.tile.size;
    }

    /**
     * 
     * @returns {Rectangle}
     */
    GetBoundingBox() {
        if (this.owner !== undefined && this.owner.position !== undefined)
            return new Rectangle(this.owner.position.x, this.owner.position.y, this.owner.size.x, this.owner.size.y);

        return new Rectangle(this.oldPosition.x, this.oldPosition.y, this.drawSize.x, this.drawSize.y);
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetDrawPosition() {
        return Vector2D.Add(this.tile.position, (this.collisionSize !== undefined ? this.collisionSize : this.tile.size));
    }

    /**
     * 
     * @returns {Number}
     */
    GetDrawPositionY() {
        return this.tile.position.y + (this.collisionSize !== undefined ? this.collisionSize.y : this.tile.size.y);
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetPreviousPosition() {
        return this.oldPosition === undefined ? this.tile.position : this.oldPosition;
    }

    /**
     * 
     * @returns {boolean}
     */
    DrawState() {
        return this.tile.needsToBeRedrawn;
    }

    /**
     * 
     * @returns {Object}
     */
    GetOwner() {
        return this.owner;
    }

    toJSON() {
        if (this.drawingCanvas.id === 'game-canvas' || this.drawingCanvas.id === undefined || this.drawingCanvas.id === '') {
            return {
                t: this.tile
            }
        } else {
            return {
                t: this.tile,
                dc: this.drawingCanvas.id === undefined || this.drawingCanvas.id === '' ? 'game-canvas' : this.drawingCanvas.id,
                tc: this.targetCanvas.id
            }
        }
    }
}

/**
 * @class
 * @constructor
 * @extends Operation
 */
class ClearOperation extends Operation {
    constructor(drawingCanvas, rectangle, operationType = OperationType.gameObjects) {
        super(drawingCanvas, operationType);
        this.rectangle = rectangle;
    }
}

/**
 * @class
 * @constructor
 * @extends Operation
 */
class PathOperation extends Operation {

    /**
     * 
     * @param {Array<Vector2D>} path 
     * @param {HTMLCanvasElement} drawingCanvas 
     * @param {string} color 
     * @param {boolean} clear 
     * @param {Number} drawIndex 
     * @param {Number} lifetime 
     * @param {Number} alpha 
     */
    constructor(path, drawingCanvas, color = 'rgb(243, 197, 47)', clear, drawIndex = 0, lifetime = -1, alpha = 0.3) {
        super(drawingCanvas);

        /** @type {Array<Vector2D>} */
        this.path = path;

        /** @type {boolean} */
        this.clear = clear;

        /** @type {string} */
        this.color = color;

        /** @type {Number} */
        this.drawIndex = drawIndex;

        /** @type {boolean} */
        this.needsToBeRedrawn = true;

        /** @type {Number} */
        this.lifeTime = lifetime;

        /** @type {Number} */
        this.alpha = alpha;
    }

    /**
     * 
     * @returns {Number}
     */
    GetDrawIndex() {
        return this.drawIndex;
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetPosition() {
        return this.path[0];
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetDrawPosition() {
        return this.path[0];
    }

    /**
     * 
     * @returns {Number}
     */
    GetDrawPositionY() {
        return this.path[0].y;
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetSize() {
        return new Vector2D(32, 32);
    }

    /**
     * 
     * @param {Vector2D} pos 
     */
    Update(pos) {
        this.needsToBeRedrawn = true;
        this.UpdatePath(pos);
        super.Update(pos === undefined ? this.path[0] : pos);
    }

    /**
     * 
     * @param {Vector2D} position 
     */
    UpdatePath(position) {
        let relativePosition = this.path[0].Clone();
        for (let i = 0, l = this.path.length; i < l; ++i) {
            this.path[i].Sub(relativePosition);
            this.path[i].Add(position);
        }
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetPreviousPosition() {
        return this.oldPosition === undefined ? this.path[0] : this.oldPosition;
    }

    /**
     * 
     * @returns {boolean}
     */
    DrawState() {
        return this.needsToBeRedrawn;
    }

    /**
     * 
     * @param {Number} delta 
     */
    Tick(delta) {
        this.lifeTime -= delta;

        if (this.lifeTime <= 0) {
            this.Delete();
        }
    }
}

/**
 * @class
 * @constructor
 * @public
 * @extends Operation
 */
class LightingOperation extends Operation {

    /**
     * Creates a lighting operation
     * @param {Object} owner 
     * @param {Vector2D} pos 
     * @param {HTMLCanvasElement} drawingCanvas 
     * @param {AmbientLight} light 
     */
    constructor(owner, pos, drawingCanvas, light) {
        super(drawingCanvas);

        /** @type {Object} */
        this.owner = owner;

        /** @type {Vector2D} */
        this.position = pos;

        /** @type {Number} */
        this.drawIndex = 0;

        /** @type {boolean} */
        this.needsToBeRedrawn = true;


        /** @type {AmbientLight} */
        this.light = light;

        /** @type {Array<Rectangle>} */
        this.updateRects = undefined;

        /** @type {Array<{light: Object, rect: Rectangle}>} */
        this.updateRectsPixelData = undefined;

        //this.frameBufferCtx.fillStyle = 'rgba(1, 1, 1, 1)';
        //this.frameBufferCtx.fillRect(0, 0, this.frameBuffer.width, this.frameBuffer.height);

        /*this.intensityInput;
        this.attenuationInput;
        this.constantInput;
        this.linearInput;
        this.quadInput;

        this.SetupHTML();*/
    }

    /*SetupHTML() {
        let parent = document.body.querySelector('div.controls');
        this.intensityInput = document.createElement('input');
        this.intensityInput.type = 'number';
        this.intensityInput.id = 'lightIntensity';
        this.intensityInput.addEventListener('input', this);
        parent.appendChild(this.intensityInput);

        this.attenuationInput = document.createElement('input');
        this.attenuationInput.type = 'number';
        this.attenuationInput.id = 'lightAttenuation';
        this.attenuationInput.addEventListener('input', this);
        parent.appendChild(this.attenuationInput);

        this.constantInput = document.createElement('input');
        this.constantInput.type = 'number';
        this.constantInput.id = 'lightConstant';
        this.constantInput.step = 0.01;
        this.constantInput.addEventListener('input', this);
        parent.appendChild(this.constantInput);

        this.linearInput = document.createElement('input');
        this.linearInput.type = 'number';
        this.linearInput.id = 'lightLinear';
        this.linearInput.step = 0.01;
        this.linearInput.addEventListener('input', this);
        parent.appendChild(this.linearInput);

        this.quadInput = document.createElement('input');
        this.quadInput.type = 'number';
        this.quadInput.id = 'lightQuad';
        this.quadInput.step = 0.01;
        this.quadInput.addEventListener('input', this);
        parent.appendChild(this.quadInput);
    }

    handleEvent(e) {
        switch (e.type) {
            case 'input':
                switch (e.target.id) {
                    case 'lightIntensity': this.intensity = parseFloat(e.target.value); break;
                    case 'lightAttenuation': this.attenuation = parseFloat(e.target.value); break;
                    case 'lightConstant': this.constant = parseFloat(e.target.value); break;
                    case 'lightLinear': this.linear = parseFloat(e.target.value); break;
                    case 'lightQuad': this.quad = parseFloat(e.target.value); break;
                }
                break;
        }
    }*/

    /**
     * 
     * @returns {Number}
     */
    GetDrawIndex() {
        return this.drawIndex;
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetPosition() {
        return this.position;
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetDrawPosition() {
        return Vector2D.AddF(this.position, this.light.attenuation);
    }

    /**
     * 
     * @returns {Number}
     */
    GetDrawPositionY() {
        return this.position.y;
    }

    /**
     * 
     * @returns {Number}
     */
    GetSize() {
        return this.light.attenuation * this.light.drawScale;
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetDrawSize() {
        return new Vector2D(this.light.attenuation, this.light.attenuation);
    }

    Update(pos) {
        this.needsToBeRedrawn = true;
        super.Update(pos === undefined ? this.position : pos);
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetPreviousPosition() {
        return this.oldPosition === undefined ? this.position : this.oldPosition;
    }

    /**
     * 
     * @param {boolean} value 
     */
    UpdateDrawState(value) {
        this.needsToBeRedrawn = value;
        this.updateRects = undefined;
        this.updateRectsPixelData = undefined;
    }

    /**
     * 
     * @returns {boolean}
     */
    DrawState() {
        return this.needsToBeRedrawn;
    }

    /**
     * 
     * @returns {Object}
     */
    GetOwner() {
        return this.owner;
    }

    /**
 * Checks if the operation is inside the view frustum
 * @param {Rectangle} frustum 
 */
    FrustumCulling(frustum) {
        let tPos = this.GetPosition().Clone();
        tPos.SubF(this.light.halfAttenuation);

        let newState = frustum.InsideXY(tPos.x, tPos.y) || frustum.InsideXY(tPos.x + this.GetDrawSize().x, tPos.y + this.GetDrawSize().y);
        //CustomLogger.Log(this.GetOwner(), [frustum.ToString(), newState, this.frustumCulled, this.oldPosition.ToString()]);

        if (this.frustumCulled === true && newState === true && this.frustumState !== FrustumCullingState.Visible) {
            this.UpdateDrawState(true);
            this.frustumState = FrustumCullingState.Visible;
        } else if (frustum.InsideXY(tPos.x, tPos.y) === false && frustum.InsideXY(tPos.x + this.GetDrawSize().x, tPos.y + this.GetDrawSize().y) === true) {
            this.UpdateDrawState(true);
            this.frustumState = FrustumCullingState.PartiallyCulled;
        } else if (frustum.InsideXY(tPos.x, tPos.y) === true && frustum.InsideXY(tPos.x + this.GetDrawSize().x, tPos.y + this.GetDrawSize().y) === false) {
            this.UpdateDrawState(true);
            this.frustumState = FrustumCullingState.PartiallyCulled;
        }

        this.frustumCulled = !newState;
        if (this.frustumCulled === true) {
            this.UpdateDrawState(false);
            this.frustumState = FrustumCullingState.Culled;
        }
    }

    /**
     * 
     * @param {Rectangle} rect 
     * @param {Object} light 
     * @param {Rectangle} alphaRect 
     * @returns {void}
     */
    AddUpdateRect(rect, light = undefined, alphaRect = undefined) {
        if (this.needsToBeRedrawn === false) {
            if (this.updateRects === undefined) {
                this.updateRects = [];
                this.updateRectsPixelData = [];
            }

            /*if (this.updateRects.length > 0)
                RectMerge([...this.updateRects, rect]);*/

            for (let i = 0, l = this.updateRects.length; i < l; ++i) {
                let overlappingCornersCount = this.updateRects[i].GetOverlappingCorners(rect).length;
                if (overlappingCornersCount >= 4)
                    return;
            }

            this.updateRects.push(rect);
            if (light !== undefined && alphaRect !== undefined) {
                this.updateRectsPixelData.push({ light: light, rect: alphaRect });
            }
        }
    }

    /**
     * 
     * @param {Rectangle} rect 
     * @param {Object} light 
     * @param {Rectangle} alphaRect 
     */
    ForceAddUpdateRects(rect, light = undefined, alphaRect = undefined) {
        if (this.updateRects === undefined) {
            this.updateRects = [];
            this.updateRectsPixelData = [];
        }

        this.updateRects.push(rect);
        if (light !== undefined && alphaRect !== undefined) {
            this.updateRectsPixelData.push({ light: light, rect: alphaRect });
        }
    }
}

export { Operation, RectOperation, TextOperation, DrawingOperation, OperationType, ClearOperation, PathOperation, LightingOperation };