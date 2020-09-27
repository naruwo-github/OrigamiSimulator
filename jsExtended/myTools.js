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
