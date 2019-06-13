function initBezierCurve(globals){
    //ベジェ曲線を描画する
    function drawBezier(ctx,distList,x1,y1,x2,y2,x3,y3,x4,y4){
        //4点の座標から描画するよ
        ctx.strokeStyle = "rgb(100,100,100)";
        ctx.lineWidth = 2;
        var kyori = 0.0;
        for(var t = 0.0; t <= 1.0 - 0.001; t += 0.001){
            var tt = t + 0.001;
            var bpx1 = Math.pow((1-t),3)*x1+3*t*Math.pow((1-t),2)*x2+3*(1-t)*Math.pow(t,2)*x3+Math.pow(t,3)*x4;
            var bpy1 = Math.pow((1-t),3)*y1+3*t*Math.pow((1-t),2)*y2+3*(1-t)*Math.pow(t,2)*y3+Math.pow(t,3)*y4;
            var bpx2 = Math.pow((1-tt),3)*x1+3*tt*Math.pow((1-tt),2)*x2+3*(1-tt)*Math.pow(tt,2)*x3+Math.pow(tt,3)*x4;
            var bpy2 = Math.pow((1-tt),3)*y1+3*tt*Math.pow((1-tt),2)*y2+3*(1-tt)*Math.pow(tt,2)*y3+Math.pow(tt,3)*y4;
            kyori += dist(bpx1,bpy1,bpx2,bpy2);
            ctx.beginPath();
            ctx.moveTo(parseInt(bpx1), parseInt(bpy1));
            ctx.lineTo(parseInt(bpx2), parseInt(bpy2));
            ctx.closePath();
            ctx.stroke();
        }
        distList.push(kyori);
    }

    //dragListに格納されている要素から制御点4点を求める
    //そしてbeziListに格納するメソッド
    function defineBeziPoint(dragList,beziList){
        var distanceAll = 0.0;
        for(var i = 0; i < dragList.length; i+=2){
            var co1 = dragList[i];
            var co2 = dragList[i+1];
            distanceAll += dist(co1[0],co1[1],co2[0],co2[1]);
        }
        var distBetweenCP = Math.round(distanceAll/3);
        var distanceTmp = 0.0;
        var x2,y2,x3,y3;
        for(var i = 0; i < dragList.length; i+=2){
            var co1 = dragList[i];
            var co2 = dragList[i+1];
            distanceTmp += dist(co1[0],co1[1],co2[0],co2[1]);
            if(Math.round(distanceTmp) === distBetweenCP){
                x2 = co1;
                y2 = co2;
            }else if(Math.round(distanceTmp) === distBetweenCP*2){
                x3 = co1;
                y3 = co1;
            }
        }
        if(x2 > 0 || y2 > 0 || x3 > 0 || y3 > 0){
            var co1 = dragList[0];
            var co4 = dragList[-1];
            //beziList.push([co1[0],co1[1],x2,y2,x3,y3,co4[0],co4[1]]);
            beziList.push([co1[0],co1[1]]);
            beziList.push([x2,y2]);
            beziList.push([x3,y3]);
            beziList.push([co4[0],co4[1]]);
        }
    }

    //2点間の距離を求めるメソッド
    function dist(x1,y1,x2,y2){
        return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
    }

    return {
        drawBezier: drawBezier,
        defineBeziPoint: defineBeziPoint,
        dist: dist
    }
}