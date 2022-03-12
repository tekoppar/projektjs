//UL UR DL DR U L D R
/**
 * 0 - 4 - 1  
 * 5 - x - 7  
 * 2 - 6 - 3 
 * @readonly
 * @enum {number}
 */
const ULDR = {
	Center: 0x00000000,
	UpLeft: 0x00001100,
	Up: 0x00001000,
	UpRight: 0x00001001,
	Left: 0x00000100,
	Middle: 0x00001111,
	Right: 0x00000001,
	DownLeft: 0x00000110,
	Down: 0x00000010,
	DownRight: 0x00000011,
	CornerUpLeft: 0x01000000,
	CornerUpRight: 0x10000000,
	CornerDownLeft: 0x00010000,
	CornerDownRight: 0x00100000,
	UpdownMiddle: null,
	LeftRightMiddle: null,
	DownEnd: null,
	UpEnd: null,
	LeftEnd: null,
	RightEnd: null,
	CenterEnd: null,
	AngleUpLeft: 0x00010011,
	AngleUpRight: 0x00100110,
	AngleDownLeft: 0x01001001,
	AngleDownRight: 0x10001100,
	CornerDoubleULDR: 0x10010000,
	CornerDoubleDLUR: 0x01100000,
	CopyNeighbour: 0x11111111,
}

/**
 * Takes a string formatted as /0x/0000/0000 which corresponds too U D L R DR UL UR DL
 * 5 - 0 - 6  
 * 2 - x - 3  
 * 7 - 1 - 4  
 * @param {string} binary 
 * @param {number} middle 
 * @returns {ULDR}
 */
function GetAtlasTileMatrix(binary, middle = 0) {
	let first4 = binary.slice(0, 4);
	let last4 = binary.slice(4);

	switch (first4) {
		case '0001':
			switch (last4) {
				case '0100':
				case '1100':
				case '0101':
				case '0011':
				case '1011':
				case '0001':
				case '1101':
				case '1111':
				case '0111':
				case '0110': return ULDR.Left;
				case '1000': return ULDR.Up;
				case '0010': return ULDR.Down;
				case '0000': return ULDR.CopyNeighbour;
				case '1110':
				case '1001':
				case '1010': return ULDR.Left;
			}
			break;

		case '0010':
			switch (last4) {
				case '0001': return ULDR.Up; //changed
				case '0010': return ULDR.Right;
				case '0100': return ULDR.Down; //changed
				case '1000':
				case '0011':
				case '1010':
				case '1100':
				case '0110':
				case '1110':
				case '1011':
				case '0111':
				case '1101':
				case '1001':
				case '1111':
				case '0101': return ULDR.Right;
				case '0000': return ULDR.CopyNeighbour;
			}
			break;

		case '0100':
			switch (last4) {
				case '1000': return ULDR.Left;
				case '1001':
				case '1110': return ULDR.Up;
				case '0001': return ULDR.Right;
				case '0010':
				case '0100':
				case '0011':
				case '1100':
				case '0101':
				case '1010':
				case '1101':
				case '1011':
				case '0110':
				case '0111':
				case '1111': return ULDR.Up;
				case '0000': return ULDR.CopyNeighbour; //changed
			}
			break;

		case '1000':
			switch (last4) {
				case '0001':
				case '1001':
				case '1000':
				case '1101': return ULDR.Down;
				case '0010': return ULDR.Left;
				case '0101':
				case '1100':
				case '1011': return ULDR.Down;
				case '0100': return ULDR.Right;
				case '0111':
				case '0011':
				case '1010': return ULDR.Down; //changed
				case '0110':
				case '1110':
				case '1111': return ULDR.Down;
				case '0000': return ULDR.CopyNeighbour; //changed
			}
			break;

		case '0011':
			switch (last4) {
				case '0100': return ULDR.Down;
				case '1010':
				case '0101':
				case '0011': return ULDR.Middle;
				case '0010': return ULDR.Down;
				case '1011':
				case '1100':
				case '1101': return ULDR.Middle;
				case '0110': return ULDR.Down;
				case '1111': return ULDR.Middle;
				case '1000': return ULDR.Up;
				case '0001': return ULDR.Up;
				case '0111':
				case '1110': return ULDR.Middle;
				case '1001': return ULDR.Up;
				case '0000': return ULDR.CopyNeighbour;
			}
			break;

		case '0110':
			switch (last4) {
				case '0010':
				case '0100':
				case '0110':
				case '1100':
				case '1010': return ULDR.UpRight; //changed
				case '0101':
				case '0001': return middle === 0 ? ULDR.Up : ULDR.UpRight;
				case '0011':
				case '0111':
				case '1011':
				case '1110':
				case '1111': return ULDR.Right;
				case '0000': return ULDR.UpRight;
				case '1000': return ULDR.Right;//changed
				case '1001': return middle === 0 ? ULDR.Right : ULDR.UpRight;//changed
				case '1101': return ULDR.UpRight;
			}
			break;

		case '1100':
			switch (last4) {
				case '1111':
				case '0111':
				case '1011':
				case '1101':
				case '0011':
				case '1001':
				case '1100': return ULDR.Middle;
				case '0100': return ULDR.Right;
				case '0001': return ULDR.Right;
				case '0101': return ULDR.Right;
				case '1000': return ULDR.Left;
				case '1010': return ULDR.Left;
				case '0010': return ULDR.Left;
				case '0110':
				case '1110': return ULDR.Middle;
				case '0000': return ULDR.CopyNeighbour;
			}
			break;

		case '0101':
			switch (last4) {
				case '1000': return middle === 0 ? ULDR.Left : ULDR.UpLeft;
				case '1001': return middle === 0 ? ULDR.Left : ULDR.UpLeft; //changed
				case '1011': return ULDR.UpLeft;
				case '0011':
				case '0110':
				case '1100': return ULDR.CornerDoubleDLUR; //changed
				case '0111':
				case '0101':
				case '1010': return middle === 1 ? ULDR.UpLeft : ULDR.Left;
				case '0100':
				case '1101': return ULDR.Middle;
				case '1110': return ULDR.UpLeft;
				case '1111':
				case '1000':
				case '0010':
				case '0001': return ULDR.Middle;
				case '0000': return ULDR.UpLeft;
			}
			break;

		case '1010':
			switch (last4) {
				case '0010':
				case '1010':
				case '1011':
				case '1001':
				case '0001': return ULDR.DownRight;//changed
				case '0100': return middle === 0 ? ULDR.Middle : ULDR.DownRight;
				case '1000':
				case '0011':
				case '0101': return middle === 1 ? ULDR.DownRight : ULDR.Right; //changed
				case '1110':
				case '0111': return middle === 1 ? ULDR.DownRight : ULDR.Middle;  //changed
				case '1111':
				case '0110': return middle === 0 ? ULDR.Right : ULDR.DownRight; //changed
				case '1101':
				case '1100': return ULDR.Middle;
				case '0000': return ULDR.DownRight;
			}
			break;

		case '1001':
			switch (last4) {
				case '0001':
				case '1000': return ULDR.Down; //changed
				case '1100':
				case '1010': return middle === 1 ? ULDR.DownLeft : ULDR.Left; //changed
				case '1001':
				case '1110':
				case '1101':
				case '0111':
				case '0011':
				case '0110': return middle === 0 ? ULDR.Left : ULDR.DownLeft;//changed
				case '1011':
				case '1111':
				case '0010': return middle === 1 ? ULDR.DownLeft : ULDR.Down; //changed
				case '0101':
				case '0100': return ULDR.Middle;
				case '0000': return ULDR.DownLeft;
			}
			break;

		case '1110':
			switch (last4) {
				case '1000':
				case '0010':
				case '0011':
				case '0110':
				case '1100':
				case '0100':
				case '0001': return ULDR.UpRight;
				case '0101': return ULDR.Right; //changed
				case '1001':
				case '1010':
				case '0111':
				case '1011':
				case '1101': return middle === 1 ? ULDR.Right : ULDR.UpRight;
				case '1111': return ULDR.Right;
				case '1110': return ULDR.Middle;
			}
			break;

		case '0111':
			switch (last4) {
				case '1001': return ULDR.Up;
				case '1100':
				case '1101': return middle === 0 ? ULDR.Middle : ULDR.Up;//changed
				case '1011': return middle === 0 ? ULDR.Middle : ULDR.Up;//changed
				case '1111': return ULDR.Up;
				case '0101':
				case '0111':
				case '1110':
				case '0100':
				case '0110':
				case '0001':
				case '0010':
				case '1000':
				case '0011':
				case '1010': return ULDR.Middle;
			}
			break;

		case '1011':
			switch (last4) {
				case '0110': return ULDR.Down;
				case '1111': return ULDR.Down;
				case '1000':
				case '0011':
				case '1110': return middle === 1 ? ULDR.Down : ULDR.CornerDownRight;//changed
				case '0111': return middle === 1 ? ULDR.Down : ULDR.CornerDownLeft;//changed
				case '0010':
				case '0001':
				case '1001':
				case '1101':
				case '1011':
				case '0101':
				case '1010':
				case '1100':
				case '0100': return ULDR.Middle;
			}
			break;

		case '1101':
			switch (last4) {
				case '0100':
				case '0001':
				case '1000':
				case '0011':
				case '1100': return ULDR.Middle
				case '1110': return ULDR.Left;
				case '1011': return ULDR.Left;
				case '1101': return ULDR.Middle;
				case '1010': return ULDR.Left;
				case '1111': return ULDR.Left;
				case '0111':
				case '0010': return ULDR.Middle;
				case '1001': return ULDR.Left;
				case '0110':
				case '0101': return ULDR.Middle;
			}
			break;

		case '1111':
			switch (last4) {
				case '0011': return ULDR.CornerDoubleULDR;
				case '1100': return ULDR.CornerDoubleDLUR;
				case '1011': return ULDR.CornerUpRight;
				case '1110': return ULDR.CornerDownRight;
				case '0111': return ULDR.CornerDownLeft;
				case '0110':
				case '1001':
				case '0101':
				case '1010': return ULDR.Middle;
				case '1101': return ULDR.CornerUpLeft;
				case '0001':
				case '1111':
				case '1000':
				case '0100':
				case '0010': return ULDR.Middle;//changed
			}
			break;

		case '0000':
			switch (last4) {
				case '0001': return middle === 1 ? ULDR.Middle : ULDR.UpRight;//changed
				case '0010': return middle === 1 ? ULDR.Middle : ULDR.DownLeft;//changed
				case '0100': return middle === 1 ? ULDR.Middle : ULDR.DownRight;//changed
				case '1000': return middle === 1 ? ULDR.Middle : ULDR.UpLeft; //changed
				case '0011':
				case '0110':
				case '1100':
				case '0101':
				case '1010':
				case '1001':
				case '1110':
				case '0111':
				case '1011':
				case '1101': return ULDR.Middle;
				case '1111': return ULDR.Center;
				case '0000': return ULDR.Middle;
			}
			break;
	}

	return null;
}

export { GetAtlasTileMatrix, ULDR };