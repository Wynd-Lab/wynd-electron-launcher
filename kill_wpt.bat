process = netstat -a -n -o -p tcp | findstr 0.0.0.0:9963 | gawk '{ print $5 }'
taskkill  /F  /PID %process%
@REM netstat -a -n -o -p tcp | findstr 0.0.0.0:9963 | gawk '{ print $5 }'