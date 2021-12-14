import { Cobject } from '../../internal.js';

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class CustomLogger extends Cobject {
    static Logger = new CustomLogger();

    constructor() {
        super();
        this.logs = '';
        this.logEl = document.getElementById('gameobject-draw-debug');
    }

    FixedUpdate() {
        this.ClearLogs();
        this.DrawToLogs();
    }

    ClearLogs() {
        this.logEl.innerText = '';
    }

    DrawToLogs() {
        CustomLogger.Logger.logEl.innerText = this.logs;
        this.logs = '';
    }

    static Log(callee, content) {
        if (Array.isArray(content)) {
            CustomLogger.Logger.logs += (callee.name !== undefined ? callee.name : callee.constructor.name).slice(0, 25) + ': \r\n';
            for (let i = 0, l = content.length; i < l; ++i) {
                CustomLogger.Logger.logs += '\t' + content[i] + '\r\n';
            }
        } else {
            CustomLogger.Logger.logs += (callee.name !== undefined ? callee.name : callee.constructor.name).slice(0, 25) + ': ' + content + '\r\n';
        }
    }
}

export { CustomLogger };