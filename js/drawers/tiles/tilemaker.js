import { CanvasDrawer, CanvasAtlasObject, AtlasController, Tile, TileType, TileTerrain, Vector2D, Vector, Math3D } from '../../internal.js';
import { XORCanvasSprite } from './TileMakerCustomSheets/customSheetsFunctions.js';

class TileMaker {
    static CustomTiles;

    static DrawOnCanvas(tempCanvas, drawingTile, x, y) {
        if (AtlasController.GetAtlas(drawingTile.atlas) !== undefined) {
            let canvas = AtlasController.GetAtlas(drawingTile.atlas).GetCanvas();
            tempCanvas.getContext('2d').drawImage(
                canvas,
                drawingTile.tilePosition.x * 32,
                drawingTile.tilePosition.y * 32,
                drawingTile.size.x,
                drawingTile.size.y,
                x * 32 + drawingTile.position.x,
                y * 32 + drawingTile.position.y,
                drawingTile.size.x,
                drawingTile.size.y
            );
        }
    }

    static CombineTilesToImage(tiles, tileLayout, objectName = 'default') {
        let tempCanvas = document.createElement('canvas');
        let imageSize = new Vector2D(tileLayout[0].length * 32, tileLayout.length * 32);
        tempCanvas.setAttribute('height', imageSize.y.toString());
        tempCanvas.setAttribute('width', imageSize.x.toString());

        for (let y = 0, lY = tileLayout.length; y < lY; ++y) {
            for (let x = 0, lX = tileLayout[y].length; x < lX; ++x) {

                if (Array.isArray(tileLayout[y][x]) === true) {
                    for (let i = 0, l = tileLayout[y][x].length; i < l; ++i) {
                        if (tileLayout[y][x][i] !== null)
                            TileMaker.DrawOnCanvas(tempCanvas, tiles[tileLayout[y][x][i]], x, y);
                    }
                } else {
                    if (tileLayout[y][x] !== null) {
                        let drawingTile = tiles[tileLayout[y][x]];
                        TileMaker.DrawOnCanvas(tempCanvas, drawingTile, x, y);
                    }
                }
            }
        }

        let newCanvasAtlas = new CanvasAtlasObject(CanvasDrawer.GCD, tempCanvas.toDataURL('image/png'), imageSize.x, imageSize.y, -1, objectName);
        AtlasController.AddAtlas(newCanvasAtlas, objectName);
    }

    static SplitAtlasToTiles(atlas, tileSize) {
        let //splitPosition = new Vector2D(0, 0),
            loopX = atlas.width / tileSize.x,
            loopY = atlas.height / tileSize.y;

        let canvas = atlas.canvas;
        //let ctx = canvas.getContext('2d');
        let tempCanvas = document.createElement('canvas');
        tempCanvas.width = tileSize.x;
        tempCanvas.height = tileSize.y;

        for (let x = 0, lX = loopX + 1; x < lX; ++x) {
            for (let y = 0, lY = loopY + 1; y < lY; ++y) {
                tempCanvas.getContext('2d').clearRect(0, 0, tileSize.x, tileSize.y);
                tempCanvas.getContext('2d').drawImage(canvas, x * tileSize.x, y * tileSize.y, tileSize.x, tileSize.y, 0, 0, tileSize.x, tileSize.y);
                let base64 = tempCanvas.toDataURL('image/png');

                if (base64.length > 256)
                    TileMaker.SaveAsFile(base64, y + '-' + x + '_' + atlas.name);
            }
        }
    }

    static SaveAsFile(base64, fileName) {
        var link = document.createElement("a");

        document.body.appendChild(link); // for Firefox

        link.setAttribute("href", base64);
        link.setAttribute("download", fileName);
        link.click();
    }

    static TileBonesToCanvas(tile, canvas, bones, canvasSpriteSize = new Vector2D(32, 32), canvasOffset = 0, xorData = undefined) {
        let rotationCanvas = document.createElement('canvas');
        rotationCanvas.setAttribute('height', tile.size.y);
        rotationCanvas.setAttribute('width', tile.size.x);
        let rotationCanvasCtx = rotationCanvas.getContext('2d');

        for (let i = 0, l = bones.bones.length; i < l; ++i) {
            let pixelData = AtlasController.GetAtlas(tile.atlas).GetCanvas().getContext('2d').getImageData(
                tile.GetPosX(),
                tile.GetPosY(),
                tile.size.x,
                tile.size.y
            );

            Math3D.RotatePixelData2D(pixelData.data, new Vector2D(tile.size.x, tile.size.y), new Vector(0, 0, bones.bones[i].forward), 0, new Vector(tile.size.x / 2, tile.size.y / 2, 0));
            rotationCanvasCtx.putImageData(pixelData, 0, 0);

            /*let base64 = rotationCanvas.toDataURL('image/png');
            if (base64.length > 256) {
                TileMaker.SaveAsFile(base64, 0 + '-' + i + '_' + tile.name);
            }*/

            if (xorData !== undefined) {
                XORCanvasSprite(
                    rotationCanvasCtx,
                    bones.bones[i],
                    new Vector2D(tile.size.x, tile.size.y),
                    xorData.frames[i],
                    xorData.canvas
                );
            }

            canvas.getContext('2d').drawImage(
                rotationCanvas,
                0,
                0,
                tile.size.x,
                tile.size.y,
                (i * canvasSpriteSize.x),
                canvasOffset * canvasSpriteSize.y,
                tile.size.x,
                tile.size.y,
            );
        }
    }

    static CanvasPortionToImage(tile) {
        if (AtlasController.GetAtlas(tile.atlas) !== undefined) {
            let canvas = AtlasController.GetAtlas(tile.atlas).GetCanvas();
            //let ctx = canvas.getContext('2d');
            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = tile.size.x;
            tempCanvas.height = tile.size.y;

            tempCanvas.getContext('2d').drawImage(canvas, tile.GetPosX(), tile.GetPosY(), tile.size.x, tile.size.y, 0, 0, 32, 32);

            let newImage = new Image(tile.size.x, tile.size.y);
            newImage.src = tempCanvas.toDataURL('image/png');
            newImage.dataset.tileType = tile.tileType;
            newImage.dataset.tileTerrain = tile.tileTerrain;
            newImage.addEventListener('click', tile);

            return newImage;
        }
        return null;
    }

    static CanvasPortionToImage2(tile) {
        if (AtlasController.GetAtlas(tile.atlas) !== undefined) {
            let canvas = AtlasController.GetAtlas(tile.atlas).GetCanvas();
            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = tile.size.x;
            tempCanvas.height = tile.size.y;

            tempCanvas.getContext('2d').drawImage(canvas, tile.GetPosX(), tile.GetPosY(), tile.size.x, tile.size.y, 0, 0, tile.size.x, tile.size.y);

            let newImage = new Image(tile.size.x, tile.size.y);
            newImage.src = tempCanvas.toDataURL('image/png');
            tempCanvas.remove();

            return newImage;
        }
        return null;
    }

    static ResizeImage(image, size) {
        let tempCanvas = document.createElement('canvas');
        tempCanvas.width = size.x;
        tempCanvas.height = size.y;

        tempCanvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height, 0, 0, size.x, size.y);

        let newImage = new Image(size.x, size.y);
        newImage.src = tempCanvas.toDataURL('image/png');
        tempCanvas.remove();

        return newImage;
    }

    static GenerateCustomTiles() {
        //const f = null;
        TileMaker.CustomTiles = {
            seedStand: {
                name: 'pepoSeedShop',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 8), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 4), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 9), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(14, 10), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 5), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(6, 12), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(7, 12), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 13), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(6, 13), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 12), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(8, 13), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(8, 12), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 14), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(6, 14), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(7, 10), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 10), new Vector2D(32, 32), true, 'fruitsveggies', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 12), new Vector2D(32, 32), true, 'fruitsveggies', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 8), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(7, 13), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(9, 13), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(8, 12), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                ],
                tileLayout: [
                    [1, 1, 1],
                    [12, [20, 14], 13],
                    [[17, 16, 18, 6], [19, 3], [3, 5]],
                    [2, 2, 2],
                ],
            },
            treeBirch1: {
                name: 'treeBirch1',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 12), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 12), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 12), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 13), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 13), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 13), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 14), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 14), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 14), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 19), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 19), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 19), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(32, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Water),
                ],
                tileLayout: [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, [9, 7], 8],
                    [13, 9, 13],
                    [10, 11, 12],
                ]
            },
            treeBirch2: {
                name: 'treeBirch2',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 12), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 12), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 12), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 13), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 13), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 13), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 14), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 14), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 14), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Leaves),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 19), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 19), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(32, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Water),
                ],
                tileLayout: [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, [9, 7], 8],
                    [10, 11, 12],
                ],
            },
            treeBirchShadow: {
                name: 'treeBirchShadow',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(2, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(3, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(4, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(8, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(9, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(10, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                ],
                tileLayout: [
                    [0, 1, 2],
                    [3, 4, 5]
                ]
            },
            treePine1: {
                name: 'treePine1',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 19), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(32, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Water),
                ],
                tileLayout: [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],
                    [9, [12, 10], 11],
                    [14, 13, 14]
                ]
            },
            treePine2: {
                name: 'treePine2',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 19), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(32, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Water),
                ],
                tileLayout: [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],
                    [9, [13, 10], 11],
                ]
            },
            treePine3: {
                name: 'treePine3',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 19), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(32, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Water),
                ],
                tileLayout: [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],
                    [9, [12, 10], 11],
                    [14, 12, 14],
                    [14, 13, 14]
                ]
            },
            treePine1v2: {
                name: 'treePine1v2',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 19), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(32, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Water),
                ],
                tileLayout: [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, [9, 7], 8],
                    [11, 9, 11],
                    [11, 10, 11],
                ]
            },
            treePine2v2: {
                name: 'treePine2v2',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 19), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(32, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Water),
                ],
                tileLayout: [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, [9, 7], 8],
                    [11, 10, 11],
                ]
            },
            treePine3v2: {
                name: 'treePine3v2',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 15), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 16), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 17), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 18), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 19), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(32, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Water),
                ],
                tileLayout: [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, [9, 7], 8],
                    [11, 9, 11],
                    [11, 9, 11],
                    [11, 10, 11],
                ]
            },
            treePineShadow: {
                name: 'treePineShadow',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(6, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(7, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(11, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(12, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(13, 32), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                ],
                tileLayout: [
                    [0, 1, 2],
                    [3, 4, 5]
                ]
            },
            rockStone1: {
                name: 'rockStone1',
                tiles: [
                    new Tile(new Vector2D(0, 0,), new Vector2D(18, 12), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Rock),
                    new Tile(new Vector2D(0, 0,), new Vector2D(19, 12), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Rock),
                    new Tile(new Vector2D(0, 0,), new Vector2D(18, 13), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Rock),
                    new Tile(new Vector2D(0, 0,), new Vector2D(19, 13), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Rock),
                ],
                tileLayout: [
                    [0, 1],
                    [2, 3]
                ]
            },
            rockStone2: {
                name: 'rockStone2',
                tiles: [
                    new Tile(new Vector2D(0, 0,), new Vector2D(27, 23), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Rock),
                    new Tile(new Vector2D(0, 0,), new Vector2D(28, 23), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Rock),
                    new Tile(new Vector2D(0, 0,), new Vector2D(27, 24), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Rock),
                    new Tile(new Vector2D(0, 0,), new Vector2D(28, 24), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Rock),
                ],
                tileLayout: [
                    [0, 1],
                    [2, 3]
                ]
            },
            rockStone3: {
                name: 'rockStone3',
                tiles: [
                    new Tile(new Vector2D(0, 0,), new Vector2D(27, 26), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Rock),
                    new Tile(new Vector2D(0, 0,), new Vector2D(28, 26), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Rock),
                    new Tile(new Vector2D(0, 0,), new Vector2D(27, 27), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Rock),
                    new Tile(new Vector2D(0, 0,), new Vector2D(28, 27), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Rock),
                ],
                tileLayout: [
                    [0, 1],
                    [2, 3]
                ]
            },
            coalRock: {
                name: 'coalRock',
                tiles: [
                    new Tile(new Vector2D(0, 0,), new Vector2D(0, 0), new Vector2D(32, 32), true, 'ore', 0, TileType.Prop, TileTerrain.Rock),
                ],
                tileLayout: [
                    [0],
                ]
            },
            ironRock: {
                name: 'ironRock',
                tiles: [
                    new Tile(new Vector2D(0, 0,), new Vector2D(1, 0), new Vector2D(32, 32), true, 'ore', 0, TileType.Prop, TileTerrain.Rock),
                ],
                tileLayout: [
                    [0],
                ]
            },
            tinRock: {
                name: 'tinRock',
                tiles: [
                    new Tile(new Vector2D(0, 0,), new Vector2D(2, 0), new Vector2D(32, 32), true, 'ore', 0, TileType.Prop, TileTerrain.Rock),
                ],
                tileLayout: [
                    [0],
                ]
            },
            copperRock: {
                name: 'copperRock',
                tiles: [
                    new Tile(new Vector2D(0, 0,), new Vector2D(3, 0), new Vector2D(32, 32), true, 'ore', 0, TileType.Prop, TileTerrain.Rock),
                ],
                tileLayout: [
                    [0],
                ]
            },
            silverRock: {
                name: 'silverRock',
                tiles: [
                    new Tile(new Vector2D(0, 0,), new Vector2D(4, 0), new Vector2D(32, 32), true, 'ore', 0, TileType.Prop, TileTerrain.Rock),
                ],
                tileLayout: [
                    [0],
                ]
            },
            goldRock: {
                name: 'goldRock',
                tiles: [
                    new Tile(new Vector2D(0, 0,), new Vector2D(5, 0), new Vector2D(32, 32), true, 'ore', 0, TileType.Prop, TileTerrain.Rock),
                ],
                tileLayout: [
                    [0],
                ]
            },
            lamppost: {
                name: 'lamppost',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 34), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 35), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                ],
                tileLayout: [
                    [0],
                    [1]
                ]
            },
            woodenChest: {
                name: 'woodenChest',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(0, 13), new Vector2D(32, 32), true, 'container', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(1, 13), new Vector2D(32, 32), true, 'container', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(0, 14), new Vector2D(32, 32), true, 'container', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(1, 14), new Vector2D(32, 32), true, 'container', 0, TileType.Prop, TileTerrain.Wood)
                ],
                tileLayout: [
                    [[0], [1]],
                    [[2], [3]]
                ]
            },
            HouseTest: {
                name: 'HouseTest',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(2, 4), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(0, 11), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(1, 1), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(2, 1), new Vector2D(32, 32), false, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(4, 11), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(3, 1), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(1, 9), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(1, 10), new Vector2D(32, 32), false, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(2, 0), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(2, 1), new Vector2D(32, 32), false, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(3, 2), new Vector2D(32, 32), false, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(3, 9), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, -16), new Vector2D(55, 3), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(54, 0), new Vector2D(32, 32), false, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, -16), new Vector2D(55, 3), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(1, 2), new Vector2D(32, 32), false, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(58, 39), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(2, 3), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(62, 39), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(2, 3), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(2, 3), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(3, 3), new Vector2D(32, 32), false, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(4, 9), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(3, 9), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(51, 0), new Vector2D(32, 32), false, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 16), new Vector2D(56, 35), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(10, 16), new Vector2D(56, 43), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(8, 16), new Vector2D(56, 43), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, -16), new Vector2D(2, 11), new Vector2D(32, 32), false, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, -16), new Vector2D(0, 19), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(54, 0), new Vector2D(32, 32), false, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, -16), new Vector2D(0, 0), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(57, 40), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(1, 4), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(58, 40), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(62, 39), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(62, 40), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(59, 40), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(3, 4), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(50, 0), new Vector2D(32, 32), false, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(56, 37), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(8, -8), new Vector2D(19, 3), new Vector2D(32, 32), true, 'windowsdoors', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(56, 37), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(55, 1), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(58, 38), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(61, 37), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(8, 0), new Vector2D(56, 42), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(55, 1), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(57, 36), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(56, 43), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(57, 42), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(57, 36), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(57, 42), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(62, 41), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(57, 43), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(62, 41), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(57, 36), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(58, 43), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(57, 42), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(58, 37), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(50, 1), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(59, 38), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(60, 37), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(-8, 0), new Vector2D(58, 42), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(50, 1), new Vector2D(32, 32), true, 'roofs', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(8, 0), new Vector2D(61, 40), new Vector2D(32, 32), true, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(59, 35), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(57, 35), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 25), new Vector2D(32, 32), true, 'windowsdoors', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(57, 35), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 25), new Vector2D(32, 32), true, 'windowsdoors', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(56, 35), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(16, 16), new Vector2D(19, 3), new Vector2D(32, 32), true, 'windowsdoors', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(58, 35), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(24, 55), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(36, 31), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(59, 37), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 55), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(38, 31), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(57, 37), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(26, 26), new Vector2D(32, 32), true, 'windowsdoors', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 55), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(57, 37), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(27, 26), new Vector2D(32, 32), true, 'windowsdoors', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(56, 37), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(58, 37), new Vector2D(32, 32), false, 'walls', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(-16, -16), new Vector2D(19, 3), new Vector2D(32, 32), true, 'windowsdoors', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(-16, 0), new Vector2D(24, 10), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(16, 0), new Vector2D(25, 10), new Vector2D(32, 32), false, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(25, 10), new Vector2D(32, 32), false, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(-16, 0), new Vector2D(27, 6), new Vector2D(32, 32), false, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(-16, 0), new Vector2D(25, 10), new Vector2D(32, 32), false, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(16, 0), new Vector2D(26, 10), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(-16, 0), new Vector2D(25, 10), new Vector2D(32, 32), false, 'terrain', 0, TileType.Prop, TileTerrain.Wood)
                ],
                tileLayout: [
                    [[], [], [], [0], [], []],
                    [[], [], [1, 2], [9], [4, 5], []],
                    [[], [6], [7], [8, 9], [10], [23]],
                    [[14], [13, 14], [15], [16, 20, 35, 20, 20], [21], [22, 23, 24]],
                    [[25, 26, 27, 28, 29], [30, 31], [32, 33], [34, 35, 36], [37, 38], [39]],
                    [[40, 41], [84, 47, 44, 45, 46, 47], [56, 49, 58], [56, 58, 55, 54, 55], [56, 57, 58], [85, 64, 61, 62, 63, 64]],
                    [[65], [66], [69, 68], [69, 70], [71, 72], [73]],
                    [[], [74, 75, 76], [77, 78, 82, 80], [81, 82, 83], [84], [85, 86]],
                    [[], [87, 88], [89], [90], [93], [92, 93]]
                ]
            },
            planningTable: {
                name: 'planningTable',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(4, 71), new Vector2D(32, 32), true, 'victorianmarket', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(6, 71), new Vector2D(32, 32), true, 'victorianmarket', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(-16, 6), new Vector2D(3, 1), new Vector2D(32, 32), true, 'documents', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(-16, 0), new Vector2D(24, 11), new Vector2D(32, 32), true, 'interiorobjects', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 8), new Vector2D(1, 2), new Vector2D(32, 32), true, 'documents', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(-32, 0), new Vector2D(0, 2), new Vector2D(32, 32), true, 'documents', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(4, 72), new Vector2D(32, 32), true, 'victorianmarket', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(6, 72), new Vector2D(32, 32), true, 'victorianmarket', 0, TileType.Prop, TileTerrain.Wood)
                ],
                tileLayout: [
                    [[0], [1, 2, 3, 4, 5]],
                    [[6], [7]]
                ]
            },
            waterFilledBoat: {
                name: 'waterFilledBoat',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 27), new Vector2D(32, 32), true, 'exteriorobjects', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(30, 27), new Vector2D(32, 32), true, 'exteriorobjects', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(31, 27), new Vector2D(32, 32), true, 'exteriorobjects', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 29), new Vector2D(32, 32), true, 'exteriorobjects', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 28), new Vector2D(32, 32), true, 'exteriorobjects', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(30, 28), new Vector2D(32, 32), true, 'exteriorobjects', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(31, 28), new Vector2D(32, 32), true, 'exteriorobjects', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(29, 30), new Vector2D(32, 32), true, 'exteriorobjects', 0, TileType.Prop, TileTerrain.Wood)
                ],
                tileLayout: [
                    [[0], [1], [2], [3]],
                    [[4], [5], [6], [7]],
                ]
            },
            stoneSmelter: {
                name: 'stoneSmelter',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(0, 13), new Vector2D(32, 32), true, 'ore', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(1, 13), new Vector2D(32, 32), true, 'ore', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(0, 14), new Vector2D(32, 32), true, 'ore', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(1, 14), new Vector2D(32, 32), true, 'ore', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(0, 15), new Vector2D(32, 32), true, 'ore', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(1, 15), new Vector2D(32, 32), true, 'ore', 0, TileType.Prop, TileTerrain.Wood)
                ],
                tileLayout: [
                    [[0], [1]],
                    [[2], [3]],
                    [[4], [5]],
                ]
            },
            anvil: {
                name: 'anvil',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(10, 13), new Vector2D(32, 32), true, 'blacksmithsmelter', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(11, 13), new Vector2D(32, 32), true, 'blacksmithsmelter', 0, TileType.Prop, TileTerrain.Wood)
                ],
                tileLayout: [
                    [[0], [1]],
                ]
            },
            workbench: {
                name: 'workbench',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(8, 15), new Vector2D(32, 32), true, 'blacksmithsmelter', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(9, 15), new Vector2D(32, 32), true, 'blacksmithsmelter', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(8, 16), new Vector2D(32, 32), true, 'blacksmithsmelter', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(9, 16), new Vector2D(32, 32), true, 'blacksmithsmelter', 0, TileType.Prop, TileTerrain.Wood)
                ],
                tileLayout: [
                    [[0], [1]],
                    [[2], [3]],
                ]
            },
            choppingBlock: {
                name: 'choppingBlock',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(12, 12), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(1, 1), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(13, 12), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(12, 13), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(9, -4), new Vector2D(9, 12), new Vector2D(32, 32), true, 'woodshop', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(13, 13), new Vector2D(32, 32), true, 'terrain', 0, TileType.Prop, TileTerrain.Wood)
                ],
                tileLayout: [
                    [[0], [1, 2]],
                    [[3, 4], [5]]
                ]
            },
            planerBench: {
                name: 'planerBench',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(0, 0), new Vector2D(32, 32), true, 'woodshop', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(1, 0), new Vector2D(32, 32), true, 'woodshop', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(2, 0), new Vector2D(32, 32), true, 'woodshop', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(0, 1), new Vector2D(32, 32), true, 'woodshop', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(1, 1), new Vector2D(32, 32), true, 'woodshop', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(2, 1), new Vector2D(32, 32), true, 'woodshop', 0, TileType.Prop, TileTerrain.Wood)
                ],
                tileLayout: [
                    [[0], [1], [2]],
                    [[3], [4], [5]],
                ]
            },
            stoneCutter: {
                name: 'stoneCutter',
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(11, 42), new Vector2D(32, 32), true, 'victorianmarket', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(10, 11), new Vector2D(32, 32), true, 'blacksmithsmelter', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(13, 42), new Vector2D(32, 32), true, 'victorianmarket', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(11, 11), new Vector2D(32, 32), true, 'blacksmithsmelter', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(11, 43), new Vector2D(32, 32), true, 'victorianmarket', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(10, 12), new Vector2D(32, 32), true, 'blacksmithsmelter', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(13, 43), new Vector2D(32, 32), true, 'victorianmarket', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(11, 12), new Vector2D(32, 32), true, 'blacksmithsmelter', 0, TileType.Prop, TileTerrain.Wood)
                ],
                tileLayout: [
                    [[0, 1], [2, 3]],
                    [[4, 5], [6, 7]],
                ]
            }
        };

        let keys = Object.keys(TileMaker.CustomTiles);

        for (let i = 0, l = keys.length; i < l; ++i) {
            let tileObject = TileMaker.CustomTiles[keys[i]];
            this.CombineTilesToImage(tileObject.tiles, tileObject.tileLayout, tileObject.name);
        }
    }
}

export { TileMaker };