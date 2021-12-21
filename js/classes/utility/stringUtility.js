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
}

export { StringUtility };