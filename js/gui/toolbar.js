import { Cobject, MasterObject, Item, InputHandler, UsableItem, ItemStats } from '../internal.js';

class GameToolbar extends Cobject {
    static GGT = new GameToolbar();

    constructor() {
        super();
        this.toolbar = document.getElementById('game-gui-toolbar');
        this.toolbar.addEventListener('click', this);
        this.activeToolbar;

        /** @type {Object.<string, UsableItem>}>} */
        this.toolbarItems = {};
        this.didToolbarChange = false;

        this.SetupHTML();
    }

    SetupHTML() {
        let count = this.toolbar.children.length;

        for (let i = 0; i < count; ++i) {
            let div = this.toolbar.children[i];
            // @ts-ignore
            div.dataset.toolbarIndex = i;
            div.addEventListener('drop', this);
            div.addEventListener('dragover', this);
        }
    }

    FixedUpdate() {
        if (this.didToolbarChange === true) {
            this.DisplayToolbar();
        }
        this.UpdateProgressbars();

        super.FixedUpdate();
    }

    AddToolbarItem(slot, item) {
        this.toolbarItems[slot] = item;
        this.didToolbarChange = true;
    }

    static RemoveToolbarItem(item) {
        let keys = Object.keys(GameToolbar.GGT.toolbarItems);
        for (let i = 0, l = keys.length; i < l; ++i) {
            if (GameToolbar.GGT.toolbarItems[keys[i]].name === item.name) {
                delete GameToolbar.GGT.toolbarItems[keys[i]];
                GameToolbar.GGT.RemoveToolbarGUIItem(keys[i]);
            }
        }
        GameToolbar.GGT.didToolbarChange = true;

        if (MasterObject.MO.playerController.playerCharacter.activeItem === item) {
            MasterObject.MO.playerController.playerCharacter.activeItem = undefined;
        }
    }

    SetActiveToolbar(element) {
        if (this.activeToolbar !== undefined)
            this.activeToolbar.classList.remove('toolbar-item-active');

        if (this.activeToolbar == element) {
            this.activeToolbar.classList.remove('toolbar-item-active');
            this.activeToolbar = undefined;
            MasterObject.MO.playerController.playerCharacter.activeItem = undefined;
        } else {
            element.classList.add('toolbar-item-active');
            this.activeToolbar = element;
            MasterObject.MO.playerController.playerCharacter.SetActiveItem(this.toolbarItems[element.querySelector('label.toolbar-item-text').innerText - 1]);
        }
    }

    RemoveToolbarGUIItem(index) {
        let div = this.toolbar.children[index].querySelector('div.toolbar-item-sprite');
        // @ts-ignore
        div.style.backgroundImage = 'unset';

        if (this.activeToolbar !== undefined)
            this.activeToolbar.classList.remove('toolbar-item-active');
    }

    UpdateProgressbars() {
        let keys = Object.keys(this.toolbarItems);
        for (let i = 0, l = keys.length; i < l; ++i) {
            let item = this.toolbarItems[keys[i]];
            let div = this.toolbar.children[keys[i]].querySelector('div.toolbar-item-sprite');

            if (div.parentNode.querySelector('div.progress-bar-mini') !== null) {
                div.parentNode.querySelector('div.progress-bar-progress-mini').style.width = (item.durability / ItemStats[item.name].durability) * 100 + '%';
            }
        }
    }

    DisplayToolbar() {
        let keys = Object.keys(this.toolbarItems);
        for (let i = 0, l = keys.length; i < l; ++i) {
            let item = this.toolbarItems[keys[i]];
            let div = this.toolbar.children[keys[i]].querySelector('div.toolbar-item-sprite');
            div.style.backgroundPosition = '-' + (item.sprite.x * item.sprite.z) * 1.35 + 'px -' + (item.sprite.y * item.sprite.a) * 1.5 + 'px';
            div.style.backgroundSize = item.atlasSize.x * 1.35 + 'px ' + item.atlasSize.y * 1.5 + 'px';
            div.style.backgroundImage = 'url(' + item.url + ')';

            if (item instanceof UsableItem && div.parentNode.querySelector('div.rogress-bar-mini') === null) {
                //@ts-ignore
                let clone = document.getElementById('template-progress-bar').content.cloneNode(true);
                clone.id = 'toolbar-item-progress-bar-' + i;
                clone.children[0].style.position = 'absolute';
                clone.children[0].style.top = '100%';
                clone.querySelector('div.progress-bar-progress-mini').style.width = (item.durability / ItemStats[item.name].durability) * 100 + '%';
                div.parentNode.appendChild(clone);
            }
        }

        this.didToolbarChange = false;
    }

    handleEvent(e) {
        switch (e.type) {
            case 'click':
                if (e.target.classList.contains('toolbar-item')) {
                    this.SetActiveToolbar(e.target);
                }
                break;

            case 'dragover':
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                break;

            case 'drop':
                e.preventDefault();

                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                let droppedItem = document.getElementById(data.id);
                let item = /** @type {Item} */ (Cobject.GetObjectFromUID(data.item));

                droppedItem.id = '';
                if (item instanceof Item) {
                    this.AddToolbarItem(e.target.dataset.toolbarIndex, item);
                }
                break;
        }
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'input':
                if (data.eventType == 0) {
                    switch (key) {
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                            if (MasterObject.MO.playerController.playerCharacter.inventory.isVisible === false)
                                this.SetActiveToolbar(this.toolbar.children[key - 1]);
                            break;
                    }
                } else if (data.eventType == 3) {
                    switch (key) {
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                            break;
                    }
                }
                break;
        }
    }
}

/* GameToolbar.GGT.toolbarItems = [
    new Shovel('shovel', 1),
    new Hoe('hoe', 1),
];
GameToolbar.GGT.didToolbarChange = true; */

InputHandler.GIH.AddListener(GameToolbar.GGT);

export { GameToolbar };