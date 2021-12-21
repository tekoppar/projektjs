import { CAnimation, AnimationType, Vector2D } from '../../internal.js';

/** @type {Object.<string, Object.<string, CAnimation>>} */ let plantAnimations = {};


/** @type {Object.<string, CAnimation>} */ plantAnimations.corn = {
	seed: new CAnimation('seed', new Vector2D(31, 0), new Vector2D(31, 3), 32, 64, AnimationType.Single, 50),
	grow: new CAnimation('grow', new Vector2D(31, 4), new Vector2D(31, 3), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.pumpkin = {
	seed: new CAnimation('seed', new Vector2D(27, 0), new Vector2D(27, 3), 32, 64, AnimationType.Single, 50),
	grow: new CAnimation('grow', new Vector2D(27, 1), new Vector2D(27, 3), 32, 64, AnimationType.Single, 250),
	picked: new CAnimation('picked', new Vector2D(27, 4), new Vector2D(27, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.watermelon = {
	seed: new CAnimation('seed', new Vector2D(23, 0), new Vector2D(23, 3), 32, 64, AnimationType.Single, 50),
	grow: new CAnimation('grow', new Vector2D(23, 1), new Vector2D(23, 3), 32, 64, AnimationType.Single, 250),
	picked: new CAnimation('picked', new Vector2D(23, 4), new Vector2D(23, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.potato = {
	seed: new CAnimation('seed', new Vector2D(0, 0), new Vector2D(0, 3), 32, 64, AnimationType.Single, 50),
	picked: new CAnimation('picked', new Vector2D(0, 4), new Vector2D(0, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.bellpepperGreen = {
	seed: new CAnimation('seed', new Vector2D(18, 0), new Vector2D(18, 3), 32, 64, AnimationType.Single, 50),
	grow: new CAnimation('grow', new Vector2D(18, 2), new Vector2D(18, 3), 32, 64, AnimationType.Single, 250),
	picked: new CAnimation('picked', new Vector2D(18, 4), new Vector2D(18, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.bellpepperRed = {
	seed: new CAnimation('seed', new Vector2D(19, 0), new Vector2D(19, 3), 32, 64, AnimationType.Single, 50),
	grow: new CAnimation('grow', new Vector2D(19, 2), new Vector2D(19, 3), 32, 64, AnimationType.Single, 250),
	picked: new CAnimation('picked', new Vector2D(19, 4), new Vector2D(19, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.bellpepperOrange = {
	seed: new CAnimation('seed', new Vector2D(20, 0), new Vector2D(20, 3), 32, 64, AnimationType.Single, 50),
	grow: new CAnimation('grow', new Vector2D(20, 2), new Vector2D(20, 3), 32, 64, AnimationType.Single, 250),
	picked: new CAnimation('picked', new Vector2D(20, 4), new Vector2D(20, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.bellpepperYellow = {
	seed: new CAnimation('seed', new Vector2D(21, 0), new Vector2D(21, 3), 32, 64, AnimationType.Single, 50),
	grow: new CAnimation('grow', new Vector2D(21, 2), new Vector2D(21, 3), 32, 64, AnimationType.Single, 250),
	picked: new CAnimation('picked', new Vector2D(21, 4), new Vector2D(21, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.carrot = {
	seed: new CAnimation('seed', new Vector2D(6, 0), new Vector2D(6, 3), 32, 64, AnimationType.Single, 50),
	picked: new CAnimation('picked', new Vector2D(6, 4), new Vector2D(6, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.parsnip = {
	seed: new CAnimation('seed', new Vector2D(7, 0), new Vector2D(7, 3), 32, 64, AnimationType.Single, 50),
	picked: new CAnimation('picked', new Vector2D(7, 4), new Vector2D(7, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.radish = {
	seed: new CAnimation('seed', new Vector2D(8, 0), new Vector2D(8, 3), 32, 64, AnimationType.Single, 50),
	picked: new CAnimation('picked', new Vector2D(8, 4), new Vector2D(8, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.beetroot = {
	seed: new CAnimation('seed', new Vector2D(9, 0), new Vector2D(9, 3), 32, 64, AnimationType.Single, 50),
	picked: new CAnimation('picked', new Vector2D(9, 4), new Vector2D(9, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.garlic = {
	seed: new CAnimation('seed', new Vector2D(12, 0), new Vector2D(12, 3), 32, 64, AnimationType.Single, 50),
	picked: new CAnimation('picked', new Vector2D(12, 4), new Vector2D(12, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.onionYellow = {
	seed: new CAnimation('seed', new Vector2D(13, 0), new Vector2D(13, 3), 32, 64, AnimationType.Single, 50),
	picked: new CAnimation('picked', new Vector2D(13, 4), new Vector2D(13, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.onionRed = {
	seed: new CAnimation('seed', new Vector2D(14, 0), new Vector2D(14, 3), 32, 64, AnimationType.Single, 50),
	picked: new CAnimation('picked', new Vector2D(14, 4), new Vector2D(14, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.onionWhite = {
	seed: new CAnimation('seed', new Vector2D(15, 0), new Vector2D(15, 3), 32, 64, AnimationType.Single, 50),
	picked: new CAnimation('picked', new Vector2D(15, 4), new Vector2D(15, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.onionGreen = {
	seed: new CAnimation('seed', new Vector2D(16, 0), new Vector2D(16, 3), 32, 64, AnimationType.Single, 50),
	picked: new CAnimation('picked', new Vector2D(16, 4), new Vector2D(16, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.hotPepper = {
	seed: new CAnimation('seed', new Vector2D(17, 0), new Vector2D(17, 3), 32, 64, AnimationType.Single, 50),
	grow: new CAnimation('grow', new Vector2D(17, 0), new Vector2D(17, 3), 32, 64, AnimationType.Single, 250),
	picked: new CAnimation('picked', new Vector2D(17, 4), new Vector2D(17, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.chiliPepper = {
	seed: new CAnimation('seed', new Vector2D(22, 0), new Vector2D(22, 3), 32, 64, AnimationType.Single, 50),
	grow: new CAnimation('grow', new Vector2D(22, 0), new Vector2D(22, 3), 32, 64, AnimationType.Single, 250),
	picked: new CAnimation('picked', new Vector2D(22, 4), new Vector2D(22, 4), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.lettuceIceberg = {
	seed: new CAnimation('seed', new Vector2D(6, 5), new Vector2D(6, 8), 32, 64, AnimationType.Single, 50),
	grow: new CAnimation('grow', new Vector2D(6, 6), new Vector2D(6, 8), 32, 64, AnimationType.Single, 250),
	picked: new CAnimation('picked', new Vector2D(6, 9), new Vector2D(6, 9), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.cauliflower = {
	seed: new CAnimation('seed', new Vector2D(11, 5), new Vector2D(11, 8), 32, 64, AnimationType.Single, 50),
	grow: new CAnimation('grow', new Vector2D(11, 6), new Vector2D(11, 8), 32, 64, AnimationType.Single, 250),
	picked: new CAnimation('picked', new Vector2D(11, 9), new Vector2D(11, 9), 32, 64, AnimationType.Single, 250),
};
/** @type {Object.<string, CAnimation>} */ plantAnimations.broccoli = {
	seed: new CAnimation('seed', new Vector2D(12, 5), new Vector2D(12, 8), 32, 64, AnimationType.Single, 50),
	grow: new CAnimation('grow', new Vector2D(12, 6), new Vector2D(12, 8), 32, 64, AnimationType.Single, 250),
	picked: new CAnimation('picked', new Vector2D(12, 9), new Vector2D(12, 9), 32, 64, AnimationType.Single, 250),
};

export { plantAnimations };