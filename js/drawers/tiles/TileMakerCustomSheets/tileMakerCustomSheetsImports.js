import { CanvasDrawer, ObjectsHasBeenInitialized, inventoryItemIcons, AllAnimationSkeletonsList, AllAnimationsList, Vector2D } from '../../../internal.js';
import { CreateNewSheet } from './tileMakerSword.js';

function GenerateCustomSheets() {
    if (ObjectsHasBeenInitialized === true && (CanvasDrawer.GCD.isLoadingFinished == null || CanvasDrawer.GCD.isLoadingFinished === true)) {
        let swordCanvas = document.createElement('canvas');

        CreateNewSheet(
            swordCanvas,
            inventoryItemIcons.sword,
            new Vector2D(32, 32),
            'sword',
            [
                AllAnimationSkeletonsList.femaleAnimations.sword.walkUp,
                AllAnimationSkeletonsList.femaleAnimations.sword.walkLeft,
                AllAnimationSkeletonsList.femaleAnimations.sword.walkDown,
                AllAnimationSkeletonsList.femaleAnimations.sword.walkRight,
                AllAnimationSkeletonsList.femaleAnimations.sword.meleeUp,
                AllAnimationSkeletonsList.femaleAnimations.sword.meleeLeft,
                AllAnimationSkeletonsList.femaleAnimations.sword.meleeDown,
                AllAnimationSkeletonsList.femaleAnimations.sword.meleeRight,
            ],
            [
                {
                    frames: AllAnimationsList.femaleAnimations.walkUp.frames,
                    canvas: CanvasDrawer.GCD.GetAtlas('femaleLight').canvas
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkLeft.frames,
                    canvas: CanvasDrawer.GCD.GetAtlas('femaleLight').canvas
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkDown.frames,
                    canvas: CanvasDrawer.GCD.GetAtlas('femaleLight').canvas
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkRight.frames,
                    canvas: CanvasDrawer.GCD.GetAtlas('femaleLight').canvas
                },
            ]
        );

        let pickaxeCanvas = document.createElement('canvas');

        CreateNewSheet(
            pickaxeCanvas,
            inventoryItemIcons.pickaxe,
            new Vector2D(32, 32),
            'pickaxe',
            [
                AllAnimationSkeletonsList.femaleAnimations.sword.walkUp,
                AllAnimationSkeletonsList.femaleAnimations.sword.walkLeft,
                AllAnimationSkeletonsList.femaleAnimations.sword.walkDown,
                AllAnimationSkeletonsList.femaleAnimations.sword.walkRight,
                AllAnimationSkeletonsList.femaleAnimations.sword.meleeUp,
                AllAnimationSkeletonsList.femaleAnimations.sword.meleeLeft,
                AllAnimationSkeletonsList.femaleAnimations.sword.meleeDown,
                AllAnimationSkeletonsList.femaleAnimations.sword.meleeRight,
            ],
            [
                {
                    frames: AllAnimationsList.femaleAnimations.walkUp.frames,
                    canvas: CanvasDrawer.GCD.GetAtlas('femaleLight').canvas
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkLeft.frames,
                    canvas: CanvasDrawer.GCD.GetAtlas('femaleLight').canvas
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkDown.frames,
                    canvas: CanvasDrawer.GCD.GetAtlas('femaleLight').canvas
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkRight.frames,
                    canvas: CanvasDrawer.GCD.GetAtlas('femaleLight').canvas
                },
            ]
        );

        let axeCanvas = document.createElement('canvas');

        CreateNewSheet(
            axeCanvas,
            inventoryItemIcons.axe,
            new Vector2D(32, 32),
            'axe',
            [
                AllAnimationSkeletonsList.femaleAnimations.sword.walkUp,
                AllAnimationSkeletonsList.femaleAnimations.sword.walkLeft,
                AllAnimationSkeletonsList.femaleAnimations.sword.walkDown,
                AllAnimationSkeletonsList.femaleAnimations.sword.walkRight,
                AllAnimationSkeletonsList.femaleAnimations.sword.meleeUp,
                AllAnimationSkeletonsList.femaleAnimations.sword.meleeLeft,
                AllAnimationSkeletonsList.femaleAnimations.sword.meleeDown,
                AllAnimationSkeletonsList.femaleAnimations.sword.meleeRight,
            ],
            [
                {
                    frames: AllAnimationsList.femaleAnimations.walkUp.frames,
                    canvas: CanvasDrawer.GCD.GetAtlas('femaleLight').canvas
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkLeft.frames,
                    canvas: CanvasDrawer.GCD.GetAtlas('femaleLight').canvas
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkDown.frames,
                    canvas: CanvasDrawer.GCD.GetAtlas('femaleLight').canvas
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkRight.frames,
                    canvas: CanvasDrawer.GCD.GetAtlas('femaleLight').canvas
                },
            ]
        );
    } else {
        window.requestAnimationFrame(() => GenerateCustomSheets());
    }
}

export { GenerateCustomSheets };