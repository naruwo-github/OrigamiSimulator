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

  var readerFile = new FileReader();

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
      //console.log(cooX.length);
    }else{
      //console.log(globals.svgInformation.stroke.length);
     canvasReload();                                        //canvasのリロード
     //console.log(globals.svgFile);
     readerFile.readAsText(globals.svgFile);                    //svgファイルをテキストで取得
     readerFile.onload = function(ev){
       //console.log(readerFile.result);
     }
    }
    drawCanvas();

    globals.simulationRunning = true;                       //シミュレーションをON
  })

  //ドローツール画面のリサイズ判定
  window.addEventListener("resize", function() {
   canvasReload();
   drawCanvas();
  });

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
    }
  });

  //デリートボタンが押された時の処理
  document.getElementById("delete-button").addEventListener("click", function(){
    console.log("delete button pressed...");
    cooX.pop();
    cooY.pop();
    console.log(cooX.length);
    console.log(cooX);
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
    for(var i = 0; i < cooX.length; i+=2){
      context.fillRect(cooX[i],cooY[i],3,3);
      if(cooX[i+1] !== null){
        drawLine(context,"rgb(0, 255, 0)",2,cooX[i],cooY[i],cooX[i+1],cooY[i+1]);
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
