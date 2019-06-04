//
/*
ドローアプリの部分
展開図の修正機能の追加を目的としている
*/
//

function initDrawApp(globals){
  //----------------------------------------------------------------------
  //変数など各種定義
  var cooX = new Array();//クリックしたX座標
  var cooY = new Array();//クリックしたY座標

  var readerFile = new FileReader();
  //var readerData = new FileReader();

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
      console.log(cooX.length);
      //console.log(cooX);
    }else{
     canvasReload();                                        //canvasのリロード
     console.log(globals.svgFile);
     readerFile.readAsText(globals.svgFile);                    //svgファイルをテキストで取得
     readerFile.onload = function(ev){
       //console.log(readerFile.result);
     }
     //readerData.readAsDataURL(globals.svgFile);               //dataurlでsvgファイルを取得
     //readerData.onload = function(ev){
       //console.log(readerData.result);
     //}
     console.log(globals.svgFile);
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
    //ここに、シミュレーターに作成した展開図を投げるように記述する
    //---------------------------------------
    //svgを用いる方法
    //Go! Simulation!
    console.log(globals.svgFile);
    globals.importer.simulateAgain(globals.svgFile,cooX,cooY);
    //globals.simulationRunning = true; 
    //---------------------------------------
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
    context.drawImage(globals.svgimg,100,100,globals.svgimg.width,globals.svgimg.height);
  }

  function drawCanvas(){
    //点を描画
    for(var i = 0; i < cooX.length; i+=2){
      context.fillRect(cooX[i],cooY[i],3,3);
      if(cooX[i+1] !== null){
        drawLine(context,cooX[i],cooY[i],cooX[i+1],cooY[i+1]);
      }
    }
  }

  //ruling描画メソッド
  function drawLine(ctx, x1, y1, x2, y2){
    //線の色
    ctx.strokeStyle = "rgb(0, 255, 0)";     //見やすいから緑
    ctx.lineWidth = 2;
    //ctx.strokeStyle = "rgb(255, 255, 0)";   //rulingのために黄色
    //2点から直線を引く
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
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

  function reSimulate(filepath) {
    var extension = filepath.split(".");
    var name = extension[extension.length-2].split("/");
    name = name[name.length-1];
    extension = extension[extension.length-1];
    // globals.setCreasePercent(0);
    if (extension == "svg"){
        globals.url = filepath;
        globals.filename = name;
        globals.extension = extension;
        console.log("AAAAAAA");
        globals.pattern.loadSVG(filepath);
        console.log("BBB");
    } else {
        console.warn("unknown extension: " + extension);
    }
  }
}