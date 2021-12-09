import { DebugDrawer, Rectangle, Color } from '../../internal.js';

class RectConnection {
    constructor(x, y, w, h, parentRect) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.rect = parentRect;
    }
}

let rectMergeCallIndex = 0;

/**
 * Merges overlapping rectangles from an array 
 * @param {Array<Rectangle>} rects 
 * @returns {Array<Rectangle>}
 * @todo doesnt work with non overlapping rectangles
 */
export function RectMerge(rects) {
    rectMergeCallIndex++;
    if (rects.length === 1)
        return rects;

    let corners = [];

    for (let i = 0, l = rects.length; i < l; ++i) {
        let rectCorners = rects[i].GetCornersVector2D();

        for (let i2 = 0, l2 = rectCorners.length; i2 < l2; ++i2) {
            corners.push(new RectConnection(rectCorners[i2].x, rectCorners[i2].y, rects[i].w, rects[i].h, rects[i]));
        }
    }

    corners.sort(function (a, b) {
        if (a.x > b.x) return 1;
        if (a.x < b.x) return -1;
        if (a.y > b.y) return 1;
        if (a.y < b.y) return -1;
        return 0;
    });

    let pairs = [];
    let a = corners[0],
        b = corners[0];
    for (let i = 1, l = corners.length; i < l; ++i) {
        if (a.x === corners[i].x && b.y < corners[i].y)
            b = corners[i];

        if (a.x !== corners[i].x || i >= l - 1) {
            pairs.push([a, b]);
            a = corners[i];
            b = corners[i];
        }
    }

    let newRectangles = [];
    let minY, maxY;
    let temp = new Rectangle(0, 0, 0, 0);
    let currentPairs = pairs[0];
    let currentXEnd = 0;

    minY = currentPairs[0].y;
    maxY = currentPairs[1].y;
    temp.x = currentPairs[0].x;
    temp.y = currentPairs[0].y;
    currentXEnd = currentPairs[0].x + currentPairs[0].w;

    let flagNew = false;
    for (let i = 1, l = pairs.length; i < l; ++i) {
        temp.w = Math.abs(temp.x - pairs[i][0].x);
        temp.h = Math.abs(minY - maxY);

        if (pairs[i][0].y < minY) {
            flagNew = true;
            minY = pairs[i][0].y;
        }
        
        if (pairs[i][1].y > maxY || (pairs[i][1].y < maxY && currentXEnd < pairs[i][1].x)) {
            flagNew = true;
            maxY = pairs[i][1].y;
        }

        if (pairs[i][0].x >= currentXEnd) { 
            flagNew = true;
            temp.w = Math.abs(temp.x - currentXEnd);
            //temp.y = pairs[i][0].y;
            maxY = pairs[i][1].y;
        }

        if (currentPairs[0].x + currentPairs[0].w <= pairs[i][0].x || currentPairs[1].x + currentPairs[1].w <= pairs[i][0].x) {
            flagNew = true;
            maxY = pairs[i][1].y;
        }

        if (i === l - 1) {
            flagNew = true;
            temp.y = pairs[i][0].y;
            temp.h = Math.abs(temp.y - pairs[i][1].y);
        }
        
        if (flagNew === true) {
            //console.log(i, temp, pairs[i], currentPairs);
            newRectangles.push(temp);
            temp = new Rectangle(pairs[i][0].x, minY, 0, 0);

            if (currentXEnd > pairs[i][0].x) {
                temp.x = pairs[i][0].x;
                temp.y = minY;
                //minY = currentPairs[0].y;
                //maxY = pairs[i][1].y;
            } else {
                /*temp.x = pairs[i][0].x;
                temp.y = pairs[i][0].y;
                minY = pairs[i][0].y;
                maxY = pairs[i][1].y;*/
                currentXEnd = pairs[i][0].x + pairs[i][0].w;
            }

            /*if (i === l - 1 && (newRectangles[newRectangles.length - 1].x + newRectangles[newRectangles.length - 1].w) < (pairs[i][0].rect.x + pairs[i][0].rect.w)) {
                temp.w = pairs[i][0].w;
                temp.h = Math.abs(minY - maxY);
                newRectangles.push(temp);
            }*/

            currentPairs = pairs[i];
            flagNew = false;
        }
    }

    /*for (let i = 0, l = rects.length; i < l; ++i) {
        DebugDrawer.AddDebugRectOperation(rects[i], 0.016, Color.CSS_COLOR_NAMES[(rectMergeCallIndex + 1 % (Color.CSS_COLOR_NAMES.length - 1))], false);
    }
    for (let i = 0, l = newRectangles.length; i < l; ++i) {
        DebugDrawer.AddDebugRectOperation(newRectangles[i], 0.016, Color.CSS_COLOR_NAMES[(rectMergeCallIndex % (Color.CSS_COLOR_NAMES.length - 1))], true);
    }*/

    console.log('sorted', rects, corners, pairs, newRectangles);

    return newRectangles;
}