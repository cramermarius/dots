#!/bin/bash

# options to be displayed
option0="Business Administration"
option1="Material Science"
option2="Mathematics-1"
option3="Mechanics-1"
option4="Physics"
option5="disable"

# options passed into variable
options="$option0\n$option1\n$option2\n$option3\n$option4\n$option5"

chosen="$(echo -e "$options" | rofi -lines 6 -dmenu -p "current course:")"
case $chosen in
	$option0)
		rm ~/currentcourse && ln -s ~/university/bachelor-1/bwl/ ~/currentcourse;;
	$option1)
		rm ~/currentcourse && ln -s ~/university/bachelor-1/werk/ ~/currentcourse;;
	$option2)
		rm ~/currentcourse && ln -s ~/university/bachelor-1/math1/ ~/currentcourse;;
	$option3)
		rm ~/currentcourse && ln -s ~/university/bachelor-1/mech1/ ~/currentcourse;;
	$option4)
		rm ~/currentcourse && ln -s ~/university/bachelor-1/phy/ ~/currentcourse;;
	$option5)
		echo "" > ~/repos/university-setup/short-message.txt && echo "" > ~/repos/university-setup/course-message.txt;;
esac
