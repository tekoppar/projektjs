import { Tree, Rock, Shop, ExtendedProp, Storage, CraftingStation } from '../../internal.js';

/**
 * @readonly
 */
const ObjectClassLUT = {
	/** @lends {Shop.prototype} */
	pepoSeedShop: Shop.prototype,
	/** @lends {Tree.prototype} */
	treeBirch1: Tree.prototype,
	/** @lends {Tree.prototype} */
	treeBirch2: Tree.prototype,
	/** @lends {Tree.prototype} */
	treePine1: Tree.prototype,
	/** @lends {Tree.prototype} */
	treePine2: Tree.prototype,
	/** @lends {Tree.prototype} */
	treePine3: Tree.prototype,
	/** @lends {Tree.prototype} */
	treePine1v2: Tree.prototype,
	/** @lends {Tree.prototype} */
	treePine2v2: Tree.prototype,
	/** @lends {Tree.prototype} */
	treePine3v2: Tree.prototype,
	/** @lends {ExtendedProp.prototype} */
	house1: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	HouseTest: ExtendedProp.prototype,
	/** @lends {Storage.prototype} */
	woodenChest: Storage.prototype,
	/** @lends {CraftingStation.prototype} */
	stoneSmelter: CraftingStation.prototype,
	/** @lends {CraftingStation.prototype} */
	anvil: CraftingStation.prototype,
	/** @lends {CraftingStation.prototype} */
	workbench: CraftingStation.prototype,
	/** @lends {CraftingStation.prototype} */
	choppingBlock: CraftingStation.prototype,
	/** @lends {CraftingStation.prototype} */
	planerBench: CraftingStation.prototype,
	/** @lends {CraftingStation.prototype} */
	stoneCutter: CraftingStation.prototype,
	/** @lends {ExtendedProp.prototype} */
	woodenFloor: ExtendedProp.prototype,
	/** @lends {CraftingStation.prototype} */
	sawTable: CraftingStation.prototype,
	/** @lends {ExtendedProp.prototype} */
	planningTable: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	waterFilledBoat: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	bush1: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	bush2: ExtendedProp.prototype,
	/** @lends {Rock.prototype} */
	rockStone1: Rock.prototype,
	/** @lends {Rock.prototype} */
	rockStone2: Rock.prototype,
	/** @lends {Rock.prototype} */
	rockStone3: Rock.prototype,
	/** @lends {Rock.prototype} */
	coalRock: Rock.prototype,
	/** @lends {Rock.prototype} */
	ironRock: Rock.prototype,
	/** @lends {Rock.prototype} */
	tinRock: Rock.prototype,
	/** @lends {Rock.prototype} */
	copperRock: Rock.prototype,
	/** @lends {Rock.prototype} */
	silverRock: Rock.prototype,
	/** @lends {Rock.prototype} */
	goldRock: Rock.prototype,
	/** @lends {ExtendedProp.prototype} */
	lamppost: ExtendedProp.prototype,

	/** @lends {ExtendedProp.prototype} */
	fence_l_c_r: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	fence_m_c_lr: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	fence_r_c_l: ExtendedProp.prototype,

	/** @lends {ExtendedProp.prototype} */
	fence_b_c_t: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	fence_m_c_td: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	fence_t_c_b: ExtendedProp.prototype,

	/** @lends {ExtendedProp.prototype} */
	fence_tl_c_br: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	fence_t_c_lbr: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	fence_tr_c_lb: ExtendedProp.prototype,

	/** @lends {ExtendedProp.prototype} */
	fence_l_c_trb: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	fence_m_c_ltrb: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	fence_r_c_ltb: ExtendedProp.prototype,

	/** @lends {ExtendedProp.prototype} */
	fence_bl_c_tr: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	fence_b_c_ltr: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	fence_br_c_lt: ExtendedProp.prototype,

	/** @lends {ExtendedProp.prototype} */
	stonewall_l_c_r: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	stonewall_m_c_lr: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	stonewall_r_c_l: ExtendedProp.prototype,

	/** @lends {ExtendedProp.prototype} */
	stonewall_b_c_t: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	stonewall_m_c_td: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	stonewall_t_c_b: ExtendedProp.prototype,

	/** @lends {ExtendedProp.prototype} */
	stonewall_tl_c_br: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	stonewall_t_c_lbr: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	stonewall_tr_c_lb: ExtendedProp.prototype,

	/** @lends {ExtendedProp.prototype} */
	stonewall_l_c_trb: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	stonewall_m_c_ltrb: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	stonewall_r_c_ltb: ExtendedProp.prototype,

	/** @lends {ExtendedProp.prototype} */
	stonewall_bl_c_tr: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	stonewall_b_c_ltr: ExtendedProp.prototype,
	/** @lends {ExtendedProp.prototype} */
	stonewall_br_c_lt: ExtendedProp.prototype,
};

export { ObjectClassLUT };