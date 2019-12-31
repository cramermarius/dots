#!/bin/bash

# options to be displyed
option0="activate all monitors"
option1="monitor eDP-1 off"
option2="monitor DP-1 off"
option3="monitor eDP-1 primary"
option4="monitor DP-1 primary"
option5="redshift on"
option6="redshift off"
option7="monitor eDP-1 same as DP-1"
option8="monitor eDP-1 right of DP-1"
option9="monitor eDP-1 left of DP-1"
option10="monitor eDP-1 above DP-1"
option11="monitor eDP-1 below DP-1"
option12="rotate monitor DP-1 right"
option13="rotate monitor DP-1 left"
option14="rotate monitor DP-1 normal"

# Variable passed to rofi
options="$option0\n$option1\n$option2\n$option3\n$option4\n$option5\n$option6\n$option7\n$option8\n$option9\n$option10\n$option11\n$option12\n$option13\n$option14"

selected="$(echo -e "$options" | rofi -lines 15 -dmenu -p "xrandr")"
case $selected in
    $option0)
        xrandr --auto;;
    $option1)
        xrandr --output eDP-1 --off;;
    $option2)
        xrandr --output DP-1 --off;;
	$option3)
		xrandr --output eDP-1 --primary;;
	$option4)
		xrandr --output DP-1 --primary;;
	$option5)
		redshift -P -O 2000;;
	$option6)
		redshift -x;;
    $option7)
        xrandr --output eDP-1 --same-as DP-1;;
    $option8)
        xrandr --output eDP-1 --primary --right-of DP-1;;
    $option9)
        xrandr --output eDP-1 --primary --left-of DP-1;;
    $option10)
        xrandr --output eDP-1 --primary --above DP-1;;
    $option11)
        xrandr --output eDP-1 --primary --below DP-1;;
    $option12)
        xrandr --output DP-1 --rotate left;;
    $option13)
        xrandr --output DP-1 --rotate right;;
    $option14)
        xrandr --output DP-1 --rotate normal;;
esac
