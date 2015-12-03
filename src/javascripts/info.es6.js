import $ from 'jquery';

const
  /** モジュール名 */
  ELEM_NAME = 'cs-info',
  /** HTML */
  HTML = '' +
    `<div id="${ELEM_NAME}" class="${ELEM_NAME}">` +
      '<p>' +
        'COLD SCENES<br>' +
        '<br>' +
        '<br>' +
        'H or I: Open/Close this info<br>' +
        '<br>' +
        '0: Stop<br>' +
        '1: Random scenes and random frames, under the dark filter <br>' +
        '2: Go to the next or previous frame, at a regular speed<br>' +
        '3: 2 + Darken gradually<br>' +
        '4: Random scenes and random frames, at the max speed<br>' +
        '5: Go to the next or previous frame, ' +
          'at the speed according to the volume of the microphone<br>' +
        '6: Random scenes and Frames in forward order, at the max speed<br>' +
        '7: Random scenes and Frames in reverse order, at the max speed<br>' +
        '<br>' +
        'Space: Change the scene<br>' +
        '<br>' +
        '<br>' +
        '<a href="https://youtu.be/c2Qyo_Cq9zQ">' +
          'https://youtu.be/c2Qyo_Cq9zQ' +
        '</a><br>' +
        '<a href="http://geidai-oil.com/tsaw/">' +
          'http://geidai-oil.com/tsaw/' +
        '</a><br>' +
        '<br>' +
        '<br>' +
        '© 2015 DSKTSCHY' +
      '</p>' +
    '</div>',
  /** 表示時の透明度 */
  OPACITY_VISIBLE = '0.6',
  /** 非表示時の透明度 */
  OPACITY_HIDDEN = '0';

var init, set$cache, $cache, onKeydown;

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
 * キーボード押下イベントのハンドラ
 *   H or I: infoを表示
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
 * モジュール起動
 * @exports
 */
init = ($wrapper) => {
  $wrapper.append(HTML);
  set$cache();
  $cache.window.on('keydown', onKeydown);
};

export default {init};
