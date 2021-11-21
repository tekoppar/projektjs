import { CanvasDrawer, CanvasAtlasObject, TileData, Tile, TileType, TileTerrain, Vector2D, Vector, CMath, Math3D } from '../../internal.js';
import { XORCanvasSprite } from './TileMakerCustomSheets/customSheetsFunctions.js';

class TileMaker {
    static CustomTiles;

    static DrawOnCanvas(tempCanvas, drawingTile, x, y) {
        if (CanvasDrawer.GCD.canvasAtlases[drawingTile.atlas] !== undefined) {
            let canvas = CanvasDrawer.GCD.canvasAtlases[drawingTile.atlas].canvas;
            tempCanvas.getContext('2d').drawImage(
                canvas,
                drawingTile.GetPosX(),
                drawingTile.GetPosY(),
                drawingTile.size.x,
                drawingTile.size.y,
                x * 32,
                y * 32,
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
                        TileMaker.DrawOnCanvas(tempCanvas, tiles[tileLayout[y][x][i]], x, y);
                    }
                } else {
                    let drawingTile = tiles[tileLayout[y][x]];
                    TileMaker.DrawOnCanvas(tempCanvas, drawingTile, x, y);
                }
            }
        }

        let newCanvasAtlas = new CanvasAtlasObject(CanvasDrawer.GCD, tempCanvas.toDataURL('image/png'), imageSize.x + 1, imageSize.y + 1, 32, objectName);
        newCanvasAtlas.GenerateBWAtlas = true;
        CanvasDrawer.GCD.AddAtlas(newCanvasAtlas, objectName);
    }

    static SplitAtlasToTiles(atlas, tileSize) {
        let splitPosition = new Vector2D(0, 0),
            loopX = atlas.width / tileSize.x,
            loopY = atlas.height / tileSize.y;

        let canvas = atlas.canvas;
        let ctx = canvas.getContext('2d');
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
            let pixelData = CanvasDrawer.GCD.canvasAtlases[tile.atlas].canvas.getContext('2d').getImageData(
                tile.GetPosX(),
                tile.GetPosY(),
                tile.size.x,
                tile.size.y
            );

            Math3D.RotatePixelData(pixelData, new Vector2D(tile.size.x, tile.size.y), new Vector(0, 0, bones.bones[i].forward), 0, new Vector(tile.size.x / 2, tile.size.y / 2, 0));
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
        if (CanvasDrawer.GCD.canvasAtlases[tile.atlas] !== undefined) {
            let canvas = CanvasDrawer.GCD.canvasAtlases[tile.atlas].canvas;
            let ctx = canvas.getContext('2d');
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
        if (CanvasDrawer.GCD.canvasAtlases[tile.atlas] !== undefined) {
            let canvas = CanvasDrawer.GCD.canvasAtlases[tile.atlas].canvas;
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
        };

        let keys = Object.keys(TileMaker.CustomTiles);

        for (let i = 0, l = keys.length; i < l; ++i) {
            let tileObject = TileMaker.CustomTiles[keys[i]];
            this.CombineTilesToImage(tileObject.tiles, tileObject.tileLayout, tileObject.name);
        }
    }
}

export { TileMaker };