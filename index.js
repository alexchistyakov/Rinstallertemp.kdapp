/* Compiled by kdc on Mon Aug 11 2014 19:31:51 GMT+0000 (UTC) */
(function() {
/* KDAPP STARTS */
if (typeof window.appPreview !== "undefined" && window.appPreview !== null) {
  var appView = window.appPreview
}
/* BLOCK STARTS: /home/alexchistyakov/Applications/Rinstaller.kdapp/config.coffee */
var FAILED, INSTALL, INSTALLED, NOT_INSTALLED, REINSTALL, UNINSTALL, WORKING, WRONG_PASSWORD, app, appCSS, appName, configureURL, configuredChecker, description, domain, getSession, github, installChecker, launchURL, logger, logo, scripts, user, _ref;

_ref = [0, 1, 2, 3, 4, 5, 6, 7], NOT_INSTALLED = _ref[0], INSTALLED = _ref[1], WORKING = _ref[2], FAILED = _ref[3], WRONG_PASSWORD = _ref[4], INSTALL = _ref[5], REINSTALL = _ref[6], UNINSTALL = _ref[7];

user = KD.nick();

domain = "" + user + ".kd.io";

getSession = function() {
  return (Math.random() + 1).toString(36).substring(7);
};

app = "rinstaller";

appName = "R";

appCSS = "R-installer";

github = "https://rest.kd.io/alexchistyakov/RInstaller.kdapp/master";

logo = "" + github + "/resources/logo.png";

launchURL = "https://" + domain + "/" + app + "/";

configureURL = "https://" + domain + "/" + app + "/install";

installChecker = "/usr/bin/R";

configuredChecker = false;

logger = "/tmp/_" + app + "Installer.out/";

scripts = {
  install: {
    url: "" + github + "/scripts/install.sh",
    sudo: true
  },
  reinstall: {
    url: "" + github + "/scripts/reinstall.sh",
    sudo: true
  },
  uninstall: {
    url: "" + github + "/scripts/uninstall.sh",
    sudo: true
  }
};

description = "<p>\n  <div> <p> R is a language and environment for statistical computing and graphics. It is a GNU project which is similar to the S language and environment. R can be considered as a different implementation of S. There are some important differences, but much code written for S runs unaltered under R.</p>\n\n<p>R provides a wide variety of statistical (linear and nonlinear modelling, classical statistical tests, time-series analysis, classification, clustering, ...) and graphical techniques, and is highly extensible. The S language is often the vehicle of choice for research in statistical methodology, and R provides an Open Source route to participation in that activity.</p>\n\n<p>One of R's strengths is the ease with which well-designed publication-quality plots can be produced, including mathematical symbols and formulae where needed. Great care has been taken over the defaults for the minor design choices in graphics, but the user retains full control.</p> </div>\n<p>In order to run R scripts use: </p>\n<div class=\"code\">Rscript [filename.R] [args]</div>\n<p>To enter interactive mode simply use:</p>\n<div class=\"code\">R</div>\n<p>For more information on both commands use</p>\n<div class=\"code\">R --help<br>\nRscript --help</div>\n<p>In order to view graphics created by R:<br><br>\n<t>1) Place the PDF files into the \"Web\" folder<br>\n<t>2) View them by using the link: your-vm-number.your-username.kd.io<br>\n</p>\n</p>";
/* BLOCK STARTS: /home/alexchistyakov/Applications/Rinstaller.kdapp/controllers/kiteHelper.coffee */
var KiteHelper,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

KiteHelper = (function(_super) {
  __extends(KiteHelper, _super);

  function KiteHelper() {
    return KiteHelper.__super__.constructor.apply(this, arguments);
  }

  KiteHelper.prototype.vmIsStarting = false;

  KiteHelper.prototype.getReady = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        var JVM;
        JVM = KD.remote.api.JVM;
        return JVM.fetchVmsByContext(function(err, vms) {
          var alias, kiteController, vm, _i, _len;
          if (err) {
            console.warn(err);
          }
          if (!vms) {
            return;
          }
          _this._vms = vms;
          _this._kites = {};
          kiteController = KD.getSingleton('kiteController');
          for (_i = 0, _len = vms.length; _i < _len; _i++) {
            vm = vms[_i];
            alias = vm.hostnameAlias;
            _this._kites[alias] = kiteController.getKite("os-" + vm.region, alias, 'os');
          }
          _this.emit('ready');
          return resolve();
        });
      };
    })(this));
  };

  KiteHelper.prototype.getVm = function() {
    this._vm || (this._vm = this._vms.first);
    return this._vm;
  };

  KiteHelper.prototype.getKite = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return _this.getReady().then(function() {
          var kite, vm, vmController;
          vm = _this.getVm().hostnameAlias;
          vmController = KD.singletons.vmController;
          if (!(kite = _this._kites[vm])) {
            return reject({
              message: "No such kite for " + vm
            });
          }
          return vmController.info(vm, function(err, vmn, info) {
            var timeout;
            if (!_this.vmIsStarting && info.state === "STOPPED") {
              _this.vmIsStarting = true;
              timeout = 10 * 60 * 1000;
              kite.options.timeout = timeout;
              return kite.vmOn().then(function() {
                return resolve(kite);
              }).timeout(timeout)["catch"](function(err) {
                return reject(err);
              });
            } else {
              return resolve(kite);
            }
          });
        });
      };
    })(this));
  };

  KiteHelper.prototype.run = function(options, callback) {
    return this.getKite().then(function(kite) {
      if (options.timeout == null) {
        options.timeout = 10 * 60 * 1000;
      }
      kite.options.timeout = options.timeout;
      return kite.exec(options).then(function(result) {
        if (callback) {
          return callback(null, result);
        }
      })["catch"](function(err) {
        if (callback) {
          return callback({
            message: "Failed to run " + options.command,
            details: err
          });
        } else {
          return console.error(err);
        }
      });
    })["catch"](function(err) {
      if (callback) {
        return callback({
          message: "Failed to run " + options.command,
          details: err
        });
      } else {
        return console.error(err);
      }
    });
  };

  return KiteHelper;

})(KDController);
/* BLOCK STARTS: /home/alexchistyakov/Applications/Rinstaller.kdapp/controllers/installer.coffee */
var RInstallerInstallerController,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

RInstallerInstallerController = (function(_super) {
  __extends(RInstallerInstallerController, _super);

  function RInstallerInstallerController(options, data) {
    var rinstallerInstallerController;
    if (options == null) {
      options = {};
    }
    rinstallerInstallerController = KD.singletons.rinstallerInstallerController;
    if (rinstallerInstallerController) {
      return rinstallerInstallerController;
    }
    RInstallerInstallerController.__super__.constructor.call(this, options, data);
    this.kiteHelper = new KiteHelper;
    this.kiteHelper.ready(this.bound("configureWatcher"));
    this.registerSingleton("rinstallerInstallerController", this, true);
  }

  RInstallerInstallerController.prototype.announce = function(message, state, percentage) {
    if (state != null) {
      this.updateState(state);
    }
    return this.emit("status-update", message, percentage);
  };

  RInstallerInstallerController.prototype.init = function() {
    return this.kiteHelper.getKite().then((function(_this) {
      return function(kite) {
        return kite.fsExists({
          path: installChecker
        }).then(function(state) {
          if (!state) {
            return _this.announce("" + appName + " not installed", NOT_INSTALLED);
          } else {
            return _this.announce("" + appName + " is installed", INSTALLED);
          }
        })["catch"](function(err) {
          _this.announce("Failed to see if " + appName + " is installed", FAILED);
          throw err;
        });
      };
    })(this));
  };

  RInstallerInstallerController.prototype.command = function(command, password) {
    var name;
    switch (command) {
      case INSTALL:
        name = "install";
        break;
      case REINSTALL:
        name = "reinstall";
        break;
      case UNINSTALL:
        name = "uninstall";
        break;
      default:
        throw "Command not registered.";
    }
    this.lastCommand = command;
    this.announce("" + (this.namify(name)) + "ing " + appName + "...", null, 0);
    this.watcher.watch();
    return this.kiteHelper.run({
      command: "\"\ncurl -sL " + scripts[name].url + " | bash -s " + user + " " + logger + "/" + (getSession()) + " " + this.mysqlPassword + " > " + logger + "/" + name + ".out",
      password: scripts[name].sudo ? password : null
    }, (function(_this) {
      return function(err, res) {
        _this.watcher.stopWatching();
        if (!err && res.exitStatus === 0) {
          return _this.init();
        } else {
          if (err && err.details.message === "Permissiond denied. Wrong password") {
            return _this.announce("Your password was incorrect, please try again", WRONG_PASSWORD);
          } else {
            _this.announce("Failed to " + name + ", please try again", FAILED);
            throw err;
          }
        }
      };
    })(this));
  };

  RInstallerInstallerController.prototype.configureWatcher = function() {
    return this.kiteHelper.run({
      command: "mkdir -p " + logger
    }, (function(_this) {
      return function(err) {
        if (!err) {
          _this.watcher = new FSWatcher({
            path: logger,
            recursive: true
          });
          return _this.watcher.fileAdded = function(change) {
            var name, percentage, status, _ref;
            name = change.file.name;
            _ref = name.split('-'), percentage = _ref[0], status = _ref[1];
            if ((percentage != null) && (status != null)) {
              return _this.announce(status, WORKING, percentage);
            }
          };
        } else {
          return console.error(err);
        }
      };
    })(this));
  };

  RInstallerInstallerController.prototype.updateState = function(state) {
    this.lastState = this.state;
    return this.state = state;
  };

  RInstallerInstallerController.prototype.namify = function(name) {
    return (name.split(/\s+/).map(function(word) {
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })).join(' ');
  };

  RInstallerInstallerController.prototype.isConfigured = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        if (!configuredChecker) {
          return resolve(true);
        }
        return _this.kiteHelper.getKite().then(function(kite) {
          return kite.fsExists({
            path: configuredChecker
          }).then(resolve)["catch"](reject);
        });
      };
    })(this));
  };

  return RInstallerInstallerController;

})(KDController);
/* BLOCK STARTS: /home/alexchistyakov/Applications/Rinstaller.kdapp/views/index.coffee */
var RInstallerMainView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

RInstallerMainView = (function(_super) {
  __extends(RInstallerMainView, _super);

  function RInstallerMainView(options, data) {
    if (options == null) {
      options = {};
    }
    options.cssClass = "" + appCSS + " main-view";
    this.Installer = new RInstallerInstallerController;
    RInstallerMainView.__super__.constructor.call(this, options, data);
  }

  RInstallerMainView.prototype.viewAppended = function() {
    this.addSubView(this.container = new KDCustomHTMLView({
      tagName: 'div',
      cssClass: 'container'
    }));
    this.container.addSubView(new KDCustomHTMLView({
      tagName: 'img',
      cssClass: 'logo',
      attributes: {
        src: logo
      }
    }));
    this.container.addSubView(this.progress = new KDProgressBarView({
      initial: 100,
      title: "Checking VM State..."
    }));
    this.container.addSubView(this.link = new KDCustomHTMLView({
      cssClass: 'hidden running-link'
    }));
    this.link.setSession = (function(_this) {
      return function() {
        return _this.Installer.isConfigured().then(function(configured) {
          var url;
          url = !configured ? configureURL : launchURL;
          if (url) {
            _this.link.updatePartial("Click here to launch " + appName + ":\n<a target='_blank' href='" + url + "'>" + url + "</a>");
            return _this.link.show();
          }
        })["catch"](function(error) {
          _this.link.updatePartial("Failed to check if " + appName + " is configured.");
          _this.link.show();
          return console.error(error);
        });
      };
    })(this);
    this.container.addSubView(this.buttonContainer = new KDCustomHTMLView({
      tagName: 'div',
      cssClass: 'button-container'
    }));
    this.buttonContainer.addSubView(this.installButton = new KDButtonView({
      title: "Install " + appName,
      cssClass: 'button green solid hidden',
      loader: {
        color: "#FFFFFF",
        diameter: 12
      },
      callback: (function(_this) {
        return function() {
          return _this.commitCommand(INSTALL);
        };
      })(this)
    }));
    this.buttonContainer.addSubView(this.reinstallButton = new KDButtonView({
      title: "Reinstall",
      cssClass: 'button solid hidden',
      loader: {
        color: "#FFFFFF",
        diameter: 12
      },
      callback: (function(_this) {
        return function() {
          return _this.commitCommand(REINSTALL);
        };
      })(this)
    }));
    this.buttonContainer.addSubView(this.uninstallButton = new KDButtonView({
      title: "Uninstall",
      cssClass: 'button red solid hidden',
      loader: {
        color: "#FFFFFF",
        diameter: 12
      },
      callback: (function(_this) {
        return function() {
          return _this.commitCommand(UNINSTALL);
        };
      })(this)
    }));
    this.container.addSubView(new KDCustomHTMLView({
      cssClass: "description",
      partial: description
    }));
    return KD.utils.defer((function(_this) {
      return function() {
        _this.Installer.on("status-update", _this.bound("statusUpdate"));
        return _this.Installer.init();
      };
    })(this));
  };

  RInstallerMainView.prototype.statusUpdate = function(message, percentage) {
    var element, _i, _len, _ref, _ref1;
    if (percentage == null) {
      percentage = 100;
    }
    this.link.hide();
    if (percentage === 100) {
      if ((_ref = this.Installer.state) === NOT_INSTALLED || _ref === INSTALLED || _ref === FAILED) {
        _ref1 = [this.installButton, this.reinstallButton, this.uninstallButton];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          element = _ref1[_i];
          element.hide().hideLoader();
        }
      }
    }
    switch (this.Installer.state) {
      case NOT_INSTALLED:
        this.installButton.show();
        return this.updateProgress(message, percentage);
      case INSTALLED:
        this.reinstallButton.show();
        this.uninstallButton.show();
        this.link.setSession();
        return this.updateProgress(message, percentage);
      case WORKING:
        this.Installer.state = this.Installer.lastState;
        return this.updateProgress(message, percentage);
      case FAILED:
        this.Installer.state = this.Installer.lastState;
        return this.statusUpdate(message, percentage);
      case WRONG_PASSWORD:
        this.Installer.state = this.Installer.lastState;
        return this.passwordModal(true, (function(_this) {
          return function(password) {
            if (password != null) {
              return _this.Installer.command(_this.Installer.lastCommand, password);
            }
          };
        })(this));
      default:
        return this.updateProgress(message, percentage);
    }
  };

  RInstallerMainView.prototype.commitCommand = function(command) {
    var name;
    switch (command) {
      case INSTALL:
        name = "install";
        break;
      case REINSTALL:
        name = "reinstall";
        break;
      case UNINSTALL:
        name = "uninstall";
        break;
      default:
        throw "Command not registered.";
    }
    if (scripts[name].sudo) {
      return this.passwordModal(false, (function(_this) {
        return function(password) {
          if (password != null) {
            _this["" + name + "Button"].showLoader();
            return _this.Installer.command(command, password);
          }
        };
      })(this));
    } else {
      this["" + name + "Button"].showLoader();
      return this.Installer.command(command);
    }
  };

  RInstallerMainView.prototype.passwordModal = function(error, cb) {
    var title;
    if (!this.modal) {
      if (!error) {
        title = "" + appName + " needs sudo access to continue";
      } else {
        title = "Incorrect password, please try again";
      }
      return this.modal = new KDModalViewWithForms({
        title: title,
        overlay: true,
        overlayClick: false,
        width: 550,
        height: "auto",
        cssClass: "new-kdmodal",
        cancel: (function(_this) {
          return function() {
            _this.modal.destroy();
            delete _this.modal;
            return cb();
          };
        })(this),
        tabs: {
          navigable: true,
          callback: (function(_this) {
            return function(form) {
              _this.modal.destroy();
              delete _this.modal;
              return cb(form.password);
            };
          })(this),
          forms: {
            "Sudo Password": {
              buttons: {
                Next: {
                  title: "Submit",
                  style: "modal-clean-green",
                  type: "submit"
                }
              },
              fields: {
                password: {
                  type: "password",
                  placeholder: "sudo password...",
                  validate: {
                    rules: {
                      required: true
                    },
                    messages: {
                      required: "password is required!"
                    }
                  }
                }
              }
            }
          }
        }
      });
    }
  };

  RInstallerMainView.prototype.updateProgress = function(status, percentage) {
    return this.progress.updateBar(percentage, '%', status);
  };

  return RInstallerMainView;

})(KDView);
/* BLOCK STARTS: /home/alexchistyakov/Applications/Rinstaller.kdapp/index.coffee */
var RInstallerController,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

RInstallerController = (function(_super) {
  __extends(RInstallerController, _super);

  function RInstallerController(options, data) {
    if (options == null) {
      options = {};
    }
    options.view = new RInstallerMainView;
    options.appInfo = {
      name: "R Installer",
      type: "application"
    };
    RInstallerController.__super__.constructor.call(this, options, data);
  }

  return RInstallerController;

})(AppController);

(function() {
  var view;
  if (typeof appView !== "undefined" && appView !== null) {
    view = new RInstallerMainView;
    return appView.addSubView(view);
  } else {
    return KD.registerAppClass(RInstallerController, {
      name: "Rinstaller",
      routes: {
        "/:name?/Rinstaller": null,
        "/:name?/alexchistyakov/Apps/Rinstaller": null
      },
      dockPath: "/alexchistyakov/Apps/Rinstaller",
      behavior: "application"
    });
  }
})();

/* KDAPP ENDS */
}).call();