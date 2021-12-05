import { CMath } from '../internal.js';

/**
 * @class
 * @constructor
 */
class Vector2D {
    /**
     * Create a new Vector2D
     * @param {number} x - the x value
     * @param {number} y - the y value
     */
    constructor(x, y) {
        this.x = Number(x);
        this.y = Number(y);
    }

    Add(a) {
        if (a.x !== undefined) {
            this.x += a.x;
            this.y += a.y;
        } else {
            this.x += a;
            this.y += a;
        }
    }

    AddF(f) {
        this.x += f;
        this.y += f;
    }

    static AddF(a, f) {
        return new Vector2D(a.x + f, a.y + f);
    }

    static Add(a, b) {
        return new Vector2D(a.x + b.x, a.y + b.y);
    }

    Sub(a) {
        if (a.x !== undefined) {
            this.x -= a.x;
            this.y -= a.y;
        } else {
            this.x -= a;
            this.y -= a;
        }
    }

    static Sub(a, b) {
        return new Vector2D(a.x - b.x, a.y - b.y);
    }

    Mult(a) {
        if (a.x !== undefined) {
            this.x = this.x * a.x;
            this.y = this.y * a.y;
        } else {
            this.x *= a;
            this.y *= a;
        }
    }

    static Mult(a, b) {
        return new Vector2D(a.x * b.x, a.y * b.y);
    }

    Div(a) {
        if (a.x !== undefined) {
            this.x /= a.x;
            this.y /= a.y;
        } else {
            this.x /= a;
            this.y /= a;
        }
    }

    static Div(a, b) {
        return new Vector2D(a.x / b.x, a.y / b.y);
    }

    static DivX(a, b) {
        return new Vector2D(a.x / b, a.y / b);
    }

    static Min(vec, a) {
        return new Vector2D(vec.x < a ? a : vec.x, vec.y < a ? a : vec.y);
    }

    static Max(vec, a) {
        return new Vector2D(vec.x > a ? a : vec.x, vec.y > a ? a : vec.y);
    }

    Ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
    }

    SnapToGrid(x = 32, y = 32) {
        this.x = Math.floor(this.x / x) * x;
        this.y = Math.floor(this.y / y) * y;
    }

    SnapToGridF(x = 32) {
        this.x = Math.floor(this.x / x) * x;
        this.y = Math.floor(this.y / x) * x;
    }

    ToGrid(x = 32) {
        this.x = Math.floor(this.x / x);
        this.y = Math.floor(this.y / x);
    }

    Floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    }

    Abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
    }

    Equal(a) {
        return this.x == a.x && this.y == a.y;
    }

    Sqrt() {
        return new Vector2D(Math.sqrt(this.x), Math.sqrt(this.y));
    }

    Distance(a) {
        let y = a.x - this.x;
        let x = a.y - this.y;

        return Math.sqrt(x * x + y * y);
        //return Math.sqrt(Math.pow(this.x - a.x, 2)) + Math.sqrt(Math.pow(this.y - a.y, 2));
    }

    Lerp(a, t) {
        return new Vector2D(this.x + (a.x - this.x) * t, this.y + (a.y - this.y) * t);
    }

    LerpValue(a, v) {
        let distance = this.Distance(a);
        let t = v / distance;
        return this.Lerp(a, t);
    }

    CheckInRange(checkPos, range = 100.0) {
        return this.Distance(checkPos) < range;
    }

    Set(a) {
        this.x = a.x;
        this.y = a.y;
    }

    Clone() {
        return new Vector2D(this.x, this.y);
    }

    ToString(precision = 0) {
        return this.x.toFixed(precision) + ', ' + this.y.toFixed(precision);
    }

    Rotate(center, angle) {
        let rotatedPosition = CMath.Rotate(center, this, angle);
        this.x = rotatedPosition.x;
        this.y = rotatedPosition.y;
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y
        };
    }
}

/**
 * @class
 * @constructor
 */
class Vector {
    /**
     * 
     * @param {number} x - the x value
     * @param {number} y - the y value
     * @param {number} z - the z value 
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    Add(a) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
    }

    Sub(a) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
    }

    Mult(a) {
        this.x = this.x * a.x;
        this.y = this.y * a.y;
        this.z = this.z * a.z;
    }

    Div(a) {
        this.x /= a.x;
        this.y /= a.y;
        this.z /= a.z;
    }

    Equal(a) {
        return this.x == a.x && this.y == a.y && this.z == a.z;
    }
}

/**
 * @class
 * @constructor
 */
class Vector4D {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} a 
     */
    constructor(x, y, z, a) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.a = a;
    }

    Add(a) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        this.a += a.a;
    }

    AddF(a) {
        this.x += a;
        this.y += a;
        this.z += a;
        this.a += a;
    }

    Sub(a) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        this.a -= a.a;
    }

    SubF(a) {
        this.x -= a;
        this.y -= a;
        this.z -= a;
        this.a -= a;
    }

    Mult(a) {
        this.x = this.x * a.x;
        this.y = this.y * a.y;
        this.z = this.z * a.z;
        this.a = this.a * a.a;
    }

    Div(a) {
        this.x /= a.x;
        this.y /= a.y;
        this.z /= a.z;
        this.a /= a.a;
    }

    Inside(position) {
        return position.x > this.x && position.x < this.x + this.z && position.y > this.y && position.y < this.y + this.a;
    }

    Equal(a) {
        return this.x == a.x && this.y == a.y && this.z == a.z && this.a == a.a;
    }

    GetPosition() {
        return new Vector2D(this.x, this.y);
    }

    Clone() {
        return new Vector4D(this.x, this.y, this.z, this.a);
    }
}

/**
 * @class
 * @constructor
 */
class Matrix {
    constructor(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
        this.x3 = x3;
        this.y3 = y3;
        this.z3 = z3;
    }

    Add(b) {
        this.x1 += b.x1;
        this.y1 += b.y1;
        this.z1 += b.z1;
        this.x2 += b.x2;
        this.y2 += b.y2;
        this.z2 += b.z2;
        this.x3 += b.x3;
        this.y3 += b.y3;
        this.z3 += b.z3;
    }

    Set(b) {
        this.x1 = b.x1;
        this.y1 = b.y1;
        this.z1 = b.z1;
        this.x2 = b.x2;
        this.y2 = b.y2;
        this.z2 = b.z2;
        this.x3 = b.x3;
        this.y3 = b.y3;
        this.z3 = b.z3;
    }

    SetF(f) {
        this.x1 = f;
        this.y1 = f;
        this.z1 = f;
        this.x2 = f;
        this.y2 = f;
        this.z2 = f;
        this.x3 = f;
        this.y3 = f;
        this.z3 = f;
    }

    Null(b) {
        if (b === undefined)
            return;
        if (b.x1 === 0)
            this.x1 = null;
        if (b.y1 === 0)
            this.y1 = null;
        if (b.z1 === 0)
            this.z1 = null;
        if (b.x2 === 0)
            this.x2 = null;
        if (b.y2 === 0)
            this.y2 = null;
        if (b.z2 === 0)
            this.z2 = null;
        if (b.x3 === 0)
            this.x3 = null;
        if (b.y3 === 0)
            this.y3 = null;
        if (b.z3 === 0)
            this.z3 = null;
    }

    Filter(keys, filter) {
        let arr = this.ToArray();

        for (let i = 0, l = arr.length; i < l; ++i) {
            let temp = arr[i];
            for (let k = 0, lK = keys.length; k < lK; ++k) {
                if (temp !== undefined && temp[keys[k]] !== undefined)
                    temp = temp[keys[k]];
                else
                    arr[i] = null;
            }

            if (temp !== undefined && temp !== filter)
                arr[i] = null;
        }

        return Matrix.FromArray(arr);
    }

    FilterNot(keys, filter) {
        let arr = this.ToArray();

        for (let i = 0, l = arr.length; i < l; ++i) {
            let temp = arr[i];
            for (let k = 0, lK = keys.length; k < lK; ++k) {
                if (temp !== undefined && temp[keys[k]] !== undefined)
                    temp = temp[keys[k]];
            }

            if (temp === undefined || temp === filter)
                arr[i] = null;
        }

        return Matrix.FromArray(arr);
    }

    ToArray() {
        return [this.x1, this.y1, this.z1, this.x2, this.y2, this.z2, this.x3, this.y3, this.z3];
    }

    To3DArray() {
        return [
            [
                this.x1 instanceof Matrix ? this.x1.To3DArray() : this.x1,
                this.y1 instanceof Matrix ? this.y1.To3DArray() : this.y1,
                this.z1 instanceof Matrix ? this.z1.To3DArray() : this.z1
            ],
            [
                this.x2 instanceof Matrix ? this.x2.To3DArray() : this.x2,
                this.y2 instanceof Matrix ? this.y2.To3DArray() : this.y2,
                this.z2 instanceof Matrix ? this.z2.To3DArray() : this.z2
            ],
            [
                this.x3 instanceof Matrix ? this.x3.To3DArray() : this.x3,
                this.y3 instanceof Matrix ? this.y3.To3DArray() : this.y3,
                this.z3 instanceof Matrix ? this.z3.To3DArray() : this.z3
            ]
        ];
    }

    ToBinary() {
        return '0x' + this.y1 + '' + this.y3 + '' + this.x2 + '' + this.z2 + '' + this.z3 + '' + this.x1 + '' + this.z1 + '' + this.x3;
    }

    InvertMatrix() {
        this.x1 = this.x1 == 0 ? 1 : 0;
        this.y1 = this.y1 == 0 ? 1 : 0;
        this.z1 = this.z1 == 0 ? 1 : 0;
        this.x2 = this.x2 == 0 ? 1 : 0;
        this.y2 = this.y2 == 0 ? 1 : 0;
        this.z2 = this.z2 == 0 ? 1 : 0;
        this.x3 = this.x3 == 0 ? 1 : 0;
        this.y3 = this.y3 == 0 ? 1 : 0;
        this.z3 = this.z3 == 0 ? 1 : 0;
    }

    ConvertToBinary() {
        this.x1 = this.x1 !== null ? 1 : 0;
        this.y1 = this.y1 !== null ? 1 : 0;
        this.z1 = this.z1 !== null ? 1 : 0;
        this.x2 = this.x2 !== null ? 1 : 0;
        this.y2 = this.y2 !== null ? 1 : 0;
        this.z2 = this.z2 !== null ? 1 : 0;
        this.x3 = this.x3 !== null ? 1 : 0;
        this.y3 = this.y3 !== null ? 1 : 0;
        this.z3 = this.z3 !== null ? 1 : 0;
    }

    OffsetMatrix(vector2D) {
        if (vector2D === undefined)
            return [];

        let arr3D = this.To3DArray();

        for (let i = 0, l = arr3D.length; i < l; ++i) {
            if (vector2D.x === -1) {
                arr3D[i].shift();
                arr3D[i].push(0);
            }
            if (vector2D.x === 1) {
                arr3D[i].pop();
                arr3D[i] = [0].concat(arr3D[i]);
            }
        }

        if (vector2D.y === -1) {
            arr3D.shift();
            arr3D.push([0, 0, 0]);
        }
        if (vector2D.y === 1) {
            arr3D.pop();
            arr3D = [[0, 0, 0]].concat(arr3D);
        }

        return arr3D;
    }

    IsOne(b) {
        if (b === undefined)
            return;
        if (b.x1 === 1)
            this.x1 = 1;
        if (b.y1 === 1)
            this.y1 = 1;
        if (b.z1 === 1)
            this.z1 = 1;
        if (b.x2 === 1)
            this.x2 = 1;
        if (b.y2 === 1)
            this.y2 = 1;
        if (b.z2 === 1)
            this.z2 = 1;
        if (b.x3 === 1)
            this.x3 = 1;
        if (b.y3 === 1)
            this.y3 = 1;
        if (b.z3 === 1)
            this.z3 = 1;
    }

    Clone() {
        return new Matrix(this.x1, this.y1, this.z1, this.x2, this.y2, this.z2, this.x3, this.y3, this.z3);
    }

    /*
    526
    1?0
    734
    */

    static FromBinary(binary) {
        return new Matrix(binary[5], binary[2], binary[6], binary[1], 1, binary[0], binary[7], binary[3], binary[4]);
    }

    static FromArray(array) {
        return new Matrix(array[0], array[1], array[2], array[3], array[4], array[5], array[6], array[7], array[8]);
    }
}

/**
 * @class
 * @constructor
 */
class Rectangle {
    static OVERLAP_RANGE = 0;

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} w 
     * @param {Number} h 
     */
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.corners = undefined;
    }

    Add(a) {
        if (a.x !== undefined) {
            this.x += a.x;
            this.y += a.y;
            this.w += a.w;
            this.h += a.h;
        } else {
            this.x += a;
            this.y += a;
            this.w += a;
            this.h += a;
        }

        this.UpdateCornersData();
    }

    Sub(a) {
        if (a.x !== undefined) {
            this.x -= a.x;
            this.y -= a.y;
            this.w -= a.w;
            this.h -= a.h;
        } else {
            this.x -= a;
            this.y -= a;
            this.w -= a;
            this.h -= a;
        }

        this.UpdateCornersData();
    }

    Mult(a) {
        this.x = this.x * a.x;
        this.y = this.y * a.y;
        this.w = this.w * a.w;
        this.h = this.h * a.h;

        this.UpdateCornersData();
    }

    Div(a) {
        this.x /= a.x;
        this.y /= a.y;
        this.w /= a.w;
        this.h /= a.h;

        this.UpdateCornersData();
    }
    
    Floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.w = Math.floor(this.w);
        this.h = Math.floor(this.h);
    }

    static CreateRectangleFromTwoCorners(aX, aY, bX, bY) {
        let xMin = Math.min(aX, bX);
        let yMin = Math.min(aY, bY);
        let xMax = Math.max(aX, bX);
        let yMax = Math.max(aY, bY);

        if (xMax - xMin > 1 && yMax - yMin > 1)
            return new Rectangle(xMin, yMin, xMax - xMin, yMax - yMin);
        else
            return null;
    }

    RelativeComponents(b) {
        this.UpdateCornersData();
        b.UpdateCornersData(true);
        let overlappingCorners = b.GetOverlappingCorners(this);
        let nonOverlappingCorners = this.GetNonOverlappingCorners(b);

        let newRects = [];
        if (overlappingCorners.length + nonOverlappingCorners.length <= 4) {
            for (let nonI = 0, nonL = nonOverlappingCorners.length; nonI < nonL; ++nonI) {
                for (let i = 0, l = overlappingCorners.length; i < l; ++i) {
                    let newRect = Rectangle.CreateRectangleFromTwoCorners(nonOverlappingCorners[nonI][0], nonOverlappingCorners[nonI][1], overlappingCorners[i][0], overlappingCorners[i][1]);
                    if (newRect !== null)
                        newRects.push(newRect);
                }
            }
        }

        return newRects;
    }

    Inside(position) {
        return position.x >= this.x && position.x <= this.x + this.w && position.y >= this.y && position.y <= this.y + this.h;
    }

    InsideXY(x, y) {
        return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
    }

    IsRectInside(rect) {
        return this.x < rect.x && this.y < rect.y && this.x + this.w > rect.x + rect.w && this.y + this.h > rect.y + rect.h;
    }

    IsRectOverlappingOrInside(rect) {
        return this.x <= rect.x && this.y <= rect.y && this.x + this.w >= rect.x + rect.w && this.y + this.h >= rect.y + rect.h;
    }

    IsRectOverlappingOrInsideF(x, y, w, h) {
        return this.x <= x && this.y <= y && this.x + this.w >= x + w && this.y + this.h >= y + h;
    }

    IsCornerOverlappingOrInside(x, y, w, h) {
        return this.InsideXY(x, y) || this.InsideXY(x + w, y) || this.InsideXY(x, y + h) || this.InsideXY(x + w, y + h);
    }

    IsRectOutside(rect) {
        return this.x > rect.x && this.y > rect.y && this.x + this.w < rect.x + rect.w && this.y + this.h < rect.y + rect.h;
    }

    static InsideRectTest() {
        let a = new Rectangle(563, 11, 64, 64);
        let b = new Rectangle(586, 59, 16, 16);
        let trueValue = a.IsRectInside(b);
        let falseValue = b.IsRectInside(a);
        console.log(trueValue, falseValue);

        trueValue = b.IsRectOutside(a);
        falseValue = a.IsRectOutside(b);
        console.log(trueValue, falseValue);
    }

    Outside(rect) {
        return !(this.x < rect.x && this.y < rect.y && this.x + this.w > rect.x + rect.w && this.y + this.h > rect.y + rect.h);
    }

    OutsideXY(x, y) {
        return x <= this.x || x >= this.x + this.w && y <= this.y || y >= this.y + this.h;
    }

    IsOverlaping1D(aMin, aMax, bMin, bMax) {
        return aMax > bMin && bMax > aMin;
    }

    Overlaps(a) {
        return this.IsOverlaping1D(this.x - Rectangle.OVERLAP_RANGE, (this.x - Rectangle.OVERLAP_RANGE) + (this.w + Rectangle.OVERLAP_RANGE), a.x - Rectangle.OVERLAP_RANGE, (a.x - Rectangle.OVERLAP_RANGE) + (a.w + Rectangle.OVERLAP_RANGE)) && this.IsOverlaping1D(this.y - Rectangle.OVERLAP_RANGE, (this.y - Rectangle.OVERLAP_RANGE) + (this.h + Rectangle.OVERLAP_RANGE), a.y - Rectangle.OVERLAP_RANGE, (a.y - Rectangle.OVERLAP_RANGE) + (a.h + Rectangle.OVERLAP_RANGE));
    }

    UpdateCornersData(forceUpdate = false) {
        if (this.corners === undefined || forceUpdate === true) {
            //0: top left, 1: top right, 2: bottom left, 3: bottom right
            this.corners = [
                [this.x, this.y],
                [this.x + this.w, this.y],
                [this.x, this.y + this.h],
                [this.x + this.w, this.y + this.h]
            ];
        } else {
            this.corners[0][0] = this.x;
            this.corners[0][1] = this.y;

            this.corners[1][0] = this.x + this.w;
            this.corners[1][1] = this.y;

            this.corners[2][0] = this.x;
            this.corners[2][1] = this.y + this.h;

            this.corners[3][0] = this.x + this.w;
            this.corners[3][1] = this.y + this.h;
        }
    }

    GetCorners() {
        if (this.corners === undefined) {
            //0: top left, 1: top right, 2: bottom left, 3: bottom right
            this.corners = [
                [this.x, this.y],
                [this.x + this.w, this.y],
                [this.x, this.y + this.h],
                [this.x + this.w, this.y + this.h]
            ];
        }

        return this.corners;
    }

    GetCornersVector2D() {
        return this.corners = [
            new Vector2D(this.x, this.y),
            new Vector2D(this.x + this.w, this.y),
            new Vector2D(this.x, this.y + this.h),
            new Vector2D(this.x + this.w, this.y + this.h)
        ];
    }

    GetCenterPoint() {
        return new Vector2D(this.x + this.w * 0.5, this.y + this.h * 0.5);
    }

    GetNonOverlappingCorners(a) {
        if (a.corners === undefined)
            a.UpdateCornersData();
        //let corners = a.GetCorners();
        let outsideCorners = [];

        if (this.OutsideXY(a.corners[0][0], a.corners[0][1]))
            outsideCorners.push(a.corners[0]);
        if (this.OutsideXY(a.corners[1][0], a.corners[1][1]))
            outsideCorners.push(a.corners[1]);
        if (this.OutsideXY(a.corners[2][0], a.corners[2][1]))
            outsideCorners.push(a.corners[2]);
        if (this.OutsideXY(a.corners[3][0], a.corners[3][1]))
            outsideCorners.push(a.corners[3]);

        return outsideCorners;
    }

    GetOverlappingCorners(a) {
        if (a.corners === undefined)
            a.UpdateCornersData();
        //let corners = a.GetCorners();
        let insideCorners = [];

        if (this.InsideXY(a.corners[0][0], a.corners[0][1]))
            insideCorners.push(a.corners[0]);
        if (this.InsideXY(a.corners[1][0], a.corners[1][1]))
            insideCorners.push(a.corners[1]);
        if (this.InsideXY(a.corners[2][0], a.corners[2][1]))
            insideCorners.push(a.corners[2]);
        if (this.InsideXY(a.corners[3][0], a.corners[3][1]))
            insideCorners.push(a.corners[3]);

        return insideCorners;
    }

    GetIntersection(a, debug = false) {
        let insideCorners = this.GetOverlappingCorners(a);

        if (insideCorners.length === 0)
            insideCorners = a.GetOverlappingCorners(this);

        if (insideCorners.length === 1) {
            let insideCornersA = a.GetOverlappingCorners(this);

            if (insideCornersA.length === 1)
                return new Rectangle(Math.min(insideCorners[0][0], insideCornersA[0][0]), Math.min(insideCorners[0][1], insideCornersA[0][1]), Math.abs(insideCorners[0][0] - insideCornersA[0][0]), Math.abs(insideCorners[0][1] - insideCornersA[0][1]));

            if (insideCornersA.length > 1) {
                let minX, maxX, minY, maxY;
                minX = Math.min(insideCorners[0][0], insideCornersA[0][0]);
                maxX = Math.max(insideCorners[0][0], insideCornersA[0][0]);
                minY = Math.min(insideCorners[0][1], insideCornersA[0][1]);
                maxY = Math.max(insideCorners[0][1], insideCornersA[0][1]);

                if (minX === maxX && minY !== maxY) {
                    if (this.x <= a.x && a.x <= this.x + this.w)
                        return new Rectangle(a.x, minY, (this.x + this.w) - a.x, maxY - minY);
                    else
                        return new Rectangle(this.x, minY, (a.x + a.w) - this.x, maxY - minY);
                } else if (minY === maxY && minX !== maxX) {
                    if (this.y <= a.y && a.y <= this.y + this.h)
                        return new Rectangle(minX, a.y, maxX - minX, (this.y + this.h) - a.y);
                    else
                        return new Rectangle(minX, this.y, maxX - minX, (a.y + a.h) - this.y);
                } else if (minX === maxX && minY === maxY) {
                    if (this.w < a.w && this.h < a.h)
                        return this;
                    else
                        return a;
                } else {
                    return new Rectangle(minX, minY, maxX - minX, maxY - minY);
                }
            } else
                return this;
        } else if (insideCorners.length === 2) {
            let minX, maxX, minY, maxY;
            minX = Math.min(insideCorners[0][0], insideCorners[1][0]);
            maxX = Math.max(insideCorners[0][0], insideCorners[1][0]);
            minY = Math.min(insideCorners[0][1], insideCorners[1][1]);
            maxY = Math.max(insideCorners[0][1], insideCorners[1][1]);

            if (minX === maxX && minY !== maxY) {
                if (this.x <= a.x && a.x <= this.x + this.w)
                    return new Rectangle(a.x, minY, (this.x + this.w) - a.x, maxY - minY);
                else
                    return new Rectangle(this.x, minY, (a.x + a.w) - this.x, maxY - minY);
            } else if (minY === maxY && minX !== maxX) {
                if (this.y <= a.y && a.y <= this.y + this.h)
                    return new Rectangle(minX, a.y, maxX - minX, (this.y + this.h) - a.y);
                else
                    return new Rectangle(minX, this.y, maxX - minX, (a.y + a.h) - this.y);
            }
        } else if (insideCorners.length > 2) {
            if (this.IsRectInside(a))
                return a;
            if (a.IsRectInside(this))
                return this;
            if (this.IsRectOutside(a))
                return a;
            if (a.IsRectOutside(this))
                return this;

            if (this.x <= a.x && this.y <= a.y)
                return a;
            else if (a.x <= this.x && a.y <= this.y)
                return this;
            else
                return this;
        }

        return undefined;
    }

    Set(a) {
        this.x = a.x;
        this.y = a.y;
        this.w = a.w;
        this.h = a.h;
    }

    Equal(a) {
        return this.x === a.x && this.y === a.y && this.w === a.w && this.h === a.h;
    }

    Clear() {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.corners = undefined;
    }

    Clone() {
        return new Rectangle(this.x, this.y, this.w, this.h);
    }

    Copy(rect) {
        this.x = rect.x;
        this.y = rect.y;
        this.w = rect.w;
        this.h = rect.h;
    }

    ToString() {
        return this.x + ', ' + this.y + ', ' + this.w + ', ' + this.h;
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            c: JSON.stringify(this.corners)
        };
    }
}

/**
 * @class
 * @constructor
 */
class Direction {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.forward = angle;
    }
}

/**
 * @class
 * @constructor
 */
class Polygon {
    static CalculateBoundingBox(points) {
        let sX = 9999999999, sY = 9999999999, lX = -1, lY = -1;

        for (let pos of points) {
            if (pos.x > lX)
                lX = pos.x;
            if (pos.x < sX)
                sX = pos.x;
            if (pos.y > lY)
                lY = pos.y;
            if (pos.y < sY)
                sY = pos.y;
        }
        return new Vector4D(sX, sY, lX - sX, lY - sY);
    }
}

/**
 * @class
 * @constructor
 */
class Color {

    /**
     * Creates a new color
     * @param {Number} red 
     * @param {Number} green 
     * @param {Number} blue 
     * @param {Number} alpha 
     */
    constructor(red = 255, green = 255, blue = 255, alpha = 1) {
        if (alpha > 1.0)
            this.alpha = alpha; //CMath.MapRange(alpha, 0, 255, 0, 1);
        else
            this.alpha = alpha;

        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    static CSS_COLOR_NAMES = [
        'AliceBlue',
        'AntiqueWhite',
        'Aqua',
        'Aquamarine',
        'Azure',
        'Beige',
        'Bisque',
        'Black',
        'BlanchedAlmond',
        'Blue',
        'BlueViolet',
        'Brown',
        'BurlyWood',
        'CadetBlue',
        'Chartreuse',
        'Chocolate',
        'Coral',
        'CornflowerBlue',
        'Cornsilk',
        'Crimson',
        'Cyan',
        'DarkBlue',
        'DarkCyan',
        'DarkGoldenRod',
        'DarkGray',
        'DarkGrey',
        'DarkGreen',
        'DarkKhaki',
        'DarkMagenta',
        'DarkOliveGreen',
        'DarkOrange',
        'DarkOrchid',
        'DarkRed',
        'DarkSalmon',
        'DarkSeaGreen',
        'DarkSlateBlue',
        'DarkSlateGray',
        'DarkSlateGrey',
        'DarkTurquoise',
        'DarkViolet',
        'DeepPink',
        'DeepSkyBlue',
        'DimGray',
        'DimGrey',
        'DodgerBlue',
        'FireBrick',
        'FloralWhite',
        'ForestGreen',
        'Fuchsia',
        'Gainsboro',
        'GhostWhite',
        'Gold',
        'GoldenRod',
        'Gray',
        'Grey',
        'Green',
        'GreenYellow',
        'HoneyDew',
        'HotPink',
        'IndianRed',
        'Indigo',
        'Ivory',
        'Khaki',
        'Lavender',
        'LavenderBlush',
        'LawnGreen',
        'LemonChiffon',
        'LightBlue',
        'LightCoral',
        'LightCyan',
        'LightGoldenRodYellow',
        'LightGray',
        'LightGrey',
        'LightGreen',
        'LightPink',
        'LightSalmon',
        'LightSeaGreen',
        'LightSkyBlue',
        'LightSlateGray',
        'LightSlateGrey',
        'LightSteelBlue',
        'LightYellow',
        'Lime',
        'LimeGreen',
        'Linen',
        'Magenta',
        'Maroon',
        'MediumAquaMarine',
        'MediumBlue',
        'MediumOrchid',
        'MediumPurple',
        'MediumSeaGreen',
        'MediumSlateBlue',
        'MediumSpringGreen',
        'MediumTurquoise',
        'MediumVioletRed',
        'MidnightBlue',
        'MintCream',
        'MistyRose',
        'Moccasin',
        'NavajoWhite',
        'Navy',
        'OldLace',
        'Olive',
        'OliveDrab',
        'Orange',
        'OrangeRed',
        'Orchid',
        'PaleGoldenRod',
        'PaleGreen',
        'PaleTurquoise',
        'PaleVioletRed',
        'PapayaWhip',
        'PeachPuff',
        'Peru',
        'Pink',
        'Plum',
        'PowderBlue',
        'Purple',
        'RebeccaPurple',
        'Red',
        'RosyBrown',
        'RoyalBlue',
        'SaddleBrown',
        'Salmon',
        'SandyBrown',
        'SeaGreen',
        'SeaShell',
        'Sienna',
        'Silver',
        'SkyBlue',
        'SlateBlue',
        'SlateGray',
        'SlateGrey',
        'Snow',
        'SpringGreen',
        'SteelBlue',
        'Tan',
        'Teal',
        'Thistle',
        'Tomato',
        'Turquoise',
        'Violet',
        'Wheat',
        'White',
        'WhiteSmoke',
        'Yellow',
        'YellowGreen',
    ];

    static CSS_COLOR_TABLE = {
        'transparent': 'rgba(0,0,0,0)',
        'aliceblue': 'rgba(240,248,255,1)',
        'antiquewhite': 'rgba(250,235,215,1)',
        'aqua': 'rgba(0,255,255,1)',
        'aquamarine': 'rgba(127,255,212,1)',
        'azure': 'rgba(240,255,255,1)',
        'beige': 'rgba(245,245,220,1)',
        'bisque': 'rgba(255,228,196,1)',
        'black': 'rgba(0,0,0,1)',
        'blanchedalmond': 'rgba(255,235,205,1)',
        'blue': 'rgba(0,0,255,1)',
        'blueviolet': 'rgba(138,43,226,1)',
        'brown': 'rgba(165,42,42,1)',
        'burlywood': 'rgba(222,184,135,1)',
        'cadetblue': 'rgba(95,158,160,1)',
        'chartreuse': 'rgba(127,255,0,1)',
        'chocolate': 'rgba(210,105,30,1)',
        'coral': 'rgba(255,127,80,1)',
        'cornflowerblue': 'rgba(100,149,237,1)',
        'cornsilk': 'rgba(255,248,220,1)',
        'crimson': 'rgba(220,20,60,1)',
        'cyan': 'rgba(0,255,255,1)',
        'darkblue': 'rgba(0,0,139,1)',
        'darkcyan': 'rgba(0,139,139,1)',
        'darkgoldenrod': 'rgba(184,134,11,1)',
        'darkgray': 'rgba(169,169,169,1)',
        'darkgrey': 'rgba(169,169,169,1)',
        'darkgreen': 'rgba(0,100,0,1)',
        'darkkhaki': 'rgba(189,183,107,1)',
        'darkmagenta': 'rgba(139,0,139,1)',
        'darkolivegreen': 'rgba(85,107,47,1)',
        'darkorange': 'rgba(255,140,0,1)',
        'darkorchid': 'rgba(153,50,204,1)',
        'darkred': 'rgba(139,0,0,1)',
        'darksalmon': 'rgba(233,150,122,1)',
        'darkseagreen': 'rgba(143,188,143,1)',
        'darkslateblue': 'rgba(72,61,139,1)',
        'darkslategray': 'rgba(47,79,79,1)',
        'darkslategrey': 'rgba(47,79,79,1)',
        'darkturquoise': 'rgba(0,206,209,1)',
        'darkviolet': 'rgba(148,0,211,1)',
        'deeppink': 'rgba(255,20,147,1)',
        'deepskyblue': 'rgba(0,191,255,1)',
        'dimgray': 'rgba(105,105,105,1)',
        'dimgrey': 'rgba(105,105,105,1)',
        'dodgerblue': 'rgba(30,144,255,1)',
        'firebrick': 'rgba(178,34,34,1)',
        'floralwhite': 'rgba(255,250,240,1)',
        'forestgreen': 'rgba(34,139,34,1)',
        'fuchsia': 'rgba(255,0,255,1)',
        'gainsboro': 'rgba(220,220,220,1)',
        'ghostwhite': 'rgba(248,248,255,1)',
        'gold': 'rgba(255,215,0,1)',
        'goldenrod': 'rgba(218,165,32,1)',
        'gray': 'rgba(128,128,128,1)',
        'grey': 'rgba(128,128,128,1)',
        'green': 'rgba(0,128,0,1)',
        'greenyellow': 'rgba(173,255,47,1)',
        'honeydew': 'rgba(240,255,240,1)',
        'hotpink': 'rgba(255,105,180,1)',
        'indianred': 'rgba(205,92,92,1)',
        'indigo': 'rgba(75,0,130,1)',
        'ivory': 'rgba(255,255,240,1)',
        'khaki': 'rgba(240,230,140,1)',
        'lavender': 'rgba(230,230,250,1)',
        'lavenderblush': 'rgba(255,240,245,1)',
        'lawngreen': 'rgba(124,252,0,1)',
        'lemonchiffon': 'rgba(255,250,205,1)',
        'lightblue': 'rgba(173,216,230,1)',
        'lightcoral': 'rgba(240,128,128,1)',
        'lightcyan': 'rgba(224,255,255,1)',
        'lightgoldenrodyellow': 'rgba(250,250,210,1)',
        'lightgray': 'rgba(211,211,211,1)',
        'lightgrey': 'rgba(211,211,211,1)',
        'lightgreen': 'rgba(144,238,144,1)',
        'lightpink': 'rgba(255,182,193,1)',
        'lightsalmon': 'rgba(255,160,122,1)',
        'lightseagreen': 'rgba(32,178,170,1)',
        'lightskyblue': 'rgba(135,206,250,1)',
        'lightslategray': 'rgba(119,136,153,1)',
        'lightslategrey': 'rgba(119,136,153,1)',
        'lightsteelblue': 'rgba(176,196,222,1)',
        'lightyellow': 'rgba(255,255,224,1)',
        'lime': 'rgba(0,255,0,1)',
        'limegreen': 'rgba(50,205,50,1)',
        'linen': 'rgba(250,240,230,1)',
        'magenta': 'rgba(255,0,255,1)',
        'maroon': 'rgba(128,0,0,1)',
        'mediumaquamarine': 'rgba(102,205,170,1)',
        'mediumblue': 'rgba(0,0,205,1)',
        'mediumorchid': 'rgba(186,85,211,1)',
        'mediumpurple': 'rgba(147,112,219,1)',
        'mediumseagreen': 'rgba(60,179,113,1)',
        'mediumslateblue': 'rgba(123,104,238,1)',
        'mediumspringgreen': 'rgba(0,250,154,1)',
        'mediumturquoise': 'rgba(72,209,204,1)',
        'mediumvioletred': 'rgba(199,21,133,1)',
        'midnightblue': 'rgba(25,25,112,1)',
        'mintcream': 'rgba(245,255,250,1)',
        'mistyrose': 'rgba(255,228,225,1)',
        'moccasin': 'rgba(255,228,181,1)',
        'navajowhite': 'rgba(255,222,173,1)',
        'navy': 'rgba(0,0,128,1)',
        'oldlace': 'rgba(253,245,230,1)',
        'olive': 'rgba(128,128,0,1)',
        'olivedrab': 'rgba(107,142,35,1)',
        'orange': 'rgba(255,165,0,1)',
        'orangered': 'rgba(255,69,0,1)',
        'orchid': 'rgba(218,112,214,1)',
        'palegoldenrod': 'rgba(238,232,170,1)',
        'palegreen': 'rgba(152,251,152,1)',
        'paleturquoise': 'rgba(175,238,238,1)',
        'palevioletred': 'rgba(219,112,147,1)',
        'papayawhip': 'rgba(255,239,213,1)',
        'peachpuff': 'rgba(255,218,185,1)',
        'peru': 'rgba(205,133,63,1)',
        'pink': 'rgba(255,192,203,1)',
        'plum': 'rgba(221,160,221,1)',
        'powderblue': 'rgba(176,224,230,1)',
        'purple': 'rgba(128,0,128,1)',
        'rebeccapurple': 'rgba(102,51,153,1)',
        'red': 'rgba(255,0,0,1)',
        'rosybrown': 'rgba(188,143,143,1)',
        'royalblue': 'rgba(65,105,225,1)',
        'saddlebrown': 'rgba(139,69,19,1)',
        'salmon': 'rgba(250,128,114,1)',
        'sandybrown': 'rgba(244,164,96,1)',
        'seagreen': 'rgba(46,139,87,1)',
        'seashell': 'rgba(255,245,238,1)',
        'sienna': 'rgba(160,82,45,1)',
        'silver': 'rgba(192,192,192,1)',
        'skyblue': 'rgba(135,206,235,1)',
        'slateblue': 'rgba(106,90,205,1)',
        'slategray': 'rgba(112,128,144,1)',
        'slategrey': 'rgba(112,128,144,1)',
        'snow': 'rgba(255,250,250,1)',
        'springgreen': 'rgba(0,255,127,1)',
        'steelblue': 'rgba(70,130,180,1)',
        'tan': 'rgba(210,180,140,1)',
        'teal': 'rgba(0,128,128,1)',
        'thistle': 'rgba(216,191,216,1)',
        'tomato': 'rgba(255,99,71,1)',
        'turquoise': 'rgba(64,224,208,1)',
        'violet': 'rgba(238,130,238,1)',
        'wheat': 'rgba(245,222,179,1)',
        'white': 'rgba(255,255,255,1)',
        'whitesmoke': 'rgba(245,245,245,1)',
        'yellow': 'rgba(255,255,0,1)',
        'yellowgreen': 'rgba(154,205,50,1)'
    };

    static ColorToRGBA(color) {
        if (color !== undefined && color instanceof Color)
            return color;

        if (Color.CSS_COLOR_TABLE[color.toLowerCase()] !== undefined) {
            let rgbaColor = Color.CSS_COLOR_TABLE[color.toLowerCase()],
                splitColors = rgbaColor.slice(rgbaColor.indexOf('(') + 1, rgbaColor.indexOf(')'));

            splitColors = splitColors.split(',');
            return new Color(parseFloat(splitColors[0]), parseFloat(splitColors[1]), parseFloat(splitColors[2]), parseFloat(splitColors[3]));
        } else if (color.startsWith('rgb')) {
            let rgbaColor = color,
                splitColors = rgbaColor.slice(rgbaColor.indexOf('(') + 1, rgbaColor.indexOf(')'));

            splitColors = splitColors.split(',');
            return new Color(parseFloat(splitColors[0]), parseFloat(splitColors[1]), parseFloat(splitColors[2]), parseFloat(splitColors[3]));
        } else
            return new Color(0, 0, 0, 0);
    }

    AlphaMultiply() {
        this.red *= this.alpha / 255;
        this.green *= this.alpha / 255;
        this.blue *= this.alpha / 255;
    }

    Add(a) {
        this.red += a.red;
        this.green += a.green;
        this.blue += a.blue;
    }

    AddAlpha(a) {
        let tA = this.alpha / 255,
            aA = a.alpha / 255;

        this.red = (a.red * aA) + (this.red * (1 - aA));
        this.green = (a.green * aA) + (this.green * (1 - aA));
        this.blue = (a.blue * aA) + (this.blue * (1 - aA));
    }

    Sub(a) {
        this.red -= a.red;
        this.green -= a.green;
        this.blue -= a.blue;
    }

    Mult(a) {
        this.red *= a.red;
        this.green *= a.green;
        this.blue *= a.blue;
    }

    MultAlpha(a) {
        let tA = this.alpha / 255;

        this.red = (this.red * tA) * (a.red * (1 - tA));
        this.green = (this.green * tA) * (a.green * (1 - tA));
        this.blue = (this.blue * tA) * (a.blue * (1 - tA));
    }

    MultF(float) {
        this.red *= float;
        this.green *= float;
        this.blue *= float;
    }

    static Mult(color, a) {
        let newColor = new Color(color.red, color.green, color.blue, color.alpha);
        newColor.red *= Number.isNaN(a.red) === false ? a.red : 1;
        newColor.green *= Number.isNaN(a.green) === false ? a.green : 1;
        newColor.blue *= Number.isNaN(a.blue) === false ? a.blue : 1;

        return newColor;
    }

    static MultF(color, float) {
        let newColor = new Color(color.red, color.green, color.blue, color.alpha);
        newColor.red *= Number.isNaN(float) === false ? float : 1;
        newColor.green *= Number.isNaN(float) === false ? float : 1;
        newColor.blue *= Number.isNaN(float) === false ? float : 1;

        return newColor;
    }

    static Darken(c, r) {
        return new Color(c.red * (1.0 - r), c.green * (1.0 - r), c.blue * (1.0 - r), c.alpha);
    }

    static Lighten(c, r) {
        return new Color(c.red * (1.0 + r), c.green * (1.0 + r), c.blue * (1.0 + r), c.alpha);
    }

    static Interpolate(c1, c2, r) {
        return new Color(c1.red + (c2.red - c1.red) * r, c1.green + (c2.green - c1.green) * r, c1.blue + (c2.blue - c1.blue) * r, c1.alpha + (c2.alpha - c1.alpha) * r);
    }

    static Complementary(c) {
        return new Color(255 - c.red, 255 - c.green, 255 - c.blue, c.alpha);
    }

    ToGrayscale() {
        this.red = this.green = this.blue = this.red + this.green + this.blue / 3;
    }

    Set(color) {
        this.red = color.red;
        this.green = color.green;
        this.blue = color.blue;
        this.alpha = color.alpha;
    }

    Equal(b) {
        return this.red === b.red && this.green === b.green && this.blue === b.blue;
    }

    ToInt() {
        this.red = Math.min(Math.max(Math.round(this.red), 0), 255);
        this.green = Math.min(Math.max(Math.round(this.green), 0), 255);
        this.blue = Math.min(Math.max(Math.round(this.blue), 0), 255);
        this.alpha = Math.min(Math.max(Math.round(this.alpha), 0), 1);
    }

    Clone() {
        return new Color(this.red, this.green, this.blue, this.alpha);
    }

    ToString() {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }

    *[Symbol.iterator]() {
        yield this.red;
        yield this.green;
        yield this.blue;
        yield this.alpha;
    }
}

export { Vector2D, Vector, Vector4D, Matrix, Rectangle, Direction, Polygon, Color };