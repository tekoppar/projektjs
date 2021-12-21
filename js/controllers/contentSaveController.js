import { XHRUtility, Props, CanvasDrawer, AllCollisions, AllBlockingCollisions, worldTiles } from '../internal.js';

/**
 * @class
 * @constructor
 */
class SaveController {
	/** @type {SaveController} */static _Instance = new SaveController();

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
		window.setTimeout(function () {
			responseLabel.remove();
		}, 5000);
	}

	/**
	 * @private
	 */
	static SaveCollisions() {
		let allCollisionString = "import { Vector2D } from '../../internal.js'\r\n\r\n";
		allCollisionString += "/** @type {Object.<string, Vector2D[]>} */ let AllCollisions = {};\r\n";
		allCollisionString += "/** @type {Object.<string, Vector2D[]>} */ let AllBlockingCollisions = {};\r\n\r\n";

		let keys = Object.keys(AllCollisions);
		for (let i = 0, l = keys.length; i < l; ++i) {
			allCollisionString += 'AllCollisions.' + keys[i] + ' = [';
			for (let i2 = 0, l2 = AllCollisions[keys[i]].length; i2 < l2; ++i2) {
				allCollisionString += AllCollisions[keys[i]][i2].SaveToFile();

				if (i2 !== l2 - 1)
					allCollisionString += ', ';
			}
			allCollisionString += '];\r\n';
		}
		allCollisionString += '\r\n';

		keys = Object.keys(AllBlockingCollisions);
		for (let i = 0, l = keys.length; i < l; ++i) {
			allCollisionString += 'AllBlockingCollisions.' + keys[i] + ' = [';
			for (let i2 = 0, l2 = AllBlockingCollisions[keys[i]].length; i2 < l2; ++i2) {
				allCollisionString += AllBlockingCollisions[keys[i]][i2].SaveToFile();

				if (i2 !== l2 - 1)
					allCollisionString += ', ';
			}
			allCollisionString += '];\r\n';
		}

		allCollisionString += "\r\nexport { AllCollisions, AllBlockingCollisions };";

		XHRUtility.JSPost('/saveFile.php', {
			path: '/js/gameobjects/collision',
			filename: 'allCollisions.js',
			data: allCollisionString
		}, SaveController._Instance, SaveController.prototype.ContentSave);
	}

	/**
	 * @private
	 */
	static SaveObjects() {
		let allObjectString = "import { Vector2D } from '../../internal.js';\r\n\r\n";
		allObjectString += "/** @typedef {import('../../typedef.js').AllObjectSetup} AllObjectSetup */\r\n\r\n";
		allObjectString += "/** @type {Array<AllObjectSetup>} */ let Objects = [\r\n";

		for (let i = 0, l = Props.length; i < l; ++i) {
			allObjectString += '\t' + Props[i].SaveObject();

			if (i !== l - 1)
				allObjectString += ',\r\n';
		}
		allObjectString += '\r\n];\r\n\r\nexport { Objects };';

		XHRUtility.JSPost('/saveFile.php', {
			path: '/js/gameobjects/setups',
			filename: 'AllObjects.js',
			data: allObjectString
		}, SaveController._Instance, SaveController.prototype.ContentSave);
	}

	static SaveTerrain() {
		let keys = Object.keys(CanvasDrawer.GCD.drawingOperations),
			allTerrainString = '',
			allTerrainImportString = 'let worldTiles = {};\r\n\r\n';

		for (let y = 0, yl = keys.length; y < yl; ++y) {
			allTerrainString = 'let worldTiles' + y + ' = {\r\n';

			let keysX = Object.keys(CanvasDrawer.GCD.drawingOperations[keys[y]]);
			for (let x = 0, lx = keysX.length; x < lx; ++x) {
				allTerrainString += '\t"' + keysX[x] + '":\r\n';
				allTerrainString += '\t\t[\r\n';
				for (let i = 0, l = CanvasDrawer.GCD.drawingOperations[keys[y]][keysX[x]].length; i < l; ++i) {
					allTerrainString += '\t\t\t' + CanvasDrawer.GCD.drawingOperations[keys[y]][keysX[x]][i].SaveObject();

					if (i !== l - 1)
						allTerrainString += ',\r\n';
				}
				allTerrainString += '\r\n\t\t],\r\n';
			}

			allTerrainString += '\r\n};';
			allTerrainString += '\r\nexport { worldTiles' + y + ' };';

			allTerrainImportString += 'import { worldTiles' + y + ' } from ' + "'./worldTiles/worldTiles" + y + ".js';\r\n";
			allTerrainImportString += "worldTiles['" + y + "'] = " + 'worldTiles' + y + ';\r\n'; 

			XHRUtility.JSPost('/saveFile.php', {
				path: '/js/drawers/tiles/worldTiles',
				filename: 'worldTiles' + y + '.js',
				data: allTerrainString
			}, SaveController._Instance, SaveController.prototype.ContentSave);
		}

		allTerrainImportString += '\r\n\r\n';
		allTerrainImportString += 'export { worldTiles };';

		XHRUtility.JSPost('/saveFile.php', {
			path: '/js/drawers/tiles',
			filename: 'worldTilesList.js',
			data: allTerrainImportString
		}, SaveController._Instance, SaveController.prototype.ContentSave);
	}

	static SaveContent() {
		SaveController.SaveTerrain();
		SaveController.SaveObjects();
		SaveController.SaveCollisions();
	}
}

export { SaveController };