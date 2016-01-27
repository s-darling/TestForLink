CREATE TABLE EBX_DDS (
	script_id INTEGER NOT NULL ,
	repository_patch VARCHAR(50) NOT NULL ,
	product_info VARCHAR(50) NOT NULL ,
	start_time TIMESTAMP NOT NULL ,
	end_time TIMESTAMP,
	CONSTRAINT EBX_DDS_PK PRIMARY KEY  (script_id));
CREATE INDEX EBX_DDSIX ON EBX_DDS (repository_patch);
CREATE TABLE EBX_DDO (
	script_id INTEGER NOT NULL ,
	operation_id INTEGER NOT NULL ,
	statement CLOB NOT NULL ,
	start_time TIMESTAMP NOT NULL ,
	end_time TIMESTAMP,
	CONSTRAINT EBX_DDO_PK PRIMARY KEY  (script_id, operation_id),
	FOREIGN KEY (script_id) REFERENCES EBX_DDS(script_id));
CREATE TABLE EBX_DDX (
	script_id INTEGER NOT NULL ,
	operation_id INTEGER NOT NULL ,
	execution_id INTEGER NOT NULL ,
	start_time TIMESTAMP NOT NULL ,
	end_time TIMESTAMP,
	error CLOB,
	CONSTRAINT EBX_DDX_PK PRIMARY KEY  (execution_id, operation_id, script_id),
	FOREIGN KEY (script_id, operation_id) REFERENCES EBX_DDO(script_id, operation_id));
