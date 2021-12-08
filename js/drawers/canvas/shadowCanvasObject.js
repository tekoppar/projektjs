import { Vector2D, BoxCollision, AtlasController, Tile, LightSystem, CollisionHandler, Math3D, CMath, Vector4D, Vector } from '../../internal.js';

/**
 * @readonly
 * @enum {Number}
 */
const ShadowRotationLUT = {
    'mainP': 90,
    'birchLog': 0,
    'stonePiece': 45,
    'coal': 90,
    'iron': 90,
    'tin': 90,
    'copper': 90,
    'silver': 90,
    'gold': 90,
    'ironBar': 0,
    'tinBar': 0,
    'copperBar': 0,
    'silverBar': 0,
    'goldBar': 0,
    'bronzeBar': 0,
    'steelBar': 0,
};

/**
 * @class
 * @constructor
 */
class ShadowCanvasObject {
    constructor() {
        /** @type {HTMLCanvasElement} */
        this.canvas;

        /** @type {CanvasRenderingContext2D} */
        this.canvasCtx;

        /** @type {ImageData} */
        this.shadowData;

        /** @type {Vector2D} */
        this.centerPosition;

        /** @type {boolean} */
        this.firstDraw = false;

        /** @type {boolean} */
        this.UpdatedThisFrame = false;
    }

    /**
     * 
     * @param {Tile} tile 
     */
    DrawToShadowCanvas(tile) {
        let biggest = Math.max(tile.size.x, tile.size.y);

        if (this.firstDraw === false) {
            this.canvasCtx.clearRect(0, 0, biggest, biggest);
            this.firstDraw = !this.firstDraw;
        }

        this.canvasCtx.drawImage(
            AtlasController.GetAtlas(tile.atlas).GetCanvas(),
            tile.GetPosX(),
            tile.GetPosY(),
            tile.size.x,
            tile.size.y,
            (tile.size.y - tile.size.x) / 2,
            0,
            tile.size.x,
            tile.size.y
        );
    }

    /**
     * 
     * @param {Vector2D} position 
     * @param {BoxCollision} boxCollision 
     * @param {Tile} tile 
     */
    UpdateRealTimeShadow(name, position, boxCollision, tile) {
        let biggest = Math.max(tile.size.x, tile.size.y);

        this.canvasCtx.globalCompositeOperation = 'source-atop';
        this.canvasCtx.fillStyle = LightSystem.SkyLight.color.ToString();
        this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasCtx.globalCompositeOperation = 'source-over';
        this.shadowData = this.canvasCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.firstDraw = false;

        /*let color = LightSystem.SkyLight.color.Clone();
        for (let i = 0, l = this.shadowData.data.length; i < l; ++i) {
            this.shadowData.data[i] = color.red;
            this.shadowData.data[++i] = color.green;
            this.shadowData.data[++i] = color.blue;
            if (this.shadowData.data[i + 1] > 0) {
                this.shadowData.data[++i] = 160;
            } else
                ++i;
        }*/

        let overlaps = CollisionHandler.GCH.GetOverlapByClass(boxCollision, 'AmbientLight');

        if (overlaps !== false) {
            let shadowPos = position.Clone();
            shadowPos.y -= 15;
            let rotation = CMath.LookAt2D(shadowPos, overlaps.collisionOwner.GetPosition().Clone());
            rotation -= ShadowRotationLUT[name] !== undefined ? ShadowRotationLUT[name] : 90;

            Math3D.RotatePixelData2D(this.shadowData.data, new Vector2D(biggest, biggest), new Vector(0, 0, rotation), 0, new Vector(biggest / 2, biggest / 2, biggest / 2));
            this.canvasCtx.putImageData(this.shadowData, 0, 0);

            let rotationArr = [new Vector4D(biggest / 2, biggest, biggest / 2, 0)];
            Math3D.Rotate(0, 0, CMath.DegreesToRadians(rotation), rotationArr, new Vector(biggest / 2, biggest / 2, biggest / 2));
            this.centerPosition = new Vector2D(rotationArr[0].x, rotationArr[0].y);
            this.centerPosition.x -= tile.size.x / 2;
            this.centerPosition.y -= tile.size.y - 10;

            //this.canvasCtx.putImageData(this.shadowData, 0, 0);

            this.UpdatedThisFrame = true;
        }
    }

    /**
     * 
     * @param {Vector2D} size 
     * @param {Tile} tile 
     */
    GenerateRealTimeShadow(size, tile) {
        this.canvas = document.createElement('canvas');
        let biggest = Math.max(size.x, size.y);
        this.canvas.width = biggest;
        this.canvas.height = biggest;

        //document.body.appendChild(this.canvas);
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvasCtx.imageSmoothingEnabled = false;

        this.canvasCtx.drawImage(
            AtlasController.GetAtlas(tile.atlas).GetCanvas(),
            tile.GetPosX(),
            tile.GetPosY(),
            tile.size.x,
            tile.size.y,
            (tile.size.y - tile.size.x) / 2,
            0,
            tile.size.x,
            tile.size.y
        );

        this.shadowData = this.canvasCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0, l = this.shadowData.data.length; i < l; ++i) {
            this.shadowData.data[i] = LightSystem.SkyLight.color.red;
            this.shadowData.data[++i] = LightSystem.SkyLight.color.green;
            this.shadowData.data[++i] = LightSystem.SkyLight.color.blue;
            ++i;
        }

        this.canvasCtx.putImageData(this.shadowData, 0, 0);
        this.centerPosition = new Vector2D(0, 0);
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetSize() {
        return new Vector2D(this.canvas.width, this.canvas.height);
    }
}

export { ShadowCanvasObject };