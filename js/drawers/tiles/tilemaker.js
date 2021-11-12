import { CanvasDrawer, CanvasAtlasObject, TileData, Tile, TileType, TileTerrain, Vector2D, CMath } from '../../internal.js';

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
        tempCanvas.setAttribute('height', imageSize.y);
        tempCanvas.setAttribute('width', imageSize.x);

        for (let y = 0; y < tileLayout.length; y++) {
            for (let x = 0; x < tileLayout[y].length; x++) {

                if (Array.isArray(tileLayout[y][x]) === true) {
                    for (let i = 0; i < tileLayout[y][x].length; i++) {
                        TileMaker.DrawOnCanvas(tempCanvas, tiles[tileLayout[y][x][i]], x, y);
                    }
                } else {
                    let drawingTile = tiles[tileLayout[y][x]];
                    TileMaker.DrawOnCanvas(tempCanvas, drawingTile, x, y);
                }
            }
        }

        let newCanvasAtlas = new CanvasAtlasObject(CanvasDrawer.GCD, tempCanvas.toDataURL('image/png'), imageSize.x + 1, imageSize.y + 1, 32, objectName);
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

        for (let x = 0; x < loopX + 1; x++) {
            for (let y = 0; y < loopY + 1; y++) {
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

    static TileBonesToCanvas(tile, bones, objectName = 'default') {
        let tempCanvas = document.createElement('canvas');
        let imageSize = new Vector2D(bones.bones.length * bones.size.x, bones.size.y);
        tempCanvas.setAttribute('height', imageSize.y);
        tempCanvas.setAttribute('width', imageSize.x);

        let rotationCanvas = document.createElement('canvas');
        rotationCanvas.setAttribute('height', tile.size.y);
        rotationCanvas.setAttribute('width', tile.size.x);

        console.log(bones);

        for (let i = 0; i < bones.bones.length; i++) {
            rotationCanvas.getContext('2d').save();

            rotationCanvas.getContext('2d').translate(rotationCanvas.width / 2, rotationCanvas.height / 2);
            let rotation = ((bones.bones[i].forward * Math.PI / 180) - (180 * Math.PI / 180) + (90 * Math.PI / 180));
            let test = new Vector2D(26, 16);
            let center = new Vector2D(16, 16);
            test.Rotate(center, bones.bones[i].forward - 180);
            console.log(test);
            rotationCanvas.getContext('2d').rotate(rotation);

            rotationCanvas.getContext('2d').drawImage(
                CanvasDrawer.GCD.canvasAtlases[tile.atlas].canvas,
                tile.tilePosition.x,
                tile.tilePosition.y,
                tile.size.x,
                tile.size.y,
                -tile.size.x / 2,//(-rotationCanvas.width / 2),// + ((bones.size.y - bones.bones[i].y) / 2),
                -tile.size.y / 2,//(-rotationCanvas.width / 2),// + ((bones.size.x - bones.bones[i].x) / 2),
                tile.size.x,
                tile.size.y
            );

            let base64 = rotationCanvas.toDataURL('image/png');
            if (base64.length > 256) {
                //TileMaker.SaveAsFile(base64, 0 + '-' + i + '_' + tile.name);
            }

            tempCanvas.getContext('2d').drawImage(
                rotationCanvas,
                0,
                0,
                tile.size.x,
                tile.size.y,
                (i * bones.size.x),
                0,
                tile.size.x,
                tile.size.y,
            );

            rotationCanvas.getContext('2d').restore();
            rotationCanvas.getContext('2d').clearRect(0, 0, bones.size.x, bones.size.y);
        }

        let newCanvasAtlas = new CanvasAtlasObject(CanvasDrawer.GCD, tempCanvas.toDataURL('image/png'), imageSize.x + 1, imageSize.y + 1, bones.size.x, objectName);
        CanvasDrawer.GCD.AddAtlas(newCanvasAtlas, objectName);
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

        for (let i = 0; i < keys.length; i++) {
            let tileObject = TileMaker.CustomTiles[keys[i]];
            this.CombineTilesToImage(tileObject.tiles, tileObject.tileLayout, tileObject.name);
        }
    }
}

export { TileMaker };