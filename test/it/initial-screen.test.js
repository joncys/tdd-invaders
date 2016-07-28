var test = require('tape-promise/tape');

var makeGameCanvas = require('../../game');
var imageToCanvas = require('../../lib/image-to-canvas');

test('render initial screen', function (t) {
  t.plan(2);

  return Promise.all([
    makeGameCanvas(),
    imageToCanvas('./test/it/resources/initial-screen.png')
  ]).then(function (canvases) {
    var actual = canvases[0];
    var expected = canvases[1];

    document.body.appendChild(actual);
    document.body.appendChild(expected);

    t.deepEqual(
      [actual.width, actual.height],
      [expected.width, expected.height],
      'same size canvas');

    t.ok(
      canvasEquals(actual, expected),
      'same canvas content');
  });
});

function canvasEquals(a, b) {
  var imageA = a.getContext('2d').getImageData(0, 0, a.width, a.height).data;
  var imageB = b.getContext('2d').getImageData(0, 0, b.width, b.height).data;
  var aLength = imageA.length;
  var bLength = imageB.length;
  for (var i = 0; i < aLength; i++) {
    if (imageA[i] !== imageB[i]) {
      return false;
    }
  }
  return true;
}
