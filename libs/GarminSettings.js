var traverse = require('traverse');

var FitUtils		= require(process.cwd() + '/libs/FitUtils.js');
var FitProcessor	= new FitUtils();

function GarminSettings(settings_file, callback) {
	if ( !settings_file ) console.log('ERROR: No settings file specified.');
	if ( !settings_file ) console.log('WARNING: No callback specified. Are you sure this is what you wanted to do?');
	
	this.settings_file = settings_file;
	this.Settings = {};
	this.Updates = {};
	
	this.readSettings(settings_file, function(data, context) {
		context.setSettings(JSON.parse(data));
		callback(context.getSettings(), context);
	});
};

// UTILITY FUNCTIONS

// CLASS METHODS
GarminSettings.prototype.setSettings = function(settings) {
	this.Settings = settings;
	traverse(this.Settings).forEach(function(x) {
		console.log(this.path+' '+x);
	});
};
GarminSettings.prototype.setSetting = function(setting, value) {
	return this.Settings[setting] = value;
};
GarminSettings.prototype.getSettings = function() { return this.getSetting(); };
GarminSettings.prototype.getSetting = function(setting) {
	if ( setting ){
		return this.Settings[setting];		
	} else {
		return this.Settings;
	}
};

GarminSettings.prototype.readSettings = function(read_file, callback) {
	FitProcessor.toJSON(read_file, callback, [], this);
};

GarminSettings.prototype.writeSettings = function(write_file, updates, callback) {
	if ( typeof updates !== 'array') {
		console.log('WARNING: No updates specified for ['+this.settings_file+']');
		updates = [];
	}
		FitProcessor.update(updates[i],this.settings_file, callback, [], this);
};

GarminSettings.prototype.commitSettings = function(write_file, callback) {
	
};


// PUBLISH MODULE
module.exports = GarminSettings;

/*
Assuming Edge 500 is mounted on the folder /mnt/Edge500, it has a file Settings.fit in the folder /mnt/Edge500/Garmin/Settings.

To change the value of the field [friendly_name] of the message [user_profile] in Settings.fit to [SomeNewName], and to save the result to [/tmp/new_settings.fit]:
	fitsed user_profile.friendly_name=SomeNewName /mnt/Edge500/Garmin/Settings/Settings.fit /tmp/new_settings.fit

To change the value of the field [weight] of the same message to [54kg] simultaneously:
	fitsed B user_profile.friendly_name=SomeNewName weight=54kg E /mnt/Edge500/Garmin/Settings/Settings.fit /tmp/new_settings.fit

The file Settings.fit has 3 messages with message number 6. They seem to be bike profiles. The field with index 254 in a global .FIT profile of a message of this type, seems to be an identification number of the message in the file, and the field with index 10 seems to be a bike weight.

Adding to the above changes, to change the value of the field with index 10 of the first message to 7.5kg:
fitsed B 6.254:eq:0 6.10=7.5kg OR user_profile.friendly_name=suto weight=54kg E /mnt/Edge500/Garmin/Settings/Settings.fit /tmp/new_settings.fit
*/