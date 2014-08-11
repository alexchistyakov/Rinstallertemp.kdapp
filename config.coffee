# DO NOT TOUCH
[NOT_INSTALLED, INSTALLED, WORKING,
FAILED, WRONG_PASSWORD, INSTALL,
REINSTALL, UNINSTALL]   = [0..7]
user                    = KD.nick()
domain                  = "#{user}.kd.io"
getSession              = -> (Math.random() + 1).toString(36).substring 7

# Configure App Here
app                     = "rinstaller"                                             # App name used for variables
appName                 = "R" 
appCSS                  = "R-installer"   # App name used for titles and statuses
github                  = "https://rest.kd.io/alexchistyakov/RInstaller.kdapp/master"    # Git repository on the master branch
logo                    = "#{github}/resources/logo.png"                               # The main logo centered at the top of the app
launchURL               = "https://#{domain}/#{app}/"                                  # The url used after the app is configured
configureURL            = "https://#{domain}/#{app}/install"                           # The url used to configure app
installChecker          = "/usr/bin/R"                                  # Path to check if the app is instaled
configuredChecker       = false                 # Path to check if configured after install (can be set to "false")
logger                  = "/tmp/_#{app}Installer.out/"                # Path to log installer progress
scripts                 =                                                              # Scripts with url and if sudo access required
  install   :
    url     : "#{github}/scripts/install.sh"
    sudo    : true
  reinstall :
    url     : "#{github}/scripts/reinstall.sh"
    sudo    : true
  uninstall :
    url     : "#{github}/scripts/uninstall.sh"
    sudo    : true
description             =                                                              # The main description centered under the progress bar
"""
<p>
  <div> <p> R is a language and environment for statistical computing and graphics. It is a GNU project which is similar to the S language and environment. R can be considered as a different implementation of S. There are some important differences, but much code written for S runs unaltered under R.</p>

<p>R provides a wide variety of statistical (linear and nonlinear modelling, classical statistical tests, time-series analysis, classification, clustering, ...) and graphical techniques, and is highly extensible. The S language is often the vehicle of choice for research in statistical methodology, and R provides an Open Source route to participation in that activity.</p>

<p>One of R's strengths is the ease with which well-designed publication-quality plots can be produced, including mathematical symbols and formulae where needed. Great care has been taken over the defaults for the minor design choices in graphics, but the user retains full control.</p> </div>
<p>In order to run R scripts use: </p>
<div class="code">Rscript [filename.R] [args]</div>
<p>To enter interactive mode simply use:</p>
<div class="code">R</div>
<p>For more information on both commands use</p>
<div class="code">R --help<br>
Rscript --help</div>
<p>In order to view graphics created by R:<br><br>
<t>1) Place the PDF files into the "Web" folder<br>
<t>2) View them by using the link: your-vm-number.your-username.kd.io<br>
</p>
</p>
"""


# Addition Configuration Variables Here
