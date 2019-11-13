#!/bin/bash

rofi_command="rofi -theme nord.rasi"

### Options ###
stacked="stacked"
tabbed="tabbed"
split="split"
# Variable passed to rofi
options="$stacked\n$tabbed\n$split"

chosen="$(echo -e "$options" | $rofi_command -dmenu -p "i3layout" -selected-row 1)"
case $chosen in
    $stacked)
        i3-msg layout stacked
        ;;
    $tabbed)
        i3-msg layout tabbed
        ;;
    $split)
        i3-msg layout toggle split
        ;;
esac

