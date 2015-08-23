#!/bin/bash

cd /home/backupdata

rarWebName=38sr_Web_$(date +"%Y%m%d").tar.gz
rarDbName=38sr_Db_$(date +"%Y%m%d").tar.gz

oldWebName=38sr_Web_$(date -d -3day +"%Y%m%d").tar.gz
oldDbName=38sr_Db_$(date -d -3day +"%Y%m%d").tar.gz

#delete data 3 day ago
rm /home/backupdata/$oldWebName
rm /home/backupdata/$oldDbName

#compact 
tar zcvf /home/backupdata/$rarWebName /home/mongoblog/

mongodump -h 127.0.0.1 -d blogdb -o /home/backupdata/mongodb/
tar zcvf /home/backupdata/$rarDbName /home/backupdata/mongodb/

#ftp back
/usr/bin/ftp -v -n v0.ftp.upyun.com << END
user test/srbackup test
type binary
put $rarWebName
put $rarDbName
put /home/backupdata/backup.sh

delete $oldWebName
delete $oldDbName
bye
END

rm /home/backupdata/$oldWebName
rm /home/backupdata/$oldDbName
