import { CustomLogger } from '../../internal.js';

class ArrayUtility {

    /**
     * Returns a sub array from an array as if the array was a 2D array
     * @param {Number} pX - start x value of the sub array
     * @param {Number} pY - start y value of the sub array
     * @param {Number} w - width of the sub array
     * @param {Number} h - height of the sub array
     * @param {Number} arrayWidth - total array length
     * @param {*} arr - array to get sub array from
     * @returns {Array}
     */
    static GetSubrect2D(pX, pY, w, h, arrayWidth, arr) {
        w = Math.max(Math.floor(w), 0);
        h = Math.max(Math.floor(h), 0);
        let startX = Math.max(Math.floor(pX), 0),
            startY = Math.max(Math.floor(pY), 0),
            preWidth = arrayWidth * 4,
            data = arr,
            y = startY,
            x = 0,
            lX = 0,
            loopX = startX * 4,
            l = ((startX + w) * 4) - loopX,
            iSubRect = 0,
            subRectData = [],
            endY = ((startY + h) * preWidth) + loopX;

        startY = (startY * preWidth) + loopX;

        for (y = startY; y < endY; y += preWidth) {
            for (x = y, lX = l + y; x < lX; ++x, ++iSubRect) {
                subRectData.push(data[x]);
                subRectData.push(data[++x]);
                subRectData.push(data[++x]);
                subRectData.push(data[++x]);
            }
        }

        return subRectData;
    }

    static ToString(array, level = 0) {
        let s;
        if (level === 0)
            s = '[\r\n';
        else
            s = '[';

        for (let i = 0, l = array.length; i < l; ++i) {
            if (Array.isArray(array[i])) {
                s += ArrayUtility.ToString(array[i], level + 1);
            } else {
                s += array[i];
            }

            if (i < l - 1) {
                if (level === 0)
                    s += ', \r\n';
                else
                    s += ', ';
            }
        }

        if (level === 0)
            s += '\r\n]';
        else
            s += ']';

        return s;
    }

    static ObjectAsArrayToString(object, toStringFunc = undefined, level = 0) {
        let s;
        if (level === 0)
            s = '[\r\n';
        else
            s = '[';
        let keys = Object.keys(object);

        for (let i = 0, l = keys.length; i < l; ++i) {
            if (toStringFunc !== undefined && object[keys[i]][toStringFunc.name] !== undefined) {
                s += toStringFunc.call(object[keys[i]]);
            }
            else if (object[keys[i]].ToString !== undefined)
                s += object[keys[i]].ToString();
            else if (object[keys[i]].toString !== undefined)
                s += object[keys[i]].toString();
            else
                s += object[keys[i]];

            if (i < l - 1)
                s += ', \r\n';
        }

        if (level === 0)
            s += '\r\n]';
        else
            s += ']';

        return s;
    }
}

export { ArrayUtility }; 