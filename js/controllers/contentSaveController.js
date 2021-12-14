import { XHRUtility, Props, CanvasDrawer } from '../internal.js';

class SaveController {
    /** @type {SaveController} */
    static _Instance = new SaveController();

    constructor() {
        this.responseContainer = document.createElement('div');
        this.SetupContainer();
    }

    SetupContainer() {
        const x = this.responseContainer;

        x.style.display = 'flex';
        x.style.flexDirection = 'column';
        x.style.position = 'fixed';
        x.style.zIndex = '999999999';
        x.style.top = '0';
        x.style.left = '0';

        document.body.appendChild(x);
    }

    ContentSave(response) {
        let responseLabel = document.createElement('label');
        responseLabel.textContent = response.status;
        
        responseLabel.style.color = 'white';
        responseLabel.style.borderRadius = '10px';
        responseLabel.style.backgroundColor = 'black';
        responseLabel.style.padding = '5px 10px 5px 10px';
        responseLabel.style.margin = '2px';

        this.responseContainer.appendChild(responseLabel);
        window.setTimeout(function() {
            responseLabel.remove();
        }, 5000);
    }

    static SaveContent() {
        XHRUtility.JSPost('/saveFile.php', {
            path: '/js/drawers/tiles',
            filename: 'worldTiles.js',
            data: 'export let worldTiles = ' + JSON.stringify(CanvasDrawer.GCD.drawingOperations)
        }, SaveController._Instance, SaveController.prototype.ContentSave);

        let allPropsString = "import { Vector2D, Vector4D, Tree, ExtendedProp, CAnimation, Rock, Rectangle, CraftingStation } from '../../internal.js'; \r\n let Props = [\r\n";
        for (let i = 0, l = Props.length; i < l; ++i) {
            allPropsString += Props[i].SaveToFile();

            if (i !== l - 1)
                allPropsString += ',\r\n';
        }
        allPropsString += '\r\n]; \r\n\r\n export { Props };';

        XHRUtility.JSPost('/saveFile.php', {
            path: '/js/gameobjects/setups',
            filename: 'AllGameObjects.js',
            data: allPropsString
        },SaveController._Instance, SaveController.prototype.ContentSave);
    }
}

export { SaveController };