import { Vector2D, Line } from '../../internal.js';


/**
 * @memberof Number
 */
Object.defineProperty(Number.prototype, 'mapRange', {
	value(in_min, in_max, out_min, out_max) {
		return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	}
});

/*Number.prototype.mapRange = function (in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}*/


/**
 * @class
 */
class CMath {

	/**
	 * @static
	 * @param {Number} min 
	 * @param {Number} max 
	 * @returns {Number}
	 */
	static RandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
	}

	/**
	 * @static
	 * @param {Number} value 
	 * @param {Number} in_min 
	 * @param {Number} in_max 
	 * @param {Number} out_min 
	 * @param {Number} out_max 
	 * @returns {Number}
	 */
	static MapRange(value, in_min, in_max, out_min, out_max) {
		return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	}

	/**
	 * @static
	 * @param {Number} degrees 
	 * @returns {Number}
	 */
	static DegreesToRadians(degrees) {
		return degrees * (Math.PI / 180);
	}

	/**
	 * @static
	 * @param {Number} min 
	 * @param {Number} max 
	 * @returns {Number}
	 */
	static RandomFloat(min, max) {
		return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
	}

	/**
	 * @static
	 * @param {Number} value 
	 * @param {Number} min 
	 * @param {Number} max 
	 * @returns {Number}
	 */
	static Clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	static Rotate(center, position, angle) {
		var radians = (Math.PI / 180) * angle,
			cos = Math.cos(radians),
			sin = Math.sin(radians),
			nx = (cos * (position.x - center.x)) + (sin * (position.y - center.y)) + center.x,
			ny = (cos * (position.y - center.y)) - (sin * (position.x - center.x)) + center.y;
		return new Vector2D(nx, ny);
	}

	/**
	 * @deprecated
	 */
	static _LookAt2D(a, b) {
		return (Math.atan2(b.y - a.y, b.x - a.y) * (180 / Math.PI)) + 180;
	}

	static LookAt2D(a, b) {
		let dx = a.x - b.x;
		let dy = a.y - b.y;
		return Math.atan2(dy, dx) * 180 / Math.PI + 180;
	}

	static LineSlope(a, b) {
		let x = Math.abs(a.y - b.y);
		let y = Math.abs(a.x - b.x)
		return x === 0 && y === 0 ? 0 : x / y;
	}

	static LineIntercept(a, b) {
		let slope = CMath.LineSlope(a, b);
		return a.y - slope * a.x;
	}

	static PointAlongLineAtDistance(a, b, distance) {
		let slope = CMath.LineSlope(a, b);
		let vA = a.x > b.x ? b : a;
		let vB = a.x > b.x ? a : b;
		let point = { x: Math.abs(vA.x - vB.x), y: Math.abs(vA.y - vB.y) };
		let y = slope * (distance - point.x) + point.y;
		return new Vector2D(distance + vA.x, y + vA.y);
	}

	/**
	 * 
	 * @param {Vector2D[]} points 
	 * @param {Vector2D} position 
	 */
	static ClosestPointOnPolygon(points, position) {
		if (points.length < 2)
			return null;

		let line = new Line(points[0], points[1]),
			lineTest = new Line(),
			tDist = 999999999999999,
			distance = position.Distance(line.ClosestPointAlongLine(position.x, position.y));

		for (let i = 1, l = points.length; i < l; ++i) {
			lineTest.Set(points[i], points[(i + 1) % points.length]);
			tDist = position.Distance(lineTest.ClosestPointAlongLine(position.x, position.y));

			if (tDist < distance) {
				distance = tDist;
				line.a = lineTest.a;
				line.b = lineTest.b;
			}
		}

		return line.ClosestPointAlongLine(position.x, position.y);
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

	/**
	 * 
	 * @param {number} a 
	 * @param {number} b 
	 * @param {number} f 
	 * @returns {number}
	 */
	static Lerp(a, b, f) {
		return a + f * (b - a);
	}

	static ObjectLerp(a, b, f) {
		let paramsA = [],
			paramsB = [];

		for (const value of a) {
			paramsA.push(value);
		}

		for (const value of b) {
			paramsB.push(value);
		}

		for (let i = 0, l = paramsA.length; i < l; ++i) {
			paramsA[i] = paramsA[i] + f * (paramsB[i] - paramsA[i]);
		}

		let objectProto = Object.getPrototypeOf(a);
		return new objectProto.constructor(...paramsA);
	}

	static EaseIn(t) {
		return t * t;
	}

	static EaseOut(t) {
		return t * (2 - t);
	}

	static EaseInOut(t) {
		return CMath.Lerp(CMath.EaseIn(t), CMath.EaseOut(t), t);
	}

	static GeneratePropertyTree(object, depth = 0, name = undefined, objects = []) {
		let visitedObjects = objects;
		let currentDepth = depth;

		let li = document.createElement('li');
		let span = document.createElement('span');
		let childUl = document.createElement('ul');

		span.className = 'caret';
		span.innerText = name !== undefined ? name : object.constructor.name;
		li.appendChild(span);

		childUl.className = 'tree-nested';
		li.appendChild(childUl);

		for (const [key, value] of Object.entries(object)) {

			if (value instanceof Object) {
				let objectDescriptor = Object.getOwnPropertyDescriptor(object, key);

				if (visitedObjects.indexOf(objectDescriptor.value) === -1) {
					visitedObjects.push(value);
					let tempUl = CMath.GeneratePropertyTree(objectDescriptor.value, currentDepth + 1, key, visitedObjects);
					childUl.appendChild(tempUl);
				}
			} else {
				let childSpan = document.createElement('li');
				childSpan.innerText = `${key}: ${value}`;
				childUl.appendChild(childSpan);
			}
		}

		return li;
	}

	static SoftLightBlend(base, blend) {
		return (blend < 0.5) ? (2.0 * base * blend + base * base * (1.0 - 2.0 * blend)) : (Math.sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend));
	}
}

export { CMath };