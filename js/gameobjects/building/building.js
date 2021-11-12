import { Cobject, InputHandler, GameToolbar, GUI, CraftingRecipeList, inventoryItemIcons } from '../../internal.js';

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
    }

    SetupBuilding() {
        if (document.getElementById('building-panel') !== null) {
            this.buildingHTML = GUI.CreateContainer();
            this.buildingHTML.classList.add('center-absolute');

            let template = document.getElementById('building-panel');
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
}