CREATE TABLE EBX_RPU (
	xs_id NUMBER(10) NOT NULL ,
	name NVARCHAR2(64) NOT NULL ,
	dataspace NVARCHAR2(512) NOT NULL ,
	dataset NVARCHAR2(512) NOT NULL ,
	refresh NVARCHAR2(32) NOT NULL ,
	CONSTRAINT EBX_RPU_PK PRIMARY KEY  (xs_id, name));
CREATE TABLE EBX_TXR (
	xs_id NUMBER(10) NOT NULL ,
	rpu_name NVARCHAR2(64) NOT NULL ,
	txs_id NUMBER(10) NOT NULL ,
	table_name_in_db NVARCHAR2(512) NOT NULL ,
	state NUMBER(2) NOT NULL ,
	created_time TIMESTAMP NOT NULL ,
	last_refreshed_time TIMESTAMP,
	CONSTRAINT EBX_TXR_PK PRIMARY KEY  (xs_id, rpu_name, txs_id),
	 FOREIGN KEY (xs_id, rpu_name) REFERENCES EBX_RPU(xs_id, name));
