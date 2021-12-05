import { Vector2D, Rectangle, ShadowCanvasOperation, ObjectType, AmbientLight, Tile } from '../../internal.js';
import { RectMerge } from '../../classes/utility/rectMerge.js';

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
 * @public
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
        if (this instanceof LightingOperation)
            return;

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

    GetPreviousPosition() {
        return this.oldPosition;
    }

    GetPosition() {
        return this.oldPosition;
    }


    GetDrawSize() {
        return new Vector2D(32, 32);
    }

    GetBoundingBox() {
        return new Rectangle(0, 0, 32, 32);
    }

    GetObjectType() {
        ObjectType.Pawn;
    }

    GetOwner() {
        return undefined;
    }

    UpdateDrawState(state) {

    }

    DrawState() {
        return false;
    }

    Tick() {

    }
}

/**
 * @class
 * @constructor
 * @extends Operation
 */
class TextOperation extends Operation {
    constructor(text, pos, clear, drawingCanvas, font = 'sans-serif', size = 18, color = 'rgb(243, 197, 47)', drawIndex = 0) {
        super(drawingCanvas, OperationType.gui);
        this.text = text;
        this.pos = new Vector2D(pos.x, pos.y + (size / 2) - 5);
        this.clear = clear;
        this.font = font;
        this.size = size;
        this.color = color;
        this.drawIndex = drawIndex;
        this.needsToBeRedrawn = true;

    }

    GetDrawIndex() {
        return this.drawIndex;
    }

    GetPosition() {
        return this.pos;
    }

    GetSize() {
        return this.text.length * this.size;
    }

    Update(pos) {
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
    constructor(pos, size = new Vector2D(32, 32), drawingCanvas, color = 'rgb(243, 197, 47)', clear, drawIndex = 0, lifetime = -1, alpha = 0.3, fillOrOutline = false) {
        super(drawingCanvas, OperationType.gui);
        this.position = pos;
        this.clear = clear;
        this.updateRects = undefined;
        this.size = size;
        this.color = color;
        this.drawIndex = drawIndex;
        this.needsToBeRedrawn = true;
        this.lifeTime = lifetime;
        this.alpha = alpha;
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
        this.owner = owner;
        this.tile = tile;
        this.targetCanvas = targetCanvas;
        this.collisionSize = undefined;
        this.updateRects = undefined;
        this.drawSize = drawSize;
        this.centerPosition = centerPosition;
        this.objectType = objectType;
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

    Update(position) {
        super.Update(position);
        this.centerPosition.x = position.x;
        this.centerPosition.y = position.y;
        this.tile.needsToBeRedrawn = true;
        //this.updateRects = undefined;
    }

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

    UpdateDrawState(state) {
        this.tile.needsToBeRedrawn = state;
        this.updateRects = undefined;
    }

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

    GetDrawIndex() {
        return this.tile.drawIndex;
    }

    GetPosition() {
        return this.tile.position;
    }

    GetDrawSize() {
        return this.drawSize.x !== 0 && this.drawSize.y !== 0 ? this.drawSize : this.tile.size;
    }

    GetSize() {
        return this.collisionSize !== undefined ? this.collisionSize : this.tile.size;
    }

    GetBoundingBox() {
        if (this.owner !== undefined && this.owner.position !== undefined)
            return new Rectangle(this.owner.position.x, this.owner.position.y, this.owner.size.x, this.owner.size.y);

        return new Rectangle(this.oldPosition.x, this.oldPosition.y, this.drawSize.x, this.drawSize.y);
    }

    GetDrawPosition() {
        return Vector2D.Add(this.tile.position, (this.collisionSize !== undefined ? this.collisionSize : this.tile.size));
    }

    GetDrawPositionY() {
        return this.tile.position.y + (this.collisionSize !== undefined ? this.collisionSize.y : this.tile.size.y);
    }

    GetPreviousPosition() {
        return this.oldPosition === undefined ? this.tile.position : this.oldPosition;
    }

    DrawState() {
        return this.tile.needsToBeRedrawn;
    }

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
    constructor(path, drawingCanvas, color = 'rgb(243, 197, 47)', clear, drawIndex = 0, lifetime = -1, alpha = 0.3) {
        super(drawingCanvas);
        this.path = path;
        this.clear = clear;
        this.color = color;
        this.drawIndex = drawIndex;
        this.needsToBeRedrawn = true;
        this.lifeTime = lifetime;
        this.alpha = alpha;
    }

    GetDrawIndex() {
        return this.drawIndex;
    }

    GetPosition() {
        return this.path[0];
    }

    GetDrawPosition() {
        return this.path[0];
    }

    GetDrawPositionY() {
        return this.path[0].y;
    }

    GetSize() {
        return new Vector2D(32, 32);
    }

    Update(pos) {
        this.needsToBeRedrawn = true;
        super.Update(pos === undefined ? this.path[0] : pos);
    }

    GetPreviousPosition() {
        return this.oldPosition === undefined ? this.path[0] : this.oldPosition;
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
        this.owner = owner;
        this.position = pos;
        this.drawIndex = 0;
        this.needsToBeRedrawn = true;
        /** @type {AmbientLight} */
        this.light = light;

        /** @type {Array<Rectangle>} */
        this.updateRects = undefined;
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

    GetDrawIndex() {
        return this.drawIndex;
    }

    GetPosition() {
        return this.position;
    }

    GetDrawPosition() {
        return Vector2D.AddF(this.position, this.light.attenuation);
    }

    GetDrawPositionY() {
        return this.position.y;
    }

    GetSize() {
        return this.light.attenuation * this.light.drawScale;
    }

    Update(pos) {
        this.needsToBeRedrawn = true;
        super.Update(pos === undefined ? this.position : pos);
    }

    GetPreviousPosition() {
        return this.oldPosition === undefined ? this.position : this.oldPosition;
    }

    UpdateDrawState(value) {
        this.needsToBeRedrawn = value;
        this.updateRects = undefined;
        this.updateRectsPixelData = undefined;
    }

    DrawState() {
        return this.needsToBeRedrawn;
    }

    GetOwner() {
        return this.owner;
    }

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