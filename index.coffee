class RInstallerController extends AppController

  constructor:(options = {}, data)->
    options.view    = new RInstallerMainView
    options.appInfo =
      name : "R Installer"
      type : "application"

    super options, data

do ->

  # In live mode you can add your App view to window's appView
  if appView?
    view = new RInstallerMainView
    appView.addSubView view

  else
    KD.registerAppClass RInstallerController,
      name     : "Rinstaller"
      routes   :
        "/:name?/Rinstaller" : null
        "/:name?/alexchistyakov/Apps/Rinstaller" : null
      dockPath : "/alexchistyakov/Apps/Rinstaller"
      behavior : "application"