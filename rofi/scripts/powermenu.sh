#!/bin/bash

rofi_command="rofi -theme nord.rasi"

### Options ###
lock=" lock"
logout=" logout"
suspend=" suspend"
scheduled_suspend=" scheduled suspend (1500s)"
hibernate=" hibernate"
reboot=" reboot"
shutdown=" shutdown"

# Variable passed to rofi
options="$lock\n$logout\n$suspend\n$scheduled_suspend\n$hibernate\n$reboot\n$shutdown"

chosen="$(echo -e "$options" | $rofi_command -dmenu -p "powermenu" -selected-row 2)"
case $chosen in
    $lock)
        lock;;
    $logout)
        i3-msg exit;;
    $suspend)
		lock
        amixer set Master mute
        systemctl suspend;;
	$scheduled_suspend)
		sleep(1500)
		systemctl suspend;;
	$hibernate)
		systemctl hibernate;;
    $reboot)
        systemctl reboot;;
    $shutdown)
        systemctl poweroff;;
esac
