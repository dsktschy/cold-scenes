import $ from 'jquery';
import _requestAnimationFrame from './request-animation-frame';
import visual from './visual';
import audio from './audio';

const
  // 現在のところハンドラー側が48にしか対応していない
  INITIAL_KEYDOWN_KEY_CODE = 48;

var init, setUp, update, draw, loop;

/**
 * 初期設定
 *   visualが先である必要あり
 *     get-user-mediaイベントが実行される前にハンドラーを登録する必要があるため
 */
setUp = () => {
  visual.setUp();
  audio.setUp();
  $(window).trigger($.Event('keydown', {keyCode: INITIAL_KEYDOWN_KEY_CODE}));
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
init = ($container) => {
  if (!_requestAnimationFrame) {
    alert('This browser does not support a few modern APIs. Use Chrome.');
    return;
  }
  visual.init($container);
  audio.init($container);
  setUp();
  loop();
};

export default {init};
