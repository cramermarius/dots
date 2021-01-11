#!/bin/bash

# options to be displayed
option0="suspend"
option1="scheduled suspend (10min)"
option2="scheduled suspend (20min)"
option3="scheduled suspend (30min)"
option4="scheduled suspend (45min)"
option5="scheduled suspend (60min)"
option6="lock"
option7="logout"
option8="reboot"
option9="shutdown"

# options passed into variable
options="$option0\n$option1\n$option2\n$option3\n$option4\n$option5\n$option6\n$option7\n$option8\n$option9"

chosen="$(echo -e "$options" | rofi -lines 10 -dmenu -p "power")"
case $chosen in
	$option0)
		systemctl suspend;;
    $option1)
		sleep 600 && systemctl suspend;;
    $option2)
		sleep 1200 && systemctl suspend;;
	$option3)
		sleep 1800 && systemctl suspend;;
	$option4)
		sleep 2700 && systemctl suspend;;
	$option5)
		sleep 3600 && systemctl suspend;;
	$option6)
		betterlockscreen -l dimblur;;
	$option7)
        i3-msg exit;;
    $option8)
        systemctl reboot;;
	$option9)
        systemctl poweroff;;
esac
