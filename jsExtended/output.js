/*
* Created by narumi nogawa on 6/26/20.
*/
//このファイルは、ファイル出力関係を扱う

//素のsvgをpolyファイルに変換し、出力する関数
function convertOriginalSvgToPoly(fileReader, original) {
    /*
    ここで受け取るsvgは厳密なsvgでない
    ファイル出力用に値の一部を格納した配列である
    フォーマット：
    original(SvgInformation) = [...]
    opacity: [0~1の値, 0~1, 0~1,...]
    stroke: ["#f00", "#000", "#00f",...]
    stroke_width: [num, num, ...]
    x1: [num, ...]
    x2: [num, ...]
    y1: [num, ...]
    y2: [num, ...]
    */

    let x1 = original.x1;
    let x2 = original.x2;
    let y1 = original.y1;
    let y2 = original.y2;
    let vertexNumber = x1.length;
    var text= ``; //出力用の文字列
    //頂点
    text += `${vertexNumber*2} 2 0 0\n`;
    for (let index = 0; index < x1.length; index++) {
        text += `${index*2+1} ${x1[index]} ${y1[index]} 0\n`;
        text += `${index*2+2} ${x2[index]} ${y2[index]} 0\n`;
    }
    //セグメント
    text += `${vertexNumber} 0\n`;
    for (let index = 0; index < x1.length; index++) {
        text += `${index+1} ${index*2+1} ${index*2+2} 0\n`;
    }
    //ホールインデックスとホールの座標はなし
    text += `0\n`;
    fileReader.text = text;
}

//修正した展開図の情報をsvgファイルに変換する処理
function makeExtendedSVGFile(fileReader, original, output, optimized, gridline) {
    //出力svgファイルの宣言
    let text = `<?xml version="1.0" encoding="utf-8"?>\n`
    +`<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1000px" height="1200px" viewBox="0 0 1000.0 1200.0">\n`
    +`    <title>outputSVG</title>\n`;

    //ここから展開図情報を挿入していく
    //輪郭(黒)、山折り(赤)、谷折り(青)、分割線(黄色)、切り取り線(緑)、何もしない線(マゼンタ)に分けてからそれぞれまとめて追加する
    let black = [];
    let red = [];
    let blue = [];
    let yellow = [];
    let green = [];
    let magenta = [];

    let opacity = original.opacity;
    let stroke = original.stroke;
    let stroke_width = original.stroke_width;
    let x1 = original.x1;
    let x2 = original.x2;
    let y1 = original.y1;
    let y2 = original.y2;

    //振り分け
    for (let i = 0; i < stroke.length; i++) {
      let tmp = [opacity[i], stroke[i], stroke_width[i], x1[i], x2[i], y1[i], y2[i]];
      if (stroke[i] == "#000") {
        //黒
        black.push(tmp);
      } else if (stroke[i] == "#f00") {
        //赤
        red.push(tmp);
      } else if (stroke[i] == "#00f") {
        //青
        blue.push(tmp);
      } else if (stroke[i] == "#ff0") {
        //黄
        yellow.push(tmp);
      } else if (stroke[i] == "#0f0") {
        //緑
        green.push(tmp);
      } else if (stroke[i] == "#f0f") {
        //マゼンタ
        magenta.push(tmp);
      }
    }

    //outputとoptimizedruling使うところ
    //現在はどちらも黄色なのか？
    if (output.length > 0) {
      for (let i = 0; i < output.length-1; i+=2) {
        let start = output[i];
        let end = output[i+1];
        yellow.push([1, "#ff0", stroke_width[0], start[0], end[0], start[1], end[1]]);
      }
    }

    if (optimized.length > 0) {
      for (let i = 0; i < optimized.length-1; i+=2) {
        let start = optimized[i];
        let end = optimized[i+1];
        yellow.push([1, "#ff0", stroke_width[0], start[0], end[0], start[1], end[1]]);
      }
    }

    if (gridline.length > 0) {
      for (let i = 0; i < gridline.length; i++) {
        let tmp = gridline[i];
        magenta.push([1, "#f0f", stroke_width[0], tmp[0][0], tmp[1][0], tmp[0][1], tmp[1][1]]);
        //緑で出力
        //green.push([1, "#f0f", stroke_width[0], tmp[0][0], tmp[1][0], tmp[0][1], tmp[1][1]]);
      }
    }

    //格納作業
    //黒
    if (black.length > 0) {
      text += `    <g>\n`;
      for (let i = 0; i < black.length; i++) {
        text += `        <line fill="none" stroke="#000" stroke-miterlimit="10" x1="${black[i][3]}" y1="${black[i][5]}" x2="${black[i][4]}" y2="${black[i][6]}"/>\n`;
      }
      text += `    </g>\n`;
    }
    //赤
    if (red.length > 0) {
      text += `    <g>\n`;
      for (let i = 0; i < red.length; i++) {
        text += `        <line fill="none" stroke="#f00" stroke-miterlimit="10" x1="${red[i][3]}" y1="${red[i][5]}" x2="${red[i][4]}" y2="${red[i][6]}"/>\n`;
      }
      text += `    </g>\n`;
    }
    //青
    if (blue.length > 0) {
      text += `    <g>\n`;
      for (let i = 0; i < blue.length; i++) {
        text += `        <line fill="none" stroke="#00f" stroke-miterlimit="10" x1="${blue[i][3]}" y1="${blue[i][5]}" x2="${blue[i][4]}" y2="${blue[i][6]}"/>\n`;
      }
      text += `    </g>\n`;
    }
    //黄
    if (yellow.length > 0) {
      text += `    <g>\n`;
      for (let i = 0; i < yellow.length; i++) {
        text += `        <line fill="none" stroke="#ff0" stroke-miterlimit="10" x1="${yellow[i][3]}" y1="${yellow[i][5]}" x2="${yellow[i][4]}" y2="${yellow[i][6]}"/>\n`;
      }
      text += `    </g>\n`;
    }
    //緑
    if (green.length > 0) {
      text += `    <g>\n`;
      for (let i = 0; i < green.length; i++) {
        text += `        <line fill="none" stroke="#0f0" stroke-miterlimit="10" x1="${green[i][3]}" y1="${green[i][5]}" x2="${green[i][4]}" y2="${green[i][6]}"/>\n`;
      }
      text += `    </g>\n`;
    }
    //マゼンタ
    if (magenta.length > 0) {
      text += `    <g>\n`;
      for (let i = 0; i < magenta.length; i++) {
        text += `        <line fill="none" stroke="#f0f" stroke-miterlimit="10" x1="${magenta[i][3]}" y1="${magenta[i][5]}" x2="${magenta[i][4]}" y2="${magenta[i][6]}"/>\n`;
      }
      text += `    </g>\n`;
    }

    text += `</svg>\n`;
    fileReader.text = text;
}