import { Vector2D, Tile, OverlapOICheck, OverlapOverlapsCheck, Polygon, ClearOperation, TileData, InputHandler, CollisionHandler, BoxCollision, PolygonCollision, Collision, worldTiles, Brush, BrushDrawState, brushTypes, RectOperation, PathOperation, TextOperation, DrawingOperation, OperationType, TileLUT, CanvasAtlas, SelectedTileEditor, UIDrawer, MasterObject, CMath, Rectangle, LightingOperation } from '../../internal.js';

let mouseToAtlasRectMap = {};
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

function sortDrawOperations(a, b) {
    if (a.GetDrawPositionY() > b.GetDrawPositionY()) return 1;
    if (a.GetDrawPositionY() < b.GetDrawPositionY()) return -1;
    if (a.GetDrawIndex() > b.GetDrawIndex()) return 1;
    if (a.GetDrawIndex() < b.GetDrawIndex()) return -1;
    return 0;
};

function sortCollisions(a, b) {
    return a.enableCollision * 1 + b.enableCollision * -1;
};

class CanvasSave {
    constructor(operations = {}, canvasDrawer) {
        this.drawingOperations = operations;
        this.CanvasDrawer = canvasDrawer;
        this.loadOperationsDone = {};

        if (window.indexedDB === undefined)
            window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
                IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction;

        this.dbVersion = 1;
        this.request = indexedDB.open("farming", this.dbVersion);
        this.db;
        this.request.addEventListener('success', this);
        this.request.addEventListener('upgradeneeded', this);
        this.jsonOperations;
    }

    createObjectStore(database) {
        //database.createObjectStore(key);
    }

    getDataFromDb(index, key) {
        let transaction = this.db.transaction([index], "readwrite");
        let get = transaction.objectStore(index).get(key);
    }

    putElephantInDb(blob, index, key = "saveData") {
        if (index !== undefined) {
            let transaction = this.db.transaction([index], "readwrite");
            let put = transaction.objectStore(index).put(blob, key);

            this.request.onerror = function (event) {
                console.log("Error creating/accessing IndexedDB database");
            };
        }
    };

    UpdateOperation(operations) {
        for (let i = 0; i < operations.length; i++) {
            if (operations[i].drawingCanvas.id === 'game-canvas') {
                if (operations[i].tile.IsTransparent() === true) {
                    this.drawingOperations[operations[i].tile.position.y / 32][operations[i].tile.position.x / 32].push(operations[i]);
                } else if (this.drawingOperations[operations[i].tile.position.y / 32] !== undefined) {
                    this.drawingOperations[operations[i].tile.position.y / 32][operations[i].tile.position.x / 32] = [];
                    this.drawingOperations[operations[i].tile.position.y / 32][operations[i].tile.position.x / 32].push(
                        new DrawingOperation(
                            operations[i].tile,
                            operations[i].drawingCanvas,
                            this.CanvasDrawer.canvasAtlases[operations[i].tile.atlas].canvas
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

        for (let y = 0; y < Math.ceil(this.CanvasDrawer.mainCanvas.height / 32); y++) {
            this.drawingOperations[y] = {};
            for (let x = 0; x < Math.ceil(this.CanvasDrawer.mainCanvas.width / 32); x++) {
                this.drawingOperations[y][x] = [];
                let transaction = this.db.transaction([y], "readwrite");
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
        for (let y = 0; y < keysY.length; y++) {

            let keysX = Object.keys(this.drawingOperations[keysY[y]]);
            for (let x = 0; x < keysX.length; x++) {
                if (tempSavedOperations[keysY[y]] === undefined)
                    tempSavedOperations[keysY[y]] = {};

                this.putElephantInDb(JSON.stringify(this.drawingOperations[keysY[y]][keysX[x]]), y, x);
            }
        }
    }

    GetOperations() {
        let operations = [];

        let keysY = Object.keys(this.drawingOperations);
        for (let y = 0; y < keysY.length; y++) {
            let keysX = Object.keys(this.drawingOperations[keysY[y]]);
            for (let x = 0; x < keysX.length; x++) {
                for (let i = 0; i < this.drawingOperations[keysY[y]][keysX[x]].length; i++) {
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

                    this.db.onerror = function (event) {
                        console.log("Error creating/accessing IndexedDB database");
                    };

                    if (this.db.setVersion) {
                        if (this.db.version != this.dbVersion) {
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

                    for (let i = 0; i < jsonOperation.length; i++) {
                        let newSprite = JSON.parse(jsonOperation[i].canvasSprite);
                        let drawingOperationTemp = new DrawingOperation(
                            new Tile(
                                new Vector2D(jsonOperation[i].pos.x, jsonOperation[i].pos.y),
                                new Vector2D(newSprite.x, newSprite.y),
                                new Vector2D(newSprite.width, newSprite.height),
                                (newSprite.isTransparent !== undefined ? newSprite.isTransparent : false),
                                newSprite.canvas
                            ),
                            (jsonOperation[i].drawingCanvas === 'game-canvas' ? this.CanvasDrawer.mainCanvas : this.CanvasDrawer.canvasAtlases[jsonOperation[i].drawingCanvas].canvas),
                            this.CanvasDrawer.canvasAtlases[jsonOperation[i].targetCanvas].canvas
                        );
                        this.drawingOperations[drawingOperationTemp.tile.position.y / 32][drawingOperationTemp.tile.position.x / 32].push(drawingOperationTemp);
                    }

                    let operationsLoaded = true;
                    let keys = Object.keys(this.loadOperationsDone);
                    for (let i = 0; i < keys.length; i++) {
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
                    this.createObjectStore(e.target.result);
                }
                break;
        }
    }
}

class CanvasDrawer {
    static GCD = new CanvasDrawer(document.getElementById('game-canvas'), document.getElementById('sprite-objects-canvas'), document.getElementById('sprite-preview-canvas'),
        document.getElementById('game-gui-canvas'));

    constructor(mainCanvas, spriteObjectCanvas, spritePreviewCanvas, gameGuiCanvas) {
        this.DebugDraw = false;
        this.canvasOffset = new Vector2D(0, 0);
        this.Brush = new Brush();

        this.atlasesUrl = {};

        this.gridMouse = document.getElementById('grid-mouse');

        this.mainCanvas = mainCanvas;
        this.mainCanvasCtx = this.mainCanvas.getContext('2d');
        this.mainCanvasCtx.webkitImageSmoothingEnabled = false;
        this.mainCanvasCtx.msImageSmoothingEnabled = false;
        this.mainCanvasCtx.imageSmoothingEnabled = false;

        this.frameBuffer = document.createElement('canvas');
        this.frameBuffer.setAttribute('width', this.mainCanvas.width);
        this.frameBuffer.setAttribute('height', this.mainCanvas.height);
        //document.body.appendChild(this.frameBuffer);
        this.frameBufferCtx = this.frameBuffer.getContext('2d');
        this.frameBufferCtx.webkitImageSmoothingEnabled = false;
        this.frameBufferCtx.msImageSmoothingEnabled = false;
        this.frameBufferCtx.imageSmoothingEnabled = false;

        this.lightFrameBuffer = document.createElement('canvas');
        this.lightFrameBuffer.setAttribute('width', this.mainCanvas.width);
        this.lightFrameBuffer.setAttribute('height', this.mainCanvas.width);
        document.body.appendChild(this.lightFrameBuffer);
        this.lightFrameBufferCtx = this.lightFrameBuffer.getContext('2d');
        this.lightFrameBufferCtx.webkitImageSmoothingEnabled = false;
        this.lightFrameBufferCtx.msImageSmoothingEnabled = false;
        this.lightFrameBufferCtx.imageSmoothingEnabled = false;

        this.frameBufferTerrain = document.createElement('canvas');
        this.frameBufferTerrain.setAttribute('width', this.mainCanvas.width);
        this.frameBufferTerrain.setAttribute('height', this.mainCanvas.height);
        //document.body.appendChild(this.frameBufferTerrain);
        this.frameBufferTerrainCtx = this.frameBufferTerrain.getContext('2d');
        this.frameBufferTerrainCtx.webkitImageSmoothingEnabled = false;
        this.frameBufferTerrainCtx.msImageSmoothingEnabled = false;
        this.frameBufferTerrainCtx.imageSmoothingEnabled = false;

        this.gameDebugCanvas = document.createElement('canvas');
        this.gameDebugCanvas.setAttribute('width', this.mainCanvas.width);
        this.gameDebugCanvas.setAttribute('height', this.mainCanvas.height);
        //document.body.appendChild(this.gameDebugCanvas);
        this.gameDebugCanvasCtx = this.gameDebugCanvas.getContext('2d');
        this.gameDebugCanvasCtx.webkitImageSmoothingEnabled = false;
        this.gameDebugCanvasCtx.msImageSmoothingEnabled = false;
        this.gameDebugCanvasCtx.imageSmoothingEnabled = false;
        this.gameDebugCanvasCtx.globalAlpha = 0.3;

        this.spriteObjectCanvas = spriteObjectCanvas;
        this.spriteObjectCanvasCtx = this.spriteObjectCanvas.getContext('2d');
        this.spriteObjectCanvasCtx.webkitImageSmoothingEnabled = false;
        this.spriteObjectCanvasCtx.msImageSmoothingEnabled = false;
        this.spriteObjectCanvasCtx.imageSmoothingEnabled = false;

        this.spritePreviewCanvas = spritePreviewCanvas;
        this.spritePreviewCanvasCtx = this.spritePreviewCanvas.getContext('2d');
        this.spritePreviewCanvasCtx.webkitImageSmoothingEnabled = false;
        this.spritePreviewCanvasCtx.msImageSmoothingEnabled = false;
        this.spritePreviewCanvasCtx.imageSmoothingEnabled = false;

        this.gameGuiCanvas = gameGuiCanvas;
        this.gameGuiCanvasCtx = this.gameGuiCanvas.getContext('2d');
        this.gameGuiCanvasCtx.webkitImageSmoothingEnabled = false;
        this.gameGuiCanvasCtx.msImageSmoothingEnabled = false;
        this.gameGuiCanvasCtx.imageSmoothingEnabled = false;

        this.drawingOperations = {};
        this.lightingOperations = [];
        this.terrainPreviewOperations = [];
        this.terrainNeedsRedrawOperations = [];

        for (let y = 0; y < Math.ceil(this.mainCanvas.height / 32); y++) {
            this.drawingOperations[y] = {};
            for (let x = 0; x < Math.ceil(this.mainCanvas.width / 32); x++) {
                this.drawingOperations[y][x] = [];
            }
        }

        this.gameObjectDrawingOperations = [];
        this.gameObjectDrawingOperationsUpdate = [];
        this.effectsDrawingOperations = [];
        this.clearOperations = [];
        this.guiDrawingOperations = [];

        this.canvasAtlases = {};
        this.loadedImages = [];
        this.hasLoadedAllImages = {};
        this.isLoadingFinished = false;

        this.selectedSprite;
        this.isPainting = false;
        this.paintingEnabled = false;
        this.lastAtlasCoords = new Vector2D(0, 0);

        this.mainCanvas.addEventListener('mouseup', this);
        this.mainCanvas.addEventListener('mousedown', this);
        this.mainCanvas.addEventListener('mousemove', this);
        this.mainCanvas.addEventListener('mouseleave', this);
        document.getElementById('brush-draw-state').addEventListener('change', this);

        document.getElementById('save-canvas').addEventListener('click', this);
        document.getElementById('enable-painting').addEventListener('click', this);
        document.getElementById('enable-debug').addEventListener('click', this);

        this.UIDrawer = new UIDrawer('uipieces', this);

        this.LoadAllAtlases();

        this.ClearBoxCollision = new BoxCollision(new Vector2D(0, 0), new Vector2D(32, 32), false, this, false);

        this.tileCursorPreview;
        this.drawTileCursorPreview = false;
        this.mousePosition = new Vector2D(0, 0);
        this.BeginAtlasesLoaded();
        this.DrawTilePreview();
    }

    LoadWorldTiles() {
        let keysY = Object.keys(worldTiles);
        let tileSize = new Vector2D(32, 32);

        let fixDuplicates = {};

        for (let y = 0; y < keysY.length; y++) {
            let keysX = Object.keys(worldTiles[keysY[y]]);
            for (let x = 0; x < keysX.length; x++) {
                let tilesArr = worldTiles[keysY[y]][keysX[x]];
                for (let i = 0; i < tilesArr.length; i++) {
                    let newTile = tilesArr[i];
                    let tileLUT = TileLUT[newTile.t.lut[0]][newTile.t.lut[1]][newTile.t.lut[2]];

                    if (newTile.tc === undefined)
                        newTile.tc = tileLUT.atlas;

                    if (newTile.dc === undefined)
                        newTile.dc = 'game-canvas';

                    if (tilesArr[i].drawingCanvas !== 'sprite-preview-canvas') {

                        let drawingOperationTemp = new DrawingOperation(
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
                            (newTile.dc === undefined || newTile.dc === 'game-canvas' || newTile.dc === '' ? this.frameBufferTerrain : this.canvasAtlases[newTile.dc].canvas),
                            this.canvasAtlases[newTile.tc].canvas
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
        if (this.isLoadingFinished === true) {
            this.LoadWorldTiles();
            this.isLoadingFinished = null;
        } else {
            window.requestAnimationFrame(() => this.BeginAtlasesLoaded());
        }
    }

    SetSelection(tile) {
        if (InputHandler.GIH.keysPressed['leftCtrl'].state === 0 || InputHandler.GIH.keysPressed['leftCtrl'].state === 1) {
            if (Array.isArray(this.selectedSprite) === false)
                this.selectedSprite = [];

            this.selectedSprite.push(tile);
        } else {
            this.selectedSprite = tile;
        }

        TileData.tileData.SelectionLoop();
    }

    GetAtlas(name) {
        if (this.canvasAtlases[name] !== undefined) {
            return this.canvasAtlases[name];
        } else {
            let keys = Object.keys(this.atlasesUrl);
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] === name)
                    return this.canvasAtlases[this.atlasesUrl[keys[i]]];
            }
        }
    }

    LoadAllAtlases() {
        this.LoadSpriteAtlas("/content/sprites/terrain_atlas.png", 1024, 1056, 32, "terrain");
        this.hasLoadedAllImages["terrain"] = false;
        this.LoadSpriteAtlas("/content/sprites/crops.png", 1024, 1024, 32, "crops");
        this.hasLoadedAllImages["crops"] = false;
        this.LoadSpriteAtlas("/content/sprites/fence.png", 1024, 1024, 32, "fence");
        this.hasLoadedAllImages["fence"] = false;
        this.LoadSpriteAtlas("/content/sprites/ui_big_pieces.png", 864, 568, 32, "uipieces");
        this.hasLoadedAllImages["uipieces"] = false;
        this.LoadSpriteAtlas("/content/sprites/fruits-veggies.png", 1024, 1536, 32, "fruitsveggies");
        this.hasLoadedAllImages["fruitsveggies"] = false;
        this.LoadSpriteAtlas("/content/sprites/fruits-veggies-seeds.png", 1024, 512, 32, "fruitsveggiesseeds");
        this.hasLoadedAllImages["fruitsveggiesseeds"] = false;
        this.LoadSpriteAtlas("/content/sprites/farming_fishing.png", 640, 640, 32, "farmingfishing");
        this.hasLoadedAllImages["farmingfishing"] = false;
        this.LoadSpriteAtlas("/content/sprites/Collection/TerrainOutside.png", 1024, 1216, 32, "terrainoutside");
        this.hasLoadedAllImages["terrainoutside"] = false;
        this.LoadSpriteAtlas("/content/sprites/items/items1.png", 512, 512, 32, "items1");
        this.hasLoadedAllImages["items1"] = false;
        this.LoadSpriteAtlas("/content/sprites/clouds-small.png", 224, 64, 32, "clouds");
        this.hasLoadedAllImages["clouds"] = false;
        this.LoadSpriteAtlas("/content/sprites/animals/chicken_walk.png", 128, 128, 32, "chickenWalk");
        this.hasLoadedAllImages["chickenWalk"] = false;
        this.LoadSpriteAtlas("/content/sprites/animals/duck_walk.png", 128, 160, 32, "duckWalk");
        this.hasLoadedAllImages["duckWalk"] = false;

        this.LoadSpriteAtlas("/content/sprites/ui/inputLeft.png", 16, 16, 16, "inputLeft");
        this.hasLoadedAllImages["inputLeft"] = false;
        this.LoadSpriteAtlas("/content/sprites/ui/inputRight.png", 16, 16, 16, "inputRight");
        this.hasLoadedAllImages["inputRight"] = false;
        this.LoadSpriteAtlas("/content/sprites/ui/inputMiddle.png", 32, 26, 32, "inputMiddle");
        this.hasLoadedAllImages["inputMiddle"] = false;

        this.LoadSpriteAtlas("/content/sprites/items/weapons/short_sword_female.png", 384, 256, 32, "shortSwordFemale");
        this.hasLoadedAllImages["shortSwordFemale"] = false;
    }

    AddAtlas(atlas, name) {
        if (this.canvasAtlases[name] === undefined) {
            this.canvasAtlases[name] = atlas;
            this.hasLoadedAllImages[name] = false;
            this.isLoadingFinished = false;
        }
    }

    LoadNewSpriteAtlas(url, atlasSize, name) {
        if (this.canvasAtlases[name] === undefined) {
            this.LoadSpriteAtlas(url, 0, 0, atlasSize, name);
            this.hasLoadedAllImages[name] = false;
            this.isLoadingFinished = false;

            this.atlasesUrl[url] = name;
        }
    }

    LoadSpriteAtlas(url, width, height, atlasSize, name) {
        if (this.canvasAtlases[name] === undefined) {
            this.canvasAtlases[name] = new CanvasAtlas(this, url, width, height, atlasSize, name);
            this.atlasesUrl[url] = name;
        }
    }

    CheckIfFinishedLoading() {
        if (this.isLoadingFinished === false) {
            let isFinished = true;
            let keys = Object.keys(this.hasLoadedAllImages);

            for (let i = 0; i < keys.length; i++) {
                if (this.hasLoadedAllImages[keys[i]] == false)
                    isFinished = false;
            }

            this.isLoadingFinished = isFinished;
        }
    }

    DrawTilePreview() {
        if (this.tileCursorPreview === undefined) {
            this.tileCursorPreview = new RectOperation(
                new Vector2D(0, 0),
                new Vector2D(32, 32),
                this.gameDebugCanvas,
                'red',
                true
            );
            this.AddDrawOperation(this.tileCursorPreview, OperationType.gameObjects);
        } else {
            this.tileCursorPreview.Update(this.mousePosition);
            this.tileCursorPreview.position.SnapToGrid(32);
        }
    }

    UpdateTilePreview(position, mousePosition) {
        let temp = mousePosition.Clone();
        let tempMouse = mousePosition.Clone();

        let tempOffsets = this.canvasOffset.Clone();
        tempOffsets.x = Math.abs((tempOffsets.x % 32));
        tempOffsets.y = Math.abs((tempOffsets.y % 32));

        temp.Add(this.canvasOffset);
        temp.SnapToGrid(32);

        let characterPos = MasterObject.MO.playerController.playerCharacter.BoxCollision.GetRealCenterPosition();
        tempMouse.Add(this.canvasOffset);
        if (tempMouse.Distance(characterPos) > 96.0)
            temp = characterPos.LerpValue(tempMouse, 96.0);

        this.tileCursorPreview.Update(this.tileCursorPreview.position);

        this.tileCursorPreview.position.Set(temp);
        this.mousePosition.x = tempMouse.x;
        this.mousePosition.y = tempMouse.y;
        this.tileCursorPreview.position.ToGrid(32);
        this.tileCursorPreview.position.Mult(32);
    }

    GameBegin() {
        this.DrawTerrain();
        this.UIDrawer.AddUIElements();

        this.AddDrawOperation(new LightingOperation(new Vector2D(256, 256), new Vector2D(32, 32), this.lightFrameBuffer, 'orange', true, 0, 5, 1.0), OperationType.lighting);
    }

    DrawTerrain() {
        //let tempDrawingOperations = this.GetOperations();

        let keysY = Object.keys(this.drawingOperations);
        for (let y = 0; y < keysY.length; y++) {
            let keysX = Object.keys(this.drawingOperations[keysY[y]]);
            for (let x = 0; x < keysX.length; x++) {
                for (let i = 0; i < this.drawingOperations[keysY[y]][keysX[x]].length; i++) {
                    if (this.drawingOperations[keysY[y]][keysX[x]][i].DrawState() === true)
                        this.DrawOnCanvas(this.drawingOperations[keysY[y]][keysX[x]][i]);
                }
            }
        }
    }

    DrawDebugLoop(delta) {
        if (this.DebugDraw === true) {
            this.gameDebugCanvasCtx.clearRect(0, 0, this.gameDebugCanvas.width, this.gameDebugCanvas.height);
            let collisions = CollisionHandler.GCH.Collisions;
            collisions.sort(sortCollisions);

            for (let collision of collisions) {
                this.DrawDebugCanvas(collision);
            }
        }
    }

    DrawGameObjectsLoop(delta) {
        this.gameObjectDrawingOperations.sort(sortDrawOperations);

        for (let i = 0; i < this.clearOperations.length; i++) {
            this.ClearCanvas(this.clearOperations[i]);
        }
        this.clearOperations = [];

        let keys = Object.keys(this.gameObjectDrawingOperations);
        for (let i = 0; i < keys.length; i++) {
            if (this.gameObjectDrawingOperations[keys[i]] instanceof DrawingOperation && this.gameObjectDrawingOperations[keys[i]].tile !== undefined && this.gameObjectDrawingOperations[keys[i]].DrawState() === true && this.gameObjectDrawingOperations[keys[i]].oldPosition !== undefined || this.gameObjectDrawingOperations[keys[i]].shouldDelete === true)
                this.ClearCanvas(this.gameObjectDrawingOperations[keys[i]]);
            else if (this.gameObjectDrawingOperations[keys[i]] instanceof RectOperation && this.gameObjectDrawingOperations[keys[i]].DrawState() === true && this.gameObjectDrawingOperations[keys[i]].oldPosition !== undefined || this.gameObjectDrawingOperations[keys[i]].shouldDelete === true)
                this.ClearCanvas(this.gameObjectDrawingOperations[keys[i]]);
            else if (this.gameObjectDrawingOperations[keys[i]] instanceof PathOperation && this.gameObjectDrawingOperations[keys[i]].DrawState() === true && this.gameObjectDrawingOperations[keys[i]].oldPosition !== undefined || this.gameObjectDrawingOperations[keys[i]].shouldDelete === true)
                this.ClearCanvas(this.gameObjectDrawingOperations[keys[i]]);
        }

        for (let i = 0; i < this.gameObjectDrawingOperationsUpdate.length; i++) {
            this.ClearCanvasUpdateRects(this.gameObjectDrawingOperationsUpdate[i]);
        }
        this.gameObjectDrawingOperationsUpdate = [];

        for (let i = 0; i < this.gameObjectDrawingOperations.length; i++) {
            if (this.gameObjectDrawingOperations[i].shouldDelete === true) {
                this.gameObjectDrawingOperations.splice(i, 1);
                i--;
            } else {
                if (this.gameObjectDrawingOperations[i].tile !== undefined) {
                    if (this.gameObjectDrawingOperations[i].DrawState() === true && this.gameObjectDrawingOperations[i].shouldDelete === false || this.gameObjectDrawingOperations[i].updateRects !== undefined) {
                        this.DrawOnCanvas(this.gameObjectDrawingOperations[i]);
                    }
                } else if (this.gameObjectDrawingOperations[i] instanceof TextOperation) {
                    this.DrawOnCanvas(this.gameObjectDrawingOperations[i]);
                } else if (this.gameObjectDrawingOperations[i] instanceof RectOperation) {
                    this.DrawOnCanvas(this.gameObjectDrawingOperations[i], delta);
                } else if (this.gameObjectDrawingOperations[i] instanceof PathOperation && this.gameObjectDrawingOperations[i].DrawState() === true) {
                    this.DrawOnCanvas(this.gameObjectDrawingOperations[i]);
                }
            }
        }
    }

    ClearEffectsLoop() {
        let keys = Object.keys(this.effectsDrawingOperations);
        for (let i = 0; i < keys.length; i++) {
            if (this.effectsDrawingOperations[keys[i]] instanceof DrawingOperation && this.effectsDrawingOperations[keys[i]].tile !== undefined || this.effectsDrawingOperations[keys[i]].shouldDelete === true)
                this.ClearCanvas(this.effectsDrawingOperations[keys[i]]);
        }
    }

    DrawEffectsLoop(delta) {
        for (let i = 0; i < this.effectsDrawingOperations.length; i++) {
            if (this.effectsDrawingOperations[i].shouldDelete === true) {
                this.effectsDrawingOperations.splice(i, 1);
                i--;
            } else {
                if (this.effectsDrawingOperations[i].tile !== undefined) {
                    if (this.effectsDrawingOperations[i].DrawState() === true && this.effectsDrawingOperations[i].shouldDelete === false || this.effectsDrawingOperations[i].updateRects !== undefined) {
                        this.DrawOnCanvas(this.effectsDrawingOperations[i]);
                    }
                }
            }
        }
    }

    DrawLightingLoop(delta) {
        this.lightFrameBufferCtx.clearRect(0, 0, this.lightFrameBuffer.width, this.lightFrameBuffer.height);
        this.lightFrameBufferCtx.fillStyle = 'black';
        this.lightFrameBufferCtx.fillRect(0, 0, this.lightFrameBuffer.width, this.lightFrameBuffer.height);

        for (let i = 0; i < this.lightingOperations.length; i++) {
            if (this.lightingOperations[i].shouldDelete === true) {
                this.lightingOperations.splice(i, 1);
                i--;
            }
            this.DrawOnCanvas(this.lightingOperations[i]);
        }
    }

    DrawGUILoop(delta) {
        this.UIDrawer.AddUIElements(delta);

        this.gameGuiCanvasCtx.clearRect(0, 0, this.gameGuiCanvas.width, this.gameGuiCanvas.height);

        for (let i = 0; i < this.guiDrawingOperations.length; i++) {
            if (this.guiDrawingOperations[i].shouldDelete === true) {
                this.guiDrawingOperations.splice(i, 1);
                i--;
            } else if (this.guiDrawingOperations[i].DrawState() === true) {
                this.DrawOnCanvas(this.guiDrawingOperations[i]);
            }
        }
    }

    DrawLoop(delta) {
        this.tileCursorPreview.needsToBeRedrawn = this.drawTileCursorPreview;

        this.spritePreviewCanvasCtx.clearRect(0, 0, this.spritePreviewCanvasCtx.width, this.spritePreviewCanvas.height);
        for (let i = 0; i < this.terrainPreviewOperations.length; i++) {
            this.DrawOnCanvas(this.terrainPreviewOperations[i]);
        }
        this.terrainPreviewOperations = [];

        for (let i = 0; i < this.terrainNeedsRedrawOperations.length; i++) {
            this.terrainNeedsRedrawOperations[i].Update();
            this.DrawOnCanvas(this.terrainNeedsRedrawOperations[i]);
        }
        this.terrainNeedsRedrawOperations = [];

        this.ClearEffectsLoop();
        this.DrawDebugLoop(delta);
        this.DrawGameObjectsLoop(delta);
        this.DrawLightingLoop(delta);
        this.DrawEffectsLoop(delta);
        this.DrawGUILoop(delta);
    }

    static DrawToMain(camera) {
        let cameraRect = camera.GetRect();

        CanvasDrawer.GCD.canvasOffset = new Vector2D(cameraRect.x, cameraRect.y);
        CanvasDrawer.GCD.mainCanvasCtx.clearRect(0, 0, CanvasDrawer.GCD.mainCanvas.width, CanvasDrawer.GCD.mainCanvas.height)
        CanvasDrawer.GCD.mainCanvasCtx.drawImage(CanvasDrawer.GCD.frameBufferTerrain, cameraRect.x, cameraRect.y, cameraRect.z, cameraRect.a, 0, 0, CanvasDrawer.GCD.mainCanvas.width, CanvasDrawer.GCD.mainCanvas.height);
        CanvasDrawer.GCD.mainCanvasCtx.drawImage(CanvasDrawer.GCD.frameBuffer, cameraRect.x, cameraRect.y, cameraRect.z, cameraRect.a, 0, 0, CanvasDrawer.GCD.mainCanvas.width, CanvasDrawer.GCD.mainCanvas.height);

        CanvasDrawer.GCD.mainCanvasCtx.globalCompositeOperation = 'lighten';
        CanvasDrawer.GCD.mainCanvasCtx.drawImage(CanvasDrawer.GCD.lightFrameBuffer, cameraRect.x, cameraRect.y, cameraRect.z, cameraRect.a, 0, 0, CanvasDrawer.GCD.mainCanvas.width, CanvasDrawer.GCD.mainCanvas.height);
        CanvasDrawer.GCD.mainCanvasCtx.globalCompositeOperation = 'source-over';

        CanvasDrawer.GCD.mainCanvasCtx.drawImage(CanvasDrawer.GCD.gameDebugCanvas, cameraRect.x, cameraRect.y, cameraRect.z, cameraRect.a, 0, 0, CanvasDrawer.GCD.mainCanvas.width, CanvasDrawer.GCD.mainCanvas.height);
    }

    GetOperations() {
        let operations = [];

        let keysY = Object.keys(this.drawingOperations);
        for (let y = 0; y < keysY.length; y++) {
            let keysX = Object.keys(this.drawingOperations[keysY[y]]);
            for (let x = 0; x < keysX.length; x++) {
                for (let i = 0; i < this.drawingOperations[keysY[y]][keysX[x]].length; i++) {
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

    AddClearOperation(drawingCanvas, rect) {
        this.clearOperations.push(new ClearOperation(drawingCanvas, rect));
    }

    ClearCanvasUpdateRects(drawingOperation) {
        if (drawingOperation.updateRects !== undefined) {
            for (let i = 0; i < drawingOperation.updateRects.length; i++) {
                drawingOperation.drawingCanvas.getContext('2d').clearRect(drawingOperation.updateRects[i].x, drawingOperation.updateRects[i].y, drawingOperation.updateRects[i].w, drawingOperation.updateRects[i].h);
            }
        }
    }

    ClearCanvas(drawingOperation) {
        if (drawingOperation instanceof DrawingOperation) {
            if (drawingOperation.tile === undefined || (drawingOperation.tile !== undefined && this.canvasAtlases[drawingOperation.tile.atlas] === undefined && drawingOperation.targetCanvas === undefined)) {
                return;
            }
        }

        drawingOperation.isVisible = false;
        let oldPosition = drawingOperation.GetPreviousPosition(),
            size = new Vector2D(0, 0);

        if (drawingOperation instanceof DrawingOperation) {
            size.Set(drawingOperation.tile.size);
            //this.AddDebugRectOperation(new Rectangle(oldPosition.x, oldPosition.y, drawingOperation.tile.size.x, drawingOperation.tile.size.y), 0.1, 'brown');
            drawingOperation.drawingCanvas.getContext('2d').clearRect(oldPosition.x, oldPosition.y, size.x, size.y);
            this.CheckClearOverlapping(oldPosition, size);
            //size.Set(drawingOperation.GetSize());
            //size.Add(2);
            //this.CheckClearOverlapping(oldPosition, size);
            //this.CheckClearOverlapping(drawingOperation.position, drawingOperation.tile.size);
        } else if (drawingOperation instanceof TextOperation) {
            size.Set(drawingOperation.GetSize());
            drawingOperation.drawingCanvas.getContext('2d').clearRect(oldPosition.x - 5, oldPosition.y - 5, size.x + 5, size.y + 5);
            //this.CheckClearOverlapping(drawingOperation.pos, size);
        } else if (drawingOperation instanceof RectOperation) {
            size.Set(drawingOperation.GetSize());
            drawingOperation.drawingCanvas.getContext('2d').clearRect(oldPosition.x, oldPosition.y, size.x, size.y);
            drawingOperation.drawingCanvas.getContext('2d').clearRect(drawingOperation.position.x, drawingOperation.position.y, size.x, size.y);
        } else if (drawingOperation instanceof ClearOperation) {
            drawingOperation.drawingCanvas.getContext('2d').clearRect(drawingOperation.rectangle.x, drawingOperation.rectangle.y, drawingOperation.rectangle.w, drawingOperation.rectangle.h);
            this.CheckClearOverlapping(new Vector2D(drawingOperation.rectangle.x, drawingOperation.rectangle.y), new Vector2D(drawingOperation.rectangle.w, drawingOperation.rectangle.h));
        } else if (drawingOperation instanceof PathOperation) {
            let boundingBox = Polygon.CalculateBoundingBox(drawingOperation.path);
            boundingBox.x -= 1;
            boundingBox.y -= 1;
            boundingBox.z += 2;
            boundingBox.a += 2;
            drawingOperation.drawingCanvas.getContext('2d').clearRect(boundingBox.x, boundingBox.y, boundingBox.z, boundingBox.a);
        }
    }

    CheckClearOverlapping(position, size) {
        if (position === undefined || size === undefined)
            return;

        this.ClearBoxCollision.position = position;
        this.ClearBoxCollision.size = size;
        this.ClearBoxCollision.position.Sub(1);
        this.ClearBoxCollision.size.Add(2);
        this.ClearBoxCollision.CalculateBoundingBox();

        let overlaps = CollisionHandler.GCH.GetOverlaps(this.ClearBoxCollision, false, OverlapOICheck);//new BoxCollision(position, this.BoxCollision.size, this.enableCollision, this));

        for (let overlap of overlaps) {
            if (overlap.collisionOwner !== undefined && overlap.collisionOwner !== null && overlap.collisionOwner.drawingOperation !== undefined && overlap.collisionOwner.drawingOperation !== null) {
                //overlap.collisionOwner.FlagDrawingUpdate(overlap.collisionOwner.GetPosition());

                let rectA = new Rectangle(position.x, position.y, size.x, size.y),
                    rectB = overlap.GetBoundingBox().Clone();

                if (rectA !== undefined && rectB !== undefined) {
                    let intersection = rectA.GetIntersection(rectB);

                    if (intersection !== undefined) {
                        overlap.collisionOwner.drawingOperation.AddUpdateRect(intersection);
                        this.gameObjectDrawingOperationsUpdate.push(overlap.collisionOwner.drawingOperation);
                        //this.AddDebugRectOperation(intersection, 0.016, CMath.CSS_COLOR_NAMES[20]);
                    }
                }

                /*let secondaryOverlaps = CollisionHandler.GCH.GetOverlaps(overlap, true, {Intersect:false, Overlaps:true, Inside:false});
    
                for (let secondaryOverlap of secondaryOverlaps) {
                    if (secondaryOverlap.collisionOwner !== undefined && secondaryOverlap.collisionOwner !== null && secondaryOverlap.collisionOwner.drawingOperation !== undefined && secondaryOverlap.collisionOwner.drawingOperation !== null) {
                        secondaryOverlap.collisionOwner.FlagDrawingUpdate(secondaryOverlap.collisionOwner.position);
                    }
                }*/
            }
        }
    }

    DrawDebugCanvas(collision) {
        if (collision.enableCollision === true) {
            this.gameDebugCanvasCtx.fillStyle = 'red';
        } else {
            this.gameDebugCanvasCtx.fillStyle = 'cyan';
        }

        if (collision instanceof BoxCollision) {
            this.gameDebugCanvasCtx.clearRect(collision.boundingBox.x, collision.boundingBox.y, collision.boundingBox.w, collision.boundingBox.h);
            this.gameDebugCanvasCtx.fillRect(collision.boundingBox.x, collision.boundingBox.y, collision.boundingBox.w, collision.boundingBox.h);
        } else if (collision instanceof PolygonCollision) {
            this.gameDebugCanvasCtx.beginPath();
            this.gameDebugCanvasCtx.moveTo(collision.points[0].x, collision.points[0].y);

            for (let point of collision.points) {
                this.gameDebugCanvasCtx.lineTo(point.x, point.y);
            }

            this.gameDebugCanvasCtx.closePath();
            this.gameDebugCanvasCtx.fill();
        } else if (collision instanceof Collision) {
            this.gameDebugCanvasCtx.clearRect(collision.boundingBox.x, collision.boundingBox.y, collision.boundingBox.w, collision.boundingBox.h);
            this.gameDebugCanvasCtx.fillRect(collision.boundingBox.x, collision.boundingBox.y, collision.boundingBox.w, collision.boundingBox.h);
        }
    }

    RemoveOperation(y, x, i) {
        if (this.drawingOperations[y] !== undefined && this.drawingOperations[y][x] !== undefined && this.drawingOperations[y][x][i] !== undefined) {
            this.drawingOperations[y][x].splice(i, 1);
        }
    }

    DrawOnCanvas(drawingOperation, delta = 0) {
        if (drawingOperation === this.tileCursorPreview && this.drawTileCursorPreview === false)
            return;

        if (drawingOperation instanceof DrawingOperation) {
            if ((drawingOperation.tile == undefined || this.canvasAtlases[drawingOperation.tile.atlas] === undefined) && drawingOperation.targetCanvas === undefined)
                return;

            if (drawingOperation.targetCanvas === undefined || this.mainCanvasCtx === undefined)
                return;
        }

        let context = drawingOperation.drawingCanvas.getContext('2d');
        if (drawingOperation instanceof TextOperation && drawingOperation.clear === true || drawingOperation instanceof DrawingOperation && drawingOperation.tile.clear === true) {
            //context.clearRect(0, 0, drawingOperation.drawingCanvas.width, drawingOperation.drawingCanvas.height);
        }

        drawingOperation.isVisible = true;
        if (drawingOperation instanceof DrawingOperation) {
            if (drawingOperation.updateRects !== undefined) {
                for (let i = 0; i < drawingOperation.updateRects.length; i++) {
                    context.drawImage(
                        drawingOperation.targetCanvas,
                        drawingOperation.tile.GetPosX() + (drawingOperation.updateRects[i].x - drawingOperation.tile.position.x),
                        drawingOperation.tile.GetPosY() + (drawingOperation.updateRects[i].y - drawingOperation.tile.position.y),
                        drawingOperation.updateRects[i].w,
                        drawingOperation.updateRects[i].h,
                        drawingOperation.updateRects[i].x,
                        drawingOperation.updateRects[i].y,
                        drawingOperation.updateRects[i].w,
                        drawingOperation.updateRects[i].h
                    );
                }
            } else {
                context.drawImage(
                    drawingOperation.targetCanvas,
                    drawingOperation.tile.GetPosX(),
                    drawingOperation.tile.GetPosY(),
                    drawingOperation.tile.size.x,
                    drawingOperation.tile.size.y,
                    drawingOperation.tile.position.x,
                    drawingOperation.tile.position.y,
                    drawingOperation.GetDrawSize().x,
                    drawingOperation.GetDrawSize().y
                );
            }
            drawingOperation.UpdateDrawState(false);
        } else if (drawingOperation instanceof TextOperation) {
            drawingOperation.UpdateDrawState(false);
            context.font = drawingOperation.size + 'px ' + drawingOperation.font;
            context.fillStyle = drawingOperation.color;
            context.fillText(drawingOperation.text, drawingOperation.pos.x, drawingOperation.pos.y);
        } else if (drawingOperation instanceof RectOperation) {
            this.gameDebugCanvasCtx.globalAlpha = drawingOperation.alpha;

            if (drawingOperation.lifeTime !== -1) {
                drawingOperation.Tick(delta);

                if (drawingOperation.lifeTime < 0)
                    return;
            }

            drawingOperation.UpdateDrawState(false);
            context.fillStyle = drawingOperation.color;

            if (drawingOperation.fillOrOutline === false)
                context.fillRect(drawingOperation.position.x, drawingOperation.position.y, drawingOperation.size.x, drawingOperation.size.y);
            else
                context.strokeRect(drawingOperation.position.x, drawingOperation.position.y, drawingOperation.size.x, drawingOperation.size.y);

            this.gameDebugCanvasCtx.globalAlpha = 0.3;
        } else if (drawingOperation instanceof PathOperation) {
            let oldAlpha = context.globalAlpha;
            context.globalAlpha = drawingOperation.alpha;
            context.fillStyle = drawingOperation.color;

            drawingOperation.UpdateDrawState(false);

            context.beginPath();
            context.moveTo(drawingOperation.path[0].x, drawingOperation.path[0].y);

            for (let point of drawingOperation.path) {
                context.lineTo(point.x, point.y);
            }

            context.closePath();
            //context.fill();

            context.globalAlpha = 1.0;
            context.strokeStyle = 'gold';
            context.lineWidth = 2;
            context.stroke();

            context.globalAlpha = oldAlpha;
        } else if (drawingOperation instanceof LightingOperation) {
            drawingOperation.UpdateDrawState(false);

            context.shadowColor = drawingOperation.color;
            context.shadowBlur = 15;
            context.lineWidth = 1;
            context.strokeStyle = drawingOperation.color;
            context.strokeRect(drawingOperation.position.x, drawingOperation.position.y, 1, 1);
        }
    }

    CreatePaintOperation(event) {
        if (this.selectedSprite !== undefined) {
            this.Brush.SetBrush(brushTypes.box, this.selectedSprite);
            let canvasPos = correctMouse(event);

            canvasPos.Add(this.canvasOffset);
            canvasPos.ToGrid(32);
            canvasPos.Mult(32);

            this.AddDrawOperations(
                this.Brush.GenerateDrawingOperations(
                    { x: canvasPos.x, y: canvasPos.y },
                    this.frameBufferTerrain,
                    this.canvasAtlases[this.selectedSprite.atlas].canvas
                ),
                OperationType.terrain,
                this.Brush.drawState
            );
        }
    }

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
    }

    static UpdateTerrainOperation(operation) {
        CanvasDrawer.GCD.terrainNeedsRedrawOperations.push(operation);
    }

    AddDebugOperation(position, lifetime = 5, color = 'purple') {
        this.gameObjectDrawingOperations.push(new RectOperation(position, new Vector2D(5, 5), this.gameDebugCanvas, color, false, 0, lifetime, 1.0));
    }

    AddDebugRectOperation(rect, lifetime = 5, color = 'purple', fillOrOutline = false) {
        this.gameObjectDrawingOperations.push(new RectOperation(new Vector2D(rect.x, rect.y), new Vector2D(rect.w, rect.h), this.gameDebugCanvas, color, false, 0, lifetime, 1.0, fillOrOutline));
    }

    AddPathOperation(path, lifetime = 5, color = 'red') {
        this.gameObjectDrawingOperations.push(new PathOperation(path, this.gameDebugCanvas, color, false, 0, lifetime, 1, 0));
    }

    AddPathOperation(pathOperation) {
        this.gameObjectDrawingOperations.push(pathOperation);
    }

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
                    for (let i = 0; i < this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()].length; i++) {
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

    AddDrawOperations(operations, operationType = OperationType.terrain, brushDrawState = BrushDrawState.Normal) {
        for (let i = 0; i < operations.length; i++)
            this.AddDrawOperation(operations[i], operationType, brushDrawState);
    }

    handleEvent(e) {
        switch (e.type) {
            case 'click':
                switch (e.target.id) {
                    case 'save-canvas':
                        navigator.clipboard.writeText(JSON.stringify(this.drawingOperations));
                        break;

                    case 'enable-painting':
                        this.paintingEnabled = !this.paintingEnabled;
                        break;

                    case 'enable-debug':
                        this.DebugDraw = !this.DebugDraw;

                        if (this.DebugDraw === false)
                            this.gameDebugCanvasCtx.clearRect(0, 0, this.gameDebugCanvas.width, this.gameDebugCanvas.height);

                        break;
                }
                break;

            case 'mousedown':
                if (this.paintingEnabled === true) {
                    this.isPainting = true;
                    this.CreatePaintOperation(e);
                } else {
                    let objPos = MouseToScreen(e);
                    let gridMousePosition = new Vector2D(objPos.x, objPos.y);;
                    gridMousePosition.Add(this.canvasOffset);
                    gridMousePosition.ToGrid(32);

                    if (this.drawingOperations[gridMousePosition.y] !== undefined && this.drawingOperations[gridMousePosition.y][gridMousePosition.x] !== undefined) {
                        SelectedTileEditor.GSTE.SetSelectedTiles(this.drawingOperations[gridMousePosition.y][gridMousePosition.x]);
                    }
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
                break;

            case 'mousemove':
                let objPos = MouseToScreen(e);
                let gridMousePosition = new Vector2D(objPos.x, objPos.y);
                gridMousePosition.ToGrid(32);
                this.gridMouse.innerHTML = gridMousePosition.ToString();

                if (this.selectedSprite !== undefined && Array.isArray(this.selectedSprite) === false) {
                    this.Brush.SetBrush(brushTypes.box, this.selectedSprite);
                    let atlasCoords = correctMouse(e);

                    let tempOffsets = this.canvasOffset.Clone();
                    tempOffsets.x = Math.abs((tempOffsets.x % 32));
                    tempOffsets.y = Math.abs((tempOffsets.y % 32));

                    atlasCoords.Add(tempOffsets);
                    atlasCoords.ToGrid(this.canvasAtlases[this.selectedSprite.atlas].atlasSize);

                    if (this.lastAtlasCoords.Equal(atlasCoords) == false) {
                        this.spritePreviewCanvasCtx.clearRect(0, 0, this.spritePreviewCanvas.width, this.spritePreviewCanvas.height);
                    }
                    let posCoords = new Vector2D(atlasCoords.x, atlasCoords.y);

                    posCoords.Mult({ x: 32, y: 32 });
                    posCoords.Sub(tempOffsets);

                    this.AddDrawOperations(
                        this.Brush.GenerateDrawingOperations(
                            posCoords,
                            this.spritePreviewCanvas,
                            this.canvasAtlases[this.selectedSprite.atlas].canvas
                        ),
                        OperationType.previewTerrain,
                        this.Brush.drawState
                    );
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