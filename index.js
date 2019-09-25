'use stric'

function ExecutionLine(ctx, customObject) {
	ctx = ctx || {};
	customObject = customObject || null;

	Object.defineProperties(this, {
		'ctx': {
			enumerable: false,
			configurable: false,
			writable: true,
			value: ctx
		},
		'customObject': {
			enumerable: false,
			configurable: false,
			writable: true,
			value: customObject
		},
		'line': {
			enumerable: true,
			configurable: false,
			writable: false,
			value: new Array()
		}
	});

	function hasNext() { if(this.line.length > 0) return true; else return false; }

	function nextFn() {
		if(hasNext()) return this.line.shift();
		else return function(){};
	}

	function next() {
		if(this.customObject === null)
			nextFn().call(this.ctx, this.customObject, next);
		else 
			nextFn().call(this.ctx, next);
	}
}


ExecutionLine.prototype.hook = function(fn) {
	if(!fn || !(fn instanceof Array || fn instanceof Function))
		throw new TypeError('You must hook a Function or an Array of Functions');

	if(fn instanceof Array) {
		for(let i = 0; i < fn.length; i++) {
			if(!(fn[i] instanceof Function)) throw new TypeError('You must hook a Array of Functions');
		}

		this.line.push(...fn);
	} else this.line.push(fn);
}

ExecutionLine.prototype.exec = function() {
	if(!hasNext()) return false;
	this.next();
}

ExecutionLine.prototype.clear = function() {
	this.line = [];
}

module.exports = ExecutionLine;