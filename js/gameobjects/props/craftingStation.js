import {
    ExtendedProp, Vector2D, Vector4D, CustomEventHandler, OperationType,
    AtlasController, Crafting, AllCollisions, CraftingRecipe, BWDrawingType, CAnimation, CraftingRecipes
} from "../../internal.js";

/**
 * @class
 * @constructor
 * @extends ExtendedProp
 */
class CraftingStation extends ExtendedProp {

    /**
     * @param {string} name 
     * @param {Vector2D} position 
     * @param {*} animations 
     * @param {string} canvasName 
     * @param {string} recipeList
     * @param {Number} drawIndex 
     * @param {Vector4D} blockingCollisionSize 
     */
    constructor(name, position, animations, canvasName, recipeList, drawIndex = 0, blockingCollisionSize = new Vector4D(16, 16, 0, 0)) {
        super(name, position, animations, canvasName, drawIndex, blockingCollisionSize);

        /** @type {boolean} */
        this.isVisible = false;

        /** @type {CAnimation} */
        this.currentAnimation = undefined;

        this.shadow = undefined;

        /** @type {Number} */
        this.life = 100;

        this.recipeKey = recipeList

        /** @type {Crafting} */
        this.crafting = new Crafting(this, this.name, CraftingRecipes[recipeList]);
    }

    //@ts-ignore
    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'use':
                if (key !== undefined && key.inventory !== undefined && this.BoxCollision.GetRealCenterPosition().CheckInRange(key.BoxCollision.GetRealCenterPosition().Clone(), 75.0) === true) {
                    this.gameObjectUsing = this.isVisible === false ? key : undefined;
                    this.crafting.characterUser = key;
                    this.crafting.ShowCrafting();
                }
                break;
        }
    }

    GameBegin(createShadow = false) {
        CustomEventHandler.AddListener(this);
        this.crafting.SetupCrafting();

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

    //@ts-ignore
    CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.gameObjects, canvasObject = undefined) {
        super.CreateDrawOperation(frame, position, clear, canvas, operationType, AtlasController.GetAtlas(canvas.id).canvasObject);

        if (this.drawingOperation.shadowOperation !== undefined) {
            this.drawingOperation.shadowOperation.drawType = BWDrawingType.Front;
            this.drawingOperation.shadowOperation.UpdateShadow(this.drawingOperation.tile);
        }
    }

    SaveToFile() {
        return "new CraftingStation('" + this.name + "', " + this.position.SaveToFile() + ', ' + this.animations + ", '" + this.canvasName + "', '" + this.recipeKey + "', " + this.drawIndex + ', ' + this.blockingCollisionSize.SaveToFile() + ")";
    }
}

export { CraftingStation };