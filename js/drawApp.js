/*
* Created by narumi nogawa on 6/1/19.
*/
//ドローアプリの部分
//展開図の修正機能の追加を目的としている

function initDrawApp(globals) {
  //----------------------------------------------------------------------
  //変数など各種定義

  const canvas = document.querySelector('#draw-area'); //canvasを取得
  const context = canvas.getContext('2d'); //描画準備のためcontextを取得

  //canvasの大きさをwindowと同じにする
  $('#draw-area').attr('width', $(window).width());
  $('#draw-area').attr('height', $(window).height());

  //context.font = "30px serif"; //canvasに表示させる文字のサイズ
  context.font = "40px 'Century Gothic'";
  context.strokeText("Click here",$(window).width()/2-100,$(window).height()/2);

  //座標[x,y]のリスト。例えば0番目の要素と1番目の要素の点を結ぶように扱う
  var straightLineList = new Array(); //直線の座標を格納する

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

  var straight = false; //直線モードのフラグ
  var slineButton = document.getElementById("sline-button"); //直線ボタン
  var buttonColor = slineButton.style.backgroundColor; //ボタンの元の色

  //グリッドツールを使っている時の情報
  var gridTool = new Object();
  gridTool.flag = false;
  gridTool.points = new Array();
  var gridButton = document.getElementById("grid-button");

  var readerFile = new FileReader(); //svgのdlに使う

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

  //出力のリスト
  var outputList = new Array();
  //最適化されたrulingを保存するリスト
  var optimizedRuling = new Array();
  //----------------------------------------------------------------------


  //キャンバスに描画する関数
  function drawCanvas(){

    //変数の初期化
    splineDistList = new Array();
    beziDistList = new Array();
    outputList = new Array();
    startEndInformation = new Array();
    
    //三角形分割の結果を取得し、描画する
    var trianglationInformation = globals.autoTriangulatedInfo;
    for (let index = 0; index < trianglationInformation.length; index+=2) {
      const start = trianglationInformation[index];
      const end = trianglationInformation[index+1];
      drawLine(context,"rgb(255, 255, 0)",2,start[0],start[1],end[0],end[1]);
    }

    context.fillStyle = lineColors[0];
    //直線ツールの点
    for(var i = 0; i < straightLineList.length; i+=2) {
      var stl1 = straightLineList[i];
      var stl2 = straightLineList[i+1];
      context.fillRect(stl1[0]-2,stl1[1]-2,5,5);
      context.fillRect(stl2[0]-2,stl2[1]-2,5,5);
      if(stl2[0] !== null){
        drawLine(context,lineColors[1],2,stl1[0],stl1[1],stl2[0],stl2[1]);
      }
    }

    /*
    //rulingツールの点(ベジェ曲線)
    context.fillStyle = lineColors[4];
    for(var i = 0; i < beziList.length; i++) {
      var coo = beziList[i];
      context.fillRect(coo[0]-3,coo[1]-3,7,7);
    }

    //ベジェ曲線を描画
    //beziDistList = new Array();
    if(beziList.length > 0 && beziList.length % 4 === 0) {
      for(var i = 0; i < beziList.length; i+=4){
        var cp1 = beziList[i];
        var cp2 = beziList[i+1];
        var cp3 = beziList[i+2];
        var cp4 = beziList[i+3];
        globals.beziercurve.drawBezier(context,beziDistList,cp1[0],cp1[1],cp2[0],cp2[1],cp3[0],cp3[1],cp4[0],cp4[1]);

        //ruling描画
        globals.ruling.findBezierRuling(rulingNum,startEndInformation,outputList,context,beziDistList[beziDistList.length-1],cp1[0],cp1[1],cp2[0],cp2[1],cp3[0],cp3[1],cp4[0],cp4[1]);
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
        for(var t = 0; t < 1; t+=0.01){
          var p1 = spline.calcAt(t);
          var p2 = spline.calcAt(t+0.01);
          context.beginPath();
          context.moveTo(p1[0], p1[1]);
          context.lineTo(p2[0], p2[1]);
          context.closePath();
          context.stroke();

          splineDist += globals.beziercurve.dist(p1[0], p1[1], p2[0], p2[1]);
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
  }


  //canvas内のクリック判定
  canvas.addEventListener("click", e => {
    if(straight === true) { //直線ツールがON!!
      //クリックした点が展開図情報内の点のいずれかに近い場合、
      //重ねて配置したいと判定する
      var ret = globals.beziercurve.returnNearCoordinates(globals.svgInformation,e.offsetX,e.offsetY)
      var tmpDist = globals.beziercurve.dist(e.offsetX,e.offsetY,ret[0],ret[1])
      if(tmpDist < 10){ //distが10未満なら頂点に入力点を重ねる
        straightLineList.push([ret[0], ret[1]]);
      }else { //10以上ならクリックしたところに素直に入力(この時canvasのoffset距離であることに注意)
        straightLineList.push([e.offsetX, e.offsetY]);
      }
    }else if(ruling1 === true) { //ベジェ曲線ツールがON!!
      //
    }else if(ruling2 === true) {
      var closest = globals.beziercurve.returnNearCoordinates(globals.svgInformation,e.offsetX,e.offsetY);
      ru2array.push(closest);
    }else {
     canvasReload(); //canvasのリロード

     readerFile.readAsText(globals.svgFile); //svgファイルをテキストで取得
     readerFile.onload = function(ev){
     }

    }
    drawCanvas();

    globals.simulationRunning = true; //シミュレーションをON
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
          tmp = globals.beziercurve.dist(coo[0],coo[1],e.offsetX,e.offsetY);
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
          tmp = globals.beziercurve.dist(coo[0],coo[1],e.offsetX,e.offsetY);
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
        //console.log(beziList.length);
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
  document.getElementById("sline-button").addEventListener("click", function(){
    if(straight === true) {
      console.log("straight line mode ended...");
      straight = false;
      slineButton.style.backgroundColor = buttonColor;
    } else {
      console.log("straight line mode started...");
      straight = true;
      slineButton.style.backgroundColor = '#aaaaaa';

      //ほかのボタン
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
      gridTool.flag = false;
      gridButton.style.backgroundColor = buttonColor;
    }
  });

  //rulingツール1ボタンが押された時の処理
  document.getElementById("ruling1-button").addEventListener("click", function(){
    if(ruling1 === true) {
      console.log("ruling mode1 ended...");
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
    } else {
      console.log("ruling mode1 started...");
      ruling1 = true;
      ruling1Button.style.backgroundColor = '#aaaaaa';

      //ほかのボタン
      straight = false;
      slineButton.style.backgroundColor = buttonColor;
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
      gridTool.flag = false;
      gridButton.style.backgroundColor = buttonColor;
    }
  });

  colorButton.addEventListener("click", function() {
    if(colorButton.innerText == "Mountain Fold Color") {
      colorButton.innerText = "Ruling Color";
      colorButton.style.backgroundColor = lineColors[1];
    } else if(colorButton.innerText == "Ruling Color") {
      colorButton.innerText = "Valley Fold Color";
      colorButton.style.backgroundColor = lineColors[2];
    } else if(colorButton.innerText == "Valley Fold Color") {
      colorButton.innerText = "Undriven Crease Color";
      colorButton.style.backgroundColor = lineColors[3];
    } else if(colorButton.innerText == "Undriven Crease Color") {
      colorButton.innerText = "Cut Line Color";
      colorButton.style.backgroundColor = lineColors[4];
    } else if(colorButton.innerText == "Cut Line Color") {
      colorButton.innerText = "Mountain Fold Color";
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
    console.log("ruling optimizing...");
    optimizedRuling = new Array();
    canvasReload();
    drawCanvas();

    globals.ruling.extendRulings(optimizedRuling,context,startEndInformation);
    console.log("ruling optimizing ended.");
  });

  //rulingツール2ボタンが押された時の処理
  document.getElementById("ruling2-button").addEventListener("click", function(){
    if(ruling2 === true) {
      console.log("ruling mode2 ended...");
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
    } else {
      console.log("ruling mode2 started...");
      ruling2 = true;
      ruling2Button.style.backgroundColor = '#aaaaaa';

      //ほかのボタン
      straight = false;
      slineButton.style.backgroundColor = buttonColor;
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
      gridTool.flag = false;
      gridButton.style.backgroundColor = buttonColor;
    }
  });

  //grid linesボタンが押された時の処理
  document.getElementById("grid-button").addEventListener("click", function() {
    if(gridTool.flag === true) {
      console.log("grid line mode ended...");
      gridTool.flag = false;
      gridButton.style.backgroundColor = buttonColor;
    } else {
      console.log("grid line mode started...");
      gridTool.flag = true;
      gridButton.style.backgroundColor = '#aaaaaa';

      //ほかのボタン
      straight = false;
      slineButton.style.backgroundColor = buttonColor;
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
    }
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
    globals.importer.simulateAgain(globals.svgFile,outputList);
    globals.simulationRunning = true; 

    //Simulate Modeへ遷移する
    globals.navMode = "simulation";
    $("#navSimulation").parent().addClass("open");
    $("#navDrawApp").parent().removeClass("open");
    $("#drawAppViewer").hide();
    drawCanvas();

    canvasReload();
  });

  //デリートボタンが押された時の処理
  document.getElementById("delete-button").addEventListener("click", function(){
    console.log("delete button pressed...");
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
    } else {
      //
    }
    canvasReload();
    drawCanvas();
  });

  //現在読み込んであるsvgをダウンロードする
  document.getElementById("dl-svg").addEventListener("click", function(){
    //ダウンロード、シンプルな
    downloadFile('sampleDL.svg',readerFile.result);
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
      drawLine(ctx,"rgb("+String(hex2rgb(info.stroke[i]))+")",Number(info.stroke_width[i]),parseInt(info.x1[i]),parseInt(info.y1[i]),parseInt(info.x2[i]),parseInt(info.y2[i]));
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

  /*
  document.addEventListener('keydown', (event) => {
    var keyName = event.key;

    if (event.ctrlKey) {
      console.log(`keydown:Ctrl + ${keyName}`);
    } else if (event.shiftKey) {
      console.log(`keydown:Shift + ${keyName}`);
    } else {
      console.log(`keydown:${keyName}`);
    }
  });

  document.addEventListener('keypress', (event) => {
    var keyName = event.key;

    if (event.ctrlKey) {
      console.log(`keypress:Ctrl + ${keyName}`);
    } else if (event.shiftKey) {
      console.log(`keypress:Shift + ${keyName}`);
    } else {
      console.log(`keypress:${keyName}`);
    }
  });
  */
}