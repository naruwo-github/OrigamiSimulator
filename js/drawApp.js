//
/*
アプローチ
①キャンバス上に入力した線群を、patternsの要素に追加
②キャンバスを使わないことを考慮し、まずは展開図を表示してみる
③とりあえず展開図に修正を加えた結果は、svgとして再入力させる
④修正を加えた結果を部分的に追加する
*/
//

function initDrawApp(globals){
  
  //クリックした座標を格納する配列
  var cooX = new Array();
  var cooY = new Array();

  //キャンバスを取得
  const canvas = document.querySelector('#draw-area');

  //描画の準備のためcontextを取得
  const context = canvas.getContext('2d');
  //let currentColor = '#000000';

  //初期クリックを判定するカウンタ
  var counter = 0;

  //直線モードのon-off
  var straight = false;
  //色変更対象の直線ボタン
  var slineButton = document.getElementById("sline-button");
  var buttonColor = slineButton.style.backgroundColor;

  //スクリーンの高さを取得
  //var scHeight = screen.height;
  //var scWidth = screen.width;

  //canvasの大きさをwindowと同じにする
  $('#draw-area').attr('width', $(window).width());
  $('#draw-area').attr('height', $(window).height());
  //$('#draw-area').get(0).width = $(window).width();
  //$('#draw-area').get(0).height = $(window).height();

  //canvas内のクリック判定
  canvas.addEventListener("click", e => {
    if(straight === true){//直線ツールがON!!
      cooX.push(event.layerX);
      cooY.push(event.layerY);
      //四角形をプロットする
      context.fillRect(event.offsetX,event.offsetY,5,5);
      //context.fillRect(event.layerX,event.layerY,5,5);
    }else{
      $('#draw-area').attr('width', $(window).width());
      $('#draw-area').attr('height', $(window).height());
      //$('#draw-area').attr('width', globals.svgimg.width);
      //$('#draw-area').attr('height', globals.svgimg.height);

      //$('#draw-area').get(0).width = globals.svgimg.width;
      //$('#draw-area').get(0).height = globals.svgimg.height;
      //描画
      //context.drawImage(globals.svgimg,400,100,globals.svgimg.width,globals.svgimg.height);
      context.drawImage(globals.svgimg,100,100,canvas.width,canvas.height);
      
      var foldInfo = globals.foldfold;
      console.log(foldInfo);
    }
    globals.simulationRunning = true;
  })

  /*
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

  var timeoutId;
  window.addEventListener("resize", function() {
    // リサイズを停止して500ms後に終了とする
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
      // 処理内容
      $('#draw-area').attr('width', $(window).width());
      $('#draw-area').attr('height', $(window).height());
      //$('#draw-area').attr('width', globals.svgimg.width);
      //$('#draw-area').attr('height', globals.svgimg.height);

      //$('#draw-area').get(0).width = globals.svgimg.width;
      //$('#draw-area').get(0).height = globals.svgimg.height;
      //context.drawImage(globals.svgimg,400,100,globals.svgimg.width,globals.svgimg.height);
      context.drawImage(globals.svgimg,100,100,canvas.width,canvas.height);
    },50);
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
  });

  //svg出力ボタンが押された時の処理
  document.getElementById("to-svg").addEventListener("click", function(){
    console.log("converting to svg...");
  });
}

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