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

map([ip, ip], value)

function fif() {}
function fwhile() {}

unless() (

) .else () (

);









