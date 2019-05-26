function initDrawApp(globals){
  var cooX = new Array();
  var cooY = new Array();
  const canvas = document.querySelector('#draw-area');
  const context = canvas.getContext('2d');
  let currentColor = '#000000';
  var counter = 0;
  var scHeight = screen.height;
  var scWidth = screen.width;
  $('#draw-area').get(0).width = $(window).width();
  $('#draw-area').get(0).height = $(window).height();

  //canvas内のクリック判定
  canvas.addEventListener("click", e => {
    if(globals.navMode === "drawapp") {
      cooX.push(event.layerX);
      cooY.push(event.layerY);
      //クリックした画面の座標
      console.log("(layerx, layery) : ("+event.layerX+", "+event.layerY+")");
      //canvasの左上を(0,0)とした時の座標
      console.log("(offsetx, offsety) : ("+event.offsetX+", "+event.offsetY+")");
      //四角形をプロットする
      context.fillRect(event.offsetX,event.offsetY,5,5);
      context.fillRect(event.layerX,event.layerY,5,5);
      //スクリーンの大きさをログに表示
      console.log(scHeight+" , "+scWidth);
      //色を白に
      context.fillStyle = 'rgb(255,255,255)';
      //canvasを白で塗りつぶす = clear
      context.fillRect(0,0,canvas.width,canvas.height);
      //svgを画像としてキャンバス内に表示する
      //context.drawImage(globals.svgimg,0,0,canvas.width,canvas.height);
      context.drawImage(globals.svgimg,0,0,globals.svgimg.width,globals.svgimg.height);
      //シミュレートが止まらないようにする
      globals.simulationRunning = true;
    }
    /*
    //マウスの座標をキャンバスの座標と合わせる
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    */
  })
  /*
  window.addEventListener('click', function(event){
    if(globals.navMode === "drawapp" && counter > 0){
        //console.log("drawapp now!!");
        cooX.push(event.layerX);
        cooY.push(event.layerY);
        console.log("(layerx, layery) : ("+event.layerX+", "+event.layerY+")");
        console.log("(offsetx, offsety) : ("+event.offsetX+", "+event.offsetY+")");
        context.fillRect(event.offsetX,event.offsetY,5,5);
    }else{
        //console.log("clicked!!");
    }
    counter++;
  },false);
  */
}