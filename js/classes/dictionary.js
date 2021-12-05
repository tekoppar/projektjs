/**
 * @class
 * @constructor
 */
class DictionaryValue {

    /**
     * 
     * @param {Object} key 
     * @param {Object} value 
     */
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}

/**
 * @class
 * @constructor
 */
class Dictionary {

    /**
     * 
     * @param {Object} key 
     */
    constructor(key) {
        this.key = key;
        this.hashes = [];
        this.dictionaryValues = {};
    }

    *iterator() {
        for (let key of this.hashes) {
            var value = this.dictionaryValues[key].value;
            yield value;
        }
    }

    [Symbol.iterator]() {
        return this.iterator();
    }

    AddValue(value, hashProperty = 'UID') {
        let hash = this.GenerateHash(value[hashProperty]);
        this.hashes.push(hash);
        this.dictionaryValues[hash] = new DictionaryValue(value[this.key], value);
    }

    GenerateHash(value) {
        // @ts-ignore
        return String(value).hashCode();
    }

    GetHashByProperty(value, property = 'UID') {
        for (let i = 0, l = this.hashes.length; i < l; ++i) {
            if (this.dictionaryValues[this.hashes[i]].value[property] !== undefined && this.dictionaryValues[this.hashes[i]].value[property] === value)
                return this.hashes[i];
        }

        return undefined;
    }

    GetValue(hash) {
        if (this.dictionaryValues[hash] !== undefined)
            return this.dictionaryValues[hash].value;
        else
            return undefined;
    }

    GetValueByProperty(value, property = 'UID') {
        for (let i = 0, l = this.hashes.length; i < l; ++i) {
            if (this.dictionaryValues[this.hashes[i]].value[property] !== undefined && this.dictionaryValues[this.hashes[i]].value[property] === value)
                return this.dictionaryValues[this.hashes[i]].value;
        }

        return undefined;
    }

    HasValue(value) {
        for (let i = 0, l = this.hashes.length; i < l; ++i) {
            if (this.dictionaryValues[this.hashes[i]].value === value)
                return true;
        }

        return false;
    }

    RemoveValue(hash) {
        if (this.dictionaryValues[hash] !== undefined) {
            delete this.dictionaryValues[hash];
            this.hashes.splice(this.hashes.indexOf(hash), 1);
        } else
            return false;
    }
}

export { Dictionary };