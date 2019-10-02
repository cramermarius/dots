/* Code derived by rastersoft from Remove App Menu (created by zpydr), to adapt it to Gnome Shell normative */

const Main = imports.ui.main;

var signalShow;

function init() {
    /* Nothing to do here */
}

function enable() {

    signalShow=Main.panel.statusArea.appMenu.actor.connect("show",function () {
        Main.panel.statusArea.appMenu.actor.hide();
    });
    Main.panel.statusArea.appMenu.actor.hide();
}

function disable() {
    Main.panel.statusArea.appMenu.actor.disconnect(signalShow);
    Main.panel.statusArea.appMenu.actor.show();
}

