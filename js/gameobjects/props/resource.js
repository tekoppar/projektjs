import { ExtendedProp, Rectangle, Vector2D, Vector4D, CanvasDrawer, OperationType, ItemProp, CMath, BoxCollision, AllCollisions, resourceSprites, CollisionHandler } from "../../internal.js";

/**
 * @class
 * @constructor
 * @extends ExtendedProp
 */
class Resource extends ExtendedProp {

    /**
     * @param {String} name 
     * @param {Vector2D} position 
     * @param {*} animations 
     * @param {String} canvasName 
     * @param {Number} drawIndex 
     * @param {Vector4D} blockingCollisionSize 
     * @param {String} resourceName 
     * @param {(Rectangle|Object)} secondStageFrame 
     */
    constructor(name, position, animations, canvasName, drawIndex = 0, blockingCollisionSize = new Vector4D(16, 16, 0, 0), resourceName = 'birchLog', secondStageFrame = new Rectangle(23, 18, 32, 32)) {
        super(name, position, animations, canvasName, drawIndex, blockingCollisionSize);
        this.isVisible = true;
        this.currentAnimation = undefined;
        this.shadow = undefined;
        this.life = 100;
        this.isSecondStage = false;
        this.resourceName = resourceName;

        if (secondStageFrame instanceof Rectangle)
            this.secondStageFrame = secondStageFrame;
        else
            this.secondStageFrame = new Rectangle(secondStageFrame.x, secondStageFrame.y, secondStageFrame.w, secondStageFrame.h);
    }

    GameBegin() {
        if (AllCollisions[this.canvasName] !== undefined) {
            let tempArr = AllCollisions[this.canvasName];
            super.GameBegin(
                tempArr.CloneObjects(),
                new Vector2D(0, 0),
                new Vector2D(CanvasDrawer.GCD.canvasAtlases[this.canvasName].width, CanvasDrawer.GCD.canvasAtlases[this.canvasName].height),
                new Vector2D(0, 0),
                true
            );
        }
    }

    Delete() {
        super.Delete();
        this.currentAnimation = undefined;

        this.SpawnResources();
    }

    SpawnResources() {
        let resourcePosition = this.BoxCollision.GetCenterPosition().Clone();
        let resourceCount = CMath.RandomInt(1, 3);

        for (let i = 0; i < resourceCount; ++i) {
            let newResource = new ItemProp(
                this.resourceName,
                new Vector2D(resourcePosition.x + CMath.RandomInt(-50, 50), resourcePosition.y + CMath.RandomInt(-50, 50)),
                resourceSprites[this.resourceName].animation.Clone(),
                resourceSprites[this.resourceName].atlas
            );
            newResource.GameBegin();
            CanvasDrawer.GCD.AddClearOperation(newResource.drawingOperation.drawingCanvas, newResource.BoxCollision.GetBoundingBox().Clone());
        }
    }

    SecondStage() {
        CanvasDrawer.GCD.AddClearOperation(this.drawingOperation.drawingCanvas, this.BoxCollision.GetBoundingBox().Clone());
        this.SpawnResources();

        this.life = 250;
        this.isSecondStage = true;

        let secondStagePosition = this.BlockingCollision.position.Clone();
        secondStagePosition.y -= resourceSprites[this.resourceName].collision.x;
        secondStagePosition.x -= resourceSprites[this.resourceName].collision.y;
        secondStagePosition.Ceil();

        this.BoxCollision.Delete();

        if (resourceSprites[this.resourceName].collision.w === 0 && resourceSprites[this.resourceName].collision.h === 0) {
            this.BlockingCollision.Delete();
            this.BlockingCollision = undefined;
        } else {
            this.BlockingCollision.size.y = resourceSprites[this.resourceName].collision.w;
            this.BlockingCollision.boundingBox.h = resourceSprites[this.resourceName].collision.h;
            this.BlockingCollision.position.y += resourceSprites[this.resourceName].collision.h;
            this.BlockingCollision.UpdateCollision();
        }

        this.BoxCollision = new BoxCollision(
            secondStagePosition.Clone(),
            new Vector2D(this.secondStageFrame.w, this.secondStageFrame.h),
            false,
            this,
            true
        );

        CollisionHandler.GCH.RemoveFromQuadTree(this.BoxCollision);
        CollisionHandler.GCH.UpdateQuadTree(this.BoxCollision);

        this.shadow.Delete();
        this.drawingOperation.Delete();
        this.drawingOperation = undefined;

        window.requestAnimationFrame(() => this.CreateSecondStage());
    }

    CreateSecondStage() {
        if (this.drawingOperation !== undefined) {
            window.requestAnimationFrame(() => this.CreateSecondStage());
            return;
        }

        this.CreateDrawOperation(
            this.secondStageFrame.Clone(),
            this.BoxCollision.position.Clone(),
            false,
            CanvasDrawer.GCD.canvasAtlases['terrain'].canvas,
            OperationType.gameObjects
        );

        if (this.BlockingCollision === undefined) {
            this.drawingOperation.collisionSize = new Vector2D(resourceSprites[this.resourceName].collision.w, 1);
            this.BoxCollision.overlapEvents = false;
            CanvasDrawer.GCD.AddClearOperation(this.drawingOperation.drawingCanvas, this.BoxCollision.GetBoundingBox().Clone());
        }
    }

    OnHit(damage, source) {
        this.life -= damage;
        super.OnHit(source);

        console.log(this.life);

        if (this.life <= 0 && this.isSecondStage === false) {
            this.SecondStage();
        } else if (this.life <= 0 && this.isSecondStage === true) {
            this.Delete();
        }
    }
}

export { Resource };