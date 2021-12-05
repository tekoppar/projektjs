import { Vector2D, Cobject, AtlasController, DebugDrawer, ObjectType, BoxCollision, CollisionHandler, ShadowCanvasObject, PolygonCollision, CanvasDrawer, DrawingOperation, OperationType, ObjectsHasBeenInitialized, Tile, Rectangle, CustomLogger } from '../internal.js'

/**
 * Creates a new Cobject
 * @class
 * @constructor
 * @public
 * @extends Cobject
 */
class Pawn extends Cobject {

    /**
     * 
     * @param {string} canvasName 
     * @param {Vector2D} position 
     * @param {boolean} enableCollision 
     * @param {number} drawIndex 
     */
    constructor(canvasName, position, enableCollision = false, drawIndex = 0) {
        super(position);

        if (enableCollision !== undefined)
            this.BoxCollision = new BoxCollision(this.GetPosition(), this.size, enableCollision, this);

        this.canvas;
        this.canvasName = canvasName;
        this.enableCollision = enableCollision;
        this.drawingOperation = undefined;
        this.drawIndex = drawIndex;
        this.previousPosition = new Vector2D(-1, -1);

        if (this.canvasName !== undefined && AtlasController.GetAtlas(this.canvasName) !== undefined) {
            this.canvas = AtlasController.GetAtlas(this.canvasName).GetCanvas();
        }

        this.objectType = ObjectType.Pawn;
    }

    Delete() {
        super.Delete();
        this.canvas = undefined;

        if (this.drawingOperation !== undefined) {
            CanvasDrawer.GCD.AddClearOperation(this.drawingOperation.drawingCanvas, this.BoxCollision.GetBoundingBox().Clone());
            this.drawingOperation.shouldDelete = true;
            this.drawingOperation = undefined;
        }

        if (this.BoxCollision !== undefined)
            this.BoxCollision.Delete();

        this.BoxCollision = undefined;
    }

    GameBegin() {
        super.GameBegin();
    }

    FixedUpdate() {
        super.FixedUpdate();
    }

    /**
     * Sets the position of the object
     * @param {Vector2D} position 
     */
    SetPosition(position) {
        this.drawingOperation.Update(new Vector2D(this.BoxCollision.position.x, this.BoxCollision.position.y));
        super.SetPosition(position);

        this.BoxCollision.position = this.GetPosition().Clone();
        this.BoxCollision.CalculateBoundingBox();
        this.BoxCollision.UpdateCollision();
        this.drawingOperation.tile.position = this.GetPosition();
        this.drawingOperation.UpdateDrawState(true);

    }

    NeedsRedraw(position) {
        if (this.drawingOperation !== undefined && this.drawingOperation.DrawState() === false) {
            this.FlagDrawingUpdate(position);
        }
    }

    FlagDrawingUpdate(position) {
        if (this.drawingOperation !== undefined && this.drawingOperation.DrawState() === false) {
            this.drawingOperation.Update(position);
            //document.getElementById('gameobject-draw-debug').innerHTML += this.name + "\r\n";
        }
    }

    /**
     * 
     * @param {*} frame 
     * @param {Vector2D} position 
     * @param {boolean} clear 
     * @param {*} canvas 
     * @param {OperationType} operationType 
     */
    CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.gameObjects, canvasObject = undefined) {

        let pawnCenterPosition = position.Clone();
        if (this.BoxCollision !== undefined)
            pawnCenterPosition = this.BoxCollision.GetCenterPositionV2();

        if (this.drawingOperation === undefined) {
            this.size.x = frame.w;
            this.size.y = frame.h;
            this.drawingOperation = new DrawingOperation(
                this,
                new Tile(
                    position,
                    new Vector2D(frame.x, frame.y),
                    new Vector2D(frame.w, frame.h),
                    clear,
                    this.canvasName,
                    this.drawIndex
                ),
                CanvasDrawer.GCD.frameBuffer,
                canvas,
                operationType,
                new Vector2D(0, 0),
                pawnCenterPosition,
                this.objectType,
                canvasObject
            );

            CanvasDrawer.GCD.AddDrawOperation(this.drawingOperation, operationType);
            //this.drawingOperation.Update(position);
        } else {
            this.drawingOperation.Update(this.drawingOperation.tile.position);
            this.drawingOperation.tile.position = position;
            this.BoxCollision.boundingBox.x = position.x;
            this.BoxCollision.boundingBox.y = position.y;

            this.BoxCollision.UpdateCollision();

            if (frame !== undefined && frame !== null) {
                this.drawingOperation.tile.tilePosition.x = frame.x;
                this.drawingOperation.tile.tilePosition.y = frame.y;
                this.drawingOperation.tile.size.x = frame.w;
                this.drawingOperation.tile.size.y = frame.h;
                this.size.x = frame.w;
                this.size.y = frame.h;
            }
            //this.drawingOperation.tile.clear = clear;
            this.drawingOperation.tile.atlas = this.canvasName;
            this.drawingOperation.tile.drawIndex = this.drawIndex;
            this.drawingOperation.targetCanvas = canvas;
        }

        this.NeedsRedraw(position);
    }

    /**
     * 
     * @param {*} frame 
     * @param {Vector2D} position 
     * @param {boolean} clear 
     * @param {*} canvas 
     * @param {OperationType} operationType 
     */
    CreateNewDrawOperation(frame, position, clear, canvas, operationType = OperationType.gameObjects) {

        let pawnCenterPosition = position.Clone();
        if (this.BoxCollision !== undefined)
            pawnCenterPosition = this.BoxCollision.GetCenterPositionV2();

        let newOperation;
        newOperation = new DrawingOperation(
            this,
            new Tile(
                position,
                new Vector2D(frame.x, frame.y),
                new Vector2D(frame.w, frame.h),
                clear,
                this.canvasName,
                this.drawIndex
            ),
            CanvasDrawer.GCD.frameBuffer,
            canvas,
            operationType,
            new Vector2D(0, 0),
            pawnCenterPosition,
            this.objectType,
        );

        CanvasDrawer.GCD.AddDrawOperation(newOperation, operationType);
        return newOperation;
    }
}

/**
 * @class
 * @constructor
 * @extends Pawn
 */
class GameObject extends Pawn {

    /**
     * Creates a new GameObject
     * @param {string} canvasName 
     * @param {Vector2D} position 
     * @param {boolean} enableCollision 
     * @param {Number} drawIndex 
     */
    constructor(canvasName, position, enableCollision = false, drawIndex = 0) {
        super(canvasName, position, enableCollision, drawIndex);
        this.Direction = new Vector2D(0, 0);
        this.Velocity = new Vector2D(0, 0);
        this.MovementSpeed = new Vector2D(-1, -1);
        this.BlockingCollision = undefined;
    }

    OnHit(damage, source) {

    }

    Delete() {
        if (this.BlockingCollision !== undefined)
            this.BlockingCollision.Delete();

        super.Delete();
        this.BlockingCollision = undefined;
    }

    GameBegin() {
        super.GameBegin();

        if (AtlasController.GetAtlas(this.canvasName) !== undefined) {
            this.canvas = AtlasController.GetAtlas(this.canvasName).GetCanvas();
        }
    }

    FixedUpdate() {
        super.FixedUpdate();

        if (this.enableCollision === true)
            this.CheckCollision();
    }

    /**
     * Sets the position of the object
     * @param {Vector2D} position 
     */
    SetPosition(position) {
        super.SetPosition(position);

        this.BlockingCollision.position = this.position.Clone();
        this.BlockingCollision.CalculateBoundingBox();
    }

    NeedsRedraw(position) {
        super.NeedsRedraw(position);
    }

    NewCollision(collision) {
        if (this.drawingOperation === undefined) {
            window.requestAnimationFrame(() => this.NewCollision(collision));
            return;
        }
        this.BoxCollision.Delete();
        this.BoxCollision = undefined;
        this.BoxCollision = collision;

        if (this.BoxCollision instanceof PolygonCollision) {
            this.BoxCollision.UpdatePoints();
            this.BoxCollision.CalculateBoundingBox();
            this.BoxCollision.UpdateCollision();
            //collision size is inversed, height then width
            this.drawingOperation.collisionSize = new Vector2D(this.BoxCollision.boundingBox.w, this.BoxCollision.boundingBox.h);
        }
    }

    FlagDrawingUpdate(position) {
        super.FlagDrawingUpdate(position);
    }

    CheckCollision() {
        return CollisionHandler.GCH.CheckCollisions(this.BoxCollision);
    }

    /**
     * Creates a new DrawingOperation
     * @param {*} frame 
     * @param {Vector2D} position 
     * @param {boolean} clear 
     * @param {string} canvas 
     * @param {OperationType} operationType 
     */
    CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.gameObjects, canvasObject = undefined) {
        super.CreateDrawOperation(frame, position, clear, canvas, operationType, canvasObject);
    }
}

/**
 * @class
 * @constructor
 * @extends Pawn
 */
class Shadow extends Pawn {

    /**
     * Creates a new Shadow
     * @param {Object} parent 
     * @param {string} canvasName 
     * @param {Vector2D} position 
     */
    constructor(parent, canvasName, position) {
        super(canvasName, position, false, 0);
        this.size = new Vector2D(1, 1);
        this.currentAnimation = undefined;
        this.name = 'shadow' + this.UID;
        this.parent = parent;

        this.objectType = ObjectType.Shadow;
    }

    Delete() {
        super.Delete();

        this.parent = undefined;
        this.currentAnimation = undefined;
    }

    ChangeAnimation(animation) {
        if (this.currentAnimation != animation)
            this.currentAnimation = animation;
    }

    FixedUpdate() {
        super.FixedUpdate();
    }

    GameBegin() {
        super.GameBegin();

        if (AtlasController.GetAtlas(this.canvasName) !== undefined) {
            this.canvas = AtlasController.GetAtlas(this.canvasName).GetCanvas();
            this.size.x = this.canvas.width;
            this.size.y = this.canvas.height;
            this.BoxCollision.size = this.size;
            this.BoxCollision.position = new Vector2D(this.position.x - this.size.x / 2, this.position.y - this.size.y / 2);
            this.BoxCollision.boundingBox.w = this.size.x;
            this.BoxCollision.boundingBox.h = this.size.y;

            this.BoxCollision.UpdateCollision();
        }

        this.CreateDrawOperation({ x: 0, y: 0, w: this.size.x, h: this.size.y }, new Vector2D(this.position.x - this.size.x / 2, this.position.y - this.size.y / 2), true, this.canvas, OperationType.shadow);
        this.drawingOperation.collisionSize = new Vector2D(this.size.x, 1);
    }

    NeedsRedraw(position) {
        //position.y += 32;
        super.NeedsRedraw(position);
        this.drawingOperation.Update(this.BoxCollision.position.Clone());
    }

    FlagDrawingUpdate(position) {
        //position.y += 32;
        super.FlagDrawingUpdate(this.GetPosition());
        this.drawingOperation.Update(this.BoxCollision.position.Clone());
    }

    CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.shadow) {
        //document.getElementById('gameobject-draw-debug').innerHTML += frame.w + ' - ' + frame.h + '\r\n';
        super.CreateDrawOperation(frame, position, clear, canvas, operationType);
    }
}

/**
 * @class
 * @constructor
 * @extends Pawn
 */
class Shadow2D extends Pawn {

    /**
     * Creates a new Shadow2D
     * @param {Object} parent 
     * @param {string} canvasName 
     * @param {Vector2D} position 
     */
    constructor(parent, canvasName, position, shadowSize, tile) {
        super(canvasName, position, false, 0);
        this.size = shadowSize;
        this.currentAnimation = undefined;
        this.name = 'shadow2D' + this.UID;
        this.parent = parent;
        this.shadowObject = new ShadowCanvasObject();
        this.shadowObject.GenerateRealTimeShadow(shadowSize, tile);

        this.objectType = ObjectType.Shadow;
    }

    Delete() {
        super.Delete();

        this.parent = undefined;
        this.currentAnimation = undefined;
    }

    ChangeAnimation(animation) {
        if (this.currentAnimation != animation)
            this.currentAnimation = animation;
    }

    FixedUpdate() {
        super.FixedUpdate();
    }

    GameBegin() {
        super.GameBegin();

        if (AtlasController.GetAtlas(this.canvasName) !== undefined) {
            this.canvas = AtlasController.GetAtlas(this.canvasName).GetCanvas();
            this.size = this.shadowObject.GetSize();
            this.BoxCollision.size = this.size;
            this.BoxCollision.position = new Vector2D(this.position.x - this.size.x / 2, this.position.y - this.size.y / 2);
            this.BoxCollision.boundingBox.w = this.size.x;
            this.BoxCollision.boundingBox.h = this.size.y;

            this.BoxCollision.UpdateCollision();
        }

        this.CreateDrawOperation({ x: 0, y: 0, w: this.size.x, h: this.size.y }, new Vector2D(this.position.x - this.size.x / 2, this.position.y - this.size.y / 2), true, this.canvas, OperationType.shadow);
        this.drawingOperation.collisionSize = this.shadowObject.GetSize();
    }

    NeedsRedraw(position) {
        //position.y += 32;
        super.NeedsRedraw(position);
        this.drawingOperation.Update(this.BoxCollision.position.Clone());
    }

    FlagDrawingUpdate(position) {
        //position.y += 32;
        super.FlagDrawingUpdate(this.GetPosition());
        this.drawingOperation.Update(this.BoxCollision.position.Clone());
    }

    /**
     * 
     * @param {Tile} tile 
     */
    AddShadow(tile) {
        this.shadowObject.DrawToShadowCanvas(tile);
    }

    /**
     * 
     * @param {Tile} tile 
     */
    UpdateShadow(tile) {
        this.shadowObject.UpdateRealTimeShadow(this.name, this.position, this.BoxCollision, tile);
        this.SetPosition(new Vector2D(this.position.x - this.shadowObject.centerPosition.x, this.position.y - this.shadowObject.centerPosition.y));
        this.drawingOperation.collisionSize = new Vector2D(0, -64);
    }

    CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.shadow2D) {
        //document.getElementById('gameobject-draw-debug').innerHTML += frame.w + ' - ' + frame.h + '\r\n';
        super.CreateDrawOperation(frame, position, clear, this.shadowObject.canvas, OperationType.shadow2D);
    }
}

export { Pawn, GameObject, Shadow, Shadow2D };