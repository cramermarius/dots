#!/bin/sh

acpi | awk '{print $5}'
