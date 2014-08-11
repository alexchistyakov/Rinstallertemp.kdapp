#       Setup - DO NOT TOUCH        #
# --------------------------------- #
USER=$1
OUT=$2
mkdir -p $OUT

#       Start Coding Here...        #
# --------------------------------- #
touch $OUT/"20-Removing R"
sudo apt-get remove -y r-base &&
sudo apt-get autoremove -y --purge r-base &&

touch $OUT/"30-Getting Keys"
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E084DAB9 &&

touch $OUT/"40-Adding Repositories"
cat /etc/apt/sources.list | grep -v  "http://cran.rstudio.com/bin/linux/ubuntu precise/" |  { cat; echo "deb http://cran.rstudio.com/bin/linux/ubuntu precise/"; } > /tmp/sources.list &&
sudoo mv -f /tmp/sources.list /etc/apt/sources.list &&
sudo add-apt-repository ppa:marutter/rdev &&

touch $OUT/"50-Upgrading Packages"
sudo apt-get upgrade -y &&

touch $OUT/"70-Updating Files"
sudo apt-get update -y &&

touch $OUT/"80-Installing R"
sudo apt-get install -y r-base &&

touch $OUT/"100-Finishing Install"
