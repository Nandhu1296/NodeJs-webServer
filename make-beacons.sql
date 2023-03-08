DROP TABLE IF EXISTS beacons;
DROP TABLE IF EXISTS beacondata;

CREATE TABLE beacons (
	beacon_id		INT NOT NULL,
	beacon_name		VARCHAR(50) NOT NULL,
	beacon_file		VARCHAR(max) NOT NULL,
	PRIMARY KEY (beacon_id)
);

CREATE TABLE beacondata (
	beacon_id		INT NOT NULL,
	node			INT NOT NULL,
	numsens			INT NOT NULL DEFAULT 0,
	threshold		INT NOT NULL DEFAULT 0,
	direction		INT NOT NULL DEFAULT 0,
	locname			VARCHAR(100) NOT NULL,
	other			VARCHAR(200),
	_level			INT NOT NULL DEFAULT 0,
	bnorth			INT NOT NULL DEFAULT 0,
	ndist			INT NOT NULL DEFAULT 0,
	bsouth			INT NOT NULL DEFAULT 0,
	sdist			INT NOT NULL DEFAULT 0,
	beast			INT NOT NULL DEFAULT 0,
	edist			INT NOT NULL DEFAULT 0,
	bwest			INT NOT NULL DEFAULT 0,
	wdist			INT NOT NULL DEFAULT 0,
	bneast			INT NOT NULL DEFAULT 0,
	neastdist		INT NOT NULL DEFAULT 0,
	bnwest			INT NOT NULL DEFAULT 0,
	nwestdist		INT NOT NULL DEFAULT 0,
	bseast			INT NOT NULL DEFAULT 0,
	seastdist		INT NOT NULL DEFAULT 0,
	bswest			INT NOT NULL DEFAULT 0,
	swestdist		INT NOT NULL DEFAULT 0,
	PRIMARY KEY (beacon_id)
);