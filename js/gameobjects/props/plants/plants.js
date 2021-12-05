import { CMath, Prop, Item, CanvasDrawer, CanvasSprite, Rectangle, OperationType, Vector2D, CAnimation } from '../../../internal.js'

/**
 * @class
 * @constructor
 */
class PlantData {

    /**
     * Creates a new PlantData
     * @param {Number} growthSpeed 
     * @param {Number} regrowthSpeed 
     * @param {Object} gatherRange 
     * @param {CanvasSprite} plantIcon 
     */
    constructor(growthSpeed, regrowthSpeed, gatherRange = { low: 1, high: 4 }, plantIcon = new CanvasSprite(29, 10, 32, 32, 'fruitsveggies', true)) {
        /** @type {Number} */
        this.growthSpeed = growthSpeed;

        /** @type {Number} */
        this.growth = 0;

        /** @type {Number} */
        this.regrowthSpeed = regrowthSpeed;

        /** @type {{low: Number, high: Number}} */
        this.gatherRange = gatherRange;

        /** @type {boolean} */
        this.hasFinishedGrowing = false;

        /** @type {boolean} */
        this.hasBeenPicked = false;

        /** @type {CanvasSprite} */
        this.plantIcon = plantIcon;
    }

    Clone() {
        return new PlantData(this.growthSpeed, this.regrowthSpeed, this.gatherRange, this.plantIcon);
    }
}

const AllPlantData = {
    corn: new PlantData(60, 600, { low: 1, high: 4 }, new CanvasSprite(29, 10, 32, 32, 'fruitsveggies', true)),
    potato: new PlantData(700, 0, { low: 5, high: 15 }, new CanvasSprite(0, 0, 32, 32, 'fruitsveggies', true)),
    watermelon: new PlantData(1300, 900, { low: 1, high: 2 }, new CanvasSprite(22, 0, 32, 32, 'fruitsveggies', true)),
    pumpkin: new PlantData(1200, 800, { low: 1, high: 3 }, new CanvasSprite(28, 0, 32, 32, 'fruitsveggies', true)),
    bellpepperGreen: new PlantData(1250, 1000, { low: 1, high: 2 }, new CanvasSprite(12, 0, 32, 32, 'fruitsveggies', true)),
    bellpepperRed: new PlantData(1450, 1250, { low: 1, high: 2 }, new CanvasSprite(13, 0, 32, 32, 'fruitsveggies', true)),
    bellpepperOrange: new PlantData(1350, 1150, { low: 1, high: 2 }, new CanvasSprite(14, 0, 32, 32, 'fruitsveggies', true)),
    bellpepperYellow: new PlantData(900, 600, { low: 1, high: 2 }, new CanvasSprite(15, 0, 32, 32, 'fruitsveggies', true)),
    carrot: new PlantData(900, 0, { low: 5, high: 8 }, new CanvasSprite(24, 20, 32, 32, 'fruitsveggies', true)),
    parsnip: new PlantData(1700, 0, { low: 2, high: 3 }, new CanvasSprite(25, 20, 32, 32, 'fruitsveggies', true)),
    radish: new PlantData(1350, 0, { low: 4, high: 7 }, new CanvasSprite(18, 5, 32, 32, 'fruitsveggies', true)),
    beetroot: new PlantData(900, 0, { low: 1, high: 3 }, new CanvasSprite(16, 15, 32, 32, 'fruitsveggies', true)),
    garlic: new PlantData(2450, 0, { low: 1, high: 18 }, new CanvasSprite(23, 15, 32, 32, 'fruitsveggies', true)),
    onionYellow: new PlantData(800, 0, { low: 1, high: 5 }, new CanvasSprite(24, 15, 32, 32, 'fruitsveggies', true)),
    onionRed: new PlantData(800, 0, { low: 1, high: 5 }, new CanvasSprite(25, 15, 32, 32, 'fruitsveggies', true)),
    onionWhite: new PlantData(800, 0, { low: 1, high: 5 }, new CanvasSprite(26, 15, 32, 32, 'fruitsveggies', true)),
    onionGreen: new PlantData(800, 0, { low: 1, high: 5 }, new CanvasSprite(27, 15, 32, 32, 'fruitsveggies', true)),
    hotPepper: new PlantData(2200, 1800, { low: 1, high: 4 }, new CanvasSprite(11, 0, 32, 32, 'fruitsveggies', true)),
    chiliPepper: new PlantData(2000, 1900, { low: 3, high: 10 }, new CanvasSprite(19, 0, 32, 32, 'fruitsveggies', true)),
    lettuceIceberg: new PlantData(1500, 1200, { low: 1, high: 1 }, new CanvasSprite(11, 5, 32, 32, 'fruitsveggies', true)),
    cauliflower: new PlantData(1700, 1500, { low: 1, high: 1 }, new CanvasSprite(14, 5, 32, 32, 'fruitsveggies', true)),
    broccoli: new PlantData(2000, 1750, { low: 10, high: 25 }, new CanvasSprite(15, 5, 32, 32, 'fruitsveggies', true)),
}

/**
 * @class
 * @constructor
 * @extends Prop
 */
class Plant extends Prop {

    /**
     * Creates a new Plant
     * @param {string} spriteSheetName 
     * @param {string} name 
     * @param {Vector2D} position 
     * @param {*} animations 
     * @param {PlantData} plantData 
     * @param {Number} drawIndex 
     */
    constructor(spriteSheetName, name, position, animations, plantData, drawIndex = 0) {
        super(name, position, animations, spriteSheetName, drawIndex);

        /** @type {PlantData} */
        this.plantData = plantData.Clone();

        /** @type {CAnimation} */
        this.currentAnimation = this.animations.seed.Clone();

        this.currentAnimation.SetSpeed(this.plantData.growthSpeed);
        this.BoxCollision.size = this.currentAnimation.GetSize();
    }

    Delete() {
        super.Delete();
        this.currentAnimation = null;
        this.plantData = null;
    }

    FixedUpdate() {
        super.FixedUpdate();
    }

    CheckGrowth() {
        this.plantData.growthSpeed
    }

    GameBegin() {
        super.GameBegin();
        this.CreateDrawOperation(new Rectangle(this.GetPosition().x, this.GetPosition().y, this.currentAnimation.w, this.currentAnimation.h), this.GetPosition(), true, this.canvas, OperationType.gameObjects);
    }

    PlayAnimation() {
        if (this.currentAnimation !== null && this.currentAnimation !== undefined) {
            if (this.animations !== null && this.animations.grow !== undefined && this.currentAnimation.name === 'picked' && this.currentAnimation.animationFinished === true) {
                this.currentAnimation = this.animations.grow.Clone();
                this.currentAnimation.SetSpeed(this.plantData.growthSpeed);
            }

            if ((this.currentAnimation.name === 'grow' || this.currentAnimation.name === 'seed') && this.currentAnimation.animationFinished === true)
                this.plantData.hasFinishedGrowing = true;

            super.PlayAnimation();
        }
    }

    PlantGathered(otherObject) {
        if (this.plantData.hasFinishedGrowing === true && this.plantData.hasBeenPicked === false && this.BoxCollision.GetCenterPosition().CheckInRange(otherObject.BoxCollision.GetCenterPosition(), 32.0) === true) {
            let gatherAmount = CMath.RandomInt(this.plantData.gatherRange.low, this.plantData.gatherRange.high);
            
            otherObject.inventory.AddItem(new Item(this.name, gatherAmount));
            this.plantData.hasFinishedGrowing = false;
            this.plantData.hasBeenPicked = true;

            if (this.animations.picked !== undefined) {
                this.currentAnimation = this.animations.picked.Clone();
            } else if (this.animations.grow !== undefined) {
                this.currentAnimation = this.animations.grow.Clone();
                this.plantData.hasBeenPicked = false;
            }

            let frame = this.currentAnimation.GetFrame();
            this.CreateDrawOperation(frame, new Rectangle(this.GetPosition().x, this.GetPosition().y, 32, 32), true, this.canvas);
            this.currentAnimation.SetSpeed(this.plantData.growthSpeed);

            CanvasDrawer.GCD.UIDrawer.DrawUIElement(this.plantData.plantIcon, ' +' + gatherAmount, this.GetPosition());
            super.NeedsRedraw(this.GetPosition());
        }
    }

    CEvent(eventType, otherObject) {
        switch (eventType) {
            case 'use':
                this.PlantGathered(otherObject);
                break;
        }
    }
}

export { Plant, PlantData, AllPlantData };