import { Vector2D, ExtendedProp, AtlasController, Item, OperationType, Shadow2D, BWDrawingType, ShadowCanvasObject } from '../../internal.js';

/**
 * @class
 * @constructor
 * @extends ExtendedProp
 */
class ItemProp extends ExtendedProp {

    /**
     * Creates a new ItemProp
     * @param {string} name 
     * @param {Vector2D} position 
     * @param {*} animations 
     * @param {string} canvasName 
     * @param {Number} drawIndex 
     * @param {Item} item 
     */
    constructor(name, position, animations, canvasName, drawIndex = 0, item = undefined) {
        super(name, position, animations, canvasName, drawIndex);
        this.isVisible = true;
        this.currentAnimation = animations.Clone();
        this.shadow = undefined;
        this.life = 100;
        this.item = item;
        this.amount = item !== undefined ? item.GetAmount() : 0;
        this.realtimeShadow = undefined;
    }

    GameBegin() {
        super.GameBegin(undefined, this.GetPosition().Clone(), new Vector2D(32, 32), this.currentAnimation.GetFrame(), false);
    }

    Delete() {
        super.Delete();
        
        if (this.realtimeShadow !== undefined)
            this.realtimeShadow.Delete();
            
        this.item = undefined;
        this.currentAnimation = undefined;
    }

    OnHit(damage, source) {
        this.life -= damage;
        super.OnHit(source);

        if (this.life <= 0) {
            this.Delete();
        }
    }

    PickupItem(otherObject) {
        if (otherObject.inventory !== undefined) {
            this.isVisible = false;

            if (this.item !== undefined)
                otherObject.inventory.AddItem(this.item);
            else {
                otherObject.inventory.AddNewItem(`${this.name}`);
            }

            window.requestAnimationFrame(() => this.Delete());
        }
    }

    CEvent(eventType, otherObject) {
        switch (eventType) {
            case 'use':
                if (this.isVisible === true)
                    this.PickupItem(otherObject);
                break;
        }
    }

    CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.gameObjects, canvasObject = undefined) {
        super.CreateDrawOperation(frame, position, clear, canvas, operationType, AtlasController.GetAtlas(canvas.id).canvasObject);

        if (this.drawingOperation.shadowOperation !== undefined) {
            this.drawingOperation.shadowOperation.drawType = BWDrawingType.Front;
            this.drawingOperation.shadowOperation.UpdateShadow(this.drawingOperation.tile);

            this.realtimeShadow = new Shadow2D(this, this.canvasName, this.GetPosition(), new Vector2D(frame.w, frame.h), this.drawingOperation.tile);
            this.realtimeShadow.GameBegin();

            this.realtimeShadow.SetPosition(new Vector2D(this.position.x + (this.realtimeShadow.shadowObject.GetSize().x - this.size.x) / 2, this.position.y));
            this.realtimeShadow.AddShadow(this.drawingOperation.tile);
            this.realtimeShadow.UpdateShadow(this.drawingOperation.tile);
        }
    }
}

export { ItemProp };