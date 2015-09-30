import $ from 'jquery';
import _url from './url';
import _audioContext from './audio-context';
import _navigatorGetUserMedia from './navigator-get-user-media';

const
  FFT_SIZE = 1024,
  MAX_VOLUME = 1024 * 36;

var
  initModule, setUp, update, ctx, analyser, spectrums, getUserMedia, mode,
  setUpFunctions, updateFunctions, getSetUpFunctions, getUpdateFunctions,
  volumeTotal, onKeydown, getVolume, userMediaIsAvailable;

/**
 * 初期設定
 * @exports
 */
setUp = () => {
  setUpFunctions = getSetUpFunctions();
  updateFunctions = getUpdateFunctions();
  userMediaIsAvailable = false;
  ctx = new AudioContext();
  analyser = ctx.createAnalyser();
  analyser.fftSize = FFT_SIZE;
  spectrums = new Uint8Array(analyser.frequencyBinCount);
  getUserMedia();
};

/**
 * modeに応じた更新処理
 * @exports
 */
update = () => {
  updateFunctions[mode]();
};

/**
 * mode毎の、mode切り替え時の初期化・初回限定処理関数の配列
 */
getSetUpFunctions = () => [
  (e) => {
    mode = e.keyCode - 48;
  },
  (e) => {
    if (!userMediaIsAvailable) {
      return;
    }
    mode = e.keyCode - 48;
  },
  (e) => {
    if (!userMediaIsAvailable) {
      return;
    }
    mode = e.keyCode - 48;
  },
  (e) => {
    if (!userMediaIsAvailable) {
      return;
    }
    mode = e.keyCode - 48;
  },
  (e) => {
    if (!userMediaIsAvailable) {
      return;
    }
    mode = e.keyCode - 48;
  },
  (e) => {
    if (!userMediaIsAvailable) {
      return;
    }
    mode = e.keyCode - 48;
  },
  (e) => {
    if (!userMediaIsAvailable) {
      return;
    }
    mode = e.keyCode - 48;
  },
  (e) => {
    if (!userMediaIsAvailable) {
      return;
    }
    mode = e.keyCode - 48;
  },
];

/**
 * mode毎の更新処理関数の配列
 */
getUpdateFunctions = () => [
  () => {},
  () => {},
  () => {},
  () => {},
  () => {},
  () => {
    analyser.getByteFrequencyData(spectrums);
    volumeTotal = 0;
    for (let spectrum of spectrums) {
      volumeTotal += spectrum;
    }
    if (volumeTotal > MAX_VOLUME) {
      volumeTotal = MAX_VOLUME;
    }
  },
  () => {},
  () => {},
];

/**
 * 音声入力をAnalyserに繋ぐ
 *   完了時にget-user-mediaイベントを実行する
 */
getUserMedia = () => {
  navigator.getUserMedia(
    {audio: true},
    (stream) => {
      URL.createObjectURL(stream);
      ctx.createMediaStreamSource(stream).connect(analyser);
      $(window).trigger('get-user-media');
      userMediaIsAvailable = true;
    },
    (e) => {
      alert('Audio error. Please reload');
      return;
    }
  );
};

/**
 * 音量を返す
 * @exports
 */
getVolume = () => volumeTotal;

/**
 * キーボード押下イベントのハンドラー
 *   0-7: modeを変更
 */
onKeydown = (e) => {
  switch (e.keyCode) {
    case 48:
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
      setUpFunctions[e.keyCode - 48](e);
      break;
  }
};

/**
 * モジュール起動
 * @exports
 */
initModule = () => {
  if (!_url || !_audioContext || !_navigatorGetUserMedia) {
    alert('This browser does not support a few modern APIs. Use Chrome.');
    return;
  }
  $(window).on('keydown', onKeydown);
};

export default {
  initModule,
  setUp,
  update,
  getVolume,
};
