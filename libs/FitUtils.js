var fs		= require('fs'),
	util    = require('util'),
    spawn   = require('child_process').spawn,
    carrier = require('carrier'),
	pl_proc,
	my_carrier;

// Based on Garmin-FIT by Matjaz Rihtar, and Kiyokazu Suto <suto@ks-and-ks.ne.jp>
// https://github.com/mrihtar/Garmin-FIT
// https://pub.ks-and-ks.ne.jp/cycling/GarminFIT.shtml
var libs = {
	'fitsed':	'bin/fitsed',	// https://pub.ks-and-ks.ne.jp/cycling/fitsed.shtml
	'fitdump':	'bin/fitdump',	// https://pub.ks-and-ks.ne.jp/cycling/fitdump.shtml
	'fit2tcx':	'bin/fit2tcx',	// https://pub.ks-and-ks.ne.jp/cycling/fit2tcx.shtml
	'fit2gpx':	'bin/fit2gpx',	// https://github.com/mrihtar/Garmin-FIT/blob/master/fit2gpx.pl
	'podusage':	'bin/podusage',	// https://github.com/mrihtar/Garmin-FIT/blob/master/fit2gpx.pl
};

function FitUtils() {
	// Confirm libs are installed
	for( var key in libs ){
		if ( !FileDetails(libs[key]).exists ) {
			console.log('ERROR: ['+libs[key]+'] is not available from ['+process.cwd()+']');
			process.exit();
		}		
	};
}

// UTILITY FUNCTIONS
function FileDetails(filename){
  if ( !(this instanceof FileDetails) ) return new FileDetails(filename);
  this.filename	= filename;
  this.exists	= fs.existsSync(filename);
}

function isOption(option) {
	if ( typeof option !== 'undefined' && option ) return true;
	return false;
}

function arrayUnique(array) {
    var a = array.concat();
    for( var i=0; i<a.length; ++i ) {
        for( var j=i+1; j<a.length; ++j ) {
            if( a[i] === a[j] )
                a.splice(j--, 1);
        }
    }
    return a;
}

function libExec(lang, options, callback, context) {
	const chunks = [];
	pl_proc		= spawn(lang, options),
	my_carrier	= carrier.carry(pl_proc.stdout);	
	my_carrier.on('line',  (chunk) => {
		chunks.push(chunk.toString());
	});
	my_carrier.on('end', () => {
		callback(chunks, context);
	});
}

// CLASS METHODS
FitUtils.prototype.help = function(help, options, callback, context) {

	// Determine which libs to make documentation available for
	var docs = {'all': false};
	for( var key in libs ) {
		docs[key] = false;
	};
	for( var i=0;i<help.length;i++ ) {
		if ( docs[help[i]] === false) {
			docs[help[i]] = true;
		}
	}

	// Get documentation
	var exec_options;
	for( var doc in docs ) {
		exec_options = [libs.podusage];
		if ( doc !== 'podusage' && (docs[doc] || docs.all) ) {
			if ( libs[doc] != undefined ) {
				exec_options.push(libs[doc]);
				options.forEach(function(value, key, map) {
					if ( value.indexOf('=') > -1 ) {
						if ( value.split('=')[0] == '-verbose' ||  value.split('=')[0] == '-sections') {
							exec_options.push(value.split('=')[1]);
						}
					}
				});
				libExec('perl', exec_options, callback, context);
			}
		}
	}
}

FitUtils.prototype.dump = function(read_file, callback, options, context) {	
	options = arrayUnique([libs.fitdump].concat(options).concat([ read_file ]));
	//console.log(options);
	
	libExec('perl', options, callback, context);
}

FitUtils.prototype.toText = function(read_file, callback, options, context) {
	if ( !isOption(options.quiet) ) console.log('Dumping File as TEXT: ' + read_file);

	this.dump(read_file, (chunks) => {
		callback(chunks.join('\n'), context);
	},
	options);
}

FitUtils.prototype.toJSON = function(read_file, callback, options, context) {
	if ( !isOption(options.quiet) ) console.log('Dumping File as JSON: ' + read_file);

	this.dump(read_file, (chunks) => {
		callback(chunks.join('\n'), context);
	},
	arrayUnique(options.concat(['-print_json=1'])));
}

FitUtils.prototype.toTCX = function(read_file, callback, options, context) {
	if ( !isOption(options.quiet) ) console.log('Dumping File as TCX: ' + read_file);

	options = arrayUnique([libs.fit2tcx].concat(options).concat([ read_file ]));

	libExec('perl', options, callback, context);
}

FitUtils.prototype.toGPX = function(read_file, callback, options, context) {
	if ( !isOption(options.quiet) ) console.log('Dumping File as GPX: ' + read_file);

	options = arrayUnique([libs.fit2gpx].concat(options).concat([ read_file ]));

	libExec('perl', options, callback, context);
}

FitUtils.prototype.update = function(update, read_file, write_file, callback, options, context) {
	if ( !isOption(options.quiet) ) console.log('Updating File: ' + read_file);
	if ( !update ) console.log('ERROR: No value for [-update] argument.  Please specify a valid fitsed <expression>.');
	update.join(' ');

	options = arrayUnique([libs.fitsed].concat(['B']).concat(update).concat(['E']).concat([read_file]).concat([write_file]).concat(options));

	libExec('perl', options, callback, context);
}

module.exports = FitUtils;