#! /bin/sh


kill -9 $(netstat -ltnp | grep -w ':9963' | awk '{split($7,a, "/"); print  a[1]}')
