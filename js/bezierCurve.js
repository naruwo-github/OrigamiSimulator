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
        for(var i = 0; i < dragList.length - 1; i++){
            var co1 = dragList[i];
            var co2 = dragList[i+1];
            distanceAll += dist(co1[0],co1[1],co2[0],co2[1]);
        }

        var distBetweenCP = distanceAll / 3.0;
        var distanceTmp = 0.0;
        var x2 = 0,y2 = 0,x3 = 0,y3 = 0;
        for(var i = 0; i < dragList.length - 1; i++){
            var co1 = dragList[i];
            var co2 = dragList[i+1];
            distanceTmp += dist(co1[0],co1[1],co2[0],co2[1]);

            if(distanceTmp + 5 > distBetweenCP && distanceTmp - 5 < distBetweenCP){
                x2 = co1[0];
                y2 = co1[1];
            }
            
            if(distanceTmp + 5 > distBetweenCP * 2.0 && distanceTmp - 5 < distBetweenCP * 2.0){
                x3 = co1[0];
                y3 = co1[1];
            }
        }

        if(x2 > 0 && y2 > 0 && x3 > 0 && y3 > 0){
            var co1 = dragList[0];
            var co4 = dragList[dragList.length - 1];
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

    //線分の交差判定を行うメソッド
    //線分abとcdが交差しているかどうか
    function judgeIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
        var ta = (cx - dx) * (ay - cy) + (cy - dy) * (cx - ax);
        var tb = (cx - dx) * (by - cy) + (cy - dy) * (cx - bx);
        var tc = (ax - bx) * (cy - ay) + (ay - by) * (ax - cx);
        var td = (ax - bx) * (dy - ay) + (ay - by) * (ax - dx);
        //return tc * td < 0 && ta * tb < 0; // 端点を含まない場合
        return tc * td <= 0 && ta * tb <= 0; // 端点を含む場合
    }

    //こっち端点含まないやつ
    function judgeIntersect2(ax, ay, bx, by, cx, cy, dx, dy) {
        var ta = (cx - dx) * (ay - cy) + (cy - dy) * (cx - ax);
        var tb = (cx - dx) * (by - cy) + (cy - dy) * (cx - bx);
        var tc = (ax - bx) * (cy - ay) + (ay - by) * (ax - cx);
        var td = (ax - bx) * (dy - ay) + (ay - by) * (ax - dx);
        return tc * td < 0 && ta * tb < 0; // 端点を含まない場合
        //return tc * td <= 0 && ta * tb <= 0; // 端点を含む場合
    }

    //4点P1~P4に対して、2直線P1P3、P2P4の交点の座標を求める関数
    //P1~P4はそれぞれ(x1,y1)~(x4,y4)で与えるものとする
    function getIntersectPoint(x1,y1,x2,y2,x3,y3,x4,y4){
        var S1 = (x4-x2)*(y1-y2) - (y4-y2)*(x1-x2);
        var S2 = (x4-x2)*(y2-y3) - (y4-y2)*(x2-x3);
        var rx = x1 + (x3-x1) * S1 / (S1+S2);
        var ry = y1 + (y3-y1) * S1 / (S1+S2);
        return [rx, ry];
    }

    //座標列(info.x1,info.y1)または(info.x2,info.y2)の中から
    //(ex,ey)から最短の座標(nx,ny)を返すメソッド
    function returnNearCoordinates(info,ex,ey){
        console.log(info);
        var nx,ny;
        var distance = 10000;
        var tmp = 10000;
        var index = [10000,10000];//0番目が1,2どっちか、1番目がiを表す
        for(var i = 0; i < info.stroke.length; i++){
            distance = dist(info.x1[i],info.y1[i],ex,ey);
            if(tmp > distance){
                tmp = distance;
                index[0] = 1;
                index[1] = i;
            }
            distance = dist(info.x2[i],info.y2[i],ex,ey);
            if(tmp > distance){
                tmp = distance;
                index[0] = 2;
                index[1] = i;
            }
        }
        if(index[0] == 1){
            nx = info.x1[index[1]];
            ny = info.y1[index[1]];
        }else{
            nx = info.x2[index[1]];
            ny = info.y2[index[1]];
        }
        return [nx, ny];//最短の座標。x1かx2かの情報はいらないよね？
    }

    return {
        drawBezier: drawBezier,
        defineBeziPoint: defineBeziPoint,
        dist: dist,
        judgeIntersect: judgeIntersect,
        judgeIntersect2: judgeIntersect2,
        getIntersectPoint: getIntersectPoint,
        returnNearCoordinates: returnNearCoordinates
    }
}