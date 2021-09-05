/* import { Vector2D, Vector4D } from '../classes/vectors.js';
import { Cobject } from '../classes/baseClasses/object.js';
import { BoxCollision, CollisionHandler, PolygonCollision } from './collision/collision.js';
import { CanvasDrawer } from '../drawers/canvas/customDrawer.js';
import { DrawingOperation, OperationType } from '../drawers/canvas/operation.js';
import { MasterObject } from '../classes/masterObject.js';
import { Tile } from '../drawers/tiles/tile.js'; */

import { Vector2D, Cobject, CMath, BoxCollision, CollisionHandler, PolygonCollision, CanvasDrawer, DrawingOperation, OperationType, ObjectsHasBeenInitialized, Tile, Rectangle } from '../internal.js'

class Pawn extends Cobject {
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
    }

    Delete() {
        if (this.BoxCollision !== undefined)
            this.BoxCollision.Delete();

        super.Delete();
        this.canvas = undefined;
        this.BoxCollision = undefined;

        if (this.drawingOperation !== undefined) {
            this.drawingOperation.shouldDelete = true;
            this.drawingOperation = undefined;
        }
    }

    GameBegin() {
        super.GameBegin();
    }

    FixedUpdate() {
        super.FixedUpdate();

        if (this.enableCollision === true)
            this.CheckCollision(this.GetPosition());
    }

    NeedsRedraw(position) {
        if (this.drawingOperation !== undefined && this.drawingOperation.DrawState() === false) {
            this.FlagDrawingUpdate(position);
            /*let overlaps = CollisionHandler.GCH.GetOverlaps(this.BoxCollision, false, { Intersect: false, Overlaps: true, Inside: false });

            for (let i = 0; i < overlaps.length; i++) {
                if (overlaps[i].collisionOwner !== undefined && overlaps[i].collisionOwner !== null && overlaps[i].collisionOwner !== false && overlaps[i].collisionOwner.drawingOperation !== undefined) {
                    let rectA = this.BoxCollision.GetBoundingBox().Clone(),
                        rectB = overlaps[i].GetBoundingBox().Clone();

                    if (rectA !== undefined && rectB !== undefined) {
                        let intersection = rectA.GetIntersection(rectB);

                        if (intersection !== undefined) {
                            //overlaps[i].collisionOwner.drawingOperation.AddUpdateRect(intersection);
                            //CanvasDrawer.GCD.AddDebugRectOperation(intersection, 0.1, CMath.CSS_COLOR_NAMES[20]);
                        }
                    }

                    //overlaps[i].collisionOwner.FlagDrawingUpdate(overlaps[i].collisionOwner.GetPosition());
                }
            }*/
        }
    }

    FlagDrawingUpdate(position) {
        if (this.drawingOperation !== undefined && this.drawingOperation.DrawState() === false) {
            this.drawingOperation.Update(position);
            document.getElementById('gameobject-draw-debug').innerHTML += this.name + "\r\n";
        }
    }

    CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.GameObject) {
        if (this.drawingOperation === undefined) {
            this.size.x = frame.w;
            this.size.y = frame.h;
            this.drawingOperation = new DrawingOperation(
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
                operationType
            );

            CanvasDrawer.GCD.AddDrawOperation(this.drawingOperation, operationType);
        } else {
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
            this.drawingOperation.tile.clear = clear;
            this.drawingOperation.tile.atlas = this.canvasName;
            this.drawingOperation.tile.drawIndex = this.drawIndex;
            this.drawingOperation.targetCanvas = canvas;
            this.drawingOperation.Update();
        }

        this.NeedsRedraw(position);
    }
}

class GameObject extends Pawn {
    constructor(canvasName, position, enableCollision = false, drawIndex = 0) {
        super(canvasName, position, enableCollision, drawIndex);
        this.Direction = new Vector2D(0, 0);
        this.Velocity = new Vector2D(0, 0);
        this.MovementSpeed = new Vector2D(-1, -1);
        this.BlockingCollision = undefined;

        this.LoadAtlas();
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

        if (CanvasDrawer.GCD.canvasAtlases[this.canvasName] !== undefined) {
            this.canvas = CanvasDrawer.GCD.canvasAtlases[this.canvasName].canvas;
        }
    }

    FixedUpdate() {
        super.FixedUpdate();
    }

    LoadAtlas() {
        if (ObjectsHasBeenInitialized === false) {
            window.requestAnimationFrame(() => this.LoadAtlas(this.canvasName));
        } else
            CanvasDrawer.GCD.LoadNewSpriteAtlas(this.spriteSheet, 32, this.canvasName);
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

    CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.GameObject) {
        super.CreateDrawOperation(frame, position, clear, canvas, operationType);
    }

    CreateDrawOperations(frames, position, clear, canvas, operationType = OperationType.GameObject, tileOffsets = [new Vector2D(0, 0)]) {
        if (this.drawingOperations.length < 1) {
            for (let i = 0; i < frames.length; i++) {
                this.drawingOperations.push(
                    new DrawingOperation(
                        new Tile(
                            position,
                            new Vector2D(frames[i].x, frames[i].y),
                            new Vector2D(frames[i].w, frames[i].h),
                            clear,
                            this.canvasName,
                            this.drawIndex
                        ),
                        CanvasDrawer.GCD.frameBuffer,//document.getElementById('sprite-objects-canvas'),
                        canvas
                    )
                );
            }
            CanvasDrawer.GCD.AddDrawOperations(this.drawingOperations, operationType);
        } else {
            for (let i = 0; i < frames.length; i++) {
                this.drawingOperations[i].tile.position = position;

                if (frames[i] !== undefined && frames[i] !== null) {
                    this.drawingOperations[i].tile.tilePosition = new Vector2D(frames[i].x, frames[i].y);
                    this.drawingOperations[i].tile.size = new Vector2D(frames[i].w, frames[i].h);
                }
                this.drawingOperations[i].tile.clear = clear;
                this.drawingOperations[i].tile.atlas = this.canvasName;
                this.drawingOperations[i].tile.drawIndex = this.drawIndex;
                this.drawingOperations[i].targetCanvas = canvas;
                this.drawingOperations[i].Update();
            }
        }

        this.NeedsRedraw(this.GetPosition());
    }
}

class Shadow extends Pawn {
    constructor(parent, canvasName, position) {
        super(canvasName, position, false, 0);
        this.size = new Vector2D(1, 1);
        this.currentAnimation = undefined;
        this.name = 'shadow' + this.UID;
        this.parent = parent;
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

        if (CanvasDrawer.GCD.canvasAtlases[this.canvasName] !== undefined) {
            this.canvas = CanvasDrawer.GCD.canvasAtlases[this.canvasName].canvas;
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
        document.getElementById('gameobject-draw-debug').innerHTML += frame.w + ' - ' + frame.h + '\r\n';
        super.CreateDrawOperation(frame, position, clear, canvas, operationType);
    }
}

export { Pawn, GameObject, Shadow };