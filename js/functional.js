function repeat(fn, count) {
}

function each(list, fn) {
  var i = -1, l = list && list.length;
  while (++i < l) fn(list[i]);
}

function map(list, mapper) {
  var new_list = [];
  for (var i = 0; i < list.length; i++) {
    new_list[i] = mapper(list[i]);
  }
  return new_list;
}

function map(list, mapper) {
  var new_list = [];
  each(list, function(v) {
    new_list.push(mapper(v));
  });
  return new_list;
}

function filter(list, predi) {
  var new_list = [];
  each(list, function(i) {
    if (predi(list[i])) new_list.push(list[i]);
  });
  return new_list;
}

function key_maker(key) {
  return function(obj, val) {
    if (val === undefined) return obj[key];
    obj[key] = val;
    return obj;
  }
}

Object.assign(window, key_maker(['value']));

function log(v) {
  return v;
}

// 1. go 함수를 Promise를 제어할 수 있도록 변경하기
function bgo(arg, fns, i, fn) {
  while (fn = fns[++i]) arg = fn(arg);
  return arg;
}

function go(arg) {
  return bgo(arg, arguments, 0);
}

function pipe() {
  var fns = arguments;
  return function(arg) {
    return bgo(arg, fns, -1);
  }
}

function bgo(arg, fns, i, fn) {
  while (fn = fns[++i]) {
    if ((arg = fn(arg)) && arg.constructor == Promise)
      return arg.then(function(arg) { return bgo(arg, fns, i); });
  }
  return arg;
}

pipe(v=>v+1, v=>v*v, console.log)(1);


function length(list) {
  return list && list.length;
}

function repeat(count, fn) {
  var i = -1;
  while (++i < count) fn(i)
}

function add(a, b) {
  return Promise.resolve(a + b);
}

function mult(a, b) {
  return a * b;
}

function add_all(list) {
  var i = 0, count = length(list), memo = list[0];
  while (++i < count) memo = add(memo, list[i]);
  return memo;
}

function mult_all(list) {
  var i = 0, count = length(list), memo = list[0];
  while (++i < count) memo = mult(memo, list[i]);
  return memo;
}

//  console.log( add_all([1, 2, 3, 4]) );
//  console.log( mult_all([1, 2, 3, 4]) );


function reduce(list, iter, memo) {
  var i = 0, count = length(list);
  return function recur(memo) {
    while (i < count) {
      if (memo && memo.constructor == Promise) return memo.then(recur);
      memo = iter(memo, list[i++]);
    }
    return memo;
  } (memo === undefined ? list[i++] : memo);
}

reduce([1, 2, 3, 4], add, 10).then(function(v) {
  console.log(v);
});
//  console.log( reduce([1, 2, 3, 4], mult) );
//
//  console.log( reduce([1, 2, 3, 4], add) );

// 2. 다른 함수 써보기
function map(list, mapper) {
  var new_list = [];
  repeat(length(list), function(i) {
    new_list.push(mapper(list[i]));
  });
  return new_list;
}

function append(list, child) {
  return list.push(child), list;
}

function callr(arg, fn) {
  return fn(arg);
}

function pipe() {
  var fns = arguments;
  return function(arg) { return reduce(fns, callr, arg); }
}

function pipe() {
  return arg => reduce(arguments, callr, arg);
}

function go() {
  return reduce(arguments, callr);
}

function map(list, mapper) {
  return reduce(list, function(new_list, val) {
    return go(val, mapper, v => append(new_list, v));
  }, []);
}

function filter(list, predi) {
  return reduce(list, function(new_list, val) {
    return go(val, predi, v => v ? append(new_list, val) : new_list);
  }, []);
}

map([1,2,3], v=>Promise.resolve(v*2)).then(function(v) {
  console.log(v);
});


log(filter([1,2,3], v=>v%2));
filter([1,2,3], v=>Promise.resolve(v%2)).then(log);

go(filter([1,2,3], v=>v%2), log);
go(filter([1,2,3], v=>Promise.resolve(v%2)), log);

/*
 go(1,
 function(val) {
 console.log(val);
 return val + 2;
 },
 console.log);*/

/*var a = repeat(3, function(i) {
 return i % 2 ? undefined : new Promise(function(rs) {
 setTimeout(function() {
 console.log(i);
 rs();
 }, 1000)
 })
 });

 console.log(a);

 a.then(console.log);*/






