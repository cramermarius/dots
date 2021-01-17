#!/bin/bash

# options to be displyed
option0="activate all monitors"
option1="eDP-1 off"
option2="DP-1 off"
option3="eDP-1 primary"
option4="DP-1 primary"
option5="DP-1 same as eDP-1"
option6="DP-1 right of eDP-1"
option7="DP-1 left of eDP-1"
option8="DP-1 above eDP-1"
option9="DP-1 (1368x768) above eDP-1"
option10="DP-1 below eDP-1"
option11="rotate DP-1 right"
option12="rotate DP-1 left"
option13="rotate DP-1 normal"

# Variable passed to rofi
options="$option0\n$option1\n$option2\n$option3\n$option4\n$option5\n$option6\n$option7\n$option8\n$option9\n$option10\n$option11\n$option12\n$option13"

selected="$(echo -e "$options" | rofi -lines 14 -dmenu -p "xrandr")"
case $selected in
    $option0)
        xrandr --auto && killall polybar && polybar main && feh --randomize --bg-fill ~/Pictures/walls/br2049/*;;
    $option1)
        xrandr --output eDP-1 --off;;
    $option2)
        xrandr --output DP-1 --off;;
	$option3)
		xrandr --output eDP-1 --primary;;
	$option4)
		xrandr --output DP-1 --primary;;
    $option5)
        xrandr --output DP-1 --same-as eDP-1;;
    $option6)
        xrandr --output DP-1 --right-of eDP-1;;
    $option7)
        xrandr --output DP-1 --left-of eDP-1;;
    $option8)
        xrandr --output DP-1 --above eDP-1 && feh --bg-scale ~/Pictures/walls/o7nizZ7.png;;
	$option9)
		xrandr --output DP-1 --mode 1368x768_60.00 && xrandr --output DP-1 --above eDP-1 && killall polybar && polybar main;;
    $option10)
        xrandr --output DP-1 --below eDP-1;;
    $option11)
        xrandr --output DP-1 --rotate left;;
    $option12)
        xrandr --output DP-1 --rotate right;;
    $option13)
        xrandr --output DP-1 --rotate normal;;
esac
