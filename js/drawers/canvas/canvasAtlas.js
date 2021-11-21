import { Vector2D, Tile, TileType, TileTerrain, correctMouse, Color, CMath } from '../../internal.js';

/**
 * @class
 * @constructor
 */
class CanvasAtlas {
    constructor(CanvasDrawer, url, width = 0, height = 0, atlasSize = 32, name = 'default') {
        this.sprites = {};
        this.canvas;
        this.canvasCtx;
        this.img;
        this.url = url;
        this.width = width;
        this.height = height;
        this.atlasSize = atlasSize;
        this.name = name;
        this.CanvasDrawer = CanvasDrawer;

        this.startDrag;
        this.endDrag;

        this.bwCanvas;
        this.bwCanvasCtx;
        this.cutoutData;
        this.GenerateBWAtlas = false;

        this.LoadImage();
    }

    toJSON() {
        return {
            url: this.url,
            width: this.width,
            height: this.height,
            atlasSize: this.atlasSize,
            name: this.name
        }
    }

    GenerateSprites(width, height) {

    }

    LoadImage() {
        this.img = new Image();

        this.img.crossOrigin = "Anonymous";
        this.img.onload = () => { this.CreateOffscreenCanvas() };
        this.img.src = this.url;
    }

    CreateOffscreenCanvas() {
        this.canvas = document.createElement('canvas');

        this.width = this.canvas.width = this.img.width;
        this.height = this.canvas.height = this.img.height;
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvasCtx.imageSmoothingEnabled = false;
        this.canvas.id = this.name;

        this.canvasCtx.drawImage(this.img, 0, 0);

        document.body.appendChild(this.canvas);
        this.canvas.addEventListener('mousedown', this);
        this.canvas.addEventListener('mouseup', this);
        this.canvas.addEventListener('click', this);

        //this.startDrag = new Vector2D(0, 0);
        //this.endDrag = new Vector2D(0, 0);

        if (this.GenerateBWAtlas === true) {
            this.bwCanvas = document.createElement('canvas');
            this.bwCanvas.width = this.img.width;
            this.bwCanvas.height = this.img.height;

            document.body.appendChild(this.bwCanvas);
            this.bwCanvasCtx = this.bwCanvas.getContext('2d');
            this.bwCanvasCtx.imageSmoothingEnabled = false;

            this.bwCanvasCtx.drawImage(this.img, 0, 0);

            this.GenerateCutoutAtlas();
        }

        this.CanvasDrawer.hasLoadedAllImages[this.name] = true;
    }

    GenerateCutoutAtlas() {
        this.cutoutData = this.bwCanvasCtx.getImageData(0, 0, this.bwCanvas.width, this.bwCanvas.height);

        for (let i = 0; i < this.cutoutData.data.length; i += 4) {
            this.cutoutData.data[i] = this.cutoutData.data[i + 1] = this.cutoutData.data[i + 2] = 5;
        }

        this.bwCanvasCtx.putImageData(this.cutoutData, 0, 0);
        //this.bwCanvasCtx.globalCompositeOperation = 'source-in';
    }

    ChangeCutoutAtlasColor(color) {
        let index = this.height * this.width * 4,
            time = 0;
        for (let y = this.height; y >= 0; y--) {
            for (let x = this.width; x >= 0; x--) {
                if (this.cutoutData.data[index + 3] > 0) {
                    this.cutoutData.data[index] = CMath.Lerp(color.red, 5, CMath.EaseIn(time / 100));
                    this.cutoutData.data[index + 1] = CMath.Lerp(color.green, 5, CMath.EaseIn(time / 100));
                    this.cutoutData.data[index + 2] = CMath.Lerp(color.blue, 5, CMath.EaseIn(time / 100));
                }
                index -= 4;
            }
            time++;
        }
        this.bwCanvasCtx.putImageData(this.cutoutData, 0, 0);
        //this.bwCanvasCtx.fillStyle = color.ToString();
        //this.bwCanvasCtx.fillRect(0, 0, this.bwCanvas.width, this.bwCanvas.height);
    }

    handleEvent(e) {
        switch (e.type) {
            case 'mousedown':
                this.startDrag = e;// mouseToAtlas(e, this.atlasSize);
                break;

            case 'mouseup':
                let canvasPos = new Vector2D(this.startDrag.x, this.startDrag.y);
                this.startDrag = correctMouse(this.startDrag);
                this.startDrag.ToGrid(this.startDrag.size);
                this.endDrag = correctMouse(e);
                // @ts-ignore
                this.endDrag.ToGrid(this.endDrag.size);

                let calcCoords = new Vector2D(this.endDrag.x, this.endDrag.y);
                calcCoords.Sub(this.startDrag);
                calcCoords.Add({ x: 1, y: 1 });

                this.CanvasDrawer.SetSelection(
                    new Tile(
                        canvasPos,
                        new Vector2D(this.startDrag.x, this.startDrag.y),
                        new Vector2D(calcCoords.x * this.atlasSize, calcCoords.y * this.atlasSize),
                        false,
                        this.name
                    )
                );
                break;

            /*case 'click':
                let atlasCoords = mouseToAtlas(e, this.atlasSize);
 
                this.CanvasDrawer.selectedSprite = new CanvasSprite(atlasCoords.x, atlasCoords.y, this.atlasSize, this.atlasSize, this.name);
                break;*/
        }
    }
}

/**
 * @class
 * @constructor
 * @extends CanvasAtlas
 */
class CanvasAtlasObject extends CanvasAtlas {
    constructor(CanvasDrawer, url, width = 0, height = 0, atlasSize = 32, name = 'default') {
        super(CanvasDrawer, url, width, height, atlasSize, name);
    }

    SetSelection(position) {
        this.CanvasDrawer.SetSelection(
            new Tile(
                position,
                new Vector2D(0, 0),
                new Vector2D(this.width, this.height),
                false,
                this.name,
                0,
                TileType.Prop,
                TileTerrain.Ground
            )
        );
    }

    handleEvent(e) {
        switch (e.type) {
            case 'mouseup':
                let canvasPos = new Vector2D(e.x, e.y);

                this.CanvasDrawer.SetSelection(
                    new Tile(
                        canvasPos,
                        new Vector2D(0, 0),
                        new Vector2D(this.width, this.height),
                        false,
                        this.name,
                        0,
                        TileType.Prop,
                        TileTerrain.Ground
                    )
                );
                break;
        }
    }
}

export { CanvasAtlas, CanvasAtlasObject };