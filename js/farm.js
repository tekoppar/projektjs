/* import { MasterObject } from './classes/masterObject.js';
import { PageFetcher } from './classes/utility/pageFetcher.js';
import { Props } from './gameobjects/AllGameObjects.js'; */

import { MasterObject, PageFetcher, Props } from './internal.js';

class SpriteObject {
    constructor(x, y, w, h, canvas, name) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.canvas = canvas;
        this.name = name;
    }
}

/**
 * @memberof Object
 */
Object.defineProperty(Array.prototype, 'CloneObjects', {
    value() {
        let arr = [];
        for (let i = 0, l = this.length; i < l; ++i) {
            let newObject = Object.create(this[i]);
            Object.assign(newObject, this[i]);
            arr.push(newObject);
        }
        return arr;
    }
});

/**
 * @memberof String
 */
Object.defineProperty(String.prototype, 'hashCode', {
    value: function () {
        var hash = 0, chr;
        for (let i = 0, l = this.length; i < l; ++i) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
});

/**
 * @memberof String
 */
Object.defineProperty(String.prototype, 'chopLeft', {
    value() {
        return this.slice(1, this.length);
    }
});

/**
 * @memberof String
 */
Object.defineProperty(String.prototype, 'chopRight', {
    value() {
        return this.slice(0, this.length - 1);
    }
});

/**
 * @memberof Node
 */
Object.defineProperty(Node.prototype, 'appendChildren', {
    value(nodes) {
        for (let i = 0, l = nodes.length; i < l; ++i) {
            this.appendChild(nodes[i]);
        }
    }
});

/**
 * @memberof Number
 */
Object.defineProperty(Number, 'randomInt', {
    value(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive          
    }
});

// @ts-ignore
function posToGrid(pos, columns = link.columns) {
    // @ts-ignore
    let x = pos.x / link.width;
    // @ts-ignore
    let y = pos.y / link.height;
    return x + (columns * y);
}

// @ts-ignore
function gridToPos(pid, columns = link.columns) {
    let x = pid % columns;
    let y = Math.floor(pid / columns);
    // @ts-ignore
    x = link.width * x;
    // @ts-ignore
    y = link.height * y;
    return { x: x, y: y };
}

function HTMLStringToNode(string) {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div;
}

let includeTemplates = function appendTemplates(content) {
    let container = document.createElement('div');
    container.innerHTML = content;
    document.head.appendChild(container);
}

let includeGUI = function appendGUI(content) {
    document.getElementById('game-gui').appendChild(HTMLStringToNode(content));
}

PageFetcher.GPF.AddRequest(includeTemplates, '/html/inventory.html');
PageFetcher.GPF.AddRequest(includeTemplates, '/html/tileLUTEditor.html');
PageFetcher.GPF.AddRequest(includeGUI, '/html/collisionEditor.html');
PageFetcher.GPF.AddRequest(includeGUI, '/html/propEditor.html');
PageFetcher.GPF.AddRequest(includeTemplates, '/html/craftingWindow.html');

window.onload = function () {
    window.requestAnimationFrame(() => MasterObject.MO.GameStart());
}