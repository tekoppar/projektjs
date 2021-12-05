import { Item, AllAnimationsList, Plant, AllPlantData, CollisionHandler, CustomEventHandler, GUI, Vector2D, CanvasDrawer } from '../../../internal.js';

/**
 * @class
 * @constructor
 * @extends Item
 */
class Seed extends Item {

    /**
     * Creates a new Seed
     * @param {string} name 
     * @param {Number} amount 
     * @param {*} seedType 
     */
    constructor(name, amount, seedType) {
        super(name, amount);
        this.SeedType = seedType;
    }

    UseItem(ownerCollision) {
        let overlap = CollisionHandler.GCH.GetOverlap(ownerCollision);
        let a = ownerCollision.collisionOwner.BoxCollision.GetCenterPosition();
        a.SnapToGridF(32);
        let b = ownerCollision.GetPosition().Clone();
        b.SnapToGridF(32);

        if (overlap === false && a.CheckInRange(b, 96)) {

            let checkPos = ownerCollision.GetPosition().Clone();
            checkPos.ToGrid(32);
            let tiles = CanvasDrawer.GCD.GetTileAtPosition(checkPos, false);

            if (tiles !== undefined) {
                for (let tile of tiles) {
                    if (tile.tile.tileSet !== 'soilTiled' && tile.tile.tileSet !== 'soilTiledCorner')
                        return
                }

                let plantName = this.name.replace('Seed', '');
                b.y -= 32;
                let newPlant = new Plant("/content/sprites/crops.png", 'crops', plantName, b, AllAnimationsList.plantAnimations[plantName], AllPlantData[plantName]);
                CustomEventHandler.AddListener(newPlant);

                super.UseItem(ownerCollision);
            }
        }
    }

    GetHTMLInformation() {
        super.GetHTMLInformation();
        let sprite = GUI.CreateSprite(this);
        sprite.style.alignSelf = 'center';
        return [sprite, GUI.CreateParagraph(this.GetRealName()), GUI.CreateParagraph('Amount: ' + this.amount), GUI.CreateParagraph('Cost: ' + this.value)];
    }
}

export { Seed };