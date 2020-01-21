/*
* Created by narumi nogawa on 1/21/20.
*/

function initGrids(globals) {
    //格子を描画する
    function drawGrid(mode, gridnumber, list, ctx, color, array) {
        const lines = gridnumber;
        for (let index = 0; index < array.length; index+=4) {
            const element0 = array[index];
            const element1 = array[index+1];
            const element2 = array[index+2];
            const element3 = array[index+3];
            const vectorP0 = new THREE.Vector2(element0[0], element0[1]);
            const vectorP1 = new THREE.Vector2(element1[0], element1[1]);
            const vectorP2 = new THREE.Vector2(element2[0], element2[1]);
            const vectorP3 = new THREE.Vector2(element3[0], element3[1]);
            const vectorP0P1 = new THREE.Vector2(vectorP1.x-vectorP0.x, vectorP1.y-vectorP0.y);
            const vectorP1P2 = new THREE.Vector2(vectorP2.x-vectorP1.x, vectorP2.y-vectorP1.y);
            const vectorP2P3 = new THREE.Vector2(vectorP3.x-vectorP2.x, vectorP3.y-vectorP2.y);
            const vectorP3P0 = new THREE.Vector2(vectorP0.x-vectorP3.x, vectorP0.y-vectorP3.y);
            vectorP0P1.divideScalar(lines);
            vectorP1P2.divideScalar(lines);
            vectorP2P3.divideScalar(lines);
            vectorP3P0.divideScalar(lines);

            if (mode == 0) {
                //正方グリッド
                for (let index = 1; index < lines; index++) {
                    //縦方向
                    var start = [vectorP0.x+vectorP0P1.x*index, vectorP0.y+vectorP0P1.y*index];
                    var end = [vectorP2.x+vectorP2P3.x*(lines-index), vectorP2.y+vectorP2P3.y*(lines-index)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    //横方向
                    start = [vectorP1.x+vectorP1P2.x*index, vectorP1.y+vectorP1P2.y*index];
                    end = [vectorP3.x+vectorP3P0.x*(lines-index), vectorP3.y+vectorP3P0.y*(lines-index)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 1) {
                //直線×斜め１
            } else if (mode == 2) {
                //直線×斜め２
            } else if (mode == 3) {
                //斜め１×直線
            } else if (mode == 4) {
                //斜め２×直線
            } else if (mode == 5) {
                //斜め１×斜め２
            }
        }
    }

    return {
        drawGrid: drawGrid,
    }
}