#!/bin/zsh

#dir =`pwd`
#echo $dir
head="cfx"

for i in `ls eth* $1`;
do
  strTail=`print $i | awk '{print substr($0,4)}'`;
  new=$head$strTail
  echo "start @ $new"
  #cmd="ack -l --print0 "$i"| xargs -0 -n 1 sed -i -e 's/"$i"/"$new"/g'"
  cmd="mv "$i"   "$new
  eval $cmd 
  #echo $cmd 
  #echo "satrt clean"
  #exec `find . -name "*-e" | xargs rm`
  echo "---------------------------"
done

exit
