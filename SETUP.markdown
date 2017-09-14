** *SETUP - From Scratch*

*** PERL

Make sure you are in your home directory.
cd ~/

Install PerlBrew.
\curl -L https://install.perlbrew.pl | bash
perlbrew init

Add the following line to your ~/.bash_profile file
source ~/perl5/perlbrew/etc/bashrc
source ~/perl5/perlbrew/etc/bashrc  # Just in case any environment settings need updating

Install PERL and tell PerlBrew to use it
perlbrew install perl-5.16.0
perlbrew use

Install CPAN and modules
perlbrew install-cpanm
cpanm install Pod::Usage
cpanm install Pod::Text
cpanm install Pod::Simple
cpanm install Getopt::Long

Setup the repository
cd <your>/<workspace>/
mkdir fitsed
git init
mkdir fitsed/bin
mkdir fitsed/examples
mkdir fitsed/libs
mkdir fitsed/tmp
mkdir fitsed/vendor

Get Garmin-FIT
git clone https://github.com/mrihtar/Garmin-FIT vendor/Garmin-FIT
ln -s vendor/Garmin-FIT/Garmin .

Get FitSED
\curl -L https://pub.ks-and-ks.ne.jp/cycling/pub/fitsed-0.09.tar.gz > vendor/fitsed-0.09.tar.gz
tar -xvf vendor/fitsed-0.09.tar.gz

Get FitDump
cd bin/
ln -s vendor/Garmin-FIT/fitdump.pl bin/fitdump
cd -

Get FitToJSON
alias fit2json='./bin/fitdump -print_json=1'

Get FitToGPX
cd bin
ln -s vendor/Garmin-FIT/fit2gpx.pl bin/fit2gpx
cd -

FitToTCX
\curl -L https://pub.ks-and-ks.ne.jp/cycling/pub/fit2tcx-0.11.tar.gz > vendor/fit2tcx-0.11.tar.gz
tar -xvf vendor/fitsed-0.09.tar.gz

*** NODE

Install NODE and init the fitsed node module

npm init -y

npm install carrier --save

var util    = require('util'),
    spawn   = require('child_process').spawn,
    carrier = require('carrier'),
    pl_proc = spawn('perl', ['script.pl']),
    my_carrier;

my_carrier = carrier.carry(pl_proc.stdout);

my_carrier.on('line', function(line) {
  // Do stuff...
  console.log('line: ' + line);
})
