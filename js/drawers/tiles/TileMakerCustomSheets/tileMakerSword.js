import { TileMaker, Tile, CanvasAtlasObject, Vector2D, CanvasDrawer, AtlasController, ReverseAtlasLUT } from '../../../internal.js';

export function CreateNewSheet(canvas, itemIcon, spriteSize, spriteSheetName, skeletalAnimations, xorDataList) {
	let tempTile = new Tile(
		new Vector2D(0, 0),
		new Vector2D(itemIcon.sprite.x, itemIcon.sprite.y),
		new Vector2D(itemIcon.sprite.z, itemIcon.sprite.a),
		true,
		ReverseAtlasLUT[itemIcon.url]
	);

	canvas.setAttribute('width', spriteSize.x * skeletalAnimations.length);
	canvas.setAttribute('height', spriteSize.y * skeletalAnimations.length);

	for (let i = 0, l = skeletalAnimations.length; i < l; ++i) {
		TileMaker.TileBonesToCanvas(
			tempTile,
			canvas,
			skeletalAnimations[i],
			spriteSize,
			i,
			xorDataList[i] !== undefined ? xorDataList[i] : undefined
		);
	}

	let newCanvasAtlas = new CanvasAtlasObject(CanvasDrawer.GCD, canvas.toDataURL('image/png'), canvas.width, canvas.height, skeletalAnimations[0].size.x, spriteSheetName);
	AtlasController.AddAtlas(newCanvasAtlas, spriteSheetName);
	//TileMaker.SplitAtlasToTiles({canvas:swordCanvas, name:'swordMelee', width: swordCanvas.width,height:swordCanvas.height}, new Vector2D(64, 64));
}