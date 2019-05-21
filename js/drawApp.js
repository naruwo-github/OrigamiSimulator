function initDrawApp(globals){
  window.addEventListener('load', () => {
    const canvas = document.querySelector('#draw-area');
    const context = canvas.getContext('2d');
    const lastPosition = { x: null, y: null };
    let isDrag = false;
  
    function draw(x, y) {
      if(!isDrag) {
        return;
      }
      // MDN CanvasRenderingContext2D: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin
      context.lineCap = 'round'; // 丸みを帯びた線にする
      context.lineJoin = 'round'; // 丸みを帯びた線にする
      context.lineWidth = 5; // 線の太さ
      context.strokeStyle = 'black'; // 線の色
  
      if (lastPosition.x === null || lastPosition.y === null) {
        // ドラッグ開始時の線の開始位置
        context.moveTo(x, y);
      } else {
        // ドラッグ中の線の開始位置
        context.moveTo(lastPosition.x, lastPosition.y);
      }

      context.lineTo(x, y);
      context.stroke();
      lastPosition.x = x;
      lastPosition.y = y;
    }
  
    function clear() {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function dragStart(event) {
      context.beginPath();
  
      isDrag = true;
    }

    function dragEnd(event) {
      // 線を書く処理の終了を宣言する
      context.closePath();
      isDrag = false;
  
      // 描画中に記録していた値をリセットする
      lastPosition.x = null;
      lastPosition.y = null;
    }
  
    // マウス操作やボタンクリック時のイベント処理を定義する
    function initEventHandler() {
      const clearButton = document.querySelector('#clear-button');
      clearButton.addEventListener('click', clear);
  
      canvas.addEventListener('mousedown', dragStart);
      canvas.addEventListener('mouseup', dragEnd);
      canvas.addEventListener('mouseout', dragEnd);
      canvas.addEventListener('mousemove', (event) => {
        // eventの中の値を見たい場合は以下のようにconsole.log(event)で、
        // デベロッパーツールのコンソールに出力させると良い
        console.log(event);
  
        draw(event.layerX, event.layerY);
      });
    }
    // イベント処理を初期化する
    initEventHandler();
  });
  return;
}

/*
window.addEventListener('load', () => {
  const canvas = document.querySelector('#draw-area');
  const context = canvas.getContext('2d');

  const lastPosition = { x: null, y: null };

  let isDrag = false;
 
  function draw(x, y) {
    if(!isDrag) {
      return;
    }
    // 線の状態を定義する
    // MDN CanvasRenderingContext2D: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin
    context.lineCap = 'round'; // 丸みを帯びた線にする
    context.lineJoin = 'round'; // 丸みを帯びた線にする
    context.lineWidth = 5; // 線の太さ
    context.strokeStyle = 'black'; // 線の色
 
    // この関数(draw関数内)の最後の2行で lastPosition.xとlastPosition.yに
    // 現在のx, y座標を記録することで、次にマウスを動かした時に、
    // 前回の位置から現在のマウスの位置まで線を引くようになる。
    if (lastPosition.x === null || lastPosition.y === null) {
      // ドラッグ開始時の線の開始位置
      context.moveTo(x, y);
    } else {
      // ドラッグ中の線の開始位置
      context.moveTo(lastPosition.x, lastPosition.y);
    }
    // context.moveToで設定した位置から、context.lineToで設定した位置までの線を引く。
    // - 開始時はmoveToとlineToの値が同じであるためただの点となる。
    // - ドラッグ中はlastPosition変数で前回のマウス位置を記録しているため、
    //   前回の位置から現在の位置までの線(点のつながり)となる
    context.lineTo(x, y);
    // context.moveTo, context.lineToの値を元に実際に線を引く
    context.stroke();
    // 現在のマウス位置を記録して、次回線を書くときの開始点に使う
    lastPosition.x = x;
    lastPosition.y = y;
  }

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
 
  // マウスのドラッグを開始したらisDragのフラグをtrueにしてdraw関数内で
  // お絵かき処理が途中で止まらないようにする
  function dragStart(event) {
    context.beginPath();
 
    isDrag = true;
  }
  // マウスのドラッグが終了したら、もしくはマウスがcanvas外に移動したら
  // isDragのフラグをfalseにしてdraw関数内でお絵かき処理が中断されるようにする
  function dragEnd(event) {
    // 線を書く処理の終了を宣言する
    context.closePath();
    isDrag = false;
    // 描画中に記録していた値をリセットする
    lastPosition.x = null;
    lastPosition.y = null;
  }
 
  // マウス操作やボタンクリック時のイベント処理を定義する
  function initEventHandler() {
    const clearButton = document.querySelector('#clear-button');
    clearButton.addEventListener('click', clear);
 
    canvas.addEventListener('mousedown', dragStart);
    canvas.addEventListener('mouseup', dragEnd);
    canvas.addEventListener('mouseout', dragEnd);
    canvas.addEventListener('mousemove', (event) => {
      // eventの中の値を見たい場合は以下のようにconsole.log(event)で、
      // デベロッパーツールのコンソールに出力させると良い
      // console.log(event);
 
      draw(event.layerX, event.layerY);
    });
  }
 
  // イベント処理を初期化する
  initEventHandler();
});
*/