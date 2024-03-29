class RInstallerMainView extends KDView

  constructor:(options = {}, data)->
    options.cssClass = "#{appCSS} main-view"
    @Installer = new RInstallerInstallerController
    super options, data

  viewAppended: ->
    @addSubView @container = new KDCustomHTMLView
      tagName       : 'div'
      cssClass      : 'container'

    @container.addSubView new KDCustomHTMLView
      tagName       : 'img'
      cssClass      : 'logo'
      attributes    :
        src         : logo

    @container.addSubView @progress = new KDProgressBarView
      initial       : 100
      title         : "Checking VM State..."

    @container.addSubView @link = new KDCustomHTMLView
      cssClass : 'hidden running-link'

    @link.setSession = =>
      @Installer.isConfigured()
        .then (configured)=>
          url = unless configured then configureURL else launchURL

          if url
            @link.updatePartial """
              Click here to launch #{appName}:
              <a target='_blank' href='#{url}'>#{url}</a>
            """
            @link.show()
        .catch (error)=>
          @link.updatePartial "Failed to check if #{appName} is configured."
          @link.show()
          console.error error

    @container.addSubView @buttonContainer = new KDCustomHTMLView
      tagName       : 'div'
      cssClass      : 'button-container'

    @buttonContainer.addSubView @installButton = new KDButtonView
      title         : "Install #{appName}"
      cssClass      : 'button green solid hidden'
      loader        :
          color     : "#FFFFFF"
          diameter  : 12
      callback      : => @commitCommand INSTALL

    @buttonContainer.addSubView @reinstallButton = new KDButtonView
      title         : "Reinstall"
      cssClass      : 'button solid hidden'
      loader        :
          color     : "#FFFFFF"
          diameter  : 12
      callback      : => @commitCommand REINSTALL

    @buttonContainer.addSubView @uninstallButton = new KDButtonView
      title         : "Uninstall"
      cssClass      : 'button red solid hidden'
      loader        :
          color     : "#FFFFFF"
          diameter  : 12
      callback      : => @commitCommand UNINSTALL

    @container.addSubView new KDCustomHTMLView
      cssClass : "description"
      partial  : description

    KD.utils.defer =>
      @Installer.on "status-update", @bound "statusUpdate"
      @Installer.init()

  statusUpdate: (message, percentage)->
    percentage ?= 100
    @link.hide()

    if percentage is 100
      if @Installer.state in [NOT_INSTALLED, INSTALLED, FAILED]
        element.hide().hideLoader() for element in [
          @installButton, @reinstallButton, @uninstallButton
        ]

    switch @Installer.state
      when NOT_INSTALLED
        @installButton.show()
        @updateProgress message, percentage
      when INSTALLED
        @reinstallButton.show()
        @uninstallButton.show()
        @link.setSession()
        @updateProgress message, percentage
      when WORKING
        @Installer.state = @Installer.lastState
        @updateProgress message, percentage
      when FAILED
        @Installer.state = @Installer.lastState
        @statusUpdate message, percentage
      when WRONG_PASSWORD
        @Installer.state = @Installer.lastState
        @passwordModal yes, (password)=>
          @Installer.command @Installer.lastCommand, password if password?
      else
        @updateProgress message, percentage

  commitCommand: (command)->
    switch command
      when INSTALL then name = "install"
      when REINSTALL then name = "reinstall"
      when UNINSTALL then name = "uninstall"
      else return throw "Command not registered."

    if scripts[name].sudo
      @passwordModal no, (password)=>
        if password?
          @["#{name}Button"].showLoader()
          @Installer.command command, password
    else
      @["#{name}Button"].showLoader()
      @Installer.command command

  passwordModal: (error, cb)->
    unless @modal
      unless error
        title = "#{appName} needs sudo access to continue"
      else
        title = "Incorrect password, please try again"

      @modal = new KDModalViewWithForms
        title         : title
        overlay       : yes
        overlayClick  : no
        width         : 550
        height        : "auto"
        cssClass      : "new-kdmodal"
        cancel        : =>
          @modal.destroy()
          delete @modal
          cb()
        tabs                    :
          navigable             : yes
          callback              : (form)=>
            @modal.destroy()
            delete @modal
            cb form.password
          forms                 :
            "Sudo Password"     :
              buttons           :
                Next            :
                  title         : "Submit"
                  style         : "modal-clean-green"
                  type          : "submit"
              fields            :
                password        :
                  type          : "password"
                  placeholder   : "sudo password..."
                  validate      :
                    rules       :
                      required  : yes
                    messages    :
                      required  : "password is required!"

  updateProgress: (status, percentage)->
    @progress.updateBar percentage, '%', status
