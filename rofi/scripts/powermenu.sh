#!/bin/bash

### Options ###
lock=" lock"
logout=" logout"
suspend=" suspend"
scheduled_suspend=" scheduled suspend (1500s)"
reboot=" reboot"
shutdown=" shutdown"

# Variable passed to rofi
options="$lock\n$logout\n$suspend\n$scheduled_suspend\n$reboot\n$shutdown"

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
	$scheduled_suspend)
		sleep 1500 && systemctl suspend
		;;
    $reboot)
        systemctl reboot
		;;
	$shutdown)
        systemctl poweroff
		;;
esac
