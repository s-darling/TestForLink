CREATE TABLE EBX_HV_TX (
	tx_id INTEGER IDENTITY ,
	user_id INTEGER,
	action_id INTEGER,
	home_id INTEGER,
	session_id INTEGER,
	timestamp BIGINT,
	uuid NVARCHAR(36),
	execution_info NVARCHAR(4000),
	CONSTRAINT EBX_HV_TX_PK PRIMARY KEY  (tx_id));

CREATE TABLE EBX_HV_TX_STAT (
	tx_id INTEGER NOT NULL ,
	instance_id INTEGER,
	txs INTEGER,
	nb_creates INTEGER,
	nb_updates INTEGER,
	nb_deletes INTEGER);

CREATE TABLE EBX_HV_USER (
	user_id INTEGER IDENTITY ,
	name NVARCHAR(4000),
	CONSTRAINT EBX_HV_USER_PK PRIMARY KEY  (user_id));

CREATE TABLE EBX_HV_ACTION (
	action_id INTEGER IDENTITY ,
	built_in_action_name NVARCHAR(50),
	procedure_name NVARCHAR(4000),
	CONSTRAINT EBX_HV_ACTION_PK PRIMARY KEY  (action_id));

CREATE TABLE EBX_HV_INSTANCE (
	instance_id INTEGER IDENTITY ,
	reference NVARCHAR(64),
	content_type NVARCHAR(1),
	CONSTRAINT EBX_HV_INSTANCE_PK PRIMARY KEY  (instance_id));

CREATE TABLE EBX_HV_HOM (
	home_id INTEGER IDENTITY ,
	home_name NVARCHAR(32),
	home_type NVARCHAR(1),
	CONSTRAINT EBX_HV_HOM_PK PRIMARY KEY  (home_id));

CREATE TABLE EBX_HV_SESSION (
	session_id INTEGER IDENTITY ,
	session_type NVARCHAR(512),
	ip_address NVARCHAR(39),
	http_id NVARCHAR(4000),
	tracking_info NVARCHAR(4000),
	CONSTRAINT EBX_HV_SESSION_PK PRIMARY KEY  (session_id));

