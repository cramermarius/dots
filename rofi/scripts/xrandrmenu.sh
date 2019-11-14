#!/bin/bash

# options to be displyed
option0="monitor 0 only"
option1="monitor 1 only"
option2="monitor 1 same as 0"
option3="monitor 1 right of 0"
option4="monitor 1 left of 0"
option5="monitor 1 above 0"
option6="monitor 1 below 0"
option7="rotate monitor 1 right"
option8="rotate monitor 1 left"
option9="rotate monitor 1 normal"
option10="monitor 0 off"
option11="monitor 1 off"
option12="list outputs"

# Variable passed to rofi
options="$option0\n$option1\n$option2\n$option3\n$option4\n$option5\n$option6\n$option7\n$option8\n$option9\n$option10\n$option11\n$option12"

selected="$(echo -e "$options" | rofi -dmenu -p "xrandrmenu")"
case $selected in
    $option0)
        xrandr --output eDP-1
		;;
    $option1)
        xrandr --output DP-1
		;;
    $option2)
        xrandr --output DP-1 --same-as eDP-1
		;;
    $option3)
        xrandr --output DP-1 --right-of eDP-1
		;;
    $option4)
        xrandr --output DP-1 --left-of eDP-1
		;;
    $option5)
        xrandr --output DP-1 --above eDP-1
		;;
    $option6)
        xrandr --output DP-1 --below eDP-1
		;;
    $option7)
        xrandr --output DP-1 --rotate right
		;;
    $option8)
        xrandr --output DP-1 --rotate left
		;;
    $option9)
        xrandr --output DP-1 --rotate normal
		;;
    $option10)
        xrandr --output eDP-1 --off 
		;;
    $option11)
        xrandr --output DP-1 --off
		;;
	$option12)
		xrandr --listmonitors
		;;
esac
