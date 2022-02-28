import { Cobject } from '../../internal.js';

const ValidObjectToStringClasses = [
	'Tile', 
	'DrawingOperation',
	'BoxCollision',
	'Collision',
	'PolygonCollision'
]

/**
 * @class
 * @static
 */
class StringUtility {

	/**
	 * Converts a string with spaces to the first letter to lowercase and removes all the spaces
	 * @param {string} name 
	 * @returns {string}
	 */
	static DisplayNameToName(name) {
		return name[0].toLowerCase() + name.substring(1, name.length).replace(/\s/gi, '');
	}

	/**
	 * Converts a string that's starts with a lowercase and adds spaces for infront of all uppercase letters
	 * @param {string} name 
	 * @returns {string}
	 */
	static NameToDisplayName(name) {
		return name[0].toUpperCase() + name.substring(1, name.length).replace(/[A-Z]/g, ' $&');
	}

	/**
	 * 
	 * @param {string} s 
	 * @returns {number}
	 */
	static HashCode(s) {
		let hash = 0, chr;
		for (let i = 0, l = s.length; i < l; ++i) {
			chr = s.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}

	/**
	 * 
	 * @param {string} s 
	 * @returns {string}
	 */
	static ChopLeft(s) {
		return s.slice(1, s.length);
	}

	/**
	 * 
	 * @param {string} s 
	 * @returns {string}
	 */
	static ChopRight(s) {
		return s.slice(0, s.length - 1);
	}

	/**
	 * 
	 * @param {Object} object 
	 * @returns {string}
	 */
	static ObjectToString(object) {
		let _VisitedObjects = [object];
		return StringUtility._ObjectToString(object, _VisitedObjects, 0);
	}

	/**
	 * 
	 * @todo too much recursion since it keeps going until it hits a primitive value or object
	 * and since there's no way to differiate between custom and built in objects the recursion
	 * ends up being massive
	 * @param {Object} object
	 * @param {Object[]} visitedObjects
	 * @param {number} depth
	 * @returns {string}
	 */
	static _ObjectToString(object, visitedObjects, depth = 0) {
		let objectString = '',
			keyPairs = Object.entries(object);

		for (let i = 0, l = keyPairs.length; i < l; ++i) {
			if (keyPairs[i] !== undefined) {
				if (keyPairs[i][1] instanceof Object && keyPairs[i][1].constructor.name !== 'Object' && (keyPairs[i][1] instanceof Cobject || keyPairs[i][1].ToString !== undefined || ValidObjectToStringClasses.indexOf(keyPairs[i][1].constructor.name) !== -1)) {
					if (visitedObjects.indexOf(keyPairs[i][1]) === -1) {
						if (keyPairs[i][1].ToString !== undefined) {
							objectString += '\t'.repeat(depth) + keyPairs[i][0] + ': ' + keyPairs[i][1].ToString() + '\r\n';
							visitedObjects.push(keyPairs[i][1]);
						} else {
							objectString += '\t'.repeat(depth) + keyPairs[i][0] + ': ' + '\r\n';
							visitedObjects.push(keyPairs[i][1]);
							objectString += StringUtility._ObjectToString(keyPairs[i][1], visitedObjects, depth + 1);
						}
					}
				} else if (keyPairs[i][0].startsWith('_') === false) {
					objectString += '\t'.repeat(depth) + keyPairs[i][0] + ': ' + keyPairs[i][1] + '\r\n';
				}
			}
		}

		return objectString;
	}
}

export { StringUtility };