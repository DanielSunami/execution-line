"use strict";

(function() {
	function ExecutionLine(ctx, customObject) {
		ctx = ctx || {};
		customObject = customObject || null;

		let line = [], _self = this;

		function hasNext() { if(line.length > 0) return true; else return false; }

		function next() {
			if(!hasNext())
				_self.onexecutionend.call(ctx, customObject);
			else if(customObject === null)
				line.shift().call(ctx, next);
			else 
				line.shift().call(ctx, customObject, next);
		}

		this.onexecutionend = function() {}

		this.hook = function(fn) {
			if(!fn || !(fn instanceof Array || fn instanceof Function))
				throw new TypeError('You must hook a Function or an Array of Functions');

			if(fn instanceof Array) {
				for(let i = 0; i < fn.length; i++) {
					if(!(fn[i] instanceof Function)) throw new TypeError('You must hook a Array of Functions');
				}

				line.push(...fn);
			} else line.push(fn);
		}

		this.exec = function() {
			if(!hasNext()) return false;
			next();
		}

		this.clear = function() {
			line = [];
		}

	}

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
		module.exports = ExecutionLine;
	else
		window.ExecutionLine = ExecutionLine;
})();