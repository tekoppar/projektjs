import { Tree, Rock, Shop, Prop, ExtendedProp } from './internal.js';

const ObjectClassLUT = {
    pepoSeedShop: Shop.prototype,
    treeBirch1: Tree.prototype,
    treeBirch2: Tree.prototype,
    treePine1: Tree.prototype,
    treePine2: Tree.prototype,
    treePine3: Tree.prototype,
    treePine1v2: Tree.prototype,
    treePine2v2: Tree.prototype,
    treePine3v2: Tree.prototype,
    house1: ExtendedProp.prototype,
    bush1: ExtendedProp.prototype,
    bush2: ExtendedProp.prototype,
    rockStone1: Rock.prototype,
    rockStone2: Rock.prototype,
    rockStone3: Rock.prototype,
    coalRock: Rock.prototype,
    ironRock: Rock.prototype,
    tinRock: Rock.prototype,
    copperRock: Rock.prototype,
    silverRock: Rock.prototype,
    goldRock: Rock.prototype,
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

    stonewall_l_c_r: ExtendedProp.prototype,
    stonewall_m_c_lr: ExtendedProp.prototype,
    stonewall_r_c_l: ExtendedProp.prototype,

    stonewall_b_c_t: ExtendedProp.prototype,
    stonewall_m_c_td: ExtendedProp.prototype,
    stonewall_t_c_b: ExtendedProp.prototype,

    stonewall_tl_c_br: ExtendedProp.prototype,
    stonewall_t_c_lbr: ExtendedProp.prototype,
    stonewall_tr_c_lb: ExtendedProp.prototype,

    stonewall_l_c_trb: ExtendedProp.prototype,
    stonewall_m_c_ltrb: ExtendedProp.prototype,
    stonewall_r_c_ltb: ExtendedProp.prototype,

    stonewall_bl_c_tr: ExtendedProp.prototype,
    stonewall_b_c_ltr: ExtendedProp.prototype,
    stonewall_br_c_lt: ExtendedProp.prototype,
};

export { ObjectClassLUT };