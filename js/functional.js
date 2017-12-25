function log(arg) {
  console.log(arg);
  return arg;
}

function constant(v) {
  return function() {
    return v;
  }
}

function set_attr(obj, key, val) {
  obj.setAttribute(key, val);
  return obj; // <--- 리턴하는식으로
}

function sel1(sel) {
  return document.querySelector(sel);
}

function sel(sel) {
  return document.querySelectorAll(sel);
}

function append(list, child) {
  return list.push(child), list;
}

window.filter = curryr(function(list, predicate) {
  return reduce(list, function(new_list, val) {
    return go(val, predicate, evd => evd ? append(new_list, val) : new_list);
  }, []);
});

window.map = curryr(function(list, mapper) {
  return reduce(list, function(new_list, val) {
    return go(val, mapper, evd => append(new_list, evd));
  }, []);
});

window.each = curryr(function(list, iter) {
  return reduce(list, function(list, val) {
    return go(val, iter, constant(list));
  }, list);
});

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
    return arguments.length == 1 ? function(b) { return fn(a, b); } : fn(a, b);
  }
}

function curryr(fn) {
  return function(a, b) {
    return arguments.length == 1 ? function(b) { return fn(b, a); } : fn(a, b);
  }
}

window.get = curryr(function(obj, key) {
  return obj[key];
});