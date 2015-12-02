window.AudioContext =
  window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext ||
  null;

export default !!window.AudioContext;
