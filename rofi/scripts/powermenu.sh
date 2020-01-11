#!/bin/bash

# options to be displayed
option1="logout"
option2="suspend"
option3="scheduled suspend (10min)"
option4="scheduled suspend (20min)"
option5="scheduled suspend (30min)"
option6="scheduled suspend (45min)"
option7="scheduled suspend (60min)"
option8="reboot"
option9="shutdown"

# options passed into variable
options="$option1\n$option2\n$option3\n$option4\n$option5\n$option6\n$option7\n$option8\n$option9"

chosen="$(echo -e "$options" | rofi -lines 9 -dmenu -p "power")"
case $chosen in
    $option1)
        i3-msg exit;;
    $option2)
        systemctl suspend && i3lock -c 4c566a -n;;
	$option3)
		sleep 600 && systemctl suspend && i3lock -c 4c566a -n;;
	$option4)
		sleep 1200 && systemctl suspend && i3lock -c 4c566a -n;;
	$option5)
		sleep 1800 && systemctl suspend && i3lock -c 4c566a -n;;
	$option6)
		sleep 2700 && systemctl suspend && i3lock -c 4c566a -n;;
	$option7)
		sleep 3600 && systemctl suspend && i3lock -c 4c566a -n;;
    $option8)
        systemctl reboot;;
	$option9)
        systemctl poweroff;;
esac
