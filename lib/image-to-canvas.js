module.exports = function imageToCanvas(src) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.src = src;
    image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, image.width, image.height);
      resolve(canvas);
    };
    image.onerror = function () {
      reject('failed loading image ' + image.src);
    };
  });
};
