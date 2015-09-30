import $ from 'jquery';
import util from './util';

const
  IMAGE_WIDTH = 1024,
  IMAGE_HEIGHT = 768,
  HTML = `<canvas width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}"></canvas>`,
  SCENE_TOTAL = 30,
  FRAME_TOTAL = 10,
  IMAGE_TOTAL = SCENE_TOTAL * FRAME_TOTAL,
  CLEAR = 0,
  COVERED = 1,
  MIN_ALPHA = 0.05,
  MAX_ALPHA = 0.37,
  MIN_ALPHA_RANGE = 0.07,
  COVERING_SPEED = 0.002,
  CLEARING_SPEED = 0.002,
  DEFAULT_FRAMERATE_RESISTER = 5,
  MAX_FRAMERATE_RESISTER = 6,
  MAX_FRAMERATE_RESISTER_NUM = 60,
  MAX_MAX_FRAME = 200,
  MIN_MAX_FRAME = 50,
  MAX_VOLUME = 1024 * 36;

var
  initModule, getContext, onLoadImage, loadImages, clear, ctx, images, setUp,
  loadedCount, update, draw, scene, frame, incrementFrame, mode, frameCount,
  decrementFrame, randomizeScene, randomizeFrame, setUpFunctions, onKeydown,
  updateFunctions, drawFunctions, drawImage, alpha, maxFrameCount, setVolume,
  reduceFramerate, incrementOrDecrementFrame, getSetUpFunctions, volume,
  getUpdateFunctions, getDrawFunctions, framerateResisterNum, resetFrameCount,
  imagesAreAvailable, userMediaIsAvailable, onGetUserMedia;

/**
 * 初期設定
 * @exports
 */
setUp = () => {
  scene = 0;
  frame = 0;
  framerateResisterNum = 0;
  imagesAreAvailable = false;
  userMediaIsAvailable = false;
  ctx = getContext();
  setUpFunctions = getSetUpFunctions();
  updateFunctions = getUpdateFunctions();
  drawFunctions = getDrawFunctions();
  images = [];
  loadedCount = 0;
  loadImages();
  resetFrameCount();
};

/**
 * modeに応じた更新処理
 * @exports
 */
update = () => {
  updateFunctions[mode]();
};

/**
 * modeに応じた更新以外の処理
 * @exports
 */
draw = () => {
  drawFunctions[mode]();
};

/**
 * コンテクスト取得
 */
getContext = () => $('canvas')[0].getContext('2d');

/**
 * mode毎の、mode切り替え時の初期化・初回限定処理関数の配列
 */
getSetUpFunctions = () => [
  (e) => {
    mode = e.keyCode - 48;
    alpha = COVERED;
    ctx.globalAlpha = alpha;
  },
  (e) => {
    if (!imagesAreAvailable) {
      return;
    }
    mode = e.keyCode - 48;
    alpha = MIN_ALPHA + MIN_ALPHA_RANGE;
    ctx.globalAlpha = alpha;
  },
  (e) => {
    if (!imagesAreAvailable) {
      return;
    }
    mode = e.keyCode - 48;
    alpha = COVERED;
    ctx.globalAlpha = alpha;
  },
  (e) => {
    if (!imagesAreAvailable) {
      return;
    }
    mode = e.keyCode - 48;
    alpha = COVERED;
    ctx.globalAlpha = alpha;
  },
  (e) => {
    if (!imagesAreAvailable) {
      return;
    }
    mode = e.keyCode - 48;
    alpha = COVERED;
    ctx.globalAlpha = alpha;
  },
  (e) => {
    if (!imagesAreAvailable || !userMediaIsAvailable) {
      return;
    }
    mode = e.keyCode - 48;
    alpha = COVERED;
    ctx.globalAlpha = alpha;
  },
  (e) => {
    if (!imagesAreAvailable) {
      return;
    }
    mode = e.keyCode - 48;
    alpha = COVERED;
    ctx.globalAlpha = alpha;
  },
  (e) => {
    if (!imagesAreAvailable) {
      return;
    }
    mode = e.keyCode - 48;
    alpha = COVERED;
    ctx.globalAlpha = alpha;
  },
];

/**
 * mode毎の更新処理関数の配列
   * mode 0: 何もせず真っ暗に
   * mode 1: 最高速度 scene:ランダム frame:ランダム alpha:徐々に不透明へ
   * mode 2:
   * mode 3:
   * mode 4: 最高速度 scene:ランダム frame:ランダム
   * mode 5:
   * mode 6: 最高速度 scene:ランダム frame:昇順
   * mode 7: 最高速度 scene:ランダム frame:降順
 */
getUpdateFunctions = () => [
  () => {},
  () => {
    if (alpha < MAX_ALPHA) {
      alpha += COVERING_SPEED;
    }
    ctx.globalAlpha = Math.random() * (MIN_ALPHA + alpha) + MIN_ALPHA;
    randomizeFrame();
    randomizeScene();
  },
  reduceFramerate.bind(null, DEFAULT_FRAMERATE_RESISTER, () => {
    // randomFrameMode ? randomizeFrame() : incrementOrDecrementFrame();
    incrementOrDecrementFrame();
    if (++frameCount === maxFrameCount) {
      frameCount = 0;
      maxFrameCount = util.randomizeIntFromRange(MIN_MAX_FRAME, MAX_MAX_FRAME);
      randomizeScene();
    }
  }),
  () => {
    if (alpha > CLEAR) {
      alpha -= CLEARING_SPEED;
    }
    ctx.globalAlpha = alpha;
    reduceFramerate(DEFAULT_FRAMERATE_RESISTER, () => {
      // randomFrameMode ? randomizeFrame() : incrementOrDecrementFrame();
      incrementOrDecrementFrame();
      if (++frameCount === maxFrameCount) {
        frameCount = 0;
        maxFrameCount = util.randomizeIntFromRange(MIN_MAX_FRAME, MAX_MAX_FRAME);
        randomizeScene();
      }
    });
  },
  () => {
    randomizeFrame();
    randomizeScene();
  },
  () => {
    reduceFramerate(
      Math.floor(util.remap(volume, 0, MAX_VOLUME, MAX_FRAMERATE_RESISTER, 1)),
      () => {
        // randomFrameMode ? randomizeFrame() : incrementOrDecrementFrame();
        incrementOrDecrementFrame();
        if (++frameCount === maxFrameCount) {
          frameCount = 0;
          maxFrameCount = util.randomizeIntFromRange(MIN_MAX_FRAME, MAX_MAX_FRAME);
          randomizeScene();
        }
      }
    );
  },
  () => {
    if (incrementFrame()) {
      randomizeScene();
    }
  },
  () => {
    if (decrementFrame()) {
      randomizeScene();
    }
  },
];

/**
 * mode毎の描画処理関数の配列
 */
getDrawFunctions = () => [
  clear,
  drawImage,
  drawImage,
  drawImage,
  drawImage,
  drawImage,
  drawImage,
  drawImage,
];

/**
 * 画像を読み込み
 */
loadImages = () => {
  for (let s = 0; s < SCENE_TOTAL; s++) {
    images[s] = [];
    for (let f = 0; f < FRAME_TOTAL; f++) {
      images[s][f] = new Image();
      images[s][f].src = `../images/${s}/${f}.jpg`;
      images[s][f].onload = onLoadImage;
    }
  }
};

/**
 * sceneが留まるmodeでのframeカウントと最大frame数をリセット
 */
resetFrameCount = () => {
  frameCount = 0;
  maxFrameCount = util.randomizeIntFromRange(MIN_MAX_FRAME, MAX_MAX_FRAME);
};

/**
 * クリア
 */
clear = () => {
  ctx.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
};

/**
 * クリアして画像表示
 */
drawImage = () => {
  ctx.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
  ctx.drawImage(images[scene][frame], 0, 0);
};

/**
 * 画像読み込み完了イベントのハンドラー
 *   全ての画像が読み込み完了していたらフラグを立てる
 */
onLoadImage = () => {
  if (++loadedCount === IMAGE_TOTAL) {
    imagesAreAvailable = true;
    console.log('Images are now available.');
  }
};

/**
 * フレームレートを小さくする
 */
reduceFramerate = (resister, callback) => {
  if (framerateResisterNum % resister === 0) {
    callback();
  }
  if (++framerateResisterNum === MAX_FRAMERATE_RESISTER_NUM) {
    framerateResisterNum = 0;
  }
};

/**
 * 画像通し番号を1変更し、一周したかどうかを返す
 */
incrementFrame = () => {
  if (++frame === FRAME_TOTAL) {
    frame = 0;
    return true;
  }
  return false;
};
decrementFrame = () => {
  if (--frame === -1) {
    frame = FRAME_TOTAL - 1;
    return true;
  }
  return false;
};

/**
 * 画像通し番号を前後どちらかランダムに1変更
 */
incrementOrDecrementFrame = () => {
  var direction;
  direction = Math.floor(Math.random() * 2);
  direction = (frame === 0 || (direction && frame !== (FRAME_TOTAL - 1)));
  frame += direction ? 1 : -1;
};

/**
 * 画像通し番号をランダムに変更
 */
randomizeScene = () => {
  scene = util.randomizeIntExceptFor(scene, SCENE_TOTAL);
};
randomizeFrame = () => {
  frame = util.randomizeIntExceptFor(frame, FRAME_TOTAL);
};

/**
 * 音量を保持する
 * @exports
 */
setVolume = (v) => {
  volume = v;
};

/**
 * キーボード押下イベントのハンドラ
 *   右: frameを1つ進める
 *   左: frameを1つ戻す
 *   上: frameを1つ進めるか戻す
 *   下: frameランダムに変更
 *   スペース: sceneをランダムに変更
 *   0-7: modeを変更
 */
onKeydown = (e) => {
  switch (e.keyCode) {
    case 39:
      incrementFrame();
      break;
    case 37:
      decrementFrame();
      break;
    case 32:
      resetFrameCount();
      randomizeScene();
      break;
    case 38:
      incrementOrDecrementFrame();
      break;
    case 40:
      randomizeFrame();
      break;
    case 48:
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
      setUpFunctions[e.keyCode - 48](e);
      break;
  }
};

/**
 * 音声入力のAnalyser接続完了イベントのハンドラー
 */
onGetUserMedia = () => {
  userMediaIsAvailable = true;
  console.log('User media is now available.');
};

/**
 * モジュール起動
 * @exports
 */
initModule = ($container) => {
  $container.html(HTML);
  $(window)
    .on('keydown', onKeydown)
    .on('get-user-media', onGetUserMedia);
};

export default {
  initModule,
  setUp,
  update,
  draw,
  setVolume,
};
