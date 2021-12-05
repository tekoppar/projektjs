import { Resource, Rectangle, Vector4D, Vector2D } from '../../../internal.js';

/**
 * @class
 * @constructor
 * @extends Resource
 */
class Rock extends Resource {

    /**
     * Creates a new Rock
     * @param {string} name 
     * @param {Vector2D} position 
     * @param {*} animations 
     * @param {string} canvasName 
     * @param {Number} drawIndex 
     * @param {Vector4D} blockingCollisionSize 
     * @param {string} resourceName 
     * @param {Rectangle} secondStageFrame 
     */
    constructor(name, position, animations, canvasName, drawIndex = 0, blockingCollisionSize = new Vector4D(16, 16, 0, 0), resourceName = 'stonePiece', secondStageFrame = new Rectangle(27, 25, 64, 32)) {
        super(name, position, animations, canvasName, drawIndex, blockingCollisionSize, resourceName, secondStageFrame);
        this.isVisible = true;
        this.currentAnimation = undefined;
        this.shadow = undefined;
        this.life = 100;
    }

    GameBegin() {
        super.GameBegin();
    }

    Delete() {
        super.Delete();
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
        return "new Rock('" + this.name + "', new Vector2D(" + this.position.x + ', ' + this.position.y + '), ' + this.animations + ", '" + this.canvasName + "', " + this.drawIndex + ', new Vector4D(' + this.blockingCollisionSize.x + ', ' + this.blockingCollisionSize.y + ', ' + this.blockingCollisionSize.z + ', ' + this.blockingCollisionSize.a + "), '"  + this.resourceName + "', new Rectangle(" + this.secondStageFrame.x + ', ' + this.secondStageFrame.y + ', ' + this.secondStageFrame.w + ', ' + this.secondStageFrame.h + '))';
    }
}

export { Rock };