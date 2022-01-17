import { Vector2D, NavigationSystem, Character, MovemementDirection, CollisionHandler, CMath, MovementType, DebugDrawer, Polygon } from '../../internal.js';

/**
 * @readonly
 * @enum {number}
 */
const BehaviorNodeType = {
	/**
	 * Executes their children from left to right and will stop executing when one of their children succeeds
	*/
	Selector: 0,
	/**
	 * Executes their children from left to right and will stop executing when one of their children fails
	 */
	Sequence: 1,
};

/**
 * @class
 * @constructor
 */
class BehaviorTree {

	/**
	 * 
	 * @param {BehaviorAction[]} actions 
	 */
	constructor(actions = undefined) {
		this.actions = actions;
	}

	CheckActions() {
		for (let i = 0, l = this.actions.length; i < l; ++i) {
			this.actions[i].Action();
		}
	}
}

/**
 * @template ConditionType
 * @class
 * @constructor
 */
class BehaviorCondition {

	/**
	 * 
	 * @param {boolean} inverseCheck 
	 */
	constructor(inverseCheck = false) {
		/** @type {boolean} */ this.inverseCheck = inverseCheck;
	}

	/**
	 * 
	 * @param {ConditionType} a 
	 * @param {ConditionType} b 
	 * @returns {boolean}
	 */
	Check(a, b) {
		return a === b;
	}
}

/**
 * @class
 * @constructor
 * @extends BehaviorCondition
 */
class BehaviorConditionDistance extends BehaviorCondition {

	/**
	 * 
	 * @param {number} distance 
	 * @param {boolean} inverseCheck 
	 */
	constructor(distance = 5, inverseCheck = false) {
		super(inverseCheck);

		this.distance = distance;
	}

	/**
	 * 
	 * @param {BehaviorActionPoint} actionA 
	 * @param {BehaviorActionPoint} actionB 
	 * @returns {boolean}
	 */
	Check(actionA, actionB) {
		let a = actionA.agent.position,
			b = actionB.GetPoint();

		if (this.inverseCheck === true)
			return !a.CheckInRange(b, this.distance);
		else
			return a.CheckInRange(b, this.distance);
	}
}

/**
 * @class
 * @constructor
 * @extends BehaviorCondition
 */
class BehaviorConditionAvoidClass extends BehaviorCondition {

	/**
	 * 
	 * @param {Object} classType 
	 * @param {number} distance
	 * @param {boolean} inverseCheck 
	 */
	constructor(classType = Character.prototype, distance = 5, inverseCheck = false) {
		super(inverseCheck);

		this.classType = classType;
		this.distance = distance;
	}

	/**
	 * 
	 * @param {BehaviorActionPoint} actionA 
	 * @param {BehaviorActionPoint} actionB 
	 * @returns {boolean}
	 */
	Check(actionA, actionB) {
		let a = actionA.agent,
			found = CollisionHandler.GCH.GetInRangeClass(a.BoxCollision, this.distance, this.classType);

		for (let i = 0, l = found.length; i < l; ++i) {
			if (found[i].collisionOwner instanceof this.classType) {
				if (this.inverseCheck === false) {
					actionB.agent = found[i].collisionOwner;
					return true;
				}
				else {
					actionB.agent = found[i].collisionOwner;
					return false;
				}
			}
		}

		actionB.agent = undefined;
		if (this.inverseCheck === false)
			return false;
		else
			return true;
	}
}

/**
 * @class
 * @constructor
 */
class BehaviorAction {

	/**
	 * 
	 * @param {BehaviorCondition[]} conditions 
	 * @param {BehaviorAction[]} children
	 * @param {BehaviorNodeType} nodeType
	 */
	constructor(conditions = undefined, children = [], nodeType = BehaviorNodeType.Selector) {
		/** @type {BehaviorNodeType} */ this.behaviorNodeType = nodeType;
		/** @type {BehaviorCondition[]} */ this.conditions = conditions;
		/** @type {BehaviorAction[]} */ this.children = children;
	}

	/**
	 * 
	 * @returns {boolean}
	 */
	Action() {
		for (let i = 0, l = this.children.length; i < l; ++i) {
			switch (this.behaviorNodeType) {
				case BehaviorNodeType.Selector:
					if (this.children[i].Action())
						return true;
					break;

				case BehaviorNodeType.Sequence:
					if (this.children[i].Action() === false)
						return false;
					break;
			}
		}

		return true;
	}
}

/**
 * @class
 * @constructor
 * @extends BehaviorAction
 */
class BehaviorActionPoint extends BehaviorAction {

	/**
	 * @param {Character} agent
	 */
	constructor(agent) {
		super();

		/** @type {Character} */ this.agent = agent;
	}

	/**
	 * @returns {Vector2D}
	 */
	GetPoint() {
		return undefined;
	}

	/**
	 * 
	 * @returns {Character}
	 */
	GetAgent() {
		return this.agent;
	}
}

class BehaviorActionCharacter extends BehaviorActionPoint {

	/**
	 * @param {Character} agent
	 */
	constructor(agent) {
		super(agent);
	}

	/**
	 * 
	 * @returns {Vector2D}
	 */
	GetPoint() {
		if (this.agent !== undefined)
			return this.agent.position;

		return undefined;
	}

	/**
	 * 
	 * @returns {Character}
	 */
	GetAgent() {
		return this.agent;
	}
}

/**
 * @class
 * @constructor
 * @extends BehaviorAction
 */
class BehaviorActionMovement extends BehaviorAction {

	/**
	 * 
	 * @param {Character} agent
	 * @param {BehaviorCondition[]} conditions 
	 * @param {BehaviorActionPoint} behaviorActionPoint 
	 */
	constructor(agent, conditions, behaviorActionPoint) {
		super(conditions);

		/** @type {Character} */ this.agent = agent;
		/** @type {Vector2D[]} */ this.path = [];
		/** @type {BehaviorActionPoint} */ this.behaviorActionPoint = behaviorActionPoint;
	}

	/**
	 * 
	 * @returns {Vector2D}
	 */
	GetPath() {
		if (this.path.length > 0)
			return this.path[0];

		return undefined;
	}

	CalculatePath() {
		let b = this.behaviorActionPoint.GetPoint();

		if (b !== undefined) {
			this.path = NavigationSystem.PathFromPointToPoint(this.agent.position, b);

			DebugDrawer.AddPolygon(new Polygon(this.path), 5, 'pink', true, 1.0);
		}
	}

	/**
	 * 
	 * @returns {boolean}
	 */
	Action() {
		super.Action();

		if (this.CheckConditions() === false) {
			this.agent.UpdateDirection(MovemementDirection.x, 0);
			this.agent.Velocity.x = this.agent.Velocity.y = 0;
			this.path = [];

			return false;
		} else {
			if (this.path.length > 0) {
				if (this.agent.position.CheckInRange(this.path[0], 5) === true)
					this.path.splice(0, 1);

				if (this.path.length > 0) {
					let direction = this.agent.position.Direction(this.path[0]);
					this.agent.UpdateDirection(MovemementDirection.y, direction.y);
					this.agent.UpdateDirection(MovemementDirection.x, direction.x);
					this.agent.Velocity = direction;// = this.agent.Direction = direction;
				}
			} else {
				this.CalculatePath();
			}

			return true;
		}
	}

	/**
	 * @private
	 * @returns {boolean}
	 */
	CheckConditions() {
		let state = true;

		for (let i = 0, l = this.conditions.length; i < l; ++i) {
			state = this.conditions[i].Check(this, this.behaviorActionPoint);

			if (state === false)
				return false;
		}

		return state;
	}
}

/**
 * @class
 * @constructor
 * @extends BehaviorAction
 */
class BehaviorActionMoveAway extends BehaviorAction {

	/**
	 * 
	 * @param {Character} agent
	 * @param {BehaviorCondition[]} conditions 
	 * @param {BehaviorActionPoint} behaviorActionPoint 
	 */
	constructor(agent, conditions, behaviorActionPoint) {
		super(conditions);

		/** @type {Character} */ this.agent = agent;
		/** @type {Vector2D[]} */ this.path = [];
		/** @type {BehaviorActionPoint} */ this.behaviorActionPoint = behaviorActionPoint;
	}

	/**
	 * 
	 * @returns {Vector2D}
	 */
	GetPath() {
		if (this.path.length > 0)
			return this.path[0];

		return undefined;
	}

	CalculatePath() {
		let b = this.behaviorActionPoint.GetPoint();

		if (b !== undefined) {
			let direction = this.agent.position.Direction(b),
				newPosition = Vector2D.Add(this.agent.position, Vector2D.Mult(new Vector2D(CMath.RandomFloat(25, 125), CMath.RandomFloat(25, 125)), direction));

			this.path = NavigationSystem.PathFromPointToPoint(this.agent.position, newPosition);
		}
	}

	/**
	 * 
	 * @returns {boolean}
	 */
	Action() {
		super.Action();

		if (this.CheckConditions() === false) {
			this.agent.UpdateDirection(MovemementDirection.x, 0);
			this.agent.Velocity.x = this.agent.Velocity.y = 0;
			this.path = [];

			return false;
		} else {
			if (this.path.length > 0) {
				if (this.agent.position.CheckInRange(this.path[0], 5) === true)
					this.path.splice(0, 1);

				if (this.path.length > 0) {
					let direction = this.agent.position.Direction(this.path[0]);
					this.agent.UpdateDirection(MovemementDirection.y, direction.y);
					this.agent.UpdateDirection(MovemementDirection.x, direction.x);
					this.agent.Velocity = direction;// = this.agent.Direction = direction;
				}
			} else {
				this.CalculatePath();
			}

			return true;
		}
	}

	/**
	 * @private
	 * @returns {boolean}
	 */
	CheckConditions() {
		let state = true;

		for (let i = 0, l = this.conditions.length; i < l; ++i) {
			state = this.conditions[i].Check(this, this.behaviorActionPoint);

			if (state === false)
				return false;
		}

		return state;
	}
}

/**
 * @class
 * @constructor
 * @extends BehaviorAction
 */
class BehaviorActionModifySpeed extends BehaviorAction {
	
	/**
	 * 
	 * @param {Character} agent
	 * @param {BehaviorCondition[]} conditions 
	 * @param {BehaviorActionPoint} behaviorActionPoint 
	 * @param {number} speedNormal
	 * @param {number} speedModified
	 */
	constructor(agent, conditions, behaviorActionPoint, speedNormal, speedModified) {
		super(conditions);

		/** @type {Character} */ this.agent = agent;
		/** @type {BehaviorActionPoint} */ this.behaviorActionPoint = behaviorActionPoint;
		/** @type {number} */ this.speedNormal = speedNormal;
		/** @type {number} */ this.speedModified = speedModified;
	}

	/**
	 * 
	 * @returns {boolean}
	 */
	 Action() {
		super.Action();

		if (this.CheckConditions() === false) {
			this.agent.SetMovement(MovementType.Walking, this.speedNormal);
			return false;
		} else {
			this.agent.SetMovement(MovementType.Running, this.speedModified);
			return true;
		}
	}

	/**
	 * @private
	 * @returns {boolean}
	 */
	 CheckConditions() {
		let state = true;

		for (let i = 0, l = this.conditions.length; i < l; ++i) {
			state = this.conditions[i].Check(this, this.behaviorActionPoint);

			if (state === false)
				return false;
		}

		return state;
	}
}

export {
	BehaviorTree, BehaviorAction, BehaviorActionPoint, BehaviorActionMovement, BehaviorActionCharacter, BehaviorCondition,
	BehaviorConditionDistance, BehaviorConditionAvoidClass, BehaviorActionMoveAway, BehaviorActionModifySpeed
};