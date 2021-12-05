import { Resource, Rectangle, Vector4D, Vector2D, Shadow2D, OperationType, AtlasController, BWDrawingType, ShadowCanvasObject } from '../../../internal.js';

/**
 * @class
 * @constructor
 * @extends Resource
 */
class Tree extends Resource {

    /**
     * Creates a new Tree
     * @param {string} name 
     * @param {Vector2D} position 
     * @param {*} animations 
     * @param {string} canvasName 
     * @param {Number} drawIndex 
     * @param {Vector4D} blockingCollisionSize 
     * @param {string} resourceName 
     * @param {Rectangle} secondStageFrame 
     */
    constructor(name, position, animations, canvasName, drawIndex = 0, blockingCollisionSize = new Vector4D(16, 16, 0, 0), resourceName = 'birchLog', secondStageFrame = new Rectangle(23, 18, 32, 32)) {
        super(name, position, animations, canvasName, drawIndex, blockingCollisionSize, resourceName, secondStageFrame);
        this.isVisible = true;
        this.currentAnimation = undefined;
        this.shadow = undefined;
        this.life = 100;
        this.realtimeShadow = undefined;
    }

    GameBegin() {
        super.GameBegin(false);
    }

    Delete() {
        super.Delete();

        if (this.realtimeShadow !== undefined)
            this.realtimeShadow.Delete();
    }

    SecondStage() {
        super.SecondStage();
    }

    CreateSecondStage() {
        super.CreateSecondStage();
    }

    OnHit(damage, source) {
        super.OnHit(damage, source);
    }

    SaveToFile() {
        return "new Tree('" + this.name + "', new Vector2D(" + this.position.x + ', ' + this.position.y + '), ' + this.animations + ", '" + this.canvasName + "', " + this.drawIndex + ', new Vector4D(' + this.blockingCollisionSize.x + ', ' + this.blockingCollisionSize.y + ', ' + this.blockingCollisionSize.z + ', ' + this.blockingCollisionSize.a + "), '"  + this.resourceName + "', new Rectangle(" + this.secondStageFrame.x + ', ' + this.secondStageFrame.y + ', ' + this.secondStageFrame.w + ', ' + this.secondStageFrame.h + '))';
    }

    CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.gameObjects) {
        super.CreateDrawOperation(frame, position, clear, canvas, operationType, AtlasController.GetAtlas(canvas.id).canvasObject);

        if (this.drawingOperation.shadowOperation !== undefined) {
            this.drawingOperation.shadowOperation.drawType = BWDrawingType.Front;
            this.drawingOperation.shadowOperation.UpdateShadow(this.drawingOperation.tile);

            this.realtimeShadow = new Shadow2D(this, this.canvasName, this.GetPosition(), new Vector2D(frame.w, frame.h), this.drawingOperation.tile);
            this.realtimeShadow.GameBegin();

            this.realtimeShadow.SetPosition(new Vector2D(this.position.x + (this.realtimeShadow.shadowObject.GetSize().x - this.size.x) / 2, this.position.y));
            this.realtimeShadow.AddShadow(this.drawingOperation.tile);
            this.realtimeShadow.UpdateShadow(this.drawingOperation.tile);

            /*this.drawingOperation.shadowOperation.realTimeShadow = new ShadowCanvasObject();
            this.drawingOperation.shadowOperation.realTimeShadow.GenerateRealTimeShadow(this.drawingOperation.GetSize(), this.drawingOperation.tile);

            this.drawingOperation.shadowOperation.realTimeShadow.UpdateRealTimeShadow(this.name, this.position.Clone(), this.BoxCollision, this.drawingOperation.tile);*/
        }
    }
}

export { Tree };