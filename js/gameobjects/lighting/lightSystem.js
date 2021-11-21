import { Cobject, Color, Vector2D, CMath } from '../../internal.js';

/**
 * @class
 * @constructor
 * @public
 * @extends Cobject
 */
class LightSystem extends Cobject {
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

        let canvasEl = document.getElementById('game-canvas');
        this.lightFrameBuffer.setAttribute('width', canvasEl.getAttribute('width'));
        this.lightFrameBuffer.setAttribute('height', canvasEl.getAttribute('height'));
        document.body.appendChild(this.lightFrameBuffer);

        /** @type {CanvasRenderingContext2D} */
        this.lightFrameBufferCtx = this.lightFrameBuffer.getContext('2d', { willReadFrequently: true });
        this.lightFrameBufferCtx.imageSmoothingEnabled = true;

        this.lightFrameBufferCtx.fillStyle = 'rgb(5, 5, 5)';
        this.lightFrameBufferCtx.fillRect(0, 0, this.lightFrameBuffer.width, this.lightFrameBuffer.height);

        /** @type {ImageData } */
        this.lightData;
    }

    DrawLightingLoop(delta) {
        //this.lightFrameBufferCtx.clearRect(0, 0, this.lightFrameBuffer.width, this.lightFrameBuffer.height);
        //this.lightFrameBufferCtx.fillStyle = 'rgb(5, 5, 5)';
        //this.lightFrameBufferCtx.fillRect(0, 0, this.lightFrameBuffer.width, this.lightFrameBuffer.height);

        /*for (let i = 0; i < this.lightData.data.length; i += 4) {
            this.lightData.data[i] = this.lightData.data[i + 1] = this.lightData.data[i + 2] = 5;
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

    DrawToFramebuffer(position, size, pixels, isLight = false, addSubtract = true) {
        let startX = Math.max(Math.floor(position.x), 0),
            startY = Math.max(Math.floor(position.y), 0),
            endX = startX + size.x,
            endY = startY + size.y,
            y = startY,
            x = startX,
            index = -1,
            pixelsIndex = 0,
            grayColor = 0,
            preWidth = this.lightFrameBuffer.width,
            data = this.lightData.data;

        if (isLight === true) {
            if (addSubtract === true) {
                for (y = startY; y < endY; ++y) {
                    for (x = startX; x < endX; ++x) {
                        index = (y * preWidth * 4) + x * 4;

                        grayColor = (pixels[pixelsIndex] + pixels[pixelsIndex + 1] + pixels[pixelsIndex + 2]) * 0.3333333;
                        if (pixels[pixelsIndex + 3] > 0) {
                            data[index] += grayColor;
                            data[++index] += grayColor;
                            data[++index] += grayColor;
                        }
                        pixelsIndex += 4;
                    }
                }
            } else {
                for (y = startY; y < endY; ++y) {
                    for (x = startX; x < endX; ++x) {
                        index = (y * preWidth * 4) + x * 4;

                        grayColor = (pixels[pixelsIndex] + pixels[pixelsIndex + 1] + pixels[pixelsIndex + 2]) * 0.3333333;
                        if (pixels[pixelsIndex + 3] > 0) {
                            data[index] = 0;// -= grayColor * 3;
                            data[++index] = 0;// -= grayColor * 3;
                            data[++index] = 0;// -= grayColor * 3;
                        }
                        pixelsIndex += 4;
                    }
                }
            }
        } else {
            for (y = startY; y < endY; ++y) {
                for (x = startX; x < endX; ++x) {
                    index = (y * preWidth * 4) + x * 4;

                    grayColor = (pixels[pixelsIndex] + pixels[pixelsIndex + 1] + pixels[pixelsIndex + 2]) * 0.3333333;
                    if (pixels[pixelsIndex + 3] > 0) {
                        data[index] = grayColor;
                        data[++index] = grayColor;
                        data[++index] = grayColor;
                    }
                    pixelsIndex += 4;
                }
            }
        }
    }


    DrawToFramebufferAlpha(position, size, pixels, isLight = false, addSubtract = true, subRectObject = undefined) {
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

        let subRectAlpha = subRectObject.light.GetSubRectSpeed(
            subRectObject.rect.x,
            subRectObject.rect.y,
            subRectObject.rect.w,
            subRectObject.rect.h
        );

        if (isLight === true) {
            if (addSubtract === true) {
                for (y = startY; y < endY; ++y) {
                    for (x = startX; x < endX; ++x) {
                        index = (y * preWidth * 4) + x * 4;

                        grayColor = (pixels[pixelsIndex] + pixels[pixelsIndex + 1] + pixels[pixelsIndex + 2]) * 0.3333333;
                        if (subRectAlpha[pixelsIndex + 3] > 0) {
                            data[index] += grayColor;
                            data[++index] += grayColor;
                            data[++index] += grayColor;
                        } else {
                            let grayColor2 = (subRectAlpha[pixelsIndex] + subRectAlpha[pixelsIndex + 1] + subRectAlpha[pixelsIndex + 2]) * 0.3333333;
                            data[index] = grayColor + grayColor2;
                            data[++index] = grayColor + grayColor2;
                            data[++index] = grayColor + grayColor2;
                        }
                        pixelsIndex += 4;
                    }
                }
            } else {
                for (y = startY; y < endY; ++y) {
                    for (x = startX; x < endX; ++x) {
                        index = (y * preWidth * 4) + x * 4;

                        grayColor = (pixels[pixelsIndex] + pixels[pixelsIndex + 1] + pixels[pixelsIndex + 2]) * 0.3333333;
                        data[index] -= grayColor * 3;
                        data[++index] -= grayColor * 3;
                        data[++index] -= grayColor * 3;
                        pixelsIndex += 4;
                    }
                }
            }
        } else {
            for (y = startY; y < endY; ++y) {
                for (x = startX; x < endX; ++x) {
                    index = (y * preWidth * 4) + x * 4;

                    grayColor = (pixels[pixelsIndex] + pixels[pixelsIndex + 1] + pixels[pixelsIndex + 2]) * 0.3333333;
                    data[index] = grayColor;
                    data[++index] = grayColor;
                    data[++index] = grayColor;
                    pixelsIndex += 4;
                }
            }
        }
    }

    GetPixel(position) {
        return [
            this.lightData.data[position.x * this.lightFrameBuffer.width + position.y],
            this.lightData.data[position.x * this.lightFrameBuffer.width + position.y + 1],
            this.lightData.data[position.x * this.lightFrameBuffer.width + position.y + 2],
            this.lightData.data[position.x * this.lightFrameBuffer.width + position.y + 3]
        ];
    }

    GetColor(position) {
        if (this.lightData === undefined || this.lightData.data === undefined)
            return new Color(5, 5, 5);

        let index = (Math.floor(position.y) * this.lightFrameBuffer.width * 4) + (Math.floor(position.x) * 4),
            color = new Color(
                this.lightData.data[index],
                this.lightData.data[++index],
                this.lightData.data[++index],
                this.lightData.data[++index]
            );

        return color;
    }

    UpdateCanvas() {
        this.lightFrameBufferCtx.putImageData(this.lightData, 0, 0);
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
        this.lightFrameBufferCtx.globalCompositeOperation = 'hard-light';
        this.lightFrameBufferCtx.fillStyle = 'rgb(5, 5, 5)';
        this.lightFrameBufferCtx.fillRect(0, 0, this.lightFrameBuffer.width, this.lightFrameBuffer.height);
        this.lightFrameBufferCtx.globalCompositeOperation = 'luminosity';

        this.lightData = this.lightFrameBufferCtx.getImageData(0, 0, this.lightFrameBuffer.width, this.lightFrameBuffer.height);
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

export { LightSystem };