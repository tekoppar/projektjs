import {
	DebugDrawer, Vector2D, Tile, AtlasController, RectMerge, Operation, OverlapOICheck, AmbientLight,
	BWDrawingType, AllCollisions, CollisionTypeCheck, Polygon, ClearOperation, TileData, InputHandler,
	CollisionHandler, LightFalloffType, BoxCollision, worldTiles, Brush, BrushDrawState, Shadow2D, TileF,
	BrushType, RectOperation, PathOperation, TextOperation, DrawingOperation, OperationType, TileLUT,
	SelectedTileEditor, UIDrawer, MasterObject, Rectangle, LightingOperation, Color, LightSystem, PropEditor, SaveController, Mastertime
} from '../../internal.js';

/** @typedef {import('./operation.js').Operations} Operations */

/** @type {Object.<string, {x:number, y:number}>} */ let mouseToAtlasRectMap = {};

function correctMouse(event) {
	let rect;
	if (mouseToAtlasRectMap[event.target.id] === undefined) {
		rect = event.target.getBoundingClientRect();
		if (event.target.id !== undefined)
			mouseToAtlasRectMap[event.target.id] = { x: rect.x + window.scrollX, y: rect.y + window.scrollY };
	}
	else if (event.target.id !== undefined) {
		rect = { x: mouseToAtlasRectMap[event.target.id].x, y: mouseToAtlasRectMap[event.target.id].y };
		rect.x -= window.scrollX;
		rect.y -= window.scrollY;
	}
	return new Vector2D(Math.floor(event.x - rect.x), Math.floor(event.y - rect.y));
}

function MouseToScreen(event) {
	let rect;

	if (mouseToAtlasRectMap[event.target.id] === undefined) {
		rect = event.target.getBoundingClientRect();
		if (event.target.id !== undefined)
			mouseToAtlasRectMap[event.target.id] = { x: rect.x + window.scrollX, y: rect.y + window.scrollY };
	}
	else if (event.target.id !== undefined) {
		rect = { x: mouseToAtlasRectMap[event.target.id].x, y: mouseToAtlasRectMap[event.target.id].y };
		rect.x -= window.scrollX;
		rect.y -= window.scrollY;
	}
	return new Vector2D(event.x - rect.x, event.y - rect.y);
}

/**
 * 
 * @param {Operation} a 
 * @param {Operation} b 
 * @returns {number}
 */
function sortDrawOperations(a, b) {
	if (a.GetDrawPositionY() > b.GetDrawPositionY()) return 1;
	if (a.GetDrawPositionY() < b.GetDrawPositionY()) return -1;
	if (a.GetDrawIndex() > b.GetDrawIndex()) return 1;
	if (a.GetDrawIndex() < b.GetDrawIndex()) return -1;
	return 0;
};

/**
 * 
 * @param {LightingOperation} a 
 * @param {LightingOperation} b 
 * @returns {number}
 */
function sortLightingOperations(a, b) {
	if (a.GetDrawPositionY() > b.GetDrawPositionY()) return 1;
	if (a.GetDrawPositionY() < b.GetDrawPositionY()) return -1;
	if (a.GetDrawIndex() > b.GetDrawIndex()) return 1;
	if (a.GetDrawIndex() < b.GetDrawIndex()) return -1;
	return 0;
};

class CanvasSave {
	constructor(operations = {}, canvasDrawer) {
		this.drawingOperations = operations;
		this.CanvasDrawer = canvasDrawer;
		this.loadOperationsDone = {};

		if (window.indexedDB === undefined)
			// @ts-ignore
			window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
				// @ts-ignore
				IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction;

		this.dbVersion = 1;
		this.request = indexedDB.open("farming", this.dbVersion);
		this.db;
		this.request.addEventListener('success', this);
		this.request.addEventListener('upgradeneeded', this);
		// @ts-ignore
		this.jsonOperations;
	}

	/*createObjectStore(database) {
		//database.createObjectStore(key);
	}*/

	getDataFromDb(index, key) {
		let transaction = this.db.transaction([index], "readwrite");
		let get = transaction.objectStore(index).get(key);

		return get;
	}

	putElephantInDb(blob, index, key = "saveData") {
		if (index !== undefined) {
			let transaction = this.db.transaction([index], "readwrite");
			let put = transaction.objectStore(index).put(blob, key);

			if (put !== undefined)
				console.log("Error creating/accessing IndexedDB database");

			this.request.onerror = function () {
				console.log("Error creating/accessing IndexedDB database");
			};
		}
	};

	UpdateOperation(operations) {
		for (let i = 0; i < operations.length; ++i) {
			if (operations[i].drawingCanvas.id === 'game-canvas') {
				if (operations[i].tile.IsTransparent() === true) {
					this.drawingOperations[operations[i].tile.position.y / 32][operations[i].tile.position.x / 32].push(operations[i]);
				} else if (this.drawingOperations[operations[i].tile.position.y / 32] !== undefined) {
					this.drawingOperations[operations[i].tile.position.y / 32][operations[i].tile.position.x / 32] = [];
					this.drawingOperations[operations[i].tile.position.y / 32][operations[i].tile.position.x / 32].push(
						new DrawingOperation(
							this,
							operations[i].tile,
							operations[i].drawingCanvas,
							this.CanvasDrawer.GetAtlas(operations[i].tile.atlas).GetCanvas()
						)
					);
				}

			}
		}
	}

	LoadOperations() {
		/*for (let y = 0; y < Math.ceil(this.CanvasDrawer.mainCanvas.height / 32); y++) {
			this.drawingOperations[y] = {};
			for (let x = 0; x < Math.ceil(this.CanvasDrawer.mainCanvas.width / 32); x++) {
				this.drawingOperations[y][x] = [];
			}
		}*/

		for (let y = 0; y < Math.ceil(this.CanvasDrawer.mainCanvas.height / 32); ++y) {
			this.drawingOperations[y] = {};
			for (let x = 0; x < Math.ceil(this.CanvasDrawer.mainCanvas.width / 32); ++x) {
				this.drawingOperations[y][x] = [];
				// @ts-ignore
				let transaction = this.db.transaction([y], "readwrite");
				// @ts-ignore
				let get = transaction.objectStore(y).get(x);

				if (this.loadOperationsDone.constructor === Object)
					this.loadOperationsDone[y + '-' + x] = false;

				get.addEventListener('success', this);
			}
		}
	}

	SaveOperations() {
		if (this.drawingOperations.length < 1)
			return;
		let tempSavedOperations = {};
		this.drawingOperations = CanvasDrawer.GCD.drawingOperations;
		let keysY = Object.keys(this.drawingOperations);
		for (let y = 0; y < keysY.length; ++y) {

			let keysX = Object.keys(this.drawingOperations[keysY[y]]);
			for (let x = 0; x < keysX.length; ++x) {
				if (tempSavedOperations[keysY[y]] === undefined)
					tempSavedOperations[keysY[y]] = {};

				// @ts-ignore
				this.putElephantInDb(JSON.stringify(this.drawingOperations[keysY[y]][keysX[x]]), y, x);
			}
		}
	}

	GetOperations() {
		let operations = [];

		let keysY = Object.keys(this.drawingOperations);
		for (let y = 0; y < keysY.length; ++y) {
			let keysX = Object.keys(this.drawingOperations[keysY[y]]);
			for (let x = 0; x < keysX.length; ++x) {
				for (let i = 0; i < this.drawingOperations[keysY[y]][keysX[x]].length; ++i) {
					operations.push(this.drawingOperations[keysY[y]][keysX[x]][i]);
				}
			}
		}

		return operations;
	}

	handleEvent(e) {
		switch (e.type) {
			case 'success':
				if (e.target.result instanceof IDBDatabase) {
					this.db = this.request.result;

					this.db.onerror = function () {
						console.log("Error creating/accessing IndexedDB database");
					};

					// @ts-ignore
					if (this.db.setVersion) {
						if (this.db.version != this.dbVersion) {
							// @ts-ignore
							var setVersion = this.db.setVersion(this.dbVersion);
							setVersion.onsuccess = function () {
								this.createObjectStore(this.db);
								this.putElephantInDb();
							};
						}
						else {
							this.putElephantInDb();
						}
					}
					else {
						this.putElephantInDb();
					}
				} else if (this.loadOperationsDone !== true) {
					let jsonOperation = JSON.parse(e.target.result);
					this.loadOperationsDone[(jsonOperation[0].pos.y / 32) + '-' + (jsonOperation[0].pos.x / 32)] = true;

					for (let i = 0; i < jsonOperation.length; ++i) {
						let newSprite = JSON.parse(jsonOperation[i].canvasSprite);
						let drawingOperationTemp = new DrawingOperation(
							this,
							new Tile(
								new Vector2D(jsonOperation[i].pos.x, jsonOperation[i].pos.y),
								new Vector2D(newSprite.x, newSprite.y),
								new Vector2D(newSprite.width, newSprite.height),
								(newSprite.isTransparent !== undefined ? newSprite.isTransparent : false),
								newSprite.canvas
							),
							(jsonOperation[i].drawingCanvas === 'game-canvas' ? this.CanvasDrawer.mainCanvas : this.CanvasDrawer.GetAtlas(jsonOperation[i].drawingCanvas).GetCanvas()),
							this.CanvasDrawer.GetAtlas(jsonOperation[i].targetCanvas).GetCanvas()
						);
						this.drawingOperations[drawingOperationTemp.tile.position.y / 32][drawingOperationTemp.tile.position.x / 32].push(drawingOperationTemp);
					}

					let operationsLoaded = true;
					let keys = Object.keys(this.loadOperationsDone);
					for (let i = 0; i < keys.length; ++i) {
						if (this.loadOperationsDone[keys[i]] === false)
							operationsLoaded = false;
					}

					if (operationsLoaded === true) {
						this.loadOperationsDone = true;
						this.CanvasDrawer.drawingOperations = this.drawingOperations;// this.GetOperations();
					}
				}
				break;

			case 'upgradeneeded':
				if (e.target.result instanceof IDBDatabase) {
					//this.createObjectStore(e.target.result);
				}
				break;
		}
	}
}

/**
 * @class
 * @constructor
 */
class CanvasDrawer {
	//@ts-ignore
	static GCD = new CanvasDrawer(document.getElementById('game-canvas'), document.getElementById('sprite-objects-canvas'), document.getElementById('sprite-preview-canvas'),
		document.getElementById('game-gui-canvas'));

	/**
	 * Creates a new CanvasDrawer
	 * @param {HTMLCanvasElement} mainCanvas 
	 * @param {HTMLCanvasElement} spriteObjectCanvas 
	 * @param {HTMLCanvasElement} spritePreviewCanvas 
	 * @param {HTMLCanvasElement} gameGuiCanvas 
	 */
	constructor(mainCanvas, spriteObjectCanvas, spritePreviewCanvas, gameGuiCanvas) {
		/** @type {Vector2D} */ this.canvasOffset = new Vector2D(0, 0);
		/** @type {Brush} */ this.Brush = new Brush();
		/** @type {LightSystem} */ this.lightSystem = new LightSystem();
		/** @type {Array<AmbientLight>} */ this.lights = [];
		/** @type {AtlasController} */ this.atlasController = new AtlasController(this);
		/** @type {HTMLLabelElement} */ this.gridMouse = /** @type {HTMLLabelElement} */ (document.getElementById('grid-mouse'));
		/** @type {HTMLCanvasElement} */ this.mainCanvas = mainCanvas;
		//this.mainCanvas.setAttribute('width', 2560);
		//this.mainCanvas.setAttribute('height', 1440);
		//this.mainCanvas.style.width = '2560px';
		//this.mainCanvas.style.height = '1440px';

		/** @type {CanvasRenderingContext2D} */ this.mainCanvasCtx = this.mainCanvas.getContext('2d');
		this.mainCanvasCtx.imageSmoothingEnabled = false;

		/** @type {HTMLCanvasElement} */ this.frameBuffer = document.createElement('canvas');
		this.frameBuffer.setAttribute('width', this.mainCanvas.getAttribute('width'));
		this.frameBuffer.setAttribute('height', this.mainCanvas.getAttribute('height'));
		document.getElementById('container-framebuffers').appendChild(this.frameBuffer);

		/** @type {CanvasRenderingContext2D} */ this.frameBufferCtx = this.frameBuffer.getContext('2d');
		this.frameBufferCtx.imageSmoothingEnabled = false;

		/** @type {HTMLCanvasElement} */ this.frameBufferTerrain = document.createElement('canvas');
		this.frameBufferTerrain.setAttribute('width', this.mainCanvas.getAttribute('width'));
		this.frameBufferTerrain.setAttribute('height', this.mainCanvas.getAttribute('height'));
		document.getElementById('container-framebuffers').appendChild(this.frameBufferTerrain);

		/** @type {CanvasRenderingContext2D} */ this.frameBufferTerrainCtx = this.frameBufferTerrain.getContext('2d');
		this.frameBufferTerrainCtx.imageSmoothingEnabled = false;

		/** @type {HTMLCanvasElement} */ this.spriteObjectCanvas = spriteObjectCanvas;
		/** @type {CanvasRenderingContext2D} */ this.spriteObjectCanvasCtx = this.spriteObjectCanvas.getContext('2d');
		this.spriteObjectCanvasCtx.imageSmoothingEnabled = false;

		/** @type {HTMLCanvasElement} */ this.spritePreviewCanvas = spritePreviewCanvas;
		/** @type {CanvasRenderingContext2D} */ this.spritePreviewCanvasCtx = this.spritePreviewCanvas.getContext('2d');
		this.spritePreviewCanvasCtx.imageSmoothingEnabled = false;

		/** @type {HTMLCanvasElement} */ this.gameGuiCanvas = gameGuiCanvas;
		/** @type {CanvasRenderingContext2D} */ this.gameGuiCanvasCtx = this.gameGuiCanvas.getContext('2d');
		this.gameGuiCanvasCtx.imageSmoothingEnabled = false;

		/** @type {Object.<string, Object<string, DrawingOperation[]>>}*/ this.drawingOperations = {};
		/** @type {LightingOperation[]} */ this.lightingOperations = [];
		/** @type {DrawingOperation[]} */ this.terrainPreviewOperations = [];
		/** @type {DrawingOperation[]} */ this.terrainNeedsRedrawOperations = [];

		for (let y = (Math.ceil(this.mainCanvas.height / 32)) * -1; y < Math.ceil(this.mainCanvas.height / 32); ++y) {
			this.drawingOperations[y] = {};
			for (let x = Math.ceil(this.mainCanvas.width / 32) * -1; x < Math.ceil(this.mainCanvas.width / 32); ++x) {
				this.drawingOperations[y][x] = [];
			}
		}

		/** @type {Operations[]} */ this.gameObjectDrawingOperations = [];
		/** @type {Operations[]} */ this.gameObjectDrawingOperationsUpdate = [];
		/** @type {DrawingOperation[]} */ this.effectsDrawingOperations = [];
		/** @type {ClearOperation[]} */ this.clearOperations = [];
		/** @type {TextOperation[]} */ this.guiDrawingOperations = [];
		/** @type {(Tile|Tile[])} */ this.selectedSprite;
		/** @type {boolean} */ this.isMouseDown = false;
		/** @type {boolean} */ this.isPainting = false;
		/** @type {boolean} */ this.paintingEnabled = false;
		/** @type {Vector2D} */ this.lastAtlasCoords = new Vector2D(0, 0);

		this.mainCanvas.addEventListener('mouseup', this);
		this.mainCanvas.addEventListener('mousedown', this);
		this.mainCanvas.addEventListener('mousemove', this);
		this.mainCanvas.addEventListener('mouseleave', this);
		document.getElementById('brush-draw-state').addEventListener('change', this);
		document.getElementById('save-canvas').addEventListener('click', this);
		document.getElementById('enable-painting').addEventListener('click', this);

		/** @type {DebugDrawer} */ this.DebugDrawer = new DebugDrawer();
		/** @type {UIDrawer} */ this.UIDrawer = new UIDrawer('uipieces', this);

		this.atlasController.LoadAllAtlases();

		/** @type {BoxCollision} */ this.ClearBoxCollision = new BoxCollision(new Vector2D(0, 0), new Vector2D(32, 32), false, this, false);
		/** @type {Rectangle} */ this.cameraRect = new Rectangle(0, 0, this.mainCanvas.width, this.mainCanvas.height);
		/** @type {Rectangle} */ this.lastCameraRect = new Rectangle(0, 0, this.mainCanvas.width, this.mainCanvas.height);
		/** @type {RectOperation} */ this.tileCursorPreview;
		/** @type {boolean} */ this.drawTileCursorPreview = false;
		/** @type {Vector2D} */ this.mousePosition = new Vector2D(0, 0);

		this.BeginAtlasesLoaded();
		this.DrawTilePreview();
	}

	LoadWorldTiles() {
		let keysY = Object.keys(worldTiles);
		let tileSize = new Vector2D(32, 32);

		let fixDuplicates = {};
		for (let y = 0; y < keysY.length; ++y) {
			let keysX = Object.keys(worldTiles[keysY[y]]);
			for (let x = 0; x < keysX.length; ++x) {
				let tilesArr = worldTiles[keysY[y]][keysX[x]];
				for (let i = 0; i < tilesArr.length; ++i) {
					let newTile = tilesArr[i];

					if (TileLUT[newTile.t.lut[0]] === undefined || TileLUT[newTile.t.lut[0]][newTile.t.lut[1]] === undefined || TileLUT[newTile.t.lut[0]][newTile.t.lut[1]][newTile.t.lut[2]] === undefined)
						continue;

					let tileLUT = TileLUT[newTile.t.lut[0]][newTile.t.lut[1]][newTile.t.lut[2]];

					if (newTile.tc === undefined)
						newTile.tc = tileLUT.atlas;

					if (newTile.dc === undefined)
						newTile.dc = 'game-canvas';

					if (tilesArr[i].drawingCanvas !== 'sprite-preview-canvas') {

						let drawingOperationTemp = new DrawingOperation(
							this,
							new Tile(
								new Vector2D(newTile.t.p.x, newTile.t.p.y),
								new Vector2D(tileLUT.tilePosition.x, tileLUT.tilePosition.y),
								tileLUT.size !== undefined ? new Vector2D(tileLUT.size.x, tileLUT.size.y) : tileSize,
								(tileLUT.transparent !== undefined ? tileLUT.transparent : false),
								tileLUT.atlas,
								0,
								tileLUT.tileType,
								tileLUT.tileTerrain
							),
							(newTile.dc === undefined || newTile.dc === 'game-canvas' || newTile.dc === '' ? this.frameBufferTerrain : this.atlasController.GetAtlas(newTile.dc).GetCanvas()),
							this.atlasController.GetAtlas(newTile.tc).GetCanvas(),
							OperationType.terrain
						);

						let check = drawingOperationTemp.tile.position.y + '-' + drawingOperationTemp.tile.position.x;
						check += '-' + drawingOperationTemp.tile.tilePosition.y + '-' + drawingOperationTemp.tile.tilePosition.x;
						check += '-' + drawingOperationTemp.tile.tileType + '-' + drawingOperationTemp.tile.tileULDR + '-' + drawingOperationTemp.tile.tileSet;

						if (fixDuplicates[check] == undefined) {
							if (this.drawingOperations[drawingOperationTemp.tile.position.y / 32] === undefined)
								this.drawingOperations[drawingOperationTemp.tile.position.y / 32] = {};

							if (this.drawingOperations[drawingOperationTemp.tile.position.y / 32][drawingOperationTemp.tile.position.x / 32] === undefined)
								this.drawingOperations[drawingOperationTemp.tile.position.y / 32][drawingOperationTemp.tile.position.x / 32] = [];

							this.drawingOperations[drawingOperationTemp.tile.position.y / 32][drawingOperationTemp.tile.position.x / 32].push(drawingOperationTemp);
							fixDuplicates[check] = true;
						}
					}
				}
			}
		}
	}

	BeginAtlasesLoaded() {
		if (this.atlasController.isLoadingFinished === true) {
			this.LoadWorldTiles();
			this.atlasController.isLoadingFinished = null;
		} else {
			window.requestAnimationFrame(() => this.BeginAtlasesLoaded());
		}
	}

	/**
	 * 
	 * @param {Tile} tile 
	 */
	SetSelection(tile) {
		if (tile === undefined) {
			this.spritePreviewCanvasCtx.clearRect(0, 0, this.spritePreviewCanvas.width, this.spritePreviewCanvas.height);
			this.selectedSprite = undefined;
		} else {
			if (InputHandler.GIH.inputs['leftCtrl'].state === 0 || InputHandler.GIH.inputs['leftCtrl'].state === 1) {
				if (this.selectedSprite instanceof Array)
					this.selectedSprite = [];

				/** @type {Array<Tile>}*/(this.selectedSprite).push(tile);
			} else {
				this.selectedSprite = tile;
			}

			TileData.tileData.SelectionLoop();
		}
	}

	CheckIfFinishedLoading() {
		if (AtlasController._Instance.isLoadingFinished === false) {
			let isFinished = true;
			let keys = Object.keys(AtlasController._Instance.hasLoadedAllImages);

			for (let i = 0; i < keys.length; ++i) {
				if (AtlasController._Instance.hasLoadedAllImages[keys[i]] == false)
					isFinished = false;
			}

			AtlasController._Instance.isLoadingFinished = isFinished;
		}
	}

	DrawTilePreview() {
		if (this.tileCursorPreview === undefined) {
			this.tileCursorPreview = new RectOperation(
				new Vector2D(0, 0),
				new Vector2D(32, 32),
				this.DebugDrawer.gameDebugCanvas,
				'red',
				true
			);
			this.AddDrawOperation(this.tileCursorPreview, OperationType.gameObjects);
		} else {
			this.tileCursorPreview.Update(this.mousePosition);
			this.tileCursorPreview.position.SnapToGridF(32);
		}
	}

	/**
	 * 
	 * @param {Vector2D} mousePosition 
	 */
	UpdateTilePreview(mousePosition) {
		if (this.tileCursorPreview === undefined)
			return;

		let temp = mousePosition.Clone();
		let tempMouse = mousePosition.Clone();

		temp.Add(this.canvasOffset);
		temp.SnapToGridF(32);

		let characterPos = MasterObject.MO.playerController.playerCharacter.BoxCollision.GetRealCenterPosition();
		tempMouse.Add(this.canvasOffset);
		if (tempMouse.Distance(characterPos) > 96.0)
			temp = characterPos.LerpValue(tempMouse, 96.0);

		this.tileCursorPreview.Update(this.tileCursorPreview.position);
		this.tileCursorPreview.drawingCanvas = this.DebugDrawer.gameDebugCanvas;

		this.tileCursorPreview.position.Set(temp);
		this.mousePosition.x = tempMouse.x;
		this.mousePosition.y = tempMouse.y;
		this.tileCursorPreview.position.ToGrid(32);
		this.tileCursorPreview.position.MultF(32);
		//this.tileCursorPreview.position.Sub(this.canvasOffset);
	}

	GameBegin() {
		this.DrawTerrain();
		this.UIDrawer.AddUIElements();

		this.lights = [
			new AmbientLight(
				new Vector2D(188, 271),
				new Color(255, 165, 48),
				512,
				1000,
				1.0,
				800,
				0.01,
				0.04,
				1,
				LightFalloffType.InverseSquareLaw
			),
			new AmbientLight(
				new Vector2D(188, 791),
				new Color(255, 165, 48),
				512,
				1000,
				1.0,
				800,
				0.01,
				0.04,
				1,
				LightFalloffType.InverseSquareLaw
			),
			new AmbientLight(
				new Vector2D(512, 1584),
				new Color(255, 165, 48),
				512,
				1000,
				1.0,
				800,
				0.01,
				0.04,
				1,
				LightFalloffType.InverseSquareLaw
			),
			new AmbientLight(
				new Vector2D(1024, 1024),
				Color.ColorToRGBA('orange'),
				256,
				600,
				1.0,
				700,
				4.2,
				0.000004,
				1,
				LightFalloffType.InverseSquareLaw
			),
			new AmbientLight(
				new Vector2D(577, 524),
				Color.ColorToRGBA('orange'),
				384,
				1000,
				1.0,
				700,
				4.2,
				0.000004,
				1,
				LightFalloffType.InverseSquareLaw
			)
		];
	}

	DrawTerrain() {
		//let tempDrawingOperations = this.GetOperations();
		let cameraRect = MasterObject.MO.playerController.playerCamera.GetRect();
		this.canvasOffset.x = Math.floor(cameraRect.x);
		this.canvasOffset.y = Math.floor(cameraRect.y);
		let playerPos = MasterObject.MO.playerController.playerCharacter.GetPosition().Clone();
		playerPos.SnapToGridF(32);
		let yMin = Math.floor((playerPos.y - (this.mainCanvas.height * 0.5)) / 32),
			xMin = Math.floor((playerPos.x - (this.mainCanvas.width * 0.5)) / 32),
			yMax = (Math.ceil((this.mainCanvas.height / 32)) + yMin) + 1,
			xMax = (Math.ceil((this.mainCanvas.width / 32)) + xMin) + 1;

		this.DrawTerrainXYWH(xMin, yMin, xMax, yMax);
	}

	DrawTerrainLoop() {
		let direction = new Vector2D(this.cameraRect.x - this.lastCameraRect.x, this.cameraRect.y - this.lastCameraRect.y),
			yMin = Math.floor(this.cameraRect.y / 32),
			xMin = Math.floor(this.cameraRect.x / 32),
			yMax = (Math.ceil((this.mainCanvas.height / 32)) + yMin) + 1,
			xMax = (Math.ceil((this.mainCanvas.width / 32)) + xMin) + 1;

		if (direction.y < 0) {
			this.DrawTerrainXYWH(xMin, yMin, xMax, yMin + 2);
		} else if (direction.y > 0) {
			this.DrawTerrainXYWH(xMin, yMax - 2, xMax, yMax);
		}
		if (direction.x < 0) {
			this.DrawTerrainXYWH(xMin, yMin, xMin + 2, yMax);
		} else if (direction.x > 0) {
			this.DrawTerrainXYWH(xMax - 2, yMin, xMax, yMax);
		}
	}

	/**
	 * 
	 * @param {number} xMin 
	 * @param {number} yMin 
	 * @param {number} xMax 
	 * @param {number} yMax 
	 */
	DrawTerrainXYWH(xMin, yMin, xMax, yMax) {
		let terrainOperation = undefined,
			x = xMin,
			y = yMin,
			i = 0,
			iL = 0;

			

		for (y = yMin; y < yMax; ++y) {
			if (this.drawingOperations[y] !== undefined) {
				for (x = xMin; x < xMax; ++x) {
					if (this.drawingOperations[y][x] !== undefined) {
						for (i = 0, iL = this.drawingOperations[y][x].length; i < iL; ++i) {
							terrainOperation = this.drawingOperations[y][x][i];

							this.frameBufferTerrainCtx.drawImage(
								terrainOperation.targetCanvas,
								terrainOperation.tile.GetPosX(),
								terrainOperation.tile.GetPosY(),
								terrainOperation.tile.size.x,
								terrainOperation.tile.size.y,
								Math.floor(terrainOperation.tile.position.x - this.canvasOffset.x),
								Math.floor(terrainOperation.tile.position.y - this.canvasOffset.y),
								terrainOperation.GetDrawSize().x,
								terrainOperation.GetDrawSize().y
							)
						}
					}
				}
			}
		}
	}

	/**
	 * 
	 * @param {number} delta 
	 */
	DrawGameObjectsLoop(delta) {
		this.lightingOperations.sort(sortLightingOperations);
		for (let i = 0, l = this.lightingOperations.length; i < l; ++i) {
			const tObject = this.lightingOperations[i];

			if (this.cameraRect.Equal(this.lastCameraRect) === false) {
				tObject.FrustumCulling(this.cameraRect);
			}
		}

		this.gameObjectDrawingOperations.sort(sortDrawOperations);
		for (let i = 0, l = this.gameObjectDrawingOperations.length; i < l; ++i) {
			const tObject = this.gameObjectDrawingOperations[i];

			switch (tObject.ClassType) {
				case 'DrawingOperation':
					if (this.cameraRect.Equal(this.lastCameraRect) === false) {
						tObject.FrustumCulling(this.cameraRect);
					}
					break;
				case 'LightingOperation':
					if (this.cameraRect.Equal(this.lastCameraRect) === false) {
						tObject.FrustumCulling(this.cameraRect);
					}
					break;
			}
		}

		for (let i = 0, l = this.clearOperations.length; i < l; ++i) {
			this.ClearCanvas(this.clearOperations[i]);
		}
		this.clearOperations = [];

		for (let i = 0, l = this.lightingOperations.length; i < l; ++i) {
			const tObject = this.lightingOperations[i];

			if (tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
				this.ClearCanvas(tObject);
		}

		for (let i = 0, l = this.gameObjectDrawingOperations.length; i < l; ++i) {
			let tObject = this.gameObjectDrawingOperations[i];

			switch (tObject.ClassType) {
				case 'DrawingOperation':
					if (tObject.tile !== undefined && tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
						this.ClearCanvas(tObject);
					break;
				case 'RectOperation':
					if (tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
						this.ClearCanvas(tObject);
					break;
				case 'PathOperation':
					if (tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
						this.ClearCanvas(tObject);
					break;
				case 'LightingOperation':
					if (tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
						this.ClearCanvas(tObject);
					break;
			}
		}

		this.gameObjectDrawingOperationsUpdate.sort(sortDrawOperations);
		for (let i = 0, l = this.gameObjectDrawingOperationsUpdate.length; i < l; ++i) {
			this.ClearCanvasUpdateRects(this.gameObjectDrawingOperationsUpdate[i]);
		}
		this.gameObjectDrawingOperationsUpdate = [];

		for (let i = 0, l = this.lightingOperations.length; i < l; ++i) {
			const tObject = this.lightingOperations[i];

			if (tObject.shouldDelete === true) {
				this.lightingOperations.splice(i, 1);
				i--;
				l--;
			} else {
				if (tObject.DrawState() === true && tObject.frustumCulled === false || tObject.updateRects !== undefined) {
					this.DrawOnCanvas(tObject);
				}
			}
		}

		if (CanvasDrawer.GCD.lightSystem.lightingV2Ctx.globalCompositeOperation !== 'source-atop')
			CanvasDrawer.GCD.lightSystem.lightingV2Ctx.globalCompositeOperation = 'source-atop';

		for (let i = 0, l = this.gameObjectDrawingOperations.length; i < l; ++i) {
			const tObject = this.gameObjectDrawingOperations[i];

			if (tObject.shouldDelete === true) {
				this.gameObjectDrawingOperations.splice(i, 1);
				i--;
				l--;
			} else {
				switch (tObject.ClassType) {
					case 'DrawingOperation':
						if (tObject.tile !== undefined && tObject.DrawState() === true && tObject.frustumCulled === false && tObject.shouldDelete === false || tObject.updateRects !== undefined) {
							this.DrawOnCanvas(tObject);
						}
						break;
					case 'TextOperation':
						this.DrawOnCanvas(tObject);
						break;
					case 'RectOperation':
						this.DrawOnCanvas(tObject, delta);
						break;
					case 'PathOperation':
						if (tObject.DrawState() === true) {
							this.DrawOnCanvas(tObject);
						}
						break;
					case 'LightingOperation':
						if (tObject.DrawState() === true && tObject.frustumCulled === false || tObject.updateRects !== undefined) {
							this.DrawOnCanvas(tObject);
						}
						break;
				}
			}
		}
	}

	ClearEffectsLoop() {
		for (let i = 0, l = this.effectsDrawingOperations.length; i < l; ++i) {
			if (this.effectsDrawingOperations[i] instanceof DrawingOperation && this.effectsDrawingOperations[i].tile !== undefined || this.effectsDrawingOperations[i].shouldDelete === true)
				this.ClearCanvas(this.effectsDrawingOperations[i]);
		}
	}

	DrawEffectsLoop() {
		for (let i = 0, l = this.effectsDrawingOperations.length; i < l; ++i) {
			if (this.effectsDrawingOperations[i].shouldDelete === true) {
				this.effectsDrawingOperations.splice(i, 1);
				i--;
				l--;
			} else {
				if (this.effectsDrawingOperations[i].tile !== undefined) {
					if (this.effectsDrawingOperations[i].DrawState() === true && this.effectsDrawingOperations[i].shouldDelete === false || this.effectsDrawingOperations[i].updateRects !== undefined) {
						this.DrawOnCanvas(this.effectsDrawingOperations[i]);
					}
				}
			}
		}
	}

	/**
	 * 
	 * @param {number} delta 
	 */
	DrawGUILoop(delta) {
		this.UIDrawer.AddUIElements(delta);
		this.gameGuiCanvasCtx.clearRect(0, 0, this.gameGuiCanvas.width, this.gameGuiCanvas.height);

		for (let i = 0, l = this.guiDrawingOperations.length; i < l; ++i) {
			if (this.guiDrawingOperations[i].shouldDelete === true) {
				this.guiDrawingOperations.splice(i, 1);
				i--;
				l--;
			} else if (this.guiDrawingOperations[i].DrawState() === true) {
				this.DrawOnCanvas(this.guiDrawingOperations[i]);
			}
		}
	}

	DrawLoop() {
		let delta = Mastertime.Delta();

		this.tileCursorPreview.needsToBeRedrawn = this.drawTileCursorPreview;

		this.spritePreviewCanvasCtx.clearRect(0, 0, this.spritePreviewCanvas.width, this.spritePreviewCanvas.height);
		if (PropEditor.GPEditor.selectedProp === undefined) {
			let posCoords = new Vector2D(this.lastAtlasCoords.x, this.lastAtlasCoords.y);

			posCoords.MultF(32);
			posCoords.x += Math.abs((this.canvasOffset.x % 32));
			posCoords.y += Math.abs((this.canvasOffset.y % 32));
			this.UpdateSpritePreview(posCoords);
		}

		for (let i = 0; i < this.terrainPreviewOperations.length; ++i) {
			this.DrawOnCanvas(this.terrainPreviewOperations[i]);
		}
		this.terrainPreviewOperations = [];

		for (let i = 0; i < this.terrainNeedsRedrawOperations.length; ++i) {
			this.terrainNeedsRedrawOperations[i].Update();
			this.DrawOnCanvas(this.terrainNeedsRedrawOperations[i]);
		}
		this.terrainNeedsRedrawOperations = [];

		if (this.cameraRect.Equal(this.lastCameraRect) === false)
			this.DrawTerrainLoop();

		this.ClearEffectsLoop();
		//this.DrawDebugLoop(delta);
		this.DrawGameObjectsLoop(delta);
		this.DrawEffectsLoop();
		this.DrawGUILoop(delta);
		this.DebugDrawer.DrawDebugLoop(delta);
	}

	/**
	 * 
	 * @param {Rectangle} cameraRect 
	 */
	static DrawToMain(cameraRect) {
		//CanvasDrawer.GCD.DrawToMain(cameraRect);
		let canvasWidth = CanvasDrawer.GCD.mainCanvas.width,
			canvasHeight = CanvasDrawer.GCD.mainCanvas.height,
			offsetX = CanvasDrawer.GCD.canvasOffset.x - cameraRect.x,
			offsetY = CanvasDrawer.GCD.canvasOffset.y - cameraRect.y;

		CanvasDrawer.GCD.frameBufferCtx.globalCompositeOperation = 'copy';
		CanvasDrawer.GCD.frameBufferCtx.drawImage(
			CanvasDrawer.GCD.frameBuffer,
			0,
			0,
			canvasWidth,
			canvasHeight,
			offsetX,
			offsetY,
			canvasWidth,
			canvasHeight
		);
		CanvasDrawer.GCD.frameBufferCtx.globalCompositeOperation = 'source-over';

		CanvasDrawer.GCD.frameBufferTerrainCtx.globalCompositeOperation = 'copy';
		CanvasDrawer.GCD.frameBufferTerrainCtx.drawImage(
			CanvasDrawer.GCD.frameBufferTerrain,
			0,
			0,
			canvasWidth,
			canvasHeight,
			offsetX,
			offsetY,
			canvasWidth,
			canvasHeight
		);
		CanvasDrawer.GCD.frameBufferTerrainCtx.globalCompositeOperation = 'source-over';

		CanvasDrawer.GCD.lightSystem.lightingV2Ctx.globalCompositeOperation = 'copy';
		CanvasDrawer.GCD.lightSystem.lightingV2Ctx.drawImage(
			CanvasDrawer.GCD.lightSystem.lightingV2,
			0,
			0,
			canvasWidth,
			canvasHeight,
			offsetX,
			offsetY,
			canvasWidth,
			canvasHeight
		);
		CanvasDrawer.GCD.lightSystem.lightingV2Ctx.globalCompositeOperation = 'source-in';

		CanvasDrawer.GCD.DebugDrawer.gameDebugCanvasCtx.globalCompositeOperation = 'copy';
		CanvasDrawer.GCD.DebugDrawer.gameDebugCanvasCtx.drawImage(
			CanvasDrawer.GCD.DebugDrawer.gameDebugCanvas,
			0,
			0,
			canvasWidth,
			canvasHeight,
			offsetX,
			offsetY,
			canvasWidth,
			canvasHeight
		);
		CanvasDrawer.GCD.DebugDrawer.gameDebugCanvasCtx.globalCompositeOperation = 'source-over';

		CanvasDrawer.GCD.lastCameraRect.x = CanvasDrawer.GCD.cameraRect.x;
		CanvasDrawer.GCD.lastCameraRect.y = CanvasDrawer.GCD.cameraRect.y;
		CanvasDrawer.GCD.lastCameraRect.w = CanvasDrawer.GCD.cameraRect.w;
		CanvasDrawer.GCD.lastCameraRect.h = CanvasDrawer.GCD.cameraRect.h;
		CanvasDrawer.GCD.cameraRect.x = cameraRect.x;
		CanvasDrawer.GCD.cameraRect.y = cameraRect.y;
		CanvasDrawer.GCD.cameraRect.w = cameraRect.w;
		CanvasDrawer.GCD.cameraRect.h = cameraRect.h;

		CanvasDrawer.GCD.mainCanvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
		CanvasDrawer.GCD.mainCanvasCtx.drawImage(CanvasDrawer.GCD.frameBufferTerrain, 0, 0);
		CanvasDrawer.GCD.mainCanvasCtx.drawImage(CanvasDrawer.GCD.frameBuffer, 0, 0);

		CanvasDrawer.GCD.mainCanvasCtx.globalCompositeOperation = 'multiply';
		CanvasDrawer.GCD.lightSystem.UpdateCanvas();

		CanvasDrawer.GCD.mainCanvasCtx.drawImage(CanvasDrawer.GCD.lightSystem.ambientFrameBuffer, 0, 0);
		CanvasDrawer.GCD.mainCanvasCtx.globalCompositeOperation = 'source-over';

		CanvasDrawer.GCD.mainCanvasCtx.drawImage(CanvasDrawer.GCD.DebugDrawer.gameDebugCanvas, 0, 0);

		CanvasDrawer.GCD.canvasOffset = new Vector2D(cameraRect.x, cameraRect.y);
		CanvasDrawer.GCD.DebugDrawer.SetOffset(CanvasDrawer.GCD.canvasOffset);
	}

	GetOperations() {
		let operations = [];

		let keysY = Object.keys(this.drawingOperations);
		for (let y = 0, yL = keysY.length; y < yL; ++y) {
			let keysX = Object.keys(this.drawingOperations[keysY[y]]);
			for (let x = 0, xL = keysX.length; x < xL; ++x) {
				for (let i = 0, l = this.drawingOperations[keysY[y]][keysX[x]].length; i < l; ++i) {
					if (this.drawingOperations[keysY[y]][keysX[x]][i].DrawState() === true)
						operations.push(this.drawingOperations[keysY[y]][keysX[x]][i]);
				}
			}
		}

		return operations;
	}

	UpdateDrawingOperations(operations) {
		if (operations.length < 1)
			return;

		//this.canvasSave.UpdateOperation(operations);
	}

	/**
	 * 
	 * @param {HTMLCanvasElement} drawingCanvas 
	 * @param {Rectangle} rect 
	 */
	AddClearOperation(drawingCanvas, rect) {
		this.clearOperations.push(new ClearOperation(drawingCanvas, rect));
	}

	/**
	 * 
	 * @param {Operations} drawingOperation 
	 */
	ClearCanvasUpdateRects(drawingOperation) {
		switch (drawingOperation.ClassType) {
			case 'DrawingOperation':
			case 'LightingOperation':
			case 'RectOperation':
				if (drawingOperation.updateRects !== undefined) {
					for (let i = 0, l = drawingOperation.updateRects.length; i < l; ++i) {
						if (drawingOperation instanceof LightingOperation)
							continue;

						drawingOperation.drawingCanvas.getContext('2d').clearRect(drawingOperation.updateRects[i].x - this.canvasOffset.x, drawingOperation.updateRects[i].y - this.canvasOffset.y, drawingOperation.updateRects[i].w, drawingOperation.updateRects[i].h);
					}
				}
				break;
		}
	}

	/**
	 * Clears the canvas from the drawing operation using the old position to clear the previous drawing.
	 * @param {Operations} drawingOperation 
	 * @returns {void}
	 */
	ClearCanvas(drawingOperation) {
		if (drawingOperation instanceof DrawingOperation) {
			if (drawingOperation.tile === undefined || (drawingOperation.tile !== undefined && this.atlasController.GetAtlas(drawingOperation.tile.atlas) === undefined && drawingOperation.targetCanvas === undefined)) {
				return;
			}
		}

		drawingOperation.isVisible = false;
		let oldPosition = drawingOperation.GetPreviousPosition(),
			size = new Vector2D(0, 0),
			ctx = drawingOperation.drawingCanvas.getContext('2d');

		oldPosition.Floor();

		switch (drawingOperation.ClassType) {
			case 'DrawingOperation':
				size.Set(drawingOperation.tile.size);
				size.Floor();

				ctx.clearRect(oldPosition.x - this.canvasOffset.x, oldPosition.y - this.canvasOffset.y, size.x, size.y);
				CanvasDrawer.GCD.lightSystem.lightingV2Ctx.clearRect(oldPosition.x - this.canvasOffset.x, oldPosition.y - this.canvasOffset.y, size.x, size.y);

				this.CheckClearOverlapping(oldPosition.x, oldPosition.y, size.x, size.y, drawingOperation);
				break;

			case 'TextOperation':
				size.SetF(drawingOperation.GetSize());
				ctx.clearRect(oldPosition.x - 5, oldPosition.y - 5, size.x + 5, size.y + 5);
				break;

			case 'RectOperation':
				size.Set(drawingOperation.GetSize());
				ctx.clearRect(oldPosition.x, oldPosition.y, size.x, size.y);
				ctx.clearRect(drawingOperation.position.x, drawingOperation.position.y, size.x, size.y);
				break;

			case 'ClearOperation':
				ctx.clearRect(drawingOperation.rectangle.x, drawingOperation.rectangle.y, drawingOperation.rectangle.w, drawingOperation.rectangle.h);
				this.CheckClearOverlapping(drawingOperation.rectangle.x, drawingOperation.rectangle.y, drawingOperation.rectangle.w, drawingOperation.rectangle.h);
				break;

			case 'PathOperation':
				let boundingBox = Polygon.CalculateBoundingBox(drawingOperation.path);
				boundingBox.x -= 1;
				boundingBox.y -= 1;
				boundingBox.w += 2;
				boundingBox.h += 2;
				ctx.clearRect(boundingBox.x, boundingBox.y, boundingBox.w, boundingBox.h);
				break;

			case 'LightingOperation':
				let sizeF = drawingOperation.GetSize();
				CanvasDrawer.GCD.lightSystem.lightingV2Ctx.clearRect(
					(drawingOperation.light.position.x - drawingOperation.light.halfAttenuation) - this.canvasOffset.x,
					(drawingOperation.light.position.y - drawingOperation.light.halfAttenuation) - this.canvasOffset.y,
					drawingOperation.light.attenuation,
					drawingOperation.light.attenuation
				);

				this.CheckClearOverlapping(drawingOperation.position.x - (sizeF * 0.5), drawingOperation.position.y - (sizeF * 0.5), sizeF, sizeF, drawingOperation);
				break;
		}
	}

	/**
	 * Checks for any overlaps in a rectangle defined by the position and size
	 * @param {number} positionX
	 * @param {number} positionY
	 * @param {number} sizeX
	 * @param {number} sizeY
	 * @param {(DrawingOperation|LightingOperation)} drawingOperation 
	 * @returns {void}
	 */
	CheckClearOverlapping(positionX, positionY, sizeX, sizeY, drawingOperation = undefined) {
		if (positionX === undefined || sizeX === undefined)
			return;

		this.ClearBoxCollision.position.x = positionX;
		this.ClearBoxCollision.position.y = positionY;
		this.ClearBoxCollision.size.x = sizeX;
		this.ClearBoxCollision.size.y = sizeY;
		this.ClearBoxCollision.CalculateBoundingBox();

		if (drawingOperation !== undefined)
			this.ClearBoxCollision.collisionOwner = drawingOperation.owner !== undefined ? drawingOperation.owner : this;

		let rectA = new Rectangle(positionX, positionY, sizeX, sizeY);
		rectA.Floor();
		let overlaps = CollisionHandler.GCH.GetOverlaps(this.ClearBoxCollision, OverlapOICheck, CollisionTypeCheck.Overlap);

		//DebugDrawer.AddDebugRectOperation(rectA, 0.016, Color.CSS_COLOR_TABLE.firebrick, true);
		let rectB = new Rectangle(0, 0, 0, 0);

		for (let i = 0, l = overlaps.length; i < l; ++i) {
			if (overlaps[i].collisionOwner !== undefined && overlaps[i].collisionOwner !== null && overlaps[i].collisionOwner.drawingOperation !== undefined && overlaps[i].collisionOwner.drawingOperation !== null) {
				rectB.Copy(overlaps[i].boundingBox);
				rectB.Floor();
				//rectB.UpdateCornersData();

				if (rectA !== undefined && rectB !== undefined) {
					let intersection = rectA.GetIntersection(rectB);

					if (intersection !== undefined) {
						intersection.Floor();

						if (drawingOperation !== undefined && drawingOperation instanceof LightingOperation) {
							if (overlaps[i].collisionOwner.drawingOperation.shadowOperation !== undefined)
								if (overlaps[i].collisionOwner.drawingOperation.shadowOperation.drawType !== BWDrawingType.None)
									if (drawingOperation.position.y > overlaps[i].collisionOwner.drawingOperation.GetDrawPositionY())
										overlaps[i].collisionOwner.drawingOperation.shadowOperation.drawType = BWDrawingType.Behind;
						}

						if (overlaps[i].collisionOwner.drawingOperation !== undefined && overlaps[i].collisionOwner.drawingOperation instanceof LightingOperation) {
							if (drawingOperation !== undefined && drawingOperation instanceof DrawingOperation) {
								if (drawingOperation.shadowOperation !== undefined && drawingOperation.shadowOperation.drawType !== BWDrawingType.None) {
									if (drawingOperation.GetDrawPositionY() > overlaps[i].collisionOwner.drawingOperation.position.y)
										drawingOperation.shadowOperation.drawType = BWDrawingType.Front;
									else
										drawingOperation.shadowOperation.drawType = BWDrawingType.Behind;
								}
							}
						}

						if (intersection.Equal(rectB) === true) {
							overlaps[i].collisionOwner.drawingOperation.UpdateDrawState(true);
						}/* else if (overlaps[i].collisionOwner.drawingOperation instanceof LightingOperation && drawingOperation !== undefined && drawingOperation instanceof LightingOperation) {
							overlaps[i].collisionOwner.drawingOperation.AddUpdateRect(
								intersection,
								drawingOperation.light,
								new Rectangle(
									intersection.x - (drawingOperation.light.position.x - drawingOperation.light.halfAttenuation),
									intersection.y - (drawingOperation.light.position.y - drawingOperation.light.halfAttenuation),
									intersection.w,
									intersection.h
								)
							);
							overlaps[i].collisionOwner.drawingOperation.isVisible = false;
						}*/ else {
							overlaps[i].collisionOwner.drawingOperation.AddUpdateRect(intersection);
							overlaps[i].collisionOwner.drawingOperation.isVisible = false;
						}

						if (this.gameObjectDrawingOperationsUpdate.indexOf(overlaps[i].collisionOwner.drawingOperation) === -1)
							this.gameObjectDrawingOperationsUpdate.push(overlaps[i].collisionOwner.drawingOperation);

						//DebugDrawer.AddDebugRectOperation(intersection, 0.016, CMath.CSS_COLOR_NAMES[40], true);
					}
				}
			}
		}
	}

	/**
	 * 
	 * @param {number} y 
	 * @param {number} x 
	 * @param {number} i 
	 */
	RemoveOperation(y, x, i) {
		if (this.drawingOperations[y] !== undefined && this.drawingOperations[y][x] !== undefined && this.drawingOperations[y][x][i] !== undefined) {
			this.drawingOperations[y][x].splice(i, 1);
		}
	}

	/**
	 * Draws the drawing operation on the canvas in the operation
	 * @param {Operations} drawingOperation 
	 * @param {number} delta 
	 * @returns {void}
	 */
	DrawOnCanvas(drawingOperation, delta = 0) {
		if (drawingOperation === this.tileCursorPreview && this.drawTileCursorPreview === false)
			return;

		if (drawingOperation instanceof DrawingOperation) {
			if ((drawingOperation.tile == undefined || this.atlasController.GetAtlas(drawingOperation.tile.atlas) === undefined) && drawingOperation.targetCanvas === undefined)
				return;

			if (drawingOperation.targetCanvas === undefined || this.mainCanvasCtx === undefined)
				return;
		}

		let context = drawingOperation.drawingCanvas.getContext('2d');

		drawingOperation.isVisible = true;
		switch (drawingOperation.ClassType) {
			case 'DrawingOperation':
				if (drawingOperation.updateRects !== undefined) {
					for (let i = 0; i < drawingOperation.updateRects.length; ++i) {
						if (drawingOperation.operationType !== OperationType.shadow2D) {
							context.drawImage(
								drawingOperation.targetCanvas,
								drawingOperation.tile.GetPosX() + ((drawingOperation.updateRects[i].x - this.canvasOffset.x) - (drawingOperation.tile.position.x - this.canvasOffset.x)),
								drawingOperation.tile.GetPosY() + ((drawingOperation.updateRects[i].y - this.canvasOffset.y) - (drawingOperation.tile.position.y - this.canvasOffset.y)),
								drawingOperation.updateRects[i].w,
								drawingOperation.updateRects[i].h,
								Math.floor(drawingOperation.updateRects[i].x) - this.canvasOffset.x,
								Math.floor(drawingOperation.updateRects[i].y) - this.canvasOffset.y,
								drawingOperation.updateRects[i].w,
								drawingOperation.updateRects[i].h
							);
						}

						if (drawingOperation.operationType === OperationType.shadow2D) {
							let owner = /** @type {Shadow2D} */ (drawingOperation.GetOwner());

							CanvasDrawer.GCD.lightSystem.lightingV2Ctx.drawImage(
								owner.shadowObject.canvas,
								(Math.floor(drawingOperation.updateRects[i].x)) - Math.floor(owner.BoxCollision.position.x),
								(Math.floor(drawingOperation.updateRects[i].y)) - Math.floor(owner.BoxCollision.position.y),
								Math.floor(drawingOperation.updateRects[i].w),
								Math.floor(drawingOperation.updateRects[i].h),
								(Math.floor(drawingOperation.updateRects[i].x) - this.canvasOffset.x),
								(Math.floor(drawingOperation.updateRects[i].y) - this.canvasOffset.y),
								Math.floor(drawingOperation.updateRects[i].w),
								Math.floor(drawingOperation.updateRects[i].h)
							);
						}

						if (drawingOperation.shadowOperation !== undefined && drawingOperation.shadowOperation.drawType !== BWDrawingType.None) {
							let tempcolorPicked = this.lightSystem.GetColor(drawingOperation.GetOwner().position);
							tempcolorPicked.AlphaMultiply();
							drawingOperation.shadowOperation.ChangeColorTest(drawingOperation.GetOwner().BoxCollision, this.lightSystem);

							let owner = drawingOperation.GetOwner();
							CanvasDrawer.GCD.lightSystem.lightingV2Ctx.drawImage(
								drawingOperation.shadowOperation.shadowCanvas,
								(Math.floor(drawingOperation.updateRects[i].x)) - Math.floor(owner.BoxCollision.position.x),
								(Math.floor(drawingOperation.updateRects[i].y)) - Math.floor(owner.BoxCollision.position.y),
								Math.floor(drawingOperation.updateRects[i].w),
								Math.floor(drawingOperation.updateRects[i].h),
								(Math.floor(drawingOperation.updateRects[i].x) - this.canvasOffset.x),
								(Math.floor(drawingOperation.updateRects[i].y) - this.canvasOffset.y),
								Math.floor(drawingOperation.updateRects[i].w),
								Math.floor(drawingOperation.updateRects[i].h)
							);
						}
					}
				} else {
					if (drawingOperation.operationType !== OperationType.shadow2D) {
						context.drawImage(
							drawingOperation.targetCanvas,
							drawingOperation.tile.GetPosX(),
							drawingOperation.tile.GetPosY(),
							drawingOperation.tile.size.x,
							drawingOperation.tile.size.y,
							Math.floor(drawingOperation.tile.position.x) - this.canvasOffset.x,
							Math.floor(drawingOperation.tile.position.y) - this.canvasOffset.y,
							drawingOperation.GetDrawSize().x,
							drawingOperation.GetDrawSize().y
						);
					} else {
						CanvasDrawer.GCD.lightSystem.lightingV2Ctx.drawImage(
							drawingOperation.GetOwner().shadowObject.canvas,
							0,
							0,
							drawingOperation.GetOwner().shadowObject.GetSize().x,
							drawingOperation.GetOwner().shadowObject.GetSize().y,
							Math.floor((drawingOperation.tile.position.x - this.canvasOffset.x)),
							Math.floor((drawingOperation.tile.position.y - this.canvasOffset.y)),
							drawingOperation.GetOwner().shadowObject.GetSize().x,
							drawingOperation.GetOwner().shadowObject.GetSize().y
						);
					}

					if (drawingOperation.shadowOperation !== undefined && drawingOperation.shadowOperation.drawType !== BWDrawingType.None) {
						//let tempcolorPicked = this.lightSystem.GetColor(drawingOperation.GetOwner().position);
						//tempcolorPicked.AlphaMultiply();
						//drawingOperation.shadowOperation.ChangeColor(tempcolorPicked);
						drawingOperation.shadowOperation.ChangeColorTest(drawingOperation.GetOwner().BoxCollision, this.lightSystem);

						CanvasDrawer.GCD.lightSystem.lightingV2Ctx.drawImage(
							drawingOperation.shadowOperation.shadowCanvas,
							0,
							0,
							drawingOperation.tile.size.x,
							drawingOperation.tile.size.y,
							Math.floor(drawingOperation.tile.position.x - this.canvasOffset.x),
							Math.floor(drawingOperation.tile.position.y - this.canvasOffset.y),
							drawingOperation.tile.size.x,
							drawingOperation.tile.size.y,
						);
					}
				}

				drawingOperation.UpdateDrawState(false);
				break;

			case 'TextOperation':
				drawingOperation.UpdateDrawState(false);
				context.font = drawingOperation.size + 'px ' + drawingOperation.font;
				context.fillStyle = drawingOperation.color;
				context.fillText(drawingOperation.text, drawingOperation.pos.x - this.canvasOffset.x, drawingOperation.pos.y - this.canvasOffset.y);
				break;

			case 'RectOperation':
				context.globalAlpha = drawingOperation.alpha;

				drawingOperation.UpdateDrawState(false);

				if (drawingOperation.fillOrOutline === false) {
					context.fillStyle = drawingOperation.color;
					context.fillRect(drawingOperation.position.x - this.canvasOffset.x, drawingOperation.position.y - this.canvasOffset.y, drawingOperation.size.x, drawingOperation.size.y);
				}
				else {
					context.strokeStyle = drawingOperation.color;
					context.strokeRect(drawingOperation.position.x + 1 - this.canvasOffset.x, drawingOperation.position.y + 1 - this.canvasOffset.y, drawingOperation.size.x - 2, drawingOperation.size.y - 2);
				}

				context.globalAlpha = 0.3;

				if (drawingOperation.lifeTime !== -1) {
					drawingOperation.Tick(delta);

					if (drawingOperation.lifeTime < 0)
						return;
				}
				break;

			case 'PathOperation':
				let oldAlpha = context.globalAlpha;
				context.globalAlpha = drawingOperation.alpha;
				context.fillStyle = drawingOperation.color;

				drawingOperation.UpdateDrawState(false);

				context.beginPath();
				context.moveTo(drawingOperation.path[0].x - this.canvasOffset.x, drawingOperation.path[0].y - this.canvasOffset.y);

				for (let point of drawingOperation.path) {
					context.lineTo(point.x - this.canvasOffset.x, point.y - this.canvasOffset.y);
				}

				context.closePath();
				//context.fill();

				context.globalAlpha = 1.0;
				context.strokeStyle = 'gold';
				context.lineWidth = 2;
				context.stroke();

				context.globalAlpha = oldAlpha;
				break;

			case 'LightingOperation':
				CanvasDrawer.GCD.lightSystem.lightingV2Ctx.globalCompositeOperation = 'source-over';
				if (drawingOperation.updateRects !== undefined) {
					drawingOperation.updateRects = RectMerge(drawingOperation.updateRects);

					for (let i = 0; i < drawingOperation.updateRects.length; ++i) {
						CanvasDrawer.GCD.lightSystem.lightingV2Ctx.drawImage(
							drawingOperation.light.colorFrameBuffer,
							drawingOperation.updateRects[i].x - (drawingOperation.light.position.x - drawingOperation.light.halfAttenuation),
							drawingOperation.updateRects[i].y - (drawingOperation.light.position.y - drawingOperation.light.halfAttenuation),
							drawingOperation.updateRects[i].w,
							drawingOperation.updateRects[i].h,
							drawingOperation.updateRects[i].x - this.canvasOffset.x,
							drawingOperation.updateRects[i].y - this.canvasOffset.y,
							drawingOperation.updateRects[i].w,
							drawingOperation.updateRects[i].h
						);
					}
				} else {
					CanvasDrawer.GCD.lightSystem.lightingV2Ctx.drawImage(
						drawingOperation.light.colorFrameBuffer,
						0,
						0,
						drawingOperation.light.attenuation,
						drawingOperation.light.attenuation,
						(drawingOperation.position.x - this.canvasOffset.x) - drawingOperation.light.halfAttenuation,
						(drawingOperation.position.y - this.canvasOffset.y) - drawingOperation.light.halfAttenuation,
						drawingOperation.light.attenuation,
						drawingOperation.light.attenuation
					);
				}

				drawingOperation.UpdateDrawState(false);
				break;
		}
	}

	CreatePaintOperation(event) {
		if (this.selectedSprite instanceof Tile && this.selectedSprite !== undefined) {
			this.Brush.SetBrush(BrushType.box, this.selectedSprite);
			let canvasPos = correctMouse(event);

			canvasPos.Add(this.canvasOffset);
			canvasPos.ToGrid(32);
			canvasPos.MultF(32);

			this.AddDrawOperations(
				this.Brush.GenerateDrawingOperations(
					canvasPos,
					this.frameBufferTerrain,
					this.atlasController.GetAtlas(this.selectedSprite.atlas).GetCanvas()
				),
				OperationType.terrain,
				this.Brush.drawState
			);
		}
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 * @param {boolean} convert 
	 * @returns {DrawingOperation[]}
	 */
	GetTileAtPosition(position, convert = true) {
		let canvasPos;
		if (convert === true) {
			canvasPos = correctMouse({ target: this.mainCanvas, x: position.x, y: position.y });
			canvasPos.ToGrid(32);
		}
		else
			canvasPos = position;

		if (this.drawingOperations[canvasPos.y] !== undefined && this.drawingOperations[canvasPos.y][canvasPos.x] !== undefined) {
			return this.drawingOperations[canvasPos.y][canvasPos.x];
		}

		return undefined;
	}

	/**
	 * 
	 * @param {DrawingOperation} operation 
	 */
	static UpdateTerrainOperation(operation) {
		CanvasDrawer.GCD.terrainNeedsRedrawOperations.push(operation);
	}

	/**
	 * 
	 * @param {Vector2D[]} path 
	 * @param {number} lifetime 
	 * @param {string} color 
	 */
	AddPathOperation(path, lifetime = 5, color = 'red') {
		this.gameObjectDrawingOperations.push(new PathOperation(path, this.DebugDrawer.gameDebugCanvas, color, false, 0, lifetime, false, 1));
	}

	/**
	 * 
	 * @param {PathOperation} pathOperation 
	 */
	AddPathObjectOperation(pathOperation) {
		this.gameObjectDrawingOperations.push(pathOperation);
	}

	/**
	 * 
	 * @param {*} operation 
	 * @param {OperationType} operationType 
	 * @param {BrushDrawState} brushDrawState 
	 * @returns {void}
	 */
	AddDrawOperation(operation, operationType = OperationType.terrain, brushDrawState = BrushDrawState.Normal) {
		if (operation === undefined)
			return;

		switch (operationType) {
			case OperationType.previewTerrain:
				this.terrainPreviewOperations.push(operation);
				break;

			case OperationType.terrain:
				if (this.drawingOperations[operation.tile.GetDrawPosY()] === undefined)
					this.drawingOperations[operation.tile.GetDrawPosY()] = {};

				if (this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()] === undefined)
					this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()] = [];

				let transparent = operation.tile.IsTransparent();
				if ((transparent === false && brushDrawState === BrushDrawState.Normal) || brushDrawState === BrushDrawState.DrawOntop) {
					let newOperations = [operation];

					this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()] = []
					for (let i = 0, l = this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()].length; i < l; ++i) {
						if (this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()][i].tile.IsTransparent() === true)
							newOperations.push(this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()][i]);
					}

					newOperations.sort(function (a, b) {
						if (a.GetPosition().y > b.GetPosition().y)
							return 1;
						else if (a.GetPosition().y < b.GetPosition().y)
							return -1;
						else return 0;
					});

					this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()] = newOperations;
					this.terrainNeedsRedrawOperations = this.terrainNeedsRedrawOperations.concat(this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()]);

				} else if (brushDrawState === BrushDrawState.DrawBeneath) {
					this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()].splice(0, 0, operation);
					this.terrainNeedsRedrawOperations = this.terrainNeedsRedrawOperations.concat(this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()]);
				} else {
					this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()].push(operation);

					this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()].sort(function (a, b) {
						if (a.GetPosition().y > b.GetPosition().y)
							return 1;
						else if (a.GetPosition().y < b.GetPosition().y)
							return -1;
						else return 0;
					});

					this.terrainNeedsRedrawOperations = this.terrainNeedsRedrawOperations.concat(this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()]);
				}
				break;

			case OperationType.shadow2D:
			case OperationType.shadow:
			case OperationType.gameObjects:
				this.gameObjectDrawingOperations.push(operation);
				break;

			case OperationType.particles:
				this.effectsDrawingOperations.push(operation);
				break;

			case OperationType.gui:
				this.guiDrawingOperations.push(operation);
				break;

			case OperationType.lighting:
				this.lightingOperations.push(operation);
				break;
		}
	}

	/**
	 * 
	 * @param {*} operations 
	 * @param {OperationType} operationType 
	 * @param {BrushDrawState} brushDrawState 
	 */
	AddDrawOperations(operations, operationType = OperationType.terrain, brushDrawState = BrushDrawState.Normal) {
		for (let i = 0, l = operations.length; i < l; ++i)
			this.AddDrawOperation(operations[i], operationType, brushDrawState);
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 * @returns {void}
	 */
	UpdateSpritePreview(position) {
		if (this.selectedSprite === undefined)
			return;

		let posCoords = position.Clone();

		if (AllCollisions[/** @type {Tile} */(this.selectedSprite).atlas] !== undefined) {
			this.spritePreviewCanvasCtx.clearRect(0, 0, this.spritePreviewCanvas.width, this.spritePreviewCanvas.height);
		}

		this.AddDrawOperations(
			this.Brush.GenerateDrawingOperations(
				Vector2D.Add(posCoords, this.canvasOffset),
				this.spritePreviewCanvas,
				this.atlasController.GetAtlas(/** @type {Tile} */(this.selectedSprite).atlas).GetCanvas()
			),
			OperationType.previewTerrain,
			this.Brush.drawState
		);
	}

	CEvent(eventType, key, data) {
		switch (eventType) {
			case 'input':
				if (key === 'leftMouse' && data.eventType === 0 && this.isPainting === false && this.selectedSprite === undefined) {
					let gridMousePosition = this.mousePosition.Clone();
					//gridMousePosition.Add(this.canvasOffset);
					gridMousePosition.ToGrid(32);

					if (this.drawingOperations[gridMousePosition.y] !== undefined && this.drawingOperations[gridMousePosition.y][gridMousePosition.x] !== undefined) {
						SelectedTileEditor.GSTE.SetSelectedTiles(this.drawingOperations[gridMousePosition.y][gridMousePosition.x]);
					}
				}

				if (key === 'rightMouse' && data.eventType === 2) {
					this.spritePreviewCanvasCtx.clearRect(0, 0, this.spritePreviewCanvas.width, this.spritePreviewCanvas.height);
					this.selectedSprite = undefined;

					SelectedTileEditor.GSTE.SetSelectedTiles();
				}
				break;
		}
	}

	handleEvent(e) {
		switch (e.type) {
			case 'click':
				switch (e.target.id) {
					case 'save-canvas':
						//navigator.clipboard.writeText(JSON.stringify(this.drawingOperations));
						SaveController.SaveContent();
						break;

					case 'enable-painting':
						this.paintingEnabled = !this.paintingEnabled;
						break;
				}
				break;

			case 'mousedown':
				if (this.paintingEnabled === true && e.button === 0) {
					this.isPainting = true;
					this.CreatePaintOperation(e);
				}
				this.isMouseDown = true;

				let objPos1 = MouseToScreen(e);
				let gridMousePosition1 = new Vector2D(objPos1.x, objPos1.y);
				gridMousePosition1.Add(this.canvasOffset);
				gridMousePosition1.ToGrid(32);

				let ops1 = this.GetTileAtPosition(gridMousePosition1, false);
				if (ops1.length > 0 && this.selectedSprite instanceof Tile && this.selectedSprite !== undefined && this.isMouseDown && this.paintingEnabled === false) {
					TileF.PaintTile(this.selectedSprite, gridMousePosition1);
				}

				break;

			case 'change':
				if (e.target.id === 'brush-draw-state') {
					this.Brush.SetState(BrushDrawState[e.target.value]);
				}
				break;

			case 'mouseleave':
			case 'mouseup':
				this.isPainting = false;
				this.isMouseDown = false;
				break;

			case 'mousemove':
				let objPos = MouseToScreen(e);
				let gridMousePosition = new Vector2D(objPos.x, objPos.y);
				gridMousePosition.Add(this.canvasOffset);
				gridMousePosition.ToGrid(32);
				this.gridMouse.innerHTML = gridMousePosition.ToString() + ' - ' + Vector2D.Add(objPos, this.canvasOffset).ToString();

				let ops = this.GetTileAtPosition(gridMousePosition, false);
				if (ops.length > 0 && this.selectedSprite instanceof Tile && this.selectedSprite !== undefined && this.isMouseDown && this.paintingEnabled === false) {
					TileF.PaintTile(this.selectedSprite, gridMousePosition);
				}

				if (this.selectedSprite !== undefined && this.selectedSprite instanceof Tile) {
					this.Brush.SetBrush(BrushType.box, this.selectedSprite);
					let atlasCoords = correctMouse(e);

					let tempOffsets = this.canvasOffset.Clone();
					tempOffsets.x = Math.abs((tempOffsets.x % 32));
					tempOffsets.y = Math.abs((tempOffsets.y % 32));

					atlasCoords.Add(tempOffsets);
					atlasCoords.ToGrid(this.atlasController.GetAtlas(this.selectedSprite.atlas).atlasSize);

					if (this.lastAtlasCoords.Equal(atlasCoords) == false) {
						this.spritePreviewCanvasCtx.clearRect(0, 0, this.spritePreviewCanvas.width, this.spritePreviewCanvas.height);
					}
					let posCoords = new Vector2D(atlasCoords.x, atlasCoords.y);

					posCoords.MultF(32);
					posCoords.Sub(tempOffsets);

					if (PropEditor.GPEditor.selectedProp === undefined) {
						this.UpdateSpritePreview(posCoords);
					}
					this.lastAtlasCoords = new Vector2D(atlasCoords.x, atlasCoords.y);
				}

				if (this.isPainting === true) {
					this.CreatePaintOperation(e);
				}
				break;
		}
	}
}

export { CanvasDrawer, CanvasSave, OperationType, correctMouse }