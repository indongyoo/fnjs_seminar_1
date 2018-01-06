function log(v) {
  console.log.apply(console, arguments);
  return v;
}

function add(a, b) {
  return a + b;
}

function sel1(selector) {
  return document.querySelector(selector);
}

function set(obj, key, val) {
  obj[key] = val;
  return obj;
}

function constant(v) {
  return function() {
    return v;
  }
}

function call(f) {
  return f();
}

function repeat(count, f) {
  var i = -1;
  while (++i < count) f(i);
}
/*

 function filter(list, predicate) {
 var new_list = [], i = -1, l = list.length;
 while (++i < l) predicate(list[i]) && new_list.push(list[i]);
 return new_list;
 }

 function map(list, mapper) {
 var new_list = [], i = -1, l = list.length;
 while (++i < l) new_list.push(mapper(list[i]));
 return new_list;
 }
 */

function filter(list, predicate) {
  return reduce(list, function(res, val) {
    return go(val, predicate, cond => cond ? append(res, val) : res);
  }, []);
}

function append(res, val) {
  return res.push(val), res;
}

function map(list, mapper) {
  return reduce(list, function(res, val) {
    return go(val, mapper, evd => append(res, evd));
  }, []);
}

window.map = curryr(map);
window.filter = curryr(filter);

function reduce(list, iter, memo) {
  var i = 0, l = list.length;
  return function recur(memo) {
    while (i < l) {
      if (memo && memo.constructor == Promise) return memo.then(recur);
      memo = iter(memo, list[i++]);
    }
    return memo;
  } (memo === undefined ? list[i++] : memo);
}

function add_all(list) {
  return reduce(list, add);
}
function mult(a, b) {
  return a * b;
}
function mult_all(list) {
  return reduce(list, mult);
}

function square(v) {
  return v * v;
}


function curry(f) {
  return function(a, b) {
    return arguments.length == 2 ? f(a, b) : function(b) {
      return f(a, b);
    };
  }
}
function curryr(f) {
  return function(a, b) {
    return arguments.length == 2 ? f(a, b) : function(b) {
      return f(b, a);
    };
  }
}
function callr(arg, f) {
  return f(arg);
}

function pipe() {
  var fns = arguments;
  return function(arg) {
    return reduce(fns, callr, arg);
  }
}
function go() {
  return reduce(arguments, callr);
}
