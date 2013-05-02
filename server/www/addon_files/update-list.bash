#! /bin/bash
dir=/var/www/addon_files
backups=/root/backups
rm -f /tmp/temp123123123
declare -a Sites=("http://www.reddit.com/r/btcbase?limit=100" "http://en.bitcoin.it/wiki/Trade" "http://www.bitcointrading.com/forum/spend-bitcoins/online-stores-accepting-bitcoins/")
for x in ${Sites[@]};
  do
  wget -O - $x | grep -o 'http\(\|s\)[^"]*' | sed 's_[^/]*//__' | sed 's_/.*__' | sed 's/^www\.//' >> /tmp/temp123123123
  done
cat $dir/acceptbitcoin.txt >> /tmp/temp123123123
cat /tmp/temp123123123 | sort | uniq | comm -13 $dir/blacklist.txt - | tee $backups/ablist-`date +%s` | tee $dir/acceptbitcoin.txt > /var/www/acceptbitcoin.txt
