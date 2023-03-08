SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[beacons](
	[group_id] [int] NOT NULL,
	[group_name] [varchar](50) NOT NULL,
	[floor_num] [int] NOT NULL,
	[floor_file] [varchar](max) NULL,
	[beacon_file] [varchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[beacons] ADD PRIMARY KEY CLUSTERED 
(
	[group_id] ASC,
	[floor_num] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

-----------------------------------------------------------------


IF NOT EXISTS (
    select * from sysobjects where name='beacons' and xtype='U'
) CREATE TABLE beacons (
    [group_id] INT,
    [group_name] NVARCHAR(12),
    [floor_num] INT,
    [floor_file] NVARCHAR(19),
    [beacon_file] NVARCHAR(8)
);
INSERT INTO beacons VALUES (1,N'Wallace Hall',1,N'Wallace-1ST-FLR.png',N'list.rtf'),
	(1,N'Wallace Hall',2,N'Wallace-2ND-FLR.png',N'list.rtf'),
	(1,N'Wallace Hall',3,N'Wallace-3RD-FLR.png',N'list.rtf'),
	(2,N'Jabara Hall',1,N'Jabara-1ST-FLR.png',N'list.rtf'),
	(222,N'222',222,N'rer.hgg',N'rer.ghh'),
	(111111,N'111111',111111,N'111111',N'111111');
