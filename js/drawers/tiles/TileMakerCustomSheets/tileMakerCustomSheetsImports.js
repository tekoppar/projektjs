import { ObjectsHasBeenInitialized, AtlasController, inventoryItemIcons, AllAnimationSkeletonsList, AllAnimationsList, Vector2D } from '../../../internal.js';
import { CreateNewSheet } from './tileMakerSword.js';

function GenerateCustomSheets() {
    if (ObjectsHasBeenInitialized === true && (AtlasController._Instance.isLoadingFinished == null || AtlasController._Instance.isLoadingFinished === true)) {
        let swordCanvas = document.createElement('canvas');

        CreateNewSheet(
            swordCanvas,
            inventoryItemIcons.ironSword,
            new Vector2D(32, 32),
            'ironSword',
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
                    canvas: AtlasController.GetAtlas('femaleLight').GetCanvas()
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkLeft.frames,
                    canvas: AtlasController.GetAtlas('femaleLight').GetCanvas()
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkDown.frames,
                    canvas: AtlasController.GetAtlas('femaleLight').GetCanvas()
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkRight.frames,
                    canvas: AtlasController.GetAtlas('femaleLight').GetCanvas()
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
                    canvas: AtlasController.GetAtlas('femaleLight').GetCanvas()
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkLeft.frames,
                    canvas: AtlasController.GetAtlas('femaleLight').GetCanvas()
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkDown.frames,
                    canvas: AtlasController.GetAtlas('femaleLight').GetCanvas()
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkRight.frames,
                    canvas: AtlasController.GetAtlas('femaleLight').GetCanvas()
                },
            ]
        );

        let axeCanvas = document.createElement('canvas');

        CreateNewSheet(
            axeCanvas,
            inventoryItemIcons.ironAxe,
            new Vector2D(32, 32),
            'ironAxe',
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
                    canvas: AtlasController.GetAtlas('femaleLight').GetCanvas()
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkLeft.frames,
                    canvas: AtlasController.GetAtlas('femaleLight').GetCanvas()
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkDown.frames,
                    canvas: AtlasController.GetAtlas('femaleLight').GetCanvas()
                },
                {
                    frames: AllAnimationsList.femaleAnimations.walkRight.frames,
                    canvas: AtlasController.GetAtlas('femaleLight').GetCanvas()
                },
            ]
        );
    } else {
        window.requestAnimationFrame(() => GenerateCustomSheets());
    }
}

export { GenerateCustomSheets };