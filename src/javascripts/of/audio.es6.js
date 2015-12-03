import hasAudioContext from './apis/audio-context';

const
  /** 非対応ブラウザーに表示するアラートメッセージ */
  API_ALERT_MESSAGE = '' +
    'This browser is not supported.\n' +
    'Please open in GoogleChrome.';

var init;

/**
 * モジュール起動
 * @exports
 */
init = () => {
  if (!hasAudioContext) {
    alert(API_ALERT_MESSAGE);
    return null;
  }
  return new AudioContext();
};

export default {init};
