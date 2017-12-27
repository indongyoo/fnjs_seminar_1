function log(val) {
  console.log.apply(console, arguments);
  return val;
}

function sel1(selector) {
  return document.querySelector(selector);
}

function sel(selector) {
  return document.querySelectorAll(selector);
}

function set(obj, key, val) {
  obj[key] = val;
  return obj;
}

function constant(v) {
  return function() { //<-- 클로저
    return v;
  }
}

function repeat(count, fn) {
  var i = -1;
  while (++i < count) fn(i);
}

function append(list, val) {
  return list.push(val), list;
}

window.filter = curryr(function(list, predicate) {
  return reduce(list, function(new_list, val) {
    return predicate(val) ? append(new_list, val) : new_list;
    return go(val, predicate, t => t ? append(new_list, val) : new_list);
  }, []);
});

window.map = curryr(function(list, mapper) {
  return reduce(list, function(new_list, val) {
    return go(val, mapper, v => append(new_list, v));
  }, []);
});

function reduce(list, fn, memo) {
  var i = 0, l = list.length;
  return function recur(memo) {
    while (i < l) {
      if (memo && memo.constructor == Promise) return memo.then(recur);
      memo = fn(memo, list[i++]);
    }
    return memo;
  } (memo === undefined ? list[i++] : memo);
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

function curry(fn) {
  return function(a, b) {
    return arguments.length == 2 ? fn(a, b) : function(b) { return fn(a, b); }
  }
}

function curryr(fn) {
  return function(a, b) {
    return arguments.length == 2 ? fn(a, b) : function(b) { return fn(b, a); }
  }
}

