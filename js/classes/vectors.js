import { CMath, DebugDrawer, earcut, OpenClosed } from '../internal.js';

/**
 * @memberof Number
 */
Object.defineProperty(Number, 'Equals', {
	value(a, b) {
		return a === b; //The maximum is exclusive and the minimum is inclusive          
	}
});

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
		/** @type {number} */ this.x = Number(x);
		/** @type {number} */ this.y = Number(y);
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 */
	Add(a) {
		this.x += a.x;
		this.y += a.y;
	}

	/**
	 * 
	 * @param {number} f 
	 */
	AddF(f) {
		this.x += f;
		this.y += f;
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {number} f 
	 * @returns {Vector2D}
	 */
	static AddF(a, f) {
		return new Vector2D(a.x + f, a.y + f);
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {Vector2D} b
	 * @returns {Vector2D}
	 */
	static Add(a, b) {
		return new Vector2D(a.x + b.x, a.y + b.y);
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 */
	Sub(a) {
		this.x -= a.x;
		this.y -= a.y;
	}

	/**
	 * 
	 * @param {number} f 
	 */
	SubF(f) {
		this.x -= f;
		this.y -= f;
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {Vector2D} b 
	 * @returns {Vector2D}
	 */
	static Sub(a, b) {
		return new Vector2D(a.x - b.x, a.y - b.y);
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {Vector2D} b 
	 * @returns {Vector2D}
	 */
	static SubAbs(a, b) {
		return new Vector2D(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 */
	Mult(a) {
		this.x = this.x * a.x;
		this.y = this.y * a.y;
	}

	/**
	 * 
	 * @param {number} f 
	 */
	MultF(f) {
		this.x *= f;
		this.y *= f;
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {Vector2D} b 
	 * @returns {Vector2D}
	 */
	static Mult(a, b) {
		return new Vector2D(a.x * b.x, a.y * b.y);
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {number} f
	 * @returns {Vector2D}
	 */
	static MultF(a, f) {
		return new Vector2D(a.x * f, a.y * f);
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 */
	Div(a) {
		this.x /= a.x;
		this.y /= a.y;
	}

	/**
	 * 
	 * @param {number} f 
	 */
	DivF(f) {
		this.x /= f;
		this.y /= f;
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {Vector2D} b 
	 * @returns {Vector2D}
	 */
	static Div(a, b) {
		return new Vector2D(a.x / b.x, a.y / b.y);
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {number} f 
	 * @returns {Vector2D}
	 */
	static DivX(a, f) {
		return new Vector2D(a.x / f, a.y / f);
	}

	/**
	 * 
	 * @param {Vector2D} vec 
	 * @param {number} f 
	 * @returns {Vector2D}
	 */
	static Min(vec, f) {
		return new Vector2D(vec.x < f ? f : vec.x, vec.y < f ? f : vec.y);
	}

	/**
	 * 
	 * @param {Vector2D} vec 
	 * @param {number} f 
	 * @returns {Vector2D}
	 */
	static Max(vec, f) {
		return new Vector2D(vec.x > f ? f : vec.x, vec.y > f ? f : vec.y);
	}

	Ceil() {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
	}

	SnapToGrid(x = 32, y = 32) {
		this.x = Math.floor(this.x / x) * x;
		this.y = Math.floor(this.y / y) * y;
	}

	Modulus(m) {
		return new Vector2D(this.x % m, this.y % m);
	}

	OneMinus() {
		this.x = this.x * -1;
		this.y = this.y * -1;
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

	/**
	 * 
	 * @param {Vector2D} a 
	 * @returns {boolean}
	 */
	Equal(a) {
		return this.x == a.x && this.y == a.y;
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {number} distance 
	 * @returns {boolean}
	 */
	NearlyEqual(a, distance = 0.001) {
		return this.Distance(a) <= distance;
	}

	/**
	 * 
	 * @param {number} x
	 * @param {number} y 
	 * @param {number} distance 
	 * @returns {boolean}
	 */
	NearlyEqualXY(x, y, distance = 0.001) {
		return this.DistanceXY(x, y) <= distance;
	}

	/**
	 * 
	 * @returns {Vector2D}
	 */
	Sqrt() {
		return new Vector2D(Math.sqrt(this.x), Math.sqrt(this.y));
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {Vector2D} b 
	 * @returns {number}
	 */
	static Dot(a, b) {
		return a.x * b.x + a.y * b.y;
	}

	/**
	 * 
	 * @param {Vector2D} v 
	 * @returns {Vector2D}
	 */
	Direction(v) {
		let d = new Vector2D(v.x - this.x, v.y - this.y);
		d.Normalize();
		d.OneMinus();
		return d;
	}

	/**
	 * 
	 * @param {Vector2D} v
	 * @returns {number} 
	 */
	Cross(v) {
		return this.x * v.y - this.y * v.x;
	}

	/**
	 * 
	 * @returns {number}
	 */
	Magnitude() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @returns {number}
	 */
	static Magnitude(a) {
		return Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));
	}

	/**
	 * 
	 * @returns {number}
	 */
	Length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	/**
	 * 
	 * @returns {number}
	 */
	LengthSquared() {
		return (this.x * this.x) + (this.y * this.y);
	}

	Normalize() {
		let v = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));

		this.x = this.x / v;
		this.y = this.y / v;
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @returns {Vector2D}
	 */
	static Normalize(a) {
		let v = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));
		return new Vector2D(a.x / v, a.y / v);
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @returns {number}
	 */
	Distance(a) {
		return Math.sqrt((a.x - this.x) * (a.x - this.x) + (a.y - this.y) * (a.y - this.y));
	}

	/**
	 * 
	 * @param {number} xa
	 * @param {number} ya
	 * @returns {number}
	 */
	DistanceXY(xa, ya) {
		return Math.sqrt((xa - this.x) * (xa - this.x) + (ya - this.y) * (ya - this.y));
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {Vector2D} b
	 * @returns {number}
	 */
	static Distance(a, b) {
		return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
	}

	/**
	 * 
	 * @param {Vector2D|{x:number, y:number}} a 
	 * @param {Vector2D|{x:number, y:number}} b
	 * @returns {number}
	 */
	static DistanceObject(a, b) {
		return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
	}

	/**
	 * 
	 * @param {number} ax 
	 * @param {number} ay 
	 * @param {number} bx 
	 * @param {number} by 
	 * @returns {number}
	 */
	static DistanceXY(ax, ay, bx, by) {
		return Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
	}

	/**
	 * 
	 * @param {Vector2D} v 
	 * @returns {number}
	 */
	DistanceTo(v) {
		return Math.sqrt(this.DistanceToSqrt(v));
	}

	/**
	 * 
	 * @param {Vector2D} v 
	 * @returns {number}
	 */
	DistanceToSqrt(v) {
		const dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {number} t 
	 * @returns {Vector2D}
	 */
	Lerp(a, t) {
		return new Vector2D(this.x + (a.x - this.x) * t, this.y + (a.y - this.y) * t);
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {number} v 
	 * @returns {Vector2D}
	 */
	LerpValue(a, v) {
		return this.Lerp(a, v / this.Distance(a));
	}

	/**
	 * 
	 * @param {Vector2D} checkPos 
	 * @param {number} range 
	 * @returns {boolean}
	 */
	CheckInRange(checkPos, range = 100.0) {
		return this.Distance(checkPos) < range;
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 */
	Set(a) {
		this.x = a.x;
		this.y = a.y;
	}

	/**
	 * 
	 * @param {number} f 
	 */
	SetF(f) {
		this.x = f;
		this.y = f;
	}

	/**
	 * Swaps x & y between this and a without using a temp variable
	 * @param {Vector2D} a 
	 */
	Swap(a) {
		if (this.x > a.x) {
			this.x += a.x;
			a.x = this.x - a.x;
			this.x = this.x - a.x;
		}
		if (this.y > a.y) {
			this.y += a.y;
			a.y = this.y - a.y;
			this.y = this.y - a.y;
		}
	}

	/**
	 * 
	 * @returns {Vector2D}
	 */
	Clone() {
		return new Vector2D(this.x, this.y);
	}

	/**
	 * 
	 * @param {number} precision 
	 * @returns {string}
	 */
	ToString(precision = 0) {
		return this.x.toFixed(precision) + ', ' + this.y.toFixed(precision);
	}

	ToVector() {
		return new Vector(this.x, this.y, 0);
	}

	/**
	 * 
	 * @param {Vector2D} center 
	 * @param {number} angle 
	 */
	Rotate(center, angle) {
		let rotatedPosition = CMath.Rotate(center, this, angle);
		this.x = rotatedPosition.x;
		this.y = rotatedPosition.y;
	}

	/**
	 * Returns a how to construct this object as a string
	 * @returns {string}
	 */
	SaveToFile() {
		return 'new Vector2D(' + this.x + ', ' + this.y + ')';
	}

	/**
	 * 
	 * @returns {{x:Number,y:Number}}
	 */
	toJSON() {
		return {
			x: this.x,
			y: this.y
		};
	}

	/**
	 * 
	 * @param {Array<{x:number, y:number}>} arr 
	 * @returns {Vector2D[]}
	 */
	static ObjectXYToVector2DArray(arr) {
		let vectorArr = [];

		for (let i = 0, l = arr.length; i < l; ++i) {
			vectorArr.push(new Vector2D(arr[i].x, arr[i].y));
		}

		return vectorArr;
	}

	/**
	 * 
	 * @param {(Vector2D[]|Array<{x:number, y:number}>)} arr 
	 */
	static FlattenVector2DArray(arr) {
		let flatArr = [];

		for (let i = 0, l = arr.length; i < l; ++i) {
			flatArr.push(arr[i].x);
			flatArr.push(arr[i].y);
		}

		return flatArr;
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
		/** @type {number} */ this.x = x;
		/** @type {number} */ this.y = y;
		/** @type {number} */ this.z = z;
	}

	/**
	 * 
	 * @param {Vector} a 
	 */
	Add(a) {
		this.x += a.x;
		this.y += a.y;
		this.z += a.z;
	}

	/**
	 * 
	 * @param {Vector2D} v2 
	 */
	AddV2(v2) {
		this.x += v2.x;
		this.y += v2.y;
	}

	/**
	 * 
	 * @param {Vector} a 
	 */
	Sub(a) {
		this.x -= a.x;
		this.y -= a.y;
		this.z -= a.z;
	}

	/**
	 * 
	 * @param {Vector} a 
	 */
	Mult(a) {
		this.x = this.x * a.x;
		this.y = this.y * a.y;
		this.z = this.z * a.z;
	}

	/**
	 * 
	 * @param {Vector} a 
	 */
	Div(a) {
		this.x /= a.x;
		this.y /= a.y;
		this.z /= a.z;
	}

	/**
	 * 
	 * @param {number} f 
	 */
	DivF(f) {
		this.x /= f;
		this.y /= f;
		this.z /= f;
	}

	/**
	 * 
	 * @param {Vector} v 
	 * @returns {number}
	 */
	Dot(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	/**
	 * 
	 * @param {Vector} b 
	 * @returns {Vector}
	 */
	Cross(b) {
		const ax = this.x, ay = this.y, az = this.z;
		const bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;
	}

	/**
	 * 
	 * @returns {number}
	 */
	Length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	/**
	 * 
	 * @param {Vector} v1 
	 * @param {Vector} v2 
	 * @param {Vector} normal 
	 * @param {boolean} clockwise 
	 * @returns {number}
	 */
	static AngleOffAroundAxis(v1, v2, normal, clockwise = true) {
		//doesn't work if all the values are coplanar so offset them all slightly to get a working angle
		var v1Off = v1.Clone();
		v1Off.Add(new Vector(0.001, -0.001, 0.001));
		var v2Off = v2.Clone();
		v2Off.Add(new Vector(-0.001, 0.001, -0.001));

		if (clockwise) {
			var right = v2Off.Clone();
			var forward = normal.Clone();
			right.Cross(normal);
			forward.Cross(right);
		} else {
			var right = normal.Clone();
			var forward = right.Clone();
			right.Cross(v2Off);
			forward.Cross(normal);
		}
		var x = Math.atan2(v1Off.Dot(right), v1Off.Dot(forward));

		return (x > 0 ? x : (2 * Math.PI + x)) * 360 / (2 * Math.PI);
	}

	/**
	 * 
	 * @param {Vector} a 
	 * @returns {boolean}
	 */
	Equal(a) {
		return this.x == a.x && this.y == a.y && this.z == a.z;
	}

	/**
	 * 
	 * @returns {Vector}
	 */
	Clone() {
		return new Vector(this.x, this.y, this.z);
	}

	/**
	 * 
	 * @returns {string}
	 */
	SaveToFile() {
		return 'new Vector(' + this.x + ', ' + this.y + ', ' + this.z + ')';
	}

	/**
	 * 
	 * @returns {{x:number, y:number, z:number}}
	 */
	toJSON() {
		return {
			x: this.x,
			y: this.y,
			z: this.z
		};
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
		/** @type {number} */ this.x = x;
		/** @type {number} */ this.y = y;
		/** @type {number} */ this.z = z;
		/** @type {number} */ this.a = a;
	}

	/**
	 * 
	 * @param {Vector4D} a 
	 */
	Add(a) {
		this.x += a.x;
		this.y += a.y;
		this.z += a.z;
		this.a += a.a;
	}

	/**
	 * 
	 * @param {number} a 
	 */
	AddF(a) {
		this.x += a;
		this.y += a;
		this.z += a;
		this.a += a;
	}

	/**
	 * 
	 * @param {Vector4D} a 
	 */
	Sub(a) {
		this.x -= a.x;
		this.y -= a.y;
		this.z -= a.z;
		this.a -= a.a;
	}

	/**
	 * 
	 * @param {number} a 
	 */
	SubF(a) {
		this.x -= a;
		this.y -= a;
		this.z -= a;
		this.a -= a;
	}

	/**
	 * 
	 * @param {Vector4D} a 
	 */
	Mult(a) {
		this.x = this.x * a.x;
		this.y = this.y * a.y;
		this.z = this.z * a.z;
		this.a = this.a * a.a;
	}

	/**
	 * 
	 * @param {Vector4D} a 
	 */
	Div(a) {
		this.x /= a.x;
		this.y /= a.y;
		this.z /= a.z;
		this.a /= a.a;
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 * @returns {boolean}
	 */
	Inside(position) {
		return position.x > this.x && position.x < this.x + this.z && position.y > this.y && position.y < this.y + this.a;
	}

	/**
	 * 
	 * @param {Vector4D} a 
	 * @returns {boolean}
	 */
	Equal(a) {
		return this.x == a.x && this.y == a.y && this.z == a.z && this.a == a.a;
	}

	/**
	 * 
	 * @returns {Vector2D}
	 */
	GetPosition() {
		return new Vector2D(this.x, this.y);
	}

	/**
	 * 
	 * @returns {Vector4D}
	 */
	Clone() {
		return new Vector4D(this.x, this.y, this.z, this.a);
	}

	/**
	 * 
	 * @returns {string}
	 */
	SaveToFile() {
		return 'new Vector4D(' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.a + ')';
	}

	/**
	 * 
	 * @returns {{x:number, y:number, z:number, a:number}}
	 */
	toJSON() {
		return {
			x: this.x,
			y: this.y,
			z: this.z,
			a: this.a
		};
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
				if (temp !== undefined && temp !== null && temp[keys[k]] !== undefined)
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

	/**
	 * 
	 * @returns {Array}
	 */
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
	 * Creates a new Rectangle
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} w 
	 * @param {number} h 
	 */
	constructor(x, y, w, h) {
		/** @type {number} */ this.x = x;
		/** @type {number} */ this.y = y;
		/** @type {number} */ this.w = w;
		/** @type {number} */ this.h = h;
		/** @type {Array<number[]>} */ this.corners = undefined;
	}

	/**
	 * 
	 * @param {Rectangle} a 
	 */
	Add(a) {
		this.x += a.x;
		this.y += a.y;
		this.w += a.w;
		this.h += a.h;

		this.UpdateCornersData();
	}

	/**
	 * 
	 * @param {number} f 
	 */
	AddF(f) {
		this.x += f;
		this.y += f;
		this.w += f;
		this.h += f;

		this.UpdateCornersData();
	}

	/**
	 * 
	 * @param {Rectangle} a 
	 * @param {Rectangle} b 
	 * @returns {Rectangle}
	 */
	static Add(a, b) {
		return new Rectangle(a.x + b.x, a.y + b.y, a.w + b.w, a.h + b.h);
	}

	/**
	 * 
	 * @param {Rectangle} a 
	 */
	Sub(a) {
		this.x -= a.x;
		this.y -= a.y;
		this.w -= a.w;
		this.h -= a.h;

		this.UpdateCornersData();
	}

	/**
	 * 
	 * @param {number} f 
	 */
	SubF(f) {
		this.x -= f;
		this.y -= f;
		this.w -= f;
		this.h -= f;

		this.UpdateCornersData();
	}

	/**
	 * 
	 * @param {Rectangle} a 
	 * @param {Rectangle} b 
	 * @returns {Rectangle}
	 */
	static Sub(a, b) {
		return new Rectangle(a.x - b.x, a.y - b.y, a.w - b.w, a.h - b.h);
	}

	/**
	 * 
	 * @param {Rectangle} a 
	 */
	Mult(a) {
		this.x = this.x * a.x;
		this.y = this.y * a.y;
		this.w = this.w * a.w;
		this.h = this.h * a.h;

		this.UpdateCornersData();
	}

	/**
	 * 
	 * @param {Rectangle} a 
	 */
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

	/**
	 * 
	 * @param {number} f 
	 */
	ExpandF(f) {
		this.x -= f;
		this.y -= f;
		this.w += f * 2;
		this.h += f * 2;
	}

	/**
	 * 
	 * @param {number} aX 
	 * @param {number} aY 
	 * @param {number} bX 
	 * @param {number} bY 
	 * @returns {Rectangle}
	 */
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

	/**
	 * 
	 * @param {Vector2D} position 
	 * @returns {boolean}
	 */
	Inside(position) {
		return position.x >= this.x && position.x <= this.x + this.w && position.y >= this.y && position.y <= this.y + this.h;
	}

	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 * @returns {boolean}
	 */
	InsideXY(x, y) {
		return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
	}

	/**
	 * 
	 * @param {Rectangle} rect 
	 * @returns {boolean}
	 */
	IsRectInside(rect) {
		return this.x < rect.x && this.y < rect.y && this.x + this.w > rect.x + rect.w && this.y + this.h > rect.y + rect.h;
	}

	/**
	 * 
	 * @param {Rectangle} rect 
	 * @returns {boolean}
	 */
	IsRectOverlappingOrInside(rect) {
		this.UpdateCornersData();
		rect.UpdateCornersData();
		return this.InsideXY(rect.corners[0][0], rect.corners[0][1]) || this.InsideXY(rect.corners[1][0], rect.corners[1][1]) || this.InsideXY(rect.corners[2][0], rect.corners[2][1]) || this.InsideXY(rect.corners[3][0], rect.corners[3][1]) || rect.InsideXY(this.corners[0][0], this.corners[0][1]) || rect.InsideXY(this.corners[1][0], this.corners[1][1]) || rect.InsideXY(this.corners[2][0], this.corners[2][1]) || rect.InsideXY(this.corners[3][0], this.corners[3][1]);
	}

	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} w 
	 * @param {number} h 
	 * @returns {boolean}
	 */
	IsRectOverlappingOrInsideF(x, y, w, h) {
		return this.InsideXY(x, y) || this.InsideXY(x + w, y) || this.InsideXY(x + w, y + h) || this.InsideXY(x, y + h);
		//return this.x <= x || this.y <= y || this.x + this.w >= x + w || this.y + this.h >= y + h;
	}

	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} w 
	 * @param {number} h 
	 * @returns {boolean}
	 */
	IsCornerOverlappingOrInside(x, y, w, h) {
		return this.InsideXY(x, y) || this.InsideXY(x + w, y) || this.InsideXY(x, y + h) || this.InsideXY(x + w, y + h);
	}

	/**
	 * 
	 * @param {Rectangle} rect 
	 * @returns {boolean}
	 */
	IsRectOutside(rect) {
		return this.x > rect.x && this.y > rect.y && this.x + this.w < rect.x + rect.w && this.y + this.h < rect.y + rect.h;
	}

	static InsideRectTest() {
		let a = new Rectangle(563, 11, 64, 64);
		let b = new Rectangle(586, 59, 16, 16);
		let trueValue = a.IsRectOverlappingOrInside(b);
		let trueValue1 = a.IsRectOverlappingOrInsideF(b.x, b.y, b.w, b.h);
		let falseValue = b.IsRectOverlappingOrInside(a);
		console.log(trueValue, trueValue1, falseValue);

		trueValue = b.IsRectOutside(a);
		falseValue = a.IsRectOutside(b);
		console.log(trueValue, falseValue);
	}

	/**
	 * 
	 * @param {Rectangle} rect 
	 * @returns {boolean}
	 */
	Outside(rect) {
		return !(this.x < rect.x && this.y < rect.y && this.x + this.w > rect.x + rect.w && this.y + this.h > rect.y + rect.h);
	}

	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 * @returns {boolean}
	 */
	OutsideXY(x, y) {
		return x <= this.x || x >= this.x + this.w && y <= this.y || y >= this.y + this.h;
	}

	/**
	 * 
	 * @private
	 * @param {number} aMin 
	 * @param {number} aMax 
	 * @param {number} bMin 
	 * @param {number} bMax 
	 * @returns {boolean}
	 */
	IsOverlaping1D(aMin, aMax, bMin, bMax) {
		return aMax > bMin && bMax > aMin;
	}

	/**
	 * 
	 * @param {Rectangle} a 
	 * @returns {boolean}
	 */
	Overlaps(a) {
		return this.IsOverlaping1D(
			this.x - Rectangle.OVERLAP_RANGE,
			(this.x - Rectangle.OVERLAP_RANGE) + (this.w + Rectangle.OVERLAP_RANGE),
			a.x - Rectangle.OVERLAP_RANGE,
			(a.x - Rectangle.OVERLAP_RANGE) + (a.w + Rectangle.OVERLAP_RANGE)
		) && this.IsOverlaping1D(
			this.y - Rectangle.OVERLAP_RANGE,
			(this.y - Rectangle.OVERLAP_RANGE) + (this.h + Rectangle.OVERLAP_RANGE),
			a.y - Rectangle.OVERLAP_RANGE,
			(a.y - Rectangle.OVERLAP_RANGE) + (a.h + Rectangle.OVERLAP_RANGE)
		);
	}

	/**
	 * 
	 * @param {boolean} forceUpdate 
	 */
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

	/**
	 * 
	 * @returns {Array<Number[]>}
	 */
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

	/**
	 * 
	 * @returns {Vector2D[]}
	 */
	GetCornersVector2D() {
		return [
			new Vector2D(this.x, this.y),
			new Vector2D(this.x + this.w, this.y),
			new Vector2D(this.x + this.w, this.y + this.h),
			new Vector2D(this.x, this.y + this.h)
		];
	}

	/**
	 * 
	 * @returns {Vector2D}
	 */
	GetCenterPoint() {
		return new Vector2D(this.x + this.w * 0.5, this.y + this.h * 0.5);
	}

	/**
	 * 
	 * @param {Rectangle} a 
	 * @returns {Array<Number[]>}
	 */
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

	/**
	 * 
	 * @param {Rectangle} a 
	 * @returns {Array<Number[]>}
	 */
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

	/**
	 * 
	 * @param {Rectangle} a 
	 * @param {Array<Number[]>} arr
	 */
	GetOverlappingCornersPassBy(a, arr) {
		if (this.InsideXY(a.x, a.y))
			arr.push([a.x, a.y]);
		if (this.InsideXY(a.x + a.w, a.y))
			arr.push([a.x + a.w, a.y]);
		if (this.InsideXY(a.x, a.y + a.h))
			arr.push([a.x, a.y + a.h]);
		if (this.InsideXY(a.x + a.w, a.y + a.h))
			arr.push([a.x + a.w, a.y + a.h]);
	}

	/**
	 * 
	 * @param {Rectangle} a 
	 * @returns {Rectangle}
	 */
	GetIntersection(a) {
		let insideCorners = [];
		this.GetOverlappingCornersPassBy(a, insideCorners);

		if (insideCorners.length === 0)
			a.GetOverlappingCornersPassBy(this, insideCorners);

		if (insideCorners.length === 1) {
			let insideCornersA = [];
			a.GetOverlappingCornersPassBy(this, insideCornersA);

			if (insideCornersA.length === 1) {
				let minX = Math.min(insideCorners[0][0], insideCornersA[0][0]),
					minY = Math.min(insideCorners[0][1], insideCornersA[0][1]),
					maxX = Math.max(insideCorners[0][0], insideCornersA[0][0]),
					maxY = Math.max(insideCorners[0][1], insideCornersA[0][1]);

				return new Rectangle(minX, minY, Math.abs(maxX - minX), Math.abs(maxY - minY));
				//return new Rectangle(Math.min(insideCorners[0][0], insideCornersA[0][0]), Math.min(insideCorners[0][1], insideCornersA[0][1]), Math.abs(insideCorners[0][0] - insideCornersA[0][0]), Math.abs(insideCorners[0][1] - insideCornersA[0][1]));
			}

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

	/**
	 * 
	 * @param {number} times 
	 * @param {Rectangle} rect
	 * @returns {Rectangle[]}
	 */
	static Split(times, rect) {
		let splitRectangles = [rect],
			tempSplit = [],
			boundsW = -1,
			boundsH = -1,
			x = -1,
			xl = -1;

		for (let i = 0, l = times; i < l; ++i) {
			tempSplit = [];

			for (x = 0, xl = splitRectangles.length; x < xl; ++x) {
				boundsW = splitRectangles[x].w * 0.5;
				boundsH = splitRectangles[x].h * 0.5;

				tempSplit.push(
					new Rectangle(splitRectangles[x].x, splitRectangles[x].y, boundsW, boundsH),
					new Rectangle(splitRectangles[x].x + boundsW, splitRectangles[x].y, boundsW, boundsH),
					new Rectangle(splitRectangles[x].x, splitRectangles[x].y + boundsH, boundsW, boundsH),
					new Rectangle(splitRectangles[x].x + boundsW, splitRectangles[x].y + boundsH, boundsW, boundsH)
				);
			}

			splitRectangles = tempSplit;
		}

		return splitRectangles;
	}

	/**
	 * 
	 * @param {Rectangle} a 
	 */
	Set(a) {
		this.x = a.x;
		this.y = a.y;
		this.w = a.w;
		this.h = a.h;
	}

	/**
	 * 
	 * @param {Rectangle} a 
	 * @returns {boolean}
	 */
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

	/**
	 * 
	 * @returns {Rectangle}
	 */
	Clone() {
		return new Rectangle(this.x, this.y, this.w, this.h);
	}

	/**
	 * 
	 * @param {Rectangle} rect 
	 */
	Copy(rect) {
		this.x = rect.x;
		this.y = rect.y;
		this.w = rect.w;
		this.h = rect.h;
	}

	/**
	 * 
	 * @returns {string}
	 */
	ToString() {
		return this.x + ', ' + this.y + ', ' + this.w + ', ' + this.h;
	}

	/**
	 * Returns a how to construct this object as a string
	 * @returns {string}
	 */
	SaveToFile() {
		return 'new Rectangle(' + this.x + ', ' + this.y + ', ' + this.w + ', ' + this.h + ')';
	}

	/**
	 * 
	 * @returns {{x:Number, y:Number, w:Number, h:Number, c:string}}
	 */
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
		/** @type {number} */ this.x = x;
		/** @type {number} */ this.y = y;
		/** @type {number} */ this.forward = angle;
	}
}

/**
 * @class
 * @constructor
 */
class Intersection {

	/**
	 * 
	 * @param {Vertex} s1
	 * @param {Vertex} s2
	 * @param {Vertex} c1
	 * @param {Vertex} c2
	 */
	constructor(s1, s2, c1, c2) {
		/** @type {number} */ this.x = 0.0;
		/** @type {number} */ this.y = 0.0;
		/** @type {number} */ this.toSource = 0.0;
		/** @type {number} */ this.toClip = 0.0;

		const d = ((c2.y - c1.y) * (s2.x - s1.x)) - ((c2.x - c1.x) * (s2.y - s1.y));
		//const d = ((s2.x - s1.x) * (c2.y - c1.y) - (s2.y - s1.y) * (c2.x - c1.x));

		if (d !== 0) {
		/** @type {number} */ this.toSource = ((c2.x - c1.x) * (s1.y - c1.y) - (c2.y - c1.y) * (s1.x - c1.x)) / d;
		/** @type {number} */ this.toClip = ((s2.x - s1.x) * (s1.y - c1.y) - (s2.y - s1.y) * (s1.x - c1.x)) / d;
			///** @type {number} */ this.toSource = ((c1.x - s1.x) * (c2.y - c1.y) - (c1.y - s1.y) * (c2.x - c1.x)) / d;
			///** @type {number} */ this.toClip = ((s2.y - s1.y) * (c1.x - s1.x) - (s2.x - s1.x) * (c1.y - s1.y)) / d;

			if (this.Valid()) {
				this.x = s1.x + this.toSource * (s2.x - s1.x);
				this.y = s1.y + this.toSource * (s2.y - s1.y);
			}
		}
	}

	/**
	 * 
	 * @param {Vector2D} s1
	 * @param {Vector2D} s2
	 * @param {Vector2D} c1
	 * @param {Vector2D} c2
	 */
	static LineIntersectionVector2D(s1, s2, c1, c2) {
		const d = ((c2.y - c1.y) * (s2.x - s1.x)) - ((c2.x - c1.x) * (s2.y - s1.y));

		if (d === 0)
			return false;

		const toSource = ((c2.x - c1.x) * (s1.y - c1.y) - (c2.y - c1.y) * (s1.x - c1.x)) / d,
			toClip = ((s2.x - s1.x) * (s1.y - c1.y) - (s2.y - s1.y) * (s1.x - c1.x)) / d;

		return (0 < toSource && toSource < 1) && (0 < toClip && toClip < 1);
	}

	/**
	 * 
	 * @param {Line} a 
	 * @param {Line} b 
	 */
	static LineIntersectionLine(a, b) {
		const s1 = a.a, s2 = a.b, c1 = b.a, c2 = b.b;

		const d = ((c2.y - c1.y) * (s2.x - s1.x)) - ((c2.x - c1.x) * (s2.y - s1.y));

		if (d === 0)
			return false;

		const toSource = ((c2.x - c1.x) * (s1.y - c1.y) - (c2.y - c1.y) * (s1.x - c1.x)) / d,
			toClip = ((s2.x - s1.x) * (s1.y - c1.y) - (s2.y - s1.y) * (s1.x - c1.x)) / d;

		return (0 < toSource && toSource < 1) && (0 < toClip && toClip < 1);
	}

	/**
	 * 
	 * @param {Vertex} s1
	 * @param {Vertex} s2
	 * @param {Vertex} c1
	 * @param {Vertex} c2
	 */
	Update(s1, s2, c1, c2) {
		this.x = 0.0;
		this.y = 0.0;
		this.toSource = 0.0;
		this.toClip = 0.0;

		const d = ((c2.y - c1.y) * (s2.x - s1.x)) - ((c2.x - c1.x) * (s2.y - s1.y));
		//const d = ((s2.x - s1.x) * (c2.y - c1.y) - (s2.y - s1.y) * (c2.x - c1.x));

		if (d !== 0) {
			this.toSource = ((c2.x - c1.x) * (s1.y - c1.y) - (c2.y - c1.y) * (s1.x - c1.x)) / d;
			this.toClip = ((s2.x - s1.x) * (s1.y - c1.y) - (s2.y - s1.y) * (s1.x - c1.x)) / d;
			///** @type {number} */ this.toSource = ((c1.x - s1.x) * (c2.y - c1.y) - (c1.y - s1.y) * (c2.x - c1.x)) / d;
			///** @type {number} */ this.toClip = ((s2.y - s1.y) * (c1.x - s1.x) - (s2.x - s1.x) * (c1.y - s1.y)) / d;

			if (this.Valid()) {
				this.x = s1.x + this.toSource * (s2.x - s1.x);
				this.y = s1.y + this.toSource * (s2.y - s1.y);
			}
		}
	}

	/**
	 * 
	 * @returns {boolean}
	 */
	Valid() {
		return (0 < this.toSource && this.toSource < 1) && (0 < this.toClip && this.toClip < 1);
	}
}

/**
 * @class
 * @constructor
 */
class Vertex {

	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 */
	constructor(x, y) {
		/** @type {number} */ this.x = x;
		/** @type {number} */ this.y = y;
		/** @type {Vertex} */ this.next = undefined;
		/** @type {Vertex} */ this.prev = undefined;
		/** @type {Vertex} */ this.corresponding = undefined;
		/** @type {number} */ this.distance = 0.0;
		/** @type {boolean} */ this.isEntry = true;
		/** @type {boolean} */ this.isIntersection = false;
		/** @type {boolean} */ this.visited = false;
	}

	/**
	 * 
	 * @param {Vertex} v 
	 * @returns {boolean}
	 */
	Equals(v) {
		return this.x === v.x && this.y === v.y;
	}

	/**
	 * 
	 * @param {DLPolygon} poly 
	 * @returns {boolean}
	 */
	IsInside(poly) {
		let oddNodes = false,
			vertex = poly.first,
			next = vertex.next;

		const x = this.x;
		const y = this.y;

		do {
			if ((vertex.y < y && next.y >= y || next.y < y && vertex.y >= y) && (vertex.x <= x || next.x <= x)) {
				//@ts-ignore
				oddNodes ^= (vertex.x + (y - vertex.y) / (next.y - vertex.y) * (next.x - vertex.x) < x);
			}

			vertex = vertex.next;
			next = vertex.next || poly.first;
		} while (!vertex.Equals(poly.first));

		return oddNodes;
	}

	Visit() {
		this.visited = true;
		if (this.corresponding !== undefined && !this.corresponding.visited) {
			this.corresponding.Visit();
		}
	}

	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} distance 
	 * @returns {Vertex}
	 */
	static CreateIntersection(x, y, distance) {
		const vertex = new Vertex(x, y);
		vertex.distance = distance;
		vertex.isIntersection = true;
		vertex.isEntry = false;
		return vertex;
	}
}

/**
 * @readonly
 * @enum {number}
 */
const PolygonClippingResults = {
	None: -1,
	PolygonClipped: 0,
	ClipInPolygon: 1,
	PolygonInClip: 2,
}

/**
 * @class
 * @constructor
 */
class DLPolygon {

	/**
	 * 
	 * @param {(Vertex[]|Vector2D[]|Array<{x:number, y:number}>)} points
	 * @param {boolean} arrayVertices
	 */
	constructor(points, arrayVertices = undefined) {
		/** @type {Vertex} */ this.first = undefined;
		/** @type {number} */ this.vertices = 0;
		/** @type {Vertex} */ this.lastUnprocessed = undefined;
		/** @type {Vertex} */ this.firstIntersect = undefined;
		/** @type {boolean} */ this.arrayObjectOrVertex = arrayVertices;
		/** @type {PolygonClippingResults} */ this.clipState = PolygonClippingResults.None;

		if (arrayVertices === undefined && points !== undefined && points.length > 0)
			this.arrayObjectOrVertex = points[0] instanceof Vertex ? true : Array.isArray(points[0]);

		for (let i = 0, len = points.length; i < len; i++) {
			this.AddVertex(new Vertex(points[i].x, points[i].y));
		}
	}

	/**
	 * 
	 * @private
	 * @param {Vertex} vertex 
	 */
	AddVertex(vertex) {
		if (this.first === undefined) {
			this.first = vertex;
			this.first.next = vertex;
			this.first.prev = vertex;
		} else {
			const next = this.first;
			const prev = next.prev;

			next.prev = vertex;
			vertex.next = next;
			vertex.prev = prev;
			prev.next = vertex;
		}
		this.vertices++;
	}

	/**
	 * 
	 * @private
	 * @param {Vertex} vertex 
	 * @param {Vertex} start 
	 * @param {Vertex} end 
	 */
	InsertVertex(vertex, start, end) {
		let prev, curr = start;

		while (!curr.Equals(end) && curr.distance < vertex.distance) {
			curr = curr.next;
		}

		vertex.next = curr;
		prev = curr.prev;

		vertex.prev = prev;
		prev.next = vertex;
		curr.prev = vertex;

		this.vertices++;
	}

	/**
	 * 
	 * @private
	 * @param {Vertex} v 
	 * @returns {Vertex}
	 */
	Next(v) {
		let c = v;
		while (c.isIntersection)
			c = c.next;
		return c;
	}

	/**
	 * 
	 * @returns {Vertex}
	 */
	GetLast() {
		let points = this.Vertices();
		return points[points.length - 1];
	}

	/**
	 * 
	 * @param {Vertex} v 
	 * @returns {Vertex}
	 */
	GetClosest(v) {
		let points = this.Vertices(),
			closest = undefined,
			d = 999999999;

		for (let i = 0, l = points.length; i < l; ++i) {
			if (Vector2D.DistanceObject(v, points[i]) < d) {
				d = Vector2D.DistanceObject(v, points[i]);
				closest = points[i];
			}
		}

		return closest;
	}

	/**
	 * 
	 * @private
	 * @returns {Vertex}
	 */
	FirstIntersect() {
		let v = this.firstIntersect || this.first;

		do {
			if (v.isIntersection && !v.visited)
				break;

			v = v.next;
		} while (!v.Equals(this.first));

		this.firstIntersect = v;
		return v;
	}

	/**
	 * 
	 * @returns {Vertex[]}
	 */
	Vertices() {
		const points = [];
		let v = this.first;

		if (this.arrayObjectOrVertex) {
			do {
				points.push(v);
				v = v.next;
			} while (v !== this.first);
		} else {
			do {
				points.push(v);
				v = v.next;
			} while (v !== this.first);
		}

		return points;
	}

	/**
	 * 
	 * @public
	 * @returns {Array<{x:number, y:number}>}
	 */
	Points() {
		const points = [];
		let v = this.first;

		if (this.arrayObjectOrVertex) {
			do {
				points.push({ x: v.x, y: v.y });
				v = v.next;
			} while (v !== undefined && v !== this.first);
		} else {
			do {
				if (v !== undefined) {
					points.push({
						x: v.x,
						y: v.y
					});
					v = v.next;
				}
			} while (v !== undefined && v !== this.first);
		}

		return points;
	}

	/**
	 * 
	 * @public
	 * @returns {Array<number>}
	 */
	GetFlatArray() {
		const points = [];
		let v = this.first;

		if (this.arrayObjectOrVertex) {
			do {
				points.push(v.x);
				points.push(v.y);
				v = v.next;
			} while (v !== this.first);
		} else {
			do {
				points.push(v.x);
				points.push(v.y);
				v = v.next;
			} while (v !== this.first);
		}

		return points;
	}

	/**
	 * 
	 * @private
	 * @returns {boolean}
	 */
	HasUnprocessed() {
		let v = this.lastUnprocessed || this.first;
		do {
			if (v.isIntersection && !v.visited) {
				this.lastUnprocessed = v;
				return true;
			}

			v = v.next;
		} while (!v.Equals(this.first));

		this.lastUnprocessed = undefined;
		return false;
	}

	/**
	 * 
	 * @public
	 * @param {DLPolygon} clip 
	 * @returns {Array<Array<{x:number, y:number}>>}
	 */
	Union(clip) {
		return this.Clip(clip, false, false);
	}

	/**
	 * 
	 * @public
	 * @param {DLPolygon} clip 
	 * @returns {Array<Array<{x:number, y:number}>>}
	 */
	Intersection(clip) {
		return this.Clip(clip, true, true);
	}

	/**
	 * 
	 * @public
	 * @param {DLPolygon} clip 
	 * @returns {Array<Array<{x:number, y:number}>>}
	 */
	Difference(clip) {
		return this.Clip(clip, false, true);
	}

	/**
	 * 
	 * @private
	 * @param {DLPolygon} clip 
	 * @param {boolean} sourceForwards 
	 * @param {boolean} clipForwards 
	 * @returns {Array<Array<{x:number, y:number}>>}
	 */
	Clip(clip, sourceForwards, clipForwards) {
		this.clipState = PolygonClippingResults.None;

		let sourceVertex = this.first;
		let clipVertex = clip.first;
		let sourceInClip, clipInSource;

		const isUnion = !sourceForwards && !clipForwards;
		const isIntersection = sourceForwards && clipForwards;
		//const isDiff = !isUnion && !isIntersection;
		/** @type {Intersection} */ let i = undefined;

		// calculate and mark intersections
		do {
			if (!sourceVertex.isIntersection) {
				do {
					if (!clipVertex.isIntersection) {
						if (i !== undefined)
							i.Update(sourceVertex, this.Next(sourceVertex.next), clipVertex, clip.Next(clipVertex.next));
						else
							i = new Intersection(sourceVertex, this.Next(sourceVertex.next), clipVertex, clip.Next(clipVertex.next));

						if (i.Valid()) {
							const sourceIntersection = Vertex.CreateIntersection(i.x, i.y, i.toSource);
							const clipIntersection = Vertex.CreateIntersection(i.x, i.y, i.toClip);

							sourceIntersection.corresponding = clipIntersection;
							clipIntersection.corresponding = sourceIntersection;

							this.InsertVertex(sourceIntersection, sourceVertex, this.Next(sourceVertex.next));
							clip.InsertVertex(clipIntersection, clipVertex, clip.Next(clipVertex.next));
						}
					}
					clipVertex = clipVertex.next;
				} while (!clipVertex.Equals(clip.first));
			}

			sourceVertex = sourceVertex.next;
		} while (!sourceVertex.Equals(this.first));

		// phase two - identify entry/exit points
		sourceVertex = this.first;
		clipVertex = clip.first;

		sourceInClip = sourceVertex.IsInside(clip);
		clipInSource = clipVertex.IsInside(this);

		//@ts-ignore
		sourceForwards ^= sourceInClip;
		//@ts-ignore
		clipForwards ^= clipInSource;

		do {
			if (sourceVertex.isIntersection) {
				sourceVertex.isEntry = sourceForwards;
				sourceForwards = !sourceForwards;
			}
			sourceVertex = sourceVertex.next;
		} while (!sourceVertex.Equals(this.first));

		do {
			if (clipVertex.isIntersection) {
				clipVertex.isEntry = clipForwards;
				clipForwards = !clipForwards;
			}
			clipVertex = clipVertex.next;
		} while (!clipVertex.Equals(clip.first));

		// phase three - construct a list of clipped polygons
		/** @type {Array<Array<{x:number, y:number}>>} */ let list = [];
		while (this.HasUnprocessed()) {
			let current = this.FirstIntersect();
			const clipped = new DLPolygon([], this.arrayObjectOrVertex);

			clipped.AddVertex(new Vertex(current.x, current.y));
			do {
				current.Visit();
				if (current.isEntry) {
					do {
						current = current.next;
						clipped.AddVertex(new Vertex(current.x, current.y));
					} while (!current.isIntersection);

				} else {
					do {
						current = current.prev;
						clipped.AddVertex(new Vertex(current.x, current.y));
					} while (!current.isIntersection);
				}
				current = current.corresponding;
			} while (!current.visited);

			list.push(clipped.Points());
		}

		if (list.length === 0) {
			if (isUnion) {
				if (sourceInClip) {
					list.push(clip.Points());
					this.clipState = PolygonClippingResults.PolygonInClip;
				} else if (clipInSource) {
					list.push(this.Points());
					this.clipState = PolygonClippingResults.ClipInPolygon;
				} else {
					list.push(this.Points());
					list.push(clip.Points());
					this.clipState = PolygonClippingResults.None;
				}
			} else if (isIntersection) { // intersection
				if (sourceInClip) {
					list.push(this.Points());
					this.clipState = PolygonClippingResults.PolygonInClip;
				} else if (clipInSource) {
					list.push(clip.Points());
					this.clipState = PolygonClippingResults.ClipInPolygon;
				}
			} else { // diff
				if (sourceInClip) {
					list.push(clip.Points());
					list.push(this.Points());
					this.clipState = PolygonClippingResults.PolygonInClip;
				}
				else if (clipInSource) {
					list.push(this.Points());
					list.push(clip.Points());
					this.clipState = PolygonClippingResults.ClipInPolygon;
				}
				else {
					list.push(this.Points());
					this.clipState = PolygonClippingResults.None;
				}
			}

			if (list.length === 0) {
				list = undefined;
				this.clipState = PolygonClippingResults.None;
			}
		} else {
			this.clipState = PolygonClippingResults.PolygonClipped;
		}

		return list;
	}

	/**
	 * 
	 * @param {number[]} array 
	 * @param {number[]} indices 
	 * @returns {Array<{x:number, y:number}>}
	 */
	PolygonFromFlatArray(array, indices) {
		let arr = [];

		for (let i = 0, l = indices.length; i < l; ++i) {
			let index = indices[i] * 2;
			arr.push({ x: array[index], y: array[index + 1] });
		}

		return arr;
	}

	* iterator() {
		let s = this.first;

		while (true) {
			yield s;
			s = s.next;

			if (s == this.first)
				return;
		}
	}

	[Symbol.iterator]() {
		return this.iterator();
	}
}

/**
 * @class
 * @constructor
 */
class Line {

	/**
	 * 
	 * @param {(Vector2D|Vertice)} a 
	 * @param {(Vector2D|Vertice)} b 
	 * @param {OpenClosed} openClosed
	 */
	constructor(a, b, openClosed = OpenClosed.Open) {
		/** @type {Vector2D} */ this.a = undefined;
		/** @type {Vector2D} */ this.b = undefined;
		if (a instanceof Vector2D && b instanceof Vector2D) {
			if (a.y < b.y) {
				this.a = a;
				this.b = b;
			} else {
				this.a = b;
				this.b = a;
			}
		} else if (a instanceof Vertice && b instanceof Vertice) {
			if (a.y < b.y) {
				this.a = new Vector2D(a.x, a.y);
				this.b = new Vector2D(b.x, b.y);;
			} else {
				this.a = new Vector2D(b.x, b.y);;
				this.b = new Vector2D(a.x, a.y);
			}
		}

		/** @type {OpenClosed} */ this.openClosed = openClosed;
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {Vector2D} b 
	 */
	Set(a, b) {
		if (a.y < b.y) {
			this.a = a;
			this.b = b;
		} else {
			this.a = b;
			this.b = a;
		}
	}

	/**
	 * Sets the line from ax ay and bx by
	 * @param {number} ax 
	 * @param {number} ay 
	 * @param {number} bx 
	 * @param {number} by 
	 */
	SetXY(ax, ay, bx, by) {
		if (ay < by) {
			this.a = new Vector2D(ax, ay);
			this.b = new Vector2D(bx, by);
		} else {
			this.a = new Vector2D(bx, by);
			this.b = new Vector2D(ax, ay);
		}
	}

	/**
	 * 
	 * @returns {Vector2D}
	 */
	Delta() {
		return Vector2D.Sub(this.b, this.a);
	}

	/**
	 * Gets the line centroid
	 * @returns {Vector2D}
	 */
	GetCentroid() {
		return this.PointAt(0.5);
	}

	/**
	 * 
	 * @param {number} t 
	 * @returns {Vector2D}
	 */
	PointAt(t) {
		const a = this.Delta();
		a.MultF(t);
		a.Add(this.a);
		return a;
	}

	/**
	 * 
	 * @param {number} t 
	 * @param {Line} l
	 * @returns {Vector2D}
	 */
	static PointAt(t, l) {
		const a = l.Delta();
		a.MultF(t);
		a.Add(l.a);
		return a;
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {Vector2D} b 
	 * @returns {number}
	 */
	LineSlope(a, b) {
		let x = Math.abs(a.y - b.y);
		let y = Math.abs(a.x - b.x)
		return x === 0 && y === 0 ? 0 : x / y;
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {Vector2D} b 
	 * @returns {number}
	 */
	LineIntercept(a, b) {
		let slope = this.LineSlope(a, b);
		return a.y - slope * a.x;
	}

	/**
	 * 
	 * @param {number} distance 
	 * @returns {Vector2D}
	 */
	PointAlongLineAtDistance(distance) {
		let slope = this.LineSlope(this.a, this.b);
		let vA = this.a.x > this.b.x ? this.b : this.a;
		let vB = this.a.x > this.b.x ? this.a : this.b;
		let point = { x: Math.abs(vA.x - vB.x), y: Math.abs(vA.y - vB.y) };
		let y = slope * (distance - point.x) + point.y;
		return new Vector2D(distance + vA.x, y + vA.y);
	}

	/**
	 * 
	 * @param {Line} line
	 * @param {number} distance 
	 * @returns {Vector2D}
	 */
	static PointAlongLineAtDistance(line, distance) {
		let slope = line.LineSlope(line.a, line.b);
		let vA = line.a.x > line.b.x ? line.b : line.a;
		let vB = line.a.x > line.b.x ? line.a : line.b;
		let point = { x: Math.abs(vA.x - vB.x), y: Math.abs(vA.y - vB.y) };
		let y = slope * (distance - point.x) + point.y;
		return new Vector2D(distance + vA.x, y + vA.y);
	}

	/**
	 * 
	 * @param {Vector2D} v
	 * @returns {boolean} 
	 */
	Inside(v) {
		if (this.a.NearlyEqualXY(v.x, v.y) === true || this.b.NearlyEqualXY(v.x, v.y) === true || this.a.NearlyEqualXY(this.b.x, this.b.y) === true)
			return false;

		const abX = this.b.x - this.a.x,
			abY = this.b.y - this.a.y;

		const pointF = ((v.x - this.a.x) * abX + (v.y - this.a.y) * abY) / ((abX * abX) + (abY * abY));

		if (pointF < 0 || pointF > 1)
			return false;

		return v.NearlyEqualXY(this.a.x + (abX * pointF), this.a.y + (abY * pointF), 0.0000001);
	}

	/**
	 * 
	 * @param {Line} line
	 * @param {Vector2D} v
	 * @returns {boolean} 
	 */
	static Inside(line, v) {
		let closestPoint = Line.ClosestPointAlongLine(line.a, line.b, v);

		if (closestPoint === undefined)
			return false;

		return v.NearlyEqual(closestPoint);
	}

	/**
	 * 
	 * @param {Line} line
	 * @returns {boolean} 
	 */
	LineContainsLine(line) {
		let bA = false, bB = false;

		//if (line.a.NearlyEqual(line.b) || this.a.NearlyEqual(this.b) || this.Equal(line) === true)
		//return false;

		if (this.a.NearlyEqual(line.a)) {
			bA = true;

			if (this.b.NearlyEqual(line.b))
				bB = true;
			else if (this.Inside(line.b))
				bB = true;
		} else if (this.b.NearlyEqual(line.a)) {
			bA = true;

			if (this.a.NearlyEqual(line.b))
				bB = true;
			else if (this.Inside(line.b))
				bB = true;
		} else if (this.Inside(line.a)) {
			bA = true;

			if (this.a.NearlyEqual(line.b))
				bB = true;
			else if (this.b.NearlyEqual(line.b))
				bB = true;
			else if (this.Inside(line.b))
				bB = true;
		}

		return bA === true && bB === true;
	}

	/**
	 * 
	 * @param {Line} a 
	 * @param {Line} b
	 * @returns {boolean} 
	 */
	static LineContainsLine(a, b) {
		let bA = false, bB = false;

		if (a.a.NearlyEqual(b.a) || a.b.NearlyEqual(b.a) || a.Inside(b.a))
			bA = true;

		if (a.a.NearlyEqual(b.b) || a.b.NearlyEqual(b.b) || a.Inside(b.b))
			bB = true;

		return bA && bB;
	}

	/**
	 * Returns the closest point along the line clamped to the line
	 * @param {number} positionX
	 * @param {number} positionY
	 * @returns {Vector2D}
	 */
	ClosestPointAlongLineClamped(positionX, positionY) {
		let abX = Math.abs(this.b.x - this.a.x),
			abY = Math.abs(this.b.y - this.a.y),
			pointF = Math.min(Math.max((Math.abs(positionX - this.a.x) * abX + Math.abs(positionY - this.a.y) * abY) / ((abX * abX) + (abY * abY)), 0), 1);

		return new Vector2D(this.a.x + (abX * pointF), this.a.y + (abY * pointF));
	}

	/**
	 * Returns closest point along the line or undefined if greater or less
	 * @param {Vector2D} a 
	 * @param {Vector2D} b 
	 * @param {Vector2D} position 
	 * @returns {Vector2D}
	 */
	static ClosestPointAlongLine(a, b, position) {
		let abX = b.x - a.x,
			abY = b.y - a.y;

		let pointF = ((position.x - a.x) * abX + (position.y - a.y) * abY) / ((abX * abX) + (abY * abY));

		if (pointF < 0 || pointF > 1)
			return undefined;

		return new Vector2D(a.x + (abX * pointF), a.y + (abY * pointF));
	}

	/**
	 * Returns the closest point along the line clamped to the line a
	 * @param {Vector2D} a 
	 * @param {Vector2D} b 
	 * @param {Vector2D} position 
	 * @returns {Vector2D}
	 */
	static ClosestPointAlongLineClamped(a, b, position) {
		let abX = Math.abs(b.x - a.x),
			abY = Math.abs(b.y - a.y);

		let pointF = Math.min(Math.max((Math.abs(position.x - a.x) * abX + Math.abs(position.y - a.y) * abY) / ((abX * abX) + (abY * abY)), 0), 1);
		return new Vector2D(a.x + (abX * pointF), a.y + (abY * pointF));

		/*
		let ap = Vector2D.Sub(position, a),
			ab = Vector2D.Sub(b, a);

		ap.Abs();
		ab.Abs();

		let magnitudeAB = ab.LengthSquared();
		let abAPDot = Vector2D.Dot(ap, ab);
		let distance = CMath.Clamp(abAPDot / magnitudeAB, 0, 1);

		if (distance < 0)
			return a
		else if (distance > 1)
			return b;
		else
		return Vector2D.Add(a, Vector2D.MultF(ab, distance));
		*/
	}

	/**
	 * 
	 * @param {Line} line 
	 */
	Equal(line) {
		return (this.a.NearlyEqual(line.a) && this.b.NearlyEqual(line.b)) || (this.b.NearlyEqual(line.a) && this.a.NearlyEqual(line.b))
	}
}

/**
 * @class
 * @constructor
 */
class Polygon {

	/**
	 * 
	 * @param {Vector2D[]} points 
	 */
	constructor(points) {
		/** @type {Vector2D[]} */ this.points = points;
		/** @type {Rectangle} */ this.boundingBox = undefined;
	}

	/**
	 * 
	 * @returns {Array<{x:number, y:number}>}
	 */
	ToObject() {
		let arr = [];

		for (let i = 0, l = this.points.length; i < l; ++i) {
			arr.push({ x: this.points[i].x, y: this.points[i].y });
		}
		return arr;
	}

	/**
	 * 
	 * @returns {Array<number>}
	 */
	Flatten() {
		let arr = [];

		for (let i = 0, l = this.points.length; i < l; ++i) {
			arr.push(this.points[i].x);
			arr.push(this.points[i].y);
		}
		return arr;
	}

	/**
	 * 
	 */
	CalculateBoundingBox() {
		let sX = 9999999999, sY = 9999999999, lX = -9999999999, lY = -9999999999;

		for (let i = 0, l = this.points.length; i < l; ++i) {
			if (this.points[i].x > lX)
				lX = this.points[i].x;
			if (this.points[i].x < sX)
				sX = this.points[i].x;
			if (this.points[i].y > lY)
				lY = this.points[i].y;
			if (this.points[i].y < sY)
				sY = this.points[i].y;
		}
		this.boundingBox = new Rectangle(sX, sY, lX - sX, lY - sY);
	}

	/**
	 * 
	 * @param {Array<{x:number, y:number}>} points 
	 * @returns {Polygon}
	 */
	static FromObject(points) {
		let poly = new Polygon([]);

		for (let i = 0, l = points.length; i < l; ++i) {
			poly.points.push(new Vector2D(points[i].x, points[i].y));
		}

		return poly;
	}

	/**
	 * 
	 * @param {Vector2D[]} points 
	 * @returns {Rectangle}
	 */
	static CalculateBoundingBox(points) {
		let sX = 9999999999, sY = 9999999999, lX = -9999999999, lY = -9999999999;

		for (let i = 0, l = points.length; i < l; ++i) {
			if (points[i].x > lX)
				lX = points[i].x;
			if (points[i].x < sX)
				sX = points[i].x;
			if (points[i].y > lY)
				lY = points[i].y;
			if (points[i].y < sY)
				sY = points[i].y;
		}
		return new Rectangle(sX, sY, lX - sX, lY - sY);
	}

	/**
	 * 
	 * @param {Vector2D[]} contour 
	 * @param {Array<Vector2D[]>} holes 
	 * @returns {number[]}
	 */
	static TriangulateShape(contour, holes) {
		/** @type {number[]} */ const vertices = []; // flat array of vertices like [ x0,y0, x1,y1, x2,y2, ... ]
		/** @type {number[]} */ const holeIndices = []; // array of hole indices
		/** @type {number[]} */ const faces = []; // final array of vertex indices like [ [ a,b,d ], [ b,c,d ] ]

		Polygon.RemoveDupEndPts(contour);
		Polygon.AddContour(vertices, contour);

		if (holes.length > 0) {
			let holeIndex = contour.length;
			for (let i = 0, l = holes.length; i < l; ++i) {
				Polygon.RemoveDupEndPts(holes[i]);
			}

			for (let i = 0; i < holes.length; i++) {
				holeIndices.push(holeIndex);
				holeIndex += holes[i].length;
				Polygon.AddContour(vertices, holes[i]);
			}
		}

		const triangles = earcut(vertices, holeIndices);

		for (let i = 0; i < triangles.length; i += 3) {
			faces.push(...triangles.slice(i, i + 3));
		}

		return faces;
	}

	/**
	 * 
	 * @private
	 * @param {Array<*>} points 
	 */
	static RemoveDupEndPts(points) {
		const l = points.length;

		if (l > 2 && points[l - 1].Equal(points[0])) {
			points.pop();
		}
	}

	/**
	 * 
	 * @private
	 * @param {number[]} vertices 
	 * @param {Vector2D[]} contour 
	 */
	static AddContour(vertices, contour) {
		for (let i = 0; i < contour.length; i++) {
			vertices.push(contour[i].x);
			vertices.push(contour[i].y);
		}
	}
}

/**
 * @class
 * @constructor
 */
class Vertice {

	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} i
	 */
	constructor(x, y, i) {
		/** @type {number} */ this.x = x;
		/** @type {number} */ this.y = y;
		/** @type {number} */ this.indice = i;
		/** @type {boolean} */ this.open = true;
	}

	/**
	 * 
	 * @returns {Vector2D}
	 */
	ToVector2D() {
		return new Vector2D(this.x, this.y);
	}

	/**
	 * 
	 * @param {Vector2D} v 
	 * @returns {Vertice}
	 */
	static FromVector2D(v) {
		return new Vertice(v.x, v.y, -1);
	}

	/**
	 * 
	 * @returns {Vertice}
	 */
	Clone() {
		return new Vertice(this.x, this.y, this.indice);
	}

	/**
	 * 
	 * @param {number} precision 
	 * @returns {string}
	 */
	ToString(precision = 0) {
		return this.x.toFixed(precision) + ', ' + this.y.toFixed(precision);
	}

	/**
	 * 
	 * @param {Vertice} a 
	 * @param {(0|1|2|3|4|5|6|7|8|9)} precision
	 * @returns {boolean}
	 */
	Equal(a, precision = 9) {
		return this.x.toFixed(precision) == a.x.toFixed(precision) && this.y.toFixed(precision) == a.y.toFixed(precision);
	}
}

/**
 * @class
 * @constructor
 */
class Triangle {

	/**
	 * 
	 * @param {Vertice} x 
	 * @param {Vertice} y 
	 * @param {Vertice} z 
	 */
	constructor(x, y, z) {
		/** @type {Vertice} */ this.x = x;
		/** @type {Vertice} */ this.y = y;
		/** @type {Vertice} */ this.z = z;
		/** @type {Line} */ this.xy = new Line(this.x, this.y);
		/** @type {Line} */ this.yz = new Line(this.y, this.z);
		/** @type {Line} */ this.zx = new Line(this.z, this.x);
		/** @type {Vector2D} */ this.centroid = this.GetCenter();
	}

	CheckHoles() {
		let count = 0;

		if (this.x.open === false && this.y.open === false && this.xy.openClosed === OpenClosed.Open) {
			this.xy.openClosed = OpenClosed.Closed;
			DebugDrawer.AddPolygon(new Polygon([this.xy.a, this.xy.b]), 0.016, 'teal', true, 1.0);
		}

		if (this.y.open === false && this.z.open === false && this.yz.openClosed === OpenClosed.Open) {
			this.yz.openClosed = OpenClosed.Closed;
			DebugDrawer.AddPolygon(new Polygon([this.yz.a, this.yz.b]), 0.016, 'magenta', true, 1.0);
		}

		if (this.z.open === false && this.x.open === false && this.zx.openClosed === OpenClosed.Open) {
			this.zx.openClosed = OpenClosed.Closed;
			DebugDrawer.AddPolygon(new Polygon([this.zx.a, this.zx.b]), 0.016, 'yellow', true, 1.0);
		}

		if (this.x.open === false)
			count++;

		if (this.y.open === false)
			count++;

		if (this.z.open === false)
			count++;

		if (count < 2) {
			this.x.open = this.y.open = this.z.open = true;
		}
		this.x.open = this.y.open = this.z.open = true;
	}

	/**
	 * 
	 * @returns {boolean}
	 */
	HasHoles() {
		let count = 0;
		if (this.x.open === false)
			count++;

		if (this.y.open === false)
			count++;

		if (this.z.open === false)
			count++;

		return count > 1;
	}

	/**
	 * Returns the area of the triangle
	 * @returns {number}
	 */
	GetArea() {
		let v0 = Vector2D.Sub(this.z.ToVector2D(), this.y.ToVector2D()).ToVector();
		let v1 = Vector2D.Sub(this.x.ToVector2D(), this.y.ToVector2D()).ToVector();

		return v0.Cross(v1).Length() * 0.5;
	}

	/**
	 * 
	 * @returns {Vector2D[]}
	 */
	GetMidpoints() {
		/** @type {Vector2D[]} */ let midpoints = [];
		midpoints.push(Line.PointAt(0.5, new Line(this.x.ToVector2D(), this.y.ToVector2D())));
		midpoints.push(Line.PointAt(0.5, new Line(this.y.ToVector2D(), this.z.ToVector2D())));
		midpoints.push(Line.PointAt(0.5, new Line(this.z.ToVector2D(), this.x.ToVector2D())));

		return midpoints;
	}

	/**
	 * 
	 * @param {Vector2D} position
	 * @returns {Line} 
	 */
	GetClosestLine(position) {
		let d = 99999999999999,
			closestLine = undefined;

		if (this.xy.openClosed === OpenClosed.Open && this.xy.GetCentroid().Distance(position) < d) {
			d = this.xy.GetCentroid().Distance(position);
			closestLine = this.xy;
		}

		if (this.yz.openClosed === OpenClosed.Open && this.yz.GetCentroid().Distance(position) < d) {
			d = this.yz.GetCentroid().Distance(position);
			closestLine = this.yz;
		}

		if (this.zx.openClosed === OpenClosed.Open && this.zx.GetCentroid().Distance(position) < d) {
			d = this.zx.GetCentroid().Distance(position);
			closestLine = this.zx;
		}

		return closestLine;
	}

	/**
	 * Gets the centroid of the triangle
	 * @returns {Vector2D}
	 */
	GetCenter() {
		return new Vector2D((this.x.x + this.y.x + this.z.x) / 3, (this.x.y + this.y.y + this.z.y) / 3);
	}

	/**
	 * 
	 * @returns {number[]}
	 */
	Flatten() {
		return [this.x.x, this.x.y, this.y.x, this.y.y, this.z.x, this.z.y];
	}

	/**
	 * 
	 * @param {number} a 
	 * @param {number} b 
	 * @param {number} c 
	 * @param {number} length 
	 * @returns {number}
	 */
	static FindCornerFromVertexIndex(a, b, c, length) {
		if ((CMath.Mod((a - 1), length) === b || CMath.Mod((a - 1), length) === c) && (CMath.Mod((a + 1), length) === b || CMath.Mod((a + 1), length) === c)) return a;
		if ((CMath.Mod((b - 1), length) === a || CMath.Mod((b - 1), length) === c) && (CMath.Mod((b + 1), length) === a || CMath.Mod((b + 1), length) === c)) return b;
		if ((CMath.Mod((c - 1), length) === a || CMath.Mod((c - 1), length) === b) && (CMath.Mod((c + 1), length) === a || CMath.Mod((c + 1), length) === b)) return c;

		return undefined;
	}

	/**
	 * 
	 * @param {Vector2D} v 
	 * @returns {boolean}
	 */
	PointInTriangle(v) {
		return (this.z.x - v.x) * (this.x.y - v.y) - (this.x.x - v.x) * (this.z.y - v.y) >= 0 &&
			(this.x.x - v.x) * (this.y.y - v.y) - (this.y.x - v.x) * (this.x.y - v.y) >= 0 &&
			(this.y.x - v.x) * (this.z.y - v.y) - (this.z.x - v.x) * (this.y.y - v.y) >= 0;
	}

	/**
	 * 
	 * @param {Vector2D} v 
	 * @returns {boolean}
	 */
	PointInTriangleV2(v) {
		const s = (this.x.x - this.z.x) * (v.y - this.z.y) - (this.x.y - this.z.y) * (v.x - this.z.x);
		const t = (this.y.x - this.x.x) * (v.y - this.x.y) - (this.y.y - this.x.y) * (v.x - this.x.x);

		if ((s < 0) !== (t < 0) && s !== 0 && t !== 0)
			return false;

		const d = (this.z.x - this.y.x) * (v.y - this.y.y) - (this.z.y - this.y.y) * (v.x - this.y.x);
		return d == 0 || (d < 0) === (s + t <= 0);
	}

	/**
	 * 
	 * @param {Triangle} tri
	 * @param {Vector2D} v 
	 * @returns {boolean}
	 */
	static PointInTriangle(tri, v) {
		return (tri.z.x - v.x) * (tri.x.y - v.y) - (tri.x.x - v.x) * (tri.z.y - v.y) >= 0 &&
			(tri.x.x - v.x) * (tri.y.y - v.y) - (tri.y.x - v.x) * (tri.x.y - v.y) >= 0 &&
			(tri.y.x - v.x) * (tri.z.y - v.y) - (tri.z.x - v.x) * (tri.y.y - v.y) >= 0;
	}

	/**
	 * 
	 * @returns {Triangle}
	 */
	Clone() {
		return new Triangle(this.x.Clone(), this.y.Clone(), this.z.Clone());
	}

	*[Symbol.iterator]() {
		yield this.x;
		yield this.y;
		yield this.z;
	}
}

/**
 * @class
 * @constructor
 */
class Mesh {

	/**
	 * 
	 * @param {Triangle[]} triangles 
	 * @param {number[]} indices
	 * @param {Vector2D[]} vertices
	 * @param {Array<Vector2D[]>} holes
	 */
	constructor(triangles, indices, vertices = undefined, holes = undefined) {
		/** @type {Triangle[]} */ this.triangles = triangles;
		/** @type {Rectangle} */ this.boundingBox = undefined;
		/** @type {number[]} */ this.indices = indices;
		/** @type {Vector2D[]} */ this.vertices = vertices;
		/** @type {Array<Vector2D[]>} */ this.holes = holes;

		this.CalculateBoundingBox();
		this.FindHoleVertices();
	}

	FindHoleVertices() {
		if (this.holes !== undefined) {
			let tempLine = new Line(new Vector2D(0, 0), new Vector2D(0, 0));
			for (let i = 0, l = this.holes.length; i < l; ++i) {
				for (let y = 0, yl = this.triangles.length; y < yl; ++y) {
					for (let x = 0, x2 = this.holes[i].length - 1, xl = this.holes[i].length; x < xl; ++x) {
						tempLine.Set(this.holes[i][x2], this.holes[i][x]);
						//const tempLine = new Line(this.holes[i][x2], this.holes[i][x]);

						if (this.triangles[y].xy.LineContainsLine(tempLine) === true || tempLine.LineContainsLine(this.triangles[y].xy) === true) {
							this.triangles[y].xy.openClosed = OpenClosed.Closed;
							//DebugDrawer.AddPolygon(new Polygon([this.triangles[y].xy.a, this.triangles[y].xy.b]), 0.016, 'teal', true, 1.0);
						}

						if (this.triangles[y].yz.LineContainsLine(tempLine) === true || tempLine.LineContainsLine(this.triangles[y].yz) === true) {
							this.triangles[y].yz.openClosed = OpenClosed.Closed;
							//DebugDrawer.AddPolygon(new Polygon([this.triangles[y].yz.a, this.triangles[y].yz.b]), 0.016, 'magenta', true, 1.0);
						}

						if (this.triangles[y].zx.LineContainsLine(tempLine) === true || tempLine.LineContainsLine(this.triangles[y].zx) === true) {
							this.triangles[y].zx.openClosed = OpenClosed.Closed;
							//DebugDrawer.AddPolygon(new Polygon([this.triangles[y].zx.a, this.triangles[y].zx.b]), 0.016, 'yellow', true, 1.0);
						}
						x2 = x;
					}
				}
			}
		}

		///** @type {Object.<string, Vector2D>} */ let holesLUT = {};

		/*if (this.holes !== undefined) {
			for (let i = 0, l = this.holes.length; i < l; ++i) {
				holesLUT = {};
				for (let x = 0, xl = this.holes[i].length; x < xl; ++x) {
					holesLUT[this.holes[i][x].ToString()] = this.holes[i][x];
				}

				for (let y = 0, yl = this.triangles.length; y < yl; ++y) {
					if (holesLUT[this.triangles[y].x.ToString()] !== undefined) {
						this.triangles[y].x.open = false;
					}
					if (holesLUT[this.triangles[y].y.ToString()] !== undefined) {
						this.triangles[y].y.open = false;
					}
					if (holesLUT[this.triangles[y].z.ToString()] !== undefined) {
						this.triangles[y].z.open = false;
					}
	
					this.triangles[y].CheckHoles();
				}
			}
		}*/
	}

	/**
	 * 
	 * @param {Triangle} a 
	 * @returns {Triangle[]}
	 */
	FindNeighbouringTriangles(a) {
		/** @type {Triangle[]} */ let neighbours = [];

		for (let i = 0, l = this.triangles.length; i < l; ++i) {
			if (this.triangles[i] === a)
				continue;

			if (
				a.x.Equal(this.triangles[i].x, 1) ||
				a.x.Equal(this.triangles[i].y, 1) ||
				a.x.Equal(this.triangles[i].z, 1)
			) {
				neighbours.push(this.triangles[i]);
				continue;
			}

			if (
				a.y.Equal(this.triangles[i].x, 1) ||
				a.y.Equal(this.triangles[i].y, 1) ||
				a.y.Equal(this.triangles[i].z, 1)
			) {
				neighbours.push(this.triangles[i]);
				continue;
			}

			if (
				a.z.Equal(this.triangles[i].x, 1) ||
				a.z.Equal(this.triangles[i].y, 1) ||
				a.z.Equal(this.triangles[i].z, 1)
			) {
				neighbours.push(this.triangles[i]);
				continue;
			}
		}

		return neighbours;
	}

	/**
	 * 
	 * @param {Triangle} a 
	 * @returns {Triangle[]}
	 */
	FindNeighbouringTrianglesNew(a) {
		/** @type {Triangle[]} */ let neighbours = [],
			count = 0;

		for (let i = 0, l = this.triangles.length; i < l; ++i) {
			if (this.triangles[i] === a)
				continue;

			count = 0;
			let hasHoles = this.triangles[i].HasHoles();

			if (
				a.x.Equal(this.triangles[i].x, 1) ||
				a.y.Equal(this.triangles[i].x, 1) ||
				a.z.Equal(this.triangles[i].x, 1)
			) {
				if (this.triangles[i].x.open === true) {
					if (hasHoles === false) {
						neighbours.push(this.triangles[i]);
						continue;
					} else
						count++;
				} else
					count++;
			}

			if (
				a.x.Equal(this.triangles[i].y, 1) ||
				a.y.Equal(this.triangles[i].y, 1) ||
				a.z.Equal(this.triangles[i].y, 1)
			) {
				if (this.triangles[i].y.open === true) {
					if (hasHoles === false) {
						neighbours.push(this.triangles[i]);
						continue;
					} else
						count++;
				} else
					count++;
			}

			if (
				a.x.Equal(this.triangles[i].z, 1) ||
				a.y.Equal(this.triangles[i].z, 1) ||
				a.z.Equal(this.triangles[i].z, 1)
			) {
				if (this.triangles[i].z.open === true) {
					if (hasHoles === false) {
						neighbours.push(this.triangles[i]);
						continue;
					} else
						count++;
				} else
					count++;
			}

			if (count > 1) {
				neighbours.push(this.triangles[i]);
			}
		}

		return neighbours;
	}

	/**
	 * 
	 * @param {Vector2D} v
	 * @returns {boolean} 
	 */
	PointInMesh(v) {
		for (let i = 0, l = this.triangles.length; i < l; ++i) {
			if (this.triangles[i].PointInTriangle(v))
				return true;
		}

		return false;
	}

	/**
	 * 
	 * @param {Vector2D} position
	 * @returns {Triangle} 
	 */
	GetTriangle(position) {
		for (let t = 0, tl = this.triangles.length; t < tl; ++t) {
			if (this.triangles[t].PointInTriangle(position) === true) {
				return this.triangles[t];
			}
		}

		return undefined;
	}

	/**
	 * 
	 */
	CalculateBoundingBox() {
		let sX = 9999999999, sY = 9999999999, lX = -9999999999, lY = -9999999999;

		for (let i = 0, l = this.triangles.length; i < l; ++i) {
			const positions = [this.triangles[i].x, this.triangles[i].y, this.triangles[i].z];
			for (let x = 0, xl = positions.length; x < xl; ++x) {
				if (positions[x].x > lX)
					lX = positions[x].x;
				if (positions[x].x < sX)
					sX = positions[x].x;
				if (positions[x].y > lY)
					lY = positions[x].y;
				if (positions[x].y < sY)
					sY = positions[x].y;
			}
		}
		this.boundingBox = new Rectangle(sX, sY, lX - sX, lY - sY);
	}

	/**
	 * 
	 * @returns {Vector2D[]}
	 */
	FlattenToVector2D() {
		/*let vectors = [];

		for (let i = 0, l = this.triangles.length; i < l; ++i) {
			for (let pos of this.triangles[i]) {
				vectors.push(pos.ToVector2D());
			}
		}*/

		return this.vertices;// vectors;
	}

	/**
	 * 
	 * @param {number[]} vertices 
	 * @param {number[]} indices 
	 * @param {Array<Vector2D[]>} holes
	 */
	static FromVerticesIndices(vertices, indices, holes = undefined) {
		let triangles = [],
			vectors = [];

		for (let i = 0, l = indices.length; i < l; i += 3) {
			vectors.push(new Vector2D(vertices[indices[i] * 2], vertices[indices[i] * 2 + 1]));
			triangles.push(new Triangle(
				new Vertice(vertices[indices[i] * 2], vertices[indices[i] * 2 + 1], indices[i]),
				new Vertice(vertices[indices[i + 1] * 2], vertices[indices[i + 1] * 2 + 1], indices[i + 1]),
				new Vertice(vertices[indices[i + 2] * 2], vertices[indices[i + 2] * 2 + 1], indices[i + 2])
			));
		}

		return new Mesh(triangles, indices, vectors, holes);
	}

	/**
	 * 
	 * @param {Vector2D[]} vertices 
	 * @param {number[]} indices 
	 * @param {Array<Vector2D[]>} holes
	 */
	static FromVector2DIndices(vertices, indices, holes = undefined) {
		let triangles = [];

		for (let i = 0, l = indices.length; i < l; i += 3) {
			if (vertices[indices[i]] !== undefined && vertices[indices[i + 1]] !== undefined && vertices[indices[i + 2]] !== undefined) {
				triangles.push(new Triangle(
					new Vertice(vertices[indices[i]].x, vertices[indices[i]].y, indices[i]),
					new Vertice(vertices[indices[i + 1]].x, vertices[indices[i + 1]].y, indices[i + 1]),
					new Vertice(vertices[indices[i + 2]].x, vertices[indices[i + 2]].y, indices[i + 2])
				));
			}
		}

		return new Mesh(triangles, indices, vertices, holes);
	}

	/**
	 * Returns the mesh in the obj format as a string
	 * @returns {string}
	 */
	ToObj() {
		let vertices = '',
			faces = '';

		for (let i = 0, l = this.vertices.length; i < l; ++i) {
			vertices += 'v ' + this.vertices[i].x + ' ' + this.vertices[i].y + ' 0.0\r\n';
		}

		for (let i = 0, l = this.triangles.length; i < l; ++i) {
			faces += 'f '
			for (let pos of this.triangles[i]) {
				faces += (pos.indice + 1) + ' ';
			}
			faces += '\r\n';
		}

		return vertices + '\r\n' + 'g Plane001\r\n' + faces;
	}
}

/**
 * @class
 * @constructor
 */
class Color {

	/**
	 * Creates a new color
	 * @param {number} red 
	 * @param {number} green 
	 * @param {number} blue 
	 * @param {number} alpha 
	 */
	constructor(red = 255, green = 255, blue = 255, alpha = 1) {
		if (alpha > 1.0)
			/** @type {number} */ this.alpha = alpha; //CMath.MapRange(alpha, 0, 255, 0, 1);
		else
			/** @type {number} */ this.alpha = alpha;

		/** @type {number} */ this.red = red;
		/** @type {number} */ this.green = green;
		/** @type {number} */ this.blue = blue;
	}

	/** @type {string[]} */ static CSS_COLOR_NAMES = [
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

	/** @readonly */ static CSS_COLOR_TABLE = {
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

	static RandomColorInt = 0;
	static RandomColorRGBA() {
		Color.RandomColorInt = CMath.RandomInt(0, Color.CSS_COLOR_NAMES.length - 1);
		return Color.CSS_COLOR_TABLE[Color.CSS_COLOR_NAMES[Color.RandomColorInt].toLowerCase()];
	}

	static ColorToRGBA(color) {
		if (color !== undefined && color instanceof Color)
			return color;

		if (Color.CSS_COLOR_TABLE[color.toLowerCase()] !== undefined) {
			let rgbaColor = Color.CSS_COLOR_TABLE[color.toLowerCase()],
				splitColors = rgbaColor.slice(rgbaColor.indexOf('(') + 1, rgbaColor.indexOf(')'));

			let splitArrColors = splitColors.split(',');
			return new Color(parseFloat(splitArrColors[0]), parseFloat(splitArrColors[1]), parseFloat(splitArrColors[2]), parseFloat(splitArrColors[3]));
		} else if (color.startsWith('rgb')) {
			let rgbaColor = color,
				splitColors = rgbaColor.slice(rgbaColor.indexOf('(') + 1, rgbaColor.indexOf(')'));

			const splitColorsArr = splitColors.split(',');
			return new Color(parseFloat(splitColorsArr[0]), parseFloat(splitColorsArr[1]), parseFloat(splitColorsArr[2]), parseFloat(splitColorsArr[3]));
		} else
			return new Color(0, 0, 0, 0);
	}

	AlphaMultiply() {
		this.red *= this.alpha / 255;
		this.green *= this.alpha / 255;
		this.blue *= this.alpha / 255;
	}

	/**
	 * 
	 * @param {Color} a 
	 */
	Add(a) {
		this.red += a.red;
		this.green += a.green;
		this.blue += a.blue;
	}

	/**
	 * 
	 * @param {Color} a 
	 */
	AddAlpha(a) {
		let aA = a.alpha / 255;

		this.red = (a.red * aA) + (this.red * (1 - aA));
		this.green = (a.green * aA) + (this.green * (1 - aA));
		this.blue = (a.blue * aA) + (this.blue * (1 - aA));
	}

	/**
	 * 
	 * @param {Color} a 
	 */
	Sub(a) {
		this.red -= a.red;
		this.green -= a.green;
		this.blue -= a.blue;
	}

	/**
	 * 
	 * @param {Color} a 
	 */
	Mult(a) {
		this.red *= a.red;
		this.green *= a.green;
		this.blue *= a.blue;
	}

	/**
	 * 
	 * @param {Color} a 
	 */
	MultAlpha(a) {
		let tA = this.alpha / 255;

		this.red = (this.red * tA) * (a.red * (1 - tA));
		this.green = (this.green * tA) * (a.green * (1 - tA));
		this.blue = (this.blue * tA) * (a.blue * (1 - tA));
	}

	/**
	 * 
	 * @param {number} float 
	 */
	MultF(float) {
		this.red *= float;
		this.green *= float;
		this.blue *= float;
	}

	/**
	 * 
	 * @param {Color} color 
	 * @param {Color} a 
	 * @returns {Color}
	 */
	static Mult(color, a) {
		let newColor = new Color(color.red, color.green, color.blue, color.alpha);
		newColor.red *= Number.isNaN(a.red) === false ? a.red : 1;
		newColor.green *= Number.isNaN(a.green) === false ? a.green : 1;
		newColor.blue *= Number.isNaN(a.blue) === false ? a.blue : 1;

		return newColor;
	}

	/**
	 * 
	 * @param {Color} color 
	 * @param {number} float 
	 * @returns {Color}
	 */
	static MultF(color, float) {
		let newColor = new Color(color.red, color.green, color.blue, color.alpha);
		newColor.red *= Number.isNaN(float) === false ? float : 1;
		newColor.green *= Number.isNaN(float) === false ? float : 1;
		newColor.blue *= Number.isNaN(float) === false ? float : 1;

		return newColor;
	}

	/**
	 * 
	 * @param {Color} c 
	 * @param {number} r 
	 * @returns {Color}
	 */
	static Darken(c, r) {
		return new Color(c.red * (1.0 - r), c.green * (1.0 - r), c.blue * (1.0 - r), c.alpha);
	}

	/**
	 * 
	 * @param {Color} c 
	 * @param {number} r 
	 * @returns {Color}
	 */
	static Lighten(c, r) {
		return new Color(c.red * (1.0 + r), c.green * (1.0 + r), c.blue * (1.0 + r), c.alpha);
	}

	/**
	 * 
	 * @param {Color} c1 
	 * @param {Color} c2 
	 * @param {number} r 
	 * @returns {Color}
	 */
	static Interpolate(c1, c2, r) {
		return new Color(c1.red + (c2.red - c1.red) * r, c1.green + (c2.green - c1.green) * r, c1.blue + (c2.blue - c1.blue) * r, c1.alpha + (c2.alpha - c1.alpha) * r);
	}

	/**
	 * 
	 * @param {Color} c 
	 * @returns {Color}
	 */
	static Complementary(c) {
		return new Color(255 - c.red, 255 - c.green, 255 - c.blue, c.alpha);
	}

	ToGrayscale() {
		this.red = this.green = this.blue = this.red + this.green + this.blue / 3;
	}

	/**
	 * 
	 * @param {Color} color 
	 */
	Set(color) {
		this.red = color.red;
		this.green = color.green;
		this.blue = color.blue;
		this.alpha = color.alpha;
	}

	/**
	 * 
	 * @param {Color} b 
	 * @returns {boolean}
	 */
	Equal(b) {
		return this.red === b.red && this.green === b.green && this.blue === b.blue;
	}

	/**
	 * Clamps and rounds the values from 0-255
	 */
	ToInt() {
		this.red = Math.min(Math.max(Math.round(this.red), 0), 255);
		this.green = Math.min(Math.max(Math.round(this.green), 0), 255);
		this.blue = Math.min(Math.max(Math.round(this.blue), 0), 255);
		this.alpha = Math.min(Math.max(Math.round(this.alpha), 0), 1);
	}

	/**
	 * 
	 * @returns {Color}
	 */
	Clone() {
		return new Color(this.red, this.green, this.blue, this.alpha);
	}

	/** @todo Very expensive, needs to be cached for future use */
	ToString() {
		return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
	}

	/**
	 * Returns a how to construct this object as a string
	 * @returns {string}
	 */
	SaveToFile() {
		return 'new Color(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')';
	}

	/**
	 * 
	 * @returns {{red:Number, green:Number, blue:Number, alpha:Number}}
	 */
	toJSON() {
		return {
			red: this.red,
			green: this.green,
			blue: this.blue,
			alpha: this.alpha,
		};
	}

	*[Symbol.iterator]() {
		yield this.red;
		yield this.green;
		yield this.blue;
		yield this.alpha;
	}
}

export { Vector2D, Vector, Vector4D, Matrix, Rectangle, Direction, Intersection, Vertex, DLPolygon, Line, Vertice, Triangle, Polygon, Mesh, Color, PolygonClippingResults };