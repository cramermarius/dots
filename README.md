# system configuration guide
### gitlab.com/mcramer/dotfiles

## system settings
### appearance
NOTE: put themes and icons in /usr/share/themes/ and /usr/share/icons/, respectively.
Otherwise Inkscape and KeePassX won't adapt to GTK theme
* Applications
	* Nordic
		* https://www.gnome-look.org/p/1267246/
		* https://github.com/EliverLara/Nordic
		* ~/dotfiles/repo-backups/gnome-shell/themes/Nordic*
* Cursor
	* Breeze_Snow
		* sudo apt install breeze-cursor-theme
* Icons
	* Nordic-Folders
		* https://www.gnome-look.org/p/1267246/
		* https://github.com/EliverLara/Nordic
		* ~/dotfiles/repo-backups/gnome-shell/icons/Nordic-Folders
* Shell
	* Nordic
		* https://www.gnome-look.org/p/1267246/
		* https://github.com/EliverLara/Nordic
		* ~/dotfiles/repo-backups/gnome-shell/themes/Nordic*
* rofi config
	* https://gitlab.kevinhivert.ovh/linux/dot-files/tree/master/rofi

### keyboard
* Overview Shortcut
	* Right Super

## applications
* sudo dnf -y install gimp feh zathura vim texlive-collection-basic texlive-collection-langgerman texlive-collection-bibtexextra biber texlive-collection-latex texlive-collection-latexrecommended keepassx inkscape chromium-browser deja-dup duplicity ranger python3 pdf2svg xclip python-pip python-xlib konsole
* sudo snap install spotify
* sudo snap install mpv --beta

### polybar dependencies
* sudo dnf install -y cairo-devel xcb-util-devel libxcb-devel xcb-proto xcb-util-image-devel xcb-util-wm-devel
* sudo dnf install -y xcb-util-xrm-devel xcb-util-cursor-devel alsa-lib-devel pulseaudio-libs-devel i3-ipc jsoncpp-devel libmpdclient-devel libcurl-devel wireless-tools-devel libnl3-devel

### dunst dependencies
* sudo dnf -y install dbus-devel libX11-devel libXrandr-devel glib2-devel pango-devel gtk3-devel libxdg-basedir-devel libXScrnSaver-devel

## application-specifics
### vim
* inkscape-figures
	* pip install inkscape-figures
	* ~/dotfiles/repo-backups/apps/latex-note-taking/inkscape-figures/
	* https://github.com/gillescastel/inkscape-figures
* LaTeX-snippets
	* https://github.com/gillescastel/latex-snippets
	* ~/dotfiles/repo-backups/apps/latex-note-taking/latex-snippets/
* inkscape-shortcut-manager
	* https://github.com/gillescastel/inkscape-shortcut-manager
	* ~/dotfiles/repo-backups/apps/latex-note-taking/latex-snippets/

### tilix
* Appearance
	* Window style
		* Borderless
	* Terminal title style
		* None
	* Theme variant
		* Dark
	* Show the terminal title even if it's the only terminal [OFF]
* Quake
	* Height 40
	* Width 36
* Shortcuts
	* Open preferences
		* Ctrl + ,
	* Add terminal down
		* Ctrl + Alt + x
	* Add termminal right
		* Ctrl + Alt + d
* Profiles
	* Color scheme
		* Nord
			* https://github.com/arcticicestudio/nord-tilix
			* ~/dotfiles/repo-backups/apps/nord-tilix
	* misc
		* https://www.nordtheme.com/docs/ports/dircolors/installation
		* ~/dotfiles/repo-backups/apps/nord-dircolors
	* Font
		* Hasklug Nerd Font Mono Light 11
			* ~/dotfiles/repo-backups/apps/Hasklug Light Nerd Font Complete Mono.otf
			* https://github.com/ryanoasis/nerd-fonts/blob/master/patched-fonts/Hasklig/Light/complete/Hasklug%20Light%20Nerd%20Font%20Complete%20Mono.otf

### CLI spotify
* install spotifyd:
`sudo dnf install rustc cargo alsa-lib-devel`
`git clone https://github.com/Spotifyd/spotifyd.git ~/Documents/spotifyd/`
`cd spotifyd`
`cargo build --release`
`cargo install --path .`
