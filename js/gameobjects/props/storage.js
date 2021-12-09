import {
    ExtendedProp, Rectangle, Vector2D, Vector4D, CustomEventHandler, CanvasDrawer, OperationType, ItemProp,
    AtlasController, CMath, BoxCollision, Inventory, AllCollisions, resourceSprites, CollisionHandler, BWDrawingType, CAnimation
} from "../../internal.js";

/**
 * @class
 * @constructor
 * @extends ExtendedProp
 */
class Storage extends ExtendedProp {

    /**
     * @param {string} name 
     * @param {Vector2D} position 
     * @param {*} animations 
     * @param {string} canvasName 
     * @param {Number} drawIndex 
     * @param {Vector4D} blockingCollisionSize 
     */
    constructor(name, position, animations, canvasName, drawIndex = 0, blockingCollisionSize = new Vector4D(16, 16, 0, 0)) {
        super(name, position, animations, canvasName, drawIndex, blockingCollisionSize);

        /** @type {boolean} */
        this.isVisible = true;

        /** @type {CAnimation} */
        this.currentAnimation = undefined;

        this.shadow = undefined;

        /** @type {Number} */
        this.life = 100;

        /** @type {Inventory} */
        this.inventory = new Inventory(this);
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'use':
                if (this.BoxCollision.GetRealCenterPosition().CheckInRange(key.BoxCollision.GetRealCenterPosition().Clone(), 75.0) === true) {
                    this.inventory.ShowInventory();
                    key.inventory.ShowInventory();
                    this.gameObjectUsing = this.isVisible === false ? key : undefined;
                }
                break;
        }
    }

    GameBegin(createShadow = false) {
        CustomEventHandler.AddListener(this);
        this.inventory.SetupInventory();

        if (AllCollisions[this.canvasName] !== undefined) {
            let tempArr = AllCollisions[this.canvasName];
            super.GameBegin(
                tempArr.CloneObjects(),
                new Vector2D(0, 0),
                new Vector2D(AtlasController.GetAtlas(this.canvasName).width, AtlasController.GetAtlas(this.canvasName).height),
                new Vector2D(0, 0),
                createShadow
            );
        }
    }

    Delete() {
        super.Delete();
        this.currentAnimation = undefined;
    }

    OnHit(damage, source) {
        this.life -= damage;
        super.OnHit(source);

        if (this.life <= 0) {
            this.Delete();
        }
    }

    CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.gameObjects, canvasObject = undefined) {
        super.CreateDrawOperation(frame, position, clear, canvas, operationType, AtlasController.GetAtlas(canvas.id).canvasObject);

        if (this.drawingOperation.shadowOperation !== undefined) {
            this.drawingOperation.shadowOperation.drawType = BWDrawingType.Front;
            this.drawingOperation.shadowOperation.UpdateShadow(this.drawingOperation.tile);
        }
    }

    SaveToFile() {
        return "new Storage('" + this.name + "', " + this.position.SaveToFile() + '), ' + this.animations + ", '" + this.canvasName + "', " + this.drawIndex + ', ' + this.blockingCollisionSize.SaveToFile() + "))";
    }
}

export { Storage };