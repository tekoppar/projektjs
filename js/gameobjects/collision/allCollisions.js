import { Vector2D } from '../../internal.js'

/** @type {Object.<string, Vector2D[]>} */ let AllCollisions = {};
/** @type {Object.<string, Vector2D[]>} */ let AllBlockingCollisions = {};

AllCollisions.treeBirch1 = [new Vector2D(46, 160), new Vector2D(35, 156), new Vector2D(40, 147), new Vector2D(41, 80), new Vector2D(14, 73), new Vector2D(1, 66), new Vector2D(2, 36), new Vector2D(21, 5), new Vector2D(40, 0), new Vector2D(68, 3), new Vector2D(84, 15), new Vector2D(95, 40), new Vector2D(95, 59), new Vector2D(81, 77), new Vector2D(56, 79), new Vector2D(57, 147), new Vector2D(62, 155)];
AllCollisions.treeBirch2 = [new Vector2D(49, 128), new Vector2D(35, 124), new Vector2D(40, 116), new Vector2D(40, 80), new Vector2D(14, 73), new Vector2D(1, 66), new Vector2D(2, 36), new Vector2D(18, 9), new Vector2D(41, 0), new Vector2D(57, 1), new Vector2D(69, 4), new Vector2D(84, 15), new Vector2D(95, 41), new Vector2D(95, 56), new Vector2D(81, 76), new Vector2D(56, 80), new Vector2D(56, 116), new Vector2D(62, 122)];
AllCollisions.treePine1 = [new Vector2D(48, 161), new Vector2D(35, 157), new Vector2D(40, 149), new Vector2D(39, 114), new Vector2D(20, 109), new Vector2D(4, 94), new Vector2D(7, 66), new Vector2D(31, 31), new Vector2D(50, 19), new Vector2D(65, 28), new Vector2D(90, 60), new Vector2D(92, 83), new Vector2D(87, 104), new Vector2D(68, 112), new Vector2D(56, 115), new Vector2D(56, 147), new Vector2D(62, 156)];
AllCollisions.treePine2 = [new Vector2D(48, 130), new Vector2D(36, 123), new Vector2D(40, 117), new Vector2D(39, 103), new Vector2D(21, 110), new Vector2D(6, 92), new Vector2D(8, 66), new Vector2D(32, 29), new Vector2D(51, 19), new Vector2D(65, 28), new Vector2D(88, 58), new Vector2D(92, 82), new Vector2D(87, 104), new Vector2D(68, 112), new Vector2D(57, 112), new Vector2D(57, 117), new Vector2D(62, 123)];
AllCollisions.treePine3 = [new Vector2D(48, 192), new Vector2D(36, 188), new Vector2D(40, 181), new Vector2D(40, 106), new Vector2D(20, 111), new Vector2D(5, 91), new Vector2D(7, 65), new Vector2D(33, 29), new Vector2D(49, 20), new Vector2D(66, 27), new Vector2D(89, 58), new Vector2D(92, 81), new Vector2D(86, 103), new Vector2D(56, 116), new Vector2D(56, 178), new Vector2D(62, 187)];
AllCollisions.treePine1v2 = [new Vector2D(48, 160), new Vector2D(34, 156), new Vector2D(39, 149), new Vector2D(39, 89), new Vector2D(19, 94), new Vector2D(3, 77), new Vector2D(5, 50), new Vector2D(31, 12), new Vector2D(49, 4), new Vector2D(72, 20), new Vector2D(87, 42), new Vector2D(90, 66), new Vector2D(86, 87), new Vector2D(57, 98), new Vector2D(56, 148), new Vector2D(63, 155)];
AllCollisions.treePine2v2 = [new Vector2D(49, 128), new Vector2D(36, 124), new Vector2D(39, 117), new Vector2D(39, 89), new Vector2D(17, 95), new Vector2D(2, 75), new Vector2D(5, 50), new Vector2D(30, 14), new Vector2D(47, 4), new Vector2D(70, 21), new Vector2D(85, 42), new Vector2D(89, 66), new Vector2D(84, 85), new Vector2D(66, 96), new Vector2D(56, 96), new Vector2D(56, 115), new Vector2D(62, 123)];
AllCollisions.rockStone1 = [new Vector2D(0, 0), new Vector2D(64, 0), new Vector2D(64, 64), new Vector2D(0, 64)];
AllCollisions.rockStone2 = [new Vector2D(0, 0), new Vector2D(64, 0), new Vector2D(64, 64), new Vector2D(0, 64)];
AllCollisions.rockStone3 = [new Vector2D(0, 0), new Vector2D(64, 0), new Vector2D(64, 64), new Vector2D(0, 64)];
AllCollisions.coalRock = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 32), new Vector2D(0, 32)];
AllCollisions.ironRock = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 32), new Vector2D(0, 32)];
AllCollisions.tinRock = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 32), new Vector2D(0, 32)];
AllCollisions.copperRock = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 32), new Vector2D(0, 32)];
AllCollisions.silverRock = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 32), new Vector2D(0, 32)];
AllCollisions.goldRock = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 32), new Vector2D(0, 32)];
AllCollisions.lamppost = [new Vector2D(3, 0), new Vector2D(29, 0), new Vector2D(29, 64), new Vector2D(3, 64)];
AllCollisions.house1 = [new Vector2D(0, 0), new Vector2D(224, 0), new Vector2D(224, 256), new Vector2D(0, 256)];
AllCollisions.HouseTest = [new Vector2D(0, 0), new Vector2D(192, 0), new Vector2D(192, 288), new Vector2D(0, 288)];
AllCollisions.woodenChest = [new Vector2D(0, 0), new Vector2D(64, 0), new Vector2D(64, 64), new Vector2D(0, 64)];
AllCollisions.stoneSmelter = [new Vector2D(0, 0), new Vector2D(64, 0), new Vector2D(64, 96), new Vector2D(0, 96)];
AllCollisions.anvil = [new Vector2D(0, 0), new Vector2D(64, 0), new Vector2D(64, 32), new Vector2D(0, 32)];
AllCollisions.workbench = [new Vector2D(0, 0), new Vector2D(64, 0), new Vector2D(64, 64), new Vector2D(0, 64)];
AllCollisions.choppingBlock = [new Vector2D(0, 0), new Vector2D(64, 0), new Vector2D(64, 64), new Vector2D(0, 64)];
AllCollisions.planerBench = [new Vector2D(0, 0), new Vector2D(96, 0), new Vector2D(96, 64), new Vector2D(0, 64)];
AllCollisions.stoneCutter = [new Vector2D(0, 0), new Vector2D(64, 0), new Vector2D(64, 64), new Vector2D(0, 64)];
AllCollisions.woodenFloor2x2 = [new Vector2D(0, 0), new Vector2D(64, 0), new Vector2D(64, 64), new Vector2D(0, 64)];
AllCollisions.sawTable = [new Vector2D(0, 0), new Vector2D(64, 0), new Vector2D(64, 64), new Vector2D(0, 64)];
AllCollisions.planningTable = [new Vector2D(0, 0), new Vector2D(64, 0), new Vector2D(64, 64), new Vector2D(0, 64)];
AllCollisions.waterFilledBoat = [new Vector2D(0, 0), new Vector2D(128, 0), new Vector2D(128, 64), new Vector2D(0, 64)];
AllCollisions.woodenFloor = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 32), new Vector2D(0, 32)];
AllCollisions.woodenWall = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 32), new Vector2D(0, 32)];
AllCollisions.woodenWallLeftSide = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 32), new Vector2D(0, 32)];
AllCollisions.woodenWallRightSide = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 32), new Vector2D(0, 32)];

AllCollisions.woodenWallLeft = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 96), new Vector2D(0, 96)];
AllCollisions.woodenWallMiddle = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 96), new Vector2D(0, 96)];
AllCollisions.woodenWallRight = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 96), new Vector2D(0, 96)];

AllCollisions.wallMiddle = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 96), new Vector2D(0, 96)];
AllCollisions.wallLeft = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 96), new Vector2D(0, 96)];
AllCollisions.wallRight = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 96), new Vector2D(0, 96)];

AllCollisions.wallTop = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 96), new Vector2D(0, 96)];
AllCollisions.wallTopLeft = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 96), new Vector2D(0, 96)];
AllCollisions.wallTopRight = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 96), new Vector2D(0, 96)];

AllCollisions.wallBottom = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 96), new Vector2D(0, 96)];
AllCollisions.wallBottomLeft = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 96), new Vector2D(0, 96)];
AllCollisions.wallBottomRight = [new Vector2D(0, 0), new Vector2D(32, 0), new Vector2D(32, 96), new Vector2D(0, 96)];

AllBlockingCollisions.house1 = [new Vector2D(0, 160), new Vector2D(224, 160), new Vector2D(224, 256), new Vector2D(0, 256)];
AllBlockingCollisions.HouseTest = [new Vector2D(32, 192), new Vector2D(192, 192), new Vector2D(192, 288), new Vector2D(32, 288)];
AllBlockingCollisions.woodenChest = [new Vector2D(10, 32), new Vector2D(54, 32), new Vector2D(54, 64), new Vector2D(10, 64)];
AllBlockingCollisions.stoneSmelter = [new Vector2D(0, 64), new Vector2D(64, 64), new Vector2D(64, 88), new Vector2D(0, 88)];
AllBlockingCollisions.anvil = [new Vector2D(14, 14), new Vector2D(54, 14), new Vector2D(54, 24), new Vector2D(14, 24)];
AllBlockingCollisions.workbench = [new Vector2D(5, 14), new Vector2D(59, 14), new Vector2D(59, 54), new Vector2D(5, 54)];
AllBlockingCollisions.choppingBlock = [new Vector2D(7, 38), new Vector2D(20, 28), new Vector2D(32, 26), new Vector2D(34, 12), new Vector2D(35, 13), new Vector2D(59, 13), new Vector2D(60, 29), new Vector2D(55, 36), new Vector2D(32, 51)];
AllBlockingCollisions.planerBench = [new Vector2D(16, 29), new Vector2D(79, 29), new Vector2D(79, 59), new Vector2D(16, 59)];
AllBlockingCollisions.stoneCutter = [new Vector2D(9, 38), new Vector2D(53, 38), new Vector2D(53, 53), new Vector2D(9, 53)];
AllBlockingCollisions.woodenFloor2x2 = [new Vector2D(9, 38), new Vector2D(53, 38), new Vector2D(53, 53), new Vector2D(9, 53)];
AllBlockingCollisions.sawTable = [new Vector2D(4, 32), new Vector2D(60, 32), new Vector2D(60, 64), new Vector2D(4, 64)];
AllBlockingCollisions.planningTable = [new Vector2D(4, 22), new Vector2D(60, 22), new Vector2D(60, 48), new Vector2D(4, 48)];
AllBlockingCollisions.waterFilledBoat = [new Vector2D(5, 24), new Vector2D(37, 17), new Vector2D(86, 16), new Vector2D(117, 33), new Vector2D(97, 49), new Vector2D(69, 57), new Vector2D(35, 58), new Vector2D(4, 52)];
AllBlockingCollisions.stonewall_l_c_r = [new Vector2D(12, 22), new Vector2D(32, 22), new Vector2D(32, 32), new Vector2D(12, 32)];
AllBlockingCollisions.stonewall_m_c_lr = [new Vector2D(0, 22), new Vector2D(32, 22), new Vector2D(32, 32), new Vector2D(0, 32)];
AllBlockingCollisions.stonewall_r_c_l = [new Vector2D(0, 22), new Vector2D(20, 22), new Vector2D(20, 32), new Vector2D(0, 32)];
AllBlockingCollisions.stonewall_b_c_t = [new Vector2D(12, 0), new Vector2D(20, 0), new Vector2D(20, 32), new Vector2D(12, 32)];
AllBlockingCollisions.stonewall_m_c_td = [new Vector2D(12, 0), new Vector2D(20, 0), new Vector2D(20, 32), new Vector2D(12, 32)];
AllBlockingCollisions.stonewall_t_c_b = [new Vector2D(12, 20), new Vector2D(20, 20), new Vector2D(20, 32), new Vector2D(12, 32)];
AllBlockingCollisions.stonewall_tl_c_br = [new Vector2D(12, 22), new Vector2D(32, 22), new Vector2D(32, 32), new Vector2D(12, 32)];
AllBlockingCollisions.stonewall_t_c_lbr = [new Vector2D(0, 22), new Vector2D(32, 22), new Vector2D(32, 32), new Vector2D(0, 32)];
AllBlockingCollisions.stonewall_tr_c_lb = [new Vector2D(0, 22), new Vector2D(20, 22), new Vector2D(20, 32), new Vector2D(0, 32)];
AllBlockingCollisions.stonewall_l_c_trb = [new Vector2D(12, 0), new Vector2D(20, 0), new Vector2D(20, 22), new Vector2D(32, 22), new Vector2D(32, 32), new Vector2D(12, 32)];
AllBlockingCollisions.stonewall_m_c_ltrb = [new Vector2D(0, 22), new Vector2D(12, 22), new Vector2D(12, 0), new Vector2D(20, 0), new Vector2D(20, 22), new Vector2D(32, 22), new Vector2D(32, 32), new Vector2D(0, 32)];
AllBlockingCollisions.stonewall_r_c_ltb = [new Vector2D(0, 22), new Vector2D(12, 22), new Vector2D(12, 0), new Vector2D(20, 0), new Vector2D(20, 32), new Vector2D(0, 32)];
AllBlockingCollisions.stonewall_bl_c_tr = [new Vector2D(12, 0), new Vector2D(20, 0), new Vector2D(20, 22), new Vector2D(32, 22), new Vector2D(32, 32), new Vector2D(12, 32)];
AllBlockingCollisions.stonewall_b_c_ltr = [new Vector2D(0, 22), new Vector2D(12, 22), new Vector2D(12, 0), new Vector2D(20, 0), new Vector2D(20, 22), new Vector2D(32, 22), new Vector2D(32, 32), new Vector2D(0, 32)];
AllBlockingCollisions.stonewall_br_c_lt = [new Vector2D(0, 22), new Vector2D(12, 22), new Vector2D(12, 0), new Vector2D(20, 0), new Vector2D(20, 32), new Vector2D(0, 32)];
AllBlockingCollisions.woodenFloor = [new Vector2D(0, 0), new Vector2D(0, 0), new Vector2D(0, 0), new Vector2D(0, 0)];
AllBlockingCollisions.woodenWall = [new Vector2D(0, 0), new Vector2D(0, 0), new Vector2D(0, 0), new Vector2D(0, 0)];
AllBlockingCollisions.wallsBottom = [new Vector2D(0, 20), new Vector2D(32, 20), new Vector2D(32, 26), new Vector2D(0, 26)];
AllBlockingCollisions.woodenWallLeftSide = [new Vector2D(0, 0), new Vector2D(6, 0), new Vector2D(6, 32), new Vector2D(0, 32)];
AllBlockingCollisions.woodenWallRightSide = [new Vector2D(26, 0), new Vector2D(32, 0), new Vector2D(32, 32), new Vector2D(26, 32)];

AllBlockingCollisions.woodenWallLeft = [new Vector2D(0, 84), new Vector2D(32, 84), new Vector2D(32, 90), new Vector2D(0, 90)];
AllBlockingCollisions.woodenWallMiddle = [new Vector2D(0, 84), new Vector2D(32, 84), new Vector2D(32, 90), new Vector2D(0, 90)];
AllBlockingCollisions.woodenWallRight = [new Vector2D(0, 84), new Vector2D(32, 84), new Vector2D(32, 90), new Vector2D(0, 90)];

AllBlockingCollisions.wallMiddle = [new Vector2D(0, 84), new Vector2D(32, 84), new Vector2D(32, 90), new Vector2D(0, 90)];
AllBlockingCollisions.wallLeft = [new Vector2D(2, 64), new Vector2D(10, 64), new Vector2D(10, 96), new Vector2D(2, 96)];
AllBlockingCollisions.wallRight = [new Vector2D(24, 64), new Vector2D(30, 64), new Vector2D(30, 96), new Vector2D(24, 96)];

AllBlockingCollisions.wallTop = [new Vector2D(0, 84), new Vector2D(32, 84), new Vector2D(32, 90), new Vector2D(0, 90)];
AllBlockingCollisions.wallTopLeft = [new Vector2D(0, 84), new Vector2D(32, 84), new Vector2D(32, 90), new Vector2D(0, 90)];
AllBlockingCollisions.wallTopRight = [new Vector2D(0, 84), new Vector2D(32, 84), new Vector2D(32, 90), new Vector2D(0, 90)];

AllBlockingCollisions.wallBottom = [new Vector2D(0, 84), new Vector2D(32, 84), new Vector2D(32, 90), new Vector2D(0, 90)];
AllBlockingCollisions.wallBottomLeft = [new Vector2D(0, 84), new Vector2D(32, 84), new Vector2D(32, 90), new Vector2D(0, 90)];
AllBlockingCollisions.wallBottomRight = [new Vector2D(0, 84), new Vector2D(32, 84), new Vector2D(32, 90), new Vector2D(0, 90)];

export { AllCollisions, AllBlockingCollisions };