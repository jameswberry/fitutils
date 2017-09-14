// REQUIRE LIBRARIES
var fs = require('fs');
const commandLineArgs = require('command-line-args')

var FitUtils = require('./libs/FitUtils.js');
FitProcessor = new FitUtils();
 
function FileDetails(filename){
  if ( !(this instanceof FileDetails) ) return new FileDetails(filename);
  this.filename = filename;
  this.exists = fs.existsSync(filename);
}
 
// COMMAND LINE ARGUMENTS
const optionDefinitions = [
  { name: 'read',	alias: 'r',	type: FileDetails},
  { name: 'update', alias: 'u',	type: String,		multiple: true},
  { name: 'write',	alias: 'w',	type: FileDetails},
  { name: 'format', alias: 'f',	type: String,						defaultValue: 'json'},
  { name: 'debug',	alias: 'd',	type: Boolean,						defaultValue: false},
  { name: 'help',	alias: 'h',	type: String,		multiple: true}
]
const options = commandLineArgs(optionDefinitions, { partial: true });

//console.log(options);

// Format options for proxy to FitUtils
var proxy_args  = [];
if ( typeof options._unknown !== 'undefined' ) {
	for( var i=0;i<options._unknown.length-1;i++ ) {
		// Fix not parsing --<arg>=<val> syntax.
		if ( options._unknown[i].indexOf('=') > -1 ) {
			proxy_args.push(options._unknown[i].slice(1));
		} else {
			proxy_args.push(options._unknown[i].slice(1) + '=' + options._unknown[i+1]);
			i++;
		}
	}
}

if ( options.help ) {
	// Set the default to 'all'
	if ( options.help.length == 0 ) options.help.push('all');
	
	FitProcessor.help(options.help, proxy_args, function(data) {
		console.log('\n');
		handleData(data.join('\n'));
	});

} else if ( options.read ) {

	if ( !options.update ) {
		switch( options.format.toLowerCase() ) {
		case 'json':
			FitProcessor.toJSON(options.read.filename, handleData, proxy_args);
			break;		
		case 'gpx':
			FitProcessor.toGPX(options.read.filename, handleData, proxy_args);
			break;		
		case 'tcx':
			FitProcessor.toTCX(options.read.filename, handleData, proxy_args);
			break;		
		default:
			FitProcessor.toText(options.read.filename, handleData, proxy_args);
			break;		
		}
	} else {
		FitProcessor.update(options.update, options.read.filename, options.write.filename, handleData, proxy_args);
	}
} else {
	console.log('No options specified. Try -help');
}

function handleData(data) {
	console.log(data);
};