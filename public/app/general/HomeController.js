var HomePageController = angular.module("HomePageController", ["nvd3"]);

HomePageController.controller("HomePageController", ["$scope", "$location", "$rootScope", "$sessionStorage", "StockService", function($scope, $location, $rootScope, $sessionStorage, StockService,  $nvd3) {
    $rootScope.pageTitle = "Stock Portfolio App";

    $scope.chart_options = {
        "chart": {
            "type": "lineChart",
            "height": 450,
            "margin": {
                "top": 20,
                "right": 20,
                "bottom": 50,
                "left": 65
            },
            "color": [
                "#1f77b4",
                "#ff7f0e",
                "#2ca02c",
                "#d62728",
                "#9467bd",
                "#8c564b",
                "#e377c2",
                "#7f7f7f",
                "#bcbd22",
                "#17becf"
            ],
            tooltip:{
                valueFormatter: function(d){
                    return '$' + d.toFixed(2);
                }
            },
            x: function (d){ return d[0]; },
            y: function (d){ return d[1]; },
            "duration": 300,
            "useInteractiveGuideline": true,
            "clipVoronoi": false,
            "xAxis": {
                "axisLabel": "X Axis",
                "showMaxMin": false,
                "staggerLabels": true,
                tickFormat: function(d) {
                    return new Date(d).toLocaleDateString();
                }
            },
            "yAxis": {
                "axisLabel": "Y Axis",
                "axisLabelDistance": 0,
                tickFormat: function(d){

                    return '$' + d.toFixed(2);
                }
            }
        }
    };

    StockService.getQuotes('acad').then(function(data){
        console.log(data);
        $scope.chart_data = data;
    })
}]);