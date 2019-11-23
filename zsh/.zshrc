# If you come from bash you might have to change your $PATH.
export PATH=$HOME/bin:/usr/local/bin:$HOME/.local/bin:$PATH
export PATH="${PATH}:${HOME}/.local/bin/"

# Path to your oh-my-zsh installation.
export ZSH="/home/mcramer/.oh-my-zsh"

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
alias l='ls -CF'
alias lt='exa -T'
alias ll='exa -alh'

# git commands
alias gs='git status'
alias ga='git add'
alias gst='git stage'
alias gcm='git commit -m'
alias gp='git push'
alias gpu='git pull'
alias gd='git diff'

## system services
alias bton='rfkill unblock bluetooth'
alias btoff='rfkill block bluetooth'
alias wifion='rfkill unblock wifi'
alias wifioff='rfkill block wifi'
alias i3lock='i3lock -c 81a1c1 -n'

# battery power management mode: governor=powersave, 2/8 cores online
alias coresoff='sudo cpufreqctl --off --core=2 && sudo cpufreqctl --off --core=3 && sudo cpufreqctl --off --core=4 && sudo cpufreqctl --off --core=5 && sudo cpufreqctl --off --core=6 && sudo cpufreqctl --off --core=7'
# performance power management mode: governor=performance, 8/8 cores online
alias coreson='sudo cpufreqctl --on --core=2 && sudo cpufreqctl --on --core=3 && sudo cpufreqctl --on --core=4 && sudo cpufreqctl --on --core=5 && sudo cpufreqctl --on --core=6 && sudo cpufreqctl --on --core=7'
alias battery='sudo tlp bat && coresoff && wifioff && btoff'

# misc
alias gotop='gotop-cjbassi -c vice'
alias e='exit'
alias linux-drive='sudo mount -t ext4 -o rw /dev/sda1 /media/mcramer/linux-drive'
alias linux-drive-2='sudo mount -t ext4 -o rw /dev/sda1 /media/mcramer/linux-drive-2'
function speedtest() {cd ~/Documents/misc/speedtest && wget https://speed.hetzner.de/"$1".bin && rm ~/Documents/misc/speedtest/*; }
function lmkc() { latexmk -pdf "$1"; }
function lmkcc() { latexmk -pdf -pvc "$1"; }
function wttr.in() { curl wttr.in/~""$1""; }

# vpn connections
alias protonc="sudo protonvpn connect -f -p TCP"
alias protond="sudo protonvpn disconnect"
alias protons="protonvpn status"

test -r "~/.dir_colors" && eval $(dircolors ~/.dir_colors)
