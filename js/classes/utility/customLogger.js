import { Cobject } from '../../internal.js';

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class Logger extends Cobject {
	static Logger = new Logger();

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
		Logger.Logger.logEl.innerText = this.logs;
		this.logs = '';
	}

	static Log(callee, content) {
		/** @type {string} */ let name = '';
		if (typeof callee === 'string')
			name = callee;
		else if (callee.name !== undefined && callee.name !== '')
			name = callee.name
		else {
			name = callee.constructor.name;
		}

		if (Array.isArray(content)) {
			Logger.Logger.logs += name.slice(0, 25) + ': \r\n';
			for (let i = 0, l = content.length; i < l; ++i) {
				Logger.Logger.logs += '\t' + content[i] + '\r\n';
			}
		} else {
			Logger.Logger.logs += name.slice(0, 25) + ': ' + content + '\r\n';
		}
	}
}

export { Logger };