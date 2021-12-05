import { Tree, Rock, Shop, Prop, ExtendedProp } from './internal.js';

const ObjectClassLUT = {
    pepoSeedShop: Object.getPrototypeOf(Shop),
    treeBirch1: Tree.prototype,
    treeBirch2: Tree.prototype,
    treePine1: Tree.prototype,
    treePine2: Object.getPrototypeOf(Tree),
    treePine3: Object.getPrototypeOf(Tree),
    treePine1v2: Object.getPrototypeOf(Tree),
    treePine2v2: Object.getPrototypeOf(Tree),
    treePine3v2: Object.getPrototypeOf(Tree),
    rockStone1: Object.getPrototypeOf(Rock),
    rockStone2: Object.getPrototypeOf(Rock),
    rockStone3: Object.getPrototypeOf(Rock),
    coalRock: Object.getPrototypeOf(Rock),
    ironRock: Object.getPrototypeOf(Rock),
    tinRock: Object.getPrototypeOf(Rock),
    copperRock: Object.getPrototypeOf(Rock),
    silverRock: Object.getPrototypeOf(Rock),
    goldRock: Object.getPrototypeOf(Rock),
    lamppost: ExtendedProp.prototype,

    fence_l_c_r: ExtendedProp.prototype,
    fence_m_c_lr: ExtendedProp.prototype,
    fence_r_c_l: ExtendedProp.prototype,

    fence_b_c_t: ExtendedProp.prototype,
    fence_m_c_td: ExtendedProp.prototype,
    fence_t_c_b: ExtendedProp.prototype,

    fence_tl_c_br: ExtendedProp.prototype,
    fence_t_c_lbr: ExtendedProp.prototype,
    fence_tr_c_lb: ExtendedProp.prototype,

    fence_l_c_trb: ExtendedProp.prototype,
    fence_m_c_ltrb: ExtendedProp.prototype,
    fence_r_c_ltb: ExtendedProp.prototype,

    fence_bl_c_tr: ExtendedProp.prototype,
    fence_b_c_ltr: ExtendedProp.prototype,
    fence_br_c_lt: ExtendedProp.prototype,
};

export { ObjectClassLUT };