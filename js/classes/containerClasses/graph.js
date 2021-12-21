import { CMath } from '../../internal.js';

/**
 * @class
 * @constructor
 */
class GraphPoint {

	/**
	 * Creates a graph point
	 * @param {Number} point 
	 * @param {Number|Object} value 
	 */
	constructor(point, value) {
		this.point = point;
		this.value = value;
	}
}

/**
 * @class
 * @constructor
 * @public
 */
class Graph {

	/**
	 * 
	 * @param {Number} start 
	 * @param {Number} end 
	 * @param {Array<GraphPoint>} graphPoints 
	 */
	constructor(start, end, graphPoints, size = 100) {
		this.start = start;
		this.end = end;
		this.size = size;
		this.graphPoints = graphPoints;

		/** @type {Array<GraphPoint>} */
		this.generatedGraphPoints = [];

		this.GenerateGraph();
	}

	GenerateGraph() {
		let value = 0,
			index = 0,
			time = 0,
			maxTime = 0,
			previousMaxTime = 0;

		if (this.graphPoints[0].point === 0) {
			value = this.graphPoints[0].value;
			++index;
		}

		maxTime = this.graphPoints[index].point * this.size;

		for (let i = this.start * this.size, l = this.end * this.size; i < l; ++i) {
			if (Number.isFinite(this.graphPoints[index - 1].value) === true)
				value = CMath.Lerp(this.graphPoints[index - 1].value, this.graphPoints[index].value, CMath.EaseInOut((time - previousMaxTime)/(maxTime - previousMaxTime)));
			else
				value = CMath.ObjectLerp(this.graphPoints[index - 1].value, this.graphPoints[index].value, CMath.EaseInOut((time - previousMaxTime)/(maxTime - previousMaxTime)));

			let newPoint = new GraphPoint(i, value);
			this.generatedGraphPoints.push(newPoint);

			if (this.graphPoints[index].point * this.size === i) {
				++index;
				previousMaxTime = maxTime;
				maxTime = this.graphPoints[index].point * this.size;
			}

			++time;
		}
	}

	GetPoint(time, start, end) {
			let index = CMath.MapRange(time, start, end, this.start * this.size, this.end * this.size);
			//console.log(index, time, start, end);
			index = Math.floor(index);
			return this.generatedGraphPoints[index];
	}
}

export { Graph, GraphPoint };