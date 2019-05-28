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
  $('#draw-area').get(0).width = $(window).width();
  $('#draw-area').get(0).height = $(window).height();

  //canvas内のクリック判定
  canvas.addEventListener("click", e => {
    if(counter === 0){//初回クリック時にのみ、canvas内に展開図を表示する
      counter++;
      //色を白に
      //context.fillStyle = 'rgb(255,255,255)';
      //canvasを白で塗りつぶす = clear
      //context.fillRect(0,0,canvas.width,canvas.height);
      //描画！
      context.drawImage(globals.svgimg,0,0,globals.svgimg.width,globals.svgimg.height);
    }
    if(globals.navMode === "drawapp") {
      if(straight === true){//直線ツールがON!!
        cooX.push(event.layerX);
        cooY.push(event.layerY);
        //四角形をプロットする
        context.fillRect(event.offsetX,event.offsetY,5,5);
      }
      //console.log("(layerx, layery) : ("+event.layerX+", "+event.layerY+")");
      //console.log("(offsetx, offsety) : ("+event.offsetX+", "+event.offsetY+")");
      //context.fillRect(event.layerX,event.layerY,5,5);
      //console.log(scHeight+" , "+scWidth);
      //svgimgの内容を表示
      //console.log("globals.svgimg = " + globals.svgimg);
      //console.log("globals.svgsvg = " + globals.svgsvg);
    }
    globals.simulationRunning = true;
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