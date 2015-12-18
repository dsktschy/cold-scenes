import hasRequestAnimationFrame from './apis/request-animation-frame';

const
  /** requestAnimationFrame非対応ブラウザに表示するアラートメッセージ */
  ALERT_MESSAGE = '' +
    'This browser is not supported.\n' +
    'Please open in GoogleChrome.';

var init, loop;

/**
 * 反復処理
 * @param {Object}
 */
loop = ({draw, update}) => {
  draw();
  update();
  requestAnimationFrame(loop.bind(null, {draw, update}));
};

/**
 * モジュール起動
 *   ブラウザ確認後、setUp実行、loop開始
 * @exports
 * @param {Object}
 */
init = ({setUp, draw, update}) => {
  if (!hasRequestAnimationFrame) {
    alert(ALERT_MESSAGE);
    return false;
  }
  setUp();
  loop({draw, update});
  return true;
};

export default {init};
