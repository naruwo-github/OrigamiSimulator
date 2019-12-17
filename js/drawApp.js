/*
* Created by narumi nogawa on 6/1/19.
*/
//ドローアプリの部分
//展開図の修正機能の追加を目的としている

function initDrawApp(globals){
  //----------------------------------------------------------------------
  //変数など各種定義
  var straightLineList = new Array();

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

  var readerFile = new FileReader(); //svgのdlに使う

  const canvas = document.querySelector('#draw-area'); //canvasを取得
  const context = canvas.getContext('2d'); //描画準備のためcontextを取得

  var straight = false; //直線モードのフラグ
  var slineButton = document.getElementById("sline-button"); //直線ボタン
  var buttonColor = slineButton.style.backgroundColor; //ボタンの元の色

  //canvasの大きさをwindowと同じにする
  $('#draw-area').attr('width', $(window).width());
  $('#draw-area').attr('height', $(window).height());
  
  //context.font = "30px serif"; //canvasに表示させる文字のサイズ
  context.font = "100px 'Century Gothic'";
  context.strokeText("Click here",$(window).width()/2-100,$(window).height()/2);

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
    //console.log(globals.autoTriangulatedInfo);
    var triInfo = globals.autoTriangulatedInfo;
    for (let index = 0; index < triInfo.length; index+=2) {
      const start = triInfo[index];
      const end = triInfo[index+1];
      drawLine(context,"rgb(255, 255, 0)",2,start[0],start[1],end[0],end[1]);
    }
    
    //--------------------------------------------------------------
    //変数の初期化
    splineDistList = new Array();
    beziDistList = new Array();
    outputList = new Array();
    startEndInformation = new Array();

    //--------------------------------------------------------------
    //点を描画
    context.fillStyle = "rgb(255,0,0)";                   //点は基本赤
    //直線ツールの点
    for(var i = 0; i < straightLineList.length; i+=2){
      var stl1 = straightLineList[i];
      var stl2 = straightLineList[i+1];
      context.fillRect(stl1[0]-2,stl1[1]-2,5,5);
      context.fillRect(stl2[0]-2,stl2[1]-2,5,5);
      if(stl2[0] !== null){
        drawLine(context,"rgb(0, 255, 0)",2,stl1[0],stl1[1],stl2[0],stl2[1]);
      }
    }

    //rulingツール1の点
    context.fillStyle = "rgb(255,50,255)";
    for(var i = 0; i < beziList.length; i++){
      var coo = beziList[i];
      context.fillRect(coo[0]-2,coo[1]-2,5,5);
    }

    /*
    //ベジェ曲線を描画
    //beziDistList = new Array();
    if(beziList.length > 0 && beziList.length % 4 === 0){
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
    if(splineList.length > 0 && splineList.length % 7 == 0){
      //splineツールの制御点
      for(var i = 0; i < splineList.length; i++){
        var coo = splineList[i];
        context.fillStyle = "rgb(255,50,255)";
        context.fillRect(coo[0]-3,coo[1]-3,7,7);
      }

      for(var i = 0; i < splineList.length; i+=7){
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
    if(optimizedRuling.length > 0){
      for(var i = 0; i < optimizedRuling.length - 1; i+=2){
        var coo1 = optimizedRuling[i];
        var coo2 = optimizedRuling[i+1];
        drawLine(context,"rgb(0,0,0)",2,coo1[0],coo1[1],coo2[0],coo2[1]);
      }
    }

    //rulingツール2のruling
    context.strokeStyle = "rgb(50, 200, 255)"
    if(ru2array.length > 0){
      for(var i = 0; i < ru2array.length; i++){
        var aaa = ru2array[i]
        context.beginPath();
        context.arc(aaa[0], aaa[1], 10, 10 * Math.PI / 180, 80 * Math.PI / 180, true);
        context.closePath();
        context.stroke();
      }

      if(ru2array.length > 2){
        console.log()
        //点Pi、Pi+1、Pi+2について
        //直線Pi+1(Pi + Pi+2)/2 を描画する
        for(var i = 0; i < ru2array.length - 2; i++){
          var P0 = ru2array[i];
          var P1 = ru2array[i+1];
          var P2 = ru2array[i+2];
          var P3 = [(P0[0] + P2[0])/2, (P0[1] + P2[1])/2];

          var vecP0 = new THREE.Vector2(P0[0], P0[1]);
          var vecP1 = new THREE.Vector2(P1[0], P1[1]);
          var vecP2 = new THREE.Vector2(P2[0], P2[1]);
          var vecP3 = new THREE.Vector2(P3[0], P3[1]);
          var vecP0P2 = new THREE.Vector2(vecP2.x - vecP0.x, vecP2.y - vecP0.y);
          var vecP1P3 = vecP3.sub(vecP1);
          vecP0P2.normalize();
          normalP0P2 = new THREE.Vector2(vecP0P2.y, -vecP0P2.x);
          vecP1P3.normalize();
　
          //上方向
          var vecUp = new THREE.Vector2(vecP1.x + 1000 * normalP0P2.x, vecP1.y + 1000 * normalP0P2.y);
          //下方向
          var vecDown = new THREE.Vector2(vecP1.x - 1000 * normalP0P2.x, vecP1.y - 1000 * normalP0P2.y);

          var rulingStart = new Array();
          var rulingEnd = new Array();

          //交差判定を行う
          for(var j = 0; j < globals.svgInformation.stroke.length; j++){
            //上方向
            if(globals.beziercurve.judgeIntersect2(vecP1.x,vecP1.y,vecUp.x,vecUp.y,
              globals.svgInformation.x1[j],globals.svgInformation.y1[j],globals.svgInformation.x2[j],globals.svgInformation.y2[j])){
                rulingEnd.push(globals.beziercurve.getIntersectPoint(vecP1.x,vecP1.y,globals.svgInformation.x1[j],globals.svgInformation.y1[j],
                vecUp.x,vecUp.y,globals.svgInformation.x2[j],globals.svgInformation.y2[j]));
            }
            //下方向
            if(globals.beziercurve.judgeIntersect2(vecP1.x,vecP1.y,vecDown.x,vecDown.y,
              globals.svgInformation.x1[j],globals.svgInformation.y1[j],globals.svgInformation.x2[j],globals.svgInformation.y2[j])){
                rulingStart.push(globals.beziercurve.getIntersectPoint(vecP1.x,vecP1.y,globals.svgInformation.x1[j],globals.svgInformation.y1[j],
                vecDown.x,vecDown.y,globals.svgInformation.x2[j],globals.svgInformation.y2[j]));
            }
          }

          //Start,Endの要素の中から、それぞれ(bpx1,bpy1)に最短なものを選びそれらを結んだのがrulingとなる
          var tmpDist = 1000;
          var startx = 0;
          var starty = 0;
          var endx = 0;
          var endy = 0;
          for(var j = 0; j < rulingStart.length; j++){
            var s = rulingStart[j];
            for(var k = 0; k < rulingEnd.length; k++){
              var e = rulingEnd[k];
              if(tmpDist > globals.beziercurve.dist(s[0],s[1],e[0],e[1])
              && s[0] != parseInt(vecP1.x) && s[1] != parseInt(vecP1.y)
              && e[0] != parseInt(vecP1.x) && e[1] != parseInt(vecP1.y)){
                tmpDist = globals.beziercurve.dist(s[0],s[1],e[0],e[1]);
                startx = s[0];
                starty = s[1];
                endx = e[0];
                endy = e[1];
              }
            }
          }

          //いざ描画!!
          context.strokeStyle = "rgb(0,255,0)";
          context.beginPath();
          context.moveTo(parseInt(startx), parseInt(starty));
          context.lineTo(parseInt(endx), parseInt(endy));
          context.closePath();
          context.stroke();

          //rulingを出力のために格納する
          outputList.push([parseInt(startx), parseInt(starty)]);
          outputList.push([parseInt(endx), parseInt(endy)]);
        }
      }

    }
  }


  //canvas内のクリック判定
  canvas.addEventListener("click", e => {
    if(straight === true){ //直線ツールがON!!
      //クリックした点が展開図情報内の点のいずれかに近い場合、
      //重ねて配置したいと判定する
      var ret = globals.beziercurve.returnNearCoordinates(globals.svgInformation,e.offsetX,e.offsetY)
      var tmpDist = globals.beziercurve.dist(e.offsetX,e.offsetY,ret[0],ret[1])
      if(tmpDist < 10){ //distが10未満なら頂点に入力点を重ねる
        straightLineList.push([ret[0], ret[1]]);
      }else { //10以上ならクリックしたところに素直に入力(この時canvasのoffset距離であることに注意)
        straightLineList.push([e.offsetX, e.offsetY]);
      }
    }else if(ruling1 === true){ //ベジェ曲線ツールがON!!
      //
    }else if(ruling2 === true){
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
    if(ruling1 == true){ //rulingツール1がon
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
      if(splineList.length > 0){
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
    if(dragging == true){
      /*if(cpMove == true){
        //これはベジェ
        beziList.splice(movedIndex,1,[e.offsetX,e.offsetY]);
        //console.log(beziList.length);
        canvasReload();
        drawCanvas();
      }else */if(cpMove2 == true){
        //これはスプライン
        splineList.splice(movedIndex2,1,[e.offsetX,e.offsetY]);
        canvasReload();
        drawCanvas();
      }else{
      dragList.push([e.offsetX, e.offsetY]);
      //console.log(dragList.length);
      }
    }
  });

  canvas.addEventListener("mouseup", e => {
    if(dragging == true){
      /*if(cpMove == true){
        //これはベジェ
        beziList.splice(movedIndex,1,[e.offsetX,e.offsetY]);
        cpMove = false;
        dragging = false;
      }else */if(cpMove2 == true){
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
    if(straight === true){
      console.log("straight line mode ended...");
      straight = false;
      slineButton.style.backgroundColor = buttonColor;
    }else{
      console.log("straight line mode started...");
      straight = true;
      slineButton.style.backgroundColor = '#aaaaaa';

      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
    }
  });

  //rulingツール1ボタンが押された時の処理
  document.getElementById("ruling1-button").addEventListener("click", function(){
    if(ruling1 === true){
      console.log("ruling mode1 ended...");
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
    }else{
      console.log("ruling mode1 started...");
      ruling1 = true;
      ruling1Button.style.backgroundColor = '#aaaaaa';

      straight = false;
      slineButton.style.backgroundColor = buttonColor;
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
    }
  });

  //ruling本数の増減
  upButton.addEventListener("click", function(){
    if(rulingNum < 1100){
      rulingNum++;
      //rulingNum+=100;
      displayRulingNum.innerText = String(rulingNum);
      canvasReload();
      drawCanvas();
    }
  });
  downButton.addEventListener("click", function(){
    if(rulingNum > 0){
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
    if(ruling2 === true){
      console.log("ruling mode2 ended...");
      ruling2 = false;
      ruling2Button.style.backgroundColor = buttonColor;
    }else{
      console.log("ruling mode2 started...");
      ruling2 = true;
      ruling2Button.style.backgroundColor = '#aaaaaa';

      straight = false;
      slineButton.style.backgroundColor = buttonColor;
      ruling1 = false;
      ruling1Button.style.backgroundColor = buttonColor;
    }
  });

  //デリートボタンが押された時の処理
  document.getElementById("delete-button").addEventListener("click", function(){
    console.log("delete button pressed...");
    if(straight === true){
      straightLineList.pop();
    }else if(ruling1 === true){
      if(optimizedRuling.length > 0){
        optimizedRuling = new Array();
      }else{
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
    }else if(ruling2 === true){
      ru2array.pop();
    }else{
    }
    canvasReload();
    drawCanvas();
  });

  //svg出力ボタンが押された時の処理
  document.getElementById("go-simulation").addEventListener("click", function(){
    drawCanvas();
    //直線ツールの描画結果を追加する
    for(var i = 0; i < straightLineList.length; i++){
      var stl = straightLineList[i];
      outputList.push([stl[0], stl[1]]);
    }
    //optimized rulingを追加する
    for(var i = 0; i < optimizedRuling.length; i++){
      var stl = optimizedRuling[i];
      outputList.push([stl[0],stl[1]]);
    }
    //修正した展開図をシミュレータへ投げる
    globals.importer.simulateAgain(globals.svgFile,outputList);
    globals.simulationRunning = true; 

    //Simulate Modeへ遷移する
    globals.navMode = "simulation";
    $("#navSimulation").parent().addClass("open");
    //$("#navPattern").parent().removeClass("open");
    $("#navDrawApp").parent().removeClass("open");
    $("#drawAppViewer").hide();
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
  function canvasReload(){
    //canvas初期化
    $('#draw-area').attr('width', globals.svgimg.width);  //canvasリサイズ
    $('#draw-area').attr('height', globals.svgimg.height);
    //展開図情報の描画
    drawDevelopment(globals.svgInformation,context);
  }

  //展開図情報を描画するメソッド
  function drawDevelopment(info,ctx){
    for(var i = 0; i < info.stroke.length; i++){
      //drawLine(ctx,info.stroke[i],info.stroke_width[i],info.x1,info.y1,info.x2,info.y2);
      drawLine(ctx,"rgb("+String(hex2rgb(info.stroke[i]))+")",Number(info.stroke_width[i]),parseInt(info.x1[i]),parseInt(info.y1[i]),parseInt(info.x2[i]),parseInt(info.y2[i]));
      //点を打つ
      //ctx.fillStyle = "rgb(0,255,255)";
      ctx.fillStyle = "rgb(50, 200, 255)"
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
    setTimeout(function(){
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);  
    }, 100);  
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);    
  }

  //hexをgbaに変換する関数
  function hex2rgb(hex) {
    if(hex.slice(0,1) == "#"){
      hex = hex.slice(1);
    }
    if(hex.length == 3){
      hex = hex.slice(0,1) + hex.slice(0,1) + hex.slice(1,2) + hex.slice(1,2) + hex.slice(2,3) + hex.slice(2,3);
    }
    return [hex.slice(0,2), hex.slice(2,4), hex.slice(4,6)].map(function(str) {
      return parseInt(str,16);
    });
  }

  //ruling描画メソッドないで用いる2点を結んで直線を描画するメソッド
  function drawLine(ctx, color, width, x1, y1, x2, y2){
    ctx.strokeStyle = color;     //線の色
    ctx.lineWidth = width;      //線の太さ
    ctx.beginPath();            //直線の開始
    ctx.moveTo(x1, y1);         //開始点座標
    ctx.lineTo(x2, y2);         //終了点座標
    ctx.closePath();            //直線の終了
    ctx.stroke();               //描画！
  }
}