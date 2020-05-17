#!/bin/bash

# options do be displayed

option0="off"
option1="one %"
option2="five %"
option3="ten %"
option4="twenty %"
option5="forty %"
option6="sixty %"
option7="eighty %"
option8="hundred %"

# options passed to variable
options="$option0\n$option1\n$option2\n$option3\n$option4\n$option5\n$option6\n$option7\n$option8"

selected="$(echo -e "$options" | rofi -lines 9 -dmenu -p "brightness")"
case $selected in
    $option0)
		sudo bash -c "echo 0 > /sys/class/backlight/intel_backlight/brightness";;
	$option1)
		sudo bash -c "echo 9 > /sys/class/backlight/intel_backlight/brightness";;
    $option2)
		sudo bash -c "echo 43 > /sys/class/backlight/intel_backlight/brightness";;
    $option3)
        sudo bash -c "echo 86 > /sys/class/backlight/intel_backlight/brightness";;
    $option4)
        sudo bash -c "echo 171 > /sys/class/backlight/intel_backlight/brightness";;
    $option5)
        sudo bash -c "echo 341 > /sys/class/backlight/intel_backlight/brightness";;
	$option6)
        sudo bash -c "echo 512 > /sys/class/backlight/intel_backlight/brightness";;
	$option7)
        sudo bash -c "echo 682 > /sys/class/backlight/intel_backlight/brightness";;
	$option8)
        sudo bash -c "echo 852 > /sys/class/backlight/intel_backlight/brightness";;
esac
