import { Cobject, Character, BehaviorTree } from '../../internal.js';

/**
 * 
 * @class
 * @constructor
 * @extends Cobject
 */
class BehaviourController extends Cobject {

	/**
	 * 
	 * @param {Character} agent 
	 * @param {BehaviorTree} behaviorTree
	 */
	constructor(agent, behaviorTree) {
		super();

		/** @type {Character}*/ this.agent = agent;
		/** @type {BehaviorTree}*/ this.behaviorTree = behaviorTree;
	}

	/**
	 * 
	 */
	FixedUpdate() {
		super.FixedUpdate();
	}

	/**
	 * 
	 */
	EndOfFrameUpdate() {
		super.EndOfFrameUpdate();

		this.behaviorTree.CheckActions();
	}

	/**
	 * 
	 */
	Delete() {
		super.Delete();
	}

	/**
	 * 
	 */
	GameBegin() {
		super.GameBegin();
	}
}

export { BehaviourController };