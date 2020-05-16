#!/bin/env bash

# exec "pacmd list-cards" to get the name of the card and the profiles you want to switch.
CARD_NAME="alsa_card.pci-0000_00_1f.3"

PROFILES=(
    output:iec958-stereo+input:analog-stereo 
    output:analog-surround-21+input:analog-stereo 
)

ICONS=(
    
     
    
)

NEXT=n
PREVIOUS=n

function parse_options {
    options=np
    longoptions=next,previous

    # -temporarily store output to be able to check for errors
    # -e.g. use “--options” parameter by name to activate quoting/enhanced mode
    # -pass arguments only via   -- "$@"   to separate them correctly
    parsed=$(getopt --options=$options --longoptions=$longoptions --name "$0" -- "$@")
    if [[ $? -ne 0 ]]; then
        # e.g. $? == 1
        #  then getopt has complained about wrong arguments to stdout
        exit 2
    fi
    
    # read getopt’s output this way to handle the quoting right:
    eval set -- "$parsed"
    
    
    # now enjoy the options in order and nicely split until we see --
    while true; do
        case "$1" in
            -n|--next)
                NEXT=y
                shift
                ;;
            -p|--previous)
                PREVIOUS=y
                shift
                ;;
            --)
                shift
                break
                ;;
            *)
                echo "Programming error"
                exit 3
                ;;
        esac
    done
}

function getActiveProfile {
    active_profile=$(pacmd list-cards | grep 'active profile')
    tmp=${active_profile#*<}

    echo ${tmp%>*}
}

function getProfileIndex () {
    for i in "${!PROFILES[@]}"; do
        if [ "${PROFILES[$i]}" == $1 ]; then
            echo $i
        fi
    done
    
    # If the given rofile is not in the profiles array we default to the first one.
    return 0
}

function getNextProfile {
    if [ -z $1 ]; then
        profile=$(getActiveProfile)
    else
        profile=$1
    fi

    index=$(getProfileIndex $profile)
    
    next=$(((index + 1) % ${#PROFILES[@]}))

    echo ${PROFILES[$next]}
}

function getPreviousProfile {
    if [ -z $1 ]; then
        profile=$(getActiveProfile)
    else
        profile=$1
    fi

    index=$(getProfileIndex $profile)
    previous=$(((index - 1) % ${#PROFILES[@]}))

    echo ${PROFILES[$previous]}
}

function setProfile () {
    
    profile=$(getActiveProfile)
    
    if [ $NEXT == y ]; then
        profile=$(getNextProfile $profile)
    elif [ $PREVIOUS == y ]; then
        profile=$(getPreviousProfile $profile)
    fi

    pacmd set-card-profile $CARD_NAME $profile
    echo $profile
}

function polybarOutput () {
    profile=$1
    index=$(getProfileIndex $profile)

    echo "${ICONS[$index]}"
}

# Main execution

parse_options $@
new_profile=$(setProfile)
polybarOutput $new_profile

exit 0
