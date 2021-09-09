import { Cobject, Item, Shovel, Hoe, InputHandler, GameToolbar, GUI, CanvasDrawer, Vector2D, Vector4D, ItemProp, CAnimation, AnimationType, CMath, MasterObject, ItemPrototypeList, Dictionary } from '../../internal.js';

class InventorySlot {
    constructor(slot, item) {
        this.slot = slot;
        this.item = item;
    }
}

class Inventory extends Cobject {
    constructor(owner) {
        super();
        this.inventory = {};
        this.characterOwner = owner;
        this.isVisible = false;
        this.inventoryHTML;
        this.inventoryHTMLList;
        this.inventoryHTMLValue;
        this.didInventoryChange = false;
        this.inventorySetupDone = false;
        this.selectedItem = undefined;
        this.moneyAmount = 0;
        this.inventoryDictionary = new Dictionary('name');
    }

    SetupInventory() {
        if (document.getElementById('inventory-panel') !== null) {
            this.inventoryHTML = GUI.CreateContainer();

            let template = document.getElementById('inventory-panel');
            let clone = template.content.cloneNode(true);
            this.inventoryHTMLList = clone.querySelector('div.panel-middle');
            this.inventoryHTMLList.addEventListener('click', this);

            this.inventoryHTML.setAttribute('droppable', true);
            this.inventoryHTML.addEventListener('drop', this);
            this.inventoryHTML.addEventListener('dragover', this);
            window.addEventListener('dragend', this);
            this.inventoryHTMLValue = clone.querySelector('input.inventory-input-value');

            this.inventoryHTML.appendChild(clone);
            document.getElementById('game-gui').appendChild(this.inventoryHTML);

            InputHandler.GIH.AddListener(this);
            this.inventorySetupDone = true;
        } else
            window.requestAnimationFrame(() => this.SetupInventory());
    }

    HasMoney(amount) {
        return this.moneyAmount !== 0 && this.moneyAmount >= amount;
    }

    HasItemAmount(name, amount) {
        let found = this.inventoryDictionary.GetValueByProperty(name, 'name');
        if (found !== undefined && found.HasAmount(amount)) {
            return true;
        } else
            return false;
    }

    GetItemAmount(name) {
        let found = this.inventoryDictionary.GetValueByProperty(name, 'name');
        if (found !== undefined) {
            return found.GetAmount();
        } else
            return 0;
    }

    SubtractMoney(amount) {
        this.moneyAmount -= amount;

        if (this.inventoryHTMLValue !== undefined)
            this.inventoryHTMLValue.value = this.moneyAmount;
    }

    AddMoney(amount) {
        this.moneyAmount += amount;

        if (this.inventoryHTMLValue !== undefined)
            this.inventoryHTMLValue.value = this.moneyAmount;
    }

    AddItem(item) {
        let found = this.inventoryDictionary.GetValueByProperty(item.name, 'name');
        if (found !== undefined) {
            if (found.isStackable === true) {
                found.AddAmount(Number(item.amount));
            } else {
                this.inventoryDictionary.AddValue(item, 'UID');
            }
        } else {
            item.inventory = this;
            this.inventoryDictionary.AddValue(item, 'UID');
        }

        this.didInventoryChange = true;
    }

    AddNewItem(name, amount = 0) {
        let found = this.inventoryDictionary.GetValueByProperty(name, 'name');
        if (found === undefined) {
            let newItem = undefined;

            if (ItemPrototypeList[name] !== undefined) {
                newItem = new ItemPrototypeList[name](name, amount);
            } else {
                newItem = new Item(name, 0);
            }

            if (newItem.isStackable === true)
                newItem.AddAmount(1);

            this.inventoryDictionary.AddValue(newItem, 'UID');
        } else if (found !== undefined && found.isStackable === false) {
            let newItem = undefined;

            if (ItemPrototypeList[name] !== undefined) {
                newItem = new ItemPrototypeList[name](name, amount);//, {name:{value:name}, amount:{value:amount}});
            } else {
                newItem = new Item(name, 0);
            }

            if (newItem.isStackable === true)
                found.AddAmount(1);
            else
                this.inventoryDictionary.AddValue(newItem, 'UID');
        } else if (found.isStackable === true) {
            found.AddAmount(1);
        } else {
            this.inventory[name].AddAmount(1);

        }

        this.didInventoryChange = true;
    }

    RemoveAmount(name, amount) {
        let found = this.inventoryDictionary.GetValueByProperty(name, 'name');

        if (found !== undefined) {
            if (found.GetAmount() > 1)
                found.RemoveAmount(Number(amount));
            else {
                this.inventoryDictionary.RemoveValue(this.inventoryDictionary.GetHashByProperty(found.UID, 'UID'));
            }
        }

        this.didInventoryChange = true;
    }

    RemoveItem(item) {
        if (this.inventoryDictionary.GetHashByProperty(item.UID, 'UID')) {
            let found = this.inventoryDictionary.GetValueByProperty(item.UID, 'UID');

            if (found.GetAmount() > 1) {
                found.RemoveAmount(Number(item.amount));
            } else {
                this.inventoryDictionary.RemoveValue(this.inventoryDictionary.GetHashByProperty(item.UID, 'UID'));
                GameToolbar.RemoveToolbarItem(item);
            }
        }
        this.didInventoryChange = true;
    }

    DropItem(item) {
        if (this.inventoryDictionary.GetHashByProperty(item.UID, 'UID')) {

            let found = this.inventoryDictionary.GetHashByProperty(item.UID, 'UID');
            if (found !== undefined)
                this.inventoryDictionary.RemoveValue(found);

            //delete this.inventory[item.name];
            GameToolbar.RemoveToolbarItem(item);
            this.didInventoryChange = true;
        }
    }

    DisplayInventory() {
        let keys = Object.keys(this.inventory);
        this.inventoryHTMLList.innerHTML = '';

        for (let value of this.inventoryDictionary) {
            let template = document.getElementById('inventory-panel-item');
            let clone = template.content.cloneNode(true);

            if (value !== null) {

                let div = clone.querySelector('div.inventory-item-sprite');
                div.style.backgroundPosition = '-' + (value.sprite.x * value.sprite.z) * 1.35 + 'px -' + (value.sprite.y * value.sprite.a) * 1.5 + 'px';
                div.style.backgroundSize = value.atlas.x * 1.35 + 'px ' + value.atlas.y * 1.5 + 'px';
                div.style.backgroundImage = 'url(' + value.url + ')';

                if (value.amount > 0)
                    clone.querySelector('label.inventory-item-text').innerHTML = value.GetAmount();

                clone.querySelector('div.inventory-item').dataset.inventoryItem = value.name;
                clone.querySelector('div.inventory-item').setAttribute('draggable', true);
                clone.querySelector('div.inventory-item').addEventListener('dragstart', this);
                this.inventoryHTMLList.appendChild(clone);
            }
        }
        this.didInventoryChange = false;
    }

    ShowInventory(visibility = !this.isVisible) {
        this.inventoryHTML.style.visibility = (visibility === true ? 'visible' : 'hidden');
        this.isVisible = visibility;
        this.inventoryHTMLValue.value = this.moneyAmount;
        this.selectedItem = undefined;
    }

    FixedUpdate() {
        if (this.didInventoryChange === true && this.inventorySetupDone === true) {
            this.DisplayInventory();
        }

        super.FixedUpdate();
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'input':
                if ((key === 'i' || key === 'tab') && data.eventType === 2) {
                    this.ShowInventory();
                }
                break;
        }
    }

    handleEvent(e) {
        switch (e.type) {
            case 'click':
                if (e.target.classList.contains('inventory-item') === true) {
                    let found = this.inventoryDictionary.GetValueByProperty(item.name, 'name');
                    if (found !== undefined) {
                        this.selectedItem = found;// this.inventory[e.target.dataset.inventoryItem];
                    }
                }
                break;

            case 'dragend':
                if (e.dataTransfer.dropEffect === 'none') {
                    let canvasBB = CanvasDrawer.GCD.mainCanvas.getBoundingClientRect();
                    canvasBB = new Vector4D(0, 0, canvasBB.width, canvasBB.height);
                    let mousePos = MasterObject.MO.playerController.MouseToScreen({ target: CanvasDrawer.GCD.mainCanvas, x: e.screenX, y: e.screenY - 80 });
                    let characterPos = this.characterOwner.BoxCollision.GetRealCenterPosition();

                    if (mousePos.Distance(characterPos) > 72)
                        mousePos = characterPos.LerpValue(mousePos, 72);

                    if (canvasBB.Inside(mousePos)) {
                        const data = JSON.parse(e.dataTransfer.getData('text/plain'));

                        if (data.id !== undefined) {
                            let droppedItem = document.getElementById(data.id);
                            let item = Cobject.GetObjectFromUID(data.item);

                            if (item !== undefined && droppedItem !== null) {
                                droppedItem.id = '';
                                let rect = CanvasDrawer.GCD.mainCanvas.getBoundingClientRect();

                                var newDroppedItem = new ItemProp(
                                    item.name,
                                    mousePos,
                                    new CAnimation('null', item.sprite, item.sprite, 32, 32, AnimationType.Single, 1),
                                    CanvasDrawer.GCD.GetAtlas(item.url),
                                    0,
                                    item
                                );
                                newDroppedItem.GameBegin();

                                this.DropItem(item);
                                GameToolbar.RemoveToolbarItem(item);
                                this.didInventoryChange = true;
                            }
                        }
                    }
                }
                break;

            case 'dragover':
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                break;

            case 'drop':
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                break;

            case 'dragstart':
                e.target.id = 'draggingItem';
                let found = this.inventoryDictionary.GetValueByProperty(e.target.dataset.inventoryItem, 'name');
                if (found !== undefined) {
                    let json = JSON.stringify({ id: e.target.id, item: found.UID });// this.inventory[e.target.dataset.inventoryItem].UID });
                    e.dataTransfer.setData('text/plain', json);
                    e.dataTransfer.dropEffect = 'copy';
                }
                break;
        }
    }
}

export { Inventory, Item, Hoe, Shovel };