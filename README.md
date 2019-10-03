# system configuration guide
### gitlab.com/mcramer/dotfiles

## system settings

## GNOME shell
### extensions
* Activities configurator
	* Hide Icon [ON]
	* Hide Text [ON]
	* Remove Activities Button [ON]
	* Disable Hot Corner [ON]
	* Hide Application Menu Button Icon [ON]
	* Override Shell Theme [ON]
	* Set Panel Background [#2e3440]
* Caffeine
	* Show Caffeine in top panel [ON]
	* Enable when a fullscreen application is running [OFF]
	* Restore state across reboots [OFF]
	* Enable notifications [OFF]
* No Annoyance
* Panel OSD
	* Horizontal Position 100.0%
	* Vertical Position 100.0%
* Remove App Menu
* Shelltile
* Sound input & and output device chooser
* User themes
* Workspace buttons
* cpufreq

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

### keyboard
* Overview Shortcut
	* Right Super

## applications
* sudo apt -y install gimp mpv sxiv zathura vim texlive-lang-german texlive-bibtex-extra biber texlive-latex-extra gnome-tweak-tool papirus-icon-theme keepassx s-tui inkscape chromium-browser google-chrome-stable tilix deja-dup duplicity ranger gnome-software npm python3 pdf2svg xclip python-pip python-xlib
	* maybe: texlive-latex-base
* sudo snap install spotify insync

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

### gedit
* theme
	* nord
		* https://github.com/arcticicestudio/nord-gedit
		* ~/dotfiles/repo-backups/apps/nord-gedit
