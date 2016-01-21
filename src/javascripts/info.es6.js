import $ from 'jquery';

const
  /** モジュール全体の要素名 */
  ELEM_NAME = 'cs-info',
  /** LOADING部分の要素名 */
  ELEM_NAME_LOADING = 'loading',
  /** HTML */
  HTML = '' +
    `<div id="${ELEM_NAME}" class="${ELEM_NAME}">` +
      '<p class="br3">COLD SCENES</p>' +
      '<p class="br2">Press the following keys</p>' +
      '<p class="br2">[I] Open/Close this info</p>' +
      '<p>[0] Stop</p>' +
      '<p>[1] Random scenes and random frames, under the dark filter </p>' +
      '<p>[2] Go to the next or previous frame, at a regular speed</p>' +
      '<p>[3] 2 + Darken gradually</p>' +
      '<p>[4] Random scenes and random frames, at the max speed</p>' +
      '<p>' +
        '[5] Go to the next or previous frame, ' +
        'at the speed according to the volume of the microphone' +
      '</p>' +
      '<p>' +
        '[6] Random scenes and Frames in forward order, at the max speed' +
      '</p>' +
      '<p class="br2">' +
        '[7] Random scenes and Frames in reverse order, at the max speed' +
      '</p>' +
      '<p class="br3">[Space] Change the scene</p>' +
      '<p><a href="https://youtu.be/DlldYnxNS-k">YouTube</a></p>' +
      '<p class="br3">' +
        '<a href="http://geidai-oil.com/tsaw/">geidai-oil.com</a>' +
      '</p>' +
      '<p class="br3">© 2015 DSKTSCHY</p>' +
      `<p class="${ELEM_NAME_LOADING}" id="${ELEM_NAME_LOADING}">` +
        'LOADING <span></span>' +
      '</p>' +
    '</div>',
  /** 表示時の透明度 */
  OPACITY_VISIBLE = '0.6',
  /** 非表示時の透明度 */
  OPACITY_HIDDEN = '0',
  /** LOADINGアニメーションの間隔(ms) */
  ANIMATION_INTERVAL = '500',
  /** LOADINGの後の.の最大数 */
  DOTS_MAX = 3;

var
  init, set$cache, $cache, onKeydown, onLoadResource, hasLoadedOther,
  intervalID, animateDots;

/**
 * jqueryオブジェクトを保持
 */
set$cache = () => {
  $cache = {
    self: $(`#${ELEM_NAME}`),
    loading: $(`#${ELEM_NAME_LOADING}`),
    dots: $(`#${ELEM_NAME_LOADING}`).find('span'),
    window: $(window),
  };
};

/**
 * .を増減する
 */
animateDots = () => {
  if ($cache.dots.html().length === DOTS_MAX) {
    $cache.dots.empty();
    return;
  }
  $cache.dots.append('.');
};

/**
 * キーボード押下イベントのハンドラ
 *   H or I: infoを表示
 * @param {Object} e
 */
onKeydown = (e) => {
  switch (e.keyCode) {
    case 72:
    case 73:
      $cache.self.css(
        'opacity',
        $cache.self.css('opacity') === OPACITY_VISIBLE
          ? OPACITY_HIDDEN
          : OPACITY_VISIBLE
      );
      break;
  }
};

/**
 * 画像と音声入力の取得が完了した時のハンドラ
 */
onLoadResource = () => {
  if (!hasLoadedOther) {
    hasLoadedOther = true;
    return;
  }
  clearInterval(intervalID);
  $cache.loading.remove();
};

/**
 * モジュール起動
 * @exports
 * @param {Object} $wrapper
 */
init = ($wrapper) => {
  $wrapper.append(HTML);
  set$cache();
  hasLoadedOther = false;
  $cache.window.on({
    keydown: onKeydown,
    'load-image get-user-media': onLoadResource,
  });
  intervalID = setInterval(animateDots, ANIMATION_INTERVAL);
};

export default {init};
