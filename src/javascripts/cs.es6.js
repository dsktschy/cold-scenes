import $ from 'jquery';
import modOF from './of/of';
import modVisual from './visual';
import modAudio from './audio';
import modInfo from './info';

const
  /** モジュール名 */
  ELEM_NAME = 'cs',
  /** HTML */
  HTML = `<div id="${ELEM_NAME}" class="${ELEM_NAME}"></div>`,
  /** 起動時に一度だけkeydownするkeycode */
  INITIAL_KEYDOWN_KEY_CODE = 53;

var
  init, setUp, draw, update, $cache, set$cache, onLoadResource, hasLoadedOther;

/**
 * jqueryオブジェクトを保持
 */
set$cache = () => {
  $cache = {
    self: $(`#${ELEM_NAME}`),
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
  $cache.window.trigger($.Event('keydown', {keyCode: 48}));
};

/**
 * 反復毎の更新以外の処理
 */
draw = () => {
  modVisual.draw();
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
 * 画像と音声入力の取得が完了した時のハンドラー
 */
onLoadResource = () => {
  if (!hasLoadedOther) {
    hasLoadedOther = true;
    return;
  }
  $cache.window.trigger($.Event(
    'keydown',
    {keyCode: INITIAL_KEYDOWN_KEY_CODE}
  ));
};

/**
 * モジュール起動
 * @exports
 */
init = ($wrapper) => {
  $wrapper.append(HTML);
  set$cache();
  hasLoadedOther = false;
  $cache.window.on('load-image get-user-media', onLoadResource);
  modVisual.init($cache.self);
  modAudio.init($cache.self);
  if (!modOF.init({setUp, draw, update})) {
    return;
  }
  modInfo.init($cache.self);
};

export default {init};
