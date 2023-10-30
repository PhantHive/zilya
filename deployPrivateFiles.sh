#!/bin/bash

# Set the source and destination directories
SOURCE_BOT_ENV="/home/Phearion/bots/Zilya/app/.env"

# Copy files and directories recursively
cp -r "$SOURCE_BOT_ENV" "$(pwd)"