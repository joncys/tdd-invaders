module.exports = function scale(source, dest) {
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
  return dest;
};

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
