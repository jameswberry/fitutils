var GarminSettings	= require(process.cwd() + '/libs/GarminSettings.js');

var Settings		= new GarminSettings('examples/Settings.fit', initSettings);

function initSettings(data, SettingsProcessor){

console.log(SettingsProcessor.getSettings());

SettingsProcessor.getSettings()
	
}