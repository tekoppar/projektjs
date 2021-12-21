import { CAnimation, AnimationType, Vector2D, Direction } from '../../internal.js';

/** @type {Object.<string, CAnimation>} */ let femaleAnimations = {
	walkUp: new CAnimation('walkUp', new Vector2D(1, 8), new Vector2D(8, 8), 64, 64, AnimationType.Cycle, 5),
	walkUpIdle: new CAnimation('walkUpIdle', new Vector2D(0, 8), new Vector2D(0, 8), 64, 64, AnimationType.Idle, 2),

	walkLeft: new CAnimation('walkLeft', new Vector2D(1, 9), new Vector2D(8, 9), 64, 64, AnimationType.Cycle, 5),
	walkLeftIdle: new CAnimation('walkLeftIdle', new Vector2D(0, 9), new Vector2D(0, 9), 64, 64, AnimationType.Idle, 2),

	walkDown: new CAnimation('walkDown', new Vector2D(1, 10), new Vector2D(8, 10), 64, 64, AnimationType.Cycle, 5),
	walkDownIdle: new CAnimation('walkDownIdle', new Vector2D(0, 10), new Vector2D(0, 10), 64, 64, AnimationType.Idle, 2),

	walkRight: new CAnimation('walkRight', new Vector2D(1, 11), new Vector2D(8, 11), 64, 64, AnimationType.Cycle, 5),
	walkRightIdle: new CAnimation('walkRightIdle', new Vector2D(0, 11), new Vector2D(0, 11), 64, 64, AnimationType.Idle, 2),

	runUp: new CAnimation('runUp', new Vector2D(0, 21), new Vector2D(7, 21), 64, 64, AnimationType.Cycle, 3),
	runLeft: new CAnimation('runLeft', new Vector2D(0, 23), new Vector2D(7, 23), 64, 64, AnimationType.Cycle, 3),
	runDown: new CAnimation('runDown', new Vector2D(0, 25), new Vector2D(7, 25), 64, 64, AnimationType.Cycle, 3),
	runRight: new CAnimation('runRight', new Vector2D(0, 27), new Vector2D(7, 27), 64, 64, AnimationType.Cycle, 3),

	meleeUp: new CAnimation('meleeUp', new Vector2D(0, 12), new Vector2D(5, 12), 64, 64, AnimationType.Single, [2, 1, 15, 2, 1, 20]),
	meleeLeft: new CAnimation('meleeLeft', new Vector2D(0, 13), new Vector2D(5, 13), 64, 64, AnimationType.Single, [2, 1, 15, 2, 1, 20]),
	meleeDown: new CAnimation('meleeDown', new Vector2D(0, 14), new Vector2D(5, 14), 64, 64, AnimationType.Single, [2, 1, 15, 2, 1, 20]),
	meleeRight: new CAnimation('meleeRight', new Vector2D(0, 15), new Vector2D(5, 15), 64, 64, AnimationType.Single, [2, 1, 15, 2, 1, 20]),
}

let skeletonFemaleAnimations = {};
/** @type {Object.<string, {size:Vector2D, bones: Direction[]}>} */ skeletonFemaleAnimations.sword = {
	walkUp: {
		size: new Vector2D(32, 32),
		bones: [
			new Direction(14, 31, 0),
			new Direction(14, 31, 0),
			new Direction(14, 31, 0),
			new Direction(14, 31, 0),
			new Direction(14, 31, 0),
			new Direction(14, 31, 0),
			new Direction(14, 31, 0),
			new Direction(14, 31, 0)
		]
	},
	meleeUp: {
		size: new Vector2D(32, 32),
		bones: [
			new Direction(14, 31, 0),
			new Direction(3, 27, 0),
			new Direction(1, 37, 315),
			new Direction(1, 23, 0),
			new Direction(25, 6, 45),
			new Direction(36, 6, 90),
		]
	},
	walkLeft: {
		size: new Vector2D(32, 32),
		bones: [
			new Direction(27, 25, 145),
			new Direction(25, 30, 165),
			new Direction(20, 32, 180),
			new Direction(17, 34, 195),
			new Direction(15, 37, 210),
			new Direction(18, 35, 195),
			new Direction(21, 32, 175),
			new Direction(25, 30, 165)
		]
	},
	meleeLeft: {
		size: new Vector2D(32, 32),
		bones: [
			new Direction(-2, 32, 0),
			new Direction(-5, 42, 315),
			new Direction(23, 41, 225),
			new Direction(0, 39, 270),
			new Direction(-12, 27, 315),
			new Direction(-10, 7, 45),
		]
	},
	walkDown: {
		size: new Vector2D(32, 32),
		bones: [
			new Direction(14, 31, 0),
			new Direction(14, 31, 0),
			new Direction(14, 31, 0),
			new Direction(14, 31, 0),
			new Direction(14, 31, 0),
			new Direction(14, 31, 0),
			new Direction(14, 31, 0),
			new Direction(14, 31, 0)
		]
	},
	meleeDown: {
		size: new Vector2D(32, 32),
		bones: [
			new Direction(14, 31, 0),
			new Direction(8, 34, 0),
			new Direction(4, 23, 45),
			new Direction(10, 32, 0),
			new Direction(24, 39, 315),
			new Direction(34, 39, 270),
		]
	},
	walkRight: {
		size: new Vector2D(32, 32),
		bones: [
			new Direction(23, 34, 210),
			new Direction(26, 34, 195),
			new Direction(34, 33, 180),
			new Direction(36, 28, 165),
			new Direction(35, 24, 145),
			new Direction(35, 29, 165),
			new Direction(34, 33, 180),
			new Direction(26, 34, 195)
		]
	},
	meleeRight: {
		size: new Vector2D(32, 32),
		bones: [
			new Direction(32, 32, 180),
			new Direction(34, 42, 225),
			new Direction(16, 41, 315),
			new Direction(32, 39, 270),
			new Direction(42, 27, 225),
			new Direction(43, 7, 135),
		]
	},

	meleeUpIdle: {
		size: new Vector2D(32, 32),
		bones: [
			new Direction(14, 31, 0)
		]
	},
	meleeLeftIdle: {
		size: new Vector2D(32, 32),
		bones: [
			new Direction(27, 25, 145),
		]
	},
	meleeDownIdle: {
		size: new Vector2D(32, 32),
		bones: [
			new Direction(14, 31, 0),
		]
	},
	meleeRightIdle: {
		size: new Vector2D(32, 32),
		bones: [
			new Direction(23, 34, 210),
		]
	},
}

/** @type {Object.<string, Object.<string, CAnimation>>} */ let meleeFemaleWeaponAnimations = {};
/** @type {Object.<string, CAnimation>} */ meleeFemaleWeaponAnimations.sword = {
	walkUp: new CAnimation('walkUp', new Vector2D(0, 0), new Vector2D(7, 0), 32, 32, AnimationType.Cycle, 5),
	meleeUp: new CAnimation('meleeUp', new Vector2D(0, 4), new Vector2D(5, 4), 32, 32, AnimationType.Single, [2, 1, 15, 2, 1, 20]),
	walkUpIdle: new CAnimation('meleeUpIdle', new Vector2D(0, 4), new Vector2D(0, 4), 32, 32, AnimationType.Idle, 12),

	walkLeft: new CAnimation('walkLeft', new Vector2D(0, 1), new Vector2D(7, 1), 32, 32, AnimationType.Cycle, 5),
	meleeLeft: new CAnimation('meleeLeft', new Vector2D(0, 5), new Vector2D(5, 5), 32, 32, AnimationType.Single, [2, 1, 15, 2, 1, 20]),
	walkLeftIdle: new CAnimation('meleeLeftIdle', new Vector2D(0, 5), new Vector2D(0, 5), 32, 32, AnimationType.Idle, 12),

	walkDown: new CAnimation('walkDown', new Vector2D(0, 2), new Vector2D(7, 2), 32, 32, AnimationType.Cycle, 5),
	meleeDown: new CAnimation('meleeDown', new Vector2D(0, 6), new Vector2D(5, 6), 32, 32, AnimationType.Single, [2, 1, 15, 2, 1, 20]),
	walkDownIdle: new CAnimation('meleeDownIdle', new Vector2D(0, 6), new Vector2D(0, 6), 32, 32, AnimationType.Idle, 12),

	walkRight: new CAnimation('walkRight', new Vector2D(0, 3), new Vector2D(7, 3), 32, 32, AnimationType.Cycle, 5),
	meleeRight: new CAnimation('meleeRight', new Vector2D(0, 7), new Vector2D(5, 7), 32, 32, AnimationType.Single, [2, 1, 15, 2, 1, 20]),
	walkRightIdle: new CAnimation('meleeRightIdle', new Vector2D(0, 7), new Vector2D(0, 7), 32, 32, AnimationType.Idle, 12),
};

export { femaleAnimations, skeletonFemaleAnimations, meleeFemaleWeaponAnimations };