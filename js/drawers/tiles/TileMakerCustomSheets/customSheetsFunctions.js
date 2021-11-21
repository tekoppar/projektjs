import { Vector2D } from "../../../internal.js";

function XORCanvasSprite(ctx, bone, canvasSpriteSize = new Vector2D(32, 32), frame = undefined, xorCanvas = undefined) {
    if (frame === undefined || xorCanvas === undefined)
        return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(
        xorCanvas,
        (frame.x * frame.w),// + bone.x,
        (frame.y * frame.h),// + bone.y,
        frame.w,
        frame.h,
        canvasSpriteSize.x - (frame.w / 2) - bone.x,
        canvasSpriteSize.y - (frame.h / 2) - bone.y,
        frame.w,
        frame.h,
    );
    ctx.globalCompositeOperation = 'source-over';
}

export { XORCanvasSprite };