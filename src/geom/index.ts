export function radToDeg (rad) {
  return rad * (180 / Math.PI);
};

export function degToRad (deg) {
  return deg * (Math.PI / 180);
};

export function distance (x1, y1, x2, y2) {
  const x = Math.abs(x2 - x1);
  const y = Math.abs(y2 - y1);
  return Math.sqrt((y * y) + (x * x));
};

export function polarPoint (deg, length) {
  const x = length * Math.cos(degToRad(deg));
  const y = length * Math.sin(degToRad(deg));
  return [x, y];
}