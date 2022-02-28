import { CraftingRecipes } from '../../internal.js';

/** @type {Object.<string, (Array|Object)>} */ let PawnSetupParams = {};

PawnSetupParams.treeBirch1 = ['Tree Birch', [0.5, 0], undefined, 'treeBirch1'];
PawnSetupParams.treeBirch2 = ['Tree Birch', [0.5, 0], undefined, 'treeBirch2'];

PawnSetupParams.treePine1 = ['Tree Pine', [0.5, 0], undefined, 'treePine1'];
PawnSetupParams.treePine2 = ['Tree Pine', [0.5, 0], undefined, 'treePine2'];
PawnSetupParams.treePine3 = ['Tree Pine', [0.5, 0], undefined, 'treePine3'];
PawnSetupParams.treePine1v2 = ['Tree Pine', [0.5, 0], undefined, 'treePine1v2'];
PawnSetupParams.treePine2v2 = ['Tree Pine', [0.5, 0], undefined, 'treePine2v2'];
PawnSetupParams.treePine3v2 = ['Tree Pine', [0.5, 0], undefined, 'treePine3v2'];

PawnSetupParams.house1 = ['House 1', [0.5, 0], undefined, 'house1', { x: 192, y: 288, z: 0, a: 288 }];
PawnSetupParams.HouseTest = ['House Test', [0.5, 0], undefined, 'HouseTest', { x: 192, y: 288, z: 0, a: 288 }];

PawnSetupParams.woodenChest = ['Wooden Chest', [0.5, 0], undefined, 'woodenChest'];

PawnSetupParams.woodenFloor = ['Wooden Floor', [0, 0], undefined, 'woodenFloor', { x: 32, y: -32, w: 0, h: -32 }, 'floors', 'floorCarpetPatternRed'];

PawnSetupParams.stoneSmelter = ['Stone Smelter', [0.5, 0], undefined, 'stoneSmelter', CraftingRecipes.CraftingRecipeKeys.CraftingRecipeListSmelter, { x: 64, y: 96, z: 0, a: 96 }];
PawnSetupParams.anvil = ['Anvil', [0.5, 0], undefined, 'anvil', CraftingRecipes.CraftingRecipeKeys.CraftingRecipeListAnvil, { x: 64, y: 32, z: 0, a: 24 }];
PawnSetupParams.workbench = ['Workbench', [0.5, 0], undefined, 'workbench', CraftingRecipes.CraftingRecipeKeys.CraftingRecipeListWorkbench, { x: 64, y: 64, z: 0, a: 42 }];
PawnSetupParams.choppingBlock = ['Chopping Block', [0.5, 0], undefined, 'choppingBlock', CraftingRecipes.CraftingRecipeKeys.CraftingRecipeListChoppingBlock, { x: 64, y: 64, z: 0, a: 32 }];
PawnSetupParams.planerBench = ['Planer Bench', [0.5, 0], undefined, 'planerBench', CraftingRecipes.CraftingRecipeKeys.CraftingRecipeListPlanerBench, { x: 64, y: 64, z: 0, a: 42 }];
PawnSetupParams.stoneCutter = {
	woodenFloor2x2: ['Wooden Floor 2x2', [0.5, 0], undefined, 'woodenFloor2x2', { x: 64, y: -32, w: 0, h: -32 }],
	stoneCutter: ['Stone Cutter', [0.5, 0], undefined, 'stoneCutter', CraftingRecipes.CraftingRecipeKeys.CraftingRecipeListStoneCutter, { x: 64, y: 64, z: 0, a: 42 }]
};
PawnSetupParams.sawTable = ['Saw Table', [0.5, 0], undefined, 'sawTable', CraftingRecipes.CraftingRecipeKeys.CraftingRecipeListSawTable, { x: 64, y: 64, z: 0, a: 42 }];

PawnSetupParams.planningTable = ['Planning Table', [0.5, 0], undefined, 'planningTable', { x: 64, y: 64, z: 0, a: 42 }];

PawnSetupParams.waterFilledBoat = ['Water Filled Boat', [0.5, 0], undefined, 'waterFilledBoat'];

PawnSetupParams.bush1 = ['Bush 1', [0.5, 0], undefined, 'terrain', { x: 20, y: 10, w: 0, h: 0 }];
PawnSetupParams.bush2 = ['Bush 2', [0.5, 0], undefined, 'terrain', { x: 20, y: 10, w: 0, h: 0 }];

PawnSetupParams.rockStone1 = ['Rock Stone', [0.5, 0], undefined, 'rockStone1', { x: 64, y: 32, w: 0, h: 0 }, { x: 13.5, y: 25, w: 64, h: 32 }];
PawnSetupParams.rockStone2 = ['Rock Stone', [0.5, 0], undefined, 'rockStone2', { x: 64, y: 32, w: 0, h: 0 }, { x: 13.5, y: 25, w: 64, h: 32 }];
PawnSetupParams.rockStone3 = ['Rock Stone', [0.5, 0], undefined, 'rockStone3', { x: 64, y: 32, w: 0, h: 0 }, { x: 13.5, y: 25, w: 64, h: 32 }];

PawnSetupParams.coalRock = ['Coal Rock', [0.5, 0], undefined, 'coalRock', { x: 32, y: 32, w: 0, h: 0 }, { x: 13.5, y: 25, w: 32, h: 32 }];
PawnSetupParams.ironRock = ['Iron Rock', [0.5, 0], undefined, 'ironRock', { x: 32, y: 32, w: 0, h: 0 }, { x: 13.5, y: 25, w: 32, h: 32 }];
PawnSetupParams.tinRock = ['Tin Rock', [0.5, 0], undefined, 'tinRock', { x: 32, y: 32, w: 0, h: 0 }, { x: 13.5, y: 25, w: 32, h: 32 }];
PawnSetupParams.copperRock = ['Copper Rock', [0.5, 0], undefined, 'copperRock', { x: 32, y: 32, w: 0, h: 0 }, { x: 13.5, y: 25, w: 32, h: 32 }];
PawnSetupParams.silverRock = ['silver Rock', [0.5, 0], undefined, 'silverRock', { x: 32, y: 32, w: 0, h: 0 }, { x: 13.5, y: 25, w: 32, h: 32 }];
PawnSetupParams.goldRock = ['Gold Rock', [0.5, 0], undefined, 'goldRock', { x: 32, y: 32, w: 0, h: 0 }, { x: 13.5, y: 25, w: 32, h: 32 }];

PawnSetupParams.lamppost = ['Lamppost', [0.5, 0], undefined, 'lamppost'];

PawnSetupParams.fence_l_c_r = ['fence_l_c_r', [0.5, 0], undefined, 'fence', { x: 32, y: 1, w: 0, h: -8 }];
PawnSetupParams.fence_m_c_lr = ['fence_m_c_lr', [0.5, 0], undefined, 'fence', { x: 32, y: 1, w: 0, h: -8 }];
PawnSetupParams.fence_r_c_l = ['fence_r_c_l', [0.5, 0], undefined, 'fence', { x: 32, y: 1, w: 0, h: -8 }];

PawnSetupParams.fence_b_c_t = ['fence_b_c_t', [0.5, 0], undefined, 'fence', { x: 3, y: 32, w: 0, h: -8 }];
PawnSetupParams.fence_m_c_td = ['fence_m_c_td', [0.5, 0], undefined, 'fence', { x: 3, y: 32, w: 0, h: 0 }];
PawnSetupParams.fence_t_c_b = ['fence_t_c_b', [0.5, 0], undefined, 'fence', { x: 3, y: 32, w: 0, h: 0 }];

PawnSetupParams.fence_tl_c_br = ['fence_tl_c_br', [0.5, 0], undefined, 'fence', { x: 3, y: 1, w: 0, h: -8 }];
PawnSetupParams.fence_t_c_lbr = ['fence_t_c_lbr', [0.5, 0], undefined, 'fence', { x: 32, y: 1, w: 0, h: -8 }];
PawnSetupParams.fence_tr_c_lb = ['fence_tr_c_lb', [0.5, 0], undefined, 'fence', { x: 3, y: 1, w: 0, h: -8 }];

PawnSetupParams.fence_l_c_trb = ['fence_l_c_trb', [0.5, 0], undefined, 'fence', { x: 3, y: 32, w: 0, h: -8 }];
PawnSetupParams.fence_m_c_ltrb = ['fence_m_c_ltrb', [0.5, 0], undefined, 'fence', { x: 3, y: 3, w: 0, h: -8 }];
PawnSetupParams.fence_r_c_ltb = ['fence_r_c_ltb', [0.5, 0], undefined, 'fence', { x: 3, y: 32, w: 0, h: -8 }];

PawnSetupParams.fence_bl_c_tr = ['fence_bl_c_tr', [0.5, 0], undefined, 'fence', { x: 3, y: 1, w: 0, h: -8 }];
PawnSetupParams.fence_b_c_ltr = ['fence_b_c_ltr', [0.5, 0], undefined, 'fence', { x: 32, y: 1, w: 0, h: -8 }];
PawnSetupParams.fence_br_c_lt = ['fence_br_c_lt', [0.5, 0], undefined, 'fence', { x: 3, y: 1, w: 0, h: -8 }];

PawnSetupParams.stonewall_l_c_r = ['stonewall_l_c_r', [0.5, 0], undefined, 'terrain', { x: 21, y: 22, w: 0, h: 32 }];
PawnSetupParams.stonewall_m_c_lr = ['stonewall_m_c_lr', [0.5, 0], undefined, 'terrain', { x: 32, y: 22, w: 0, h: 32 }];
PawnSetupParams.stonewall_r_c_l = ['stonewall_r_c_l', [0.5, 0], undefined, 'terrain', { x: 21, y: 22, w: 0, h: 32 }];

PawnSetupParams.stonewall_b_c_t = ['stonewall_b_c_t', [0.5, 0], undefined, 'terrain', { x: 10, y: 22, w: 0, h: 32 }];
PawnSetupParams.stonewall_m_c_td = ['stonewall_m_c_td', [0.5, 0], undefined, 'terrain', { x: 10, y: 32, w: 0, h: 76 }];
PawnSetupParams.stonewall_t_c_b = ['stonewall_t_c_b', [0.5, 0], undefined, 'terrain', { x: 10, y: 22, w: 0, h: 76 }];

PawnSetupParams.stonewall_tl_c_br = ['stonewall_tl_c_br', [0.5, 0], undefined, 'terrain', { x: 21, y: 22, w: 0, h: 76 }];
PawnSetupParams.stonewall_t_c_lbr = ['stonewall_t_c_lbr', [0.5, 0], undefined, 'terrain', { x: 32, y: 22, w: 0, h: 76 }];
PawnSetupParams.stonewall_tr_c_lb = ['stonewall_tr_c_lb', [0.5, 0], undefined, 'terrain', { x: 21, y: 22, w: 0, h: 76 }];

PawnSetupParams.stonewall_l_c_trb = ['stonewall_l_c_trb', [0.5, 0], undefined, 'terrain', { x: 10, y: 32, w: 0, h: 64 }];
PawnSetupParams.stonewall_m_c_ltrb = ['stonewall_m_c_ltrb', [0.5, 0], undefined, 'terrain', { x: 10, y: 10, w: 0, h: 64 }];
PawnSetupParams.stonewall_r_c_ltb = ['stonewall_r_c_ltb', [0.5, 0], undefined, 'terrain', { x: 10, y: 32, w: 0, h: 64 }];

PawnSetupParams.stonewall_bl_c_tr = ['stonewall_bl_c_tr', [0.5, 0], undefined, 'terrain', { x: 21, y: 22, w: 0, h: 32 }];
PawnSetupParams.stonewall_b_c_ltr = ['stonewall_b_c_ltr', [0.5, 0], undefined, 'terrain', { x: 32, y: 22, w: 0, h: 32 }];
PawnSetupParams.stonewall_br_c_lt = ['stonewall_br_c_lt', [0.5, 0], undefined, 'terrain', { x: 21, y: 22, w: 0, h: 32 }];

export { PawnSetupParams };