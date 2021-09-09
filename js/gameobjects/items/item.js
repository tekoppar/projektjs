import { Cobject, ItemStats, Vector2D, inventoryItemIcons, CustomEventHandler, CollisionHandler, CanvasDrawer, Tile, TileType, TileF, TileLUT, ItemValues } from '../../internal.js';

let stackableItems = {};

//products
Object.assign(stackableItems, {
    shovel: false,
    axe: false,
    hoe: false,
});

class Item extends Cobject {
    constructor(name, amount = 0) {
        super();
        this.name = name;
        this.amount = amount;
        this.sprite = inventoryItemIcons[name].sprite;
        this.atlas = inventoryItemIcons[name].atlas;
        this.url = inventoryItemIcons[name].url;
        this.isUsableItem = this.amount > 0 ? true : false;
        this.isStackable = stackableItems[this.name] === undefined ? true : stackableItems[this.name];
        this.value = ItemValues[this.name] !== undefined ? ItemValues[this.name] : 0;
        this.inventory;
    }

    Delete() {
        super.Delete();
    }

    GetRealName() {
        let realName = this.name.replace(/([A-Z])/g, ' $1');
        return realName.charAt(0).toUpperCase() + realName.slice(1, realName.length);
    }

    AddAmount(value) {
        this.amount += Number(value);
    }

    RemoveAmount(value) {
        this.amount -= Number(value);
    }

    HasAmount(amount) {
        return this.amount >= amount;
    }

    GetAmount() {
        if (this.amount < 1000)
            return this.amount;
        else if (this.amount > 1000 && this.amount < 1000000)
            return Math.floor(this.amount / 1000) + 'k';
        else if (this.amount > 1000000 && this.amount < 1000000000)
            return Math.floor(this.amount / 1000 / 1000) + 'm';
        else
            return Math.floor(this.amount / 1000 / 1000 / 1000) + 'b';
    }

    UseItem(ownerCollision) {
        this.RemoveAmount(1);
        this.inventory.didInventoryChange = true;

        if (this.amount <= 0 && this.isUsableItem === true) {
            this.inventory.RemoveItem(this);
            this.Delete();
        }
    }

    GetHTMLInformation() {

    }
}

class UsableItem extends Item {
    constructor(name, amount) {
        super(name, amount);
        this.durability = ItemStats[this.name].durability;
    }

    Delete() {
        this.inventory.RemoveItem(this);
        super.Delete();
    }

    GetRealName() {
        return super.GetRealName();
    }

    AddAmount(value) {
        super.AddAmount(value);
    }

    RemoveAmount(value) {
        super.RemoveAmount(value);
    }

    HasAmount(amount) {
       return super.HasAmount(amount);
    }

    GetAmount() {
        return super.GetAmount();
    }

    Durability() {
        this.durability--;

        if (this.durability <= 0) {
            this.Delete();
        }
    }

    UseItem(ownerCollision) {
        super.UseItem(ownerCollision);
    }
}

class Hoe extends UsableItem {
    constructor(name, amount) {
        super(name, amount);
    }

    UseItem(ownerCollision) {
        let overlap = CollisionHandler.GCH.GetOverlap(ownerCollision);

        if (overlap !== false) {
            if (overlap.collisionOwner !== undefined && overlap.collisionOwner.plantData !== undefined && ownerCollision.collisionOwner.BoxCollision.CheckInRealRange(overlap, 112)) {
                overlap.collisionOwner.Delete();
            }
        }

        if (ownerCollision.CheckInRealRange(ownerCollision.collisionOwner.BoxCollision, 112)) {
            let pos = ownerCollision.position.Clone();
            pos.Div(new Vector2D(32, 32));
            pos.Floor();
            let operations = CanvasDrawer.GCD.GetTileAtPosition(pos, false);

            for (let i = 0; i < operations.length; i++) {
                if (operations[i].tile.tileType === TileType.Ground) {
                    TileF.PaintTile(new Tile(new Vector2D(0, 0), new Vector2D(6, 18), new Vector2D(32, 32), TileLUT.terrain[18][6].transparent, 'terrain'), pos);
                    operations[i].tile.ChangeSprite(new Tile(new Vector2D(0, 0), new Vector2D(6, 18), new Vector2D(32, 32), TileLUT.terrain[18][6].transparent, 'terrain'));
                    CanvasDrawer.UpdateTerrainOperation(operations[i]);
                    this.Durability();
                }
            }
        }
        CustomEventHandler.NewCustomEvent(this.name, this);
        super.UseItem(ownerCollision);
    }
}

class Shovel extends UsableItem {
    constructor(name, amount) {
        super(name, amount);
    }

    UseItem(ownerCollision) {
        let overlap = CollisionHandler.GCH.GetOverlap(ownerCollision);

        if (overlap !== false) {
            console.log('shovelOverlap');
        }
        CustomEventHandler.NewCustomEvent(this.name, this);
        super.UseItem(ownerCollision);
    }
}

class Axe extends UsableItem {
    constructor(name, amount) {
        super(name, amount);
    }

    UseItem(ownerCollision) {
        let overlap = CollisionHandler.GCH.GetOverlap(ownerCollision);

        if (overlap !== undefined && overlap !== false && ownerCollision.DoOverlap(overlap.collisionOwner.BlockingCollision, true)) { // ownerCollision.CheckInRealRange(ownerCollision.collisionOwner.BoxCollision, 112)) {
            let objPrototype = Object.getPrototypeOf(overlap.collisionOwner);
            if (objPrototype.constructor.name === 'Tree') {
                overlap.OnHit(20, ownerCollision);
                this.Durability();
            }
        }
        CustomEventHandler.NewCustomEvent(this.name, this);
        super.UseItem(ownerCollision);
    }
}

class Pickaxe extends UsableItem {
    constructor(name, amount) {
        super(name, amount);
    }

    UseItem(ownerCollision) {
        let overlap = CollisionHandler.GCH.GetOverlapByClass(ownerCollision, 'Rock');

        if (overlap !== undefined && overlap !== false && ownerCollision.DoOverlap(overlap.collisionOwner.BlockingCollision, true)) { // ownerCollision.CheckInRealRange(ownerCollision.collisionOwner.BoxCollision, 112)) {
            overlap.OnHit(20, ownerCollision);
            this.Durability();
        }
        CustomEventHandler.NewCustomEvent(this.name, this);
        super.UseItem(ownerCollision);
    }
}

let ItemPrototypeList = {};
ItemPrototypeList.pickaxe = Pickaxe.prototype.constructor;
ItemPrototypeList.axe = Axe.prototype.constructor;
ItemPrototypeList.shovel = Shovel.prototype.constructor;
ItemPrototypeList.hoe = Hoe.prototype.constructor;

export { Item, UsableItem, Shovel, Hoe, Axe, Pickaxe, ItemPrototypeList };