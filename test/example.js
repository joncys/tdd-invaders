var test = require('tape');

test('is there a body?', function(t) {

  t.plan(1);

  t.equal('[object HTMLBodyElement]', document.querySelector('body').toString());

});
