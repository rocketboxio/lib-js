var app_token = "-- YOUR TOKEN HERE --";

function Rocketbox()
{
	var _self = this;
	var _api_url = "https://www.rocketbox.io/api/v1/";

	this.ajaxX = function() {
		if (typeof XMLHttpRequest !== 'undefined') {
			return new XMLHttpRequest();  
		}
		var versions = [
		"MSXML2.XmlHttp.5.0",
		"MSXML2.XmlHttp.4.0",
		"MSXML2.XmlHttp.3.0",
		"MSXML2.XmlHttp.2.0",
		"Microsoft.XmlHttp"
		];

		var xhr;
		for(var i = 0; i < versions.length; i++) {  
			try {  
				xhr = new ActiveXObject(versions[i]);  
				break;  
			} catch (e) {
			}  
		}
		return xhr;
	};

	this.send = function(url, callback, method, data, sync) {
		var x = _self.ajaxX();
		x.open(method, url, sync);
		x.onreadystatechange = function() {
			if (x.readyState == 4) {
				callback(JSON.parse(x.responseText));
			}
		};
		if (method == 'POST') {
			x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}
		x.send(data)
	};

	this.ajaxGet = function(url, data, callback, sync) {
		var query = [];
		for (var key in data) {
			query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		}
		_self.send(_api_url + url + '?' + query.join('&'), callback, 'GET', null, sync)
	};

	this.ajaxPost = function(url, data, callback, sync) {
		var query = [];
		for (var key in data) {
			query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		}
		_self.send(_api_url + url, callback, 'POST', query.join('&'), sync)
	};

	this.replaceAllValues = function(){
		var html = document.documentElement.innerHTML;
		var regex = /{.*?}/g;
		var res = html.match(regex);
		var keys = '';
		for(var i = 0; i < res.length; i++){
			var string = res[i];
			var key = string.replace('{', '').replace('}', '');
			keys += key + ',';
		}
		_self.ajaxPost("get", {"token": app_token, "key": keys}, function(results) {
			if (results && results.success){
				var body = document.documentElement.innerHTML;
				for(var i = 0; i < results.records.length; i++){
					body = replaceAll("{" + results.records[i].key + "}", results.records[i].value, body);
				}
				document.documentElement.innerHTML = body;
			}
		}, false);
	}

	this.get = function(key, callback){
		_self.ajaxPost("get", {"token":app_token, "key":key}, function(results){
			callback(results);
		});
	}

	this.getAll = function(key, callback){
		_self.ajaxPost("getAll", {"token":app_token}, function(results){
			callback(results);
		});
	}

	this.delete = function(key, callback){
		_self.ajaxPost("delete", {"token":app_token, "key":key}, function(results){
			callback(results);
		});
	}

	this.set = function(key, value, callback){
		_self.ajaxPost("set", {"token":app_token, "key":key, "value":value}, function(results){
			callback(results);
		});
	}

	this.collectionAdd = function(key, object, callback){
		_self.ajaxPost("collection/add", {"token":app_token, "key":key, "value":JSON.stringify(object)}, function(results){
			callback(results);
		});
	}

	this.collectionEdit = function(key, object, callback){
		_self.ajaxPost("collection/edit", {"token":app_token, "key":key, "value":JSON.stringify(object)}, function(results){
			callback(results);
		});
	}

	this.collectionGet = function(key, callback){
		_self.ajaxPost("collection/get", {"token":app_token, "key":key}, function(results){
			callback(results);
		});
	}

	this.collectionGetAll = function(callback){
		_self.ajaxPost("collection/getAll", {"token":app_token}, function(results){
			callback(results);
		});
	}

	this.collectionDelete = function(id, callback){
		_self.ajaxPost("collection/delete", {"token":app_token, "_id":id}, function(results){
			callback(results);
		});
	}

	this.collectionSearch = function(key, object, callback){
		_self.ajaxPost("collection/search", {"token":app_token, "key":key, "value":JSON.stringify(object)}, function(results){
			callback(results);
		});
	}

	this.collectionSearchById = function(id, callback){
		_self.ajaxPost("collection/searchById", {"token":app_token, "_id":id}, function(results){
			callback(results);
		});
	}

	this.collectionDrop = function(key, callback){
		_self.ajaxPost("collection/drop", {"token":app_token, "key":key}, function(results){
			callback(results);
		});
	}

	this.sendMail = function(to, subject, body, callback){
		_self.ajaxPost("mail/send", {"token":app_token, "to":to, "subject":subject, "body":body}, function(results){
			callback(results);
		});
	}

	function replaceAll(find, replace, str) {
		return str.replace(new RegExp(find, 'g'), replace);
	}
}