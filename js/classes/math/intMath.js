import { IsLittleEndian } from '../../internal.js';

class IntMath {
    static Int32ToInt8(value) {
        if (IsLittleEndian === true) {
            return [
                value & 0xff,
                (value >> 8) & 0xff,
                (value >> 16) & 0xff,
                (value >> 24) & 0xff
            ];
        } else {
            return [
                (value >> 24) & 0xff,
                (value >> 16) & 0xff,
                (value >> 8) & 0xff,
                value & 0xff
            ];
        }
    }
}

export { IntMath };