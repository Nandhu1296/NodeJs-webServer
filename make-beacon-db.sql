DROP TABLE IF EXISTS dbo.beacons;
DROP TABLE IF EXISTS dbo.beacondata;

CREATE TABLE dbo.beacons (
	group_id	INT NOT NULL,
	group_name	VARCHAR(50) NOT NULL,
	floor_num   INT NOT NULL,
	floor_file	VARCHAR(max),
	beacon_file VARCHAR(max),
	PRIMARY KEY (group_id, floor_num)
);

CREATE TABLE dbo.beacondata (
	beacon_id	INT NOT NULL,
	group_id	INT NOT NULL,
	node		INT NOT NULL,
	numsens		INT NOT NULL,
	threshold	INT NOT NULL,
	direction	INT NOT NULL,
	locname		VARCHAR(100) NOT NULL,
	other		VARCHAR(200),
	_level		INT NOT NULL,
	bnorth		INT NOT NULL,
	ndist		INT NOT NULL,
	bsouth		INT NOT NULL,
	sdist		INT NOT NULL,
	beast		INT NOT NULL,
	edist		INT NOT NULL,
	bwest		INT NOT NULL,
	wdist		INT NOT NULL,
	bneast		INT NOT NULL,
	neastdist	INT NOT NULL,
	bnwest		INT NOT NULL,
	nwestdist	INT NOT NULL,
	bseast		INT NOT NULL,
	seastdist	INT NOT NULL,
	bswest		INT NOT NULL,
	swestdist	INT NOT NULL,
	PRIMARY KEY (node),
	FOREIGN KEY (group_id) REFERENCES dbo.beacons(group_id)
);