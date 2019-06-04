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
  var readerData = new FileReader();

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

     //console.log("svgFile");
     //console.log(globals.svgFile);
     readerFile.readAsText(globals.svgFile);                    //svgファイルをテキストで取得
     readerFile.onload = function(ev){
       //console.log(readerFile.result);
     }
     readerData.readAsDataURL(globals.svgFile);               //dataurlでsvgファイルを取得
     readerData.onload = function(ev){
       //console.log(readerData.result);
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
    //ここに、シミュレーターに作成した展開図を投げるように記述する
    //---------------------------------------
    //svgを用いる方法
    //var svg = globals.svgsvg;
    //console.log(svg.children);
    //appendSvgChild(svg,cooX,cooY);
    //$("#svgViewer").html(svg);
    //$("#svgViewer").html(globals.svgFile.children);
    var svgfile = globals.svgFile;

    //console.log(svgfile);
    //Go! Simulation!
    globals.importer.simulateAgain(globals.svgFile,cooX,cooY);
    //console.log(globals.svgFile.children);
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

  function appendSvgChild(svgfile,cox,coy){
    var ns = 'http://www.w3.org/2000/svg';
    for(var i = 0; i < cox.length; i+=2){
      var line = document.createElementNS(ns, 'line');
      line.setAttribute('stroke', "#ff0");
      line.setAttribute('opacity', "1");
      line.setAttribute('x1', cox[i]);
      line.setAttribute('y1', coy[i]);
      line.setAttribute('x2', cox[i+1]);
      line.setAttribute('y2', coy[i+1]);
      line.setAttribute('stroke-width', "3");
      console.log("AppendChild!!")
      svgfile.appendChild(line);
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


//以下今まで使っていたコードたち
/*
    //ダウンロード方法その１
    var text = readerFile.result;
    var blob = new Blob([text], {type: "text/plain"}); // バイナリデータを作ります。
    // IEか他ブラウザかの判定
    if(window.navigator.msSaveBlob) {
      // IEなら独自関数を使います。
      window.navigator.msSaveBlob(blob, "ファイル名.txt");
    } else {
      // それ以外はaタグを利用してイベントを発火させます
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.target = '_blank';
      a.download = 'ファイル名.txt';
      a.click();
    }
    URL.revokeObjectURL();
    */
//foldの方
    //globals.pattern.setFoldData(foldInfo);
    //foldInfo = globals.pattern.getFoldData(true);
    //var a = [100,100];
    //var b = [500,500];
    //foldInfo.edges_vertices.push([a,b]);
    //foldInfo.edges_assignment.push("F");
    //foldInfo.edges_foldAngles.push(0);
    //var allCreaseParams = globals.pattern.setFoldData(foldInfo, true);
    //globals.model.buildModel(foldInfo, allCreaseParams);
//foldInfo = globals.foldfold;                      //foldDataの取得
     //foldInfo = globals.pattern.getFoldData(true);
     //log
     /*
     console.log("foldData");
     console.log(foldInfo);
     console.log("foldData.vertices_coords");
     console.log(foldInfo.vertices_coords);
     console.log("foldData.edges_vertices");
     console.log(foldInfo.edges_vertices);
     console.log("foldData.edges_assignment");
     console.log(foldInfo.edges_assignment);
     console.log("foldData.edges_foldAngles");
     console.log(foldInfo.edges_foldAngles);
     console.log("foldData.vertices_vertices");
     console.log(foldInfo.vertices_vertices);
     console.log("foldData.faces_vertices");
     console.log(foldInfo.faces_vertices);
     console.log("foldData.vertices_edges");
     console.log(foldInfo.vertices_edges);
     */
/*
      var svgsvg = new FileReader();
      var file = globals.svgimg.src;
      var filename = file.match(".+/(.+?)([\?#;].*)?$")[1];
      console.log(filename);
      */
/*
      $('#draw-area').attr('width', globals.svgimg.width);  //canvasリサイズ
      $('#draw-area').attr('height', globals.svgimg.height);
      //$('#draw-area').get(0).width = globals.svgimg.width;
      //$('#draw-area').get(0).height = globals.svgimg.height;

      //svg元の大きさで描画
      context.drawImage(globals.svgimg,400,100,globals.svgimg.width,globals.svgimg.height);
      */
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