import { CAnimation, AnimationType, Vector2D } from '../../internal.js';

/** @type {Object.<string, CAnimation>} */ let smallAnimalAnimations = {
	walkLeft: new CAnimation('walkLeft', new Vector2D(0, 1), new Vector2D(3, 1), 32, 32, AnimationType.Cycle, 12),
	walkLeftIdle: new CAnimation('walkLeftIdle', new Vector2D(0, 4), new Vector2D(0, 4), 32, 32, AnimationType.Idle, 12),
	walkRight: new CAnimation('walkRight', new Vector2D(0, 3), new Vector2D(3, 3), 32, 32, AnimationType.Cycle, 12),
	walkRightIdle: new CAnimation('walkRightIdle', new Vector2D(1, 4), new Vector2D(1, 4), 32, 32, AnimationType.Idle, 12),
	walkDown: new CAnimation('walkDown', new Vector2D(0, 2), new Vector2D(3, 2), 32, 32, AnimationType.Cycle, 12),
	walkDownIdle: new CAnimation('walkDownIdle', new Vector2D(2, 4), new Vector2D(2, 4), 32, 32, AnimationType.Idle, 12),
	walkUp: new CAnimation('walkUp', new Vector2D(0, 0), new Vector2D(3, 0), 32, 32, AnimationType.Cycle, 12),
	walkUpIdle: new CAnimation('walkUpIdle', new Vector2D(3, 4), new Vector2D(3, 4), 32, 32, AnimationType.Idle, 12),
}

export { smallAnimalAnimations };