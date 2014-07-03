angular.module('starter.controllers', [])
.controller('SelectCtrl', function($scope, SelectSer, $timeout, $ionicModal) {
	SelectSer(1, "", function(models){
		var time = $timeout(function() {
			$scope.datas = models;
			time = null;
		}, 0);
	});
	
	$scope.sta = 1;
	$ionicModal.fromTemplateUrl('templates/temp_select.html', {
		scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});
	
	$scope.state = function(s) {
		$scope.sta = s;
	}
	$scope.openModal = function() {
	    $scope.modal.show();
	};
	$scope.closeModal = function() {
	    $scope.modal.hide();
	};
	
	$scope.completeModal = function() {
		var datas = [];
		angular.forEach($scope.datas, function(val, key) {
			if (val.mark) {
				datas.push(val.name);
			}
		});
		
		var d = (new Date()).getTime();
		var s = $scope.sta;
		
		var paras = {
			oktime: d,
			state: s,
			datas : datas
		}
		
		SelectSer(2, paras, function() {
			alert('success')
		});
		
		$scope.modal.hide();
		$scope.completeModal = null;
	}
})
.controller('PriceCtrl', function($scope, $timeout, PriceSer) {
	PriceSer(1, "", function(models) {
		var time = $timeout(function() {
			$scope.datas = models;
			time = null;
		}, 0);
	});
})
.controller('LookCtrl', function($scope, LookSer, $timeout, $ionicModal, $window) {
	LookSer(1, "", function(models) {
		var time = $timeout(function() {
			$scope.datas = models;
			time = null;
		}, 0);
	});
	$scope.lookDetail = function(id) {
		$window.location.hash = "#/detail/"+id;
	}
})
.controller('LookDetailCtrl', function($scope, $state, LookSer, $timeout) {
	LookSer(2, {id: $state.params.id}, function(models) {
		var time = $timeout(function() {
			$scope.datas = models;
			time = null;
		}, 0);
	});
})
.controller('EditCtrl', function($scope, EditSer, $timeout, $ionicPopup) {
	EditSer(1, "", function(models){
		var time = $timeout(function() {
			$scope.datas = models;
			time = null;
		}, 0);
	});
	
	$scope.sub = function(name) {
		if (name) {
			EditSer(2, name, function(models){
				var time = $timeout(function() {
					$scope.datas = models;
					time = null;
				}, 0);
			});
		}
	}
	
	$scope.del = function(id) {
		if (id) {
			$ionicPopup.confirm({
	          title: '删除数据',
	          content: '确定删除数据?'
	        }).then(function(res) {
	          if(res) {
	            EditSer(3, id, function(models) {
					var time = $timeout(function() {
						$scope.datas = models;
						time = null;
					}, 0);
				});
	          }
	        });
		}
	}
})
.controller('ListCtrl', function($scope, BuySer, $timeout, $ionicModal, $ionicPopup, $window){
	var main_id = "";
	
	BuySer(1, "", function(models) {
		var time = $timeout(function() {
			$scope.datas = models;
			main_id = models[0].id;
			time = null;
		}, 0);
	});
	
	BuySer(2, "", function(models) {
		var time = $timeout(function() {
			$scope.modalDatas = models;
			time = null;
		}, 0);
	});
	
	$scope.cal = function(index, sl, je) {
		$scope.datas[index].total = sl * je;
	}
	
	$scope.tot = function() {
		var accout = 0;
		angular.forEach($scope.datas, function(val, key){
			if (val.total && val.total > 0) {
				accout += val.total;
			}
		});
		$scope.totals = accout;
		
	}
	$ionicModal.fromTemplateUrl('modal.html', {
		scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});
	$scope.openModal = function() {
		var arr = {}, arrRet = [];
		angular.forEach($scope.datas, function(val, key) {
			arr[val.name] = true;
		});
		angular.forEach($scope.modalDatas, function(val, key) {
			if (!arr[val.name]) {
				arrRet.push(val);
			}
		});
		$scope.modalDatas = arrRet;
	    $scope.modal.show();
	};
	$scope.closeModal = function() {
		var addModel = [];
		angular.forEach($scope.modalDatas, function(val, key) {
			if (val.mark) {
  				$scope.datas.push({
  					id: main_id,
  					name: val.name,
  					price: 0,
  					quantity: 0
  				});
  				addModel.push({id: main_id, name: val.name});
  				BuySer(3, addModel);
  				val.mark = false;
			}
		});
	    $scope.modal.hide();
	};
	$scope.complete = function() {
		$ionicPopup.confirm({
	       title: '完成',
	       content: '确定完成?'
	    }).then(function(res) {
	       if(res) {
	          var model = {
	          	totalmoney: $scope.totals,
	          	id: main_id,
	          	datas: $scope.datas
	          };
	          BuySer(4, model, function() {
	          	$window.history.back();
	          });
	       }
	   });
	}
});
