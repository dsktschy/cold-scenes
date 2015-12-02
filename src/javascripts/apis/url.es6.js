window.URL =
  window.URL ||
  window.webkitURL ||
  window.mozURL ||
  window.oURL ||
  window.msURL ||
  null;

export default !!window.URL;
