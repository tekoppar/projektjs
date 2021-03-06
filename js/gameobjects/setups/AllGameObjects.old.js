/*import { Vector2D, Vector4D, Tree, ExtendedProp, CAnimation, AnimationType, Rock, Rectangle } from '../../internal.js';

let Props = [];

Props = Props.concat([
	new Tree('treeBirch', new Vector2D(12.5 * 32, 18 * 32), undefined, 'treeBirch1'),
	new Tree('treeBirch', new Vector2D(45.5 * 32, 18 * 32), undefined, 'treeBirch2'),
	new Tree('treePine', new Vector2D(17.5 * 32, 18 * 32), undefined, 'treePine1'),
	new Tree('treePine', new Vector2D(23.5 * 32, 18 * 32), undefined, 'treePine2'),
	new Tree('treePine', new Vector2D(29 * 32, 18 * 32), undefined, 'treePine1v2'),
	new Tree('treePine', new Vector2D(33.5 * 32, 18 * 32), undefined, 'treePine2v2'),
	new Tree('treePine', new Vector2D(37.5 * 32, 18 * 32), undefined, 'treePine3'),

	new Rock('rockStone', new Vector2D(13.5 * 32, 11 * 32), undefined, 'rockStone1', new Vector4D(64, 32, 0, 0), 'stonePiece', new Rectangle(13.5, 25, 64, 32)),
	new Rock('rockStone', new Vector2D(15.5 * 32, 12 * 32), undefined, 'rockStone2', new Vector4D(64, 32, 0, 0), 'stonePiece', new Rectangle(13.5, 25, 64, 32)),
	new Rock('rockStone', new Vector2D(14.5 * 32, 11 * 32), undefined, 'rockStone3', new Vector4D(64, 32, 0, 0), 'stonePiece', new Rectangle(13.5, 25, 64, 32)),

	new Rock('coalRock', new Vector2D(4.5 * 32, 24 * 32), undefined, 'coalRock', new Vector4D(32, 32, 0, 0), 'coal', new Rectangle(13.5, 25, 64, 32)),
	new Rock('ironRock', new Vector2D(5.5 * 32, 24 * 32), undefined, 'ironRock', new Vector4D(32, 32, 0, 0), 'iron', new Rectangle(13.5, 25, 64, 32)),
	new Rock('tinRock', new Vector2D(6.5 * 32, 24 * 32), undefined, 'tinRock', new Vector4D(32, 32, 0, 0), 'tin', new Rectangle(13.5, 25, 64, 32)),
	new Rock('copperRock', new Vector2D(7.5 * 32, 24 * 32), undefined, 'copperRock', new Vector4D(32, 32, 0, 0), 'copper', new Rectangle(13.5, 25, 64, 32)),
	new Rock('silverRock', new Vector2D(8.5 * 32, 24 * 32), undefined, 'silverRock', new Vector4D(32, 32, 0, 0), 'silver', new Rectangle(13.5, 25, 64, 32)),
	new Rock('goldRock', new Vector2D(9.5 * 32, 24 * 32), undefined, 'goldRock', new Vector4D(32, 32, 0, 0), 'gold', new Rectangle(13.5, 25, 64, 32)),

	new Tree('treePine', new Vector2D(57.5 * 32, 6 * 32), undefined, 'treePine1'),
	new Tree('treePine', new Vector2D(56.5 * 32, 9 * 32), undefined, 'treePine2'),
	new Tree('treePine', new Vector2D(58.5 * 32, 21 * 32), undefined, 'treePine2'),
	new Tree('treePine', new Vector2D(59.5 * 32, 27 * 32), undefined, 'treePine2'),
	new Tree('treePine', new Vector2D(56.5 * 32, 23 * 32), undefined, 'treePine1v2'),
	new Tree('treePine', new Vector2D(55.5 * 32, 18 * 32), undefined, 'treePine2v2'),
	new Tree('treePine', new Vector2D(58.5 * 32, 11 * 32), undefined, 'treePine2v2'),
	new Tree('treePine', new Vector2D(55.5 * 32, 5 * 32), undefined, 'treePine2v2'),
	new Tree('treePine', new Vector2D(58.5 * 32, 3 * 32), undefined, 'treePine1'),
]);

Props = Props.concat([
	new ExtendedProp('fence', new Vector2D(4.5 * 32, 15 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(4.5 * 32, 16 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(4.5 * 32, 17 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(4.5 * 32, 18 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),

	new ExtendedProp('fence', new Vector2D(17.5 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),

	new ExtendedProp('fence', new Vector2D(17.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(0, 4), new Vector2D(0, 4), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 1, 0, -8)),

	new ExtendedProp('fence', new Vector2D(18.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(19.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(20.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(21.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(22.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(23.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(24.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(25.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(26.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(27.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(28.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(29.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(30.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(31.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(32.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(33.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(34.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(35.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(36.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(37.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(38.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(39.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(40.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(41.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(42.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(43.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(44.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(45.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(46.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(47.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(48.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(49.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(50.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(51.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(52.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(53.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),

	new ExtendedProp('fence', new Vector2D(54.5 * 32, 2 * 32), new CAnimation('null', new Vector2D(2, 2), new Vector2D(2, 2), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 1, 0, -8)),

	new ExtendedProp('fence', new Vector2D(54.5 * 32, 11 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 10 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 9 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 8 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 7 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 6 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 5 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 4 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 3 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),

	new ExtendedProp('fence', new Vector2D(54.5 * 32, 12 * 32), new CAnimation('null', new Vector2D(0, 4), new Vector2D(0, 4), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 1, 0, -8)),

	new ExtendedProp('fence', new Vector2D(55.5 * 32, 12 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(56.5 * 32, 12 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(57.5 * 32, 12 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(58.5 * 32, 12 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(59.5 * 32, 12 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),

	new ExtendedProp('fence', new Vector2D(55.5 * 32, 16 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(56.5 * 32, 16 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(57.5 * 32, 16 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(58.5 * 32, 16 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(59.5 * 32, 16 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),

	new ExtendedProp('fence', new Vector2D(54.5 * 32, 16 * 32), new CAnimation('null', new Vector2D(0, 2), new Vector2D(0, 2), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 1, 0, -8)),

	new ExtendedProp('fence', new Vector2D(54.5 * 32, 17 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 18 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 19 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 20 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 21 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 22 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 23 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 24 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 25 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 26 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 27 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),
	new ExtendedProp('fence', new Vector2D(54.5 * 32, 28 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 32, 0, 0)),

	new ExtendedProp('fence', new Vector2D(54.5 * 32, 29 * 32), new CAnimation('null', new Vector2D(0, 4), new Vector2D(0, 4), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(3, 1, 0, -8)),

	new ExtendedProp('fence', new Vector2D(55.5 * 32, 29 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(56.5 * 32, 29 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(57.5 * 32, 29 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(58.5 * 32, 29 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
	new ExtendedProp('fence', new Vector2D(59.5 * 32, 29 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', new Vector4D(32, 1, 0, -8)),
]);

export { Props };*/