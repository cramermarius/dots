// Credit: gcampax for some code from Workspace Indicator and Auto Move Windows,
// null4bl3 for some empty workspace detection ideas and lyonell for some code
// from All Windows for filtering lists of windows in workspaces.

const Clutter    = imports.gi.Clutter;
const Gio        = imports.gi.Gio;
const GObject    = imports.gi.GObject;
const Meta       = imports.gi.Meta;
const Shell      = imports.gi.Shell;
const St         = imports.gi.St;

const Mainloop   = imports.mainloop;
const Util       = imports.misc.util;

const Main       = imports.ui.main;
const PanelMenu  = imports.ui.panelMenu;
const PopupMenu  = imports.ui.popupMenu;
const WSPopup    = imports.ui.workspaceSwitcherPopup;

const Gettext    = imports.gettext;
const _ = Gettext.domain("workspace-buttons").gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const Prefs = Me.imports.prefs;
const PrefsDialog = "gnome-shell-extension-prefs workspace-buttons@carmanaught.gmail.com";

const KEYS = Me.imports.keys;

const WORKSPACE_SCHEMA = "org.gnome.desktop.wm.preferences";
const WORKSPACE_KEY = "workspace-names";

function debug(val) {
    val = `"[ Workspace Buttons ]--------> ${val}`;
    global.log(val);
}

let WorkspaceButton = GObject.registerClass(
class WorkspaceButton extends PanelMenu.Button {
    _init(params) {
        // Check for and get the index property
        if (params && params.hasOwnProperty("index")) {
            this.wsIndex = params.index;
            delete params.index;
        } else {
            this.wsIndex = -1;
        }

        // Use the wsIndex value to define the nameText
        super._init(0.0, `workspaceButton${this.wsIndex}`, false);

        this.workspaceManager = getWorkspaceManager();
        this.metaWorkspace = this.workspaceManager.get_workspace_by_index(this.wsIndex);
        // Change the button styling to reduce padding (normally "panel-button" style)
        this.actor.add_style_class_name("reduced-padding");

        // Initialize settings before anything else
        this._initSettings();

        // Create box layout
        this.workspaceButtonBox = new St.BoxLayout();

        // Create workspace label
        this.workspaceLabel = new St.Label({
            text: "",
            style: styleEmpty,
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });

        // Add the label to the button box and add the button box to this PanelMenu.Button
        this.workspaceButtonBox.add_child(this.workspaceLabel);
        this.actor.add_child(this.workspaceButtonBox);

        // Now that we've created the label, update the label text and style the label
        this._updateLabel();
        this._updateStyle();

        // Connect to various signals
        this._connectSignals();
        this._updateMenu();
    }

    destroy() {
        // Disconnect from signals we've connected to
        this._disconnectSignals();

        // Call parent
        super.destroy();
    }

    // I'm not sure about touch handling here. Ideally a regular touch should toggle the
    // menu, and a hold touch should bring the menu up after a short period, but I have
    // no touch device to test, so I'll leave the TOUCH_END to trigger the toggle.
    _onEvent(actor, event) {
        let doToggle = true;
        if (this.menu && (event.type() === Clutter.EventType.TOUCH_END ||  event.type() === Clutter.EventType.BUTTON_RELEASE || event.type() === Clutter.EventType.SCROLL)) {
            if (event.type() === Clutter.EventType.BUTTON_RELEASE) {
                if (this.clickActivate === true) {
                    let buttonCheck = (this.buttonActivate === "Primary") ? 1 : (this.buttonActivate === "Secondary") ? 3 : 1;
                    if (event.get_button() === buttonCheck && !this.menu.isOpen) {
                        this._setWorkspace(this.wsIndex);
                        doToggle = false;
                    }
                }
            }

            if (event.type() === Clutter.EventType.SCROLL) {
                this._scrollWorkspace(actor, event);
                doToggle = false;
            }

            if (doToggle === true) {
                this._updateMenu();
                this.menu.toggle();
            }
        }

        return Clutter.EVENT_PROPAGATE;
    }

    _initSettings() {
        // Event/action (wraparound)
        this.wraparoundMode = _settings.get_boolean(KEYS.wrapAroundMode);
        this.clickActivate = _settings.get_boolean(KEYS.clickToActivate);
        this.buttonActivate = _settings.get_string(KEYS.buttonToActivate);
        // Workspace style
        this.emptyWorkspaceStyle = _settings.get_boolean(KEYS.emptyWorkStyle);
        this.urgentWorkspaceStyle = _settings.get_boolean(KEYS.urgentWorkStyle);
        // Workspace label
        this.emptyWorkspaceHide = _settings.get_boolean(KEYS.emptyWorkHide);
        this.wkspNumber = _settings.get_boolean(KEYS.numLabel);
        this.wkspName = _settings.get_boolean(KEYS.nameLabel);
        this.wkspLabelSeparator = _settings.get_string(KEYS.labelSeparator);
        this.indStyle = _settings.get_boolean(KEYS.indLabel);
        this.activityIndicators = [];
        this.activityIndicators = _settings.get_strv(KEYS.labelIndicators);
    }

    _connectSignals() {
        // Seperate the signals into arrays to make it easier to disconnect them
        // by looping through signals with identical disconnect methods
        this._displaySignals = [];
        this._settingsSignals = [];
        this._workspaceSignals = [];
        this._workspaceManagerSignals = [];

        this._windowTracker = Shell.WindowTracker.get_default();
        let display = global.display;

        // These are purely settings updates
        this._settingsSignals.push(_settings.connect("changed::" + KEYS.wrapAroundMode, () => {
            this.wraparoundMode = _settings.get_boolean(KEYS.wrapAroundMode);
        }));
        this._settingsSignals.push(_settings.connect("changed::" + KEYS.clickToActivate, () => {
            this.clickActivate = _settings.get_boolean(KEYS.clickToActivate);
        }));
        this._settingsSignals.push(_settings.connect("changed::" + KEYS.buttonToActivate, () => {
            this.buttonActivate = _settings.get_string(KEYS.buttonToActivate);
        }));

        // Change the buttons style (applied to the label)
        this._settingsSignals.push(_settings.connect("changed::" + KEYS.emptyWorkStyle, () => {
            this.emptyWorkspaceStyle = _settings.get_boolean(KEYS.emptyWorkStyle);
            this._updateStyle();
        }));
        this._settingsSignals.push(_settings.connect("changed::" + KEYS.urgentWorkStyle, () => {
            this.urgentWorkspaceStyle = _settings.get_boolean(KEYS.urgentWorkStyle);
            this._updateStyle();
        }));
        this._settingsSignals.push(_settings.connect("changed::" + KEYS.emptyWorkHide, () => {
            this.emptyWorkspaceHide = _settings.get_boolean(KEYS.emptyWorkHide);
            this._updateStyle();
        }));

        // Change the text of the labels as needed
        this._settingsSignals.push(_settings.connect("changed::" + KEYS.numLabel, () => {
            this.wkspNumber = _settings.get_boolean(KEYS.numLabel);
            this._updateLabel();
        }));
        this._settingsSignals.push(_settings.connect("changed::" + KEYS.nameLabel, () => {
            this.wkspName = _settings.get_boolean(KEYS.nameLabel);
            this._updateLabel();
        }));
        this._settingsSignals.push(_settings.connect("changed::" + KEYS.labelSeparator, () => {
            this.wkspLabelSeparator = _settings.get_string(KEYS.labelSeparator);
            this._updateLabel();
        }));
        this._settingsSignals.push(_settings.connect("changed::" + KEYS.indLabel, () => {
            this.indStyle = _settings.get_boolean(KEYS.indLabel);
            this._updateLabel();
            this._updateStyle();
        }));
        this._settingsSignals.push(_settings.connect("changed::" + KEYS.labelIndicators, () => {
            this.activityIndicators = _settings.get_strv(KEYS.labelIndicators);
            this._updateLabel();
        }));

        // Detect workspace name changes and update the button labels accordingly
        this._wkspNameSettings = new Gio.Settings({ schema_id: WORKSPACE_SCHEMA });
        this._wkspNameSignal = this._wkspNameSettings.connect("changed::" + WORKSPACE_KEY, () => {
            this._updateLabel();
        });

        // We'll need to update the workspace style when the workspace is changed and
        // also update the label to switch to/from the active workspace indicator
        this._workspaceManagerSignals.push(this.workspaceManager.connect_after("workspace-switched", (screenObj, wsFrom, wsTo, wsDirection, wsPointer) => {
            if (this.wsIndex === wsFrom || this.wsIndex === wsTo) {
                this._updateMenu();
                this._updateStyle();
                this._updateLabel();
            }
        }));

        // This signal handler essentially replaces the "display" based 'window-created' signal
        // handler and helps trigger updates when windows are moved to workspaces without the
        // workspace itself being switched in the same action. This ignores windows considered
        // to be "on all workspaces".
        this._workspaceSignals.push(this.metaWorkspace.connect_after("window-added", (metaWorkspace, metaWindow) => {
            if (this.wsIndex === metaWorkspace.index() && metaWindow.is_on_all_workspaces() !== true) {
                this._updateMenu();
                this._updateStyle();
                this._updateLabel();
            }
        }));
        // This signal handler essentially replaces the "screen" based 'window-left-monitor'
        // signal and helps trigger updates when windows are removed from a workspace, ignoring
        // windows that are considered "on all workspaces".
        this._workspaceSignals.push(this.metaWorkspace.connect_after("window-removed", (metaWorkspace, metaWindow) => {
            if (this.wsIndex === metaWorkspace.index() && metaWindow.is_on_all_workspaces() !== true) {
                this._updateMenu();
                this._updateStyle();
                this._updateLabel();
            }
        }));

        // Connect AFTER we've got display (let display above) to ensure we can get the signal
        // on "MetaDisplay" and avoid errors and so the handler from ShellWindowTracker has
        // already run. We can then change the style of the workspaces that trigger these.
        this._displaySignals.push(display.connect_after("window-demands-attention", (metaDisplay, metaWindow) => {
            if (this.wsIndex === metaWindow.get_workspace().index()) {
                this._updateStyle();
            }
        }));
        this._displaySignals.push(display.connect_after("window-marked-urgent", (metaDisplay, metaWindow) => {
            if (this.wsIndex === metaWindow.get_workspace().index()) {
                this._updateStyle();
            }
        }));

        // Connect to the menu open-state-changed signal and update the menu
        this._menuStateSignal = this.menu.connect("open-state-changed", () => {
            this._updateMenu();
            this._updateStyle();
            this._updateLabel();
        });

        // Connect to the signals for enter-event/leave-event for this button and change the
        // style as needed.
        this._hoverOverSignal = this.actor.connect("enter-event", () => {
            // Change hover (except for urgent or if the menu is already open)
            if (!this.workspaceLabel._urgent) {
                // Add a timeout here so that the menu open check isn't done before the menu
                // has actually had a chance to open.
                Mainloop.timeout_add(1, () => {
                    if (!this.menu.isOpen) {
                        this.workspaceLabel.set_style(styleHover);
                    }
                    return false;
                });
            }
        })
        this._hoverOutSignal = this.actor.connect("leave-event", () => {
            // Change style back
            if (!this.workspaceLabel._urgent) {
                this._updateStyle();
            }
        })
    }

    _disconnectSignals() {
        let display = global.display;

        // Disconnect settings signals
        for (let x = 0; x < this._settingsSignals.length; x++) {
            _settings.disconnect(this._settingsSignals[x]);
        }
        this._settingsSignals = [];
        this._settingsSignals = null;

        this._wkspNameSettings.disconnect(this._wkspNameSignal);

        // Disconnect screen signals
        for (let x = 0; x < this._workspaceManagerSignals.length; x++) {
            this.workspaceManager.disconnect(this._workspaceManagerSignals[x]);
        }
        this._workspaceManagerSignals = [];
        this._workspaceManagerSignals = null;

        for (let x = 0; x < this._workspaceSignals.length; x++) {
            this.metaWorkspace.disconnect(this._workspaceSignals[x]);
        }
        this._workspaceSignals = [];
        this._workspaceSignals = null;

        // Disconnect display signals
        for (let x = 0; x < this._displaySignals.length; x++) {
            display.disconnect(this._displaySignals[x]);
        }
        this._displaySignals = [];
        this._displaySignals = null;

        // Disconnect various other signals
        this.menu.disconnect(this._menuStateSignal);
        this.actor.disconnect(this._hoverOverSignal);
        this.actor.disconnect(this._hoverOutSignal);
    }

    _updateMenu() {
        this.menu.removeAll();
        let emptyMenu = true;

        let workspaceName = Meta.prefs_get_workspace_name(this.wsIndex);
        // Stop executing if the workspace is undefined, since it means the
        // workspace is probably gone.
        if (this.metaWorkspace === null) { return false; }
        let windowList = this.metaWorkspace.list_windows();
        let stickyWindows = windowList.filter(function(w) {
            return !w.is_skip_taskbar() && w.is_on_all_workspaces();
        });
        let regularWindows = windowList.filter(function(w) {
            return !w.is_skip_taskbar() && !w.is_on_all_workspaces();
        });

        let workspaceActivate = new PopupMenu.PopupMenuItem(`${_("Activate Workspace")} ${(this.wsIndex + 1)}`);
        workspaceActivate.connect("activate", () => { this._setWorkspace(this.wsIndex); });
        this.menu.addMenuItem(workspaceActivate);
        let prefsActivate = new PopupMenu.PopupMenuItem(_("Settings"));
        prefsActivate.connect("activate", () => { Util.trySpawnCommandLine(PrefsDialog); });
        this.menu.addMenuItem(prefsActivate);
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        if (regularWindows.length > 0) {
            let workspaceLabel = new PopupMenu.PopupMenuItem(`${(this.wsIndex + 1)}: ${workspaceName}`);
            workspaceLabel.actor.reactive = false;
            workspaceLabel.actor.can_focus = false;
            if (this.wsIndex == this.workspaceManager.get_active_workspace().index()) {
                workspaceLabel.setOrnament(PopupMenu.Ornament.DOT);
            }
            this.menu.addMenuItem(workspaceLabel);

            for ( let i = 0; i < regularWindows.length; ++i ) {
                let metaWindow = regularWindows[i];
                let windowItem = new PopupMenu.PopupBaseMenuItem();
                windowItem.connect("activate", () => { this._activateWindow(this.metaWorkspace, metaWindow) });
                windowItem._window = regularWindows[i];

                let windowApp = this._windowTracker.get_window_app(windowItem._window);
                let windowBox = new St.BoxLayout( { x_expand: true  } );
                // Stop executing if windowApp is null, since it means the window is probably gone.
                if (windowApp === null) { return false; }
                windowItem._icon = windowApp.create_icon_texture(16);
                if (metaWindow.urgent || metaWindow.demands_attention) {
                    windowBox.add(new St.Label({ text: this._ellipsizeWindowTitle(metaWindow),
                        x_expand: true, style: styleUrgent }));
                } else {
                    windowBox.add(new St.Label({ text: this._ellipsizeWindowTitle(metaWindow),
                        x_expand: true }));
                }
                windowBox.add(new St.Label({ text: "   " }));
                windowBox.add(windowItem._icon);
                windowItem.actor.add_actor(windowBox);
                if (metaWindow.appears_focused === true) {
                    windowItem.setOrnament(PopupMenu.Ornament.DOT);
                }
                this.menu.addMenuItem(windowItem);
                emptyMenu = false;
            }
        }

        if (emptyMenu) {
            let emptyItem = new PopupMenu.PopupMenuItem(_("No open windows"))
            emptyItem.actor.reactive = false;
            emptyItem.actor.can_focus = false;
            this.menu.addMenuItem(emptyItem);
        }
    }

    _updateStyle() {
        this.currentWorkSpace = this.workspaceManager.get_active_workspace().index()

        let workspaceName = Meta.prefs_get_workspace_name(this.wsIndex);
        // Stop executing if the workspace is undefined, since it means the
        // workspace is probably gone.
        if (this.metaWorkspace == undefined) { return false; }
        let windowList = this.metaWorkspace.list_windows();
        let stickyWindows = windowList.filter(function (w) {
            return !w.is_skip_taskbar() && w.is_on_all_workspaces();
        });
        let regularWindows = windowList.filter(function(w) {
            return !w.is_skip_taskbar() && !w.is_on_all_workspaces();
        });
        let urgentWindows = windowList.filter(function(w) {
            return w.urgent || w.demands_attention;
        });

        // Show the workspace button if it's hidden when the workspace is current
        if (this.wsIndex === this.currentWorkSpace && !this.visible)
            this.visible = true;
        // Also show the workspace button if the hidden workspace option is not set
        if (!this.emptyWorkspaceHide && !this.visible)
            this.visible = true;

        this.workspaceLabel._urgent = false;
        if (this.wsIndex !== this.currentWorkSpace && urgentWindows.length > 0 && this.urgentWorkspaceStyle === true) {
            this.workspaceLabel._urgent = true;
            this.workspaceLabel.style = styleUrgent;
        } else if (this.wsIndex === this.currentWorkSpace) {
            this.workspaceLabel.style = styleActive;
        } else if (regularWindows.length > 0) {
            this.workspaceLabel.style = styleInactive;
        } else {
            let emptyStyle = (this.emptyWorkspaceStyle === true) ? styleEmpty : styleInactive;
            this.workspaceLabel.style = emptyStyle;

            // Hide the workspace button if configured (hidden workspaces lose accessiblity)
            if (this.wsIndex !== this.currentWorkSpace && this.emptyWorkspaceHide)
                this.visible = false;
        }
    }

    _updateLabel() {
        let workspaceName = Meta.prefs_get_workspace_name(this.wsIndex);
        this.currentWorkSpace = this.workspaceManager.get_active_workspace().index();

        let wsNum = "";
        let wsName = "";
        let str = "";
        let actIndicator = false;

        let emptyName = false;
        // Check that workspace has label (returns "Workspace <Num>" if not),
        // which also explicitly blocks use of the word "Workspace" in a label.
        if (workspaceName.includes("Workspace")) {
            emptyName = true;
        }

        wsNum = (this.wsIndex + 1).toString();
        wsName = workspaceName;

        // Change workspace label depending on the use of activity indicators
        if (this.wkspNumber === true && this.wkspName === false) {
            str = wsNum;
        }
        if (this.wkspNumber === false && this.wkspName === true) {
            if (this.indStyle === true) { actIndicator = true; }
            else {
                if (emptyName === true) { str = wsNum; }
                else { str = wsName; }
            }
        }
        if (this.wkspNumber === true && this.wkspName === true) {
            if (this.indStyle === true) {
                actIndicator = true;
                str = wsNum + this.wkspLabelSeparator;
            } else {
                if (emptyName === true) { str = wsNum; }
                else { str = wsNum + this.wkspLabelSeparator + wsName; }
            }
        }

        // Stop executing if the workspace is undefined, since it means the
        // workspace is probably gone.
        if (this.metaWorkspace === null) { return false; }
        let windowList = this.metaWorkspace.list_windows();
        let stickyWindows = windowList.filter(function (w) {
            return !w.is_skip_taskbar() && w.is_on_all_workspaces();
        });
        let regularWindows = windowList.filter(function(w) {
            return !w.is_skip_taskbar() && !w.is_on_all_workspaces();
        });
        let urgentWindows = windowList.filter(function(w) {
            return w.urgent || w.demands_attention;
        });

        // Do checks to determine the format of the label
        if (this.wsIndex === this.currentWorkSpace) {
            str = (actIndicator === true) ? str + this.activityIndicators[2] : str;
        } else if (urgentWindows.length > 0 || regularWindows.length > 0) {
            str = (actIndicator === true) ? str + this.activityIndicators[1] : str;
        } else if (regularWindows.length === 0 && this.emptyWorkspaceStyle === true) {
            str = (actIndicator === true) ? str + this.activityIndicators[0] : str;
        } else if (regularWindows.length > 0 || this.wsIndex !== this.currentWorkSpace) {
            str = (actIndicator === true) ? str + this.activityIndicators[1] : str;
        }

        this.workspaceLabel.text = str;
    }

    _setWorkspace(index) {
        // Taken from workspace-indicator
        if (index >= 0 && index < this.workspaceManager.n_workspaces) {
            let metaWorkspace = this.workspaceManager.get_workspace_by_index(index);
            metaWorkspace.activate(global.get_current_time());
        }
    }

    _activateScroll(offSet) {
        this.currentWorkSpace = this.workspaceManager.get_active_workspace().index() + offSet;
        let workSpaces = this.workspaceManager.n_workspaces - 1;
        let scrollBack = 0;
        let scrollFwd = 0;

        if (this.wraparoundMode ===  true) {
            scrollBack = workSpaces;
            scrollFwd = 0;
        } else {
            scrollBack = 0;
            scrollFwd = workSpaces;
        }

        if (this.currentWorkSpace < 0) this.currentWorkSpace = scrollBack;
        if (this.currentWorkSpace > workSpaces) this.currentWorkSpace = scrollFwd;

        this._setWorkspace(this.currentWorkSpace);
    }

    _scrollWorkspace(actor, event) {
        let direction = event.get_scroll_direction();
        let offSet = 0;

        if (direction === Clutter.ScrollDirection.DOWN) {
            offSet = 1;
        } else if (direction === Clutter.ScrollDirection.UP) {
            offSet = -1;
        } else {
            return;
        }

        this._activateScroll(offSet);
    }

    _activateWindow(metaWorkspace, metaWindow) {
        if (metaWorkspace.index() !== this.wsIndex) {
            if(!metaWindow.is_on_all_workspaces()) {
                metaWorkspace.activate_with_focus(metaWindow, global.get_current_time());
            } else {
                metaWindow.activate(global.get_current_time());
            }
        } else {
            metaWindow.activate(global.get_current_time());
        }
    }

    _ellipsizeString(str, len) {
        if(str.length > len) {
            return `${str.substr(0, len)}...`;
        }
        return str;
    }

    _ellipsizeWindowTitle(window) {
        // If the get_title() returns a null value it causes an error in the
        // _ellipsizeString function, which this prevents by providing a string
        // for the function to use. This seems necessary to avoid spamming the
        // log during login of a Wayland session.
        if (window.get_title() === null) { return "Unnamed window"}
        else { return this._ellipsizeString(window.get_title(), 45); }
    }
});

let _settings;
let globalSettingsSignals = null;

let styleUrgent;
let styleHover;
let styleActive;
let styleInactive;
let styleEmpty;

let panelBox;
let buttonBox;
let workspaceButton;
let workspaceSignals;

let workSwitcherProto;
let workSwitcherConflict;

function getWorkspaceManager() {
    let workspaceManager;

    if (global.workspace_manager === undefined) {
        workspaceManager = global.screen
    } else {
        workspaceManager = global.workspace_manager
    }

    return workspaceManager;
}

function updateStyleList() {
    styleUrgent     = "color:" + _settings.get_string(KEYS.urgentColor);
    styleHover      = "color:" + _settings.get_string(KEYS.hoverColor);
    styleActive     = "color:" + _settings.get_string(KEYS.activeColor);
    styleInactive   = "color:" + _settings.get_string(KEYS.inactiveColor);
    styleEmpty      = "color:" + _settings.get_string(KEYS.emptyColor);
}

function updateButtonStyles() {
    for (let x = 0; x < workspaceButton.length; x++) {
        workspaceButton[x]._updateStyle();
    }
}

function buildWorkspaceButtons () {
    let workspaceManager = getWorkspaceManager();
    let buttonsIndexChange = _settings.get_boolean(KEYS.buttonsPosChange);
    let buttonsIndex = (buttonsIndexChange === true) ? _settings.get_int(KEYS.buttonsPosIndex) : 1
    panelBox = _settings.get_string(KEYS.buttonsPos)
    workspaceButton = [];

    var workSpaces = 0;
    workSpaces = workspaceManager.n_workspaces;
    for (let x = 0; x < workSpaces; x++) {
        workspaceButton[x] = new WorkspaceButton({index: x});
        buttonBox.add_child(workspaceButton[x].container);
    }

    // Add the buttonBox in place of a single indicator
    if (panelBox === 'left') {
        // Do an additional check for the _leftBox to make sure it's after the activities button by default.
        Main.panel[`_${panelBox}Box`].insert_child_at_index(buttonBox, (Main.panel[`_${panelBox}Box`].get_n_children() - 2 + buttonsIndex));
    } else {
        Main.panel[`_${panelBox}Box`].insert_child_at_index(buttonBox, buttonsIndex);
    }

    // Below code is based on _addToPanelBox() with some changes, ensuring that the indicators
    // are still accessible and the menus work correctly.

    // Hook-up each panel indicator almost the same as _addToPanelBox()
    for (let buttonContainer of buttonBox.get_children()) {

        // Get the actual button, not the container
        let button = buttonContainer.get_child();

        // Check that if there is already a role for the button/indicator (there shouldn't be).
        if (Main.panel.statusArea[button.accessible_name]) {
            log('Warning: there is already a status indicator for role ' + button.accessible_name +
            '. Trying to destroy button');
            button.destroy();
            continue;
        }

        if (button.menu)
            Main.panel.menuManager.addMenu(button.menu);

        // statusArea[role] still points to real indicator
        Main.panel.statusArea[`${button.accessible_name}`] = button;

        let destroyId = button.connect('destroy', emitter => {
            delete Main.panel.statusArea[button.accessible_name];
            emitter.disconnect(destroyId);
        });

        // Add menu-set callbacks for buttons
        button.connect('menu-set', Main.panel._onMenuSet.bind(Main.panel));
        Main.panel._onMenuSet(button);
    }
}

function destroyWorkspaceButtons () {
    // Get the button containers
    for (let buttonContainer of buttonBox.get_children()) {
        // Get the actual button, not the container
        let button = buttonContainer.get_child();
        button.destroy();
    }

    buttonBox.destroy_all_children();
}

function setPosition() {
    destroyWorkspaceButtons();
    let oldPanelBox = panelBox;
    Main.panel[`_${oldPanelBox}Box`].remove_actor(buttonBox);
    Mainloop.timeout_add(100, () => {
        buildWorkspaceButtons();
        return false;
    });
}

// Detect other workspace switcher popup extensions so that we don't conflict. Only
// the existence of another workspace switcher instead of checking if the potential
// conflict is enabled is checked, because we can't chance that another extension
// might be enabled sometime after this detection.
function detectSwitcherExtensions() {
    let extensionList = Object.keys(ExtensionUtils.extensions);
    let switcherExtensions = ["disable-workspace-switcher-popup@github.com",
    "no-workspace-switcher-popup@devbury.com",
    "workspace-grid@mathematical.coffee.gmail.com",
    "wsmatrix@martin.zurowietz.de"];
    for (let i = 0; i < switcherExtensions.length; i++) {
        // If we've already detected an extenion, don't bother checking the others
        if (workSwitcherConflict !== true) {
            if (extensionList.includes(switcherExtensions[i])) {
                workSwitcherConflict = true;
            } else {
                workSwitcherConflict = false;
            }
        }
    }
}

// Credit to windsorschmidt/disable-workspace-switcher-popup for the code used here
function workspaceSwitcherPopup(popupDisable) {
    // Exit the function if a conflict has been detected so that we don't try to do
    // conflicting workspace switcher function overrides.
    if (workSwitcherConflict === true) { return; }

    if (popupDisable !== false) {
        popupDisable = _settings.get_boolean(KEYS.workSwitcherPopup);
    }

    if (popupDisable) {
        workSwitcherProto = WSPopup.WorkspaceSwitcherPopup.prototype._show;
        WSPopup.WorkspaceSwitcherPopup.prototype._show = function() { return false };
    } else {
        WSPopup.WorkspaceSwitcherPopup.prototype._show = workSwitcherProto;
        workSwitcherProto = null;
    }
}

function init () {
    _settings = Convenience.getSettings();
    updateStyleList();
    // Get this to define which panel box to work with (_leftBox/_centerBox/_rightBox)
    panelBox = _settings.get_string(KEYS.buttonsPos);
    // With the WorkspaceButton being changed to be an ES6 style class, we'll set the
    // signals variables to null here.
    WorkspaceButton._displaySignals = null;
    WorkspaceButton._settingsSignals = null;
    WorkspaceButton._workspaceManagerSignals = null;
}

function enable() {
    let workspacesChanged = false;
    let workspaceManager = getWorkspaceManager();
    buttonBox = new St.BoxLayout();
    buttonBox.accessible_name = "buttonBox"
    // Get the 'old' workspace switcher _show function
    workSwitcherProto = WSPopup.WorkspaceSwitcherPopup.prototype._show;

    workspaceSignals = [];
    // It's easiest if we rebuild the buttons when workspaces are removed or added
    workspaceSignals.push(workspaceManager.connect_after("notify::n-workspaces", (metaScreen, paramSpec) => {
        // Only change the workspaces once, after a delay to allow for workspaces to be removed and
        // to prevent errors with sudden repeated workspace count changes.
        if (workspacesChanged === false) {
            Mainloop.timeout_add(100, () => {
                destroyWorkspaceButtons();
                buildWorkspaceButtons();
                // Reset this in the timeout so that future workspace changes will work.
                workspacesChanged = false;
                return false;
            });
            // Use this to avoid adding new timeouts to the Mainloop.
            workspacesChanged = true;
        }
    }));

    // Set signals to get changes when made to preferences
    globalSettingsSignals = [];

    // Changes to these settings require a rebuild of the buttons
    globalSettingsSignals.push(_settings.connect_after("changed::" + KEYS.buttonsPos, () => {
        setPosition();
    }));
    globalSettingsSignals.push(_settings.connect_after("changed::" + KEYS.buttonsPosChange, () => {
        setPosition();
    }));
    globalSettingsSignals.push(_settings.connect_after("changed::" + KEYS.buttonsPosIndex, () => {
        setPosition();
    }));

    // We need to trigger button color updates when any one of these is changed
    globalSettingsSignals.push(_settings.connect_after("changed::" + KEYS.urgentColor, () => {
        updateStyleList();
        updateButtonStyles();
    }));
    globalSettingsSignals.push(_settings.connect_after("changed::" + KEYS.hoverColor, () => {
        updateStyleList();
        updateButtonStyles();
    }));
    globalSettingsSignals.push(_settings.connect_after("changed::" + KEYS.activeColor, () => {
        updateStyleList();
        updateButtonStyles();
    }));
    globalSettingsSignals.push(_settings.connect_after("changed::" + KEYS.inactiveColor, () => {
        updateStyleList();
        updateButtonStyles();
    }));
    globalSettingsSignals.push(_settings.connect_after("changed::" + KEYS.emptyColor, () => {
        updateStyleList();
        updateButtonStyles();
    }));

    // Handle the enabling/disabling of the workspace switcher popup
    globalSettingsSignals.push(_settings.connect_after("changed::" + KEYS.workSwitcherPopup, () => {
        workspaceSwitcherPopup();
    }));

    Mainloop.timeout_add(500, () => {
        buildWorkspaceButtons();
        detectSwitcherExtensions();
        workspaceSwitcherPopup();
        return false;
    });
}

function disable() {
    let workspaceManager = getWorkspaceManager();

    for (let x = 0; x < workspaceSignals.length; x++) {
        workspaceManager.disconnect(workspaceSignals[x]);
    }
    workspaceSignals = [];
    workspaceSignals = null;

    for (let x = 0; x < globalSettingsSignals.length; x++) {
        _settings.disconnect(globalSettingsSignals[x]);
    }
    globalSettingsSignals = [];
    globalSettingsSignals = null;

    destroyWorkspaceButtons();
    buttonBox.destroy();

    workspaceSwitcherPopup(false);
    workSwitcherProto == null;
}
