# **SETUP - From Scratch**

## **PERL**

Make sure you are in your home directory.
```bash
$ cd ~/
```

### Install PerlBrew.
```bash
$ \curl -L https://install.perlbrew.pl | bash
$ perlbrew init
```

Add the following line to your ~/.bash_profile file
```bash
$ source ~/perl5/perlbrew/etc/bashrc
$ source ~/perl5/perlbrew/etc/bashrc  # Just in case any environment settings need updating
```

### Install PERL and tell PerlBrew to use it
```bash
$ perlbrew install perl-5.16.0
$ perlbrew use
```

### Install CPAN and modules
```bash
$ perlbrew install-cpanm
$ cpanm install Pod::Usage
$ cpanm install Pod::Text
$ cpanm install Pod::Simple
$ cpanm install Getopt::Long
```

## GIT

### Setup the repository
```bash
$ cd <your>/<workspace>/
$ mkdir fitutils
$ git init
```

### Setup repository deirectories
```bash
$ mkdir fitutils/bin
$ mkdir fitutils/examples
$ mkdir fitutils/libs
$ mkdir fitutils/tmp
$ mkdir fitutils/vendor
```

### Get Garmin-FIT
```bash
$ git clone https://github.com/mrihtar/Garmin-FIT vendor/Garmin-FIT
$ ln -s vendor/Garmin-FIT/Garmin .
```

### Get FitDump
```bash
$ cd bin/
$ ln -s vendor/Garmin-FIT/fitdump.pl bin/fitdump
$ cd -
```

### Get FitToJSON
```bash
$ alias fit2json='./bin/fitdump -print_json=1'
```

### Get FitToGPX
```bash
$ cd bin
$ ln -s vendor/Garmin-FIT/fit2gpx.pl bin/fit2gpx
$ cd -
```

### Get FitToTCX - Extracts to ./bin
```bash
$ \curl -L https://pub.ks-and-ks.ne.jp/cycling/pub/fit2tcx-0.11.tar.gz > vendor/.
$ tar -xvf vendor/fitsed-0.09.tar.gz
```

### Get FitSED - Extracts to ./bin
```bash
$ \curl -L https://pub.ks-and-ks.ne.jp/cycling/pub/fitsed-0.09.tar.gz > vendor/.
$ tar -xvf vendor/fitsed-0.09.tar.gz
```

### Add .gitignore
```bash
.DS_Store
node_modules/
tmp/
vendor/Garmin-FIT/
```