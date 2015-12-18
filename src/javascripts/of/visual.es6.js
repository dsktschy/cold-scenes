const
  /** 非対応ブラウザに表示するアラートメッセージ */
  API_ALERT_MESSAGE = '' +
    'This browser is not supported.\n' +
    'Please open in GoogleChrome.';

var init;

/**
 * モジュール起動
 * @exports
 * @param {Object} canvas
 * @param {string} ctxType
 */
init = (canvas, ctxType) => {
  if (!window.CanvasRenderingContext2D) {
    alert(API_ALERT_MESSAGE);
    return null;
  }
  return canvas.getContext(ctxType);
};

export default {init};
