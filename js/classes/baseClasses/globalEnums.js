/**
 * Enum for editor state
 * @readonly
 * @enum {Number}
 */
const ObjectType = {
	Pawn: 0,
	Character: 1,
	Shadow: 2,
	Prop: 3,
}

/**
 * @readonly
 * @enum {Number}
 */
const BWDrawingType = {
	None: 0,
	Behind: 1,
	Front: 2
}

/**
 * Enum for editor state
 * @readonly
 * @enum {Number}
 */
 let EditorState = {
	Closed: 0,
	Open: 1,
}

/**
 * @readonly
 * @enum {number}
 */
const OpenClosed = {
	Closed: 0,
	Open: 1,
}

/**
 * @readonly
 * @enum {string}
 */
 const EquipmentSlotType = {
	helmet: 'helmet',
	armor: 'armor',
	belt: 'belt',
	pants: 'pants',
	boots: 'boots',
	shoulders: 'shoulders',
	gloves: 'gloves',
	ring1: 'ring1',
	ring2: 'ring2',
	handLeft: 'handLeft',
	amulet: 'amulet',
	bracers: 'bracers',
	ring3: 'ring3',
	ring4: 'ring4',
	handRight: 'handRight'
};

export { ObjectType, BWDrawingType, EditorState, OpenClosed, EquipmentSlotType };