// class MyKmeans {
//     constructor(vector, k, callback) {
//         //**Vector:** array of arrays. Inner array
//         //represents a multidimensional data point (vector)  
//         //*These should be normalized*
//         this.callback = callback;
//         this.vector = vector;
//         //**K:** represents the number of groups/clusters into 
//         //which the vectors will be grouped
//         this.k = k;
//         //Initialize the centroids and clusters     
//         //**Centroids:** represent the center of each cluster. 
//         //They are taken by averaging each dimension of the vectors
//         this.centroids = [k];
//         this.cluster = [k];

//         //Create centroids and place them randomly because 
//         //we don't yet know where the vectors are most concentrated
//         this.createCentroids();
//         var count = 0, notFinished = true;

//         this.iterate(this.centroids.slice(0));
//     }
//     // Assign vector to each centroid
//     // ----------
//     // Randomly choose **k** vectors from the vector 
//     // array **vector**. These represent our guess 
//     // at where clusters may exist. 
//     createCentroids() {
//         var randomArray = this.vector.slice(0);
//         var self = this;
//         randomArray.sort(function () {
//             return (Math.floor(Math.random() * self.vector.length));
//         });
//         this.centroids = randomArray.slice(0, this.k);
//     }
//     // Recursively cluster and move the centroids
//     // ----------
//     //This method groups vectors into clusters and then determine the 
//     //the new location for each centroid based upon the mean
//     //location of the vectors in the cooresponding cluster
//     iterate(vecArray) {

//         this.cluster = new Array(this.k);

//         var tempArray = [];
//         for (let a = 0; a < this.vector[0].length; a++) {
//             tempArray.push(0);
//         }
//         vecArray = [];
//         for (var a = 0; a < this.k; a++) {
//             vecArray[a] = (tempArray.slice(0));
//         }
//         //Group each vector to a cluster based upon the 
//         //cooresponding centroid
//         for (var i in this.vector) {
//             var v = this.vector[i].slice(0);
//             var index = this.assignCentroid(v);

//             if (!this.cluster[index])
//                 this.cluster[index] = [];
//             this.cluster[index].push(v);

//             for (let a = 0; a < v.length; a++) {
//                 vecArray[index][a] += v[a]; //keep a sum for cluster
//             }
//         }

//         //Calculate the mean values for each cluster.
//         var distance, max = 0;

//         for (let a = 0; a < this.k; a++) {

//             var clusterSize = 0; //cluster is empty
//             if (this.cluster[a])
//                 clusterSize = this.cluster[a].length;

//             for (var b in vecArray[a]) {
//                 vecArray[a][b] = vecArray[a][b] / clusterSize;
//             }
//             distance = this.distance(vecArray[a], this.centroids[a]);
//             if (distance > max)
//                 max = distance;
//         }

//         if (max <= 0.5)
//             return this.callback(null, this.cluster, this.centroids);

//         //For each centroid use the mean calculated for the 
//         //corresponding cluster (effectively "moving" the centroid
//         //to its new "location")
//         for (var z in vecArray) {
//             this.centroids[z] = vecArray[z].slice(0);
//         }
//         this.iterate(vecArray);

//     }
//     // Determine the closest centroid to a vector
//     // ----------
//     assignCentroid(point) {
//         var min = Infinity,
//             res = 0;

//         //For each vector we determine the distance to the 
//         //nearest centroid. The vector is assigned to the 
//         //cluster that corresponds to the nearest centroid.
//         for (var i in this.centroids) {
//             dist = this.distance(point, this.centroids[i]);
//             if (dist < min) {
//                 min = dist;
//                 res = i;
//             }
//         }
//         return res;
//     }
//     // Calculate euclidian distance between vectors
//     // ----------
//     distance(v1, v2) {
//         var total = 0;
//         for (var c in v1) {
//             if (c != 0)
//                 total += Math.pow(v2[c] - v1[c], 2);
//         }
//         return Math.sqrt(total);
//     }
// }

class MyKmeans {
    constructor(vector, clusterNum) {
    }
}


// var obj = {
//     "map": mat, //乱数データ
//     "n": class_n, // クラスタ数
//     "transaction_max": 100 //試行回数上限
// }
function KMeans(map, class_n, transaction_max) {
    var ptnMap = map.slice();
    var grvArr = map.slice(0, class_n);
    var transaction = transaction_max;
    var count = 0;

    runClusterLoop();

    return {
        "result": grvArr,
        "count": count,
        "node": getBelongingCluster(grvArr, map)
    };

    //クラスタリング メインロジック
    function runClusterLoop() {
        var buffer = grvArr.slice();
        var result = calcClaster(ptnMap, grvArr);

        if (isEqualArray(buffer, grvArr)) {
            return;
        }

        if (count > transaction) {
            return;
        }
        count++;
        runClusterLoop();
    }

    // 配列の比較
    function isEqualArray(arr1, arr2) {
        var a = JSON.stringify(arr1);
        var b = JSON.stringify(arr2);
        return (a === b);
    }

    // クラスタの計算
    function calcClaster(node, clusters) {
        var i = 0;
        //配列初期化
        var store = new Array(clusters.length);

        for (i = 0; i < store.length; i++) {
            store[i] = [];
        }

        //ノードループ
        for (i = 0; i < node.length; i++) {
            var minVal = calcDistance(node[i], clusters[0]);
            var minCount = 0;

            //クラスタループ
            for (var j = 0; j < clusters.length; j++) {
                if (calcDistance(node[i], clusters[j]) < minVal) {
                    minCount = j;
                    minVal = calcDistance(node[i], clusters[j]);
                }
            }
            store[minCount].push(node[i].slice());
        }

        for (i = 0; i < clusters.length; i++) {
            clusters[i] = calcGravity(store[i]);
        }

        return clusters;
    }

    // 分類
    function getBelongingCluster(cluster, node) {
        var result = [];
        for (var i = 0; i < node.length; i++) {
            var minValue = -1;
            var minIndex = 0;

            for (var j = 0; j < cluster.length; j++) {
                var d = calcDistance(cluster[j], node[i]);
                if (j === 0 || d < minValue) {
                    minValue = d;
                    minIndex = j;
                }
            }
            result.push(minIndex);
        }

        return result;
    }

    // 重心
    function calcGravity(vec) {
        var sum = vec[0];
        for (var i = 1; i < vec.length; i++) {
            for (var j = 0; j < sum.length; j++) {
                sum[j] += vec[i][j];
            }
        }
        for (var j = 0; j < sum.length; j++) {
            sum[j] /= vec.length;
        }
        return sum;
    }

    // 距離
    function calcDistance(vec1, vec2) {
        var result = 0;
        for (var i = 0; i < vec1.length; i++) {
            result += Math.pow(2, Math.abs(vec2[i] - vec1[i]));
        }
        return (Math.sqrt(result));
    }

    //配列初期化
    function initMat(n, m, min, max) {
        if (min === undefined || min === null) {
            min = 0;
            max = 512;
        }
        if (max === undefined) {
            max = 512;
        }
        var array = [];
        for (var i = 0; i < m; i++) {
            var tmp = [];
            for (var j = 0; j < n; j++) {
                tmp.push(getRandomInt(min, max));
            }
            array.push(tmp);
        }
        return array;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}