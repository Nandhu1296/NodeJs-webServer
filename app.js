const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mssql = require('mssql');
const path = require('path');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));

const portt = process.env.PORT || 1433

app.set("view engine", "ejs")

	app.get('/', function (req, res) {
		res.render('pages/index');
	});

// Handle POST requests for the list of beacons and files
app.post('/list', function (req, res){
	
	// POST variables
	// var auth = req.body.auth;

	// Database Information
	const config = {
		user: 'udtk9290rxep45g',
		password: 'otGIcq@Pn%?vebYDzHNEre497',
		server: 'eu-az-sql-serv1.database.windows.net',
		database: 'd0melt24v07m5vn',
		// "options": {
        // "encrypt": true,
        // "enableArithAbort": true
        // },
		port: 1433
	};

	try{
		// Connect to database
		mssql.connect(config, function (err){

			// Create request handler along with two queries for the two tables
			var request = new mssql.Request();
			var queryA = 'SELECT * FROM dbo.beacons';
			var queryB = 'SELECT * FROM dbo.beacondata';

			if (err){
				throw err;
			}

			// Start of resulting html to send to user
			// var htmlToSend =`
			// <!DOCTYPE html>
			// <html lang="en">
			// <head>
			// <title>List of Beacons & Files</title>
			// </head>
			// <body>
			// <div id="searchbox">
			// <h1>Beacon Groups & Files</h1>
			// <table>
			// <tr>
			// <th>Group ID</th>
			// <th>Group Name</th>
			// <th>File Name</th>
			// </tr>`;

			// Query for files

			var htmlToSend1;
			var htmlToSend2;
			request.query(queryA, function (err, records){

				htmlToSend1 =`
			<!DOCTYPE html>
			<html lang="en">
			<head>
			<title>List of Beacons & Files</title>
			</head>
			<body>
			<div id="searchbox">
			<h1>Beacon Groups & Files</h1>
			<table>
			<tr>
			<th>Group ID</th>
			<th>Group Name</th>
			<th>File Name</th>
			</tr>`;
				if (err) console.log(err);

				// To the existing html table, add information for files
				for (var i = 0; i < records.recordset.length; i++){
					htmlToSend1 = htmlToSend1 + `
					<tr>
					<td>${records.recordset[i].group_id}</td>
					<td>${records.recordset[i].group_name}</td>
					<td>${records.recordset[i].group_file}</td>
					</tr>`;
				}
			});

			// These timeouts are to avoid weirdness in table lookup times
			setTimeout(function(){

				// Second table
				

				// Query for beacons
				request.query(queryB, function (err, records){
					if (err) console.log(err);

					htmlToSend2 =  `</table></div>
						<div id="searchbox">
						<h1>Beacons</h1>
						<table>
						<tr>
						<th>Beacon ID</th>
						<th>Group ID</th>
						<th>Node</th>
						<th>Numsens</th>
						<th>Threshold</th>
						<th>Direction</th>
						<th>Location Name</th>
						<th>Other</th>
						<th>Level</th>
						<th>BNorth</th>
						<th>NDist</th>
						<th>BSouth</th>
						<th>SDist</th>
						<th>BEast</th>
						<th>EDist</th>
						<th>BWest</th>
						<th>WDist</th>
						<th>BNEast</th>
						<th>NEastDist</th>
						<th>BNWest</th>
						<th>NWestDist</th>
						<th>BSEast</th>
						<th>SEastDist</th>
						<th>BSWest</th>
						<th>SWestDist</th>
						</tr>`;

					for (var i = 0; i < records.recordset.length; i++){
						htmlToSend2 = htmlToSend2 + `
						<tr>
						<td>${records.recordset[i].beacon_id}</td>
						<td>${records.recordset[i].group_id}</td>
						<td>${records.recordset[i].node}</td>
						<td>${records.recordset[i].numsens}</td>
						<td>${records.recordset[i].threshold}</td>
						<td>${records.recordset[i].direction}</td>
						<td>${records.recordset[i].locname}</td>
						<td>${records.recordset[i].other}</td>
						<td>${records.recordset[i]._level}</td>
						<td>${records.recordset[i].bnorth}</td>
						<td>${records.recordset[i].ndist}</td>
						<td>${records.recordset[i].bsouth}</td>
						<td>${records.recordset[i].sdist}</td>
						<td>${records.recordset[i].beast}</td>
						<td>${records.recordset[i].edist}</td>
						<td>${records.recordset[i].bwest}</td>
						<td>${records.recordset[i].wdist}</td>
						<td>${records.recordset[i].bneast}</td>
						<td>${records.recordset[i].neastdist}</td>
						<td>${records.recordset[i].bnwest}</td>
						<td>${records.recordset[i].nwestdist}</td>
						<td>${records.recordset[i].bseast}</td>
						<td>${records.recordset[i].seastdist}</td>
						<td>${records.recordset[i].bswest}</td>
						<td>${records.recordset[i].swestdist}</td>
						</tr>
						`;
					}
					setTimeout(function(){
						console.log("Beacons Fetched");
					}, 500);
				});
			}, 250);
			setTimeout(function(){

			// 	// End of html
				var htmlToSend = htmlToSend1 + htmlToSend2 + `
				</table>
				</div>
				<a href="javascript:history.back()">Go Back</a>
				</body>
				</html>
				`;
				res.send(htmlToSend);
			}, 750);

			// setTimeout(function(){
			// 	mssql.close()
			// 	}, 3000);
		});
	}	
	catch(err){
		console.log(err)
		res.send(`<p>There was an issue displaying the data: ${err}</p>
			<a href="javascript:history.back()">Go Back</a>`);
	}
});

// Handle POST requests for inserting a file into the database
app.post('/fileinsert', function (req, res) {

	// POST variables
	var groupid = req.body.gid;
	var groupname = req.body.gname;
	var flrno = req.body.fno;
	var flrfile = req.body.flrfile;
	var bfile = req.body.bfile;
	var auth = req.body.auth;

	// Database Information
	const config = {
		user: 'udtk9290rxep45g',
		password: 'otGIcq@Pn%?vebYDzHNEre497',
		server: 'eu-az-sql-serv1.database.windows.net',
		database: 'd0melt24v07m5vn',
		// "options": {
        // "encrypt": true,
        // "enableArithAbort": true
        // },
		port: 1433
	};

	try{
		// Connect to database
		mssql.connect(config, function (err){

			// Create request handler and query to insert file
			// IF THE ORDER OF THE COLUMNS IN THE DATABASE EVER CHANGE, THE ORDER HERE WILL NEED TO REFLECT THAT
			var request = new mssql.Request();
			var ins_query = `INSERT INTO dbo.beacons VALUES (${groupid}, '${groupname}',${flrno},'${flrfile}','${bfile}')`;

			// Query to insert file
			request.query(ins_query,
			function (err, records) {
				try{
					if (err){
						console.log(err);
						throw err;
					}

					res.send(`<p>Successfully inserted group id ${groupid} into the database</p>
						<a href="javascript:history.back()">Go Back</a>`);
				}
				catch(err){
					res.send(`<p>There was an issue adding the file to the database: ${err}</p>
						<a href="javascript:history.back()">Go Back</a>`);
				}
			});

			setTimeout(function(){
			mssql.close()
			}, 3000);

		});
	}
	catch(err){
		res.send(`<p>There was an issue adding to the database: ${err}</p>
			<a href="javascript:history.back()">Go Back</a>`);
	}
});

// Handle POST requests for inserting beacon data into database

app.post('/beaconinsert', function (req, res) {

	//POST variables
	//IF THE NAME AND ID OF THE WEB FORM EVER GET CHANGED, THE NAMES OF THESE REQ.BODY ATTRIBUTES WILL NEED TO MATCH THEM 
	var beaconid = req.body.bid;
	var beaconname = req.body.bname;
	var groupid = req.body.gid;
	var node = req.body.node;
	var sens = req.body.sens;
	var thresh = req.body.thresh;
	var drn = req.body.drn;
	var lname = req.body.lname;
	var other = req.body.other;
	var lvl = req.body.lvl;
	var bn = req.body.bn;
	var nd = req.body.nd;
	var bs = req.body.bs;
	var sd = req.body.sd;
	var be = req.body.be;
	var ed = req.body.ed;
	var bw = req.body.bw;
	var wd = req.body.wd;
	var bne = req.body.bne;
	var ned = req.body.ned;
	var bnw = req.body.bnw;
	var nwd = req.body.nwd;
	var bse = req.body.bse;
	var sed = req.body.sed;
	var bsw = req.body.bsw;
	var swd = req.body.swd;
	var auth = req.body.auth;


	// Database Information
	const config = {
		user: 'udtk9290rxep45g',
		password: 'otGIcq@Pn%?vebYDzHNEre497',
		server: 'eu-az-sql-serv1.database.windows.net',
		database: 'd0melt24v07m5vn',
		// "options": {
        // "encrypt": true,
        // "enableArithAbort": true
        // },
		port: 1433
	};

	try{
		// Connect to database
		mssql.connect(config, function (err){

			// Create request handler and query to insert beacon data
			// IF THE ORDER OF COLUMNS IN THE DATABASE CHANGE, THE ORDER HERE WILL NEED TO REFLECT THAT
			var request = new mssql.Request();
			var ins_query = `INSERT INTO dbo.beacondata VALUES ('${beaconid}', ${groupid}, ${node}, ${sens}, ${thresh}, ${drn}, '${lname}', '${other}', ${lvl}, ${bn}, ${nd}, ${bs}, ${sd}, ${be}, ${ed}, ${bw}, ${wd}, ${bne}, ${ned}, ${bnw}, ${nwd}, ${bse}, ${sed}, ${bsw}, ${swd})`;

			// Query to insert beacon data
			request.query(ins_query, function (err, records) {
				try{
					if (err){
						console.log(err);
						throw err;
					}

					res.send(`<p>Successfully inserted beacon ${beaconid} into the database</p>
						<a href="javascript:history.back()">Go Back</a>`);					
				}
				catch(err){
					res.send(`<p>There was an issue adding to the database: ${err}</p>
						<a href="javascript:history.back()">Go Back</a>`);
				}
			});
				setTimeout(function(){
				mssql.close()
				}, 500);

		});
	}
	catch(err){
		console.log(`There was an issue adding to the database: ${err}`);
		res.send(`<p>There was an issue adding to the database: ${err}</p>
			<a href="javascript:history.back()">Go Back</a>`);
}
});

// Handle POST requests to delete beacons from the database
app.post('/delete', function (req, res) {

	// POST variables
	var bid = req.body.bid;
	var auth = req.body.auth;

	// Database Information
	const config = {
		user: 'udtk9290rxep45g',
		password: 'otGIcq@Pn%?vebYDzHNEre497',
		server: 'eu-az-sql-serv1.database.windows.net',
		database: 'd0melt24v07m5vn',
		// "options": {
        // "encrypt": true,
        // "enableArithAbort": true
        // },
		port: 1433
	};

	try {
		// Connect to database
		mssql.connect(config, function (err){

			// Create request handler and query for deleting beacons
			var request = new mssql.Request();
			var queryd = `DELETE FROM dbo.beacondata WHERE beacon_id = '${bid}'`;

			// To delete groups of beacons from the file table:
			// var queryf = `DELETE FROM dbo.beacons WHERE group_id = ${bid}`;
			// request.query(queryf, function (err, records){
			// 	if (err) throw err;
			// });
			
			// Query to delete beacons
			request.query(queryd, function (err, records){
				if (err) throw err;

				res.send(`<p>Successfully deleted beacon id '${bid}' from the database.</p>
					<a href="javascript:history.back()">Go Back</a>`);
			});

			setTimeout(function(){
				mssql.close();
				}, 500);
		});
		

	}
	catch(err){
		console.log(`There was an issue deleting from the database: ${err}`);
		res.send(`<p>There was an issue deleting from the database: ${err}</p>
			<a href="javascript:history.back()">Go Back</a>`);
	}
});
//---
app.post('/gdelete', function (req, res) {

	// POST variables
	var gid = req.body.gid;
	var auth = req.body.auth;

	// Database Information
	const config = {
		user: 'udtk9290rxep45g',
		password: 'otGIcq@Pn%?vebYDzHNEre497',
		server: 'eu-az-sql-serv1.database.windows.net',
		database: 'd0melt24v07m5vn',
		// "options": {
        // "encrypt": true,
        // "enableArithAbort": true
        // },
		port: 1433
	};

	try {
		// Connect to database
		mssql.connect(config, function (err){

			// Create request handler and query for deleting beacons
			var request = new mssql.Request();
			var queryd = `DELETE FROM dbo.beacons WHERE group_id = ${gid}`;

			// To delete groups of beacons from the file table:
			// var queryf = `DELETE FROM dbo.beacons WHERE group_id = ${bid}`;
			// request.query(queryf, function (err, records){
			// 	if (err) throw err;
			// });
			
			// Query to delete beacons
			request.query(queryd, function (err, records){
				if (err) throw err;

				res.send(`<p>Successfully deleted group id ${gid} from the database.</p>
					<a href="javascript:history.back()">Go Back</a>`);
			});

			setTimeout(function(){
				mssql.close();
				}, 500);
		});
		

	}
	catch(err){
		console.log(`There was an issue deleting from the database: ${err}`);
		res.send(`<p>There was an issue deleting from the database: ${err}</p>
			<a href="javascript:history.back()">Go Back</a>`);
	}
});
///////////////////here main
// Handle POST requests for downloading files for beacons
app.post('/beacon', function (req, res) {

	// POST variables
	var auth = req.body.auth;
	var gid = req.body.gid;
	var fno = req.body.fno;

	// Database Information	
	const config = {
		user: 'udtk9290rxep45g',
		password: 'otGIcq@Pn%?vebYDzHNEre497',
		server: 'eu-az-sql-serv1.database.windows.net',
		database: 'd0melt24v07m5vn',
		// "options": {
        // "encrypt": true,
        // "enableArithAbort": true
        // },
		port: 1433
	};

	try{
		// Connect to database
		mssql.connect(config, function (err) {

			// Create request handler and query for files
			var request = new mssql.Request();
			var query = `SELECT beacon_file FROM dbo.beacons WHERE group_id = ${gid} AND floor_num = ${fno}`;

			// Query for file to download
			request.query(query,
			function (err, records) {
				try{
					if (err){
						console.log(err);
						throw err;
					}

					try {

						// If there are files associated with the given group ID
						if (records.rowsAffected != '0'){
							// Get filename & send for download
							// NOTE: We can either send a download or send text, not both using the current setup
							var fileName = 'beaconfiles/' + records.recordset[0].beacon_file;
							res.download(fileName, function (derr) {
								if (derr) {
									throw(derr);
								}

								else {
								console.log(`Successfully sent ${fileName} for download.`)
								}
							});
						}
						else{
							res.send(`<p>There are no files with that group ID.</p>
								<a href="javascript:history.back()">Go Back</a>`);	
						}
					}
					catch (err) {
						console.log(`There was an error:  ${err} `);
						res.send(`<p>There was an error. Make sure the group ID is correct: ${err}</p>
							<a href="javascript:history.back()">Go Back</a>` );
					}
				}
				catch(err){
					res.send(`<p>There was an error getting the file: ${err}</p>
						<a href="javascript:history.back()">Go Back</a>`);
				}
			});
			// setTimeout(function(){
			// mssql.close();
			// }, 1500);

		});
		// setTimeout(function(){
		// 	mssql.close();
		// 	}, 1500);
	}
	catch(err){
		console.log(`There was an issue connecting to the database, check the authorization: ${err} `);
		res.send(`<p>There was an issue connecting to the database, check the authorization: ${err}</p>
			<a href="javascript:history.back()">Go Back</a>`);
	}
});

// Handle POST requests for downloading files for beacons
app.post('/floor', function (req, res) {

	// POST variables
	var auth = req.body.auth;
	var gid = req.body.gid;
	var fno = req.body.fno;





	// Database Information	
	const config = {
		user: 'udtk9290rxep45g',
		password: 'otGIcq@Pn%?vebYDzHNEre497',
		server: 'eu-az-sql-serv1.database.windows.net',
		database: 'd0melt24v07m5vn',
		// "options": {
        // "encrypt": true,
        // "enableArithAbort": true
        // },
		port: 1433
	};

	try{
		// Connect to database
		mssql.connect(config, function (err) {


			// Create request handler and query for files
			var request = new mssql.Request();
			var query = `SELECT floor_file FROM dbo.beacons WHERE group_id = ${gid} AND floor_num = ${fno}`;

			// Query for file to download
			request.query(query,
			function (err, records) {

				try{
					if (err){
						console.log(err);
						throw err;
					}

					try {



						// If there are files associated with the given group ID
						if (records.rowsAffected != '0'){
							// Get filename & send for download
							// NOTE: We can either send a download or send text, not both using the current setup
							var fileName = 'beaconfiles/' + records.recordset[0].floor_file;
							res.download(fileName, function (derr) {
								if (derr) {
									throw(derr);
								}

								else {
								console.log(`Successfully sent ${fileName} for download.`)
								}
							});
						}
						else{
							res.send(`<p>There are no files with that group ID.</p>
								<a href="javascript:history.back()">Go Back</a>`);	
						}
					}
					catch (err) {
						console.log(`There was an error:  ${err} `);
						res.send(`<p>There was an error. Make sure the group ID is correct: ${err}</p>
							<a href="javascript:history.back()">Go Back</a>` );
					}
				}
				catch(err){
					res.send(`<p>There was an error getting the file: ${err}</p>
						<a href="javascript:history.back()">Go Back</a>`);
				}
			});
			// setTimeout(function(){
			// mssql.close();
			// }, 1000);

		});
		// setTimeout(function(){
		// 	mssql.close();
		// 	}, 1000);
	}
	catch(err){
		console.log(`There was an issue connecting to the database, check the authorization: ${err} `);
		res.send(`<p>There was an issue connecting to the database, check the authorization: ${err}</p>
			<a href="javascript:history.back()">Go Back</a>`);
	}
});

// Handle POST requests for beacon data
app.post('/data', function (req, res) {

	// POST variables
	// IF THE NAME OF THE POST VARIABLES GET CHANGED ON THE WEB FORM, THEY (REQ.BODY) WILL NEED TO MATCH HERE
	var auth = req.body.auth;
	var beaconid = req.body.beaconid;

	// Database Information
	const config = {
		user: 'udtk9290rxep45g',
		password: 'otGIcq@Pn%?vebYDzHNEre497',
		server: 'eu-az-sql-serv1.database.windows.net',
		database: 'd0melt24v07m5vn',
		// "options": {
    	// "encrypt": true,
    	// "enableArithAbort": true
    	// },
		port: 1433
	};

	try{
		// Connect to database
		mssql.connect(config, function (err) {

			// Create request handler and query for beacon data
			var request = new mssql.Request();
			var query = `SELECT * FROM dbo.beacondata WHERE beacon_id = '${beaconid}'`;

			// Query for beacon data
			request.query(query,
			function (err, records) {
				if (err) console.log(err);

				try {
					// Send the data in pure JSON form
					if(records.recordset.length == 0){
						throw 'Beacod ID not found in database'
					}
					else{
						res.send(records);
						console.log(`Successfully sent ${records} for '${beaconid}'`);
					}
				}
				catch (err) {
					console.log(`There was an error:  ${err} `);
					// res.send(`<p>There was an error. Make sure the beacon id is correct: ${err}</p>
					// 	<a href="javascript:history.back()">Go Back</a>` );
				}
			});
			// setTimeout(function(){
			// 	mssql.close();
			// }, 3000);

		});
		// setTimeout(function(){
		// 	mssql.close();
		// 	}, 1000);

		
	}
	catch(err){
		console.log(`There was an issue connecting to the database, check the authorization: ${err} `);
		res.send(`<p>There was an issue connecting to the database, check the authorization: ${err}</p>
			<a href="javascript:history.back()">Go Back</a>`);
	}
});


// Start up web server and begin listening on port 5000
var server = app.listen(portt, function() {
	console.log('Server is listening at port 1433 or whatever from heroku...');
});