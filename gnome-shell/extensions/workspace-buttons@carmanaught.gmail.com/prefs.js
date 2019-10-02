const Gdk       = imports.gi.Gdk;
const Gio       = imports.gi.Gio;
const GLib      = imports.gi.GLib;
const GObject   = imports.gi.GObject;
const Gtk       = imports.gi.Gtk;
const Pango     = imports.gi.Pango;
const Gettext   = imports.gettext;

const _ = Gettext.domain("workspace-buttons").gettext;
const _N = function(x) { return x; }

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const KEYS = Me.imports.keys;

const POSITIONS = [
    "left",
    "center",
    "right"
];
const BUTTONS = [
    "Primary",
    "Secondary"
];

function debug(val) {
    val = `[ Workspace Buttons ]--------> ${val}`;
    global.log(val);
}

// Color functions (credit to hackedbellini/gnome-shell-notifications-alert)

function scaleRound(value) {
    // Based on gtk/gtkcoloreditor.c
    value = Math.floor((value / 255) + 0.5);
    value = Math.max(value, 0);
    value = Math.min(value, 255);
    return value;
}

function decToHex(value) {
    value = value.toString(16);
    while (value.length < 2) { value = "0" + value; }
    return value;
}

function getColorByHex(hex) {
    let colorArray = Gdk.Color.parse(hex);
    let color = null;
    if (colorArray[0]) { color = colorArray[1]; }
    // On any error, default to green
    else { color = new Gdk.Color({green: 65535}); }
    return color;
}

function getHexByColor(color) {
    let red = scaleRound(color.red);
    let green = scaleRound(color.green);
    let blue = scaleRound(color.blue);
    return "#" + decToHex(red) + decToHex(green) + decToHex(blue);
}

const WorkspaceButtonsSettings = GObject.registerClass(
    class WorkspaceButtonsSettings extends Gtk.Grid {

    _init(params) {
        super._init(params);
        this.margin = 10;
        this.column_spacing = 50;
        this.row_spacing = 10;
	    this._settings = Convenience.getSettings();

        // Start building the objects

        // Position Settings label
        let lblPosTitle = new Gtk.Label({
            label: "<b>" + _("Position Settings") + "</b>",
            hexpand: true,
            halign: Gtk.Align.START,
            use_markup: true
        });
        // Easiest way to understand attach format:-
        //   Object, Column, Row, ColSpan, RowSpan
        this.attach(lblPosTitle, 0, 0, 3, 1);

        // Workspace position label
        let lblPosition = new Gtk.Label({
            label: _("Panel region to put the buttons in"),
            margin_left: 15,
            halign: Gtk.Align.START
        });
        this.attach(lblPosition, 0, 1, 2, 1);

        // Workspace position dropdown
        this.cmbPosition = new Gtk.ComboBoxText({
            halign: Gtk.Align.END
        });
        for (let i = 0; i < POSITIONS.length; i++) {
            this.cmbPosition.append_text(POSITIONS[i].charAt(0).toUpperCase() + POSITIONS[i].slice(1));
        }
        this.cmbPosition.set_active(POSITIONS.indexOf(this._settings.get_string(KEYS.buttonsPos)));
        this.cmbPosition.connect ("changed", () => {
            this._settings.set_string(KEYS.buttonsPos, POSITIONS[this.cmbPosition.active]);
        });
        this.attach(this.cmbPosition, 2, 1, 1, 1);

        // Position Index enable label
        let lblPositionEnable = new Gtk.Label({
            label: _("Change the index for the buttons position"),
            margin_left: 15,
            halign: Gtk.Align.START
        });
        this.attach(lblPositionEnable, 0, 2, 2, 1);

        // Position Index enable switch
        let swPositionIndexEnable = new Gtk.Switch({
            active: this._settings.get_boolean(KEYS.buttonsPosChange),
            halign: Gtk.Align.END
        });
        swPositionIndexEnable.connect ("notify::active", () => {
             this._settings.set_boolean(KEYS.buttonsPosChange, swPositionIndexEnable.active);
             lblPositionIndex.set_sensitive(swPositionIndexEnable.active);
             this.spnPosition.set_sensitive(swPositionIndexEnable.active);
        });
        this.attach(swPositionIndexEnable, 2, 2, 1, 1);

        // Position Index label
        let lblPositionIndex = new Gtk.Label({
            label: _("Specify position index"),
            margin_left: 15,
            sensitive: this._settings.get_boolean(KEYS.buttonsPosChange),
            halign: Gtk.Align.START
        });
        this.attach(lblPositionIndex, 0, 3, 2, 1);

        // Position Index adjustment
        this._adjPositionIndex = new Gtk.Adjustment ({
            //Don't set value here, we'll get it after creating the spin button
            lower: -999,
            upper: 999,
            step_increment: 1,
            page_increment: 10
        });

        // Position Index spinbutton
        this.spnPosition = new Gtk.SpinButton ({
            adjustment: this._adjPositionIndex,
            sensitive: this._settings.get_boolean(KEYS.buttonsPosChange) === true ? true : false,
            halign: Gtk.Align.END
        });
        this.spnPosition.set_value (this._settings.get_int(KEYS.buttonsPosIndex));
        this.spnPosition.set_digits (0);
        this.spnPosition.set_wrap (false);
        this.spnPosition.connect ("value-changed", () => {
            this._settings.set_int(KEYS.buttonsPosIndex, this.spnPosition.value);
        });
        this.attach(this.spnPosition, 2, 3, 1, 1);

        // General Settings label
        let lblGenTitle = new Gtk.Label({
            label: "<b>" + _("General Settings") + "</b>",
            hexpand: true,
            halign: Gtk.Align.START,
            use_markup: true
        });
        this.attach(lblGenTitle, 0, 4, 3, 1);

        // Show Wrap Around label
        let lblWrapAround = new Gtk.Label({
            label: _("Wrap around when scrolling over the workspace bar"),
            margin_left: 15,
            halign: Gtk.Align.START
        });
        this.attach(lblWrapAround, 0, 5, 2, 1);

        // Show Wrap Around switch
        let swWrapAround = new Gtk.Switch({
            active: this._settings.get_boolean(KEYS.wrapAroundMode),
            halign: Gtk.Align.END
        });
        swWrapAround.connect ("notify::active", () => {
            this._settings.set_boolean(KEYS.wrapAroundMode, swWrapAround.active);
        });
        this.attach(swWrapAround, 2, 5, 1, 1);

        // Show Click to Activate label
        let lblClickActivate = new Gtk.Label({
            label: _("Click to activate workspaces") + "\n<span font_size='small'>" + _("One button will activate, the other will open the menu") + "</span>",
            margin_left: 15,
            use_markup: true,
            halign: Gtk.Align.START
        });
        this.attach(lblClickActivate, 0, 6, 2, 1);

        // Show Click to Activate switch
        let swClickActivate = new Gtk.Switch({
            active: this._settings.get_boolean(KEYS.clickToActivate),
            halign: Gtk.Align.END
        });
        swClickActivate.connect ("notify::active", () => {
            this._settings.set_boolean(KEYS.clickToActivate, swClickActivate.active);
            lblButtonActivate.set_sensitive(swClickActivate.active);
            this.cmbButtonActivate.set_sensitive(swClickActivate.active);
        });
        this.attach(swClickActivate, 2, 6, 1, 1);

        // Show Button to Activate label
        let lblButtonActivate = new Gtk.Label({
            label: _("Button to activate workspaces"),
            sensitive: this._settings.get_boolean(KEYS.clickToActivate),
            margin_left: 15,
            halign: Gtk.Align.START
        });
        this.attach(lblButtonActivate, 0, 7, 2, 1);

        // Show Button to Activate switch
        this.cmbButtonActivate = new Gtk.ComboBoxText({
            sensitive: this._settings.get_boolean(KEYS.clickToActivate),
            halign: Gtk.Align.END
        });

        for (let i = 0; i < BUTTONS.length; i++) {
            this.cmbButtonActivate.append_text(BUTTONS[i]);
        }

        this.cmbButtonActivate.append_text("Primary");
        this.cmbButtonActivate.append_text("Secondary");
        this.cmbButtonActivate.set_active(BUTTONS.indexOf(this._settings.get_string(KEYS.buttonToActivate)));
        this.cmbButtonActivate.connect ("changed", () => {
            this._settings.set_string(KEYS.buttonToActivate, BUTTONS[this.cmbButtonActivate.active]);
        });
        this.attach(this.cmbButtonActivate, 2, 7, 1, 1);

        // Show Disable Workspace Switcher Popup label
        let lblSwitcherPopup = new Gtk.Label({
            label: _("Disable the workspace switcher popup") + "\n<span font_size='small'>" + _("WARNING: Will NOT work while workspace switcher popup extensions are installed.") + "</span>",
            margin_left: 15,
            use_markup: true,
            halign: Gtk.Align.START
        });
        this.attach(lblSwitcherPopup, 0, 8, 2, 1);

        // Show Disable Workspace Switcher Popup switch
        let swSwitcherPopup = new Gtk.Switch({
            active: this._settings.get_boolean(KEYS.workSwitcherPopup),
            halign: Gtk.Align.END
        });
        swSwitcherPopup.connect ("notify::active", () => {
            this._settings.set_boolean(KEYS.workSwitcherPopup, swSwitcherPopup.active);
        });
        this.attach(swSwitcherPopup, 2, 8, 1, 1);
    }
});

const WorkspaceButtonsWorkspaceFormat = GObject.registerClass(
    class WorkspaceButtonsWorkspaceFormat extends Gtk.Grid {

    _init(params) {
        super._init(params);
        this.margin = 10;
        this.column_spacing = 50;
        this.row_spacing = 10;
	    this._settings = Convenience.getSettings();

        // Start building the objects

        // Workspace apperance/label format label
        let lblWorkspaceFormat = new Gtk.Label({
            label: `<b>${_("Workspace Appearance/Label Format")}</b>`,
            hexpand: true,
            halign: Gtk.Align.START,
            use_markup: true
        });
        this.attach(lblWorkspaceFormat, 0, 0, 3, 1);

        // Show Hide Empty Workspace label
        let lblEmptyWorkspaceHide = new Gtk.Label({
            label: _("Hide empty workspaces") + "\n<span font_size='small'>" + _("WARNING: This reduces accessibility and will make empty workspace styling useless") + "</span>",
            margin_left: 15,
            use_markup: true,
            sensitive: true,
            halign: Gtk.Align.START
        });
        this.attach(lblEmptyWorkspaceHide, 0, 1, 2, 1);

        // Show Hide Empty Workspace Label switch
        let swEmptyWorkspaceHide = new Gtk.Switch({
            active: this._settings.get_boolean(KEYS.emptyWorkHide),
            sensitive: true,
            halign: Gtk.Align.END
        });
        swEmptyWorkspaceHide.connect ("notify::active", () => {
            this._settings.set_boolean(KEYS.emptyWorkHide, swEmptyWorkspaceHide.active);
        });
        this.attach(swEmptyWorkspaceHide, 2, 1, 1, 1);

        // Show Empty Workspace label
        let lblEmptyWorkspace = new Gtk.Label({
            label: _("Enable styling to indicate empty workspaces"),
            margin_left: 15,
            use_markup: true,
            sensitive: true,
            halign: Gtk.Align.START
        });
        this.attach(lblEmptyWorkspace, 0, 2, 2, 1);

        // Show Empty Workspace switch
        let swEmptyWorkspace = new Gtk.Switch({
            active: this._settings.get_boolean(KEYS.emptyWorkStyle),
            sensitive: true,
            halign: Gtk.Align.END
        });
        swEmptyWorkspace.connect ("notify::active", () => {
            this._settings.set_boolean(KEYS.emptyWorkStyle, swEmptyWorkspace.active);
        });
        this.attach(swEmptyWorkspace, 2, 2, 1, 1);

        // Show Urgent Workspace label
        let lblUrgentWorkspace = new Gtk.Label({
            label: _("Enable styling to indicate urgent workspaces"),
            margin_left: 15,
            halign: Gtk.Align.START
        });
        this.attach(lblUrgentWorkspace, 0, 3, 2, 1);

        // Show Urgent Workspace switch
        let swUrgentWorkspace = new Gtk.Switch({
            active: this._settings.get_boolean(KEYS.urgentWorkStyle),
            halign: Gtk.Align.END
        });
        swUrgentWorkspace.connect ("notify::active", () => {
            this._settings.set_boolean(KEYS.urgentWorkStyle, swUrgentWorkspace.active);
        });
        this.attach(swUrgentWorkspace, 2, 3, 1, 1);

        // Show workspace numbers label
        let lblWkspNumber = new Gtk.Label({
            sensitive: this._settings.get_boolean(KEYS.nameLabel) || this._settings.get_boolean(KEYS.indLabel) ? true : false,
            label: _("Enable workspace numbers"),
            margin_left: 15,
            halign: Gtk.Align.START
        });
        this.attach(lblWkspNumber, 0, 4, 2, 1);

        // Show workspace numbers switch
        let swWkspNumber = new Gtk.Switch({
            sensitive: this._settings.get_boolean(KEYS.nameLabel) || this._settings.get_boolean(KEYS.indLabel) ? true : false,
            active: this._settings.get_boolean(KEYS.numLabel),
            halign: Gtk.Align.END
        });
        swWkspNumber.connect ("notify::active", () => {
            this._settings.set_boolean(KEYS.numLabel, swWkspNumber.active);

            // Disable workspace label separator if both workspace numbers and names are not
            // enabled
            lblSeparator.set_sensitive(swWkspNumber.active === true && swWkspName.active === true ? true : false);
            this.txtSeparator.set_sensitive(swWkspNumber.active === true && swWkspName.active === true ? true : false);

            // Disable the ability to disable workspace names unless the activity indicators are
            // enabled as we have to have some sort of indicator
            if (swActInd.active === true) {
                lblWkspName.set_sensitive(false);
                swWkspName.set_sensitive(false);
            } else {
                lblWkspName.set_sensitive(swWkspNumber.active === true || swActInd.active === true ? true : false);
                swWkspName.set_sensitive(swWkspNumber.active === true || swActInd.active === true ? true : false);
            }

        });
        this.attach(swWkspNumber, 2, 4, 1, 1);

        // Show workspace names label
        let lblWkspName = new Gtk.Label({
            sensitive: this._settings.get_boolean(KEYS.indLabel) ? false :(this._settings.get_boolean(KEYS.numLabel) ? true : false),
            label: _("Enable workspace names"),
            margin_left: 15,
            halign: Gtk.Align.START
        });
        this.attach(lblWkspName, 0, 5, 2, 1);

        // Show workspace names switch
        let swWkspName = new Gtk.Switch({
            sensitive: this._settings.get_boolean(KEYS.indLabel) ? false : this._settings.get_boolean(KEYS.numLabel) ? true : false,
            active: this._settings.get_boolean(KEYS.nameLabel),
            halign: Gtk.Align.END
        });
        swWkspName.connect ("notify::active", () => {
            this._setWkspName(swWkspName);

            // Disable workspace label separator if both workspace numbers and names are not
            // enabled
            lblSeparator.set_sensitive(swWkspNumber.active === true && swWkspName.active === true ? true : false);
            this.txtSeparator.set_sensitive(swWkspNumber.active === true && swWkspName.active === true ? true : false);

            // Disable the ability to disable workspace numbers unless the activity indicators are
            // enabled as we have to have some sort of indicator
            lblWkspNumber.set_sensitive(swWkspName.active === true || swActInd.active === true ? true : false);
            swWkspNumber.set_sensitive(swWkspName.active === true || swActInd.active === true ? true : false);
        });
        this.attach(swWkspName, 2, 5, 1, 1);

        // Workspace label separator label
        let lblSeparator = new Gtk.Label({
            label: _("Workspace label separator") + "\n<span font_size='small'>" + _("Add spaces here as they will not be automatically added otherwise") + "</span>",
            margin_left: 15,
            use_markup: true,
            sensitive: swWkspNumber.active === true && swWkspName.active === true ? true : false,
            halign: Gtk.Align.START
        });
        this.attach(lblSeparator, 0, 6, 2, 1);

        // Workspace label separator text entry
        this.txtSeparator = new Gtk.Entry({
            sensitive: swWkspNumber.active === true && swWkspName.active === true ? true : false,
            width_chars: 7,
            halign: Gtk.Align.END
        });
        this.txtSeparator.set_text(this._settings.get_string(KEYS.labelSeparator));
        this.txtSeparator.connect ("changed", () => { this._onSeparatorChanged() });
        this.txtSeparator.connect ("activate", () => { this._onSeparatorChanged() });
        this.attach(this.txtSeparator, 2, 6, 1, 1);

        // Show activity indicators label
        let lblActInd = new Gtk.Label({
            label: _("Enable activity indicators") + "\n<span font_size='small'>" + _("This will override workspace names (numbers can still be visible)") + "</span>",
            margin_left: 15,
            use_markup: true,
            halign: Gtk.Align.START
        });
        this.attach(lblActInd, 0, 7, 2, 1);

        // Show activity indicators switch
        let swActInd = new Gtk.Switch({
            active: this._settings.get_boolean(KEYS.indLabel),
            halign: Gtk.Align.END
        });
        swActInd.connect ("notify::active", () => {
            this._settings.set_boolean(KEYS.indLabel, swActInd.active);

            let actIndEnable = this._settings.get_boolean(KEYS.indLabel);
            let numIndEnable = this._settings.get_boolean(KEYS.numLabel);
            let nameIndEnable = this._settings.get_boolean(KEYS.nameLabel);

            if (actIndEnable === true) {
                lblWkspNumber.set_sensitive(true);
                swWkspNumber.set_sensitive(true);
                lblWkspName.set_sensitive(false);
                swWkspName.set_sensitive(false);
            } else {
                if (nameIndEnable === false) {
                    lblWkspName.set_sensitive(true);
                    swWkspName.set_sensitive(true);
                    lblWkspNumber.set_sensitive(false);
                    swWkspNumber.set_sensitive(false);
                } else if (numIndEnable === false) {
                    lblWkspName.set_sensitive(false);
                    swWkspName.set_sensitive(false);
                    lblWkspNumber.set_sensitive(true);
                    swWkspNumber.set_sensitive(true);
                } else if (numIndEnable === true && nameIndEnable === true) {
                    lblWkspName.set_sensitive(true);
                    swWkspName.set_sensitive(true);
                    lblWkspNumber.set_sensitive(true);
                    swWkspNumber.set_sensitive(true);
                }
                if (numIndEnable === false && nameIndEnable === false) {
                    lblWkspName.set_sensitive(false);
                    swWkspName.set_sensitive(false);
                    swWkspName.active = true;
                    this._setWkspName(swWkspName);
                    lblWkspNumber.set_sensitive(true);
                    swWkspNumber.set_sensitive(true);
                }
            }

            lblEmptyInd.set_sensitive(actIndEnable);
            this.txtEmptyInd.set_sensitive(actIndEnable);
            lblInactiveInd.set_sensitive(actIndEnable);
            this.txtInactiveInd.set_sensitive(actIndEnable);
            lblActiveInd.set_sensitive(actIndEnable);
            this.txtActiveInd.set_sensitive(actIndEnable);
        });
        this.attach(swActInd, 2, 7, 1, 1);

        // Activity indicators label
        let lblActivityInd = new Gtk.Label({
            label: "<b>"+ _("Activity Indicators") + "</b>\n<span font_size='small'>" + _("These will replace the workspace names as noted") + "</span>",
            use_markup: true,
            halign: Gtk.Align.START
        });
        this.attach(lblActivityInd, 0, 8, 3, 1);

        // Empty workspace activity indicator label
        let lblEmptyInd = new Gtk.Label({
            label: _("Empty Workspace"),
            sensitive: this._settings.get_boolean(KEYS.indLabel) === true ? true : false,
            halign: Gtk.Align.CENTER
        });
        this.attach(lblEmptyInd, 0, 9, 1, 1);

        //Inactive workspace activity indicator label
        let lblInactiveInd = new Gtk.Label({
            label: _("Inactive Workspace"),
            sensitive: this._settings.get_boolean(KEYS.indLabel) === true ? true : false,
            halign: Gtk.Align.CENTER
        });
        this.attach(lblInactiveInd, 1, 9, 1, 1);

        //Active workspace activity indicator label
        let lblActiveInd = new Gtk.Label({
            label: _("Active Workspace"),
            sensitive: this._settings.get_boolean(KEYS.indLabel) === true ? true : false,
            halign: Gtk.Align.CENTER
        });
        this.attach(lblActiveInd, 2, 9, 1, 1);

        // Get the array of workspace label indicators
        let indList = this._settings.get_strv(KEYS.labelIndicators);

        // Empty workspace activity indicator text entry
        this.txtEmptyInd = new Gtk.Entry({
            sensitive: this._settings.get_boolean(KEYS.indLabel) === true ? true : false,
            width_chars: 15,
            halign: Gtk.Align.CENTER
        });
        this.txtEmptyInd.set_text(indList[0] !== undefined ? indList[0] : "");
        this.txtEmptyInd.connect ("changed", () => { this._onIndicatorChanged() });
        this.txtEmptyInd.connect ("activate", () => { this._onIndicatorChanged() });
        this.attach(this.txtEmptyInd, 0, 10, 1, 1);

        // Inactive workspace activity indicator text entry
        this.txtInactiveInd = new Gtk.Entry({
            sensitive: this._settings.get_boolean(KEYS.indLabel) === true ? true : false,
            width_chars: 15,
            halign: Gtk.Align.CENTER
        });
        this.txtInactiveInd.set_text(indList[1] !== undefined ? indList[1] : "");
        this.txtInactiveInd.connect ("changed", () => { this._onIndicatorChanged() });
        this.txtInactiveInd.connect ("activate", () => { this._onIndicatorChanged() });
        this.attach(this.txtInactiveInd, 1, 10, 1, 1);

        // Active workspace activity indicator text entry
        this.txtActiveInd = new Gtk.Entry({
            sensitive: this._settings.get_boolean(KEYS.indLabel) === true ? true : false,
            width_chars: 15,
            halign: Gtk.Align.CENTER
        });
        this.txtActiveInd.set_text(indList[2] !== undefined ? indList[2] : "");
        this.txtActiveInd.connect ("changed", () => { this._onIndicatorChanged() });
        this.txtActiveInd.connect ("activate", () => { this._onIndicatorChanged() });
        this.attach(this.txtActiveInd, 2, 10, 1, 1);
    }

    _setWkspName(object) {
        this._settings.set_boolean(KEYS.nameLabel, object.active);
    }

    _onSeparatorChanged() {
        this._settings.set_string(KEYS.labelSeparator, this.txtSeparator.get_text());
    }

    _onIndicatorChanged() {
        let arrIndicators = [];
        arrIndicators[0] = this.txtEmptyInd.get_text();
        arrIndicators[1] = this.txtInactiveInd.get_text();
        arrIndicators[2] = this.txtActiveInd.get_text();
        this._settings.set_strv(KEYS.labelIndicators, arrIndicators);
    }
});

const WorkspaceButtonsWorkspaceColors = GObject.registerClass(
    class WorkspaceButtonsWorkspaceColors extends Gtk.Grid {

    _init(params) {
        super._init(params);
        this.margin = 10;
        this.column_spacing = 50;
        this.row_spacing = 10;
	    this._settings = Convenience.getSettings();

        // Start building the objects

        // Workspace Label Color Settings label
        let lblPosTitle = new Gtk.Label({
            label: "<b>" + _("Workspace Label Color Settings") + "</b>",
            hexpand: true,
            halign: Gtk.Align.START,
            use_markup: true
        });
        // Easiest way to understand attach format:-
        //   Object, Column, Row, ColSpan, RowSpan
        this.attach(lblPosTitle, 0, 0, 1, 1);

        // Urgent color label
        let lblUrgent = new Gtk.Label({
            label: _("Urgent/Demands Attention"),
            margin_left: 15,
            halign: Gtk.Align.START
        });
        this.attach(lblUrgent, 0, 1, 2, 1);

        // Urgent color chooser

        this.btnUrgentColor = new Gtk.ColorButton({
            halign: Gtk.Align.END
        });
        this.btnUrgentColor.set_color(getColorByHex(this._settings.get_string(KEYS.urgentColor)));
        this.btnUrgentColor.connect("notify::color", (button) => {
            this._settings.set_string(KEYS.urgentColor, getHexByColor(button.get_color()));
        });
        this.attach(this.btnUrgentColor, 2, 1, 1, 1);

        // Hover color label
        let lblHover = new Gtk.Label({
            label: _("Hover"),
            margin_left: 15,
            halign: Gtk.Align.START
        });
        this.attach(lblHover, 0, 2, 2, 1);

        // Hover color chooser

        this.btnHoverColor = new Gtk.ColorButton({
            halign: Gtk.Align.END
        });
        this.btnHoverColor.set_color(getColorByHex(this._settings.get_string(KEYS.hoverColor)));
        this.btnHoverColor.connect("notify::color", (button) => {
            this._settings.set_string(KEYS.hoverColor, getHexByColor(button.get_color()));
        });
        this.attach(this.btnHoverColor, 2, 2, 1, 1);

        // Active color label
        let lblActive = new Gtk.Label({
            label: _("Active"),
            margin_left: 15,
            halign: Gtk.Align.START
        });
        this.attach(lblActive, 0, 3, 2, 1);

        // Active color chooser

        this.btnActiveColor = new Gtk.ColorButton({
            halign: Gtk.Align.END
        });
        this.btnActiveColor.set_color(getColorByHex(this._settings.get_string(KEYS.activeColor)));
        this.btnActiveColor.connect("notify::color", (button) => {
            this._settings.set_string(KEYS.activeColor, getHexByColor(button.get_color()));
        });
        this.attach(this.btnActiveColor, 2, 3, 1, 1);

        // Inactive color label
        let lblInactive = new Gtk.Label({
            label: _("Inactive"),
            margin_left: 15,
            halign: Gtk.Align.START
        });
        this.attach(lblInactive, 0, 4, 2, 1);

        // Inactive color chooser

        this.btnInactiveColor = new Gtk.ColorButton({
            halign: Gtk.Align.END
        });
        this.btnInactiveColor.set_color(getColorByHex(this._settings.get_string(KEYS.inactiveColor)));
        this.btnInactiveColor.connect("notify::color", (button) => {
            this._settings.set_string(KEYS.inactiveColor, getHexByColor(button.get_color()));
        });
        this.attach(this.btnInactiveColor, 2, 4, 1, 1);

        // Empty color label
        let lblEmpty = new Gtk.Label({
            label: _("Empty"),
            margin_left: 15,
            halign: Gtk.Align.START
        });
        this.attach(lblEmpty, 0, 5, 2, 1);

        // Empty color chooser
        this.btnEmptyColor = new Gtk.ColorButton({
            halign: Gtk.Align.END
        });
        this.btnEmptyColor.set_color(getColorByHex(this._settings.get_string(KEYS.emptyColor)));
        this.btnEmptyColor.connect("notify::color", (button) => {
            this._settings.set_string(KEYS.emptyColor, getHexByColor(button.get_color()));
        });
        this.attach(this.btnEmptyColor, 2, 5, 1, 1);

        // Reset to default button
        this.btnDefaults = new Gtk.Button({
            label: _("Reset Colors to Default"),
            halign: Gtk.Align.END,
            valign: Gtk.Align.END
        });
        this.btnDefaults.connect("clicked", () => {
            this._settings.reset(KEYS.urgentColor);
            this.btnUrgentColor.set_color(getColorByHex(this._settings.get_string(KEYS.urgentColor)));
            this._settings.reset(KEYS.hoverColor);
            this.btnHoverColor.set_color(getColorByHex(this._settings.get_string(KEYS.hoverColor)));
            this._settings.reset(KEYS.activeColor);
            this.btnActiveColor.set_color(getColorByHex(this._settings.get_string(KEYS.activeColor)));
            this._settings.reset(KEYS.inactiveColor);
            this.btnInactiveColor.set_color(getColorByHex(this._settings.get_string(KEYS.inactiveColor)));
            this._settings.reset(KEYS.emptyColor);
            this.btnEmptyColor.set_color(getColorByHex(this._settings.get_string(KEYS.emptyColor)));
        })
        this.attach(this.btnDefaults, 1, 0, 2, 1);
    }
});

function init() {
    Convenience.initTranslations();
}

function buildPrefsWidget() {
    this.notebook = new Gtk.Notebook();

    // Add the settings page
    this.setPage = new Gtk.Box();
    this.setPage.border_width = 10;
    this.setPage.add(new WorkspaceButtonsSettings);
    this.notebook.append_page(this.setPage, new Gtk.Label({label: _("Settings")}));

    // Add the workspace format page
    this.wsFrmt = new Gtk.Box();
    this.wsFrmt.border_width = 10;
    this.wsFrmt.add(new WorkspaceButtonsWorkspaceFormat);
    this.notebook.append_page(this.wsFrmt, new Gtk.Label({label: _("Workspace Label Format")}));

    // Add the workspace colors page
    this.wsColors = new Gtk.Box();
    this.wsColors.border_width = 10;
    this.wsColors.add(new WorkspaceButtonsWorkspaceColors);
    this.notebook.append_page(this.wsColors, new Gtk.Label({label: _("Workspace Label Colors")}));

    this.notebook.show_all();
    return notebook;
}
