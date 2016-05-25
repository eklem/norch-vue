var jsonfile = require('jsonfile')
var file = './resultset.json'

jsonfile.readFile(file, function(err, obj) {
//  console.dir(obj)
//  console.log(JSON.stringify(obj, null, 4));
})

var queryinput = 'test';

var q = {};
q['query'] = [{'AND': [{'*': [queryinput] }]}];
//q[query]['AND'] = [];
q = JSON.stringify(q);
console.log(q);

q = encodeURIComponent(q);
console.log(q);
