angular.module('starter.services', [])
.factory('EditSer', function() {
  var db = openDatabase('mydb', '1.0', 'purchase', 2 * 1024 * 1024);
  
  function getModels(tx, callbacks) {
		tx.executeSql('select * from data order by id desc', [], function(tx, results) {
			var len = results.rows.length, i, models = [];
			for (i = 0; i < len; i++) {
				models.push({id: results.rows.item(i).id, name:results.rows.item(i).name});
			}
			console.log(1)
		  	callbacks && callbacks(models);
		});  	
  }
  
  return function(type, model, callbacks) {
  	switch (type) {
  		case 1 : //get
  			db.transaction(function (tx) {
				tx.executeSql('create table if not exists data(id INTEGER PRIMARY KEY, name char(50))');
				getModels(tx, callbacks);
			})
  			break;
  		case 2 : //add
  			db.transaction(function (tx) {
				tx.executeSql('create table if not exists data(id INTEGER PRIMARY KEY, name char(50))');
				var sql = 'insert into data(id, name) values(null,"'+model+'")';
				tx.executeSql(sql);
				getModels(tx, callbacks);
			})
  		break;
  		case 3 : 
  			db.transaction(function(tx) {
				var sql = 'delete from data where id=' + model;
				tx.executeSql(sql);
				getModels(tx, callbacks);
			});
  	}
  }
})
.factory('SelectSer', function() {
	var db = openDatabase('mydb', '1.0', 'purchase', 2 * 1024 * 1024);
	
	return function(type, model, callbacks) {
		switch (type) {
	  		case 1 : //get
	  			db.transaction(function (tx) {
					tx.executeSql('create table if not exists data(id INTEGER PRIMARY KEY, name char(50))');
					tx.executeSql('select * from data order by id desc', [], function(tx, results) {
						var len = results.rows.length, i, models = [];
						for (i = 0; i < len; i++) {
							models.push({id: results.rows.item(i).id, name:results.rows.item(i).name});
						}
					  	callbacks && callbacks(models);
					});  
				})
	  			break;
	  		case 2 : //
	  			db.transaction(function (tx) {
					tx.executeSql('create table if not exists main(id varchar(50), name char(50), price double, quantity double)');
	                tx.executeSql('create table if not exists staus(id varchar(50), flag bool, total double, k int)');
					for (var i = 0; i < model.datas.length; i++) {
						var sql = 'insert into main values("'+model.oktime+'","'+model.datas[i]+'",0,0)';
						tx.executeSql(sql);
					};
					sql = 'insert into staus values('+model.oktime+', 0, 0, '+model.state+')';
	                tx.executeSql(sql);
	                callbacks && callbacks();
				})
	  		break;
  		}	
	}
})
.factory('BuySer', function() {
	var db = openDatabase('mydb', '1.0', 'purchase', 2 * 1024 * 1024);
	return function(type, model, callbacks) {
		switch (type) {
	  		case 1 : //get
	  			db.transaction(function (tx) {
					tx.executeSql('create table if not exists main(id varchar(50), name char(50), price double, quantity double)');
					tx.executeSql('select * from main order by id desc limit 1', [], function(tx, results) {
						if (results.rows.length > 0) {
	                        var sql = 'select * from main where id='+results.rows.item(0).id;
	                        tx.executeSql(sql, [], function(tx, rets) {
	                            var len = rets.rows.length, i, models = [];
	                            for (i = 0; i < len; i++) {
	                            	models.push({id: rets.rows.item(i).id, name: rets.rows.item(i).name,
	                            		price: rets.rows.item(i).price, quantity: rets.rows.item(i).quantity});
	                            }
	                            callbacks && callbacks(models);
	                        })
	                    }
					});
				})
	  			break;
	  		case 2 : //
	  			db.transaction(function (tx) {
					tx.executeSql('create table if not exists data(id INTEGER PRIMARY KEY, name char(50))');
					tx.executeSql('select * from data order by id desc', [], function(tx, results) {
						var len = results.rows.length, i, models = [];
						for (i = 0; i < len; i++) {
							models.push({id: results.rows.item(i).id, name:results.rows.item(i).name});
						}
					  	callbacks && callbacks(models);
					});  
				})
	  		break;
	  		case 3 :
	  			db.transaction(function(tx) {
	                for(var i = 0; i < model.length; i++) {
	                    tx.executeSql('insert into main values(?,?,0,0)',[model[i].id,model[i].name]);
	                }
	                callbacks && callbacks();
	            })
	  		break;
	  		case 4 : 
	  			db.transaction(function(tx) {
	                tx.executeSql('update staus set flag=1, total=? where id=?',[model.totalmoney, model.id]);
	                angular.forEach(model.datas, function(val, key) {
	                	tx.executeSql('update main set price=?,quantity=? where id=? and name=?',[val.price, val.quantity, val.id, val.name]);
	                });
	                callbacks && callbacks();
	            })
  		}	
	}
})
.factory('LookSer', function() {
	var db = openDatabase('mydb', '1.0', 'purchase', 2 * 1024 * 1024);
	return function(type, model, callbacks) {
		switch (type) {
	  		case 1 : //get
	  			db.transaction(function (tx) {
	                tx.executeSql('select * from staus order by id desc limit 30', [], function(tx, results) {
	                    var models = [];
	                    if (results.rows.length > 0) {
	                        for (var i = 0, l = results.rows.length; i < l; i++){
	                        	models.push({
	                        		time: results.rows.item(i).id,
	                        		state: results.rows.item(i).k == 1 ? "白天" : "晚上",
	                        		total: results.rows.item(i).total
	                        	});
	                        }
							callbacks && callbacks(models);
	                    }
	                })
	            })
	  			break;
	  		case 2 : //
	  			db.transaction(function (tx) {
	                var sql = 'select * from main where id='+model.id;
	                tx.executeSql(sql, [], function(tx, results) {
						var models = [];
	                    if (results.rows.length > 0) {
	                        for (var i = 0, l = results.rows.length; i < l; i++){
	                        	models.push({
	                        		name: results.rows.item(i).name,
	                        		price: results.rows.item(i).price,
	                        		money: results.rows.item(i).quantity*results.rows.item(i).price
	                        	});
	                        }
	                        callbacks && callbacks(models);
	                    }
	                })
	            })
	  			break;
	  		case 3 :
	  			
	  			break;
	  		case 4 : 
	  			
  		}	
	}
})
.factory('PriceSer', function() {
	var db = openDatabase('mydb', '1.0', 'purchase', 2 * 1024 * 1024);
	return function(type, model, callbacks) {
		switch (type) {
	  		case 1 : //get
	  			var id1, id2, models = [];
	  			db.transaction(function (tx) {
	                tx.executeSql('select * from staus where flag=1 order by id desc limit 10', [], function(tx, results) {
	                    if (results.rows.length == 1) {
	                         id1 = results.rows.item(0).id;
	                    } else if (results.rows.length > 1) {
	                         id1 = results.rows.item(0).id;
	                         for (var i = 1; i < results.rows.length; i++) {
	                             if (results.rows.item(i).k == results.rows.item(0).k) {
	                                 id2 = results.rows.item(i).id;
	                                 break;
	                             }
	                         }
	                    }
	
	                    if (id2 && id1) {
	                        // alert(id1 + " " + id2)
	                        tx.executeSql('select * from main where id=?', [id1], function(tx, res1) {
	                            tx.executeSql('select * from main where id=?', [id2], function(tx, res2) {
	                                for (var k = 0; k < res1.rows.length; k++) {
	                                    var price = 0;
	                                    for (var m = 0; m < res2.rows.length; m++) {
	                                        if (res2.rows.item(m).name == res1.rows.item(k).name) {
	                                            price = res1.rows.item(k).price - res2.rows.item(m).price;
	                                        }
	                                    }
	                                    models.push({
		                                	name:res1.rows.item(k).name,
		                                	price:res1.rows.item(k).price,
		                                	state:price
		                                });
	                                }
									callbacks && callbacks(models);
	                            })
	                        })
	                    }
	
	                    if (id1 && !id2) {
	                        tx.executeSql('select * from main where id=?', [id1], function(tx, res1) {
	                            for (var k = 0; k < res1.rows.length; k++) {
	                                models.push({
		                                	name:res1.rows.item(k).name,
		                                	price:res1.rows.item(k).price,
		                                	state:0
		                                });
	                            }
	                            callbacks && callbacks(models);
	                        })
	                    }
	                })
	            })
	  			break;
	  			
  		}	
	}
})
;
