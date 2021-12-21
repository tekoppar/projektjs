//import { Vector2D, Vector4D, Tree, ExtendedProp, Rock, Rectangle, CraftingStation } from '../../internal.js';
let Props = [];
/*Props = [
	new Rock('rockStone', new Vector2D(432, 352), undefined, 'rockStone1', new Vector4D(64, 32, 0, 0), 'stonePiece', new Rectangle(13.5, 25, 64, 32)),
	new Rock('rockStone', new Vector2D(496, 384), undefined, 'rockStone2', new Vector4D(64, 32, 0, 0), 'stonePiece', new Rectangle(13.5, 25, 64, 32)),
	new Rock('rockStone', new Vector2D(464, 352), undefined, 'rockStone3', new Vector4D(64, 32, 0, 0), 'stonePiece', new Rectangle(13.5, 25, 64, 32)),
	new Rock('coalRock', new Vector2D(960, 160), undefined, 'coalRock', new Vector4D(32, 32, 0, 0), 'coal', new Rectangle(13.5, 25, 64, 32)),
	new Rock('ironRock', new Vector2D(992, 160), undefined, 'ironRock', new Vector4D(32, 32, 0, 0), 'iron', new Rectangle(13.5, 25, 64, 32)),
	new Rock('tinRock', new Vector2D(1024, 160), undefined, 'tinRock', new Vector4D(32, 32, 0, 0), 'tin', new Rectangle(13.5, 25, 64, 32)),
	new Rock('copperRock', new Vector2D(1056, 160), undefined, 'copperRock', new Vector4D(32, 32, 0, 0), 'copper', new Rectangle(13.5, 25, 64, 32)),
	new Rock('silverRock', new Vector2D(1088, 160), undefined, 'silverRock', new Vector4D(32, 32, 0, 0), 'silver', new Rectangle(13.5, 25, 64, 32)),
	new Rock('goldRock', new Vector2D(1120, 160), undefined, 'goldRock', new Vector4D(32, 32, 0, 0), 'gold', new Rectangle(13.5, 25, 64, 32)),
	new Tree('treePine', new Vector2D(1840, 192), undefined, 'treePine1', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treePine', new Vector2D(1808, 288), undefined, 'treePine2', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treePine', new Vector2D(1872, 672), undefined, 'treePine2', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treePine', new Vector2D(1904, 864), undefined, 'treePine2', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treePine', new Vector2D(1808, 736), undefined, 'treePine1v2', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treePine', new Vector2D(1776, 576), undefined, 'treePine2v2', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treePine', new Vector2D(1872, 352), undefined, 'treePine2v2', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treePine', new Vector2D(1776, 160), undefined, 'treePine2v2', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treePine', new Vector2D(1872, 96), undefined, 'treePine1', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treeBirch', new Vector2D(1357, 246), undefined, 'treeBirch1', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treeBirch', new Vector2D(131, 233), undefined, 'treeBirch2', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treeBirch', new Vector2D(115, 726), undefined, 'treeBirch1', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treeBirch', new Vector2D(55, 887), undefined, 'treeBirch1', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treeBirch', new Vector2D(151, 921), undefined, 'treeBirch2', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treeBirch', new Vector2D(446, 194), undefined, 'treeBirch1', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treeBirch', new Vector2D(862, 292), undefined, 'treeBirch2', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new ExtendedProp('lamppost', new Vector2D(193, 269), undefined, 'lamppost', new Vector4D(16, 16, 0, 32)),
	new ExtendedProp('stonewall_m_c_td', new Vector2D(352, 512), undefined, 'terrain', new Vector4D(10, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_td', new Vector2D(352, 480), undefined, 'terrain', new Vector4D(10, 32, 0, 32)),
	new ExtendedProp('stonewall_m_c_td', new Vector2D(352, 448), undefined, 'terrain', new Vector4D(10, 32, 0, 32)),
	new ExtendedProp('stonewall_tl_c_br', new Vector2D(352, 416), undefined, 'terrain', new Vector4D(21, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(384, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(416, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(448, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_t_c_b', new Vector2D(352, 640), undefined, 'terrain', new Vector4D(10, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_td', new Vector2D(352, 672), undefined, 'terrain', new Vector4D(10, 32, 0, 32)),
	new ExtendedProp('stonewall_m_c_td', new Vector2D(352, 704), undefined, 'terrain', new Vector4D(10, 32, 0, 32)),
	new ExtendedProp('stonewall_m_c_td', new Vector2D(352, 736), undefined, 'terrain', new Vector4D(10, 32, 0, 32)),
	new ExtendedProp('stonewall_m_c_td', new Vector2D(352, 768), undefined, 'terrain', new Vector4D(10, 32, 0, 32)),
	new ExtendedProp('stonewall_bl_c_tr', new Vector2D(352, 800), undefined, 'terrain', new Vector4D(21, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(384, 800), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(416, 800), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_r_c_l', new Vector2D(448, 800), undefined, 'terrain', new Vector4D(21, 22, -8, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(480, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(512, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(544, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(576, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(608, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_r_c_l', new Vector2D(672, 416), undefined, 'terrain', new Vector4D(21, 22, -8, 32)),
	new ExtendedProp('stonewall_l_c_r', new Vector2D(768, 416), undefined, 'terrain', new Vector4D(21, 22, 8, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(1024, 800), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(800, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(832, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(864, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(896, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(928, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(960, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(1024, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_r_c_l', new Vector2D(1056, 416), undefined, 'terrain', new Vector4D(21, 22, -8, 32)),
	new ExtendedProp('stonewall_r_c_l', new Vector2D(1056, 800), undefined, 'terrain', new Vector4D(21, 22, -8, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(992, 800), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(960, 800), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(928, 800), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(896, 800), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_l_c_r', new Vector2D(864, 800), undefined, 'terrain', new Vector4D(21, 22, 8, 32)),
	new ExtendedProp('HouseTest', new Vector2D(512, 512), undefined, 'HouseTest', new Vector4D(192, 288, 0, 288)),
	new ExtendedProp('stonewall_b_c_t', new Vector2D(352, 544), undefined, 'terrain', new Vector4D(10, 22, 0, 32)),
	new ExtendedProp('planningTable', new Vector2D(396, 493), undefined, 'planningTable', new Vector4D(16, 16, 0, 32)),
	new ExtendedProp('bush2', new Vector2D(46, 295), undefined, 'terrain', new Vector4D(20, 10, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(640, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('stonewall_m_c_lr', new Vector2D(992, 416), undefined, 'terrain', new Vector4D(32, 22, 0, 32)),
	new ExtendedProp('waterFilledBoat', new Vector2D(704, 1952), undefined, 'waterFilledBoat', new Vector4D(16, 16, 0, 32)),
	new Tree('treeBirch', new Vector2D(768, 1856), undefined, 'treeBirch1', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new Tree('treeBirch', new Vector2D(512, 1888), undefined, 'treeBirch2', new Vector4D(16, 16, 0, 0), 'birchLog', new Rectangle(23, 18, 32, 32)),
	new ExtendedProp('bush1', new Vector2D(633.5, 1895), undefined, 'terrain', new Vector4D(20, 10, 0, 32)),
	new ExtendedProp('bush2', new Vector2D(776.5, 1927), undefined, 'terrain', new Vector4D(20, 10, 0, 32)),
	new CraftingStation('Chopping Block', new Vector2D(800, 672), undefined, 'choppingBlock', 'CraftingRecipeListChoppingBlock', new Vector4D(64, 64, 0, 32)),
	new CraftingStation('Saw Table', new Vector2D(800, 544), undefined, 'sawTable', 'CraftingRecipeListSawTable', new Vector4D(64, 64, 0, 42)),
	new CraftingStation('Stone Smelter', new Vector2D(896, 448), undefined, 'stoneSmelter', 'CraftingRecipeListSmelter', new Vector4D(64, 96, 0, 96)),
	new CraftingStation('Anvil', new Vector2D(800, 448), undefined, 'anvil', 'CraftingRecipeListAnvil', new Vector4D(32, 32, 0, 24)),
	new CraftingStation('Workbench', new Vector2D(640, 480), undefined, 'workbench', 'CraftingRecipeListWorkbench', new Vector4D(64, 64, 0, 42)),
	new CraftingStation('Stone Cutter', new Vector2D(896, 672), undefined, 'stoneCutter', 'CraftingRecipeListStoneCutter', new Vector4D(64, 64, 0, 42)),
	new ExtendedProp('Wooden Floor', new Vector2D(896, 672), undefined, 'woodenFloor', new Vector4D(64, -32, 0, -32)),
	new CraftingStation('Planer Bench', new Vector2D(896, 544), undefined, 'planerBench', 'CraftingRecipeListPlanerBench', new Vector4D(64, 64, 0, 42))
];*/

export { Props };