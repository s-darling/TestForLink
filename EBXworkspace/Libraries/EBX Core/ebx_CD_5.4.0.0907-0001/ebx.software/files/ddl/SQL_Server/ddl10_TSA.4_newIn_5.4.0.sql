CREATE TABLE EBX_RPU (
	xs_id INTEGER NOT NULL ,
	name NVARCHAR(64) NOT NULL ,
	dataspace NVARCHAR(512) NOT NULL ,
	dataset NVARCHAR(512) NOT NULL ,
	refresh NVARCHAR(32) NOT NULL ,
	CONSTRAINT EBX_RPU_PK PRIMARY KEY  (xs_id, name));
CREATE TABLE EBX_TXR (
	xs_id INTEGER NOT NULL ,
	rpu_name NVARCHAR(64) NOT NULL ,
	txs_id INTEGER NOT NULL ,
	table_name_in_db NVARCHAR(512) NOT NULL ,
	state BIGINT NOT NULL ,
	created_time DATETIME NOT NULL ,
	last_refreshed_time DATETIME,
	CONSTRAINT EBX_TXR_PK PRIMARY KEY  (xs_id, rpu_name, txs_id),
	FOREIGN KEY (xs_id, rpu_name) REFERENCES EBX_RPU(xs_id, name));
