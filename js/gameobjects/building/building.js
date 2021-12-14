import { Cobject, InputHandler, GUI, BuildingRecipeList, BuildingZone, BuildingCategory, inventoryItemIcons, MasterObject, CanvasDrawer, ObjectClassLUT, PawnSetupParams, AtlasController, CanvasUtility } from '../../internal.js';

/**
 * @readonly
 * @enum {Number}
 */
const BuildingModeState = {
    None: 0,
    Selecting: 1,
    Placing: 2,
}

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class Building extends Cobject {
    constructor(owner) {
        super();
        this.building = {};
        this.characterOwner = owner;
        this.isVisible = false;
        this.buildingHTML;
        this.buildingHTMLList;
        this.didBuildingChange = false;
        this.buildingSetupDone = false;
        this.buildingRecipe = undefined;
        this.buildingTime = 0;
        this.isBuilding = false;
        this.buildingState = BuildingModeState.None;
        this.selectedBuilding = undefined;
    }

    SetupBuilding() {
        if (document.getElementById('building-panel') !== null) {
            this.buildingHTML = GUI.CreateContainer();
            this.buildingHTML.classList.add('center-absolute');

            let template = document.getElementById('building-panel');
            //@ts-ignore
            let clone = template.content.cloneNode(true);
            this.buildingHTMLList = clone.querySelector('div.building-item-list');
            this.buildingHTMLList.addEventListener('click', this);

            this.buildingHTML.appendChild(clone);
            document.getElementById('game-gui').appendChild(this.buildingHTML);
            document.getElementById('building-button-craft').addEventListener('click', this);

            InputHandler.GIH.AddListener(this);
            this.buildingSetupDone = true;
        } else
            window.requestAnimationFrame(() => this.SetupBuilding());
    }

    SetupCategories() {
        this.buildingHTMLList.innerHTML = '';

        let keys = Object.keys(BuildingCategory);

        for (let i = 0, l = keys.length; i < l; ++i) {
            let categoryEl = document.createElement('div');
            categoryEl.id = 'building-' + keys[i];
            categoryEl.className = 'building-category-container';
            let labelEl = document.createElement('label');
            labelEl.innerText = keys[i];
            labelEl.className = 'building-category-name';
            categoryEl.appendChild(labelEl);

            this.buildingHTMLList.appendChild(categoryEl);
        }
    }

    DisplayBuilding() {
        let keys = Object.keys(BuildingRecipeList);

        this.SetupCategories();
        let categoryNames = Object.keys(BuildingCategory);
        for (let i = 0, l = keys.length; i < l; ++i) {
            let template = document.getElementById('building-panel-item');
            //@ts-ignore
            let clone = template.content.cloneNode(true);

            if (BuildingRecipeList[keys[i]] !== null) {
                let recipe = BuildingRecipeList[keys[i]];

                if (inventoryItemIcons[keys[i]] === undefined)
                    continue;

                let div = /** @type {HTMLDivElement} */ (clone.querySelector('div.inventory-item'));
                let image = CanvasUtility.CanvasPortionToImage(inventoryItemIcons[keys[i]].sprite.x * 32, inventoryItemIcons[keys[i]].sprite.y * 32, inventoryItemIcons[keys[i]].sprite.z, inventoryItemIcons[keys[i]].sprite.a, AtlasController.GetAtlas(inventoryItemIcons[keys[i]].url));
                image.removeAttribute('height');
                image.removeAttribute('width');
                div.appendChild(image);

                div.dataset.buildingItem = keys[i];
                document.getElementById('building-' + categoryNames[recipe.category]).appendChild(clone);
            }
        }

        this.didBuildingChange = false;
    }

    /**
     * 
     * @param {string} buildingKey 
     */
    ShowRecipe(buildingKey = undefined) {
        if (this.buildingRecipe !== undefined && buildingKey !== undefined) {
            document.getElementById('building-item-name').innerText = this.buildingRecipe.displayName;

            let container = this.buildingHTML.querySelector('div.frame-circle');
            let image = CanvasUtility.CanvasPortionToImage(inventoryItemIcons[buildingKey].sprite.x * 32, inventoryItemIcons[buildingKey].sprite.y * 32, inventoryItemIcons[buildingKey].sprite.z, inventoryItemIcons[buildingKey].sprite.a, AtlasController.GetAtlas(inventoryItemIcons[buildingKey].url));
            image.classList.add('building-item-sprite');
            container.innerHTML = '';
            image.removeAttribute('height');
            image.removeAttribute('width');
            container.appendChild(image);

            let template = document.getElementById('building-panel-resource');
            document.getElementById('building-item-resources').innerHTML = '';

            for (let i = 0, l = this.buildingRecipe.resourceList.length; i < l; ++i) {
                //@ts-ignore
                let clone = template.content.cloneNode(true);

                let text = '';

                if (this.characterOwner.inventory !== undefined) {
                    text += this.characterOwner.inventory.GetItemAmount(this.buildingRecipe.resourceList[i].resource) + '/' + this.buildingRecipe.resourceList[i].amount;
                    text += ' - ' + this.buildingRecipe.resourceList[i].name;
                }

                clone.querySelector('label.building-item-text').innerText = text;

                let div = clone.querySelector('div.inventory-item-32');
                let resourceImage = CanvasUtility.CanvasPortionToImage(inventoryItemIcons[this.buildingRecipe.resourceList[i].resource].sprite.x * 32, inventoryItemIcons[this.buildingRecipe.resourceList[i].resource].sprite.y * 32, inventoryItemIcons[this.buildingRecipe.resourceList[i].resource].sprite.z, inventoryItemIcons[this.buildingRecipe.resourceList[i].resource].sprite.a, AtlasController.GetAtlas(inventoryItemIcons[this.buildingRecipe.resourceList[i].resource].url));
                resourceImage.classList.add('inventory-item-sprite-32');
                resourceImage.removeAttribute('height');
                resourceImage.removeAttribute('width');
                div.appendChild(resourceImage);

                document.getElementById('building-item-resources').appendChild(clone);
            }

            this.didBuildingChange = true;
        }
    }

    ShowBuilding(visibility = !this.isVisible) {
        this.buildingHTML.style.visibility = (visibility === true ? 'visible' : 'hidden');
        this.isVisible = visibility;
        this.didBuildingChange = true;

        if (this.buildingState !== BuildingModeState.Placing) {
            if (this.isVisible)
                this.buildingState = BuildingModeState.Selecting;
            else
                this.buildingState = BuildingModeState.None;
        }
    }

    CraftItem() {
        if (this.buildingRecipe !== undefined) {
            for (let i = 0, l = this.buildingRecipe.resourceList.length; i < l; ++i) {
                if (this.characterOwner.inventory.HasItemAmount(this.buildingRecipe.resourceList[i].resource, this.buildingRecipe.resourceList[i].amount) === false) {
                    return;
                }
            }

            for (let i = 0, l = this.buildingRecipe.resourceList.length; i < l; ++i) {
                this.characterOwner.inventory.RemoveAmount(this.buildingRecipe.resourceList[i].resource, this.buildingRecipe.resourceList[i].amount);
            }

            this.isBuilding = true;
            this.ShowRecipe();
        }
    }

    PlaceBuildingZone() {
        if (this.selectedBuilding !== undefined) {
            let newZone = new BuildingZone(this.selectedBuilding.GetPosition().Clone(), this.selectedBuilding, this.buildingRecipe);
            newZone.GameBegin();
            newZone.SetPosition(this.selectedBuilding.position);

            this.selectedBuilding.Delete();
            this.selectedBuilding = undefined;
            this.buildingState = BuildingModeState.None;
            this.ShowBuilding(false);
        }
    }

    BuildingCancelled() {
        if (this.selectedBuilding !== undefined) {
            this.selectedBuilding.Delete();
            this.selectedBuilding = undefined;
            this.buildingState = BuildingModeState.Selecting;
            this.ShowBuilding(true);
        }
    }

    SetupPlacingBuilding() {
        if (this.buildingRecipe !== undefined && this.buildingState === BuildingModeState.Selecting) {
            this.buildingState = BuildingModeState.Placing;
            this.ShowBuilding();
            this.SetupBuildingPawn();
        }
    }

    SetupBuildingPawn() {
        if (ObjectClassLUT[this.buildingRecipe.name] !== undefined) {
            let params = PawnSetupParams[this.buildingRecipe.name];
            params = JSON.parse(JSON.stringify(params));
            let pos = MasterObject.MO.playerController.mousePosition.Clone();
            pos.Add(CanvasDrawer.GCD.canvasOffset);
            pos.x += params[1][0];

            pos.SnapToGridF(32);

            params[1] = pos;
            this.selectedBuilding = new ObjectClassLUT[this.buildingRecipe.name].constructor(...params);
            this.selectedBuilding.GameBegin();
        }
    }

    FixedUpdate(delta) {
        if (this.didBuildingChange === true && this.buildingSetupDone === true) {
            this.DisplayBuilding();
        }

        super.FixedUpdate(delta);

        if (this.selectedBuilding !== undefined && this.buildingState === BuildingModeState.Placing) {
            let tMousePos = MasterObject.MO.playerController.mousePosition.Clone();
            tMousePos.Add(CanvasDrawer.GCD.canvasOffset);
            tMousePos.SnapToGridF(32);

            this.selectedBuilding.SetPosition(tMousePos);
        }
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'input':
                if (key === 'b' && data.eventType === 2) {
                    this.ShowBuilding();
                    this.ShowRecipe();
                }

                if (key === 'leftMouse' && data.eventType === 0 && this.selectedBuilding !== undefined && this.buildingState === BuildingModeState.Placing) {
                    this.PlaceBuildingZone();
                }

                if (key === 'rightMouse' && data.eventType === 2 && this.selectedBuilding !== undefined) {
                    this.BuildingCancelled();
                }
                break;
        }
    }

    handleEvent(e) {
        switch (e.type) {
            case 'click':
                if (e.target.id === 'building-button-craft' && this.buildingState === BuildingModeState.Selecting) {
                    this.SetupPlacingBuilding();
                } else {
                    if (this.buildingState !== BuildingModeState.Placing)
                        this.buildingRecipe = BuildingRecipeList[e.target.dataset.buildingItem];
                    this.ShowRecipe(e.target.dataset.buildingItem);
                }
                break;
        }
    }
}

export { Building };