#!/bin/bash

rofi_command="rofi -theme nord.rasi"

### Options ###
screen=" screen"
area=" area"
window=" window"
# Variable passed to rofi
options="$screen\n$area\n$window"

chosen="$(echo -e "$options" | $rofi_command -dmenu -p "scrot" -selected-row 1)"
case $chosen in
    $screen)
        sleep 1; scrot
        ;;
    $area)
        scrot -s
        ;;
    $window)
        sleep 1; scrot -u
        ;;
esac
