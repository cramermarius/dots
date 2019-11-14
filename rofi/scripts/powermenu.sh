#!/bin/bash

# options to be displayed
lock="lock"
logout="logout"
suspend="suspend"
scheduled_suspend0="scheduled suspend (10min)"
scheduled_suspend1="scheduled suspend (20min)"
scheduled_suspend2="scheduled suspend (30min)"
reboot="reboot"
shutdown="shutdown"

# options passed into variable
options="$lock\n$logout\n$suspend\n$scheduled_suspend0\n$scheduled_suspend1\n$scheduled_suspend2\n$reboot\n$shutdown"

chosen="$(echo -e "$options" | rofi -dmenu -p "powermenu")"
case $chosen in
    $lock)
        i3lock-fancy
		;;
    $logout)
        i3-msg exit
		;;
    $suspend)
        systemctl suspend
		;;
	$scheduled_suspend0)
		sleep 600 && systemctl suspend
		;;
	$scheduled_suspend1)
		sleep 1200 && systemctl suspend
		;;
	$scheduled_suspend2)
		sleep 1800 && systemctl suspend
		;;
    $reboot)
        systemctl reboot
		;;
	$shutdown)
        systemctl poweroff
		;;
esac
