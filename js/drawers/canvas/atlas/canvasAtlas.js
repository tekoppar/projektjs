import { Vector2D, Tile, TileType, TileTerrain, AtlasController, correctMouse, ShadowCanvasObject, CMath, LightSystem, CanvasDrawer, BWDrawingType } from '../../../internal.js';

/**
 * @class
 * @constructor
 */
class CanvasAtlas {

    /**
     * Creates a new CanvasAtlas
     * @param {CanvasDrawer} CanvasDrawer 
     * @param {string} url 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} atlasSize 
     * @param {string} name 
     */
    constructor(CanvasDrawer, url, width = 0, height = 0, atlasSize = 32, name = 'default') {
        this.sprites = {};
        this.canvasObject = new CanvasObject(this, url, width, height);
        this.width = width;
        this.height = height;
        this.atlasSize = atlasSize;
        this.name = name;
        this.CanvasDrawer = CanvasDrawer;

        this.startDrag;
        this.endDrag;
    }

    toJSON() {
        return {
            url: this.canvasObject.url,
            width: this.width,
            height: this.height,
            atlasSize: this.atlasSize,
            name: this.name
        }
    }

    GenerateSprites(width, height) {

    }

    ImageLoaded() {
        document.body.appendChild(this.canvasObject.canvas);
        this.canvasObject.canvas.id = this.name;
        this.canvasObject.canvas.addEventListener('mousedown', this);
        this.canvasObject.canvas.addEventListener('mouseup', this);
        this.canvasObject.canvas.addEventListener('click', this);
        AtlasController._Instance.hasLoadedAllImages[this.name] = true;
    }

    GetCanvas() {
        return this.canvasObject.canvas;
    }

    GetSpriteSize() {
        if (this.atlasSize !== -1) {
            return new Vector2D(this.atlasSize, this.atlasSize);
        } else {
            return new Vector2D(this.canvasObject.width, this.canvasObject.height);
        }
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

    /**
     * Creates a new CanvasAtlasObject
     * @param {CanvasDrawer} CanvasDrawer 
     * @param {string} url 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} atlasSize 
     * @param {string} name 
     */
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

class CanvasObject {
    constructor(parent, url, width = 0, height = 0) {
        this.parent = parent;
        this.url = url;
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', width.toFixed());
        this.canvas.setAttribute('height', height.toFixed());
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvasCtx.imageSmoothingEnabled = false;
        this.image;
        this.imageData;

        this.LoadImage();
    }

    LoadImage() {
        this.image = new Image();

        this.image.crossOrigin = "Anonymous";
        this.image.onload = () => { this.DrawImage() };
        this.image.src = this.url;
    }

    DrawImage() {
        this.canvasCtx.drawImage(this.image, 0, 0);
        this.imageData = this.canvasCtx.getImageData(0, 0, this.width, this.height);
        this.parent.ImageLoaded();
    }
}

/**
 * @class
 * @constructor
 */
class ShadowCanvasOperation {

    /**
     * 
     * @param {CanvasObject} canvasObject 
     */
    constructor(canvasObject) {
        this.canvasObject = canvasObject;

        this.shadowCanvas = document.createElement('canvas');

        if (this.canvasObject.parent.atlasSize !== -1) {
            this.shadowCanvas.setAttribute('width', this.canvasObject.parent.atlasSize.toFixed());
            this.shadowCanvas.setAttribute('height', this.canvasObject.parent.atlasSize.toFixed());
        } else {
            this.shadowCanvas.setAttribute('width', this.canvasObject.width.toFixed());
            this.shadowCanvas.setAttribute('height', this.canvasObject.height.toFixed());
        }
        document.body.appendChild(this.shadowCanvas);
        this.shadowCanvasCtx = this.shadowCanvas.getContext('2d');
        this.shadowCanvasCtx.imageSmoothingEnabled = false;

        this.shadowData;
        this.drawType = BWDrawingType.None;
        this.lastShadowColor = LightSystem.SkyLight.color.Clone();

        this.GenerateShadow();
    }

    UpdateShadow(tile) {
        if (tile === undefined)
            return;

        this.shadowCanvasCtx.clearRect(0, 0, tile.size.x, tile.size.y);
        this.shadowCanvasCtx.drawImage(
            this.canvasObject.canvas,
            tile.GetPosX(),
            tile.GetPosY(),
            tile.size.x,
            tile.size.y,
            0,
            0,
            tile.size.x,
            tile.size.y
        );
        this.shadowData = this.shadowCanvasCtx.getImageData(0, 0, this.shadowCanvas.width, this.shadowCanvas.height);

        this.GenerateShadow();
        this.ChangeColor(this.lastShadowColor);
        //this.bwCanvasCtx.putImageData(this.cutoutData, 0, 0);
    }

    GenerateShadow() {
        if (this.shadowCanvas === undefined)
            return;

        this.shadowData = this.shadowCanvasCtx.getImageData(0, 0, this.shadowCanvas.width, this.shadowCanvas.height);

        for (let i = 0, l = this.shadowData.data.length; i < l; ++i) {
            this.shadowData.data[i] = LightSystem.SkyLight.color.red;
            this.shadowData.data[++i] = LightSystem.SkyLight.color.green;
            this.shadowData.data[++i] = LightSystem.SkyLight.color.blue;
            ++i;
        }

        this.shadowCanvasCtx.putImageData(this.shadowData, 0, 0);
        //this.bwCanvasCtx.globalCompositeOperation = 'source-in';
    }

    ChangeColor(color) {
        if (this.shadowCanvas === undefined)
            return;

        this.lastShadowColor = color.Clone();

        let index = this.shadowCanvas.height * this.shadowCanvas.width * 4,
            time = 0;

        switch (this.drawType) {
            case BWDrawingType.Behind:
                for (let y = this.shadowCanvas.height; y > 0; y--) {
                    for (let x = this.shadowCanvas.width; x > 0; x--) {
                        if (this.shadowData.data[index + 3] > 0) {
                            this.shadowData.data[index] = CMath.Clamp(CMath.Lerp(color.red, LightSystem.SkyLight.color.red, CMath.EaseIn(time / 100)), 0, 255);
                            this.shadowData.data[index + 1] = CMath.Clamp(CMath.Lerp(color.green, LightSystem.SkyLight.color.green, CMath.EaseIn(time / 100)), 0, 255);
                            this.shadowData.data[index + 2] = CMath.Clamp(CMath.Lerp(color.blue, LightSystem.SkyLight.color.blue, CMath.EaseIn(time / 100)), 0, 255);
                        }
                        index -= 4;
                    }

                    if (time <= 100)
                        time++;
                }
                break;
            case BWDrawingType.Front:
                for (let y = this.shadowCanvas.height; y > 0; y--) {
                    for (let x = this.shadowCanvas.width; x > 0; x--) {
                        if (this.shadowData.data[index + 3] > 0) {
                            this.shadowData.data[index] = LightSystem.SkyLight.color.red;
                            this.shadowData.data[index + 1] = LightSystem.SkyLight.color.green;
                            this.shadowData.data[index + 2] = LightSystem.SkyLight.color.blue;
                        }
                        index -= 4;
                    }

                    if (time <= 100)
                        time++;
                }
                break;
        }

        this.shadowCanvasCtx.putImageData(this.shadowData, 0, 0);
        //this.bwCanvasCtx.fillStyle = color.ToString();
        //this.bwCanvasCtx.fillRect(0, 0, this.bwCanvas.width, this.bwCanvas.height);
    }
}

export { CanvasAtlas, CanvasAtlasObject, CanvasObject, ShadowCanvasOperation };