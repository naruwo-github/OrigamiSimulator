/*
* Created by narumi nogawa on 10/26/20.
*/

//========================================
//===============変数定義==================
//========================================
// corsのためlocalhostで開かないと動かない
let parent = window.opener;
const globalVariable = {};
// このファイルないスコープでのグローバル変数宣言
let scene, canvasFrame, renderer, camera, sphere, controls;


//========================================
//============ライフサイクル周り=============
//========================================
document.addEventListener('DOMContentLoaded', function(e) {
    parent = window.opener; //クロスオリジン要求のため、デバッガで起動しないと動かない
    globalVariable.surfNorm = parent.globals.surfNorm;
    globalVariable.surfNormListClustered = parent.globals.surfNormListClustered;
    
    startThree();
}, false);

function startThree() {
    initThree(); //レンダラー、シーン設定
    initCamera(); //カメラ作成
    initObject(); //3D図形作成
    draw(); //描画

    tick(); //マウス入力によって視点を回転させる関数
}

function initThree() {
    canvasFrame = document.getElementById('canvas-frame');
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0x999999, 1.0);
    renderer.setSize(canvasFrame.clientWidth, canvasFrame.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (!renderer) alert('初期化失敗！');
    canvasFrame.appendChild(renderer.domElement);
    scene = new THREE.Scene();
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, canvasFrame.clientWidth / canvasFrame.clientHeight);
    camera.position.set(0, 300, 1000);
}

function initObject() {
    const axes = new THREE.AxesHelper(1000);
    scene.add(axes);
    
    addSphere();
    addNormalVectorsClustered(1);

    let orthodromePointsList = getOrthodromePoints();
    addOrthodromes(orthodromePointsList);
    let handleClusterNum = 0;
    const clusterClouds = globalVariable.surfNormListClustered[handleClusterNum];
    let closestDistance = 1000000;
    let fitIndex = 0;
    for (let index = 0; index < orthodromePointsList.length; index++) {
        const orthodromeClouds = orthodromePointsList[index];
        let tmpClosestDistance = getClosestDistanceSumFromCloudsToClouds(clusterClouds, orthodromeClouds);
        if (tmpClosestDistance < closestDistance) {
            closestDistance = tmpClosestDistance;
            fitIndex = index;
        }
    }
    // フィットする大円の頂点リスト
    let fitOrthodromePoints = orthodromePointsList[fitIndex];
}

function draw() {
    renderer.render(scene, camera);
}

// 毎フレーム時に実行されるループイベントです
function tick() {
    // マウスの位置に応じて角度を設定
    // マウスのX座標がステージの幅の何%の位置にあるか調べてそれを360度で乗算する
    const targetRotX = (mouseX / window.innerWidth) * 360;
    // const targetRotY = (mouseY / window.innerHeight) * 360;
    // イージングの公式を用いて滑らかにする
    // 値 += (目標値 - 現在の値) * 減速値
    rotX += (targetRotX - rotX) * 0.02;
    // rotY += (targetRotY - rotY) * 0.02;
    // ラジアンに変換する
    const radianX = rotX * Math.PI / 180;
    // const radianY = rotY * Math.PI / 180;
    // 角度に応じてカメラの位置を設定
    // camera.position.x = 1000 * Math.sin(radianX);
    camera.position.z = 100 * Math.cos(radianX);
    // camera.position.y = 1000 * Math.sin(radianY);

    // 原点方向を見つめる
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    draw();
    requestAnimationFrame(tick);
}


//========================================
//=======オブジェクト生成や計算処理関数========
//========================================
function addSphere() {
    const geometry = new THREE.SphereGeometry(100, 32, 32);
    const material = new THREE.MeshNormalMaterial();
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
}

function addNormalVectors() {
    // // 法線マップの描画
    // globalVariable.surfNorm.forEach(n => {
    //     n.multiplyScalar(101);
    //     let geometry = new THREE.Geometry();
    //     geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    //     geometry.vertices.push(new THREE.Vector3(n.x, n.y, n.z));
    //     let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 10}));
    //     scene.add(line);
    // });
    
    // クラスタリングされた法線マップの描画
    const clusterNum = 2;
    const colorList = [0xff0000, 0x0000ff];
    for (let index = 0; index < clusterNum; index++) {
        const cluster = globalVariable.surfNormListClustered[index];
        cluster.forEach(array => {
            let vec = new THREE.Vector3(array[0], array[1], array[2]);
            vec.multiplyScalar(100.5);
            let geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(0, 0, 0));
            geometry.vertices.push(new THREE.Vector3(vec.x, vec.y, vec.z));
            let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: colorList[index], linewidth: 10}));
            scene.add(line);
        });
    }
}

function addNormalVectorsClustered(selectedClusterNum) {
    // クラスタリングされた法線マップの描画
    const colorList = [0xff0000, 0x0000ff];
    const cluster = globalVariable.surfNormListClustered[selectedClusterNum];
    cluster.forEach(array => {
        let vec = new THREE.Vector3(array[0], array[1], array[2]);
        vec.multiplyScalar(100.5);
        let geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(vec.x, vec.y, vec.z));
        let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: colorList[selectedClusterNum], linewidth: 10}));
        scene.add(line);
    });
}

// 円の点を生成する
function getOrthodromePoints() {
    let orthodromePointsVectorList_List = [];
    // まずX軸に対する回転のループを定義
    for (let rotationAngleX = 0; rotationAngleX < 360; rotationAngleX += 60) {
        // Y軸に対する回転のループを定義
        for (let rotationAngleY = 0; rotationAngleY < 360; rotationAngleY += 60) {
            let orthodromePointsVectorList = []; // 値のリストのリスト[[x0,y0,z0], [x1,y1,z1], ...]
            // 円の座標を生成
            for (let theta = 0.0; theta < 360.0; theta+=1.0) {
                let radius = 100.1;
                let x = radius * Math.cos(theta);
                let y = radius * Math.sin(theta);
                let z = 0;
                let rotatedXVector = apply3DRotationMatrixAxisX(x, y, z, rotationAngleX);
                let rotatedXYVector = apply3DRotationMatrixAxisY(rotatedXVector.x, rotatedXVector.y, rotatedXVector.z, rotationAngleY);

                orthodromePointsVectorList.push([rotatedXYVector.x, rotatedXYVector.y, rotatedXYVector.z]);
                // let geometry = new THREE.Geometry();
                // geometry.vertices.push(new THREE.Vector3(0, 0, 0));
                // geometry.vertices.push(rotatedXYVector);
                // let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 10}));
                // scene.add(line);
            }
            orthodromePointsVectorList_List.push(orthodromePointsVectorList);
        }
    }
    return orthodromePointsVectorList_List;
}

// 試しに円の点を描画する
function addOrthodromes(orthodromePointsList) {
    let listList = orthodromePointsList;
    listList.forEach(list => {
        list.forEach(array => {
            let vec = new THREE.Vector3(array[0], array[1], array[2]);
            let geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(0, 0, 0));
            geometry.vertices.push(vec);
            let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 10}));
            scene.add(line);
        });
    });
}

// ある点群Aの各点から、ある点群Bまでの最短距離、の和を返す
function getClosestDistanceSumFromCloudsToClouds(cloudsFrom, cloudsTo) {
    let closestDistanceSum = 0;
    cloudsFrom.forEach(array => {
        closestDistanceSum += getClosestDistanceFromPointToPointClouds(array, cloudsTo);
    });
    return closestDistanceSum;
}

// 点pointから点群cloudsの最短距離を返す
function getClosestDistanceFromPointToPointClouds(point, clouds) {
    // pointは[x, y, z]、cloudsは[[x0, y0, z0], [x1, y1, z1], ...]
    let closestDistance = 100000;
    clouds.forEach(array => {
        const tmpDist = getDist3D(point[0], point[1], point[2], array[0], array[1], array[2]);
        if (tmpDist < closestDistance) {
            closestDistance = tmpDist;
        }
    });
    return closestDistance;
}

// TODO: ラインオブジェクトを追加する関数を記述する
function addLineObject(startVec, endVec, color) {
    let geometry = new THREE.Geometry();
    geometry.vertices.push(startVec);
    geometry.vertices.push(endVec);
    let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: color, linewidth: 10}));
    scene.add(line);
}

function getDist2D(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
}

function getDist3D(x0, y0, z0, x1, y1, z1) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2) + Math.pow(z1 - z0, 2));
}

// ある点をx軸に対してtheta度だけ回転移動させた点を求める関数
function apply3DRotationMatrixAxisX(x, y, z, angle) {
    let u, v, w;
    let theta = angle / 180 * Math.PI;
    u = x;
    v = Math.cos(theta) * y - Math.sin(theta) * z;
    w = Math.sin(theta) * y + Math.cos(theta) * z;
    return new THREE.Vector3(u, v, w);
}

// ある点をy軸に対してtheta度だけ回転移動させた点を求める関数
function apply3DRotationMatrixAxisY(x, y, z, angle) {
    let u, v, w;
    let theta = angle / 180 * Math.PI;
    u = Math.cos(theta) * x - Math.sin(theta) * z;
    v = y;
    w = Math.sin(theta) * x + Math.cos(theta) * z;
    return new THREE.Vector3(u, v, w);
}

// ある点をz軸に対してtheta度だけ回転移動させた点を求める関数
function apply3DRotationMatrixAxisZ(x, y, z, angle) {
    let u, v, w;
    let theta = angle / 180 * Math.PI;
    u = Math.cos(theta) * x + Math.sin(theta) * y;
    v = - Math.sin(theta) * x + Math.cos(theta) * y;
    w = z;
    return new THREE.Vector3(u, v, w);
}


//========================================
//==============イベント処理================
//========================================
let mouseDownFlag = false;
let rotX = 0;
let mouseX = 0;
let rotY = 0;
let mouseY = 0;

document.addEventListener("mousedown", (event) => {
    mouseDownFlag = true;
});

document.addEventListener("mouseup", (event) => {
    mouseDownFlag = false;
});

document.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        case 37:
            console.log("left");
            camera.position.x -= 20;
            break;

        case 38:
            console.log("top");
            camera.position.y += 20;
            break;

        case 39:
            console.log("right");
            camera.position.x += 20;
            break;

        case 40:
            console.log("left");
            camera.position.y -= 20;
            break;
    
        default:
            console.log("def");
            break;
    }
});

// マウス座標はマウスが動いた時のみ取得できる
document.addEventListener("mousemove", (event) => {
    if (mouseDownFlag) {
        mouseX = event.pageX;
        mouseY = event.pageY;
    }
    console.log("mousemove");
});
