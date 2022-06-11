// from stackoverflow
// experimental

function light_dark(color) {
  var r, g, b, hsp;
  if (color.match(/^rgb/)) {
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    color = +('0x' + color.slice(1).replace( 
    color.length < 5 && /./g, '$&$&'));

    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
  }
  hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );

  if (hsp > 127.5) {
    return 'light';
  } else {
    return 'dark';
  }
}

function saturation(rgb, s) {
  var min = rgb.indexOf(Math.min.apply(null, rgb)),
      max = rgb.indexOf(Math.max.apply(null, rgb)),
      mid = [0, 1, 2].filter(function (i) {return i !== min && i !== max;})[0],
      a = rgb[max] - rgb[min],
      b = rgb[mid] - rgb[min],
      x = rgb[max],
      arr = [x, x, x];
  if (min === max) {
    min = 2;
    a = 1;
  }

  arr[max] = x;
  arr[min] = Math.round(x * (1 - s));
  arr[mid] = Math.round(x * ((1 - s) + s * b / a));

  return arr;
}

export default {
  saturation,
  light_dark
};
