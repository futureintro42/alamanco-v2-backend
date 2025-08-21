Alamanco Backend
===========================

## Introduction
This application is used for backend for a Alamanco.
## Dependencies
 - Nodejs >=16.x.x or above
 - Mongodb >=4.x.x or above

## How to install Node and Mongodb
This application requires node and mongo to be installed on your system. Please check [upstream documentation](https://nodejs.org/en/download/) & [docs.mongodb.com](https://docs.mongodb.com/manual/administration/install-community)
for how to install node & mongo on your system.

## Install PM2
```bash
  npm install pm2 -g
  ````

## Development build
In application root path run following commands.
```bash
cd ROOT-DIR
npm install
````
## Start mongo db
After installing mongo you should start mongo
 - Linux: sudo service mongod start
 - Window: 
    - Create a folder in any drive i.e. D:\\data
    - Open command prompt
    - Go C:\Program Files\MongoDB\Server\4.0\bin
    - mongod.exe --dbpath="D:\data" and then enter. You may see running status

## Start Application
```bash
cd ROOT-DIR
pm2 start ecosystem.config.js --env development
````

## Restart Application
```bash
cd ROOT-DIR
pm2 restart ecosystem.config.js --env development
````