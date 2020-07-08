# execution-line
Ensures a sequential execution of functions, helps you escape callback hell, comes in handy when writing long and complex tasks. Works exactly as expressjs middlewares.

## Installation

```sh
$ npm install execution-line
```
Browser
```html
<script type="text/javascript" src="/path/to/execution-line.min.js"></script>
```
## API
### Constructor
```javascript
ExecutionLine(context, myObject)
``` 
#### Parameters
Name      | Type   | Required | Description 
--------- | ------ | ---------| --
context   | Object | Optional | thisArg for all functions on the line
myObject  | Object | Optional | a custom object to use across all functions 

#### Usage
You must always use an instance.
```javascript
let line = new ExecutionLine();
``` 
### line.hook(fn)
Hook functions to the line.

#### Parameters
Name      | Type   | Required | Description 
--------- | ------ | ---------| --
fn   | Function or Array | Required | if a Array is passed it must be an Array of Functions, otherwise it will throw TypeError

#### Usage
```javascript
line.hook([
  function(next){ /* step 1 */ next(); },
  function(){ /* step 2 */ }
]);
``` 
### line.exec()
Executes all hooked functions. Each function is removed from the line to be executed, if all functions were executed the line will be clear again. If `exec()` is called and the line is clear it will `return false`.

### line.clear()
Clear line, removes all hooked functions.

### line.onexecutionend
Executed after all functions, it shares the same context as your other functions. Only works if the last function calls `next()`.

#### Parameters
Name      | Type   | Description 
--------- | ------ | --
myObject  | Object or Null | a custom object to use across all functions

#### Usage
```javascript
line.onexecutionend = function(myObject) {}
```
## Usage

### Example 1
Basic usage
```javascript
// only needed on nodejs
let ExecutionLine = require('execution-line');

let lineA = new ExecutionLine();

function firstA(next) { 
  console.log('line A - first function');
  next();
}

function secondA() { 
  console.log('line A - second function')
}

lineA.hook(firstA);
lineA.hook(secondA);

let lineB = new ExecutionLine();

function firstB(next) {
  console.log('line B - first function');
  next();
}

function secondB(){
  console.log('line B - second function')
}

lineB.hook(firstB)
lineB.hook(secondB);

lineA.exec();
lineB.exec();

// outputs
// line A - first function
// line A - second function
// line B - first function
// line B - second function
```

### Example 2
Changing context, thisArg 
```javascript
// only needed on nodejs
let ExecutionLine = require('execution-line');

let line  = new ExecutionLine({ e: 'element'});
line.hook(function(next){
  console.log(this.e);
});

line.exec();

// outputs
// element
```
### Example 3
Passing a object to functions
```javascript
// only needed on nodejs
let ExecutionLine = require('execution-line');

let line  = new ExecutionLine({}, { prop: 'string'});
function a(obj, next){
  console.log(obj.prop);
  next();
}
line.hook(a);
line.hook(a);

line.exec();

// outputs
// string
// string
```
### Example 4
Using onexecutionend 
```javascript
// only needed on nodejs
let ExecutionLine = require('execution-line');

let line  = new ExecutionLine();
line.hook(function(next){
  console.log('step 1');
  // not calling next()
});

line.onexecutionend = function() {
  console.log('final step');
}

line.exec();

// outputs
// step 1

// hooking again because after execution the line is clear
line.hook(function(next) {
  console.log('step 1');
  // calling next()
  next();
});

// outputs
// step 1
// final step
```
### Example 5
Escaping callback hell, silly example using callback:
```javascript
element.onclick(function(event){
  event.target.disabled = true;
  xmlhttp.onload = function() {
    some.SDK.call(function() {
      anotherXmlHttp.onload = function() {
        event.target.disabled = false;
        // now its over
      }
      anotherXmlHttp.send();
    });
  }
  xmlhttp.send()
});
```
Same example using ExecutionLine:
```javascript
function clickHandler(next) {
  this.disabled = true;
  next();
}

function ajaxCall(next) {
  xmlhttp.onload = function() {
    next();
  }
  xmlhttp.send();
}

function doSomething(next) {
  some.SDK.call(function(){
    next();
  });
}

function lastAjaxCall() {
  xmlhttp.onload = function() {
    this.disabled = false;
  }
  xmlhttp.send();
}

element.onclick = function() {
  let line  = new ExecutionLine(element);
  line.hook(clickHandler);
  line.hook(ajaxCall);
  line.hook(doSomething);
  line.hook(lastAjaxCall);
  line.exec();
}
```
## License

[MIT](LICENSE)
