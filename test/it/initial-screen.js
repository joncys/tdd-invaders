var test = require('tape');
var Promise = require('bluebird');

test('render initial screen', function (t) {
  t.plan(2);

  Promise.all([
    makeGameCanvas(),
    imageToCanvas('./test/it/resources/initial-screen.png')
  ]).then(function (canvases) {
    var actual = canvases[0];
    var expected = canvases[1];

    document.body.appendChild(actual);
    document.body.appendChild(expected);

    t.deepEqual([actual.width, actual.height], [expected.width, expected.height], 'same size canvas');
    t.ok(canvasEquals(actual, expected), 'same canvas content');
  }).catch(function (reason) {
    t.fail(JSON.stringify(reason));
  });
});

function imageToCanvas(src) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.src = src;
    image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, image.width, image.height);
      console.log('image-to-canvas');
      resolve(canvas);
    };
    image.onerror = function () {
      reject('failed loading image ' + image.src);
    };
  });
}

function makeGameCanvas() {
  return new Promise(function (resolve, reject) {
    var canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 640;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    getInvader()
      .then(function (invader) {
        ctx.putImageData(invader, 4, 4);
        resolve(canvas);
      })
      .catch(reject);
  });
}

function getInvader() {
  return imageToCanvas('./assets/speis_inveidr.png')
    .then(function (invader) {
      var ctx = invader.getContext('2d');
      var source = ctx.getImageData(0, 0, invader.width, invader.height);
      var dest = new ImageData(invader.width * 4, invader.height * 4);
      invert(source);
      black(dest);
      scale(source, dest);
      return dest;
    });
}

function scale(source, dest) {
  var scaleX = dest.width / source.width;
  var scaleY = dest.height / source.height;
  for (var line = 0; line < source.height; line++) {
    for (var column = 0; column < source.width; column++) {
      var pixel = getAt(source, column, line);
      for (var x = 0; x < scaleX; x++) {
        for (var y = 0; y < scaleY; y++) {
          setAt(dest, scaleX * column + x, scaleY * line + y, pixel);
        }
      }
    }
  }
}

function getAt(source, x, y) {
  var i = (source.width * y + x) * 4;
  return {
    r: source.data[i + 0],
    g: source.data[i + 1],
    b: source.data[i + 2],
    a: source.data[i + 3]
  };
}

function setAt(dest, x, y, pixel) {
  var j = (dest.width * y + x) * 4;
  dest.data[j + 0] = pixel.r;
  dest.data[j + 1] = pixel.g;
  dest.data[j + 2] = pixel.b;
  dest.data[j + 3] = pixel.a;
}

function black(image) {
  var len = image.width * image.height;
  for (var i = 0; i < len; i++) {
    image.data[i * 4 + 0] = 0;
    image.data[i * 4 + 1] = 0;
    image.data[i * 4 + 2] = 0;
    image.data[i * 4 + 3] = 255;
  }
}

function invert(image) {
  var len = image.width * image.height;
  for (var i = 0; i < len; i++) {
    if (image.data[i * 4 + 3] === 0) {
      image.data[i * 4 + 0] = 0;
      image.data[i * 4 + 1] = 0;
      image.data[i * 4 + 2] = 0;
      image.data[i * 4 + 3] = 255;
    } else {
      image.data[i * 4 + 0] = 255;
      image.data[i * 4 + 1] = 255;
      image.data[i * 4 + 2] = 255;
      image.data[i * 4 + 3] = 255;
    }
  }
}

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
