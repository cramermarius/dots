# If you come from bash you might have to change your $PATH.
export PATH=$HOME/bin:/usr/local/bin:$HOME/.local/bin:$HOME/apps:$PATH:/var/lib/snapd/snap/bin
export PATH="${PATH}:${HOME}/.local/bin/"

# Path to your oh-my-zsh installation.
export ZSH="/home/mcramer/.oh-my-zsh"

export TZ="Europe/Berlin"
# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
ZSH_THEME="af-magic"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in ~/.oh-my-zsh/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to automatically update without prompting.
# DISABLE_UPDATE_PROMPT="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS=true

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in ~/.oh-my-zsh/plugins/*
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

###############################################################################
# list commands
alias la='ls -A'
alias l='exa -l --color=always'
alias lt='exa -T'
alias ll='exa --color=always -alh'
alias gs='git status'
alias ga='git add'
alias gst='git stage'
alias gcm='git commit -m'
alias gc='git clone'
alias gp='git push'
alias gpu='git pull'
alias gd='git diff'
alias gr='git restore'
alias grs='git restore --staged'
alias v='vim'
alias sv='sudo vim'
alias r='ranger'
alias sr='sudo ranger'
alias z='zathura'
alias mkd='mkdir -pv'
alias bton='rfkill unblock bluetooth'
alias btoff='rfkill block bluetooth'
alias wifion='rfkill unblock wifi'
alias wifioff='rfkill block wifi'
alias i3lock='i3lock -c 4e566a -n'
alias battery='sudo tlp bat && sudo powertop --auto-tune && fanoff'
alias fanoff='echo level 0 | sudo tee /proc/acpi/ibm/fan'
alias fanlow='echo level 2 | sudo tee /proc/acpi/ibm/fan'
alias fanmed='echo level 4 | sudo tee /proc/acpi/ibm/fan'
alias fanhigh='echo level 7 | sudo tee /proc/acpi/ibm/fan'
alias fanauto='echo level auto | sudo tee /proc/acpi/ibm/fan'
alias fanstat="< /proc/acpi/ibm/fan | awk '/^level:/ {print $2}'"
alias fanspeed="< /proc/acpi/ibm/fan | awk '/^speed:/ {print $2}'"
alias gotop='gotop-cjbassi -c vice'
alias bm='brightnessmenu'
alias e='exit'
alias cal='cal -m'
alias speedtest='cd ~/Documents/misc/speedtest && wget http://speed.hetzner.de/100MB.bin && rm ~/Documents/misc/speedtest/*'
function lmkc() { latexmk -pdf "$1"; }
function lmkcc() { latexmk -pdf -pvc "$1"; }
function wttr.in() { curl wttr.in/~""$1""; }
function qtex() { vim ~/Desktop/"$1".tex; }
alias protonc="sudo protonvpn connect -f"
alias protond="sudo protonvpn disconnect"
alias protons="protonvpn status"
test -r "~/.dir_colors" && eval $(dircolors ~/.dir_colors)

function countdown(){
   date1=$((`date +%s` + $1));
   while [ "$date1" -ge `date +%s` ]; do
     echo -ne "$(date -u --date @$(($date1 - `date +%s`)) +%H:%M:%S)\r";
     sleep 0.1
   done
}
