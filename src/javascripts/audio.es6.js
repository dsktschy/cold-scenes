import $ from 'jquery';
import hasURL from './apis/url';
import hasNavigatorGetUserMedia from './apis/navigator-get-user-media';
import modOFAudio from './of/audio';

const
  FFT_SIZE = 1024,
  MAX_VOLUME = 1024 * 36,
  /** API非対応ブラウザに表示するアラートメッセージ */
  API_ALERT_MESSAGE = '' +
    'This browser is not supported.\n' +
    'Please open in GoogleChrome.',
  /** ユーザー入力音声取得失敗時のアラートメッセージ */
  AUDIO_ALERT_MESSAGE = 'Audio error. Please reload',
  /** ユーザー入力音声取得完了時のメッセージ */
  CONSOLE_MESSAGE = 'Audio is now available.';

var
  init, setUp, update, ctx, analyser, spectrums, getUserMedia, mode,
  setUpFunctions, updateFunctions, getSetUpFunctions, getUpdateFunctions,
  volumeTotal, onKeydown, getVolume, userMediaIsAvailable, set$cache, $cache;

/**
 * jqueryオブジェクトを保持
 */
set$cache = () => {
  $cache = {
    window: $(window),
  };
};

/**
 * 初期設定
 * @exports
 */
setUp = () => {
  setUpFunctions = getSetUpFunctions();
  updateFunctions = getUpdateFunctions();
  userMediaIsAvailable = false;
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
      userMediaIsAvailable = true;
      $cache.window.trigger('get-user-media');
      console.log(CONSOLE_MESSAGE);
    },
    (e) => {
      console.log(e);
      alert(AUDIO_ALERT_MESSAGE);
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
 * キーボード押下イベントのハンドラ
 *   0-7: modeを変更
 * @param {Object} e
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
init = () => {
  if (!hasURL || !hasNavigatorGetUserMedia) {
    alert(API_ALERT_MESSAGE);
    return;
  }
  set$cache();
  ctx = modOFAudio.init();
  if (!ctx) {
    return;
  }
  $cache.window.on('keydown', onKeydown);
};

export default {
  init,
  setUp,
  update,
  getVolume,
};
