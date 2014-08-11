#       Setup - DO NOT TOUCH        #
# --------------------------------- #
USER=$1
OUT=$2
mkdir -p $OUT

#       Start Coding Here...        #
# --------------------------------- #
touch $OUT/"33-Removing R"
sudo apt-get remove -y r-base
touch $OUT/"66-Removing dependencies"
sudo apt-get autoremove -y --purge r-base

touch $OUT/"100-Finishing Removal"