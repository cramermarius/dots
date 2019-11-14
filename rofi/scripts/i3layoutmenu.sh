#!/bin/bash

# options to be displayed
stacked="stacked"
tabbed="tabbed"
split="split"

# options passed to variable
options="$stacked\n$tabbed\n$split"

selected="$(echo -e "$options" | rofi -dmenu -p "i3layout")"
case $selected in
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

