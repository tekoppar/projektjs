import { CAnimation, AnimationType, Vector2D } from '../../internal.js';

/** @type {Object.<string, Object.<string, CAnimation>>} */ let propAnimations = {};

/** @type {Object.<string, CAnimation>} */ propAnimations.fence_l_c_r = {
	idle: new CAnimation('idle', new Vector2D(0, 0), new Vector2D(0, 0), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.fence_m_c_lr = {
	idle: new CAnimation('idle', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.fence_r_c_l = {
	idle: new CAnimation('idle', new Vector2D(2, 0), new Vector2D(2, 0), 32, 32, AnimationType.Idle, 1),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.fence_b_c_t = {
	idle: new CAnimation('idle', new Vector2D(0, 1), new Vector2D(0, 1), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.fence_m_c_td = {
	idle: new CAnimation('idle', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.fence_t_c_b = {
	idle: new CAnimation('idle', new Vector2D(2, 1), new Vector2D(2, 1), 32, 32, AnimationType.Idle, 1),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.fence_tl_c_br = {
	idle: new CAnimation('idle', new Vector2D(0, 2), new Vector2D(0, 2), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.fence_t_c_lbr = {
	idle: new CAnimation('idle', new Vector2D(1, 2), new Vector2D(1, 2), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.fence_tr_c_lb = {
	idle: new CAnimation('idle', new Vector2D(2, 2), new Vector2D(2, 2), 32, 32, AnimationType.Idle, 1),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.fence_l_c_trb = {
	idle: new CAnimation('idle', new Vector2D(0, 3), new Vector2D(0, 3), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.fence_m_c_ltrb = {
	idle: new CAnimation('idle', new Vector2D(1, 3), new Vector2D(1, 3), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.fence_r_c_ltb = {
	idle: new CAnimation('idle', new Vector2D(2, 3), new Vector2D(2, 3), 32, 32, AnimationType.Idle, 1),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.fence_bl_c_tr = {
	idle: new CAnimation('idle', new Vector2D(0, 4), new Vector2D(0, 4), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.fence_b_c_ltr = {
	idle: new CAnimation('idle', new Vector2D(1, 4), new Vector2D(1, 4), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.fence_br_c_lt = {
	idle: new CAnimation('idle', new Vector2D(2, 4), new Vector2D(2, 4), 32, 32, AnimationType.Idle, 1),
};



/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_l_c_r = {
	idle: new CAnimation('idle', new Vector2D(17, 32), new Vector2D(17, 32), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_m_c_lr = {
	idle: new CAnimation('idle', new Vector2D(18, 32), new Vector2D(18, 32), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_r_c_l = {
	idle: new CAnimation('idle', new Vector2D(19, 32), new Vector2D(19, 32), 32, 32, AnimationType.Idle, 1),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_b_c_t = {
	idle: new CAnimation('idle', new Vector2D(17, 33), new Vector2D(17, 33), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_m_c_td = {
	idle: new CAnimation('idle', new Vector2D(18, 33), new Vector2D(18, 33), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_t_c_b = {
	idle: new CAnimation('idle', new Vector2D(19, 33), new Vector2D(19, 33), 32, 32, AnimationType.Idle, 1),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_tl_c_br = {
	idle: new CAnimation('idle', new Vector2D(17, 34), new Vector2D(17, 34), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_t_c_lbr = {
	idle: new CAnimation('idle', new Vector2D(18, 34), new Vector2D(18, 34), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_tr_c_lb = {
	idle: new CAnimation('idle', new Vector2D(19, 34), new Vector2D(19, 34), 32, 32, AnimationType.Idle, 1),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_l_c_trb = {
	idle: new CAnimation('idle', new Vector2D(17, 35), new Vector2D(17, 35), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_m_c_ltrb = {
	idle: new CAnimation('idle', new Vector2D(18, 35), new Vector2D(18, 35), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_r_c_ltb = {
	idle: new CAnimation('idle', new Vector2D(19, 35), new Vector2D(19, 35), 32, 32, AnimationType.Idle, 1),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_bl_c_tr = {
	idle: new CAnimation('idle', new Vector2D(17, 36), new Vector2D(17, 36), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_b_c_ltr = {
	idle: new CAnimation('idle', new Vector2D(18, 36), new Vector2D(18, 36), 32, 32, AnimationType.Idle, 1),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.stonewall_br_c_lt = {
	idle: new CAnimation('idle', new Vector2D(19, 36), new Vector2D(19, 36), 32, 32, AnimationType.Idle, 1),
};




/** @type {Object.<string, CAnimation>} */ propAnimations.bush1 = {
	idle: new CAnimation('idle', new Vector2D(14, 32), new Vector2D(14, 32), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.bush2 = {
	idle: new CAnimation('idle', new Vector2D(15, 32), new Vector2D(15, 32), 32, 32, AnimationType.Idle, 12),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.treeBirch1 = {
	harvested: new CAnimation('idle', new Vector2D(23, 18), new Vector2D(23, 18), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.treeBirch2 = {
	harvested: new CAnimation('idle', new Vector2D(23, 18), new Vector2D(23, 18), 32, 32, AnimationType.Idle, 12),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.treePine1 = {
	harvested: new CAnimation('idle', new Vector2D(23, 18), new Vector2D(23, 18), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.treePine2 = {
	harvested: new CAnimation('idle', new Vector2D(23, 18), new Vector2D(23, 18), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.treePine3 = {
	harvested: new CAnimation('idle', new Vector2D(23, 18), new Vector2D(23, 18), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.treePine1v2 = {
	harvested: new CAnimation('idle', new Vector2D(23, 18), new Vector2D(23, 18), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.treePine2v2 = {
	harvested: new CAnimation('idle', new Vector2D(23, 18), new Vector2D(23, 18), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.treePine3v2 = {
	harvested: new CAnimation('idle', new Vector2D(23, 18), new Vector2D(23, 18), 32, 32, AnimationType.Idle, 12),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.rockStone1 = {
	harvested: new CAnimation('idle', new Vector2D(27, 25), new Vector2D(27, 25), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.rockStone2 = {
	harvested: new CAnimation('idle', new Vector2D(27, 25), new Vector2D(27, 25), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.rockStone3 = {
	harvested: new CAnimation('idle', new Vector2D(27, 25), new Vector2D(27, 25), 32, 32, AnimationType.Idle, 12),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.coalRock = {
	harvested: new CAnimation('idle', new Vector2D(27, 25), new Vector2D(27, 25), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.ironRock = {
	harvested: new CAnimation('idle', new Vector2D(27, 25), new Vector2D(27, 25), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.tinRock = {
	harvested: new CAnimation('idle', new Vector2D(27, 25), new Vector2D(27, 25), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.copperRock = {
	harvested: new CAnimation('idle', new Vector2D(27, 25), new Vector2D(27, 25), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.silverRock = {
	harvested: new CAnimation('idle', new Vector2D(27, 25), new Vector2D(27, 25), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.goldRock = {
	harvested: new CAnimation('idle', new Vector2D(27, 25), new Vector2D(27, 25), 32, 32, AnimationType.Idle, 12),
};



/** @type {Object.<string, CAnimation>} */ propAnimations.birchLog = {
	idle: new CAnimation('idle', new Vector2D(5, 0), new Vector2D(5, 0), 32, 32, AnimationType.Idle, 12),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.stonePiece = {
	idle: new CAnimation('idle', new Vector2D(26, 25), new Vector2D(26, 25), 32, 32, AnimationType.Idle, 12),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.coalLump = {
	idle: new CAnimation('idle', new Vector2D(0, 10), new Vector2D(0, 10), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.iron = {
	idle: new CAnimation('idle', new Vector2D(1, 10), new Vector2D(1, 10), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.tin = {
	idle: new CAnimation('idle', new Vector2D(2, 10), new Vector2D(2, 10), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.copper = {
	idle: new CAnimation('idle', new Vector2D(3, 10), new Vector2D(3, 10), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.silver = {
	idle: new CAnimation('idle', new Vector2D(4, 10), new Vector2D(4, 10), 32, 32, AnimationType.Idle, 12),
};
/** @type {Object.<string, CAnimation>} */ propAnimations.gold = {
	idle: new CAnimation('idle', new Vector2D(5, 10), new Vector2D(5, 10), 32, 32, AnimationType.Idle, 12),
};

/** @type {Object.<string, CAnimation>} */ propAnimations.nails = {
	idle: new CAnimation('idle', new Vector2D(18, 18), new Vector2D(18, 18), 32, 32, AnimationType.Idle, 12),
};

export { propAnimations };