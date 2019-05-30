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

  const canvas = document.querySelector('#draw-area');      //canvasを取得
  const context = canvas.getContext('2d');                  //描画準備のためcontextを取得
  //let currentColor = '#000000';
  //var counter = 0;//初回クリックを判定するカウンタ
  var straight = false;                                     //直線モードのかどうかの判定
  var slineButton = document.getElementById("sline-button");//直線ボタン
  var buttonColor = slineButton.style.backgroundColor;      //ボタンの元の色

  //canvasの大きさをwindowと同じにする
  $('#draw-area').attr('width', $(window).width());
  $('#draw-area').attr('height', $(window).height());
  //$('#draw-area').get(0).width = $(window).width();
  //$('#draw-area').get(0).height = $(window).height();
  
  context.font = "30px serif";                              //canvasに表示させる文字のサイズ
  context.strokeText("Click here!",100,100);
  //context.fillText("Click here!",100,100);
  //context.strokeStyle = "#666";
  //context.lineWidth = 10;
  //context.strokeStyle = 'rgb(255, 255, 0)';
  //context.fillStyle = 'rgb(255, 255, 0)';

  //----------------------------------------------------------------------

  //canvas内のクリック判定
  canvas.addEventListener("click", e => {
    if(straight === true){                                  //直線ツールがON!!
      cooX.push(event.offsetX);                              //座標を取得x&y
      cooY.push(event.offsetY);
      console.log(cooX.length);
      console.log(cooX);
      //context.fillRect(event.offsetX,event.offsetY,5,5);    //四角形プロット
      //context.fillRect(event.layerX,event.layerY,5,5);
    }else{
      /*
      $('#draw-area').attr('width', $(window).width());
      $('#draw-area').attr('height', $(window).height());
      //キャンバスに合わせて縮小したサイズ
      //context.drawImage(globals.svgimg,100,100,canvas.width,canvas.height);
      */
     canvasReload();
      /*
      $('#draw-area').attr('width', globals.svgimg.width);  //canvasリサイズ
      $('#draw-area').attr('height', globals.svgimg.height);
      //$('#draw-area').get(0).width = globals.svgimg.width;
      //$('#draw-area').get(0).height = globals.svgimg.height;

      //svg元の大きさで描画
      context.drawImage(globals.svgimg,400,100,globals.svgimg.width,globals.svgimg.height);
      */

      var foldInfo = globals.foldfold;                      //foldDataの取得
      console.log(foldInfo);

      /*
      var svgsvg = new FileReader();
      var file = globals.svgimg.src;
      var filename = file.match(".+/(.+?)([\?#;].*)?$")[1];
      console.log(filename);
      */
    }
    drawCanvas();

    globals.simulationRunning = true;                       //シミュレーションをON
  })

  //ドローツール画面のリサイズ判定
  window.addEventListener("resize", function() {
    /*
    $('#draw-area').attr('width', globals.svgimg.width);  //canvasリサイズ
    $('#draw-area').attr('height', globals.svgimg.height);
    //svg元のサイズで描画
    context.drawImage(globals.svgimg,400,100,globals.svgimg.width,globals.svgimg.height);
    //点を描画
    for(var i = 0; i < cooX.length; i++){
      context.fillRect(cooX[i],cooY[i],3,3);
    }
    */
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
    /*
    //canvas初期化
    $('#draw-area').attr('width', globals.svgimg.width);  //canvasリサイズ
    $('#draw-area').attr('height', globals.svgimg.height);
    context.drawImage(globals.svgimg,400,100,globals.svgimg.width,globals.svgimg.height);
    //点を描画
    for(var i = 0; i < cooX.length; i++){
      context.fillRect(cooX[i],cooY[i],3,3);
    }
    */
   canvasReload();
   drawCanvas();
  });

  //svg出力ボタンが押された時の処理
  document.getElementById("go-simulation").addEventListener("click", function(){
    console.log("converting to svg or fold...");
    //ここに、シミュレーターに作成した展開図を投げるように記述する
  });

  //canvasリロードメソッド
  function canvasReload(){
    //canvas初期化
    $('#draw-area').attr('width', globals.svgimg.width);  //canvasリサイズ
    $('#draw-area').attr('height', globals.svgimg.height);
    context.drawImage(globals.svgimg,400,100,globals.svgimg.width,globals.svgimg.height);
  }

  function drawCanvas(){
    //点を描画
    for(var i = 0; i < cooX.length; i++){
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
    //ctx.strokeStyle = "rgb(255, 255, 0)";   //rulingのために黄色
    //2点から直線を引く
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
  }

}


//以下今まで使っていたコードたち
/*
  //var scHeight = screen.height;//スクリーンの高さ
  //var scWidth = screen.width;//スクリーンの横幅取得
  //canvas内のクリック判定
  canvas.addEventListener("click", e => {
    if(counter === 0){//初回クリック時にのみ、canvas内に展開図を表示する
      counter++;
      $('#draw-area').get(0).width = globals.svgimg.width;
      $('#draw-area').get(0).height = globals.svgimg.height;
      //描画
      context.drawImage(globals.svgimg,400,100,globals.svgimg.width,globals.svgimg.height);
    }
    if(globals.navMode === "drawapp") {
      if(straight === true){//直線ツールがON!!
        cooX.push(event.layerX);
        cooY.push(event.layerY);
        //四角形をプロットする
        context.fillRect(event.offsetX,event.offsetY,5,5);
      }
    }
    globals.simulationRunning = true;
  })
  */

//色を白に
//context.fillStyle = 'rgb(255,255,255)';
//canvasを白で塗りつぶす = clear
//context.fillRect(0,0,canvas.width,canvas.height);
//console.log("(layerx, layery) : ("+event.layerX+", "+event.layerY+")");
//console.log("(offsetx, offsety) : ("+event.offsetX+", "+event.offsetY+")");
//context.fillRect(event.layerX,event.layerY,5,5);
//console.log(scHeight+" , "+scWidth);
//svgimgの内容を表示
//console.log("globals.svgimg = " + globals.svgimg);
//console.log("globals.svgsvg = " + globals.svgsvg);
/*
var ctx = new C2S(canvas.width,canvas.height);
    ctx.drawImage(globals.svgimg,100,0,globals.svgimg.width*0.7,globals.svgimg.height*0.7);
    console.log("ctx = " + ctx);
    var myRectangle = ctx.getSerializedSvg(true);
    console.log("myRectangle = " + myRectangle);
    //globals.pattern.loadSVG(myRectangle);
    */
/*
//OutputText(myRectangle, 'output.svg');
var b = new Blob(["\uFEFF", myRectangle]);
if (navigator.msSaveBlob) {
  navigator.msSaveOrOpenBlob(b, 'output.svg');
} else {
  var a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  //a.setAttribute('download', 'output.svg');
  //a.dispatchEvent(new CustomEvent('click'));
  globals.pattern.loadSVG(a.href);
}
console.log('ended');
*/
/*
var fs = nodejs.require("fs");
//var text = myRectangle;
// 非同期で行う場合
fs.writeFile('output.svg', myRectangle, (err, data) => {
  if(err){
    console.log(err);
  }else{
    console.log('write end');
    console.log('and loading svg');
    globals.pattern.loadSVG(fs);
  }
});
*/
/*
var fs = WScript.CreateObject("Scripting.FileSystemObject");
var file = fs.CreateTextFile("output.svg");
file.Write(myRectangle);
file.Close();
globals.pattern.loadSVG(fs);
*/

/*
function OutputText(text, fileName) {
  var b = new Blob(["\uFEFF", text]);
  if (navigator.msSaveBlob) {
      navigator.msSaveOrOpenBlob(b, fileName);
  } else {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.setAttribute('download', fileName);
      a.dispatchEvent(new CustomEvent('click'));
  }
}
*/