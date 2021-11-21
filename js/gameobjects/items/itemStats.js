import { Vector2D, AllAnimationsList, AllAnimationSkeletonsList } from '../../internal.js';

let ItemStats = {};

ItemStats.axe = {durability: 250, tilePreview: true, characterAnimation: 'melee', animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword, atlas: 'shortSwordFemale', bones: AllAnimationSkeletonsList.femaleAnimations.sword};
ItemStats.shovel = {durability: 250, tilePreview: true, characterAnimation: 'melee', animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword, atlas: 'shortSwordFemale', bones: AllAnimationSkeletonsList.femaleAnimations.sword};
ItemStats.pickaxe = {durability: 250, tilePreview: true, characterAnimation: 'melee', animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword, atlas: 'shortSwordFemale', bones: AllAnimationSkeletonsList.femaleAnimations.sword};
ItemStats.hoe = {durability: 250, tilePreview: true};
ItemStats.sword = {durability: 250, damage: new Vector2D(5, 10), tilePreview: false, characterAnimation: 'melee', animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword, atlas: 'shortSwordFemale', bones: AllAnimationSkeletonsList.femaleAnimations.sword};

export { ItemStats };