import { Color, Vector, Vector4D, CMath, Vector2D } from '../../internal.js';

class Math3D {
    constructor() {

    }

    /**
     * Algorithm to calculate the rotation angle and rotates an array
     * @param {Number} pitch 
     * @param {Number} roll 
     * @param {Number} yaw  
     * @param {Array<Vector4D>} points 
     * @param {Vector} center 
     */
    static Rotate(pitch, roll, yaw, points, center = new Vector(0, 0, 0)) {
        let cosa = Math.cos(yaw);
        let sina = Math.sin(yaw);

        let cosb = Math.cos(pitch);
        let sinb = Math.sin(pitch);

        let cosc = Math.cos(roll);
        let sinc = Math.sin(roll);

        let Axx = cosa * cosb;
        let Axy = cosa * sinb * sinc - sina * cosc;
        let Axz = cosa * sinb * cosc + sina * sinc;

        let Ayx = sina * cosb;
        let Ayy = sina * sinb * sinc + cosa * cosc;
        let Ayz = sina * sinb * cosc - cosa * sinc;

        let Azx = -sinb;
        let Azy = cosb * sinc;
        let Azz = cosb * cosc;

        let px, py, pz;
        for (let i = 0, l = points.length; i < l; ++i) {
            px = points[i].x - center.x;
            py = points[i].y - center.y;
            pz = points[i].z - center.z;

            points[i].x = (Axx * px + Axy * py + Axz * pz) + center.x;
            points[i].y = (Ayx * px + Ayy * py + Ayz * pz) + center.y;
            points[i].z = (Azx * px + Azy * py + Azz * pz) + center.z;
        }
    }

    /**
     * Algorithm to calculate the rotation angle and rotates an array
     * @param {Number} pitch 
     * @param {Number} roll 
     * @param {Number} yaw 
     * @param {Vector2D} size 
     * @param {Uint8ClampedArray} points 
     * @param {Vector} center 
     * @param {Number} offset 
     */
    static Rotate2D(pitch, roll, yaw, size, points, center = new Vector(0, 0, 0), offset) {
        let cosa = Math.cos(yaw);
        let sina = Math.sin(yaw);

        let cosb = Math.cos(pitch);
        let sinb = Math.sin(pitch);

        let cosc = Math.cos(roll);
        let sinc = Math.sin(roll);

        let Axx = cosa * cosb;
        let Axy = cosa * sinb * sinc - sina * cosc;
        let Axz = cosa * sinb * cosc + sina * sinc;

        let Ayx = sina * cosb;
        let Ayy = sina * sinb * sinc + cosa * cosc;
        let Ayz = sina * sinb * cosc - cosa * sinc;

        let px, py, pz, rpx, rpy, index = 0, pointIndex = 0;
        let tPoints = [points.length];
        tPoints.length = points.length;
        for (let i = 0, l = points.length; i < l; ++i) {
            tPoints[i] = 0;
        }

        let y = 0,
            x = 0,
            lY = size.y,
            lX = size.x;

        for (y = 0, lY = size.y; y < lY; ++y) {
            for (x = 0, lX = size.x; x < lX; ++x) {
                px = x - center.x;
                py = y - center.y;
                pz = 0 - center.z;

                rpx = (Axx * px + Axy * py + Axz * pz) + center.x;
                rpy = (Ayx * px + Ayy * py + Ayz * pz) + center.y;

                if (Math.floor(rpx) < 0 || Math.floor(rpx) > size.x - 1 || Math.ceil(rpx) < 0 || Math.ceil(rpx) > size.x - 1) {
                    pointIndex += 4;
                    continue;
                }

                if (Math.floor(rpy) < 0 || Math.floor(rpy) > size.y - 1 || Math.ceil(rpy) < 0 || Math.ceil(rpy) > size.y - 1) {
                    pointIndex += 4;
                    continue;
                }

                index = Math.floor(rpy + offset) * (size.x * 4) + Math.floor(rpx) * 4;
                if ((index % 4) === 0)
                    index += index % 4;

                if (tPoints[index] !== undefined && points[pointIndex + 3] > 0) {
                    tPoints[index] = points[pointIndex];
                    tPoints[index + 1] = points[pointIndex + 1];
                    tPoints[index + 2] = points[pointIndex + 2];
                    tPoints[index + 3] = points[pointIndex + 3];
                }

                index = Math.ceil(rpy + offset) * (size.x * 4) + Math.ceil(rpx) * 4;
                if ((index % 4) === 0)
                    index += index % 4;

                if (tPoints[index] !== undefined && points[pointIndex + 3] > 0) {
                    tPoints[index] = points[pointIndex];
                    tPoints[index + 1] = points[pointIndex + 1];
                    tPoints[index + 2] = points[pointIndex + 2];
                    tPoints[index + 3] = points[pointIndex + 3];
                }
                pointIndex += 4;
            }
        }

        points.set(tPoints);
    }

    /**
     * Rotates an Uint8ClampedArray as it was in 3D but in 2D and sets the rotated data back
     * @param {ImageData} data 
     * @param {Vector2D} size 
     * @param {Vector} rotationVector 
     * @param {Number} yOffset 
     * @param {Vector} center 
     */
    static RotatePixelData(data, size, rotationVector = new Vector(0, 0, 0), yOffset = 0, center = new Vector(0, 0, 0)) {
        let pointData = [];
        let colorData = [];
        let colorIndex = 0;
        let index = 0;
        let newData = [];

        for (let y = 0; y < size.y; ++y) {
            for (let x = 0; x < size.x; ++x) {
                pointData.push(new Vector4D(x, y, 0, colorIndex));
                let tempColor = new Color(data.data[index], data.data[index + 1], data.data[index + 2], data.data[index + 3]);
                colorData.push(tempColor);
                newData.push(0);
                newData.push(0);
                newData.push(0);
                newData.push(0);

                colorIndex++;
                index += 4;
            }
        }

        Math3D.Rotate(CMath.DegreesToRadians(rotationVector.x), CMath.DegreesToRadians(rotationVector.y), CMath.DegreesToRadians(rotationVector.z), pointData, center);

        let newIndexFloor = 0,
            newIndexCeil = 0;

        for (let i = 0, l = pointData.length; i < l; ++i) {
            newIndexFloor = (Math.floor(pointData[i].x) * 4) + (Math.floor(pointData[i].y + yOffset) * size.x * 4);
            //newIndexCeil = (Math.ceil(pointData[i].x) * 4) + (Math.ceil(pointData[i].y + yOffset) * size.x * 4);

            let tempColor = colorData[pointData[i].a];

            newData[newIndexFloor] = tempColor.red;
            newData[++newIndexFloor] = tempColor.green;
            newData[++newIndexFloor] = tempColor.blue;
            newData[++newIndexFloor] = tempColor.alpha;

            /*newData[newIndexCeil] = tempColor.red;
            newData[++newIndexCeil] = tempColor.green;
            newData[++newIndexCeil] = tempColor.blue;
            newData[++newIndexCeil] = tempColor.alpha;*/
        }

        for (let i = 0, l = newData.length; i < l; ++i) {
            data.data[i] = newData[i];
        }
    }

    /**
     * Rotates an Uint8ClampedArray as it was in 3D but in 2D and sets the rotated data back
     * @param {Uint8ClampedArray} data 
     * @param {Vector2D} size 
     * @param {Vector} rotationVector 
     * @param {Number} yOffset 
     * @param {Vector} center 
     */
    static RotatePixelData2D(data, size, rotationVector = new Vector(0, 0, 0), yOffset = 0, center = new Vector(0, 0, 0)) {
        Math3D.Rotate2D(CMath.DegreesToRadians(rotationVector.x), CMath.DegreesToRadians(rotationVector.y), CMath.DegreesToRadians(rotationVector.z), size, data, center, yOffset);
    }
}

export { Math3D };