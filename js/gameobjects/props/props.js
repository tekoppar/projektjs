import { GameObject, Vector2D, Vector4D, CanvasDrawer, OperationType, PolygonCollision, BoxCollision, Shadow, CAnimation } from '../../internal.js';

/**
 * @class
 * @constructor
 * @public
 * @extends GameObject
 */
class Prop extends GameObject {

    /**
     * Creates a new Prop
     * @param {String} name 
     * @param {Vector2D} position 
     * @param {*} animations 
     * @param {String} canvasName 
     * @param {Number} drawIndex 
     */
    constructor(name, position, animations, canvasName, drawIndex = 0) {
        super(canvasName, position, false, drawIndex);
        this.name = name;
        this.animations = animations;
        this.currentAnimation;
    }

    Delete() {
        super.Delete();
        this.animations = null;
        this.currentAnimation = null;
        this.name = null;
    }

    FixedUpdate() {
        if (this.currentAnimation !== undefined) {
            this.PlayAnimation();
        }
        super.FixedUpdate();
    }

    NeedsRedraw(position) {
        super.NeedsRedraw(position);
    }

    FlagDrawingUpdate(position) {
        super.FlagDrawingUpdate(position);
    }

    GameBegin() {
        super.GameBegin();
    }

    PlayAnimation() {
        if (this.currentAnimation !== undefined) {
            let frame = this.currentAnimation.GetFrame();

            if (frame !== null && frame !== undefined) {
                this.BoxCollision.size = this.currentAnimation.GetSize();
                this.BoxCollision.position = this.GetPosition();

                this.BoxCollision.boundingBox.w = frame.w;
                this.BoxCollision.boundingBox.h = frame.h;

                this.CreateDrawOperation(frame, this.GetPosition(), true, this.canvas, OperationType.gameObjects);
                this.drawingOperation.Update(this.GetPosition());
                this.NeedsRedraw(this.BoxCollision.boundingBox);
                this.BoxCollision.UpdateCollision();

                if (this.BlockingCollision !== undefined) {
                    this.BlockingCollision.UpdateCollision();
                }
            }
        }
    }
}

/**
 * @class
 * @constructor
 * @public
 * @extends Prop
 */
class ExtendedProp extends Prop {

    /**
     * Creates a new ExtendedProp
     * @param {String} name 
     * @param {Vector2D} position 
     * @param {*} animations 
     * @param {String} canvasName 
     * @param {Number} drawIndex 
     * @param {(Vector4D|Object)} blockingCollisionSize 
     */
    constructor(name, position, animations, canvasName, drawIndex = 0, blockingCollisionSize = new Vector4D(16, 16, 0, 0)) {
        super(name, position, animations, canvasName, drawIndex);
        this.isVisible = true;
        this.currentAnimation = undefined;

        if (blockingCollisionSize instanceof Vector4D)
            this.blockingCollisionSize = blockingCollisionSize;
        else
            this.blockingCollisionSize = new Vector4D(blockingCollisionSize.x, blockingCollisionSize.y, blockingCollisionSize.w, blockingCollisionSize.h);

        if (animations instanceof CAnimation)
            this.currentAnimation = animations.Clone();

        this.shadow = undefined;
    }

    Delete() {
        super.Delete();

        if (this.shadow !== undefined) {
            this.shadow.Delete();
            this.shadow = undefined;
        }
        this.currentAnimation = undefined;
    }

    GameBegin(polygonCollision = undefined, position = new Vector2D(0, 0), size = new Vector2D(0, 0), tilePosition = new Vector2D(0, 0), createShadow = false) {
        super.GameBegin();

        if (polygonCollision === undefined && this.currentAnimation !== undefined) {
            position.x = this.currentAnimation.start.x;
            position.y = this.currentAnimation.start.y;
            size.x = this.currentAnimation.w;
            size.y = this.currentAnimation.h;
        }

        this.CreateDrawOperation(
            { x: tilePosition.x, y: tilePosition.y, w: size.x, h: size.y },
            this.GetPosition(),
            false,
            CanvasDrawer.GCD.canvasAtlases[this.canvasName].canvas,
            OperationType.gameObjects
        );

        this.BoxCollision.size = size.Clone();
        this.drawingOperation.collisionSize = size;

        if (polygonCollision !== undefined) {
            this.NewCollision(new PolygonCollision(
                this.GetPosition(),
                this.size.Clone(),
                polygonCollision,
                false,
                this,
                true
            ));
        } else if (this.currentAnimation !== undefined) {
            this.NewCollision(new BoxCollision(
                this.GetPosition(),
                this.size.Clone(),
                false,
                this,
                true
            ));
        }

        this.BlockingCollision = new BoxCollision(this.BoxCollision.position.Clone(), this.blockingCollisionSize.Clone(), true, this, true);
        this.BlockingCollision.position = this.position.Clone(); //this.BoxCollision.GetRealCenterPosition().Clone();
        this.BlockingCollision.position.x -= this.BlockingCollision.size.x * 0.5 - this.blockingCollisionSize.z;
        this.BlockingCollision.position.y -= this.BlockingCollision.size.y - this.blockingCollisionSize.a;
        //this.BlockingCollision.position.Sub({ x: this.BlockingCollision.size.x / 2 + this.blockingCollisionSize.z, y: this.BlockingCollision.size.y + this.blockingCollisionSize.a });

        this.BlockingCollision.UpdateCollision();

        if (createShadow) {
            this.shadow = new Shadow(this, this.name + 'Shadow', this.position.Clone());// new Vector2D(this.BoxCollision.position.x, this.BoxCollision.GetCenterTilePosition().y + size.y + 1));
            this.shadow.GameBegin();
        }
    }

    PlayAnimation() {
        super.PlayAnimation();
    }

    FixedUpdate() {
        super.FixedUpdate();
    }

    NeedsRedraw(position) {
        super.NeedsRedraw(position);

        //if (this.shadow !== undefined)
            //this.shadow.NeedsRedraw(position);
    }

    FlagDrawingUpdate(position) {
        super.FlagDrawingUpdate(position);

        if (this.shadow !== undefined)
            this.shadow.FlagDrawingUpdate(position.Clone());
    }
}

export { Prop, ExtendedProp };