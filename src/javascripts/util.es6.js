var randomizeIntExceptFor, randomizeIntFromRange, remap;

/**
 * 0以上max未満かつcurrent以外の整数をランダムに抽出
 * @exports
 */
randomizeIntExceptFor = (current, max) => {
  var result;
  do {
    result = Math.floor(Math.random() * max);
  } while (result === current);
  return result;
};

/**
 * 指定範囲から整数をランダムに抽出
 * @exports
 */
randomizeIntFromRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

/**
 * 下記におけるxの値を求める
 * (value : valueを含む範囲) : (x : xを含む範囲)
 * @exports
 */
remap = (value, start1, stop1, start2, stop2) =>
  ((stop2 - start2) / (stop1 - start1)) * (value - start1) + start2;

export default {
  randomizeIntExceptFor,
  randomizeIntFromRange,
  remap,
};
