import $ from 'jquery';
import hasRequestAnimationFrame from './apis/request-animation-frame';
import modVisual from './visual';
import modAudio from './audio';

const
  /** モジュール名 */
  MOD_NAME = 'of',
  /** HTML */
  HTML = `<div id="${MOD_NAME}" class="${MOD_NAME}"></div>`,
  // 現在のところハンドラー側が48にしか対応していない
  INITIAL_KEYDOWN_KEY_CODE = 48,
  /** requestAnimationFrame非対応ブラウザーに表示するアラートメッセージ */
  ALERT_MESSAGE = '' +
    'This browser is not supported.\n' +
    'Please open in GoogleChrome.';

var init, setUp, update, draw, loop, $cache, set$cache;

/**
 * jqueryオブジェクトを保持
 */
set$cache = () => {
  $cache = {
    self: $(`#${MOD_NAME}`),
    window: $(window),
  };
};

/**
 * 初期設定
 *   modVisualが先である必要あり
 *     get-user-mediaイベントが実行される前にハンドラーを登録する必要があるため
 */
setUp = () => {
  modVisual.setUp();
  modAudio.setUp();
  $cache.window.trigger($.Event(
    'keydown',
    {keyCode: INITIAL_KEYDOWN_KEY_CODE}
  ));
};

/**
 * 反復毎の更新処理
 *   modAudioが先である必要あり
 *     先に音量を取得しておく必要があるため
 */
update = () => {
  modAudio.update();
  modVisual.setVolume(modAudio.getVolume());
  modVisual.update();
};

/**
 * 反復毎の更新以外の処理
 */
draw = () => {
  modVisual.draw();
};

/**
 * 反復処理
 */
loop = () => {
  draw();
  update();
  requestAnimationFrame(loop);
};

/**
 * モジュール起動
 * @exports
 */
init = ($wrapper) => {
  if (!hasRequestAnimationFrame) {
    alert(ALERT_MESSAGE);
    return;
  }
  $wrapper.append(HTML);
  set$cache();
  modVisual.init($cache.self);
  modAudio.init($cache.self);
  setUp();
  loop();
};

export default {init};
