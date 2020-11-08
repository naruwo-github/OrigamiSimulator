/*
* Created by narumi nogawa on 6/1/19.
*/
//ドローアプリの部分
//展開図の修正機能の追加を目的としている

// const kmeans = require("./kmeans").default;

function initDrawApp(globals) {
  // NOTE: キャンバス、コンテキストの準備
  const canvas = document.querySelector('#draw-area');
  const context = canvas.getContext('2d');
  $('#draw-area').attr('width', $(window).width());
  $('#draw-area').attr('height', $(window).height());
  context.font = "40px 'Century Gothic'";
  context.strokeText("Click here",$(window).width()/2-100,$(window).height()/2);

  var straightLineList = [];
  var straight = false;
  var straightLineButton = document.getElementById("sline-button");

  // NOTE: ボタンの元の色を記憶しておく
  const buttonColor = straightLineButton.style.backgroundColor;

  var splineList = [];
  var splineDistList = [];

  var beziList = []; //ベジェ曲線の座標を格納する
  var beziDistList = []; //ベジェ曲線の長さを保存する
  var cpMove2 = false;
  var movedIndex2 = 10000;

  var rulingNum = 10; //rulingの本数
  var startEndInformation = []; //rulingの始点と終点の情報を記憶する配列
  var ruling1 = false; //ruling1ツールのon/offを表すフラグ
  var ruling1Button = document.getElementById("ruling1-button");
  var dragging = false; //ドラッグ中のフラグ
  var dragList = []; //ドラッグで取得した座標を格納する配列
  var cpMove = false; //ドラッグ操作が制御点を移動しているものかどうかのフラグ
  var movedIndex = 10000; //移動する制御点のindexを保持

  var ruling2 = false; //ruling2ツールのon/offを表すフラグ
  var ruling2Button = document.getElementById("ruling2-button");
  var ru2array = []; //rulingツール2で使う配列


  //===== Grid Tool Information ======
  var gridTool = {};
  gridTool.flag = false;
  gridTool.points = [];

  //正三角形のタイリングツール
  var regularTrianglationTool = {};
  regularTrianglationTool.flag = false;
  regularTrianglationTool.points = [];
  regularTrianglationTool.structure = {};

  //正三角形ツール
  var regularTriangleButton = document.getElementById("rt-tool");


  //===暫定的に用いるやつ===
  var qtreeButton = document.getElementById("qtree-mode");
  var qtreeFlag = false;
  //q_tree.pointsが輪郭の点、q_tree.structureが四分木そのものを表す
  var q_tree = {};
  q_tree.points = [];
  q_tree.structure = {};
  //=====================


  var gridButton = document.getElementById("grid-button");
  //中身はこんな感じ↓ gridLineList = ([[x0,y0],[x1,y1],color],,,[[xn-1,yn-1],[xn,yn],color])
  var gridLineList = [];
  var gridnumber = 32;
  var gridNum = document.getElementById("grid-num");
  gridNum.innerText = gridnumber;
  var gridNumUp = document.getElementById("grid-up");
  gridNumUp.innerText = "▲";
  gridNumUp.addEventListener("click", function() {
    gridnumber++;
    gridNum.innerText = gridnumber;
    canvasReload();
    drawCanvas();
  });
  var gridNumDown = document.getElementById("grid-down");
  gridNumDown.addEventListener("click", function() {
    gridnumber--;
    gridNum.innerText = gridnumber;
    canvasReload();
    drawCanvas();
  });
  gridNumDown.innerText = "▼";
  var gridMode = document.getElementById("grid-mode");
  gridMode.mode = 0;



  //===================================


  var readerFile = new FileReader(); //svg(分割線が追加されてないやつ)のdlに使う

  //順に山、分割線(Ruling)、谷、分割線(ただの線)、切り取り線
  var lineColors = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", 
  "rgb(255, 0, 255)", "rgb(0, 255, 255)", "rgb(255, 255, 0)", "rgb(30, 30, 30)"];
  var colorButton = document.getElementById("ruling1-color");
  colorButton.style.color = "rgb(255, 255, 255)";
  colorButton.style.backgroundColor = lineColors[1];

  //Num Buttonの数値を初期化
  var displayRulingNum = document.getElementById("ruling-num");
  displayRulingNum.innerText = String(rulingNum);
  var upButton = document.getElementById("up-num");
  upButton.innerHTML = "▲";
  var downButton = document.getElementById("down-num");
  downButton.innerHTML = "▼";

  //テストボタン
  var rotateGridButton = document.getElementById("grid-angle");
  var rotationGridAngle = parseInt(rotateGridButton.innerText);
  rotateGridButton.addEventListener("click", function() {
    rotationGridAngle+=1;
    rotateGridButton.innerText = String(rotationGridAngle);
    canvasReload();
    drawCanvas();
  });

  //出力のリスト(構造は[[x0, y0],...,[xn, yn]])
  var outputList = [];
  //最適化されたrulingを保存するリスト
  var optimizedRuling = [];
  //----------------------------------------------------------------------


  //=====================================================
  //========== 自動メッシュONフラグと、木の高さ詳細 ===========
  //自動メッシュの設定
  var Hmin = 3;
  var Hmax = 5;
  var autoMeshButton = document.getElementById("auto-mesh");
  var autoMeshFlag = false;
  autoMeshButton.addEventListener("click", function() {
    autoMeshFlag = !autoMeshFlag;
    autoMeshButton.innerText = String(autoMeshFlag);
  });
  var HminNumButton = document.getElementById("hmin-num");
  HminNumButton.innerText = String(Hmin);
  var HminUp = document.getElementById("hmin-up");
  var HminDown = document.getElementById("hmin-down");
  var HmaxNumButton = document.getElementById("hmax-num");
  HmaxNumButton.innerText = String(Hmax);
  var HmaxUp = document.getElementById("hmax-up");
  var HmaxDown = document.getElementById("hmax-down");
  HminUp.addEventListener("click", function() {
    Hmin++;
    HminNumButton.innerText = String(Hmin);
    if (Hmin > Hmax) {
      Hmax++;
      HmaxNumButton.innerText = String(Hmax);
    }
  });
  HminDown.addEventListener("click", function() {
    Hmin--;
    HminNumButton.innerText = String(Hmin);
  });
  HmaxUp.addEventListener("click", function() {
    Hmax++;
    HmaxNumButton.innerText = String(Hmax);
  });
  HmaxDown.addEventListener("click", function() {
    Hmax--;
    HmaxNumButton.innerText = String(Hmax);
    if (Hmin > Hmax) {
      Hmin--;
      HminNumButton.innerText = String(Hmin);
    }
  });
  //=====================================================

  //=========== 正三角形タイリングの入力と個数調整 ============
  var RegularTriangleEdgeNum = document.getElementById("rt-num");
  var triangleEdgeDenominator = parseInt(RegularTriangleEdgeNum.innerText);
  var rtenUp = document.getElementById("rt-up");
  var rtenDown = document.getElementById("rt-down");
  rtenUp.addEventListener("click", function() {
    if (triangleEdgeDenominator < 200) {
      triangleEdgeDenominator += 1;
      RegularTriangleEdgeNum.innerText = String(triangleEdgeDenominator);
    }
  });
  rtenDown.addEventListener("click", function() {
    if (triangleEdgeDenominator > 0) {
      triangleEdgeDenominator -= 1;
      RegularTriangleEdgeNum.innerText = String(triangleEdgeDenominator);
    }
  });
  //=====================================================
  var anchorPoints = document.getElementById("anchor-points");
  anchorPoints.flag = false;
  anchorPoints.points = [];
  anchorPoints.addEventListener("click", function() {
    anchorPoints.flag = !anchorPoints.flag;
    if (anchorPoints.flag) {
      anchorPoints.style.backgroundColor = "rgb(255, 170, 120)";
    } else {
      anchorPoints.style.backgroundColor = "rgb(150, 150, 150)";
    }
  });
  //=====================================================
  var terminalInputButton = document.getElementById("terminal-on-grid");
  terminalInputButton.points = [];
  terminalInputButton.flag = false;
  terminalInputButton.inputLineList = [];
  terminalInputButton.inputLineColors = [];
  var terminalInputColor = document.getElementById("terminal-line-color");
  terminalInputColor.style.backgroundColor = lineColors[0];
  terminalInputColor.style.color = "rgb(200, 200, 200)";
  terminalInputColor.addEventListener("click", function() {
    if (terminalInputColor.style.backgroundColor === lineColors[0]) {
      terminalInputColor.style.backgroundColor = lineColors[2];
      terminalInputColor.innerText = "Valley";
    } else if (terminalInputColor.style.backgroundColor === lineColors[2]) {
      terminalInputColor.style.backgroundColor = lineColors[0];
      terminalInputColor.innerText = "Mountain";
    }
  });
  // NOTE: 新たに生成する折り線情報を持つオブジェクト
  var newFoldingLineObject = { colors: [], lines: []};
  //=====================================================
  

  // NOTE: キャンバスの描画関数
  function drawCanvas() {
    // NOTE: 変数の初期化
    splineDistList = [];
    beziDistList = [];
    outputList = [];
    startEndInformation = [];
    gridLineList = [];
    newFoldingLineObject = { colors: [], lines: []};

    //一時的にやってる
    anchorPoints.points = [];

    // NOTE: 三角形分割結果の描画
    drawTrianglationResult(context, globals.autoTriangulatedInfo);

    // NOTE: 直線ツールの点
    context.fillStyle = lineColors[0];
    for (let index = 0; index < straightLineList.length; index+=2) {
      const stl1 = straightLineList[index];
      const stl2 = straightLineList[index+1];
      context.fillRect(stl1[0]-3, stl1[1]-3, 5, 5);
      context.fillRect(stl2[0]-3, stl2[1]-3, 5, 5);
      if(stl2[0] !== null) {
        drawLine(context, lineColors[1], 2, stl1[0], stl1[1], stl2[0], stl2[1]);
      }
    }

    /*
    //rulingツールの点(ベジェ曲線)
    context.fillStyle = lineColors[4];
    for(let index = 0; index < beziList.length; index++) {
      const coo = beziList[index];
      context.fillRect(coo[0]-3, coo[1]-3, 7, 7);
    }

    //ベジェ曲線を描画
    //beziDistList = new Array();
    if(beziList.length > 0 && beziList.length % 4 === 0) {
      for(let index = 0; index < beziList.length; index+=4) {
        const cp1 = beziList[index];
        const cp2 = beziList[index+1];
        const cp3 = beziList[index+2];
        const cp4 = beziList[index+3];
        globals.beziercurve.drawBezier(context, beziDistList, 
          cp1[0], cp1[1], cp2[0], cp2[1], cp3[0], cp3[1], cp4[0], cp4[1]);

        //ruling描画
        globals.ruling.findBezierRuling(rulingNum, startEndInformation, outputList, context, 
          beziDistList[beziDistList.length-1], cp1[0], cp1[1], cp2[0], cp2[1], cp3[0], cp3[1], cp4[0], cp4[1]);
      }
    }
    */

    // NOTE: スプライン曲線を描画
    if (splineList.length > 0 && splineList.length % 7 == 0) {
      //splineツールの制御点
      let i, t;
      for (i = 0; i < splineList.length; i++) {
        var coo = splineList[i];
        context.fillStyle = lineColors[4];
        context.fillRect(coo[0]-3,coo[1]-3,7,7);
      }

      for (i = 0; i < splineList.length; i+=7) {
        var sp1 = splineList[i];
        var sp2 = splineList[i+1];
        var sp3 = splineList[i+2];
        var sp4 = splineList[i+3];
        var sp5 = splineList[i+4];
        var sp6 = splineList[i+5];
        var sp7 = splineList[i+6];
        
        var points = [[sp1[0], sp1[1]], [sp2[0], sp2[1]], [sp3[0], sp3[1]], 
        [sp4[0], sp4[1]], [sp5[0], sp5[1]], [sp6[0], sp6[1]], [sp7[0], sp7[1]]];

        var spline = new BSpline(points, 5);
        var splineDist = 0.0;

        context.strokeStyle = "rgb(0,0,0)";
        context.lineWidth = 2;
        for (t = 0; t < 1; t+=0.01) {
          var p1 = spline.calcAt(t);
          var p2 = spline.calcAt(t+0.01);
          context.beginPath();
          context.moveTo(p1[0], p1[1]);
          context.lineTo(p2[0], p2[1]);
          context.closePath();
          context.stroke();

          splineDist += dist(p1[0], p1[1], p2[0], p2[1]);
        }
        splineDistList.push(splineDist);
        globals.ruling.findSplineRuling(rulingNum,startEndInformation,outputList,context,splineDistList[splineDistList.length - 1],spline);
      }
    }

    // NOTE: optimized rulingの描画
    if (optimizedRuling.length > 0) {
      for (let i = 0; i < optimizedRuling.length - 1; i+=2) {
        var coo1 = optimizedRuling[i];
        var coo2 = optimizedRuling[i+1];
        drawLine(context,"rgb(0,0,0)",2,coo1[0],coo1[1],coo2[0],coo2[1]);
      }
    }

    // NOTE: rulingツール2のrulingを描画する
    context.strokeStyle = "rgb(50, 200, 255)";
    globals.ruling.drawRulingVertexUse(ru2array,context,outputList);

    // NOTE: Gridツール
    if (gridTool.points.length > 0) {
      context.fillStyle = lineColors[0];
      for (let i = 0; i < gridTool.points.length; i++) {
        const stl1 = gridTool.points[i];
        context.fillRect(stl1[0]-3, stl1[1]-3, 7, 7);
      }
      if (gridTool.points.length%4 == 0) {
        globals.grids.drawGridWithAngle(gridnumber, gridLineList, context, lineColors[3], gridTool.points, rotationGridAngle);
        // ここで、格子によって生成される格子同士＆輪郭との交点をanchorPoint.listに格納する
        // rotationGridAngleは考慮しない
        
        // pointsの4点から、P0~P3を決定する：最小のxかつyを持つ点がP0(x0, y0)、最大のxかつyを持つ点がP3(x3, y3)、P1とP2はP1(x3, y0)、P2(x0, y3)と決まる
        let xMin = 10000;
        let yMin = 10000;
        let xMax = 0;
        let yMax = 0;
        for (let i = 0; i < gridTool.points.length; i++) {
          const tmpPoint = gridTool.points[i];
          if (xMin >= tmpPoint[0]) { xMin = tmpPoint[0]; } 
          else { xMax = tmpPoint[0]; }

          if (yMin >= tmpPoint[1]) { yMin = tmpPoint[1]; } 
          else { yMax = tmpPoint[1]; }
        }

        let P0 = [xMin, yMin];
        let P1 = [xMax, yMin];
        // let P2 = [xMax, yMax];
        let P3 = [xMin, yMax];
        let n = gridnumber;
        let dx = dist(P0[0], P0[1], P1[0], P1[1]) / n;
        let dy = dist(P0[0], P0[1], P3[0], P3[1]) / n;
        for (let i = 1; i < n; i++) {
          for (let j = 1; j < n; j++) {
            // ここに、近い点を弾く処理を入れるか
            let x = P0[0] + dx * i;
            let y = P0[1] + dy * j;
            // let distToClosestPoint = distClosestPointOnDevelopment(x, y, globals.svgInformation);
            let distToClosestPoint = minimumDistPointToFoldsOnDevelopment(x, y, globals.svgInformation);
            if (distToClosestPoint >= dx / 2.0) { anchorPoints.points.push([x, y]); }
          }
        }

        // 格子の線の端点もanchorPoints.pointsに格納していく
        for (let i = 0; i < gridLineList.length; i++) {
          const tmpLine = gridLineList[i];
          // ここにも近い点を弾く処理を入れる
          // let distToClosestPoint1 = distClosestPointOnDevelopment(tmpLine[0][0], tmpLine[0][1], globals.svgInformation);
          let distToClosestPoint1 = minimumDistPointToFoldsOnDevelopment(tmpLine[0][0], tmpLine[0][1], globals.svgInformation);
          if (distToClosestPoint1 >= dx / 2.0) { anchorPoints.points.push([tmpLine[0][0], tmpLine[0][1]]); }
          // let distToClosestPoint2 = distClosestPointOnDevelopment(tmpLine[1][0], tmpLine[1][1], globals.svgInformation);
          let distToClosestPoint2 = minimumDistPointToFoldsOnDevelopment(tmpLine[1][0], tmpLine[1][1], globals.svgInformation);
          if (distToClosestPoint2 >= dx / 2.0) { anchorPoints.points.push([tmpLine[1][0], tmpLine[1][1]]); }
        }
      }
    }

    //正三角形
    if (regularTrianglationTool.points.length > 0) {
      context.fillStyle = lineColors[0];
      for (let i = 0; i < regularTrianglationTool.points.length; i++) {
        if (i < 4) {
          let stl1 = regularTrianglationTool.points[i];
          context.fillRect(stl1[0]-3, stl1[1]-3, 7, 7);
        }
      }
      //分割しないやつ
      //if (regularTrianglationTool.points.length%4 == 0) { globals.grids.regularTrianglation(regularTrianglationTool.points, triangleEdgeDenominator, context, gridLineList, lineColors[3]); }
      
      //分割ありのやつ
      // if (regularTrianglationTool.points.length >= 4) {
      //   globals.grids.makeParentHexagon(regularTrianglationTool);

      //   //自動分割する
      //   if (autoMeshFlag) {
      //     globals.grids.autoMeshRegularTriangle(regularTrianglationTool.structure.child0, Hmin, Hmax, globals.svgInformation);
      //     globals.grids.autoMeshRegularTriangle(regularTrianglationTool.structure.child1, Hmin, Hmax, globals.svgInformation);
      //     globals.grids.autoMeshRegularTriangle(regularTrianglationTool.structure.child2, Hmin, Hmax, globals.svgInformation);
      //     globals.grids.autoMeshRegularTriangle(regularTrianglationTool.structure.child3, Hmin, Hmax, globals.svgInformation);
      //     globals.grids.autoMeshRegularTriangle(regularTrianglationTool.structure.child4, Hmin, Hmax, globals.svgInformation);
      //     globals.grids.autoMeshRegularTriangle(regularTrianglationTool.structure.child5, Hmin, Hmax, globals.svgInformation);
      //   }

      //   globals.grids.drawParentHexagon(regularTrianglationTool.points, regularTrianglationTool.structure, context, gridLineList, lineColors[3]);
      // }

      if (!autoMeshFlag) {
        //分割しないやつ
        if (regularTrianglationTool.points.length%4 == 0) {
          globals.grids.regularTrianglation(regularTrianglationTool.points, triangleEdgeDenominator, context, gridLineList, lineColors[3]);
        }
      } else {
        //分割ありのやつ
        if (regularTrianglationTool.points.length >= 4) {
          globals.grids.makeParentHexagon(regularTrianglationTool);

          //自動分割する
          if (autoMeshFlag) {
            globals.grids.autoMeshRegularTriangle(regularTrianglationTool.structure.child0, Hmin, Hmax, globals.svgInformation);
            globals.grids.autoMeshRegularTriangle(regularTrianglationTool.structure.child1, Hmin, Hmax, globals.svgInformation);
            globals.grids.autoMeshRegularTriangle(regularTrianglationTool.structure.child2, Hmin, Hmax, globals.svgInformation);
            globals.grids.autoMeshRegularTriangle(regularTrianglationTool.structure.child3, Hmin, Hmax, globals.svgInformation);
            globals.grids.autoMeshRegularTriangle(regularTrianglationTool.structure.child4, Hmin, Hmax, globals.svgInformation);
            globals.grids.autoMeshRegularTriangle(regularTrianglationTool.structure.child5, Hmin, Hmax, globals.svgInformation);
          }

          globals.grids.drawParentHexagon(regularTrianglationTool.points, regularTrianglationTool.structure, context, gridLineList, lineColors[3]);
        }
      }
    }

    // NOTE: 四分木の方のgrid!
    for (let i = 0; i < q_tree.points.length; i++) {
      if (i < 4) {
        const point = q_tree.points[i];
        context.fillStyle = lineColors[0];
        context.fillRect(point[0]-3, point[1]-3, 7, 7);
      }
    }
    if (q_tree.points.length >= 4) {
      globals.grids.makeQTree(q_tree);
      if (autoMeshFlag) { globals.grids.autoMesh(q_tree.structure, Hmin, Hmax, globals.svgInformation); }
      globals.grids.drawQTree(q_tree.structure, context, gridLineList, lineColors[3]);
    }

    // NOTE: アンカーポイントの描画（polyFile用のやつ）
    for (let i = 0; i < anchorPoints.points.length; i++) {
      const point = anchorPoints.points[i];
      context.fillStyle = lineColors[1];
      context.fillRect(point[0]-3, point[1]-3, 7, 7);
    }

    // NOTE: 以下、折り線端点問題のプログラム
    context.fillStyle = lineColors[1];
    for (let index = 0; index < terminalInputButton.points.length; index++) {
      const stl1 = terminalInputButton.points[index];
      const stl2 = terminalInputButton.points[index+1];
      context.fillRect(stl1[0]-3, stl1[1]-3, 5, 5);
      if (stl2 !== undefined) {
        context.fillRect(stl2[0]-3, stl2[1]-3, 5, 5);
        drawLine(context, lineColors[4], 2, stl1[0], stl1[1], stl2[0], stl2[1]);
      }
    }
    for (let index = 0; index < terminalInputButton.inputLineList.length; index++) {
      const element = terminalInputButton.inputLineList[index];
      for (let j = 0; j < element.length - 1; j++) {
        const stl1 = element[j];
        const stl2 = element[j+1];
        context.fillRect(stl1[0]-3, stl1[1]-3, 5, 5);
        if (stl2 !== undefined) {
          context.fillRect(stl2[0]-3, stl2[1]-3, 5, 5);
          drawLine(context, lineColors[6], 2, stl1[0], stl1[1], stl2[0], stl2[1]);
        }
      }
    }


    // NOTE: 折り線と格子の交点を明示する
    let intersectPointList = [];

    for (let index = 0; index < terminalInputButton.inputLineList.length; index++) {
      let newFoldingLineList = [];
      let tmpList = [];
      const element = terminalInputButton.inputLineList[index];
      const start = element[0];
      const end = element[element.length - 1];
      for (let j = 0; j < element.length - 1; j++) {
        const stl1 = element[j];
        const stl2 = element[j+1];
        if (stl2 !== undefined) {
          for (let k = 0; k < gridLineList.length; k++) {
            // gridLineList = ([[x0,y0],[x1,y1],color],,,[[xn-1,yn-1],[xn,yn],color])
            const stl3 = gridLineList[k][0];
            const stl4 = gridLineList[k][1];

            // 交点検出＆追加
            if (globals.beziercurve.judgeIntersect2(stl1[0], stl1[1], stl2[0], stl2[1], stl3[0], stl3[1], stl4[0], stl4[1])) {
              tmpList.push(globals.beziercurve.getIntersectPoint(stl1[0], stl1[1], stl3[0], stl3[1], stl2[0], stl2[1], stl4[0], stl4[1]));
            }

          }
        }
      }

      // NOTE: ここで、折り線の生成を行ってみる
      let tmpListCopy = tmpList;
      let startPoint = start;
      let endPoint = end;

      // 新たに生成する折り線情報を持つリスト
      newFoldingLineList = [startPoint];

      // NOTE: startを、tmpListCopy内の近い点から純に結んでいき、endで終わる
      while (tmpListCopy.length > 0) {
        let provisionalDist = 10000;
        let index = 0;
        // NOTE: 次のループの中でstartPointと結ぶ点を決める
        for (let i = 0; i < tmpListCopy.length; i++) {
          let tmpPoint = tmpListCopy[i];
          let tmpDist = dist(startPoint[0], startPoint[1], tmpPoint[0], tmpPoint[1]);
          if (tmpDist <= provisionalDist) {
            index = i;
            provisionalDist = tmpDist;
          }
        }
        // 確定した点を格納
        newFoldingLineList.push(tmpListCopy[index]);
        // 開始点の更新
        startPoint = tmpListCopy[index];
        // 格納した点をtmpListCopyから削除
        tmpListCopy.splice(index, 1);
        console.log(tmpListCopy);
      }
      // 終点を格納＆完成
      newFoldingLineList.push(endPoint);
      // NOTE: 折り線端点モンダイを解決した折り線情報を格納
      newFoldingLineObject.colors.push(terminalInputButton.inputLineColors[index]);
      newFoldingLineObject.lines.push(newFoldingLineList);

      intersectPointList.push(tmpList);
    }

    context.fillStyle = lineColors[4];
    for (let i = 0; i < intersectPointList.length; i++) {
      let tmpList = intersectPointList[i];
      for (let j = 0; j < tmpList.length; j++) {
        let tmp = tmpList[j];
        context.fillRect(tmp[0]-3, tmp[1]-3, 5, 5);
      }
    }

    // 試しにnewfoldinglineを描画してみるか
    for (let i = 0; i < newFoldingLineObject.colors.length; i++) {
      const color = newFoldingLineObject.colors[i];
      const lines = newFoldingLineObject.lines[i];
      for (let j = 0; j < lines.length - 1; j++) {
        const p0 = lines[j];
        const p1 = lines[j+1];
        if (p0 !== undefined && p1 !== undefined) {
          drawLine(context, color, 5, p0[0], p0[1], p1[0], p1[1]);
        }
      }
    }

    // ここで試しに法線求めてみる
    // let faces = globals.model.getFaces();
    // let positions = globals.model.getPositionsArray();
    // let verticesArray = [];
    // let surfNorm = [];
    // for (let i = 0; i < positions.length; i++) {
    //   const vector = new THREE.Vector3(positions[3*i], positions[3*i+1], positions[3*i+2]);
    //   verticesArray.push(vector);
    // }
    // for (let i = 0; i < faces.length; i++) {
    //   let vector0 = verticesArray[faces[i][0]];
    //   let vector1 = verticesArray[faces[i][1]];
    //   let vector2 = verticesArray[faces[i][2]];
    //   let vec1 = vector1.sub(vector0);
    //   let vec2 = vector2.sub(vector1);
    //   let n = vec1.cross(vec2);
    //   n.normalize();
    //   surfNorm.push(n);
    // }

  }
  //=====================================================
  //=====================================================
  //=====================================================




  //canvas内のクリック判定
  canvas.addEventListener("click", e => {
    //クリックした点が展開図情報内の点のいずれかに近い場合、
    //重ねて配置したいと判定する
    var ret = globals.beziercurve.returnNearCoordinates(globals.svgInformation,e.offsetX,e.offsetY);
    var tmpDist = dist(e.offsetX,e.offsetY,ret[0],ret[1]);

    if(straight === true) { //直線ツールがON!!
      if(tmpDist < 10){ //distが10未満なら頂点に入力点を重ねる
        straightLineList.push([ret[0], ret[1]]);
      }else { //10以上ならクリックしたところに素直に入力(この時canvasのoffset距離であることに注意)
        straightLineList.push([e.offsetX, e.offsetY]);
      }
    } else if(ruling1 === true) { //ベジェ曲線ツールがON!!
      //特に処理はない
    } else if(ruling2 === true) {
      var closest = globals.beziercurve.returnNearCoordinates(globals.svgInformation,e.offsetX,e.offsetY);
      ru2array.push(closest);
    } else if(gridTool.flag === true) { //GridTool!!
      if(tmpDist < 10){ //distが10未満なら頂点に入力点を重ねる
        gridTool.points.push([ret[0], ret[1]]);
      }else { //10以上ならクリックしたところに素直に入力(この時canvasのoffset距離であることに注意)
        gridTool.points.push([e.offsetX, e.offsetY]);
      }
    } else if(regularTrianglationTool.flag === true) { //正三角形ツール
      if(tmpDist < 10){ //distが10未満なら頂点に入力点を重ねる
        regularTrianglationTool.points.push([ret[0], ret[1]]);
      }else { //10以上ならクリックしたところに素直に入力(この時canvasのoffset距離であることに注意)
        regularTrianglationTool.points.push([e.offsetX, e.offsetY]);
      }
    } else if(qtreeFlag === true) {
      if(tmpDist < 10){ //distが10未満なら頂点に入力点を重ねる
        q_tree.points.push([ret[0], ret[1]]);
      }else { //10以上ならクリックしたところに素直に入力(この時canvasのoffset距離であることに注意)
        q_tree.points.push([e.offsetX, e.offsetY]);
      }
    } else if(anchorPoints.flag) {
      anchorPoints.points.push([e.offsetX, e.offsetY]);
    } else if (terminalInputButton.flag) {
      if (tmpDist < 10){ //distが10未満なら頂点に入力点を重ねる
        terminalInputButton.points.push([ret[0], ret[1]]);
      } else { //10以上ならクリックしたところに素直に入力(この時canvasのoffset距離であることに注意)
        terminalInputButton.points.push([e.offsetX, e.offsetY]);
      }
    } else {
     canvasReload(); //canvasのリロード
     readerFile.readAsText(globals.svgFile); //svgファイルをテキストで取得
    }
    canvasReload(); //canvasのリロード
    drawCanvas();
    globals.threeView.startSimulation(); //シミュレーションをON
  });

  canvas.addEventListener("mousedown", e => {
    if(ruling1 == true) { //rulingツール1がon
      dragging = true;
      /*
      //以下、移動する制御点(ベジェ曲線の)を求める
      if(beziList.length > 0){
        var distance = 10000;
        var tmp = 10000;
        var ind = 10000;
        for(var i = 0; i < beziList.length; i++){
          var coo = beziList[i];
          tmp = dist(coo[0],coo[1],e.offsetX,e.offsetY);
          if(tmp < distance){
            distance = tmp;
            ind = i;
          }
        }
        if(distance < 10.0){
          movedIndex = ind;
          cpMove = true;
        }
      }
      */
      //移動する制御点(スプライン曲線の)を求める
      if (splineList.length > 0) {
        var distance = 10000;
        var tmp = 10000;
        var ind = 10000;
        for (var i = 0; i < splineList.length; i++){
          var coo = splineList[i];
          tmp = dist(coo[0], coo[1], e.offsetX, e.offsetY);
          if (tmp < distance){
            distance = tmp;
            ind = i;
          }
        }
        if (distance < 10.0) {
          movedIndex2 = ind;
          cpMove2 = true;
        }
      }
    }
  });

  canvas.addEventListener("mousemove", e => {
    if(dragging == true) {
      /*if(cpMove == true){
        //これはベジェ
        beziList.splice(movedIndex,1,[e.offsetX,e.offsetY]);
        canvasReload();
        drawCanvas();
      }else */if(cpMove2 == true) {
        //これはスプライン
        splineList.splice(movedIndex2,1,[e.offsetX,e.offsetY]);
        canvasReload();
        drawCanvas();
      }else{
      dragList.push([e.offsetX, e.offsetY]);
      }
    }
  });

  canvas.addEventListener("mouseup", e => {
    if (dragging == true) {
      /*if(cpMove == true) {
        //これはベジェ
        beziList.splice(movedIndex,1,[e.offsetX,e.offsetY]);
        cpMove = false;
        dragging = false;
      }else */if (cpMove2 == true) {
        //これはスプライン
        splineList.splice(movedIndex2,1,[e.offsetX,e.offsetY]);
        cpMove2 = false;
        dragging = false;
      } else {
        dragging = false;
        /*
        //ここでベジェ曲線の制御点を求める処理を
        globals.beziercurve.defineBeziPoint(dragList, beziList);
        */
        //ここでスプライン曲線の制御点を求める処理
        globals.beziercurve.defineSplinePoint(dragList, splineList);
        //tmpCooListの初期化
        dragList = [];
      }
      canvasReload();
      drawCanvas();
    }
  });

  //直線ボタンが押された時の処理
  straightLineButton.addEventListener("click", function(){
    if(straight === true) {
      //console.log("straight line mode ended...");
      straight = false;
      straightLineButton.style.backgroundColor = buttonColor;
    } else {
      //console.log("straight line mode started...");
      straight = true;
      straightLineButton.style.backgroundColor = '#aaaaaa';
      //ほかのボタン
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
      gridTool.flag = false;
      gridButton.style.backgroundColor = buttonColor;
      regularTrianglationTool.flag = false;
      regularTriangleButton.style.backgroundColor = buttonColor;
      qtreeFlag = false;
      qtreeButton.style.backgroundColor = buttonColor;
      terminalInputButton.flag = false;
      terminalInputButton.style.backgroundColor = buttonColor;
    }
  });

  //rulingツール1ボタンが押された時の処理
  ruling1Button.addEventListener("click", function(){
    if(ruling1 === true) {
      //console.log("ruling mode1 ended...");
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
    } else {
      //console.log("ruling mode1 started...");
      ruling1 = true;
      ruling1Button.style.backgroundColor = '#aaaaaa';
      //ほかのボタン
      straight = false;
      straightLineButton.style.backgroundColor = buttonColor;
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
      gridTool.flag = false;
      gridButton.style.backgroundColor = buttonColor;
      regularTrianglationTool.flag = false;
      regularTriangleButton.style.backgroundColor = buttonColor;
      qtreeFlag = false;
      qtreeButton.style.backgroundColor = buttonColor;
      terminalInputButton.flag = false;
      terminalInputButton.style.backgroundColor = buttonColor;
    }
  });

  //rulingツール2ボタンが押された時の処理
  ruling2Button.addEventListener("click", function(){
    if(ruling2 === true) {
      //console.log("ruling mode2 ended...");
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
    } else {
      //console.log("ruling mode2 started...");
      ruling2 = true;
      ruling2Button.style.backgroundColor = '#aaaaaa';
      //ほかのボタン
      straight = false;
      straightLineButton.style.backgroundColor = buttonColor;
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
      gridTool.flag = false;
      gridButton.style.backgroundColor = buttonColor;
      regularTrianglationTool.flag = false;
      regularTriangleButton.style.backgroundColor = buttonColor;
      qtreeFlag = false;
      qtreeButton.style.backgroundColor = buttonColor;
      terminalInputButton.flag = false;
      terminalInputButton.style.backgroundColor = buttonColor;
    }
  });

  //grid linesボタンが押された時の処理
  gridButton.addEventListener("click", function() {
    if(gridTool.flag === true) {
      //console.log("grid line mode ended...");
      gridTool.flag = false;
      gridButton.style.backgroundColor = buttonColor;
    } else {
      //console.log("grid line mode started...");
      gridTool.flag = true;
      gridButton.style.backgroundColor = '#aaaaaa';
      //ほかのボタン
      straight = false;
      straightLineButton.style.backgroundColor = buttonColor;
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
      regularTrianglationTool.flag = false;
      regularTriangleButton.style.backgroundColor = buttonColor;
      qtreeFlag = false;
      qtreeButton.style.backgroundColor = buttonColor;
      terminalInputButton.flag = false;
      terminalInputButton.style.backgroundColor = buttonColor;
    }
  });

  //正三角形グリッドボタン
  regularTriangleButton.addEventListener("click", function() {
    if(regularTrianglationTool.flag === true) {
      regularTrianglationTool.flag = false;
      regularTriangleButton.style.backgroundColor = buttonColor;
    } else {
      regularTrianglationTool.flag = true;
      regularTriangleButton.style.backgroundColor = '#aaaaaa';
      //ほかのボタン
      straight = false;
      straightLineButton.style.backgroundColor = buttonColor;
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
      gridTool.flag = false;
      gridButton.style.backgroundColor = buttonColor;
      qtreeFlag = false;
      qtreeButton.style.backgroundColor = buttonColor;
      terminalInputButton.flag = false;
      terminalInputButton.style.backgroundColor = buttonColor;
    }
  });

  //qtreeButtonが押されたときの処理
  qtreeButton.addEventListener("click", function() {
    if(qtreeFlag === true) {
      //console.log("qtree mode ended...");
      qtreeFlag = false;
      qtreeButton.style.backgroundColor = buttonColor;
    } else {
      //console.log("qtree mode started...");
      qtreeFlag= true;
      qtreeButton.style.backgroundColor = '#aaaaaa';
      //ほかのボタン
      straight = false;
      straightLineButton.style.backgroundColor = buttonColor;
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
      gridTool.flag = false;
      gridButton.style.backgroundColor = buttonColor;
      regularTrianglationTool.flag = false;
      regularTriangleButton.style.backgroundColor = buttonColor;
      terminalInputButton.flag = false;
      terminalInputButton.style.backgroundColor = buttonColor;
    }
  });

  terminalInputButton.addEventListener("click", function() {
    if(terminalInputButton.flag === true) {
      terminalInputButton.flag = false;
      terminalInputButton.style.backgroundColor = buttonColor;
    } else {
      terminalInputButton.flag = true;
      terminalInputButton.style.backgroundColor = '#aaaaaa';
      //ほかのボタン
      straight = false;
      straightLineButton.style.backgroundColor = buttonColor;
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
      gridTool.flag = false;
      gridButton.style.backgroundColor = buttonColor;
      regularTrianglationTool.flag = false;
      regularTriangleButton.style.backgroundColor = buttonColor;
      qtreeFlag = false;
      qtreeButton.style.backgroundColor = buttonColor;
    }
  });

  document.getElementById("dl-terminal-development").addEventListener("click", function() {
    var outputSVG = new FileReader();
    makeTerminalProblemFixedDevelopment(outputSVG, globals.svgInformation, gridLineList, newFoldingLineObject);
    downloadFile('terminalProblemFixed.svg', outputSVG.text);
  });

  window.addEventListener("keypress", function(e) {
    if (e.keyCode === 13) {
      // console.log("Enter pressed!");
      if (terminalInputButton.flag === true) {
        let tmpList = terminalInputButton.points;
        terminalInputButton.points = [];
        terminalInputButton.inputLineList.push(tmpList);
        terminalInputButton.inputLineColors.push(terminalInputColor.style.backgroundColor);
        console.log(terminalInputButton);
      }
      canvasReload();
      drawCanvas();
    }
  });

  //デリートボタンが押された時の処理
  document.getElementById("delete-button").addEventListener("click", function(){
    if (straight === true) {
      straightLineList.pop();
    } else if (ruling1 === true) {
      if(optimizedRuling.length > 0) {
        optimizedRuling = [];
      } else {
        /*
        //ベジェ曲線の制御点を4つ消す
        for(var i = 0; i < 4; i++){
          beziList.pop();
        }
        */
        //スプライン曲線の制御点を7つ消す
        for(var i = 0; i < 7; i++){
          splineList.pop();
        }

      }
    }else if (ruling2 === true) {
      ru2array.pop();
    } else if (gridTool.flag === true) {
      gridTool.points.pop();
    } else if (regularTrianglationTool.flag === true) {
      regularTrianglationTool.points.pop();
    } else if (qtreeFlag === true){
      q_tree.points.pop();
    } else if (terminalInputButton.flag === true) {
      if (terminalInputButton.points.length > 0) {
        terminalInputButton.points.pop();
      } else {
        terminalInputButton.inputLineList.pop();
        terminalInputButton.inputLineColors.pop();
      }
    } else {
      // NOTE: ...
    }
    canvasReload();
    drawCanvas();
  });

  colorButton.addEventListener("click", function() {
    if (colorButton.innerText == "Mount Fold") {
      colorButton.innerText = "Ruling";
      colorButton.style.backgroundColor = lineColors[1];
    } else if (colorButton.innerText == "Ruling") {
      colorButton.innerText = "Valley Fold";
      colorButton.style.backgroundColor = lineColors[2];
    } else if (colorButton.innerText == "Valley Fold") {
      colorButton.innerText = "Undriven Crease";
      colorButton.style.backgroundColor = lineColors[3];
    } else if (colorButton.innerText == "Undriven Crease") {
      colorButton.innerText = "Cut Line";
      colorButton.style.backgroundColor = lineColors[4];
    } else if (colorButton.innerText == "Cut Line") {
      colorButton.innerText = "Mount Fold";
      colorButton.style.backgroundColor = lineColors[0];
    }
  });

  //ruling本数の増減
  upButton.addEventListener("click", function() {
    if (rulingNum < 1100) {
      rulingNum++;
      displayRulingNum.innerText = String(rulingNum);
      canvasReload();
      drawCanvas();
    }
  });
  downButton.addEventListener("click", function() {
    if (rulingNum > 0) {
      rulingNum--;
      displayRulingNum.innerText = String(rulingNum);
      canvasReload();
      drawCanvas();
    }
  });

  document.getElementById("optimize-button").addEventListener("click", function(){
    // NOTE: rulingの最適化動作を行う
    optimizedRuling = [];
    canvasReload();
    drawCanvas();
    globals.ruling.extendRulings(optimizedRuling,context,startEndInformation);
  });

  gridMode.addEventListener("click", function() {
    if (gridMode.mode == 0) {
      gridMode.innerText = "Grid Mode 2";
      gridMode.mode++;
    } else if (gridMode.mode == 1) {
      gridMode.innerText = "Grid Mode 3";
      gridMode.mode++;
    } else if (gridMode.mode == 2) {
      gridMode.innerText = "Grid Mode 4";
      gridMode.mode++;
    } else if (gridMode.mode == 3) {
      gridMode.innerText = "Grid Mode 5";
      gridMode.mode++;
    } else if (gridMode.mode == 4) {
      gridMode.innerText = "Grid Mode 6";
      gridMode.mode++;
    } else if (gridMode.mode == 5) {
      gridMode.innerText = "Grid Mode 7";
      gridMode.mode++;
    } else if (gridMode.mode == 6) {
      gridMode.innerText = "Grid Mode 8";
      gridMode.mode++;
    } else if (gridMode.mode == 7) {
      gridMode.innerText = "Grid Mode 9";
      gridMode.mode++;
    } else if (gridMode.mode == 8) {
      gridMode.innerText = "Grid Mode 1";
      gridMode.mode = 0;
    }
    canvasReload();
    drawCanvas();
  });

  //svg出力ボタンが押された時の処理
  document.getElementById("go-simulation").addEventListener("click", function() {
    drawCanvas();
    if (straightLineList.length > 0) {    //直線ツールの描画結果を追加する
      for (const stl of straightLineList) {
        outputList.push([stl[0], stl[1]]);
      }
    }
    if (optimizedRuling.length > 0) {     //optimized rulingを追加する
      for (const stl of optimizedRuling) {
        outputList.push([stl[0], stl[1]]);
      }
    }

    // NOTE: ここからシミュレーションが停止するまでの時間を計測する
    // simulateAgainのなかで、ダイアログのimportを押してから測った方がいい
    globals.importer.simulateAgain(globals.svgFile, outputList, gridLineList);
    globals.stepNum = 0;
    globals.threeView.startSimulation();

    //Simulate Modeへ遷移する
    globals.navMode = "simulation";
    $("#navSimulation").parent().addClass("open");
    $("#navDrawApp").parent().removeClass("open");
    $("#drawAppViewer").hide();

    canvasReload();
    drawCanvas();
  });

  //現在読み込んであるsvgをダウンロードする
  document.getElementById("dl-svg").addEventListener("click", function(){
    //素のsvg
    //downloadFile('fileNotFix.svg', readerFile.result);
    //修正込みのsvg
    var outputSVG = new FileReader();
    makeExtendedSVGFile(outputSVG, globals.svgInformation, outputList, optimizedRuling, gridLineList);
    downloadFile('developmentView.svg', outputSVG.text);
    // var outputPOLY = new FileReader();
    // convertOriginalSvgToPoly(outputPOLY, globals.svgInformation);
    // downloadFile('fromSVG.poly', outputPOLY.text);
  });

  document.getElementById("dl-poly").addEventListener("click", function() {
    var outputPOLY = new FileReader();
    convertOriginalSvgToPoly(outputPOLY, globals.svgInformation, anchorPoints.points);
    downloadFile('fromSVG.poly', outputPOLY.text);
  });

  // NOTE: Clear Allボタン押下時の処理
  document.getElementById("clear-button").addEventListener("click", function(){
    straightLineList = [];

    beziDistList = [];
    beziList = [];

    splineDistList = [];
    splineList = [];
    
    ru2array = [];
    
    dragList = [];
    
    outputList = [];

    optimizedRuling = [];

    gridTool.flag = false;
    gridTool.points = [];

    regularTrianglationTool.flag = false;
    regularTrianglationTool.points = [];

    qtreeFlag = false;
    q_tree.points = [];

    canvasReload();
    drawCanvas();
  });

  //ドローツール画面のリサイズ判定
  window.addEventListener("resize", function() {
    canvasReload();
    drawCanvas();
   });

  //canvasリロードメソッド
  //画面リサイズ時などに使う
  function canvasReload() {
    //canvas初期化
    $('#draw-area').attr('width', globals.svgimg.width);  //canvasリサイズ
    $('#draw-area').attr('height', globals.svgimg.height);
    //展開図情報の描画
    drawDevelopment(globals.svgInformation,context);
  }

  //展開図情報を描画するメソッド
  function drawDevelopment(info,ctx) {
    for(var i = 0; i < info.stroke.length; i++) {
      //drawLine(ctx,info.stroke[i],info.stroke_width[i],info.x1,info.y1,info.x2,info.y2);
      drawLine(ctx,"rgb("+String(hex2rgb(info.stroke[i]))+")", Number(info.stroke_width[i]), parseInt(info.x1[i]), parseInt(info.y1[i]), parseInt(info.x2[i]), parseInt(info.y2[i]));
      // 点
      ctx.fillStyle = "rgb(134, 74, 43)";
      ctx.fillRect(parseInt(info.x1[i])-3,parseInt(info.y1[i])-3,7,7);
      ctx.fillRect(parseInt(info.x2[i])-3,parseInt(info.y2[i])-3,7,7);
    }
  }

  //パス
  ///Users/naruchan/desktop/origamisimulator/assets
  //ダウンロードする関数
  function downloadFile(filename, data) {
    var a = document.createElement('a');
    a.style = "display: none";  
    //var blob = new Blob(data, {type: "application/octet-stream"});
    var blob = new Blob([data], {type: "text/plain"});
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);  
    }, 100);  
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);    
  }

  // 三角形分割の結果を取得し描画する
  function drawTrianglationResult(ctx, trianglatedInformation) {
    for (let index = 0; index < trianglatedInformation.length; index+=2) {
      const start = trianglatedInformation[index];
      const end = trianglatedInformation[index+1];
      drawLine(ctx, "rgb(255, 255, 0)", 0.5, start[0], start[1], end[0], end[1]);
    }
  }

  // 引数の点と、展開図情報内で最も近い点との距離を算出する
  function distClosestPointOnDevelopment(x, y, svg) {
    let x1 = svg.x1;
    let y1 = svg.y1;
    let x2 = svg.x2;
    let y2 = svg.y2;
    let min = 10000;
    for (let i = 0; i < x1.length; i++) {
      let tmp1 = dist(x, y, x1[i], y1[i]);
      let tmp2 = dist(x, y, x2[i], y2[i]);
      min = Math.min(min, tmp1, tmp2);
    }
    return min;
  }

  // 引数の点と、展開図情報内で最も近い点との距離を算出する
  function minimumDistPointToFoldsOnDevelopment(x, y, svg) {
    // svg内の折り線について処理する＝輪郭線の場合は計算しないこと！
    let color = svg.stroke;
    let x1 = svg.x1;
    let y1 = svg.y1;
    let x2 = svg.x2;
    let y2 = svg.y2;
    let min = 10000;
    for (let i = 0; i < x1.length; i++) {
      if (color[i] !== "#000") {
        let p0p1length = dist(x, y, x1[i], y1[i]);
        let p0p2length = dist(x, y, x2[i], y2[i]);
        let p0pxlength = distPointToPolyline(x, y, x1[i], y1[i], x2[i], y2[i]);
        min = Math.min(min, p0p1length, p0p2length, p0pxlength);
      }
    }
    return min;
  }

  // モデルの面法線を計算する
  function calculateSurfaceNorm() {
    let positions = globals.model.getPositionsArray();
    let faces = globals.model.getFaces();
    let verticesArray = [];
    let surfaceNorm = [];
    for (let i = 0; i < positions.length; i++) {
        const vector = new THREE.Vector3(positions[3*i], positions[3*i+1], positions[3*i+2]);
        verticesArray.push(vector);
    }
    for (let i = 0; i < faces.length; i++) {
        let vector0 = verticesArray[faces[i][0]];
        let vector1 = verticesArray[faces[i][1]];
        let vector2 = verticesArray[faces[i][2]];
        let vec1 = new THREE.Vector3(vector1.x - vector0.x, vector1.y - vector0.y, vector1.z - vector0.z);
        let vec2 = new THREE.Vector3(vector2.x - vector0.x, vector2.y - vector0.y, vector2.z - vector0.z);
        let n = new THREE.Vector3(vec1.y * vec2.z - vec1.z * vec2.y, vec1.z * vec2.x - vec1.x * vec2.z, vec1.x * vec2.y - vec1.y * vec2.x);
        n.normalize();
        surfaceNorm.push(n);
        // n.multiplyScalar(101);
    }
    globals.surfNorm = surfaceNorm;

    // kmeansのための記述↓
    // surfaceNormを三次元配列にする
    let surfaceNormList = [];
    surfaceNorm.forEach(n => {
      surfaceNormList.push([n.x, n.y, n.z]);
    });
    // console.log(surfaceNormList);
    globals.surfNormList = surfaceNormList;

    // 試しにkmeansやる
    let clusterNum = 2;
    let iterate_num = 1000;
    let res = KMeans(surfaceNormList, clusterNum, iterate_num);
    let clusteredNumber = res.node;
    let clusteredSurfNormList = [[], []];
    for (let i = 0; i < surfaceNormList.length; i++) {
      const surfaceNorm = surfaceNormList[i];
      const cn = clusteredNumber[i];
      if (cn === 0) {
        clusteredSurfNormList[0].push(surfaceNorm);
      } else if (cn === 1) {
        clusteredSurfNormList[1].push(surfaceNorm);
      }
    }
    globals.surfNormListClustered = clusteredSurfNormList;

    // // 必要に応じてコメントアウトをはずそう
    // let vectorListFileReader = new FileReader();
    // makeTextOfLists(vectorListFileReader, surfaceNorm);
    // // TODO: これがあるとファイルダウンロードはできるけどエラーる
    // downloadFile("vectorList.txt", vectorListFileReader.text);
  }


  // 2点を結んで直線を描画するメソッド
  function drawLine(ctx, color, width, x1, y1, x2, y2) {
    ctx.strokeStyle = color;     //線の色
    ctx.lineWidth = width;      //線の太さ
    ctx.beginPath();            //直線の開始
    ctx.moveTo(x1, y1);         //開始点座標
    ctx.lineTo(x2, y2);         //終了点座標
    ctx.closePath();            //直線の終了
    ctx.stroke();               //描画！
  }

  return {
    drawLine: drawLine,

    calculateSurfaceNorm: calculateSurfaceNorm,
  };
}