import V2 from '../geo/v2.js';
import {Zero} from '../geo/v2.js';
import Rect from '../geo/rect.js';
import mouse from '../basic/mouse.js';
import {arrayRemove} from '../basic/util.js';

export default class Entity {
	constructor() {
		this.position = Zero();
		this.size = Zero();
		this.entities = [];
		this.blocking = [];
		this.parent = null;
		this.visible = true;
	}

	static async create(json, sceneHandles) {
		let newEntity;
		if (this.onCreate) {
			newEntity = this.onCreate(json);
		} else {
			newEntity = new this();
		}
		if (json.position) newEntity.setPosition(json.position.x, json.position.y);
		if (json.size) newEntity.setSize(json.size.x, json.size.y);
		if (json.functions) {
			for (const functionName in json.functions) {
				const newFunction = new Function(json.functions[functionName].arguments,
					json.functions[functionName].body);
				this[functionName] = newFunction;
			}
		}
		if (json.sceneHandle) sceneHandles[json.sceneHandle] = newEntity;

		await newEntity.dynamic(json, sceneHandles);

		if (newEntity.onDynamic) await newEntity.onDynamic(json, sceneHandles);

		return newEntity;
	}

	async dynamic(json, sceneHandles) {
		if (json.entities) {
			for (const entity in json.entities) {
				let newModule = entity.toLowerCase();
				if (newModule.includes('_')) {
					newModule = newModule.substr(0, newModule.indexOf('_'));
				}
				const module = await import('./' + newModule + '.js');
				const newEntity = await module.default.create(json.entities[entity], sceneHandles);
				this.add(newEntity);
				if (newEntity.postDynamic) newEntity.postDynamic(json.entities[entity], sceneHandles);
			}
		}
	}

	setSize(w, h) {
		if (!h && w instanceof V2) {
			this.size = w;
		} else {
			this.size.x = w;
			this.size.y = h;
		}
	}

	setPosition(x, y) {
		if (!y && x instanceof V2) {
			this.position = x;
		} else {
			this.position.x = x;
			this.position.y = y;
		}
	}

	center() {
		if (!this.parent) return;
		this.position.x = Math.floor(this.parent.size.x / 2 - this.size.x / 2);
		this.position.y = Math.floor(this.parent.size.y / 2 - this.size.y / 2);
	}

	add(entity) {
		if(entity.setParent)
			entity.setParent(this);
		this.entities.push(entity);
		if (entity.onAdded)
			entity.onAdded();
	}

	setParent(p) {
		this.parent = p;
	}

	relativeMouse() {
		if (this.parent && this.parent.relativeMouse)
			return this.parent.relativeMouse().dif(this.position);
		else
			return mouse.dif(this.position);
	}

	block(entity) {
		this.blocking.push(entity);
	}

	remove(entity) {
		if (this.entities.indexOf(entity) > -1) arrayRemove(this.entities, entity);
		if (this.blocking.indexOf(entity) > -1) arrayRemove(this.blocking, entity);
	}

	dispatch(list, event, argurment) {
		for (let i = 0; i < list.length; i++)
			if (list[i][event])
				list[i][event](argurment);
	}

	dispatchReverse(list, event, argurment) {
		for (let i = list.length - 1; i >= 0; i--)
			if (list[i][event])
				if (list[i][event](argurment)) return true;
	}

	update(delta) {
		if (this.onUpdate)
			this.onUpdate(delta);

		if (this.blocking.length) {
			this.dispatch(this.blocking, 'update', delta);
		} else {
			this.dispatch(this.entities, 'update', delta);
		}
	}

	getArea() {
		return new Rect(Zero(), this.size);
	}

	relativeArea() {
		return this.getArea().moved(this.position);
	}

	hover() {
		return this.getArea().inside(this.relativeMouse());
	}

	resize() {
		if (this.onResize) this.onResize();
		this.dispatch(this.blocking, 'resize');
		this.dispatch(this.entities, 'resize');
	}

	draw(ctx) {
		if (!this.visible) return;

		ctx.save();
		ctx.translate(this.position.x | 0, this.position.y | 0);

		if (this.onDraw) this.onDraw(ctx);
		this.dispatch(this.entities, 'draw', ctx);
		this.dispatch(this.blocking, 'draw', ctx);
		if (this.postDraw) this.postDraw(ctx);

		ctx.restore();
	}

	click(pos) {
		pos = pos.dif(this.position);
		if (!this.getArea().inside(pos)) return;
		if (this.onClick && this.onClick(pos)) return true;

		if (this.blocking.length) {
			return this.dispatchReverse(this.blocking, 'click', pos);
		} else {
			return this.dispatchReverse(this.entities, 'click', pos);
		}
	}

	mousedown(pos) {
		pos = pos.dif(this.position);
		if (!this.getArea().inside(pos)) return;
		if (this.onMouseDown && this.onMouseDown(pos)) return true;

		if (this.blocking.length) {
			return this.dispatchReverse(this.blocking, 'mousedown', pos);
		} else {
			return this.dispatchReverse(this.entities, 'mousedown', pos);
		}
	}

	mouseup(pos) {
		pos = pos.dif(this.position);
		if (this.onMouseUp && this.onMouseUp(pos)) return true;

		if (this.blocking.length) {
			return this.dispatchReverse(this.blocking, 'mouseup', pos);
		} else {
			return this.dispatchReverse(this.entities, 'mouseup', pos);
		}
	}
}