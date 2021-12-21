class ObjectUtility {
	static ToString(object, toStringFunc = undefined) {
		let s = '{\r\n',
			keys = Object.keys(object);
		for (let i = 0, l = keys.length; i < l; ++i) {
			if (toStringFunc !== undefined && object[keys[i]][toStringFunc.name] !== undefined) {
				s += keys[i] + ' : ' + toStringFunc.call(object[keys[i]]);
			}
			else if (object[keys[i]].ToString !== undefined)
				s += keys[i] + ' : ' + object[keys[i]].ToString();
			else if (object[keys[i]].toString !== undefined)
				s += keys[i] + ' : ' + object[keys[i]].toString();
			else
				s += keys[i] + ' : ' + object[keys[i]];

			if (i < l - 1)
				s += ', ';
		}

		s += '\r\n}';

		return s;
	}

	/**
	 * 
	 * @param {string} name 
	 * @returns {string}
	 */
	static DisplayNameToName(name) {
		return name[0].toLowerCase() + name.substring(1, name.length).replace(/\s/gi, '');
	}
}

export { ObjectUtility }