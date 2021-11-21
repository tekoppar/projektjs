import { Color, Vector, Vector4D, CMath } from '../../internal.js';

class Math3D {
    constructor() {

    }

    
    static Rotate(pitch, roll, yaw, points, center = new Vector(0,0,0)) {
        var cosa = Math.cos(yaw);
        var sina = Math.sin(yaw);

        var cosb = Math.cos(pitch);
        var sinb = Math.sin(pitch);

        var cosc = Math.cos(roll);
        var sinc = Math.sin(roll);

        var Axx = cosa * cosb;
        var Axy = cosa * sinb * sinc - sina * cosc;
        var Axz = cosa * sinb * cosc + sina * sinc;

        var Ayx = sina * cosb;
        var Ayy = sina * sinb * sinc + cosa * cosc;
        var Ayz = sina * sinb * cosc - cosa * sinc;

        var Azx = -sinb;
        var Azy = cosb * sinc;
        var Azz = cosb * cosc;

        for (var i = 0, l = points.length; i < l; ++i) {
            var px = points[i].x - center.x;
            var py = points[i].y - center.y;
            var pz = points[i].z - center.z;

            points[i].x = (Axx * px + Axy * py + Axz * pz) + center.x;
            points[i].y = (Ayx * px + Ayy * py + Ayz * pz) + center.y;
            points[i].z = (Azx * px + Azy * py + Azz * pz) + center.z;
        }
    }

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

        let newIndex = 0;
        for (let i = 0, l = pointData.length; i < l; ++i) {
            newIndex = Math.round(pointData[i].x) * 4 + Math.round(pointData[i].y + yOffset) * (size.x) * 4;
            let tempColor = colorData[pointData[i].a];
            newData[newIndex] = tempColor.red;
            newData[++newIndex] = tempColor.green;
            newData[++newIndex] = tempColor.blue;
            newData[++newIndex] = tempColor.alpha;
        }

        for (let i = 0, l = newData.length; i < l; ++i) {
            data.data[i] = newData[i];
        }
    }
}

export { Math3D };