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

export { ObjectType, BWDrawingType, EditorState };