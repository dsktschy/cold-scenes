import $ from 'jquery';
import hasRequestAnimationFrame from './apis/request-animation-frame';
import visual from './visual';
import audio from './audio';

const
  /** モジュール名 */
  MOD_NAME = 'of',
  /** HTML */
  HTML = `<div id="${MOD_NAME}" class="${MOD_NAME}"></div>`,
  // 現在のところハンドラー側が48にしか対応していない
  INITIAL_KEYDOWN_KEY_CODE = 48;

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
 *   visualが先である必要あり
 *     get-user-mediaイベントが実行される前にハンドラーを登録する必要があるため
 */
setUp = () => {
  visual.setUp();
  audio.setUp();
  $cache.window.trigger($.Event(
    'keydown',
    {keyCode: INITIAL_KEYDOWN_KEY_CODE}
  ));
};

/**
 * 反復毎の更新処理
 *   audioが先である必要あり
 *     先に音量を取得しておく必要があるため
 */
update = () => {
  audio.update();
  visual.setVolume(audio.getVolume());
  visual.update();
};

/**
 * 反復毎の更新以外の処理
 */
draw = () => {
  visual.draw();
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
    alert('This browser does not support a few modern APIs. Use Chrome.');
    return;
  }
  $wrapper.append(HTML);
  set$cache();
  visual.init($cache.self);
  audio.init($cache.self);
  setUp();
  loop();
};

export default {init};
