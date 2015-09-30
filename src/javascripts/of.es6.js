import $ from 'jquery';
import _requestAnimationFrame from './request-animation-frame';
import visual from './visual';

var initModule, setUp, update, draw, loop;

/**
 * 初期設定
 */
setUp = () => {
  visual.setUp();
};

/**
 * 反復毎の更新処理
 */
update = () => {
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
initModule = ($container) => {
  if (!_requestAnimationFrame) {
    alert('This browser does not support a few modern APIs. Use Chrome.');
    return;
  }
  visual.initModule($container);
  $(window).on('load-images', loop);
  setUp();
};

export default {initModule};
