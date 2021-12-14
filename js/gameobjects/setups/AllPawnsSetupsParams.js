import { CraftingRecipes } from '../../internal.js';

let PawnSetupParams = {};

PawnSetupParams.treeBirch1 = ['treeBirch', [0.5, 0], undefined, 'treeBirch1'];
PawnSetupParams.treeBirch2 = ['treeBirch', [0.5, 0], undefined, 'treeBirch2'];

PawnSetupParams.treePine1 = ['treePine', [0.5, 0], undefined, 'treePine1'];
PawnSetupParams.treePine2 = ['treePine', [0.5, 0], undefined, 'treePine2'];
PawnSetupParams.treePine3 = ['treePine', [0.5, 0], undefined, 'treePine3'];
PawnSetupParams.treePine1v2 = ['treePine', [0.5, 0], undefined, 'treePine1v2'];
PawnSetupParams.treePine2v2 = ['treePine', [0.5, 0], undefined, 'treePine2v2'];
PawnSetupParams.treePine3v2 = ['treePine', [0.5, 0], undefined, 'treePine3v2'];

PawnSetupParams.house1 = ['house1', [0.5, 0], undefined, 'house1'];
PawnSetupParams.HouseTest = ['HouseTest', [0.5, 0], undefined, 'HouseTest'];

PawnSetupParams.woodenChest = ['woodenChest', [0.5, 0], undefined, 'woodenChest'];

PawnSetupParams.stoneSmelter = ['Stone Smelter', [0.5, 0], undefined, 'stoneSmelter', CraftingRecipes.CraftingRecipeKeys.CraftingRecipeListSmelter];
PawnSetupParams.anvil = ['Anvil', [0.5, 0], undefined, 'anvil', CraftingRecipes.CraftingRecipeKeys.CraftingRecipeListAnvil];
PawnSetupParams.workbench = ['Workbench', [0.5, 0], undefined, 'workbench', CraftingRecipes.CraftingRecipeKeys.CraftingRecipeListWorkbench];
PawnSetupParams.choppingBlock = ['Chopping Block', [0.5, 0], undefined, 'choppingBlock', CraftingRecipes.CraftingRecipeKeys.CraftingRecipeListChoppingBlock, 0, { x: 64, y: 64, z: 0, a: 32 }];
PawnSetupParams.planerBench = ['Planer Bench', [0.5, 0], undefined, 'planerBench', CraftingRecipes.CraftingRecipeKeys.CraftingRecipeListPlanerBench];
PawnSetupParams.stoneCutter = ['Stone Cutter', [0.5, 0], undefined, 'stoneCutter', CraftingRecipes.CraftingRecipeKeys.CraftingRecipeListStoneCutter, 0, { x: 0, y: 0, z: 0, a: -32 }];

PawnSetupParams.planningTable = ['planningTable', [0.5, 0], undefined, 'planningTable'];

PawnSetupParams.waterFilledBoat = ['waterFilledBoat', [0.5, 0], undefined, 'waterFilledBoat'];

PawnSetupParams.bush1 = ['bush1', [0.5, 0], { name: 'null', start: { x: 14, y: 32 }, end: { x: 14, y: 32 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 20, y: 10, w: 0, h: 0 }];
PawnSetupParams.bush2 = ['bush2', [0.5, 0], { name: 'null', start: { x: 15, y: 32 }, end: { x: 15, y: 32 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 20, y: 10, w: 0, h: 0 }];

PawnSetupParams.rockStone1 = ['rockStone', [0.5, 0], undefined, 'rockStone1', 0, { x: 64, y: 32, w: 0, h: 0 }, 'stonePiece', { x: 13.5, y: 25, w: 64, h: 32 }];
PawnSetupParams.rockStone2 = ['rockStone', [0.5, 0], undefined, 'rockStone2', 0, { x: 64, y: 32, w: 0, h: 0 }, 'stonePiece', { x: 13.5, y: 25, w: 64, h: 32 }];
PawnSetupParams.rockStone3 = ['rockStone', [0.5, 0], undefined, 'rockStone3', 0, { x: 64, y: 32, w: 0, h: 0 }, 'stonePiece', { x: 13.5, y: 25, w: 64, h: 32 }];

PawnSetupParams.coalRock = ['coalRock', [0.5, 0], undefined, 'coalRock', 0, { x: 32, y: 32, w: 0, h: 0 }, 'coal', { x: 13.5, y: 25, w: 32, h: 32 }];
PawnSetupParams.ironRock = ['ironRock', [0.5, 0], undefined, 'ironRock', 0, { x: 32, y: 32, w: 0, h: 0 }, 'iron', { x: 13.5, y: 25, w: 32, h: 32 }];
PawnSetupParams.tinRock = ['tinRock', [0.5, 0], undefined, 'tinRock', 0, { x: 32, y: 32, w: 0, h: 0 }, 'tin', { x: 13.5, y: 25, w: 32, h: 32 }];
PawnSetupParams.copperRock = ['copperRock', [0.5, 0], undefined, 'copperRock', 0, { x: 32, y: 32, w: 0, h: 0 }, 'copper', { x: 13.5, y: 25, w: 32, h: 32 }];
PawnSetupParams.silverRock = ['silverRock', [0.5, 0], undefined, 'silverRock', 0, { x: 32, y: 32, w: 0, h: 0 }, 'silver', { x: 13.5, y: 25, w: 32, h: 32 }];
PawnSetupParams.goldRock = ['goldRock', [0.5, 0], undefined, 'goldRock', 0, { x: 32, y: 32, w: 0, h: 0 }, 'gold', { x: 13.5, y: 25, w: 32, h: 32 }];

PawnSetupParams.lamppost = ['lamppost', [0.5, 0], undefined, 'lamppost'];

PawnSetupParams.fence_l_c_r = ['fence_l_c_r', [0.5, 0], { name: 'null', start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 32, y: 1, w: 0, h: -8 }];
PawnSetupParams.fence_m_c_lr = ['fence_m_c_lr', [0.5, 0], { name: 'null', start: { x: 1, y: 0 }, end: { x: 1, y: 0 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 32, y: 1, w: 0, h: -8 }];
PawnSetupParams.fence_r_c_l = ['fence_r_c_l', [0.5, 0], { name: 'null', start: { x: 2, y: 0 }, end: { x: 2, y: 0 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 32, y: 1, w: 0, h: -8 }];

PawnSetupParams.fence_b_c_t = ['fence_b_c_t', [0.5, 0], { name: 'null', start: { x: 0, y: 1 }, end: { x: 0, y: 1 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 3, y: 32, w: 0, h: -8 }];
PawnSetupParams.fence_m_c_td = ['fence_m_c_td', [0.5, 0], { name: 'null', start: { x: 1, y: 1 }, end: { x: 1, y: 1 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 3, y: 32, w: 0, h: 0 }];
PawnSetupParams.fence_t_c_b = ['fence_t_c_b', [0.5, 0], { name: 'null', start: { x: 2, y: 1 }, end: { x: 2, y: 1 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 3, y: 32, w: 0, h: 0 }];

PawnSetupParams.fence_tl_c_br = ['fence_tl_c_br', [0.5, 0], { name: 'null', start: { x: 0, y: 2 }, end: { x: 0, y: 2 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 3, y: 1, w: 0, h: -8 }];
PawnSetupParams.fence_t_c_lbr = ['fence_t_c_lbr', [0.5, 0], { name: 'null', start: { x: 1, y: 2 }, end: { x: 1, y: 2 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 32, y: 1, w: 0, h: -8 }];
PawnSetupParams.fence_tr_c_lb = ['fence_tr_c_lb', [0.5, 0], { name: 'null', start: { x: 2, y: 2 }, end: { x: 2, y: 2 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 3, y: 1, w: 0, h: -8 }];

PawnSetupParams.fence_l_c_trb = ['fence_l_c_trb', [0.5, 0], { name: 'null', start: { x: 0, y: 3 }, end: { x: 0, y: 3 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 3, y: 32, w: 0, h: -8 }];
PawnSetupParams.fence_m_c_ltrb = ['fence_m_c_ltrb', [0.5, 0], { name: 'null', start: { x: 1, y: 3 }, end: { x: 1, y: 3 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 3, y: 3, w: 0, h: -8 }];
PawnSetupParams.fence_r_c_ltb = ['fence_r_c_ltb', [0.5, 0], { name: 'null', start: { x: 2, y: 3 }, end: { x: 2, y: 3 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 3, y: 32, w: 0, h: -8 }];

PawnSetupParams.fence_bl_c_tr = ['fence_bl_c_tr', [0.5, 0], { name: 'null', start: { x: 0, y: 4 }, end: { x: 0, y: 4 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 3, y: 1, w: 0, h: -8 }];
PawnSetupParams.fence_b_c_ltr = ['fence_b_c_ltr', [0.5, 0], { name: 'null', start: { x: 1, y: 4 }, end: { x: 1, y: 4 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 32, y: 1, w: 0, h: -8 }];
PawnSetupParams.fence_br_c_lt = ['fence_br_c_lt', [0.5, 0], { name: 'null', start: { x: 2, y: 4 }, end: { x: 2, y: 4 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'fence', 0, { x: 3, y: 1, w: 0, h: -8 }];

PawnSetupParams.stonewall_l_c_r = ['stonewall_l_c_r', [0.5, 0], { name: 'null', start: { x: 17, y: 32 }, end: { x: 17, y: 32 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 21, y: 22, w: 0, h: 32 }];
PawnSetupParams.stonewall_m_c_lr = ['stonewall_m_c_lr', [0.5, 0], { name: 'null', start: { x: 18, y: 32 }, end: { x: 18, y: 32 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 32, y: 22, w: 0, h: 32 }];
PawnSetupParams.stonewall_r_c_l = ['stonewall_r_c_l', [0.5, 0], { name: 'null', start: { x: 19, y: 32 }, end: { x: 19, y: 32 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 21, y: 22, w: 0, h: 32 }];

PawnSetupParams.stonewall_b_c_t = ['stonewall_b_c_t', [0.5, 0], { name: 'null', start: { x: 17, y: 33 }, end: { x: 17, y: 33 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 10, y: 22, w: 0, h: 32 }];
PawnSetupParams.stonewall_m_c_td = ['stonewall_m_c_td', [0.5, 0], { name: 'null', start: { x: 18, y: 33 }, end: { x: 18, y: 33 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 10, y: 32, w: 0, h: 76 }];
PawnSetupParams.stonewall_t_c_b = ['stonewall_t_c_b', [0.5, 0], { name: 'null', start: { x: 19, y: 33 }, end: { x: 19, y: 33 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 10, y: 22, w: 0, h: 76 }];

PawnSetupParams.stonewall_tl_c_br = ['stonewall_tl_c_br', [0.5, 0], { name: 'null', start: { x: 17, y: 34 }, end: { x: 17, y: 34 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 21, y: 22, w: 0, h: 76 }];
PawnSetupParams.stonewall_t_c_lbr = ['stonewall_t_c_lbr', [0.5, 0], { name: 'null', start: { x: 18, y: 34 }, end: { x: 18, y: 34 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 32, y: 22, w: 0, h: 76 }];
PawnSetupParams.stonewall_tr_c_lb = ['stonewall_tr_c_lb', [0.5, 0], { name: 'null', start: { x: 19, y: 34 }, end: { x: 19, y: 34 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 21, y: 22, w: 0, h: 76 }];

PawnSetupParams.stonewall_l_c_trb = ['stonewall_l_c_trb', [0.5, 0], { name: 'null', start: { x: 17, y: 35 }, end: { x: 17, y: 35 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 10, y: 32, w: 0, h: 64 }];
PawnSetupParams.stonewall_m_c_ltrb = ['stonewall_m_c_ltrb', [0.5, 0], { name: 'null', start: { x: 18, y: 35 }, end: { x: 18, y: 35 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 10, y: 10, w: 0, h: 64 }];
PawnSetupParams.stonewall_r_c_ltb = ['stonewall_r_c_ltb', [0.5, 0], { name: 'null', start: { x: 19, y: 35 }, end: { x: 19, y: 35 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 10, y: 32, w: 0, h: 64 }];

PawnSetupParams.stonewall_bl_c_tr = ['stonewall_bl_c_tr', [0.5, 0], { name: 'null', start: { x: 17, y: 36 }, end: { x: 17, y: 36 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 21, y: 22, w: 0, h: 32 }];
PawnSetupParams.stonewall_b_c_ltr = ['stonewall_b_c_ltr', [0.5, 0], { name: 'null', start: { x: 18, y: 36 }, end: { x: 18, y: 36 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 32, y: 22, w: 0, h: 32 }];
PawnSetupParams.stonewall_br_c_lt = ['stonewall_br_c_lt', [0.5, 0], { name: 'null', start: { x: 19, y: 36 }, end: { x: 19, y: 36 }, w: 32, h: 32, animationType: 2, animationSpeed: 1 }, 'terrain', 0, { x: 21, y: 22, w: 0, h: 32 }];

export { PawnSetupParams };