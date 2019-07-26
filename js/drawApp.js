/*
* Created by narumi nogawa on 6/1/19.
*/
//ドローアプリの部分
//展開図の修正機能の追加を目的としている

function initDrawApp(globals){
  //----------------------------------------------------------------------
  //変数など各種定義
  var straightLineList = new Array();

  var beziList = new Array(); //ベジェ曲線の座標を格納する
  var beziDistList = new Array(); //ベジェ曲線の長さを保存する

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
  
  context.font = "30px serif"; //canvasに表示させる文字のサイズ
  context.strokeText("Click here!",100,100);

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
    //--------------------------------------------------------------
    //変数の初期化
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
        findRuling(context,beziDistList[beziDistList.length-1],cp1[0],cp1[1],cp2[0],cp2[1],cp3[0],cp3[1],cp4[0],cp4[1]);
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
          //var vecUp = vecP1.add(vecP1P3.multiplyScalar(-1000));
          var vecUp = new THREE.Vector2(vecP1.x + 1000 * normalP0P2.x, vecP1.y + 1000 * normalP0P2.y);
          //下方向
          //var vecDown = vecP1.add(vecP1P3.multiplyScalar(1000));
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
      //beziList.push([e.offsetX,e.offsetY]);
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

      //以下、移動する制御点を求める
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

    }
  });

  canvas.addEventListener("mousemove", e => {
    if(dragging == true){
      if(cpMove == true){
        beziList.splice(movedIndex,1,[e.offsetX,e.offsetY]);
        console.log(beziList.length);
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
      if(cpMove == true){
        beziList.splice(movedIndex,1,[e.offsetX,e.offsetY]);
        cpMove = false;
        dragging = false;
      }else{
        dragging = false;
        //ここでベジェ曲線の制御点を求める処理を
        globals.beziercurve.defineBeziPoint(dragList, beziList);
        //tmpCooListの初期化
        dragList = new Array();
        console.log(beziList);
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
    if(rulingNum < 20){
      rulingNum++;
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
    optimizeRuling(context,startEndInformation);
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
        beziList.pop();
        beziList.pop();
        beziList.pop();
        beziList.pop();
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

  //入力曲線(4 control points)からRulingを求めるメソッド
  function findRuling(ctx,curvelen,x1,y1,x2,y2,x3,y3,x4,y4){
    ctx.strokeStyle = "rgb(100,100,100)";                    //描画の色
    ctx.lineWidth = 2;                                      //描画する線の太さ

    //rulingの始点群と終点群の情報を保存するリストに格納するリスト
    var childStartEndInformation = new Array();

    var tmpbunkatsu = 1;                                    //何番目の分割点か？
    var tmpdist = 0.0;                                      //現在の距離の合計
    //var bunkatsu = 11;                                      //rulingは11-1本
    var bunkatsu = rulingNum;
    var dividedPoints = parseInt(curvelen)/bunkatsu;
    for(var t = 0.0; t <= 1.0 - 0.001; t += 0.001){
      var tt = t + 0.001;
      var bpx1 = Math.pow((1-t),3)*x1+3*t*Math.pow((1-t),2)*x2+3*(1-t)*Math.pow(t,2)*x3+Math.pow(t,3)*x4;
      var bpy1 = Math.pow((1-t),3)*y1+3*t*Math.pow((1-t),2)*y2+3*(1-t)*Math.pow(t,2)*y3+Math.pow(t,3)*y4;
      var bpx2 = Math.pow((1-tt),3)*x1+3*tt*Math.pow((1-tt),2)*x2+3*(1-tt)*Math.pow(tt,2)*x3+Math.pow(tt,3)*x4;
      var bpy2 = Math.pow((1-tt),3)*y1+3*tt*Math.pow((1-tt),2)*y2+3*(1-tt)*Math.pow(tt,2)*y3+Math.pow(tt,3)*y4;
      tmpdist += globals.beziercurve.dist(bpx1,bpy1,bpx2,bpy2);
      if(parseInt(tmpdist)-1 <= dividedPoints*tmpbunkatsu && parseInt(tmpdist)+1 >= dividedPoints*tmpbunkatsu){
        console.log("Reached Here!!");
        var start = new THREE.Vector2(bpx1,bpy1);
        var end = new THREE.Vector2(bpx2,bpy2);
        var svec = end.sub(start);
        var hvec = new THREE.Vector2(svec.y,-svec.x);
        hvec.normalize();

        //以下可展面内にrulingを伸ばす操作
        //線群の交差判定を用い交点を検出する操作
        var rux1 = bpx1+hvec.x*1000;
        var ruy1 = bpy1+hvec.y*1000;
        var rux2 = bpx1-hvec.x*1000;
        var ruy2 = bpy1-hvec.y*1000;

        var rulingStart = new Array();
        var rulingEnd = new Array();

        //交差判定を行う
        for(var i = 0; i < globals.svgInformation.stroke.length; i++){
          //法線方向に伸ばした時に交差しているかどうか
          if(globals.beziercurve.judgeIntersect(bpx1,bpy1,rux1,ruy1,
            globals.svgInformation.x1[i],globals.svgInformation.y1[i],globals.svgInformation.x2[i],globals.svgInformation.y2[i])){
              rulingEnd.push(globals.beziercurve.getIntersectPoint(bpx1,bpy1,globals.svgInformation.x1[i],globals.svgInformation.y1[i],
                rux1,ruy1,globals.svgInformation.x2[i],globals.svgInformation.y2[i]));
            }
          if(globals.beziercurve.judgeIntersect(bpx1,bpy1,rux2,ruy2,
              globals.svgInformation.x1[i],globals.svgInformation.y1[i],globals.svgInformation.x2[i],globals.svgInformation.y2[i])){
                rulingStart.push(globals.beziercurve.getIntersectPoint(bpx1,bpy1,globals.svgInformation.x1[i],globals.svgInformation.y1[i],
                  rux2,ruy2,globals.svgInformation.x2[i],globals.svgInformation.y2[i]));
            }
        }

        //Start,Endの要素の中から、それぞれ(bpx1,bpy1)に最短なものを選びそれらを結んだのがrulingとなる
        var tmpDist = 1000;
        for(var i = 0; i < rulingStart.length; i++){
          var s = rulingStart[i];
          for(var j = 0; j < rulingEnd.length; j++){
            var e = rulingEnd[j];
            if(tmpDist > globals.beziercurve.dist(s[0],s[1],e[0],e[1])){
              tmpDist = globals.beziercurve.dist(s[0],s[1],e[0],e[1]);
              rux1 = s[0];
              ruy1 = s[1];
              rux2 = e[0];
              ruy2 = e[1];
            }
          }
        }

        //canvas上描画するやーつ
        ctx.strokeStyle = "rgb(0,255,0)";
        ctx.beginPath();
        ctx.moveTo(parseInt(rux1), parseInt(ruy1));
        ctx.lineTo(parseInt(rux2), parseInt(ruy2));
        ctx.closePath();
        ctx.stroke();
        //
        //rulingを出力のために格納する
        outputList.push([parseInt(rux1), parseInt(ruy1)]);
        outputList.push([parseInt(rux2), parseInt(ruy2)]);

        childStartEndInformation.push([[parseInt(rux1), parseInt(ruy1)], [parseInt(rux2), parseInt(ruy2)]]);

        tmpbunkatsu++;
      }
    }
    //
    startEndInformation.push(childStartEndInformation);
    console.log(startEndInformation);
  }

  //
  //rulingの最適化
  function optimizeRuling(ctx,startEndInformation){
    var segmentNum = startEndInformation.length;

    //最後に描画した部分から最初に描画した部分にかけて描画する
    for(var i = segmentNum - 1; i > 0; i--){
      //end[segmentNum-1]から初める
      var startEnd = startEndInformation[i];
      //console.log("StartEndInfo");
      //console.log(startEnd);
      for(var j = 0; j < startEnd.length; j++){
        var se = startEnd[j];
        var startSe = se[0];
        var endSe = se[1];
        var startVec = new THREE.Vector2(startSe[0],startSe[1]);
        var endVec = new THREE.Vector2(endSe[0],endSe[1]);
        var vecStartEnd = new THREE.Vector2(endVec.x - startVec.x, endVec.y - startVec.y);
        var vecEndStart = new THREE.Vector2(-vecStartEnd.x, -vecStartEnd.y);
        vecStartEnd.normalize();
        vecEndStart.normalize();
        var vecExtraEnd = new THREE.Vector2(startVec.x + vecEndStart.x * 1000, startVec.y + vecEndStart.y * 1000);



        /*
        //startEnd[i-1]のrulingのなかで最短のものと平行にする処理が必要
        //そのようにベクトルを選ぶ
        var nextStartEnd = startEndInformation[i-1];
        var tmpDist = 10000;
        var index = 10000;
        for(var k = 0; k < nextStartEnd.length; k++){
          var nextSe = nextStartEnd[k];
          var nextS = nextSe[0];
          var nextE = nextSe[1];
          if(tmpDist > globals.beziercurve.dist(startVec.x,startVec.y,nextE[0],nextE[1])
          && globals.beziercurve.dist(startVec.x,startVec.y,nextE[0],nextE[1]) > 20){
            tmpDist = globals.beziercurve.dist(startVec.x,startVec.y,nextE[0],nextE[1]);
            index = k;
          }
        }
        var next = nextStartEnd[index];
        var nextStart = next[0];
        var nextEnd = next[1];
        var st = new THREE.Vector2(nextStart[0],nextStart[1]);
        var en = new THREE.Vector2(nextEnd[0],nextEnd[1]);
        var stToEn = new THREE.Vector2(en.x - st.x, en.y - st.y);
        var enToSt = new THREE.Vector2(-stToEn.x, -stToEn.y);
        stToEn.normalize();
        enToSt.normalize();
        
        //伸ばした先の座標
        var vecExtraEnd = new THREE.Vector2(startVec.x + enToSt.x * 1000, startVec.y + enToSt.y * 1000);
*/

        //ここで交差判定
        //交差した点を保存するリスト
        var intersected = new Array();
        for(var k = 0; k < globals.svgInformation.stroke.length; k++){
          //法線方向に伸ばした時に交差しているかどうか
          if(globals.beziercurve.judgeIntersect(startVec.x + vecEndStart.x * 10,startVec.y + vecEndStart.y * 10,vecExtraEnd.x,vecExtraEnd.y,
            globals.svgInformation.x1[k],globals.svgInformation.y1[k],globals.svgInformation.x2[k],globals.svgInformation.y2[k])){
              intersected.push(globals.beziercurve.getIntersectPoint(startVec.x,startVec.y,globals.svgInformation.x1[k],globals.svgInformation.y1[k],
                vecExtraEnd.x,vecExtraEnd.y,globals.svgInformation.x2[k],globals.svgInformation.y2[k]));
              }
             /*
            if(globals.beziercurve.judgeIntersect(startVec.x + enToSt.x * 10,startVec.y + enToSt.y * 10,vecExtraEnd.x,vecExtraEnd.y,
            globals.svgInformation.x1[k],globals.svgInformation.y1[k],globals.svgInformation.x2[k],globals.svgInformation.y2[k])){
              intersected.push(globals.beziercurve.getIntersectPoint(startVec.x,startVec.y,globals.svgInformation.x1[k],globals.svgInformation.y1[k],
                vecExtraEnd.x,vecExtraEnd.y,globals.svgInformation.x2[k],globals.svgInformation.y2[k]));
              }
              */
        }

        //interesectedの要素の中から、(startVec.x,startVec.y)に最短なものを選び
        //(startVec.x,startVec.y)と結んだものが最適化されたruling
        var extraX = 10000;
        var extraY = 10000;
        var tmpDist = 1000;
        for(var k = 0; k < intersected.length; k++){
          var is = intersected[k];
          if(tmpDist > globals.beziercurve.dist(startVec.x,startVec.y,is[0],is[1])){
            tmpDist = globals.beziercurve.dist(startVec.x,startVec.y,is[0],is[1]);
            extraX = is[0];
            extraY = is[1];
          }
        }

        if(extraX != 10000){
          //canvas上描画するやーつ
          ctx.strokeStyle = "rgb(0,0,0)";
          ctx.beginPath();
          ctx.moveTo(parseInt(startVec.x), parseInt(startVec.y));
          ctx.lineTo(parseInt(extraX), parseInt(extraY));
          ctx.closePath();
          ctx.stroke();

          //保存
          optimizedRuling.push([parseInt(startVec.x), parseInt(startVec.y)]);
          optimizedRuling.push([parseInt(extraX), parseInt(extraY)]);

          //追加する
          startEndInformation[i-1].push([[parseInt(startVec.x), parseInt(startVec.y)],
          [parseInt(extraX), parseInt(extraY)]]);
        }
        //
        //
        //
      }
    }


    //最初に描画した方から最後に描画した方に向けて描画する
    for(var i = 0; i < segmentNum - 1; i++){
      //start[0]から初める
      var startEnd = startEndInformation[i];
      for(var j = 0; j < startEnd.length; j++){
        var se = startEnd[j];
        var startSe = se[0];
        var endSe = se[1];
        var startVec = new THREE.Vector2(startSe[0],startSe[1]);
        var endVec = new THREE.Vector2(endSe[0],endSe[1]);
        var vecStartEnd = new THREE.Vector2(endVec.x - startVec.x, endVec.y - startVec.y);
        var vecEndStart = new THREE.Vector2(-vecStartEnd.x, -vecStartEnd.y);
        vecStartEnd.normalize();
        vecEndStart.normalize();
        var vecExtraEnd = new THREE.Vector2(startVec.x + vecStartEnd.x * 1000, startVec.y + vecStartEnd.y * 1000);


        /*
        //startEnd[i+1]のrulingのなかで最短のものと平行にする処理が必要
        //そのようにベクトルを選ぶ
       var nextStartEnd = startEndInformation[i+1];
       var tmpDist = 10000;
       var index = 10000;
       for(var k = 0; k < nextStartEnd.length; k++){
         var nextSe = nextStartEnd[k];
         var nextS = nextSe[0];
         var nextE = nextSe[1];
         if(tmpDist > globals.beziercurve.dist(endVec.x,endVec.y,nextS[0],nextS[1])
         && globals.beziercurve.dist(endVec.x,endVec.y,nextS[0],nextS[1]) > 20){
           tmpDist = globals.beziercurve.dist(endVec.x,endVec.y,nextS[0],nextS[1]);
           index = k;
         }
       }
       var next = nextStartEnd[index];
       var nextStart = next[0];
       var nextEnd = next[1];
       var st = new THREE.Vector2(nextStart[0],nextStart[1]);
       var en = new THREE.Vector2(nextEnd[0],nextEnd[1]);
       var stToEn = new THREE.Vector2(en.x - st.x, en.y - st.y);
       var enToSt = new THREE.Vector2(-stToEn.x, -stToEn.y);
       stToEn.normalize();
       enToSt.normalize();
        //伸ばした先の座標
        var vecExtraEnd = new THREE.Vector2(startVec.x + stToEn.x * 1000, startVec.y + stToEn.y * 1000);
*/

        //ここで交差判定
        //交差した点を保存するリスト
        var intersected = new Array();
        for(var k = 0; k < globals.svgInformation.stroke.length; k++){
          //法線方向に伸ばした時に交差しているかどうか
          if(globals.beziercurve.judgeIntersect(endVec.x + vecStartEnd.x * 10,endVec.y + vecStartEnd.y * 10,vecExtraEnd.x,vecExtraEnd.y,
            globals.svgInformation.x1[k],globals.svgInformation.y1[k],globals.svgInformation.x2[k],globals.svgInformation.y2[k])){
              intersected.push(globals.beziercurve.getIntersectPoint(endVec.x,endVec.y,globals.svgInformation.x1[k],globals.svgInformation.y1[k],
                vecExtraEnd.x,vecExtraEnd.y,globals.svgInformation.x2[k],globals.svgInformation.y2[k]));
              }
             /*
          if(globals.beziercurve.judgeIntersect(endVec.x + stToEn.x * 10,endVec.y + stToEn.y * 10,vecExtraEnd.x,vecExtraEnd.y,
          globals.svgInformation.x1[k],globals.svgInformation.y1[k],globals.svgInformation.x2[k],globals.svgInformation.y2[k])){
            intersected.push(globals.beziercurve.getIntersectPoint(endVec.x,endVec.y,globals.svgInformation.x1[k],globals.svgInformation.y1[k],
              vecExtraEnd.x,vecExtraEnd.y,globals.svgInformation.x2[k],globals.svgInformation.y2[k]));
            }
            */
        }

        //interesectedの要素の中から、(endVec.x,endVec.y)に最短なものを選び
        //(endVec.x,endVec.y)と結んだものが最適化されたruling
        var extraX = 10000;
        var extraY = 10000;
        var tmpDist = 1000;
        for(var k = 0; k < intersected.length; k++){
          var is = intersected[k];
          if(tmpDist > globals.beziercurve.dist(endVec.x,endVec.y,is[0],is[1])){
            tmpDist = globals.beziercurve.dist(endVec.x,endVec.y,is[0],is[1]);
            extraX = is[0];
            extraY = is[1];
          }
        }

        if(extraX != 10000){
          //canvas上描画するやーつ
          ctx.strokeStyle = "rgb(0,0,0)";
          ctx.beginPath();
          ctx.moveTo(parseInt(endVec.x), parseInt(endVec.y));
          ctx.lineTo(parseInt(extraX), parseInt(extraY));
          ctx.closePath();
          ctx.stroke();

          //保存
          optimizedRuling.push([parseInt(endVec.x), parseInt(endVec.y)]);
          optimizedRuling.push([parseInt(extraX), parseInt(extraY)]);

          //追加する
          startEndInformation[i+1].push([[parseInt(endVec.x), parseInt(endVec.y)],
          [parseInt(extraX), parseInt(extraY)]]);
        }
        //
        //
        //
      }
    }

  }
}