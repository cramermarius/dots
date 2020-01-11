#!/bin/bash

# options to be displayed
option0="full"
option1="selection"

# options to be displyed
options="$option0\n$option1"

selected="$(echo -e "$options" | rofi -lines 2 -dmenu -p "flame")"
case $selected in
    $option0)
        flameshot full -p ~/Pictures/scrots -d 300;;
    $option1)
		flameshot gui
esac
