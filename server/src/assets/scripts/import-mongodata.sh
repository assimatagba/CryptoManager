#!/bin/sh
mongorestore --host mongo --port 27017 --db TheCountOfMoney --drop /mongo-seed/dump/TheCountOfMoney --gzip
