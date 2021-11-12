import { Vector2D } from '../../internal.js';

Number.prototype.mapRange = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

class CMath {
    static RandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    static RandomFloat(min, max) {
        return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
    }

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

    static LookAt2D(a, b) {
        return Math.abs((Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI) + 90);
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
}

export { CMath };