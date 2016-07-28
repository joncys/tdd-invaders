var Promise = require('bluebird');

var imageToCanvas = require('./lib/image-to-canvas');
var scale = require('./lib/scale');

module.exports = function makeGameCanvas() {
  var output = document.createElement('canvas');
  output.width = 480;
  output.height = 640;

  return new Promise(function (resolve, reject) {
    var canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 160;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    getInvader()
      .then(function (invader) {
        ctx.putImageData(invader, 1, 1);

        var final = scale(
          ctx.getImageData(0, 0, canvas.width, canvas.height),
          new ImageData(output.width, output.height)
        );
        output.getContext('2d').putImageData(final, 0, 0);
        resolve(output);
      })
      .catch(reject);
  });
};

function getInvader() {
  return imageToCanvas('./assets/speis_inveidr.png')
    .then(function (invader) {
      var ctx = invader.getContext('2d');
      var source = ctx.getImageData(0, 0, invader.width, invader.height);
      return invert(source);
    });
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
  return image;
}
