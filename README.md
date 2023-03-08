# Lab-Server
## March 2022

***We decided to move to an M1 chip Apple Mac mini***

**Here the compatibility is an issue as the previous server setting won't work on an Apple Silicon chip.**


We still sort of follow this guide:  
https://adamwilbert.com/blog/2018/3/26/get-started-with-sql-server-on-macos-complete-with-a-native-gui  
*But we had to make changes as the image the guide indicated is incompatible. We no longer use [microsoft/mssql-server-linux:2017-latest] we use Azure SQL Edge instead.*

***Note: Azure SQL Edge has its own set of problems. Once Microsoft releases a compatible version of mssql for M1, switching the server to it is advised.***

### Docker
1. Once docker is installed download Azure SQL Edge image and then run the command below
2. ```docker run --cap-add SYS_PTRACE -e 'ACCEPT_EULA=1' -e 'MSSQL_SA_PASSWORD=yourStrong(!)Password' -p 1433:1433 --name Beacon_Server -d mcr.microsoft.com/azure-sql-edge```
3. Change yourStrong(!)Password to the auth password in the docs
4. Check if the container is properly installed using the command ```docker ps -a``` 
5. The status should say up, but it says exited then something was wrong with the code in step 2. 
6. Finally check docker to see if the container is running.


### Azure Data Studios
Once the image and container are properly set up, move on to **Azure Data Studios**

After Azure Data Studios is downloaded we need to connect it to the docker server using the credentials below. 
```
Connection type: Microsoft SQL Server
Server: localhost,1433
Auth type: SQL Login
Username: SA
Password: (the auth password that we used in the docs)
Name: Beacon_Server
```

Once connected, we need to make a database specifically for beacons. 
Run the command in a new query ```CREATE DATABASE beacons;```

Then run commands in the **dbo.beacons file**.

## May 2021

### Steps to run the Beacon Web Server
1. Make sure Docker is running and the Docker Container "beacon_server" is running. (This uses microsoft/mssql-server-linux:2017-latest) If the container does not pop up, restart the Docker (or the entire machine if it still does not work)
2. Make sure there are not any other instances of the web server currently running on this machine
3. In the beacon_server folder, run "node beaconwebserver.js" to start the web server and begin listening for requests for the database

To add or delete to/from the database, use the index.html webpage in the beacon_server folder to do so.

***NOTE:
All files that are added to the database need to be added to the beaconfiles folder in order for everything to work properly.
The webpage on this machine is treated as if it has absolute admin access to the database, if you are deleting something, MAKE SURE YOU ARE ABSOLUTELY SURE YOU ARE ENTERING THE CORRECT ID.***

If you wish or need to directly access and modify data within the database, you can do so with the Azure Data Studio. Currently, there is just the one server "beacon_server" and one database "beacons". Clicking on the beacons database on the side will bring you to a home screen where you can access all tables and modify what you need, either through "Edit Data" or "Select Top 1000"
This tool is useful to make sure everything is working at the lowest level

### SCHEMA 
The "beacons" table contains the floor plan files as well as the unique correlating group ID,
The "beacondata" table contains each beacon and their data in a text format that will be sent as a JSON

As of right now, if you need to delete a file & associated group ID from the database, you need to do so using Azure Data Studio, which can be done as follows
1. Open Azure Data Studio
2. Open beacon_server
3. Right-click the beacons database and click New Query
4. Copy the following query into there and **replace** the ```PLACEHOLDER``` with the one you need to delete
```DELETE FROM dbo.beacons WHERE group_id = PLACEHOLDER```

***Again, be sure the ID you enter is correct as you have essentially admin access***

This was the guide followed to create the docker container and setup the SQL Server Database: https://adamwilbert.com/blog/2018/3/26/get-started-with-sql-server-on-macos-complete-with-a-native-gui
If something breaks irrevocably, refer to this guide to either fix or completely reinstall


## Moving Databases
The method to move values from one device database to another device in **Azure Data Studios** requires exporting the values as a ```.csv``` file.  
***Note: The steps below work only due to the current database being simple and small.***

1. Right click and select the top 1000 values of the database you want to transfer.
2. Choose the export icons on the right to select your desired file type.
3. Once exported into a ```.csv``` file go to https://sqlizer.io to convert it into an sql query
4. Run the sql query in the desired device database to transfer the values into it. 
