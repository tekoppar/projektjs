import { Tree, Rock, Shop } from './internal.js';

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
}

export { ObjectClassLUT };