#! /bin/bash
dir=/var/www/addon_files
backups=/root/backups
echo "SELECT * From candidate_remove;" | sqlite3 $dir/main.db | sort > /tmp/1
echo "-----------------------------------" > /tmp/2
echo "SELECT * From candidate_add;" | sqlite3 $dir/main.db | sort > /tmp/3

cat /tmp/1 /tmp/2 /tmp/3 > $backups/db-`date +%s`
cat /tmp/1 /tmp/2 /tmp/3 | mail -s "Remove these" vbuterin@gmail.com
rm $dir/main.db
