import { Cobject, Color, Vector2D, CMath, MasterObject, Mastertime, Graph, GraphPoint, DrawingOperation, AmbientLight } from '../../internal.js';

/**
 * @readonly
 */
const LightMultiply = 0.3333333;

/**
 * @enum {Number}
 * @readonly
 */
const LightDataType = {
    Ambient: 0,
    Color: 1,
    Intensity: 2
}

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class SkyLight extends Cobject {

    /**
     * 
     * @param {Color} color 
     */
    constructor(color, lightColor) {
        super(new Vector2D(0, 0));
        /**@type {Color} */
        this.color = color;

        /**@type {Color} */
        this.lightColor = lightColor;

        /**@type {Color} */
        this.previousColor = color.Clone();

        this.previousColor.ToInt();

        /**@type {Color} */
        this.compareColor = color.Clone();

        /**@type {boolean} */
        this.didLightChange = false;

        /**@type {Graph} */
        this.intensityGraph = new Graph(
            0,
            24,
            [
                new GraphPoint(0, 0),
                new GraphPoint(2, 2),
                new GraphPoint(4, 5),
                new GraphPoint(5, 15),
                new GraphPoint(6, 25),
                new GraphPoint(8, 75),
                new GraphPoint(9, 100),
                new GraphPoint(10, 105),
                new GraphPoint(11, 115),
                new GraphPoint(13, 128),
                new GraphPoint(16, 115),
                new GraphPoint(18, 60),
                new GraphPoint(19, 27),
                new GraphPoint(20, 17),
                new GraphPoint(21, 10),
                new GraphPoint(22, 5),
                new GraphPoint(24, 0)
            ],
            25
        );

        /**@type {Graph} */
        this.dayCycleColorGraph = new Graph(
            0,
            24,
            [
                new GraphPoint(0, new Color(66, 90, 255, 255)),
                new GraphPoint(4, new Color(65, 102, 135, 255)),
                new GraphPoint(9, new Color(127, 166, 201, 255)),
                new GraphPoint(13, new Color(237, 212, 154, 255)),
                new GraphPoint(18, new Color(235, 182, 61, 255)),
                new GraphPoint(22, new Color(38, 60, 69, 255)),
                new GraphPoint(24, new Color(32, 57, 79, 255))
            ],
            25
        );
    }

    GetTimeAsAlpha() {
        let time = MasterObject.MO.Mastertime.GetSeconds();
        time -= Mastertime.HalfADay;
        time = CMath.MapRange(time, -Mastertime.HalfADay, Mastertime.HalfADay, -1, 1);
        return time;
    }

    Update() {
        this.didLightChange = false;
        let time = this.GetTimeAsAlpha();
        let intensity = this.intensityGraph.GetPoint(time, -1, 1).value;
        let color = this.dayCycleColorGraph.GetPoint(time, -1, 1).value;

        this.color.blue = this.color.green = this.color.red = intensity;
        this.color.alpha = 255;

        this.color.red = color.red * CMath.MapRange(this.color.red, 0, 255, 0.5, 1);
        this.color.green = color.green * CMath.MapRange(this.color.green, 0, 255, 0.5, 1);
        this.color.blue = color.blue * CMath.MapRange(this.color.blue, 0, 255, 0.5, 1);

        if (this.color.Equal(this.previousColor) === false) {
            this.previousColor = this.color.Clone();
            this.didLightChange = true;
        }
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
        super.GameBegin();
        this.Update();
    }
}

/**
 * @class
 * @constructor
 * @public
 * @extends Cobject
 */
class LightSystem extends Cobject {
    static SkyLight = new SkyLight(new Color(25, 25, 25, 255), new Color(32, 57, 79, 255));
    static LightLUT = [
        { d: 0, c: 1, l: 1.4, q: 0.047 },
        { d: 7, c: 1, l: 0.75, q: 0.0065 },
        { d: 13, c: 1, l: 0.44, q: 0.0044 },
        { d: 20, c: 1, l: 0.22, q: 0.02 },
        { d: 32, c: 1, l: 0.14, q: 0.07 },
        { d: 50, c: 1, l: 0.09, q: 0.0032 },
        { d: 65, c: 1, l: 0.07, q: 0.0017 },
        { d: 100, c: 1, l: 0.045, q: 0.0075 },
        { d: 160, c: 1, l: 0.027, q: 0.0028 },
        { d: 200, c: 1, l: 0.022, q: 0.0019 },
        { d: 325, c: 1, l: 0.014, q: 0.0007 },
        { d: 600, c: 1.0, l: 0.00000007, q: 0.0002 },
        { d: 3250, c: 1, l: 0.0014, q: 0.000007 },
    ];

    constructor() {
        super(new Vector2D(0, 0));

        /** @type { HTMLCanvasElement } */
        this.lightFrameBuffer = document.createElement('canvas');

        /** @type { HTMLCanvasElement } */
        this.lightIntensityBuffer = document.createElement('canvas');

        /** @type { HTMLCanvasElement } */
        this.ambientFrameBuffer = document.createElement('canvas');

        const canvasEl = document.getElementById('game-canvas');
        this.lightFrameBuffer.setAttribute('width', canvasEl.getAttribute('width'));
        this.lightFrameBuffer.setAttribute('height', canvasEl.getAttribute('height'));
        document.body.appendChild(this.lightFrameBuffer);

        this.lightIntensityBuffer.setAttribute('width', canvasEl.getAttribute('width'));
        this.lightIntensityBuffer.setAttribute('height', canvasEl.getAttribute('height'));
        //document.body.appendChild(this.lightIntensityBuffer);

        this.ambientFrameBuffer.setAttribute('width', canvasEl.getAttribute('width'));
        this.ambientFrameBuffer.setAttribute('height', canvasEl.getAttribute('height'));
        document.body.appendChild(this.ambientFrameBuffer);

        /** @type {CanvasRenderingContext2D} */
        this.lightIntensityBufferCtx = this.lightIntensityBuffer.getContext('2d', { willReadFrequently: true });
        this.lightIntensityBufferCtx.imageSmoothingEnabled = true;

        /** @type {CanvasRenderingContext2D} */
        this.lightFrameBufferCtx = this.lightFrameBuffer.getContext('2d', { willReadFrequently: true });
        this.lightFrameBufferCtx.imageSmoothingEnabled = true;

        /** @type {CanvasRenderingContext2D} */
        this.ambientFrameBufferCtx = this.ambientFrameBuffer.getContext('2d', { willReadFrequently: true });
        this.ambientFrameBufferCtx.imageSmoothingEnabled = true;

        //this.ambientFrameBufferCtx.fillStyle = LightSystem.SkyLight.color.ToString();//'rgb(5, 5, 5)';
        //this.ambientFrameBufferCtx.fillRect(0, 0, this.ambientFrameBuffer.width, this.ambientFrameBuffer.height);

        this.lightFrameBufferCtx.fillStyle = 'rgba(0,0,0,0)';//LightSystem.SkyLight.color.ToString();
        this.lightIntensityBufferCtx.fillStyle = LightSystem.SkyLight.color.ToString();
        this.lightFrameBufferCtx.fillRect(0, 0, this.lightFrameBuffer.width, this.lightFrameBuffer.height);

        /** @type {ImageData } */
        this.lightData = this.lightFrameBufferCtx.getImageData(0, 0, this.lightFrameBuffer.width, this.lightFrameBuffer.height);
        
        /** @type {ImageData } */
        this.lightIntensityData;

        //this.lightData = this.ambientFrameBufferCtx.getImageData(0, 0, this.ambientFrameBuffer.width, this.ambientFrameBuffer.height);
    }

    /**
     * Clears the ambient frame buffer and fills it with the skylight color.
     * @param {Number} delta 
     */
    DrawLightingLoop(delta) {
        //this.ambientFrameBufferCtx.clearRect(0, 0, this.ambientFrameBuffer.width, this.ambientFrameBuffer.height);
        this.ambientFrameBufferCtx.fillStyle = LightSystem.SkyLight.color.ToString();//'rgb(5, 5, 5)';
        this.ambientFrameBufferCtx.fillRect(0, 0, this.ambientFrameBuffer.width, this.ambientFrameBuffer.height);

        /*if (LightSystem.SkyLight.didLightChange === true) {
            for (let i = 0; i < this.lightData.data.length; i += 4) {
                this.lightData.data[i] = LightSystem.SkyLight.color.red;
                this.lightData.data[i + 1] = LightSystem.SkyLight.color.green;
                this.lightData.data[i + 2] = LightSystem.SkyLight.color.blue;
            }
        }*/

        /*for (let i = 0; i < this.lightingOperations.length; i++) {
            if (this.lightingOperations[i].shouldDelete === true) {
                this.lightingOperations.splice(i, 1);
                i--;
            } else if (this.lightingOperations[i].DrawState() === true) {
                if (doOnce === true) {
                    this.lightFrameBufferCtx.fillRect(0, 0, this.lightFrameBuffer.width, this.lightFrameBuffer.height);
                    doOnce = false;
                }

                this.DrawOnCanvas(this.lightingOperations[i]);
            }
        }*/
    }

    /**
     * Draws to the light framebuffer at the specified position using the submitted pixels.
     * @param {Vector2D} position 
     * @param {Vector2D} size 
     * @param {Uint8ClampedArray|Array} pixels 
     * @param {boolean} isLight - If it's not a light, ignores the alpha channel
     * @param {boolean} addSubtract - If true operation is additive else the values gets set to 0
     * @param {LightDataType} lightDataType 
     * @param {Number} drawingIntensity - Used to multiply the drawn color
     */
    DrawToFramebuffer(position, size, pixels, isLight = false, addSubtract = true, lightDataType = LightDataType.Color, drawingIntensity = 1) {
        let startX = Math.floor(position.x),
            startY = Math.floor(position.y),
            endX = startX + size.x,
            endY = startY + size.y,
            y = startY,
            x = startX,
            index = -1,
            pixelsIndex = 0,
            grayColor = 0,
            preWidth = this.lightFrameBuffer.width,
            data;

        switch (lightDataType) {
            case LightDataType.Ambient:
            case LightDataType.Color: data = this.lightData.data; break;
            case LightDataType.Intensity: data = this.lightIntensityData.data; break;
        }

        if (isLight === true) {
            if (addSubtract === true) {
                let dest = new Color(0, 0, 0, 0),
                    source = new Color(0, 0, 0, 0);
                for (y = startY; y < endY; ++y) {
                    for (x = startX; x < endX; ++x) {
                        index = (y * preWidth * 4) + x * 4;

                        if (x < 0) {
                            pixelsIndex += 4;
                            continue;
                        }

                        if (pixels[pixelsIndex + 3] > 0) {
                            dest.red = data[index];
                            dest.green = data[index + 1];
                            dest.blue = data[index + 2];
                            dest.alpha = data[index + 3];

                            if (dest.red > 0 && dest.green > 0 && dest.blue > 0 && dest.alpha > 0) {
                                source.red = pixels[pixelsIndex] * drawingIntensity;
                                source.green = pixels[pixelsIndex + 1] * drawingIntensity;
                                source.blue = pixels[pixelsIndex + 2] * drawingIntensity;
                                source.alpha = pixels[pixelsIndex + 3] * drawingIntensity;

                                dest.AddAlpha(source);

                                data[index] = dest.red;
                                data[++index] = dest.green;
                                data[++index] = dest.blue;
                                data[++index] = dest.alpha + source.alpha;
                            } else {
                                //data[++index] = data[index + 3];// + pixels[pixelsIndex + 3];

                                data[index] += pixels[pixelsIndex] * drawingIntensity;
                                data[++index] += pixels[pixelsIndex + 1] * drawingIntensity;
                                data[++index] += pixels[pixelsIndex + 2] * drawingIntensity;
                                data[++index] += pixels[pixelsIndex + 3] * drawingIntensity;
                            }
                        }
                        pixelsIndex += 4;
                    }
                }
            } else {
                for (y = startY; y < endY; ++y) {
                    for (x = startX; x < endX; ++x) {
                        index = (y * preWidth * 4) + x * 4;

                        if (x < 0) {
                            pixelsIndex += 4;
                            continue;
                        }

                        if (pixels[pixelsIndex + 3] > 0) {
                            data[index] = 0;// -= pixels[pixelsIndex] * 0.33333;
                            data[++index] = 0;//-= pixels[pixelsIndex + 1] * 0.33333;
                            data[++index] = 0;// -= pixels[pixelsIndex + 2] * 0.33333;
                            data[++index] = 0;// -= pixels[pixelsIndex + 3] * 0.33333;
                        }
                        pixelsIndex += 4;
                    }
                }
            }
        } else {
            if (addSubtract === true) {
                let dest = new Color(0, 0, 0, 0),
                    source = new Color(0, 0, 0, 0);

                for (y = startY; y < endY; ++y) {
                    for (x = startX; x < endX; ++x) {
                        index = (y * preWidth * 4) + x * 4;

                        if (x < 0) {
                            pixelsIndex += 4;
                            continue;
                        }

                        if (pixels[pixelsIndex + 3] > 0) {
                            dest.red = data[index];
                            dest.green = data[index + 1];
                            dest.blue = data[index + 2];
                            dest.alpha = data[index + 3];

                            source.red = pixels[pixelsIndex] * drawingIntensity;
                            source.green = pixels[pixelsIndex + 1] * drawingIntensity;
                            source.blue = pixels[pixelsIndex + 2] * drawingIntensity;
                            source.alpha = pixels[pixelsIndex + 3];

                            dest.AddAlpha(source);

                            data[index] = dest.red;
                            data[++index] = dest.green;
                            data[++index] = dest.blue;
                            //data[++index] = dest.alpha
                            ++index;
                        }
                        pixelsIndex += 4;
                    }
                }
            } else {
                for (y = startY; y < endY; ++y) {
                    for (x = startX; x < endX; ++x) {
                        index = (y * preWidth * 4) + x * 4;

                        if (x < 0) {
                            pixelsIndex += 4;
                            continue;
                        }

                        if (pixels[pixelsIndex + 3] > 0) {
                            data[index] = 0;//   -= pixels[pixelsIndex] * drawingIntensity;
                            data[++index] = 0;//   -= pixels[pixelsIndex + 1] * drawingIntensity;
                            data[++index] = 0;//   -= pixels[pixelsIndex + 2] * drawingIntensity;
                            data[++index] = 0;
                        }
                        pixelsIndex += 4;
                    }
                }
            }
        }

        this.lightData.data.set(data);
    }


    DrawToFramebufferTest(position, size, pixels, isLight = false, addSubtract = true, lightDataType = LightDataType.Color, drawingIntensity = 1) {
        let startX = Math.floor(position.x),
            startY = Math.floor(position.y),
            endX = startX + size.x,
            endY = startY + size.y,
            y = startY,
            x = startX,
            index = -1,
            pixelsIndex = 0,
            grayColor = 0,
            preWidth = this.lightFrameBuffer.width,
            data;

        switch (lightDataType) {
            case LightDataType.Ambient:
            case LightDataType.Color: data = this.lightData.data; break;
            case LightDataType.Intensity: data = this.lightIntensityData.data; break;
        }

        if (isLight === true) {
            if (addSubtract === true) {
                let dest = new Color(0, 0, 0, 0),
                    source = new Color(0, 0, 0, 0);
                for (y = startY; y < endY; ++y) {
                    for (x = startX; x < endX; ++x) {
                        index = (y * preWidth * 4) + x * 4;

                        if (x < 0) {
                            pixelsIndex += 4;
                            continue;
                        }

                        data[index] = pixels[pixelsIndex] * drawingIntensity;
                        data[++index] = pixels[pixelsIndex + 1] * drawingIntensity;
                        data[++index] = pixels[pixelsIndex + 2] * drawingIntensity;
                        data[++index] = pixels[pixelsIndex + 3] * drawingIntensity;

                        pixelsIndex += 4;
                    }
                }
            } else {
                for (y = startY; y < endY; ++y) {
                    for (x = startX; x < endX; ++x) {
                        index = (y * preWidth * 4) + x * 4;

                        if (x < 0) {
                            pixelsIndex += 4;
                            continue;
                        }

                        if (pixels[pixelsIndex + 3] > 0) {
                            data[index] = 0;// -= pixels[pixelsIndex] * 0.33333;
                            data[++index] = 0;//-= pixels[pixelsIndex + 1] * 0.33333;
                            data[++index] = 0;// -= pixels[pixelsIndex + 2] * 0.33333;
                            data[++index] = 0;// -= pixels[pixelsIndex + 3] * 0.33333;
                        }
                        pixelsIndex += 4;
                    }
                }
            }
        }

        this.lightData.data.set(data);
    }

    /**
    * Draws to the light framebuffer at the specified position using the submitted pixels and if a subRectObject is provided draws that in additive mode.
    * @param {Vector2D} position 
    * @param {Vector2D} size 
    * @param {Uint8ClampedArray|Array} pixels 
    * @param {boolean} isLight - If it's not a light, ignores the alpha channel
    * @param {boolean} addSubtract - If true operation is additive else subtracts
    * @param {Object} subRectObject - Object that has a rect<Rectangle()> and a light<AmbientLight>
    * @param {Number} drawingIntensity - Used to multiply the drawn color
    */
    DrawToFramebufferAlpha(position, size, pixels, isLight = false, addSubtract = true, subRectObject = undefined, drawingIntensity = 1) {
        let startX = Math.floor(position.x),
            startY = Math.floor(position.y),
            endX = startX + size.x,
            endY = startY + size.y,
            y = startY,
            x = startX,
            index = -1,
            pixelsIndex = 0,
            grayColor = 0,
            preWidth = this.lightFrameBuffer.width,
            data = this.lightData.data;

        if (subRectObject === undefined || subRectObject.light === undefined)
            return;

        let subRectAlpha;
        if (subRectObject.light instanceof AmbientLight) {
            subRectAlpha = subRectObject.light.GetSubRectSpeed(
                subRectObject.rect.x,
                subRectObject.rect.y,
                subRectObject.rect.w,
                subRectObject.rect.h
            );
        } else if (subRectObject.light instanceof DrawingOperation) {
            subRectAlpha = subRectObject.light.cutoutData.data;
        }

        if (isLight === true) {
            if (addSubtract === true) {
                let dest = new Color(0, 0, 0, 0),
                    source = new Color(0, 0, 0, 0);

                for (y = startY; y < endY; ++y) {
                    for (x = startX; x < endX; ++x) {
                        index = (y * preWidth * 4) + x * 4;

                        //grayColor = (pixels[pixelsIndex] + pixels[pixelsIndex + 1] + pixels[pixelsIndex + 2]) * LightMultiply;
                        if (subRectAlpha[pixelsIndex + 3] > 0) {
                            //data[index] += grayColor;
                            //data[++index] += grayColor;
                            //data[++index] += grayColor;
                            //data[++index] += grayColor;

                            if (pixels[pixelsIndex + 3] > 0) {
                                data[index] += pixels[pixelsIndex] * drawingIntensity;
                                data[++index] += pixels[pixelsIndex + 1] * drawingIntensity;
                                data[++index] += pixels[pixelsIndex + 2] * drawingIntensity;
                                data[++index] += pixels[pixelsIndex + 3] * drawingIntensity;
                            }
                        } else {
                            //let grayColor2 = (subRectAlpha[pixelsIndex] + subRectAlpha[pixelsIndex + 1] + subRectAlpha[pixelsIndex + 2]) * LightMultiply;
                            /*data[index] = grayColor + grayColor2;
                            data[++index] = grayColor + grayColor2;
                            data[++index] = grayColor + grayColor2;
                            data[++index] = grayColor + grayColor2;*/

                            if (pixels[pixelsIndex + 3] > 0) {
                                dest.red = data[index][index];
                                dest.green = data[index][index + 1];
                                dest.blue = data[index][index + 2];
                                dest.alpha = data[index][index + 3];

                                if (dest.alpha > 0) {
                                    source.red = pixels[pixelsIndex] * drawingIntensity;
                                    source.green = pixels[pixelsIndex + 1] * drawingIntensity;
                                    source.blue = pixels[pixelsIndex + 2] * drawingIntensity;
                                    source.alpha = pixels[pixelsIndex + 3] * drawingIntensity;

                                    dest.AddAlpha(source);

                                    data[index] = dest.red;
                                    data[++index] = dest.green;
                                    data[++index] = dest.blue;
                                    data[++index] = dest.alpha + source.alpha;
                                } else {
                                    //data[++index] = data[index + 3];// + pixels[pixelsIndex + 3];

                                    data[index] += (pixels[pixelsIndex] + subRectAlpha[pixelsIndex]) * drawingIntensity;
                                    data[++index] += (pixels[pixelsIndex + 1] + subRectAlpha[pixelsIndex + 1]) * drawingIntensity;
                                    data[++index] += (pixels[pixelsIndex + 2] + subRectAlpha[pixelsIndex + 2]) * drawingIntensity;
                                    data[++index] += (pixels[pixelsIndex + 3] + subRectAlpha[pixelsIndex + 3]) * drawingIntensity;
                                }

                                /*data[index] += (pixels[pixelsIndex] + subRectAlpha[pixelsIndex]) * drawingIntensity;
                                data[++index] += (pixels[pixelsIndex + 1] + subRectAlpha[pixelsIndex + 1]) * drawingIntensity;
                                data[++index] += (pixels[pixelsIndex + 2] + subRectAlpha[pixelsIndex + 2]) * drawingIntensity;
                                data[++index] += (pixels[pixelsIndex + 3] + subRectAlpha[pixelsIndex + 3]) * drawingIntensity;*/
                            }
                        }
                        pixelsIndex += 4;
                    }
                }
            } else {
                for (y = startY; y < endY; ++y) {
                    for (x = startX; x < endX; ++x) {
                        index = (y * preWidth * 4) + x * 4;

                        //grayColor = (pixels[pixelsIndex] + pixels[pixelsIndex + 1] + pixels[pixelsIndex + 2]) * LightMultiply;
                        /*data[index] -= grayColor * 3;
                        data[++index] -= grayColor * 3;
                        data[++index] -= grayColor * 3;
                        data[++index] -= grayColor * 3;*/

                        data[index] = 0;// -= pixels[pixelsIndex] * drawingIntensity;
                        data[++index] = 0;// -= pixels[pixelsIndex + 1] * drawingIntensity;
                        data[++index] = 0;// -= pixels[pixelsIndex + 2] * drawingIntensity;
                        data[++index] = 0;// -= pixels[pixelsIndex + 3] * drawingIntensity;

                        pixelsIndex += 4;
                    }
                }
            }
        } else {
            if (addSubtract === true) {
                for (y = startY; y < endY; ++y) {
                    for (x = startX; x < endX; ++x) {
                        index = (y * preWidth * 4) + x * 4;

                        //grayColor = (pixels[pixelsIndex] + pixels[pixelsIndex + 1] + pixels[pixelsIndex + 2]) * LightMultiply;
                        /*data[index] = grayColor;
                        data[++index] = grayColor;
                        data[++index] = grayColor;
                        data[++index] = grayColor;*/

                        if (pixels[pixelsIndex + 3] > 0) {
                            data[index] += pixels[pixelsIndex] * drawingIntensity;
                            data[++index] += pixels[pixelsIndex + 1] * drawingIntensity;
                            data[++index] += pixels[pixelsIndex + 2] * drawingIntensity;
                            data[++index] += pixels[pixelsIndex + 3] * drawingIntensity;
                        }

                        pixelsIndex += 4;
                    }
                }
            } else {
                for (y = startY; y < endY; ++y) {
                    for (x = startX; x < endX; ++x) {
                        index = (y * preWidth * 4) + x * 4;

                        //grayColor = (pixels[pixelsIndex] + pixels[pixelsIndex + 1] + pixels[pixelsIndex + 2]) * LightMultiply;
                        /*data[index] = grayColor;
                        data[++index] = grayColor;
                        data[++index] = grayColor;
                        data[++index] = grayColor;*/

                        if (pixels[pixelsIndex + 3] > 0) {
                            data[index] = 0;// -= pixels[pixelsIndex] * drawingIntensity;
                            data[++index] = 0;// -= pixels[pixelsIndex + 1] * drawingIntensity;
                            data[++index] = 0;// -= pixels[pixelsIndex + 2] * drawingIntensity;
                            data[++index] = 0;// -= pixels[pixelsIndex + 3] * drawingIntensity;
                        }

                        pixelsIndex += 4;
                    }
                }
            }
        }

        this.lightData.data.set(data);
    }

    /**
     * Gets the pixel from the light data and returns the colors in an array [red, green, blue, alpha].
     * @param {Vector2D} position - Position in the array to get the pixel
     * @returns {Array<Number>} - Array[red, green, blue, alpha]
     * @deprecated Superseded by the GetColor(Vector2D) method
     */
    GetPixel(position) {
        return [
            this.lightData.data[position.x * this.lightFrameBuffer.width + position.y],
            this.lightData.data[position.x * this.lightFrameBuffer.width + position.y + 1],
            this.lightData.data[position.x * this.lightFrameBuffer.width + position.y + 2],
            this.lightData.data[position.x * this.lightFrameBuffer.width + position.y + 3]
        ];
    }

    /**
     * Gets the color from the light data and returns the color.
     * @param {Vector2D} position - Position in the array to get the pixel
     * @returns {Color}
     */
    GetColor(position) {
        if (this.lightData === undefined || this.lightData.data === undefined)
            return LightSystem.SkyLight.color.Clone();

        let index = Math.floor(position.y) * (this.lightFrameBuffer.width * 4) + Math.floor(position.x) * 4,
            ambientColor = LightSystem.SkyLight.color.Clone(),
            color = new Color(
                this.lightData.data[index],
                this.lightData.data[index + 1],
                this.lightData.data[index + 2],
                this.lightData.data[index + 3]
            );

        ambientColor.AddAlpha(color);

        /*color = new Color(
            this.lightData.data[index],
            this.lightData.data[++index],
            this.lightData.data[++index],
            this.lightData.data[++index]
        );*/

        //color.Add(LightSystem.SkyLight.color);
        //color.MultF(LightMultiply);
        return color;
    }

    GetColorIndex(position) {
        return Math.floor(position.y) * (this.lightFrameBuffer.width * 4) + Math.floor(position.x) * 4;
    }

    ValidateGetColorIndex() {
        let testIndex = 0,
            score = 0,
            endY = this.lightFrameBuffer.height,
            endX = this.lightFrameBuffer.width,
            y = 0,
            x = 0,
            index = 0;

        for (y = 0; y < endY; ++y) {
            for (x = 0; x < endX; ++x) {
                testIndex = this.GetColorIndex(new Vector2D(x, y));

                if (testIndex === index)
                    score++;
                else
                    score--;

                index += 4;
            }
        }

        console.log(score);
    }

    /**
     * Used to validate that the colors returned from the GetColor method matches the actual data.
     * If there's a single error all the colors are wrong.
     */
    ValidateGetColor() {
        let endY = this.lightFrameBuffer.height,
            endX = this.lightFrameBuffer.width,
            y = 0,
            x = 0,
            index = 0,
            color = new Color(0, 0, 0, 1),
            testColor = new Color(0, 0, 0, 1),
            points = 0,
            negatives = 0,
            colorNotZero = 0;

        for (y = 0; y < endY; ++y) {
            for (x = 0; x < endX; ++x) {
                testColor = this.GetColor(new Vector2D(x, y));

                color = new Color(
                    this.lightData.data[index],
                    this.lightData.data[++index],
                    this.lightData.data[++index],
                    this.lightData.data[++index]
                );
                index++;

                if (color.Equal(testColor))
                    ++points;
                else
                    ++negatives;
            }
        }

        let colorA = this.GetColor(new Vector2D(576, 704)),
            colorB = this.GetColor(new Vector2D(180, 407)),
            colorC = this.GetColor(new Vector2D(131, 233)),
            ambientColorA = LightSystem.SkyLight.color.Clone(),
            ambientColorB = LightSystem.SkyLight.color.Clone(),
            ambientColorC = LightSystem.SkyLight.color.Clone();

        ambientColorA.AddAlpha(colorA);
        ambientColorB.AddAlpha(colorB);
        ambientColorC.AddAlpha(colorC);

        console.log(points, negatives, endY * endX, this.lightData.data.length, index, colorNotZero, colorA, colorB, colorC, ambientColorA, ambientColorB, ambientColorC, LightSystem.SkyLight.color);
    }

    UpdateCanvas() {
        this.DrawLightingLoop(0);
        this.lightFrameBufferCtx.putImageData(this.lightData, 0, 0);
        this.ambientFrameBufferCtx.drawImage(this.lightFrameBuffer, 0, 0);

    }

    FixedUpdate() {
        super.FixedUpdate();

        if (MasterObject.MO.Mastertime.GlobalFrameCounter === 5) {
            this.ValidateGetColor();
            this.ValidateGetColorIndex();
        }
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
        super.GameBegin();
        this.lightFrameBufferCtx.globalCompositeOperation = 'hard-light';
        this.ambientFrameBufferCtx.globalCompositeOperation = 'source-over';
        this.DrawLightingLoop(0);
    }

    static GetLightLUT(distance) {
        if (distance <= 7)
            return {
                c: CMath.Lerp(LightSystem.LightLUT[0].c, LightSystem.LightLUT[1].c, distance.mapRange(7, 13, 0, 1)),
                l: CMath.Lerp(LightSystem.LightLUT[0].l, LightSystem.LightLUT[1].l, distance.mapRange(7, 13, 0, 1)),
                q: CMath.Lerp(LightSystem.LightLUT[0].q, LightSystem.LightLUT[1].q, distance.mapRange(7, 13, 0, 1))
            };
        else if (distance > 7 && distance <= 13)
            return {
                c: CMath.Lerp(LightSystem.LightLUT[1].c, LightSystem.LightLUT[2].c, distance.mapRange(7, 13, 0, 1)),
                l: CMath.Lerp(LightSystem.LightLUT[1].l, LightSystem.LightLUT[2].l, distance.mapRange(7, 13, 0, 1)),
                q: CMath.Lerp(LightSystem.LightLUT[1].q, LightSystem.LightLUT[2].q, distance.mapRange(7, 13, 0, 1))
            };
        else if (distance > 13 && distance <= 20)
            return {
                c: CMath.Lerp(LightSystem.LightLUT[2].c, LightSystem.LightLUT[3].c, distance.mapRange(13, 20, 0, 1)),
                l: CMath.Lerp(LightSystem.LightLUT[2].l, LightSystem.LightLUT[3].l, distance.mapRange(13, 20, 0, 1)),
                q: CMath.Lerp(LightSystem.LightLUT[2].q, LightSystem.LightLUT[3].q, distance.mapRange(13, 20, 0, 1))
            };
        else if (distance > 20 && distance <= 32)
            return {
                c: CMath.Lerp(LightSystem.LightLUT[3].c, LightSystem.LightLUT[4].c, distance.mapRange(20, 32, 0, 1)),
                l: CMath.Lerp(LightSystem.LightLUT[3].l, LightSystem.LightLUT[4].l, distance.mapRange(20, 32, 0, 1)),
                q: CMath.Lerp(LightSystem.LightLUT[3].q, LightSystem.LightLUT[4].q, distance.mapRange(20, 32, 0, 1))
            };
        else if (distance > 32 && distance <= 50)
            return {
                c: CMath.Lerp(LightSystem.LightLUT[4].c, LightSystem.LightLUT[5].c, distance.mapRange(32, 50, 0, 1)),
                l: CMath.Lerp(LightSystem.LightLUT[4].l, LightSystem.LightLUT[5].l, distance.mapRange(32, 50, 0, 1)),
                q: CMath.Lerp(LightSystem.LightLUT[4].q, LightSystem.LightLUT[5].q, distance.mapRange(32, 50, 0, 1))
            };
        else if (distance > 50 && distance <= 65)
            return {
                c: CMath.Lerp(LightSystem.LightLUT[5].c, LightSystem.LightLUT[6].c, distance.mapRange(50, 65, 0, 1)),
                l: CMath.Lerp(LightSystem.LightLUT[5].l, LightSystem.LightLUT[6].l, distance.mapRange(50, 65, 0, 1)),
                q: CMath.Lerp(LightSystem.LightLUT[5].q, LightSystem.LightLUT[6].q, distance.mapRange(50, 65, 0, 1))
            };
        else if (distance > 65 && distance <= 100)
            return {
                c: CMath.Lerp(LightSystem.LightLUT[6].c, LightSystem.LightLUT[7].c, distance.mapRange(65, 100, 0, 1)),
                l: CMath.Lerp(LightSystem.LightLUT[6].l, LightSystem.LightLUT[7].l, distance.mapRange(65, 100, 0, 1)),
                q: CMath.Lerp(LightSystem.LightLUT[6].q, LightSystem.LightLUT[7].q, distance.mapRange(65, 100, 0, 1))
            };
        else if (distance > 100 && distance <= 160)
            return {
                c: CMath.Lerp(LightSystem.LightLUT[7].c, LightSystem.LightLUT[8].c, distance.mapRange(100, 160, 0, 1)),
                l: CMath.Lerp(LightSystem.LightLUT[7].l, LightSystem.LightLUT[8].l, distance.mapRange(100, 160, 0, 1)),
                q: CMath.Lerp(LightSystem.LightLUT[7].q, LightSystem.LightLUT[8].q, distance.mapRange(100, 160, 0, 1))
            };
        else if (distance > 160 && distance <= 200)
            return {
                c: CMath.Lerp(LightSystem.LightLUT[8].c, LightSystem.LightLUT[9].c, distance.mapRange(160, 200, 0, 1)),
                l: CMath.Lerp(LightSystem.LightLUT[8].l, LightSystem.LightLUT[9].l, distance.mapRange(160, 200, 0, 1)),
                q: CMath.Lerp(LightSystem.LightLUT[8].q, LightSystem.LightLUT[9].q, distance.mapRange(160, 200, 0, 1))
            };
        else if (distance > 200 && distance <= 325)
            return {
                c: CMath.Lerp(LightSystem.LightLUT[9].c, LightSystem.LightLUT[10].c, distance.mapRange(200, 325, 0, 1)),
                l: CMath.Lerp(LightSystem.LightLUT[9].l, LightSystem.LightLUT[10].l, distance.mapRange(200, 325, 0, 1)),
                q: CMath.Lerp(LightSystem.LightLUT[9].q, LightSystem.LightLUT[10].q, distance.mapRange(200, 325, 0, 1))
            };
        else if (distance > 325 && distance <= 600)
            return {
                c: CMath.Lerp(LightSystem.LightLUT[10].c, LightSystem.LightLUT[11].c, distance.mapRange(325, 600, 0, 1)),
                l: CMath.Lerp(LightSystem.LightLUT[10].l, LightSystem.LightLUT[11].l, distance.mapRange(325, 600, 0, 1)),
                q: CMath.Lerp(LightSystem.LightLUT[10].q, LightSystem.LightLUT[11].q, distance.mapRange(325, 600, 0, 1))
            };
        else if (distance > 600)
            return {
                c: CMath.Lerp(LightSystem.LightLUT[11].c, LightSystem.LightLUT[12].c, distance.mapRange(600, 3250, 0, 1)),
                l: CMath.Lerp(LightSystem.LightLUT[11].l, LightSystem.LightLUT[12].l, distance.mapRange(600, 3250, 0, 1)),
                q: CMath.Lerp(LightSystem.LightLUT[11].q, LightSystem.LightLUT[12].q, distance.mapRange(600, 3250, 0, 1))
            };
    }
}

export { LightSystem, LightDataType };