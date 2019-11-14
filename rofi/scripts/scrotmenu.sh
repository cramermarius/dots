#!/bin/bash

# options to be displayed
screen="screen"
area="area"
window="window"

# options to be displyed
options="$screen\n$area\n$window"

selected="$(echo -e "$options" | rofi -dmenu -p "scrot")"
case $selected in
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
