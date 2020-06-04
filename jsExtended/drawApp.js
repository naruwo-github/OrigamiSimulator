/*
* Created by narumi nogawa on 6/1/19.
*/
//ドローアプリの部分
//展開図の修正機能の追加を目的としている

function initDrawApp(globals) {
  //----------------------------------------------------------------------
  //========== キャンバスの宣言 ==========
  const canvas = document.querySelector('#draw-area'); //canvasを取得
  const context = canvas.getContext('2d'); //描画準備のためcontextを取得
  //canvasの大きさをwindowと同じにする
  $('#draw-area').attr('width', $(window).width());
  $('#draw-area').attr('height', $(window).height());
  context.font = "40px 'Century Gothic'";
  context.strokeText("Click here",$(window).width()/2-100,$(window).height()/2);
  //===================================

  var straightLineList = new Array(); //直線の座標を格納する
  var straight = false; //直線モードのフラグ
  var slineButton = document.getElementById("sline-button"); //直線ボタン

  var buttonColor = slineButton.style.backgroundColor; //ボタンの元の色

  var splineList = new Array(); //スプライン曲線の座標を格納する
  var splineDistList = new Array(); //スプライン曲線の長さを保存する

  var beziList = new Array(); //ベジェ曲線の座標を格納する
  var beziDistList = new Array(); //ベジェ曲線の長さを保存する
  var cpMove2 = false;
  var movedIndex2 = 10000;

  var rulingNum = 10; //rulingの本数
  var startEndInformation = new Array(); //rulingの始点と終点の情報を記憶する配列
  var ruling1 = false; //ruling1ツールのon/offを表すフラグ
  var ruling1Button = document.getElementById("ruling1-button");
  var dragging = false; //ドラッグ中のフラグ
  var dragList = new Array(); //ドラッグで取得した座標を格納する配列
  var cpMove = false; //ドラッグ操作が制御点を移動しているものかどうかのフラグ
  var movedIndex = 10000; //移動する制御点のindexを保持

  var ruling2 = false; //ruling2ツールのon/offを表すフラグ
  var ruling2Button = document.getElementById("ruling2-button");
  var ru2array = new Array(); //rulingツール2で使う配列


  //===== Grid Tool Information ======
  var gridTool = new Object();
  gridTool.flag = false;
  gridTool.points = new Array();

  //正三角形のタイリングツール
  var regularTrianglationTool = new Object();
  regularTrianglationTool.flag = false;
  regularTrianglationTool.points = [];
  regularTrianglationTool.structure = new Object();

  //正三角形ツール
  var regularTriangleButton = document.getElementById("rt-tool");


  //===暫定的に用いるやつ===
  var qtreeButton = document.getElementById("qtree-mode");
  var qtreeFlag = false;
  //q_tree.pointsが輪郭の点、q_tree.structureが四分木そのものを表す
  var q_tree = new Object();
  q_tree.points = new Array();
  q_tree.structure = new Object();
  //=====================


  var gridButton = document.getElementById("grid-button");
  //中身はこんな感じ↓ gridLineList = ([[x0,y0],[x1,y1],color],,,[[xn-1,yn-1],[xn,yn],color])
  var gridLineList = new Array();
  var gridnumber = 10;
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
  var outputSVG = new FileReader();

  //順に山、分割線(Ruling)、谷、分割線(ただの線)、切り取り線
  const lineColors = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", 
  "rgb(255, 0, 255)", "rgb(0, 255, 255)"];
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
  var testButton = document.getElementById("test-button");
  var testCount = parseInt(testButton.innerText);
  testButton.addEventListener("click", function() {
    testCount+=1;
    //console.log("testCount = " + testCount);
    testButton.innerText = String(testCount);
    canvasReload();
    drawCanvas();
  });

  //出力のリスト(構造は[[x0, y0],...,[xn, yn]])
  var outputList = new Array();
  //最適化されたrulingを保存するリスト
  var optimizedRuling = new Array();
  //----------------------------------------------------------------------


  //自動メッシュの設定あれこれ
  let Hmin = 3;
  let Hmax = 5;
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

  //正三角形メッシュの制御ボタン
  var RegularTriangleEdgeNum = document.getElementById("rt-num");
  var halfLengthTriangleEdge = parseInt(RegularTriangleEdgeNum.innerText);
  var rtenUp = document.getElementById("rt-up");
  var rtenDown = document.getElementById("rt-down");
  rtenUp.addEventListener("click", function() {
    if (halfLengthTriangleEdge < 500) {
      halfLengthTriangleEdge += 5;
      RegularTriangleEdgeNum.innerText = String(halfLengthTriangleEdge);
    }
  });
  rtenDown.addEventListener("click", function() {
    if (halfLengthTriangleEdge > 0) {
      halfLengthTriangleEdge -= 5;
      RegularTriangleEdgeNum.innerText = String(halfLengthTriangleEdge);
    }
  });




  //================= キャンバスの描画関数 ==================
  function drawCanvas() {
    //変数の初期化
    splineDistList = new Array();
    beziDistList = new Array();
    outputList = new Array();
    startEndInformation = new Array();
    gridLineList = new Array();
    
    //三角形分割の結果の描画
    drawTrianglationResult(context, globals.autoTriangulatedInfo);
    //展開図情報の出力
    //console.log(globals.svgInformation);

    //直線ツールの点
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


    //スプライン曲線を描画
    if(splineList.length > 0 && splineList.length % 7 == 0) {
      //splineツールの制御点
      for(var i = 0; i < splineList.length; i++) {
        var coo = splineList[i];
        context.fillStyle = lineColors[4];
        context.fillRect(coo[0]-3,coo[1]-3,7,7);
      }

      for(var i = 0; i < splineList.length; i+=7) {
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
        for(var t = 0; t < 1; t+=0.01) {
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

    //optimized rulingの描画
    if(optimizedRuling.length > 0) {
      for(var i = 0; i < optimizedRuling.length - 1; i+=2) {
        var coo1 = optimizedRuling[i];
        var coo2 = optimizedRuling[i+1];
        drawLine(context,"rgb(0,0,0)",2,coo1[0],coo1[1],coo2[0],coo2[1]);
      }
    }

    //rulingツール2のrulingを描画する
    context.strokeStyle = "rgb(50, 200, 255)";
    globals.ruling.drawRulingVertexUse(ru2array,context,outputList);

    //Gridツール
    //格子を描画する(デフォルトはマゼンタ？)
    //正方格子
    if (gridTool.points.length > 0) {
      context.fillStyle = lineColors[0];
      for (let i = 0; i < gridTool.points.length; i++) {
        const stl1 = gridTool.points[i];
        context.fillRect(stl1[0]-3, stl1[1]-3, 7, 7);
      }
      if(gridTool.points.length%4 == 0) { globals.grids.drawGridWithAngle(gridnumber, gridLineList, context, lineColors[3], gridTool.points, testCount); }
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
      //if(regularTrianglationTool.points.length%4 == 0) { globals.grids.regularTrianglation(regularTrianglationTool.points, halfLengthTriangleEdge, context, gridLineList, lineColors[3]); }
      
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

    //四分木の方のgrid!
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

  }
  //=====================================================




  //canvas内のクリック判定
  canvas.addEventListener("click", e => {
    if(straight === true) { //直線ツールがON!!
      //クリックした点が展開図情報内の点のいずれかに近い場合、
      //重ねて配置したいと判定する
      var ret = globals.beziercurve.returnNearCoordinates(globals.svgInformation,e.offsetX,e.offsetY)
      var tmpDist = dist(e.offsetX,e.offsetY,ret[0],ret[1])
      if(tmpDist < 10){ //distが10未満なら頂点に入力点を重ねる
        straightLineList.push([ret[0], ret[1]]);
      }else { //10以上ならクリックしたところに素直に入力(この時canvasのoffset距離であることに注意)
        straightLineList.push([e.offsetX, e.offsetY]);
      }
    } else if(ruling1 === true) { //ベジェ曲線ツールがON!!
    } else if(ruling2 === true) {
      var closest = globals.beziercurve.returnNearCoordinates(globals.svgInformation,e.offsetX,e.offsetY);
      ru2array.push(closest);
    } else if(gridTool.flag === true) { //GridTool!!
      //クリックした点が展開図情報内の点のいずれかに近い場合、
      //重ねて配置したいと判定する
      var ret = globals.beziercurve.returnNearCoordinates(globals.svgInformation,e.offsetX,e.offsetY)
      var tmpDist = dist(e.offsetX,e.offsetY,ret[0],ret[1])
      if(tmpDist < 10){ //distが10未満なら頂点に入力点を重ねる
        gridTool.points.push([ret[0], ret[1]]);
      }else { //10以上ならクリックしたところに素直に入力(この時canvasのoffset距離であることに注意)
        gridTool.points.push([e.offsetX, e.offsetY]);
      }
    } else if(regularTrianglationTool.flag === true) { //正三角形ツール
      //クリックした点が展開図情報内の点のいずれかに近い場合、
      //重ねて配置したいと判定する
      var ret = globals.beziercurve.returnNearCoordinates(globals.svgInformation,e.offsetX,e.offsetY)
      var tmpDist = dist(e.offsetX,e.offsetY,ret[0],ret[1])
      if(tmpDist < 10){ //distが10未満なら頂点に入力点を重ねる
        regularTrianglationTool.points.push([ret[0], ret[1]]);
      }else { //10以上ならクリックしたところに素直に入力(この時canvasのoffset距離であることに注意)
        regularTrianglationTool.points.push([e.offsetX, e.offsetY]);
      }
    } else if(qtreeFlag === true) {
      var ret = globals.beziercurve.returnNearCoordinates(globals.svgInformation,e.offsetX,e.offsetY)
      var tmpDist = dist(e.offsetX,e.offsetY,ret[0],ret[1])
      if(tmpDist < 10){ //distが10未満なら頂点に入力点を重ねる
        q_tree.points.push([ret[0], ret[1]]);
      }else { //10以上ならクリックしたところに素直に入力(この時canvasのoffset距離であることに注意)
        q_tree.points.push([e.offsetX, e.offsetY]);
      }
    } else {
     canvasReload(); //canvasのリロード
     readerFile.readAsText(globals.svgFile); //svgファイルをテキストで取得
    }
    canvasReload(); //canvasのリロード
    drawCanvas();
    globals.threeView.startSimulation(); //シミュレーションをON
  })

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
      if(splineList.length > 0) {
        var distance = 10000;
        var tmp = 10000;
        var ind = 10000;
        for(var i = 0; i < splineList.length; i++){
          var coo = splineList[i];
          tmp = dist(coo[0],coo[1],e.offsetX,e.offsetY);
          if(tmp < distance){
            distance = tmp;
            ind = i;
          }
        }
        if(distance < 10.0){
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
    if(dragging == true) {
      /*if(cpMove == true) {
        //これはベジェ
        beziList.splice(movedIndex,1,[e.offsetX,e.offsetY]);
        cpMove = false;
        dragging = false;
      }else */if(cpMove2 == true) {
        //これはスプライン
        splineList.splice(movedIndex2,1,[e.offsetX,e.offsetY])
        cpMove2 = false;
        dragging = false;
      }else{
        dragging = false;

        /*
        //ここでベジェ曲線の制御点を求める処理を
        globals.beziercurve.defineBeziPoint(dragList, beziList);
        */

        //ここでスプライン曲線の制御点を求める処理
        globals.beziercurve.defineSplinePoint(dragList, splineList);

        //tmpCooListの初期化
        dragList = new Array();
      }
      canvasReload();
      drawCanvas();
    }
  })

  //直線ボタンが押された時の処理
  slineButton.addEventListener("click", function(){
    if(straight === true) {
      //console.log("straight line mode ended...");
      straight = false;
      slineButton.style.backgroundColor = buttonColor;
    } else {
      //console.log("straight line mode started...");
      straight = true;
      slineButton.style.backgroundColor = '#aaaaaa';

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
      slineButton.style.backgroundColor = buttonColor;
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

  colorButton.addEventListener("click", function() {
    if(colorButton.innerText == "Mount Fold") {
      colorButton.innerText = "Ruling";
      colorButton.style.backgroundColor = lineColors[1];
    } else if(colorButton.innerText == "Ruling") {
      colorButton.innerText = "Valley Fold";
      colorButton.style.backgroundColor = lineColors[2];
    } else if(colorButton.innerText == "Valley Fold") {
      colorButton.innerText = "Undriven Crease";
      colorButton.style.backgroundColor = lineColors[3];
    } else if(colorButton.innerText == "Undriven Crease") {
      colorButton.innerText = "Cut Line";
      colorButton.style.backgroundColor = lineColors[4];
    } else if(colorButton.innerText == "Cut Line") {
      colorButton.innerText = "Mount Fold";
      colorButton.style.backgroundColor = lineColors[0];
    }
  });

  //ruling本数の増減
  upButton.addEventListener("click", function() {
    if(rulingNum < 1100) {
      rulingNum++;
      //rulingNum+=100;
      displayRulingNum.innerText = String(rulingNum);
      canvasReload();
      drawCanvas();
    }
  });
  downButton.addEventListener("click", function() {
    if(rulingNum > 0) {
      rulingNum--;
      displayRulingNum.innerText = String(rulingNum);
      canvasReload();
      drawCanvas();
    }
  });

  //optimize button
  document.getElementById("optimize-button").addEventListener("click", function(){
    //rulingの最適化動作を行う
    //console.log("ruling optimizing...");
    optimizedRuling = new Array();
    canvasReload();
    drawCanvas();

    globals.ruling.extendRulings(optimizedRuling,context,startEndInformation);
    //console.log("ruling optimizing ended.");
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
      slineButton.style.backgroundColor = buttonColor;
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
      gridTool.flag = false;
      gridButton.style.backgroundColor = buttonColor;
      regularTrianglationTool.flag = false;
      regularTriangleButton.style.backgroundColor = buttonColor;
      qtreeFlag = false;
      qtreeButton.style.backgroundColor = buttonColor;
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
      slineButton.style.backgroundColor = buttonColor;
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
      regularTrianglationTool.flag = false;
      regularTriangleButton.style.backgroundColor = buttonColor;
      qtreeFlag = false;
      qtreeButton.style.backgroundColor = buttonColor;
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
      slineButton.style.backgroundColor = buttonColor;
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
      gridTool.flag = false;
      gridButton.style.backgroundColor = buttonColor;
      qtreeFlag = false;
      qtreeButton.style.backgroundColor = buttonColor;
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
      slineButton.style.backgroundColor = buttonColor;
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
      gridTool.flag = false;
      gridButton.style.backgroundColor = buttonColor;
      regularTrianglationTool.flag = false;
      regularTriangleButton.style.backgroundColor = buttonColor;
    }
  })

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
    //直線ツールの描画結果を追加する
    for(var i = 0; i < straightLineList.length; i++) {
      var stl = straightLineList[i];
      outputList.push([stl[0], stl[1]]);
    }
    //optimized rulingを追加する
    for(var i = 0; i < optimizedRuling.length; i++) {
      var stl = optimizedRuling[i];
      outputList.push([stl[0],stl[1]]);
    }
    //修正した展開図をシミュレータへ投げる
    globals.importer.simulateAgain(globals.svgFile,outputList,gridLineList);
    globals.stepNum = 0;
    globals.threeView.startSimulation();

    //20描画にシミュレーションを停止する処理
    // setTimeout(function() {
    //   globals.threeView.pauseSimulation();
    // }, 1000*30);

    //Simulate Modeへ遷移する
    globals.navMode = "simulation";
    $("#navSimulation").parent().addClass("open");
    $("#navDrawApp").parent().removeClass("open");
    $("#drawAppViewer").hide();

    canvasReload();
    drawCanvas();
  });

  //デリートボタンが押された時の処理
  document.getElementById("delete-button").addEventListener("click", function(){
    if(straight === true) {
      straightLineList.pop();
    } else if(ruling1 === true) {
      if(optimizedRuling.length > 0) {
        optimizedRuling = new Array();
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
    }else if(ruling2 === true) {
      ru2array.pop();
    } else if(gridTool.flag === true) {
      gridTool.points.pop();
    } else if(regularTrianglationTool.flag === true) {
      regularTrianglationTool.points.pop();
    } else if(qtreeFlag === true){
      q_tree.points.pop();
    } else {
    }
    canvasReload();
    drawCanvas();
  });

  //現在読み込んであるsvgをダウンロードする
  document.getElementById("dl-svg").addEventListener("click", function(){
    //downloadFile('fileNotFix.svg', readerFile.result);

    //修正後のやつ
    makeExtendedSVGFile(outputSVG, globals.svgInformation, outputList, optimizedRuling, gridLineList);
    //downloadFile('developmentView.svg', outputSVG.result);
    downloadFile('developmentView.svg', outputSVG.text);
  });

  //clear all button
  document.getElementById("clear-button").addEventListener("click", function(){
    //初期化する
    straightLineList = new Array();

    beziDistList = new Array();
    beziList = new Array();

    splineDistList = new Array();
    splineList = new Array();
    
    ru2array = new Array();
    
    dragList = new Array();
    
    outputList = new Array();

    optimizedRuling = new Array();

    gridTool.flag = false;
    gridTool.points = new Array();

    regularTrianglationTool.flag = false;
    regularTrianglationTool.points = new Array();

    qtreeFlag = false;
    q_tree.points = new Array();

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
      //点
      //ctx.fillStyle = "rgb(50, 200, 255)";
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

  //hexをgbaに変換する関数
  function hex2rgb(hex) {
    if(hex.slice(0,1) == "#") {
      hex = hex.slice(1);
    }
    if(hex.length == 3) {
      hex = hex.slice(0,1) + hex.slice(0,1) + hex.slice(1,2) + hex.slice(1,2) + hex.slice(2,3) + hex.slice(2,3);
    }
    return [hex.slice(0,2), hex.slice(2,4), hex.slice(4,6)].map(function(str) {
      return parseInt(str,16);
    });
  }

  //2点間の距離を求める
  function dist(x1,y1,x2,y2){
    return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
  }

  //三角形分割の結果を取得し描画する
  function drawTrianglationResult(ctx, trianglatedInformation) {
    for (let index = 0; index < trianglatedInformation.length; index+=2) {
      const start = trianglatedInformation[index];
      const end = trianglatedInformation[index+1];
      drawLine(ctx, "rgb(255, 255, 0)", 0.5, start[0], start[1], end[0], end[1]);
    }
  }

  //修正した展開図の情報をsvgファイルに変換する処理
  function makeExtendedSVGFile(fileReader, original, output, optimized, gridline) {
    //出力svgファイルの宣言
    let text = `<?xml version="1.0" encoding="utf-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1000px" height="1000px" viewBox="0 0 1000.0 1000.0">
    <title>outputSVG</title>
    `;

    //ここから展開図情報を挿入していく
    //輪郭(黒)、山折り(赤)、谷折り(青)、分割線(黄色)、切り取り線(緑)、何もしない線(マゼンタ)に分けてからそれぞれまとめて追加する
    let black = new Array();
    let red = new Array();
    let blue = new Array();
    let yellow = new Array();
    let green = new Array();
    let magenta = new Array();

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
      }
    }

    //格納作業
    //黒
    if (black.length > 0) {
      text += `<g>`;
      for (let i = 0; i < black.length; i++) {
        text += `<line fill="none" stroke="#000" stroke-miterlimit="10" x1="${black[i][3]}" y1="${black[i][5]}" x2="${black[i][4]}" y2="${black[i][6]}"/>`;
      }
      text += `</g>`;
    }
    //赤
    if (red.length > 0) {
      text += `<g>`;
      for (let i = 0; i < red.length; i++) {
        text += `<line fill="none" stroke="#f00" stroke-miterlimit="10" x1="${red[i][3]}" y1="${red[i][5]}" x2="${red[i][4]}" y2="${red[i][6]}"/>`;
      }
      text += `</g>`;
    }
    //青
    if (blue.length > 0) {
      text += `<g>`;
      for (let i = 0; i < blue.length; i++) {
        text += `<line fill="none" stroke="#00f" stroke-miterlimit="10" x1="${blue[i][3]}" y1="${blue[i][5]}" x2="${blue[i][4]}" y2="${blue[i][6]}"/>`;
      }
      text += `</g>`;
    }
    //黄
    if (yellow.length > 0) {
      text += `<g>`;
      for (let i = 0; i < yellow.length; i++) {
        text += `<line fill="none" stroke="#ff0" stroke-miterlimit="10" x1="${yellow[i][3]}" y1="${yellow[i][5]}" x2="${yellow[i][4]}" y2="${yellow[i][6]}"/>`;
      }
      text += `</g>`;
    }
    //緑
    if (green.length > 0) {
      text += `<g>`;
      for (let i = 0; i < green.length; i++) {
        text += `<line fill="none" stroke="#0f0" stroke-miterlimit="10" x1="${green[i][3]}" y1="${green[i][5]}" x2="${green[i][4]}" y2="${green[i][6]}"/>`;
      }
      text += `</g>`;
    }
    //マゼンタ
    if (magenta.length > 0) {
      text += `<g>`;
      for (let i = 0; i < magenta.length; i++) {
        text += `<line fill="none" stroke="#f0f" stroke-miterlimit="10" x1="${magenta[i][3]}" y1="${magenta[i][5]}" x2="${magenta[i][4]}" y2="${magenta[i][6]}"/>`;
      }
      text += `</g>`;
    }

    text += `</svg>`;
    fileReader.text = text;

    /*
    //黒
    text += `
    <g>
    <polyline fill="none" stroke="#000" stroke-miterlimit="10" points="
    `;
    for (let i = 0; i < black.length; i++) {
      text += `${black[i][3]} ${black[i][5]} ${black[i][4]} ${black[i][6]} `;
    }
    text += `"/>
    </g>`;
    //赤
    text += `
    <g>
    <polyline fill="none" stroke="#f00" stroke-miterlimit="10" points="
    `;
    for (let i = 0; i < red.length; i++) {
      text += `${red[i][3]} ${red[i][5]} ${red[i][4]} ${red[i][6]} `;
    }
    text += `"/>
    </g>`;
    //青
    text += `
    <g>
    <polyline fill="none" stroke="#00f" stroke-miterlimit="10" points="
    `;
    for (let i = 0; i < blue.length; i++) {
      text += `${blue[i][3]} ${blue[i][5]} ${blue[i][4]} ${blue[i][6]} `;
    }
    text += `"/>
    </g>`;
    //黄
    text += `
    <g>
    <polyline fill="none" stroke="#ff0" stroke-miterlimit="10" points="
    `;
    for (let i = 0; i < yellow.length; i++) {
      text += `${yellow[i][3]} ${yellow[i][5]} ${yellow[i][4]} ${yellow[i][6]} `;
    }
    text += `"/>
    </g>`;
    //緑
    text += `
    <g>
    <polyline fill="none" stroke="#0f0" stroke-miterlimit="10" points="
    `;
    for (let i = 0; i < green.length; i++) {
      text += `${green[i][3]} ${green[i][5]} ${green[i][4]} ${green[i][6]} `;
    }
    text += `"/>
    </g>`;
    //マゼンタ
    text += `
    <g>
    <polyline fill="none" stroke="#f0f" stroke-miterlimit="10" points="
    `;
    for (let i = 0; i < magenta.length; i++) {
      text += `${magenta[i][3]} ${magenta[i][5]} ${magenta[i][4]} ${magenta[i][6]} `;
    }
    text += `"/>
    </g>`;
    text += `
    </svg>`;
    */
  }

  //ruling描画メソッドないで用いる2点を結んで直線を描画するメソッド
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
    dist: dist,
  }
}