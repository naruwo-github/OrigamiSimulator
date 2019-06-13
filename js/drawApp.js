/*
* Created by narumi nogawa on 6/1/19.
*/
//ドローアプリの部分
//展開図の修正機能の追加を目的としている

function initDrawApp(globals){
  //----------------------------------------------------------------------
  //変数など各種定義
  var cooX = new Array();                                   //クリックしたX座標
  var cooY = new Array();                                   //クリックしたY座標

  var beziList = new Array();                               //ベジェ曲線の座標を格納するリスト(配列を代用)
  //var dragList = new Array();                               //tmp
  var bezi = false;
  var bcurveButton = document.getElementById("bcurve-button");
  //var dragging = false;                                     //ドラッグ中かどうか

  var readerFile = new FileReader();                        //svgのdlに使う

  const canvas = document.querySelector('#draw-area');      //canvasを取得
  const context = canvas.getContext('2d');                  //描画準備のためcontextを取得

  var straight = false;                                     //直線モードのかどうかの判定
  var slineButton = document.getElementById("sline-button");//直線ボタン
  var buttonColor = slineButton.style.backgroundColor;      //ボタンの元の色

  //canvasの大きさをwindowと同じにする
  $('#draw-area').attr('width', $(window).width());
  $('#draw-area').attr('height', $(window).height());
  
  context.font = "30px serif";                              //canvasに表示させる文字のサイズ
  context.strokeText("Click here!",100,100);
  //----------------------------------------------------------------------

  //canvas内のクリック判定
  canvas.addEventListener("click", e => {
    if(straight === true){                                  //直線ツールがON!!
      cooX.push(event.offsetX);                              //座標を取得x&y
      cooY.push(event.offsetY);
    }else if(bezi === true){                                //ベジェ曲線ツールがON!!
      beziList.push([e.offsetX,e.offsetY]);
      console.log(beziList);
    }else{
     canvasReload();                                        //canvasのリロード
     readerFile.readAsText(globals.svgFile);                    //svgファイルをテキストで取得
     readerFile.onload = function(ev){
     }
    }
    drawCanvas();

    globals.simulationRunning = true;                       //シミュレーションをON
  })

  /*
  //canvas内のドラッグ判定 = mousedown + mousemove + mouseup
  canvas.addEventListener("mousedown", e => {
    dragging = true;
  });
  canvas.addEventListener("mousemove", e => {
    if(dragging){
      if(bezi){
        dragList.push([e.offsetX,e.offsetY]);
        console.log([e.offsetX,e.offsetY]);
      }
    }
  });
  canvas.addEventListener("mouseup", e => {
    dragging = false;
    if(dragList.length > 20){
      globals.beziercurve.defineBeziPoint(dragList,beziList);
      console.log("dragList");
      console.log(dragList);
      console.log("beziList");
      console.log(beziList);
      dragList = new Array();
    }
  });
  */

  //ドローツール画面のリサイズ判定
  window.addEventListener("resize", function() {
   canvasReload();
   drawCanvas();
  });

  //直線ボタンが押された時の処理
  document.getElementById("sline-button").addEventListener("click", function(){
    if(straight === true){
      //console.log("straight line mode ended...");
      straight = false;
      slineButton.style.backgroundColor = buttonColor;
    }else{
      //console.log("straight line mode started...");
      straight = true;
      slineButton.style.backgroundColor = '#aaaaaa';

      bezi = false;
      bcurveButton.style.backgroundColor = buttonColor;
    }
  });

  //ベジェ曲線ボタンが押された時の処理
  document.getElementById("bcurve-button").addEventListener("click", function(){
    if(bezi === true){
      //console.log("bezi curve mode ended...");
      bezi = false;
      bcurveButton.style.backgroundColor = buttonColor;
    }else{
      //console.log("bezi curve mode started...");
      bezi = true;
      bcurveButton.style.backgroundColor = '#aaaaaa';

      straight = false;
      slineButton.style.backgroundColor = buttonColor;
    }
  });

  //デリートボタンが押された時の処理
  document.getElementById("delete-button").addEventListener("click", function(){
    console.log("delete button pressed...");
    if(straight === true){
      cooX.pop();
      cooY.pop();
      //console.log(cooX.length);
      //console.log(cooX);
    }else if(bezi === true){
      beziList.pop();
    }
    canvasReload();
    drawCanvas();
  });

  //svg出力ボタンが押された時の処理
  document.getElementById("go-simulation").addEventListener("click", function(){
    //修正した展開図をシミュレータへ投げる
    //console.log(globals.svgFile);
    globals.importer.simulateAgain(globals.svgFile,cooX,cooY);  //再入力
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

  //canvasリロードメソッド
  function canvasReload(){
    //canvas初期化
    $('#draw-area').attr('width', globals.svgimg.width);  //canvasリサイズ
    $('#draw-area').attr('height', globals.svgimg.height);
    //context.drawImage(globals.svgimg,100,100,globals.svgimg.width,globals.svgimg.height);
    //context.drawImage(globals.svgimg,0,0,globals.svgimg.width,globals.svgimg.height);
    console.log("drawDevelopment began");
    drawDevelopment(globals.svgInformation,context);
    console.log("drawDevelopment ended");
  }

  function drawCanvas(){
    //点を描画
    context.fillStyle = "rgb(255,0,0)";                   //点は基本赤
    //直線ツールの点
    for(var i = 0; i < cooX.length; i+=2){
      context.fillRect(cooX[i],cooY[i],3,3);
      context.fillRect(cooX[i+1],cooY[i+1],3,3);
      if(cooX[i+1] !== null){
        drawLine(context,"rgb(0, 255, 0)",2,cooX[i],cooY[i],cooX[i+1],cooY[i+1]);
      }
    }
    //ベジェ曲線ツールの点
    for(var i = 0; i < beziList.length; i++){
      var coo = beziList[i];
      context.fillRect(coo[0],coo[1],3,3);
    }

    //ベジェ曲線を描画
    if(beziList.length > 0 && beziList.length % 4 === 0){
      for(var i = 0; i < beziList.length; i+=4){
        var cp1 = beziList[i];
        var cp2 = beziList[i+1];
        var cp3 = beziList[i+2];
        var cp4 = beziList[i+3];
        globals.beziercurve.drawBezier(context,cp1[0],cp1[1],cp2[0],cp2[1],cp3[0],cp3[1],cp4[0],cp4[1]);
      }
    }
  }

  //ruling描画メソッド
  function drawLine(ctx, color, width, x1, y1, x2, y2){
    ctx.strokeStyle = color;     //線の色
    ctx.lineWidth = width;      //線の太さ
    ctx.beginPath();            //直線の開始
    ctx.moveTo(x1, y1);         //開始点座標
    ctx.lineTo(x2, y2);         //終了点座標
    ctx.closePath();            //直線の終了
    ctx.stroke();               //描画！
  }

  function drawDevelopment(info,ctx){
    for(var i = 0; i < info.stroke.length; i++){
      //drawLine(ctx,info.stroke[i],info.stroke_width[i],info.x1,info.y1,info.x2,info.y2);
      drawLine(ctx,"rgb("+String(hex2rgb(info.stroke[i]))+")",Number(info.stroke_width[i]),parseInt(info.x1[i]),parseInt(info.y1[i]),parseInt(info.x2[i]),parseInt(info.y2[i]));
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
    //document.body.removeChild(a);
    //window.URL.revokeObjectURL(url);    
  }

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
}
