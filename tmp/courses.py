#!/usr/bin/env python

# needed for updating the symlink 'currentcourse/'
import os
# needed for gathering stdout when retrieving current time. super hacky, this will be
# updated to use python-integrated functions soon™
import subprocess

# dictionary which holds dictionaries named like courses which then hold the course's
# time, day and short name. this will be changed down the line. i want to fetch this data
# from my google calender through their public API.
courses = {
    "BWL": { # Betriebswirtschaftslehre
        "short": "bwl", # only needed for updating the symlink 'currentcourse/'
        "day": "Sun",
        "startTime": "1900",
        "endTime": "1915"
        },
    "WERK": { # Werkstofftechnik
        "short": "werk",
        "day": "Sun",
        "startTime": "1915",
        "endTime": "1930"
        },
    "MATH1": { # Mathematik 1
        "short": "math1",
        "day": "Sun",
        "startTime": "1930",
        "endTime": "1945"
        },
    "MECH1": { # Mechanik 1
        "short": "mech1",
        "day": "Sun",
        "startTime": "1945",
        "endTime": "2000"
        },
    "PHY": { # Physik
        "short": "phy",
        "day": "Sun",
        "startTime": "2000",
        "endTime": "2015"
        }
}


# assigns currentTimeCmd and currentTimeCmd to their respective command
currentDayCmd = subprocess.Popen('date +"%a"', stdout=subprocess.PIPE, shell=True)
currentTimeCmd = subprocess.Popen('date +"%H%M"', stdout=subprocess.PIPE, shell=True)

(currentDay, err) = currentDayCmd.communicate()
(currentTime, err) = currentTimeCmd.communicate()

currentDayCmdStatus = currentDayCmd.wait()
currentTimeCmdStatus = currentTimeCmd.wait()


# stores if any one course is already active
courseActive = False

for i in courses:
    # checks if the current day and the course i's day are the same, then if the course
    # i's start time is lower and the end time is higher than the current time. if so it
    # opens activecourse.txt and writes i to it. it then opens endtime.txt
    # and writes the end time to it.
    if currentDay.decode().strip() == courses[i]["day"] and courses[i]["startTime"] < currentTime.decode() < courses[i]["endTime"]:
        file = open("/home/mcramer/dots/university-setup/activecourse.txt", "w")
        file.write(i)
        file.close()
        endTime = courses[i]["endTime"]
        file = open("/home/mcramer/dots/university-setup/endtime.txt", "w")
        file.write(" [ends at " + endTime + "]")
        file.close()
        # update the symlink used to easy access to the current course
        updateSymlink = "rm ~/currentcourse && ln -s ~/university/bachelor-1/" + courses[i]["short"] + "/ ~/currentcourse"
        os.system(updateSymlink)
        # assign True to courseActive to mark that a course is active
        courseActive = True
    # if there already is a course active there is no need to continue checking other
    # courses
    elif courseActive == True:
        None
    # if no course is active empty activecourse.txt and endtime.txt to clear polybar
    # output
    else:
        f = open("/home/mcramer/dots/university-setup/activecourse.txt", "w")
        f.write(" ")
        f.close()
        f = open("/home/mcramer/dots/university-setup/endtime.txt", "w")
        f.write(" ")
        f.close()
