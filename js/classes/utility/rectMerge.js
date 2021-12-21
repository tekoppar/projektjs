//@ts-ignore
import { Rectangle, DebugDrawer, Color, ArrayUtility, Vector2D } from '../../internal.js';

class RectConnection {
	constructor(x, y, w, h, parentRect) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.rect = parentRect;
	}
}

//@ts-ignore
let rectMergeCallIndex = 0;

/**
 * 
 * @param {Array<Rectangle>} rects 
 */
function GroupOverlappingRects(rects) {
	let groupedRects = [],
		currentGroup = [],
		tRects = ArrayUtility.CloneObjects(rects),
		rectsToCheck = [tRects[0]];

	tRects.splice(0, 1);

	tRects.sort(function (a, b) {
		if (a.x > b.x) return 1;
		if (a.x < b.x) return -1;
		if (a.y > b.y) return 1;
		if (a.y < b.y) return -1;
		return 0;
	});

	while (tRects.length > 0) {
		for (let i = 0, l = tRects.length; i < l; ++i) {
			if (rectsToCheck.length === 0)
				break;

			if (tRects[i].x > rectsToCheck[0].x + rectsToCheck[0].w) {
				currentGroup.push(rectsToCheck[0]);
				rectsToCheck.splice(0, 1);
				i = -1;
			} else if (rectsToCheck[0].IsRectOverlappingOrInside(tRects[i]) === true) {
				rectsToCheck.push(tRects[i]);
				tRects.splice(i, 1);
				--i;
				--l;
			}
		}

		if (rectsToCheck.length === 0) {
			groupedRects.push(currentGroup);
			rectsToCheck = [];
			currentGroup = [];

			if (tRects.length > 0) {
				rectsToCheck.push(tRects[0]);
				tRects.splice(0, 1);
			}
		} else if (rectsToCheck.length > 0 && tRects.length === 0) {
			currentGroup.push(...rectsToCheck);
			groupedRects.push(currentGroup);
			rectsToCheck = [];
			currentGroup = [];
		} else if (rectsToCheck.length > 0 && tRects.length > 0) {
			currentGroup.push(...rectsToCheck);
			groupedRects.push(currentGroup);
			rectsToCheck = [];
			currentGroup = [];

			if (rectsToCheck.length === 0 && tRects.length > 0) {
				rectsToCheck.push(tRects[0]);
				tRects.splice(0, 1);
			}
		}
	}

	return groupedRects;
}

/**
 * 
 * @param {Array<Rectangle>} rects 
 * @returns 
 */
function MergeRects(rects) {
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
			//console.log(i, temp, pairs[i], currentPairs, ArrayUtility.CloneObjects(pairs));
			newRectangles.push(temp);
			temp = new Rectangle(pairs[i][0].x, minY, 0, 0);

			if (currentXEnd > pairs[i][0].x) {
				temp.x = pairs[i][0].x;
				temp.y = minY;
			} else {
				currentXEnd = pairs[i][0].x + pairs[i][0].w;
			}

			currentPairs = pairs[i];
			flagNew = false;
		}
	}

	/*for (let i = 0, l = rects.length; i < l; ++i) {
		DebugDrawer.AddDebugRectOperation(rects[i], 0.016, Color.CSS_COLOR_NAMES[(rectMergeCallIndex + 1 % (Color.CSS_COLOR_NAMES.length - 1))], false);
	}
	for (let i = 0, l = newRectangles.length; i < l; ++i) {
		DebugDrawer.AddDebugRectOperation(newRectangles[i], 0.016, Color.CSS_COLOR_NAMES[(rectMergeCallIndex % (Color.CSS_COLOR_NAMES.length - 1))], true);
	}

	console.log('sorted', rects, corners, pairs, newRectangles);*/

	return newRectangles;
}

/**
 * 
 * @param {Array<Rectangle>} rects 
 */
//@ts-ignore
function MergeRects1(rects) {
	//@ts-ignore
	let mergedRects = [],
		currentRect = rects[0];

	for (let i = 0, l = rects.length; i < l; ++i) {
		if (currentRect !== rects[i]) {
			let overlappingCorners = rects[i].GetOverlappingCorners(currentRect);
			if (overlappingCorners.length === 1) {
				//split rects and take leftside of currentRect, take right side of currentRect and merge with left side of rects[i] and right side of rects[i]
			} else if (overlappingCorners.length === 2) {
				//slice rects[i] where corners of currentRect overlapped by taking their X value and setting the overlapping corners from currenctRect.getoverlappingcorners(rects[i])
			}
		}
	}
}

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

	/*for (let i2 = 0, l2 = rects.length; i2 < l2; ++i2) {
		DebugDrawer.AddDebugRectOperation(rects[i2], 0.016, Color.CSS_COLOR_NAMES[(rectMergeCallIndex + 3 % (Color.CSS_COLOR_NAMES.length - 1))], false);
	}*/

	let groupedRects = GroupOverlappingRects(rects);

	let mergedRects = [];
	for (let i = 0, l = groupedRects.length; i < l; ++i) {
		/*for (let i2 = 0, l2 = groupedRects[i].length; i2 < l2; ++i2) {
			DebugDrawer.AddDebugRectOperation(groupedRects[i][i2], 0.016, Color.CSS_COLOR_NAMES[(rectMergeCallIndex + 2 % (Color.CSS_COLOR_NAMES.length - 1))], false);
		}*/
		mergedRects.push(...MergeRects(groupedRects[i]));
	}

	return mergedRects;
}