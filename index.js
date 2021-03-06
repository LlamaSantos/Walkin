var fs = require('fs');
var util = require('util');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var domain = require('domain').createDomain();
//var async = require('async');
//var _ = require('underscore');

function Ticker(done){
	var counter = 0;
	return {
		add : function (len){
			counter += len;
		},
		done : function (){
			counter--;
			if (counter === 0){
				done();
			}
		}
	};
};



function Walkin (options){
	var that = this;
	var errors = [];

	options = options || {};
	this.relativePaths = options.relativePaths || false;
	// -- Wire Through the Error
	domain.on('error', function (err){
		errors = errors ? [err] : errors.push(err), errors;
		that.emit('error', err);
	});

	function walkin(dir, tick, comp, handle, done){
		fs.readdir(dir, domain.intercept(function (contents){
			tick.add(contents.length);
			if (done)
				done();

			contents.forEach(function (item){
				var entity = path.join(dir, item);

				fs.stat(entity, domain.intercept(function (stats){
					if (stats.isDirectory())
						walkin(entity, tick, comp, handle, tick.done);
					else{
						if (stats.isFile() && comp(entity)){
							handle(entity);
						}

						tick.done(entity);
					} 
				}));
			});
		}));
	}

	function walkinSync(dir, comp, handle) {
		fs.readdirSync(dir).forEach(function (item){
			var entity = path.join(dir, item);

			var stats = fs.statSync(entity);
			if (stats.isDirectory())
				walkinSync(entity, comp, handle);
			else{
				if (stats.isFile() && comp(entity))
					handle(entity);
			}
		})
	}

	this.find = function (dir, cb){
		errors = null;
		var that = this
			, basename = path.basename(dir)
			, directory = path.dirname(dir)
			, is_wildcard = basename.replace(path.extname(basename), '') === '*'
			, recursiveIndex = dir.indexOf('**')
			, dirpath =  recursiveIndex === -1 ? directory : directory.substring(0, recursiveIndex)
			, files = [];

		var tick = Ticker(function (){
			if (cb && typeof cb === 'function')
				cb(errors, files);

			that.emit('done', errors, files);
		});

		walkin(dirpath, tick, 
			function comp(entity){
				return (is_wildcard && path.extname(basename) === path.extname(entity))
								|| (!is_wildcard && basename === path.basename(entity));
			},
			function assign(entity){
				files.push(entity);
				that.emit('file', entity);
			});
	};

	this.findSync = function (dir) {
		var that = this
			, basename = path.basename(dir)
			, directory = path.dirname(dir)
			, is_wildcard = basename.replace(path.extname(basename), '') === '*'
			, recursiveIndex = dir.indexOf('**')
			, dirpath =  recursiveIndex === -1 ? directory : directory.substring(0, recursiveIndex)
			, files = [];

		walkinSync(dirpath,
			function comp(entity){
				return (is_wildcard && path.extname(basename) === path.extname(entity))
								|| (!is_wildcard && basename === path.basename(entity));
			},
			function assign(entity){
				files.push(entity);
				that.emit('file', entity);
			});

		return files;
	};

	this.match = function (dir, expr, cb){
		errors = null;
		var that = this;
		var files = [];

		var tick = Ticker(function (){
			if (cb && typeof cb === 'function')
				cb(errors, files);

			that.emit('done', errors, files);
		});

		walkin(dir, tick,
			function comp(entity){
				return (entity.match(expr) || []).length > 0;
			},
			function assign(entity){
				files.push(entity);
				that.emit('file', entity);
			});
	};

	this.matchSync = function (dir, expr) {
		var that = this;
		var files = [];

		walkinSync(dir, 
			function comp(entity){
				return (entity.match(expr) || []).length > 0;
			},
			function assign(entity){
				files.push(entity);
				that.emit('file', entity);
			});

		return files;
	}
};
util.inherits(Walkin, EventEmitter);

module.exports = Walkin;