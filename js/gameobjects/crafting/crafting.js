import { Cobject, InputHandler, GameToolbar, GUI, Item, CraftingRecipeList, inventoryItemIcons, CraftingCategory } from '../../internal.js';

class Crafting extends Cobject {
    constructor(owner) {
        super();
        this.crafting = {};
        this.characterOwner = owner;
        this.isVisible = false;
        this.craftingHTML;
        this.craftingHTMLList;
        this.didCraftingChange = false;
        this.craftingSetupDone = false;
        this.craftingRecipe = undefined;
        this.craftingTime = 0;
        this.isCrafting = false;
    }

    SetupCrafting() {
        if (document.getElementById('crafting-panel') !== null) {
            this.craftingHTML = GUI.CreateContainer();
            this.craftingHTML.classList.add('center-absolute');

            let template = document.getElementById('crafting-panel');
            //@ts-ignore
            let clone = template.content.cloneNode(true);
            this.craftingHTMLList = clone.querySelector('div.crafting-item-list');
            this.craftingHTMLList.addEventListener('click', this);

            this.craftingHTML.appendChild(clone);
            document.getElementById('game-gui').appendChild(this.craftingHTML);

            document.getElementById('crafting-button-craft').addEventListener('click', this);

            InputHandler.GIH.AddListener(this);
            this.craftingSetupDone = true;
        } else
            window.requestAnimationFrame(() => this.SetupCrafting());
    }

    AddItem(item) {
        if (this.crafting[item.name] !== undefined) {
            this.crafting[item.name].AddAmount(Number(item.amount));
        } else {
            item.crafting = this;
            this.crafting[item.name] = item;
        }
        this.didCraftingChange = true;
    }

    AddNewItem(name, amount = 0) {
        if (this.crafting[name] === undefined) {
            let newItem = new Item(name, 0);

            if (newItem.isStackable === true)
                newItem.AddAmount(1);

            this.AddItem(newItem);
        } else {
            this.crafting[name].AddAmount(1);
            this.didCraftingChange = true;
        }
    }

    RemoveItem(item) {
        if (this.crafting[item.name] !== undefined) {
            if (this.crafting[item.name].GetAmount() > 1)
                this.crafting[item.name].RemoveAmount(Number(item.amount));

            if (this.crafting[item.name].GetAmount() <= 1) {
                delete this.crafting[item.name];
                GameToolbar.RemoveToolbarItem(item);
            }
        } else {
            delete this.crafting[item.name];
            GameToolbar.RemoveToolbarItem(item);
        }
        this.didCraftingChange = true;
    }

    SetupCategories() {
        this.craftingHTMLList.innerHTML = '';

        let keys = Object.keys(CraftingCategory);

            for (let i = 0, l = keys.length; i < l; ++i) {
                let categoryEl = document.createElement('div');
                categoryEl.id = 'crafting-' + keys[i];
                categoryEl.className = 'crafting-category-container';
                let labelEl = document.createElement('label');
                labelEl.innerText = keys[i];
                labelEl.className = 'crafting-category-name';
                categoryEl.appendChild(labelEl);

                this.craftingHTMLList.appendChild(categoryEl);
            }
    }

    DisplayCrafting() {
        let keys = Object.keys(CraftingRecipeList);

        this.SetupCategories();
        let categoryNames = Object.keys(CraftingCategory);
        for (let i = 0, l = keys.length; i < l; ++i) {
            let template = document.getElementById('crafting-panel-item');
            //@ts-ignore
            let clone = template.content.cloneNode(true);

            if (CraftingRecipeList[keys[i]] !== null) {
                let recipe = CraftingRecipeList[keys[i]];

                let div = clone.querySelector('div.crafting-item-sprite');
                div.style.backgroundPosition = '-' + (inventoryItemIcons[recipe.name].sprite.x * inventoryItemIcons[recipe.name].sprite.z) * 1.35 + 'px -' + (inventoryItemIcons[recipe.name].sprite.y * inventoryItemIcons[recipe.name].sprite.a) * 1.5 + 'px';
                div.style.backgroundSize = inventoryItemIcons[recipe.name].atlas.x * 1.35 + 'px ' + inventoryItemIcons[recipe.name].atlas.y * 1.5 + 'px';
                div.style.backgroundImage = 'url(' + inventoryItemIcons[recipe.name].url + ')';

                clone.querySelector('div.inventory-item').dataset.craftingItem = recipe.name;
                document.getElementById('crafting-' + categoryNames[recipe.category]).appendChild(clone);
                //this.craftingHTMLList.appendChild(clone);
            }
        }

        this.didCraftingChange = false;
    }

    ShowRecipe() {
        if (this.craftingRecipe !== undefined) {
            document.getElementById('crafting-item-name').innerText = this.craftingRecipe.name[0].toUpperCase() + this.craftingRecipe.name.slice(1);

            let div = document.getElementById('crafting-item-details-sprite');
            let xVal = inventoryItemIcons[this.craftingRecipe.name].atlas.x / 32 * parseFloat(div.style.width),
                yVal = inventoryItemIcons[this.craftingRecipe.name].atlas.y / 32 * parseFloat(div.style.height),
                xPos = (xVal / inventoryItemIcons[this.craftingRecipe.name].atlas.x) * inventoryItemIcons[this.craftingRecipe.name].sprite.x * 32,
                yPos = (yVal / inventoryItemIcons[this.craftingRecipe.name].atlas.y) * inventoryItemIcons[this.craftingRecipe.name].sprite.y * 32;

            div.style.backgroundPosition = '-' + xPos + 'px -' + yPos + 'px';
            div.style.backgroundSize = xVal + 'px ' + yVal + 'px';
            div.style.backgroundImage = 'url(' + inventoryItemIcons[this.craftingRecipe.name].url + ')';


            let template = document.getElementById('crafting-panel-resource');
            document.getElementById('crafting-item-resources').innerHTML = '';

            for (let i = 0, l = this.craftingRecipe.resourceList.length; i < l; ++i) {
                //@ts-ignore
                let clone = template.content.cloneNode(true);

                let text = '';

                if (this.characterOwner.inventory !== undefined) {
                    text += this.characterOwner.inventory.GetItemAmount(this.craftingRecipe.resourceList[i].resource) + '/' + this.craftingRecipe.resourceList[i].amount;
                    text += ' - ' + this.craftingRecipe.resourceList[i].name;
                }

                clone.querySelector('label.crafting-item-text').innerText = text;

                div = clone.querySelector('div.inventory-item-sprite-32');

                xVal = inventoryItemIcons[this.craftingRecipe.resourceList[i].resource].atlas.x / 32 * parseFloat(div.style.width);
                yVal = inventoryItemIcons[this.craftingRecipe.resourceList[i].resource].atlas.y / 32 * parseFloat(div.style.height);
                xPos = (xVal / inventoryItemIcons[this.craftingRecipe.resourceList[i].resource].atlas.x) * inventoryItemIcons[this.craftingRecipe.resourceList[i].resource].sprite.x * 32;
                yPos = (yVal / inventoryItemIcons[this.craftingRecipe.resourceList[i].resource].atlas.y) * inventoryItemIcons[this.craftingRecipe.resourceList[i].resource].sprite.y * 32;

                div.style.backgroundPosition = '-' + xPos + 'px -' + yPos + 'px';
                div.style.backgroundSize = xVal + 'px ' + yVal + 'px';
                div.style.backgroundImage = 'url(' + inventoryItemIcons[this.craftingRecipe.resourceList[i].resource].url + ')';

                document.getElementById('crafting-item-resources').appendChild(clone);
            }

            this.didCraftingChange = true;
        }
    }

    ShowCrafting(visibility = !this.isVisible) {
        this.craftingHTML.style.visibility = (visibility === true ? 'visible' : 'hidden');
        this.isVisible = visibility;
        this.didCraftingChange = true;
    }

    CraftItem() {
        if (this.craftingRecipe !== undefined) {
            for (let i = 0, l = this.craftingRecipe.resourceList.length; i < l; ++i) {
                if (this.characterOwner.inventory.HasItemAmount(this.craftingRecipe.resourceList[i].resource, this.craftingRecipe.resourceList[i].amount) === false) {
                    return;
                }
            }

            for (let i = 0, l = this.craftingRecipe.resourceList.length; i < l; ++i) {
                this.characterOwner.inventory.RemoveAmount(this.craftingRecipe.resourceList[i].resource, this.craftingRecipe.resourceList[i].amount);
            }

            this.isCrafting = true;
            this.ShowRecipe();
        }
    }

    SetProgressbar(time) {
        document.getElementById('crafting-progress-bar-progresss').style.width = (128 * (time / this.craftingRecipe.time)) + 'px';
    }

    CraftingDone(delta) {
        if (this.craftingTime < this.craftingRecipe.time) {
            this.craftingTime += delta;
            this.SetProgressbar(this.craftingTime);
        } else {
            this.characterOwner.inventory.AddNewItem(this.craftingRecipe.name, this.craftingRecipe.amount);
            this.isCrafting = false;
            this.craftingTime = 0;
            document.getElementById('crafting-progress-bar-progresss').style.width = '0px';
        }
    }

    FixedUpdate(delta) {
        if (this.didCraftingChange === true && this.craftingSetupDone === true) {
            this.DisplayCrafting();
        }

        if (this.isCrafting === true) {
            this.CraftingDone(delta);
        }

        super.FixedUpdate(delta);
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'input':
                if (key === 'c' && data.eventType === 2) {
                    this.ShowCrafting();
                    this.ShowRecipe();
                }
                break;
        }
    }

    handleEvent(e) {
        switch (e.type) {
            case 'click':
                if (e.target.id === 'crafting-button-craft' && this.isCrafting === false) {
                    this.CraftItem();
                } else {
                    if (this.isCrafting === false)
                        this.craftingRecipe = CraftingRecipeList[e.target.dataset.craftingItem];
                    this.ShowRecipe();
                }
                break;
        }
    }
}

export { Crafting };