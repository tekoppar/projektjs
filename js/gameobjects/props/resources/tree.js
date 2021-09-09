import { Resource, Rectangle, Vector4D } from '../../../internal.js';

class Tree extends Resource {
    constructor(name, position, animations, canvasName, drawIndex = 0, blockingCollisionSize = new Vector4D(16, 16, 0, 0), resourceName = 'birchLog', secondStageFrame = new Rectangle(23, 18, 32, 32)) {
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
}

export { Tree };