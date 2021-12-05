import { BoxCollision, Collision, PolygonCollision, CollisionHandler, Vector2D, RectOperation, Rectangle, Color, Cobject, PathOperation, Polygon } from '../../internal.js';

function sortDrawOperations(a, b) {
    if (a.GetDrawPositionY() > b.GetDrawPositionY()) return 1;
    if (a.GetDrawPositionY() < b.GetDrawPositionY()) return -1;
    if (a.GetDrawIndex() > b.GetDrawIndex()) return 1;
    if (a.GetDrawIndex() < b.GetDrawIndex()) return -1;
    return 0;
};

function sortCollisions(a, b) {
    return a.enableCollision * 1 + b.enableCollision * -1;
};

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class DebugDrawer extends Cobject {

    /** @type {DebugDrawer} */
    static _Instance;

    /**
     * Creates a new DebugDrawer
     */
    constructor() {
        super(new Vector2D(0, 0));
        DebugDrawer._Instance = this;

        /** @type {boolean} */
        this.DebugDraw = false;

        /** @type {Array} */
        this.debugOperations = [];

        /** @type {HTMLCanvasElement} */
        this.gameDebugCanvas = undefined;

        /** @type {CanvasRenderingContext2D} */
        this.gameDebugCanvasCtx = undefined;
    }

    /**
     * 
     * @param {Object} object 
     * @returns {Color}
     */
    GetColor(object) {
        let s = undefined;

        switch (object.constructor) {
            case BoxCollision:
                if (object.enableCollision === true)
                    s = Color.CSS_COLOR_TABLE.darkred;
                else
                    s = Color.CSS_COLOR_TABLE.deepskyblue;

                break;
            case PolygonCollision:
                if (object.enableCollision === true)
                    s = Color.CSS_COLOR_TABLE.darkmagenta;
                else
                    s = Color.CSS_COLOR_TABLE.darkblue;

                break;
            case Collision: s = Color.CSS_COLOR_TABLE.sienna; break;
            default: s = Color.CSS_COLOR_TABLE.darkmagenta;
        }

        if (s !== undefined) {
            s = Color.ColorToRGBA(s);
            s.alpha *= 255;
        } else {
            s = new Color(0, 0, 0, 0);
        }
        return s;
    }

    /**
     * Adds a drawing operation for a position
     * @param {Vector2D} position 
     * @param {Number} lifetime 
     * @param {string} color 
     */
    AddDebugOperation(position, lifetime = 5, color = 'purple') {
        this.debugOperations.push(new RectOperation(position, new Vector2D(5, 5), this.gameDebugCanvas, color, false, 0, lifetime, 1.0));
    }

    /**
    * Adds a drawing operation for a position
    * @param {Vector2D} position 
    * @param {Number} lifetime 
    * @param {string} color 
    */
    static AddDebugOperation(position, lifetime = 5, color = 'purple') {
        DebugDrawer._Instance.AddDebugOperation(position, lifetime, color);
    }

    /**
     * Adds a drawing operation for a rectangle
     * @param {Rectangle} rect 
     * @param {Number} lifetime 
     * @param {string} color 
     * @param {boolean} fillOrOutline 
     */
    AddDebugRectOperation(rect, lifetime = 5, color = 'purple', fillOrOutline = false) {
        this.debugOperations.push(new RectOperation(new Vector2D(rect.x, rect.y), new Vector2D(rect.w, rect.h), this.gameDebugCanvas, color, false, 0, lifetime, 1.0, fillOrOutline));
    }

    /**
     * Adds a drawing operation for a rectangle
     * @param {Rectangle} rect 
     * @param {Number} lifetime 
     * @param {string} color 
     * @param {boolean} fillOrOutline 
     */
    static AddDebugRectOperation(rect, lifetime = 5, color = 'purple', fillOrOutline = false) {
        DebugDrawer._Instance.AddDebugRectOperation(rect, lifetime, color, fillOrOutline);
    }

    /**
     * 
     * @param {Number} delta 
     */
    DrawDebugLoop(delta) {
        if (this.DebugDraw === true) {
            this.gameDebugCanvasCtx.clearRect(0, 0, this.gameDebugCanvas.width, this.gameDebugCanvas.height);
            let collisions = CollisionHandler.GCH.Collisions;
            collisions.sort(sortCollisions);

            for (let i = 0, l = collisions.length; i < l; ++i) {
                this.DrawDebugCanvas(collisions[i]);
            }
        }

        this.debugOperations.sort(sortDrawOperations);

        for (let i = 0, l = this.debugOperations.length; i < l; ++i) {
            const tObject = this.debugOperations[i];

            switch (tObject.constructor) {
                case RectOperation:
                    if (tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
                        this.CanvasClear(tObject);
                    break;
                case PathOperation:
                    if (tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
                        this.CanvasClear(tObject);
                    break;
            }
        }

        for (let i = 0, l = this.debugOperations.length; i < l; ++i) {
            if (this.debugOperations[i].shouldDelete === true) {
                this.debugOperations.splice(i, 1);
                i--;
                l--;
            } else {
                this.DrawDebugCanvasOperation(this.debugOperations[i], delta);
            }
        }
    }

    /**
     * 
     * @param {*} drawingOperation 
     */
    CanvasClear(drawingOperation) {
        let oldPosition = drawingOperation.GetPreviousPosition(),
            size = new Vector2D(0, 0);

        drawingOperation.isVisible = false;
        switch (drawingOperation.constructor) {
            case RectOperation:
                size.Set(drawingOperation.GetSize());
                drawingOperation.drawingCanvas.getContext('2d').clearRect(oldPosition.x - 1, oldPosition.y - 1, size.x + 2, size.y + 2);
                drawingOperation.drawingCanvas.getContext('2d').clearRect(drawingOperation.position.x - 1, drawingOperation.position.y - 1, size.x + 2, size.y + 2);
                break;
            case PathOperation:
                let boundingBox = Polygon.CalculateBoundingBox(drawingOperation.path);
                boundingBox.x -= 1;
                boundingBox.y -= 1;
                boundingBox.z += 2;
                boundingBox.a += 2;
                drawingOperation.drawingCanvas.getContext('2d').clearRect(boundingBox.x, boundingBox.y, boundingBox.z, boundingBox.a);
                break;
        }
    }

    /**
     * 
     * @param {RectOperation} drawingOperation 
     * @param {Number} delta 
     * @returns {void}
     */
    DrawDebugCanvasOperation(drawingOperation, delta) {
        let context = drawingOperation.drawingCanvas.getContext('2d');

        switch (drawingOperation.constructor) {
            case RectOperation:
                context.globalAlpha = drawingOperation.alpha;

                drawingOperation.UpdateDrawState(false);

                if (drawingOperation.fillOrOutline === false) {
                    context.fillStyle = drawingOperation.color;
                    context.fillRect(drawingOperation.position.x, drawingOperation.position.y, drawingOperation.size.x, drawingOperation.size.y);
                }
                else {
                    context.strokeStyle = drawingOperation.color;
                    context.strokeRect(drawingOperation.position.x + 1, drawingOperation.position.y + 1, drawingOperation.size.x - 2, drawingOperation.size.y - 2);
                }

                context.globalAlpha = 0.3;

                if (drawingOperation.lifeTime !== -1) {
                    drawingOperation.Tick(delta);

                    if (drawingOperation.lifeTime < 0)
                        return;
                }
                break;
        }
    }

    /**
     * 
     * @param {*} collision 
     * @returns {void}
     */
    DrawDebugCanvas(collision) {
        if (collision.debugDraw === false)
            return;

        let color = this.GetColor(collision);
        if (collision.enableCollision === true)
            color.MultF(0.7);

        this.gameDebugCanvasCtx.fillStyle = color.ToString();

        switch (collision.constructor) {
            case BoxCollision:
                this.gameDebugCanvasCtx.clearRect(collision.boundingBox.x, collision.boundingBox.y, collision.boundingBox.w, collision.boundingBox.h);
                this.gameDebugCanvasCtx.fillRect(collision.boundingBox.x, collision.boundingBox.y, collision.boundingBox.w, collision.boundingBox.h);
                break;

            case PolygonCollision:
                this.gameDebugCanvasCtx.beginPath();
                this.gameDebugCanvasCtx.moveTo(collision.points[0].x, collision.points[0].y);

                for (let point of collision.points) {
                    this.gameDebugCanvasCtx.lineTo(point.x, point.y);
                }

                this.gameDebugCanvasCtx.closePath();
                this.gameDebugCanvasCtx.fill();
                break;

            case Collision:
                this.gameDebugCanvasCtx.clearRect(collision.boundingBox.x, collision.boundingBox.y, collision.boundingBox.w, collision.boundingBox.h);
                this.gameDebugCanvasCtx.fillRect(collision.boundingBox.x, collision.boundingBox.y, collision.boundingBox.w, collision.boundingBox.h);
                break;
        }
    }

    FixedUpdate(delta) {

    }

    EndOfFameUpdate() {

    }

    Delete() {
        Cobject.DeleteObject(this);
    }

    CEvent(eventType, data) {

    }

    /**
     * 
     * @param {Vector2D} checkPos 
     * @param {Number} range 
     * @returns {boolean}
     */
    CheckInRange(checkPos, range = 100.0) {
        return this.position.Distance(checkPos) < range;
    }

    GameBegin() {
        document.getElementById('enable-debug').addEventListener('click', this);
        const canvasEl = document.getElementById('game-canvas');

        this.gameDebugCanvas = document.createElement('canvas');
        this.gameDebugCanvas.setAttribute('width', canvasEl.getAttribute('width'));
        this.gameDebugCanvas.setAttribute('height', canvasEl.getAttribute('height'));
        this.gameDebugCanvas.id = 'GameDebugCanvas';
        document.body.appendChild(this.gameDebugCanvas);
        this.gameDebugCanvasCtx = this.gameDebugCanvas.getContext('2d');
        this.gameDebugCanvasCtx.imageSmoothingEnabled = false;
        this.gameDebugCanvasCtx.globalAlpha = 0.3;
    }

    handleEvent(e) {
        switch (e.type) {
            case 'click':
                switch (e.target.id) {
                    case 'enable-debug':
                        this.DebugDraw = !this.DebugDraw;

                        if (this.DebugDraw === false)
                            this.gameDebugCanvasCtx.clearRect(0, 0, this.gameDebugCanvas.width, this.gameDebugCanvas.height);

                        break;
                }
                break;
        }
    }
}

export { DebugDrawer };