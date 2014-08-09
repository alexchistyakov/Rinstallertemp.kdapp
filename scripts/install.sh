#       Setup - DO NOT TOUCH        #
# --------------------------------- #
USER=$1
OUT=$2
rm -rf $OUT/*
mkdir -p $OUT

#       Start Coding Here...        #
# --------------------------------- #
touch $OUT/"10-Getting Keys"
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E084DAB9 &&

touch $OUT/"30-Adding Repositories"
cat /etc/apt/sources.list | grep -v  "http://cran.rstudio.com/bin/linux/ubuntu precise/" |  { cat; echo "deb http://cran.rstudio.com/bin/linux/ubuntu precise/"; } > /tmp/sources.list &&
sudo mv -f /tmp/sources.list /etc/apt/sources.list &&
sudo add-apt-repository ppa:marutter/rdev &&

touch $OUT/"50-Upgrading Packages"
sudo apt-get upgrade -y &&

touch $OUT/"60-Updating Files"
sudo apt-get update -y &&

touch $OUT/"70-Removing old packages"
sudo apt-get remove -y r-base &&
sudo apt-get autoremove -y --purge r-base &&

touch $OUT/"80-Installing R (this will take a while)"
sudo apt-get install -y r-base &&

touch $OUT/"100-Finishing Install"