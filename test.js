var test = require('tape'),
	tapSpec = require('tap-spec'),
	ExecutionLine = require('./index.js');

/*
var line = new ExecutionLine();
line.hook(function(next){console.log('line a - 1'); next();});
line.hook(function(){console.log('line a -2')});

var line2 = new ExecutionLine();
line2.hook(function(next){console.log('line b -1');next();})
line2.hook(function(){console.log('line b - 2')})

line2.exec();
*/

test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);


test('Testing hook exceptions', function (t) {
	let line = new ExecutionLine();

	t.comment('with string');
	t.throws(function() {
		line.hook('String');
	}, TypeError, "You must hook a Function or an Array of Functions");

	t.comment('with int');
	t.throws(function() {
		line.hook(1);
	}, TypeError, "You must hook a Function or an Array of Functions");

	t.comment('with null');
	t.throws(function() {
		line.hook(null);
	}, TypeError, "You must hook a Function or an Array of Functions");

	t.comment('with Array[int]');
	t.throws(function() {
		line.hook([1,2,3]);
	}, TypeError, "You must hook a Function or an Array of Functions");

	t.comment('with Array[string]');
	t.throws(function() {
		line.hook(['string', 'string', 'string']);
	}, TypeError, "You must hook a Function or an Array of Functions");

	t.comment('with Array[null]');
	t.throws(function() {
		line.hook([null, null, null]);
	}, TypeError, "You must hook a Function or an Array of Functions");
	
	t.end();
});

test('Testing hook exceptions', function (t) {


});