import $ from 'jquery';
import _url from './url';
import _audioContext from './audio-context';
import _navigatorGetUserMedia from './navigator-get-user-media';

const
  FFT_SIZE = 1024;

var initModule, setUp, update, draw, ctx, analyser, spectrums, getUserMedia;

/**
 * 初期設定
 * @exports
 */
setUp = () => {
  ctx = new AudioContext();
  analyser = ctx.createAnalyser();
  analyser.fftSize = FFT_SIZE;
  spectrums = new Uint8Array(analyser.frequencyBinCount);
  getUserMedia();
};

/**
 * 更新処理
 * @exports
 */
update = () => {

};

/**
 * 更新以外の処理
 * @exports
 */
draw = () => {

};

/**
 * 音声入力をAnalyserに繋ぐ
 *   完了時にget-user-mediaイベントを実行する
 */
getUserMedia = navigator.getUserMedia.bind(
  navigator,
  {audio: true},
  (stream) => {
    URL.createObjectURL(stream);
    ctx.createMediaStreamSource(stream).connect(analyser);
    $(window).trigger('get-user-media');
  },
  (e) => {
    alert('Audio error. Please reload');
    return;
  }
);

/**
 * モジュール起動
 * @exports
 */
initModule = () => {
  if (!_url || !_audioContext || !_navigatorGetUserMedia) {
    alert('This browser does not support a few modern APIs. Use Chrome.');
    return;
  }
};

export default {
  initModule,
  setUp,
  update,
  draw,
};
