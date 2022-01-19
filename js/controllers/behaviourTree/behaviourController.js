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
		this.SetupAgent();
	}

	SetupAgent() {
		for (let i = 0, l = this.behaviorTree.actions.length; i < l; ++i) {
			this.behaviorTree.actions[i].SetAgent(this.agent);
		}
	}

	/**
	 * 
	 * @param {Character} newAgent
	 * @returns {BehaviourController}
	 */
	CloneTree(newAgent = undefined) {
		if (newAgent !== undefined)
			return new BehaviourController(newAgent, this.behaviorTree.Clone());
		else
			return new BehaviourController(this.agent, this.behaviorTree.Clone());
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

		if (this.agent !== undefined) {
			this.behaviorTree.CheckActions();
		}
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