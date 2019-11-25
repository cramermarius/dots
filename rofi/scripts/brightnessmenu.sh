#!/bin/bash

# options do be displayed
option0="two %"
option1="twenty %"
option2="forty %"
option3="sixty %"
option4="eighty %"
option5="hundred %"
# options passed to variable
options="$option0\n$option1\n$option2\n$option3\n$option4\n$option5"

selected="$(echo -e "$options" | rofi -lines 6 -dmenu -p "brightness")"
case $selected in
    $option0)
		sudo bash -c "echo 10 > /sys/class/backlight/intel_backlight/brightness";;
    $option1)
        sudo bash -c "echo 83 > /sys/class/backlight/intel_backlight/brightness";;
    $option2)
        sudo bash -c "echo 166 > /sys/class/backlight/intel_backlight/brightness";;
	$option3)
        sudo bash -c "echo 250 > /sys/class/backlight/intel_backlight/brightness";;
	$option4)
        sudo bash -c "echo 333 > /sys/class/backlight/intel_backlight/brightness";;
	$option5)
        sudo bash -c "echo 416 > /sys/class/backlight/intel_backlight/brightness";;
esac
