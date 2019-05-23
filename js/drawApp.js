function initDrawApp(globals){
  var cooX = new Array();
  var cooY = new Array();
  const canvas = document.querySelector('#draw-area');
  const context = canvas.getContext('2d');
  let currentColor = '#000000';
  var counter = 0;

  //canvas内のクリック判定
  canvas.addEventListener("click", e => {
    if(globals.navMode === "drawapp") {
      cooX.push(event.layerX);
      cooY.push(event.layerY);
      console.log("(layerx, layery) : ("+event.layerX+", "+event.layerY+")");
      console.log("(offsetx, offsety) : ("+event.offsetX+", "+event.offsetY+")");
      //layerでなくoffsetを使うことでずれをなくす
      //context.fillRect(event.offsetX,event.offsetY,5,5);
      //context.fillRect(event.layerX,event.layerY,5,5);
      console.log(globals.svgsvg);
      
      context.drawImage(globals.svgsvg,0,0,1050,1050);
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