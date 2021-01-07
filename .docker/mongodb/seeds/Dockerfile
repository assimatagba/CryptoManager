FROM mongo:latest

COPY *.json ./
CMD mongoimport --host mongo --username user --password user06 --db TheCountOfMoney --collection users --type json --file /users.json --jsonArray
