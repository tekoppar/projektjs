import {
    Cobject, LightSystem, Color, Math3D, Vector2D, Vector, CanvasDrawer, OperationType,
    LightingOperation, BoxCollision, IsLittleEndian, CMath
} from '../../internal.js';

/**
 * Enum for light falloff type
 * @readonly
 * @enum {Number}
 */
const LightFalloffType = {
    Falloff: 0,
    InverseSquareLaw: 1,
}

/**
 * @class
 * @constructor
 * @public
 * @extends Cobject
 */
class AmbientLight extends Cobject {

    /**
     * Creates a new ambient light
     * @param {Vector2D} position 
     * @param {Color} color 
     * @param {Number} attenuation 
     * @param {Number} intensity 
     * @param {Number} colorIntensity 
     * @param {Number} lightConstant 
     * @param {Number} lightLinear 
     * @param {Number} lightQuad 
     * @param {Number} drawScale 
     * @param {LightFalloffType} lightFalloffType 
     */
    constructor(position, color = new Color(243, 197, 47), attenuation = 100, intensity = 750.0, colorIntensity = 1.0, lightConstant = 600, lightLinear = 0.2, lightQuad = 0.4, drawScale = 1, lightFalloffType = LightFalloffType.InverseSquareLaw) {
        super(position);

        /**@type {string} */
        this.name = 'AmbientLight' + this.UID;

        /**@type {Color} */
        this.color;
        this.SetColor(color);

        /**@type {Number} */
        this.attenuation = attenuation;

        /**@type {Number} */
        this.halfAttenuation = attenuation * 0.5;

        /**@type {Number} */
        this.intensity = intensity;

        /**@type {Number} */
        this.drawScale = drawScale;

        /**@type {Number} */
        this.colorIntensity = colorIntensity;

        /**@type {LightFalloffType} */
        this.lightFalloffType = lightFalloffType;

        /**@type {Number} */
        this.constant = lightConstant;

        /**@type {Number} */
        this.linear = lightLinear;

        /**@type {Number} */
        this.quad = lightQuad;

        /**@type {ImageData} */
        this.lightData;

        /**@type {ImageData} */
        this.colorData;

        /**@type {BoxCollision} */
        this.BoxCollision = new BoxCollision(
            new Vector2D(position.x - this.halfAttenuation, position.y - this.halfAttenuation),
            new Vector2D(this.attenuation, this.attenuation),
            false,
            this,
            true
        );
        this.BoxCollision.debugDraw = false;

        /**@type {Array} */
        this.subRectData = [];

        this.imageDataBuf;
        this.imageDataBuf8;
        this.imageData;
        this.colorImageDataBuf;
        this.colorImageDataBuf8;
        this.colorImageData;

        this.BoxCollision.UpdateCollision();

        this.frameBuffer = document.createElement('canvas');
        this.frameBuffer.setAttribute('width', this.attenuation.toString());
        this.frameBuffer.setAttribute('height', this.attenuation.toString());
        document.getElementById('container-allcanvases').appendChild(this.frameBuffer);
        this.frameBufferCtx = this.frameBuffer.getContext('2d');
        this.frameBufferCtx.imageSmoothingEnabled = true;

        this.colorFrameBuffer = document.createElement('canvas');
        this.colorFrameBuffer.setAttribute('width', this.attenuation.toString());
        this.colorFrameBuffer.setAttribute('height', this.attenuation.toString());
        document.getElementById('container-allcanvases').appendChild(this.colorFrameBuffer);
        this.colorFrameBufferCtx = this.colorFrameBuffer.getContext('2d');
        this.colorFrameBufferCtx.imageSmoothingEnabled = true;

        this.colorFrameBufferCtx.fillStyle = 'rgba(0,0,0,0)';
        this.colorFrameBufferCtx.fillRect(0, 0, this.colorFrameBuffer.width, this.colorFrameBuffer.height);

        this.finished = false;
        this.GenerateLightImage();

        this.drawingOperation = new LightingOperation(this, position, CanvasDrawer.GCD.frameBuffer, this);
        this.drawingOperation.owner = this;
        CanvasDrawer.GCD.AddDrawOperation(this.drawingOperation, OperationType.lighting);

        LightSystem.AllAmbientLights.push(this);
    }

    SetPosition(position) {
        if (this.position.Equal(position) === true)
            return;

        this.position.x = position.x;
        this.position.y = position.y;
        this.BoxCollision.position.x = this.position.x - this.halfAttenuation;
        this.BoxCollision.position.y = this.position.y - this.halfAttenuation;
        this.BoxCollision.boundingBox.x = this.position.x;
        this.BoxCollision.boundingBox.y = this.position.y;

        this.BoxCollision.UpdateCollision();

        this.FlagDrawingUpdate(this.position);
    }

    /**
     * Sets the color of the light from either a string or a color.
     * @param {string|Color} color 
     */
    SetColor(color) {
        this.color = Color.ColorToRGBA(color);
    }

    /**
     * Draws the light onto a canvasContext
     * @param {CanvasRenderingContext2D} ctx 
     */
    DrawLight(ctx) {
        ctx.drawImage(this.colorFrameBuffer, this.position.x - this.halfAttenuation, this.position.y - this.halfAttenuation);
    }

    NeedsRedraw(position) {
        if (this.drawingOperation !== undefined && this.drawingOperation.DrawState() === false) {
            this.FlagDrawingUpdate(position);
        }
    }

    FlagDrawingUpdate(position) {
        if (this.drawingOperation !== undefined && this.drawingOperation.DrawState() === false) {
            this.drawingOperation.Update(position);
            //document.getElementById('gameobject-draw-debug').innerHTML += this.name + "\r\n";
        }
    }

    /**
     * Gets a sub rectangle from the lights image data.
     * @param {Vector2D} position 
     * @param {Vector2D} size 
     * @returns {Array<Number>}
     */
    GetSubRect(position, size) {
        let startX = Math.max(Math.floor(position.x), 0),
            startY = Math.max(Math.floor(position.y), 0),
            index = -1,
            preWidth = this.attenuation,
            subRectData = [];

        for (let y = startY, lY = startY + size.y; y < lY; ++y) {
            index = (y * preWidth * 4);
            for (let x = startX * 4, l = (startX + size.x) * 4; x < l; x += 4) {

                if (index + x >= this.lightData.data.length)
                    return subRectData;

                subRectData.push(this.lightData.data[index + x]);
                subRectData.push(this.lightData.data[index + x + 1]);
                subRectData.push(this.lightData.data[index + x + 2]);
                subRectData.push(this.lightData.data[index + x + 3]);
                //subRectData.push(this.lightData.data[index + x], this.lightData.data[(index + x) + 1], this.lightData.data[(index + x) + 2], this.lightData.data[(index + x) + 3]);
            }
        }

        return subRectData;
    }

    /**
     *  Gets a sub rectangle from the lights image data.
     * @param {Number} pX 
     * @param {Number} pY 
     * @param {Number} w 
     * @param {Number} h 
     * @returns {Array<Number>}
     */
    GetSubRectSpeed(pX, pY, w, h, dataType = false) {
        let startX = Math.max(Math.floor(pX), 0),
            startY = Math.max(Math.floor(pY), 0),
            preWidth = this.attenuation * 4,
            data = dataType === false ? this.lightData.data : this.colorData.data,
            y = startY,
            x = 0,
            lX = 0,
            loopX = startX * 4,
            l = ((startX + w) * 4) - loopX,
            iSubRect = 0,
            arrLength = (((startY + h) - startY) * ((startX + w) - startX)) * 4,
            endY = ((startY + h) * preWidth) + loopX;

        startY = (startY * preWidth) + loopX;

        if (this.subRectData.length < arrLength)
            this.subRectData.length = Math.floor(arrLength);

        for (y = startY; y < endY; y += preWidth) {
            for (x = y, lX = l + y; x < lX; ++x, ++iSubRect) {
                this.subRectData[iSubRect] = data[x];
                this.subRectData[++iSubRect] = data[++x];
                this.subRectData[++iSubRect] = data[++x];
                this.subRectData[++iSubRect] = data[++x];
            }
        }

        return this.subRectData;
    }

    /**
     * Gets a sub rectangle from the lights image data.
     * @param {Number} pX 
     * @param {Number} pY 
     * @param {Number} w 
     * @param {Number} h 
     * @returns {Array<Number>}
     * @deprecated Superseded by GetSubRectSpeed since splitting an int32 into 4 int8s is too costly compared to reading 4x times.
     */
    GetSubRectArr32(pX, pY, w, h) {
        let startX = Math.max(Math.floor(pX), 0),
            startY = Math.max(Math.floor(pY), 0),
            subRectData = [],
            index = -1;

        if (IsLittleEndian === true) {
            for (let y = startY, yL = startY + h; y < yL; ++y) {
                for (let x = startX, xL = startX + w; x < xL; ++x) {
                    index = y * this.attenuation + x;
                    //let colors = IntMath.Int32ToInt8(this.imageData[y * this.attenuation + x]);
                    //let colors = this.imageData[y * this.attenuation + x];
                    //subRectData.push(colors[0], colors[1], colors[2], colors[3]);
                    subRectData.push(this.imageData[index] & 0xff);
                    subRectData.push((this.imageData[index] >> 8) & 0xff);
                    subRectData.push((this.imageData[index] >> 16) & 0xff);
                    subRectData.push((this.imageData[index] >> 24) & 0xff);
                }
            }
        } else {
            for (let y = startY, yL = startY + h; y < yL; ++y) {
                for (let x = startX, xL = startX + w; x < xL; ++x) {
                    index = y * this.attenuation + x;
                    //let colors = IntMath.Int32ToInt8(this.imageData[y * this.attenuation + x]);
                    //let colors = this.imageData[y * this.attenuation + x];
                    //subRectData.push(colors[0], colors[1], colors[2], colors[3]);
                    subRectData.push((this.imageData[index] >> 24) & 0xff);
                    subRectData.push((this.imageData[index] >> 16) & 0xff);
                    subRectData.push((this.imageData[index] >> 8) & 0xff);
                    subRectData.push(this.imageData[index] & 0xff);
                }
            }
        }

        return subRectData;
    }

    GenerateLightImage() {
        let halfDistance = (this.attenuation * this.drawScale) - 1,
            centerPosition = new Vector2D(this.halfAttenuation * this.drawScale, this.halfAttenuation * this.drawScale),
            currentPosition = this.position.Clone(),
            currentDistance = 0,
            calcAlpha = 0,
            rgbaColor = this.color.Clone(),
            falloff = 0;

        this.lightData = this.frameBufferCtx.createImageData(this.attenuation, this.attenuation);
        this.colorData = this.colorFrameBufferCtx.createImageData(this.attenuation, this.attenuation);

        this.imageDataBuf = new ArrayBuffer(this.lightData.data.length);
        this.imageDataBuf8 = new Uint8ClampedArray(this.imageDataBuf);
        this.imageData = new Uint32Array(this.imageDataBuf);

        this.colorImageDataBuf = new ArrayBuffer(this.colorData.data.length);
        this.colorImageDataBuf8 = new Uint8ClampedArray(this.colorImageDataBuf);
        this.colorImageData = new Uint32Array(this.colorImageDataBuf);

        for (let y = 0; y < this.attenuation; ++y) {
            for (let x = 0; x < this.attenuation; ++x) {
                currentPosition.x = x;
                currentPosition.y = y;
                currentDistance = centerPosition.Distance(currentPosition);

                switch (this.lightFalloffType) {
                    case LightFalloffType.InverseSquareLaw:
                        //https://learnopengl.com/Lighting/Light-casters
                        //https://wiki.ogre3d.org/tiki-index.php?page=-Point+Light+Attenuation
                        calcAlpha = (1.0 / (this.constant + this.linear * currentDistance + this.quad * (currentDistance * currentDistance))) * this.intensity;// (currentDistance * currentDistance) * this.intensity;
                        break;
                    case LightFalloffType.Falloff:
                        calcAlpha = CMath.MapRange((currentDistance * this.intensity), 0, (halfDistance * this.intensity), this.attenuation, 0) * this.intensity;
                        calcAlpha = Number.isNaN(calcAlpha) === false ? calcAlpha : 1;
                        break;
                }

                //calcAlpha = CMath.Clamp(calcAlpha, 0, 1);

                //let colorFalloff = CMath.MapRange(currentDistance / (halfDistance * 1), 1, 0, 0, 1);
                let colorFalloff = falloff = CMath.Lerp(1, 0, CMath.EaseOut(CMath.Clamp(currentDistance / (halfDistance * 0.75), 0, 1))); //0.5
                falloff = CMath.Lerp(1, 0, CMath.EaseIn(currentDistance / (halfDistance * 0.5)));


                if (falloff > 0) {
                    if (IsLittleEndian) {
                        let grayColor = (rgbaColor.red + rgbaColor.green + rgbaColor.blue) * 0.333333;
                        this.imageData[y * this.attenuation + x] =
                            (CMath.Clamp(calcAlpha * falloff * 255, 0, 255) << 24) |    // alpha
                            (CMath.Clamp(grayColor * calcAlpha * falloff, 0, 255) << 16) |    // blue
                            (CMath.Clamp(grayColor * calcAlpha * falloff, 0, 255) << 8) |    // green
                            CMath.Clamp(grayColor * calcAlpha * falloff, 0, 255);            // red

                        this.imageData[y * this.attenuation + x] =
                            (CMath.Clamp(calcAlpha * falloff * 255, 0, 255) << 24) |    // alpha
                            (CMath.Clamp(grayColor * 3, 0, 255) << 16) |    // blue
                            (CMath.Clamp(grayColor * 3, 0, 255) << 8) |    // green
                            CMath.Clamp(grayColor * 3, 0, 255);            // red

                        this.colorImageData[y * this.attenuation + x] =
                            (CMath.Clamp(calcAlpha * 255, 0, 255) << 24) |    // alpha
                            (CMath.Clamp(rgbaColor.blue * calcAlpha * colorFalloff, 0, 255) << 16) |    // blue
                            (CMath.Clamp(rgbaColor.green * calcAlpha * colorFalloff, 0, 255) << 8) |    // green
                            CMath.Clamp(rgbaColor.red * calcAlpha * colorFalloff, 0, 255);            // red

                        this.colorImageData[y * this.attenuation + x] =
                            (CMath.Clamp(calcAlpha * falloff * 255, 0, 255) << 24) |    // alpha
                            (CMath.Clamp(rgbaColor.blue, 0, 255) << 16) |    // blue
                            (CMath.Clamp(rgbaColor.green, 0, 255) << 8) |    // green
                            CMath.Clamp(rgbaColor.red, 0, 255);            // red
                    } else {
                        this.imageData[y * this.attenuation + x] =
                            (rgbaColor.red * calcAlpha * falloff << 24) |    // red
                            ((rgbaColor.green * calcAlpha * falloff << 8) << 16) |    // green
                            ((rgbaColor.blue * calcAlpha * falloff << 16) << 8) |    // blue
                            (calcAlpha * falloff * 255);              // alpha

                        this.colorImageData[y * this.attenuation + x] =
                            (rgbaColor.red * calcAlpha * colorFalloff * falloff << 24) |    // red
                            ((rgbaColor.green * calcAlpha * colorFalloff * falloff << 8) << 16) |    // green
                            ((rgbaColor.blue * calcAlpha * colorFalloff * falloff << 16) << 8) |    // blue
                            (calcAlpha * colorFalloff * 255);              // alpha
                    }
                }
            }
        }

        this.lightData.data.set(this.imageDataBuf8);
        Math3D.RotatePixelData2D(this.lightData.data, new Vector2D(this.attenuation, this.attenuation), new Vector(0, 45, 0), this.attenuation / 6.4);
        this.imageDataBuf8.set(this.lightData.data);

        this.frameBufferCtx.putImageData(this.lightData, 0, 0);

        this.colorData.data.set(this.colorImageDataBuf8);
        Math3D.RotatePixelData2D(this.colorData.data, new Vector2D(this.attenuation, this.attenuation), new Vector(0, 45, 0), this.attenuation / 6.4);
        this.colorImageDataBuf8.set(this.colorData.data);

        this.colorFrameBufferCtx.putImageData(this.colorData, 0, 0);

        this.finished = true;

        this.BoxCollision.position.y += (this.BoxCollision.size.y * 0.15) * 0.5;
        this.BoxCollision.size.y -= this.BoxCollision.size.y * 0.15;
        this.BoxCollision.SetPosition(this.BoxCollision.position);
    }

    FixedUpdate() {
        super.FixedUpdate();
    }

    Delete() {
        super.Delete();
    }

    CEvent(eventType, data) {

    }

    CheckInRange(checkPos, range = 100.0) {
        return super.CheckInRange(checkPos, range);
    }

    GameBegin() {

    }
}

export { AmbientLight, LightFalloffType };