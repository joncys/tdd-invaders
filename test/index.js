var test = require('tape');
test.onFinish(function() {
  window.close();
});

require('./**/*.js', {mode: 'expand'});
