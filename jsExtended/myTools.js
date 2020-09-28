/*
* Created by narumi nogawa on 9/27/20.
*/

// Tool.js : 汎用的な関数を定義するファイル
/*
globals内のインスタンスに定義すると、
globals.hogehoge.functionと記述が長くなってしまうため、
複数のファイルで扱う関数はここにまとめる
*/

// 2点間の距離を求める関数
function dist(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
}

// 点P0から線分P1P2までの距離を求める
function distPointToPolyline(x0, y0, x1, y1, x2, y2) {
    let a = x2 - x1;
    let b = y2 - y1;
    let a2 = a * a;
    let b2 = b * b;
    let r2 = a2 + b2;
    let tt = -(a*(x1-x0)+b*(y1-y0));
    if( tt < 0 ) {
      return (x1-x0)*(x1-x0) + (y1-y0)*(y1-y0);
    }
    if( tt > r2 ) {
      return (x2-x0)*(x2-x0) + (y2-y0)*(y2-y0);
    }
    let f1 = a*(y1-y0)-b*(x1-x0);
    // 求める距離の2乗値：(f1*f1)/r2;
    return Math.sqrt((f1*f1)/r2);
}

// hexをgbaに変換する関数
function hex2rgb(hex) {
    if (hex.slice(0,1) == "#") {
      hex = hex.slice(1);
    }
    if (hex.length == 3) {
      hex = hex.slice(0,1) + hex.slice(0,1) + hex.slice(1,2) + hex.slice(1,2) + hex.slice(2,3) + hex.slice(2,3);
    }
    return [hex.slice(0,2), hex.slice(2,4), hex.slice(4,6)].map(function(str) {
      return parseInt(str,16);
    });
}