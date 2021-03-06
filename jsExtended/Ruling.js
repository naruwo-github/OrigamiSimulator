/*
* Created by narumi nogawa on 12/17/19.
*/
//Ruling描画関連のメソッドをまとめたファイル

function initRulings(globals) {

  //入力曲線(4 control points)からRulingを求めるメソッド
  function findBezierRuling(rulingNum,startEndInformation,outputList,ctx,curvelen,x1,y1,x2,y2,x3,y3,x4,y4){
    ctx.strokeStyle = "rgb(100,100,100)";                    //描画の色
    ctx.lineWidth = 2;                                      //描画する線の太さ

    //rulingの始点群と終点群の情報を保存するリストに格納するリスト
    var childStartEndInformation = new Array();

    var tmpbunkatsu = 1;                                    //何番目の分割点か？
    var tmpdist = 0.0;                                      //現在の距離の合計
    var bunkatsu = rulingNum;
    var dividedPoints = parseInt(curvelen)/bunkatsu;
    for(var t = 0.0; t <= 1.0 - 0.001; t += 0.001){
      var tt = t + 0.001;
      var bpx1 = Math.pow((1-t),3)*x1+3*t*Math.pow((1-t),2)*x2+3*(1-t)*Math.pow(t,2)*x3+Math.pow(t,3)*x4;
      var bpy1 = Math.pow((1-t),3)*y1+3*t*Math.pow((1-t),2)*y2+3*(1-t)*Math.pow(t,2)*y3+Math.pow(t,3)*y4;
      var bpx2 = Math.pow((1-tt),3)*x1+3*tt*Math.pow((1-tt),2)*x2+3*(1-tt)*Math.pow(tt,2)*x3+Math.pow(tt,3)*x4;
      var bpy2 = Math.pow((1-tt),3)*y1+3*tt*Math.pow((1-tt),2)*y2+3*(1-tt)*Math.pow(tt,2)*y3+Math.pow(tt,3)*y4;
      tmpdist += dist(bpx1,bpy1,bpx2,bpy2);
      if(parseInt(tmpdist)-1 <= dividedPoints*tmpbunkatsu && parseInt(tmpdist)+1 >= dividedPoints*tmpbunkatsu){
        console.log("Reached Here!!");
        var start = new THREE.Vector2(bpx1,bpy1);
        var end = new THREE.Vector2(bpx2,bpy2);
        var svec = end.sub(start);
        var hvec = new THREE.Vector2(svec.y,-svec.x);
        hvec.normalize();

        //以下可展面内にrulingを伸ばす操作
        //線群の交差判定を用い交点を検出する操作
        var rux1 = bpx1+hvec.x*1000;
        var ruy1 = bpy1+hvec.y*1000;
        var rux2 = bpx1-hvec.x*1000;
        var ruy2 = bpy1-hvec.y*1000;

        var rulingStart = new Array();
        var rulingEnd = new Array();

        //交差判定を行う
        for(var i = 0; i < globals.svgInformation.stroke.length; i++){
          //法線方向に伸ばした時に交差しているかどうか
          if(globals.beziercurve.judgeIntersect(bpx1,bpy1,rux1,ruy1,
            globals.svgInformation.x1[i],globals.svgInformation.y1[i],globals.svgInformation.x2[i],globals.svgInformation.y2[i])){
              rulingEnd.push(globals.beziercurve.getIntersectPoint(bpx1,bpy1,globals.svgInformation.x1[i],globals.svgInformation.y1[i],
                rux1,ruy1,globals.svgInformation.x2[i],globals.svgInformation.y2[i]));
            }
          if(globals.beziercurve.judgeIntersect(bpx1,bpy1,rux2,ruy2,
              globals.svgInformation.x1[i],globals.svgInformation.y1[i],globals.svgInformation.x2[i],globals.svgInformation.y2[i])){
                rulingStart.push(globals.beziercurve.getIntersectPoint(bpx1,bpy1,globals.svgInformation.x1[i],globals.svgInformation.y1[i],
                  rux2,ruy2,globals.svgInformation.x2[i],globals.svgInformation.y2[i]));
            }
        }

        //Start,Endの要素の中から、それぞれ(bpx1,bpy1)に最短なものを選びそれらを結んだのがrulingとなる
        var tmpDist = 1000;
        for(var i = 0; i < rulingStart.length; i++){
          var s = rulingStart[i];
          for(var j = 0; j < rulingEnd.length; j++){
            var e = rulingEnd[j];
            if(tmpDist > dist(s[0],s[1],e[0],e[1])){
              tmpDist = dist(s[0],s[1],e[0],e[1]);
              rux1 = s[0];
              ruy1 = s[1];
              rux2 = e[0];
              ruy2 = e[1];
            }
          }
        }

        //canvas上へ描画するやーつ
        ctx.strokeStyle = "rgb(0,255,0)";
        ctx.beginPath();
        ctx.moveTo(parseInt(rux1), parseInt(ruy1));
        ctx.lineTo(parseInt(rux2), parseInt(ruy2));
        ctx.closePath();
        ctx.stroke();

        //rulingを出力のために格納する
        outputList.push([parseInt(rux1), parseInt(ruy1)]);
        outputList.push([parseInt(rux2), parseInt(ruy2)]);

        childStartEndInformation.push([[parseInt(rux1), parseInt(ruy1)], [parseInt(rux2), parseInt(ruy2)]]);

        tmpbunkatsu++;
      }
    }
    
    startEndInformation.push(childStartEndInformation);
  }


  function findSplineRuling(rulingnum,startEndInformation,outputList,ctx,curvelen,spline){
      //rulingの[始点,終点]群を保存するリスト
      var childStartEndInformation = new Array();
      var tmpbunkatsu = 1;
      var tmpdist = 0.0;
      var bunkatsu = rulingnum;
      var dividedPoints = parseInt(curvelen)/bunkatsu;
      for(var t = 0.0; t < 1.0; t += 0.001){
        var p1 = spline.calcAt(t);
        var p2 = spline.calcAt(t+0.001);
        tmpdist += dist(p1[0],p1[1],p2[0],p2[1]);
  
        if(parseInt(tmpdist) - 2 <= dividedPoints * tmpbunkatsu && parseInt(tmpdist) + 2 >= dividedPoints * tmpbunkatsu){
          var start = new THREE.Vector2(p1[0],p1[1]);
          var end = new THREE.Vector2(p2[0],p2[1]);
          var tangentVec = end.sub(start);
          var normalVec = new THREE.Vector2(tangentVec.y, -tangentVec.x);
          normalVec.normalize();
  
          var rux1 = p1[0] + normalVec.x * 1000;
          var ruy1 = p1[1] + normalVec.y * 1000;
          var rux2 = p2[0] - normalVec.x * 1000;
          var ruy2 = p2[1] - normalVec.y * 1000;
  
          var rulingStart = new Array();
          var rulingEnd = new Array();
  
          //交差判定を行う
          for(var i = 0; i < globals.svgInformation.stroke.length; i++){
            //法線方向に伸ばした時に交差しているかどうか
            if(globals.beziercurve.judgeIntersect(p1[0],p1[1],rux1,ruy1,
              globals.svgInformation.x1[i],globals.svgInformation.y1[i],globals.svgInformation.x2[i],globals.svgInformation.y2[i])){
                rulingEnd.push(globals.beziercurve.getIntersectPoint(p1[0],p1[1],globals.svgInformation.x1[i],globals.svgInformation.y1[i],
                  rux1,ruy1,globals.svgInformation.x2[i],globals.svgInformation.y2[i]));
              }
            if(globals.beziercurve.judgeIntersect(p1[0],p1[1],rux2,ruy2,
                globals.svgInformation.x1[i],globals.svgInformation.y1[i],globals.svgInformation.x2[i],globals.svgInformation.y2[i])){
                  rulingStart.push(globals.beziercurve.getIntersectPoint(p1[0],p1[1],globals.svgInformation.x1[i],globals.svgInformation.y1[i],
                    rux2,ruy2,globals.svgInformation.x2[i],globals.svgInformation.y2[i]));
              }
          }
  
          var tmpDist = 1000;
          for(var i = 0; i < rulingStart.length; i++){
            var s = rulingStart[i];
            for(var j = 0; j < rulingEnd.length; j++){
              var e = rulingEnd[j];
              if(tmpDist > dist(s[0],s[1],e[0],e[1])){
                tmpDist = dist(s[0],s[1],e[0],e[1]);
                rux1 = s[0];
                ruy1 = s[1];
                rux2 = e[0];
                ruy2 = e[1];
              }
            }
          }
          ctx.strokeStyle = "rgb(0,255,0)";
          ctx.beginPath();
          ctx.moveTo(parseInt(rux1), parseInt(ruy1));
          ctx.lineTo(parseInt(rux2), parseInt(ruy2));
          ctx.closePath();
          ctx.stroke();
  
          outputList.push([parseInt(rux1), parseInt(ruy1)]);
          outputList.push([parseInt(rux2), parseInt(ruy2)]);
  
          childStartEndInformation.push([[parseInt(rux1), parseInt(ruy1)], [parseInt(rux2), parseInt(ruy2)]]);
  
          tmpbunkatsu++;
        }
      }
      startEndInformation.push(childStartEndInformation);
  }


  //ruling vertex use
  function drawRulingVertexUse(ru2array,ctx,outputList) {
    if(ru2array.length > 0){
      ctx.strokeStyle = "rgb(50,200,255)";
      for(var i = 0; i < ru2array.length; i++){
        var aaa = ru2array[i];
        ctx.beginPath();
        ctx.arc(aaa[0], aaa[1], 10, 10 * Math.PI / 180, 80 * Math.PI / 180, true);
        ctx.closePath();
        ctx.stroke();
      }

      if(ru2array.length > 2){
        //点Pi、Pi+1、Pi+2について
        //直線Pi+1(Pi + Pi+2)/2 を描画する
        for(var i = 0; i < ru2array.length - 2; i++){
          var P0 = ru2array[i];
          var P1 = ru2array[i+1];
          var P2 = ru2array[i+2];
          var P3 = [(P0[0] + P2[0])/2, (P0[1] + P2[1])/2];

          var vecP0 = new THREE.Vector2(P0[0], P0[1]);
          var vecP1 = new THREE.Vector2(P1[0], P1[1]);
          var vecP2 = new THREE.Vector2(P2[0], P2[1]);
          var vecP3 = new THREE.Vector2(P3[0], P3[1]);
          var vecP0P2 = new THREE.Vector2(vecP2.x - vecP0.x, vecP2.y - vecP0.y);
          var vecP1P3 = vecP3.sub(vecP1);
          vecP0P2.normalize();
          normalP0P2 = new THREE.Vector2(vecP0P2.y, -vecP0P2.x);
          vecP1P3.normalize();
　
          //上方向
          var vecUp = new THREE.Vector2(vecP1.x + 1000 * normalP0P2.x, vecP1.y + 1000 * normalP0P2.y);
          //下方向
          var vecDown = new THREE.Vector2(vecP1.x - 1000 * normalP0P2.x, vecP1.y - 1000 * normalP0P2.y);

          var rulingStart = new Array();
          var rulingEnd = new Array();

          //交差判定を行う
          for(var j = 0; j < globals.svgInformation.stroke.length; j++){
            //上方向
            if(globals.beziercurve.judgeIntersect2(vecP1.x,vecP1.y,vecUp.x,vecUp.y,
              globals.svgInformation.x1[j],globals.svgInformation.y1[j],globals.svgInformation.x2[j],globals.svgInformation.y2[j])){
                rulingEnd.push(globals.beziercurve.getIntersectPoint(vecP1.x,vecP1.y,globals.svgInformation.x1[j],globals.svgInformation.y1[j],
                vecUp.x,vecUp.y,globals.svgInformation.x2[j],globals.svgInformation.y2[j]));
            }
            //下方向
            if(globals.beziercurve.judgeIntersect2(vecP1.x,vecP1.y,vecDown.x,vecDown.y,
              globals.svgInformation.x1[j],globals.svgInformation.y1[j],globals.svgInformation.x2[j],globals.svgInformation.y2[j])){
                rulingStart.push(globals.beziercurve.getIntersectPoint(vecP1.x,vecP1.y,globals.svgInformation.x1[j],globals.svgInformation.y1[j],
                vecDown.x,vecDown.y,globals.svgInformation.x2[j],globals.svgInformation.y2[j]));
            }
          }

          //Start,Endの要素の中から、それぞれ(bpx1,bpy1)に最短なものを選びそれらを結んだのがrulingとなる
          var tmpDist = 1000;
          var startx = 0;
          var starty = 0;
          var endx = 0;
          var endy = 0;
          for(var j = 0; j < rulingStart.length; j++){
            var s = rulingStart[j];
            for(var k = 0; k < rulingEnd.length; k++){
              var e = rulingEnd[k];
              if(tmpDist > dist(s[0],s[1],e[0],e[1])
              && s[0] != parseInt(vecP1.x) && s[1] != parseInt(vecP1.y)
              && e[0] != parseInt(vecP1.x) && e[1] != parseInt(vecP1.y)){
                tmpDist = dist(s[0],s[1],e[0],e[1]);
                startx = s[0];
                starty = s[1];
                endx = e[0];
                endy = e[1];
              }
            }
          }

          //いざ描画!!
          ctx.strokeStyle = "rgb(0,255,0)";
          ctx.beginPath();
          ctx.moveTo(parseInt(startx), parseInt(starty));
          ctx.lineTo(parseInt(endx), parseInt(endy));
          ctx.closePath();
          ctx.stroke();

          //rulingを出力のために格納する
          outputList.push([parseInt(startx), parseInt(starty)]);
          outputList.push([parseInt(endx), parseInt(endy)]);
        }
      }
    }
  }

  //extend rulingのその2
  function extendRulings(optimizedRuling,ctx,startEndInformation) {
    var regionNum = startEndInformation.length;

    //----------------------------------------------------------
    //最後の可展面領域から最初の可展面領域に向けて〜
    for(var i = regionNum-1; i > 0; i--){
      var element = startEndInformation[i];
      for(j = 0; j < element.length; j++){
        var coo = element[j];
        //延長開始点の座標は(start[0],start[1])
        var start = coo[0];

        var startX = start[0];
        var startY = start[1];
        //延長処理を以下に記述
        for(var k = i-1; k >= 0; k--){
          var nextElement = startEndInformation[k];
          var tmpDist = 10000;
          var index = 10000;
          for(var l = 0; l < nextElement.length; l++){
            var nl = nextElement[l];
            var end = nl[1];
            if(tmpDist > dist(startX,startY,end[0],end[1])){
              tmpDist = dist(startX,startY,end[0],end[1]);
              index = l;
            }
          }

          var next = nextElement[index];
          var nextStart = next[0];
          var nextEnd = next[1];

          var vecEndToStart = new THREE.Vector2(nextStart[0] - nextEnd[0], nextStart[1] - nextEnd[1]);
          vecEndToStart.normalize();
          var extendedPoint = new THREE.Vector2(startX + vecEndToStart.x * 1000, startY + vecEndToStart.y * 1000);

          //交差判定で交点を求める
          var intersected = new Array();
          for(var l = 0; l < globals.svgInformation.stroke.length; l++){
            //法線方向に伸ばした時に交差しているかどうか
            if(globals.beziercurve.judgeIntersect(startX + vecEndToStart.x * 10, startY + vecEndToStart.y * 10, extendedPoint.x, extendedPoint.y,
            globals.svgInformation.x1[l], globals.svgInformation.y1[l], globals.svgInformation.x2[l], globals.svgInformation.y2[l])){
              intersected.push(globals.beziercurve.getIntersectPoint(startX, startY, globals.svgInformation.x1[l], globals.svgInformation.y1[l],
              extendedPoint.x, extendedPoint.y, globals.svgInformation.x2[l], globals.svgInformation.y2[l]));
            }
          }

          //interesectedの要素の中から、(startX, startY)に最短なものを選び
          //それらを結んだものが最適化されたruling
          var extraX = 10000;
          var extraY = 10000;
          var tmpDist = 1000;
          for(var l = 0; l < intersected.length; l++){
            var is = intersected[l];
            if(tmpDist > dist(startX, startY, is[0], is[1])){
              tmpDist = dist(startX, startY, is[0], is[1]);
              extraX = is[0];
              extraY = is[1];
            }
          }
          if(extraX != 10000){
            //canvas上描画するやーつ
            ctx.strokeStyle = "rgb(0,0,0)";
            ctx.beginPath();
            ctx.moveTo(parseInt(startX), parseInt(startY));
            ctx.lineTo(parseInt(extraX), parseInt(extraY));
            ctx.closePath();
            ctx.stroke();

            //保存
            optimizedRuling.push([parseInt(startX), parseInt(startY)]);
            optimizedRuling.push([parseInt(extraX), parseInt(extraY)]);
          }

          //終点が次の始点となる
          startX = extraX;
          startY = extraY;
        }

      }
    }
    //----------------------------------------------------------

    //----------------------------------------------------------
    //最初の可展面領域から最後の可展面領域に向けて〜
    for(var i = 0; i < regionNum-1; i++){
      var element = startEndInformation[i];
      for(j = 0; j < element.length; j++){
        var coo = element[j];
        //延長開始点の座標は(start[0],start[1])
        var end = coo[1];

        var endX = end[0];
        var endY = end[1];
        //延長処理を以下に記述
        for(var k = i+1; k <= regionNum-1; k++){
          var nextElement = startEndInformation[k];
          var tmpDist = 10000;
          var index = 10000;
          for(var l = 0; l < nextElement.length; l++){
            var nl = nextElement[l];
            var start = nl[0];
            if(tmpDist > dist(endX,endY,start[0],start[1])){
              tmpDist = dist(endX,endY,start[0],start[1]);
              index = l;
            }
          }

          var next = nextElement[index];
          var nextStart = next[0];
          var nextEnd = next[1];

          var vecStartToEnd = new THREE.Vector2(nextEnd[0] - nextStart[0], nextEnd[1] - nextStart[1]);
          vecStartToEnd.normalize();
          var extendedPoint = new THREE.Vector2(endX + vecStartToEnd.x * 1000, endY + vecStartToEnd.y * 1000);

          //交差判定で交点を求める
          var intersected = new Array();
          for(var l = 0; l < globals.svgInformation.stroke.length; l++){
            //法線方向に伸ばした時に交差しているかどうか
            if(globals.beziercurve.judgeIntersect(endX + vecStartToEnd.x * 10, endY + vecStartToEnd.y * 10, extendedPoint.x, extendedPoint.y,
            globals.svgInformation.x1[l], globals.svgInformation.y1[l], globals.svgInformation.x2[l], globals.svgInformation.y2[l])){
              intersected.push(globals.beziercurve.getIntersectPoint(endX, endY, globals.svgInformation.x1[l], globals.svgInformation.y1[l],
              extendedPoint.x, extendedPoint.y, globals.svgInformation.x2[l], globals.svgInformation.y2[l]));
            }
          }

          //interesectedの要素の中から、(startX, startY)に最短なものを選び
          //それらを結んだものが最適化されたruling
          var extraX = 10000;
          var extraY = 10000;
          var tmpDist = 1000;
          for(var l = 0; l < intersected.length; l++){
            var is = intersected[l];
            if(tmpDist > dist(endX, endY, is[0], is[1])){
              tmpDist = dist(endX, endY, is[0], is[1]);
              extraX = is[0];
              extraY = is[1];
            }
          }
          if(extraX != 10000){
            //canvas上描画するやーつ
            ctx.strokeStyle = "rgb(0,0,0)";
            ctx.beginPath();
            ctx.moveTo(parseInt(endX), parseInt(endY));
            ctx.lineTo(parseInt(extraX), parseInt(extraY));
            ctx.closePath();
            ctx.stroke();

            //保存
            optimizedRuling.push([parseInt(endX), parseInt(endY)]);
            optimizedRuling.push([parseInt(extraX), parseInt(extraY)]);
          }

          //終点が次の始点となる
          endX = extraX;
          endY = extraY;
        }

      }
    }
    //----------------------------------------------------------
  }

  return {
    findBezierRuling: findBezierRuling,
    findSplineRuling: findSplineRuling,
    drawRulingVertexUse: drawRulingVertexUse,
    extendRulings: extendRulings
  }
}