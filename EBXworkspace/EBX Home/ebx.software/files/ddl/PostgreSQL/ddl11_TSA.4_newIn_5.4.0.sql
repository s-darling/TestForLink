CREATE TABLE EBX_RPU (
	xs_id INTEGER NOT NULL ,
	name VARCHAR(64) NOT NULL ,
	dataspace VARCHAR(512) NOT NULL ,
	dataset VARCHAR(512) NOT NULL ,
	refresh VARCHAR(32) NOT NULL ,
	CONSTRAINT EBX_RPU_PK PRIMARY KEY  (xs_id, name));
CREATE TABLE EBX_TXR (
	xs_id INTEGER NOT NULL ,
	rpu_name VARCHAR(64) NOT NULL ,
	txs_id INTEGER NOT NULL ,
	table_name_in_db VARCHAR(512) NOT NULL ,
	state BIGINT NOT NULL ,
	created_time TIMESTAMP NOT NULL ,
	last_refreshed_time TIMESTAMP,
	CONSTRAINT EBX_TXR_PK PRIMARY KEY  (xs_id, rpu_name, txs_id),
	 FOREIGN KEY (xs_id, rpu_name) REFERENCES EBX_RPU(xs_id, name));
