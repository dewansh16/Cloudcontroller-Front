#!/usr/bin/env bash
#

set -o nounset \
    -o errexit 


# Set environment values if they exist as arguments
if [ $# -ne 0 ]; then
  echo "===> Overriding env params with args ..."
  for var in "$@"
  do
    export "$var"
  done
fi

echo "===> ENV Variables ..."
env | sort

echo "===> User"
id

echo "===> Building ..."
export NODE_OPTIONS=--max_old_space_size=8192
npm run build

# echo "====> Removing src code and other unrelated files"
# rm -rf 
# echo "===> Running ... "
# exec serve -s build -l 7141
