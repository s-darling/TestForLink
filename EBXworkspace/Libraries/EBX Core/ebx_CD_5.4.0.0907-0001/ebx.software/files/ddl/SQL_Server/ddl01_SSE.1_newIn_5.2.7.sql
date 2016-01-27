CREATE TABLE EBX_DDS (
	script_id INTEGER NOT NULL ,
	repository_patch NVARCHAR(50) NOT NULL ,
	product_info NVARCHAR(50) NOT NULL ,
	start_time DATETIME NOT NULL ,
	end_time DATETIME,
	CONSTRAINT EBX_DDS_PK PRIMARY KEY  (script_id));
CREATE INDEX EBX_DDSIX ON EBX_DDS (repository_patch);
CREATE TABLE EBX_DDO (
	script_id INTEGER NOT NULL ,
	operation_id INTEGER NOT NULL ,
	statement NVARCHAR(MAX) NOT NULL ,
	start_time DATETIME NOT NULL ,
	end_time DATETIME,
	CONSTRAINT EBX_DDO_PK PRIMARY KEY  (script_id, operation_id),
	FOREIGN KEY (script_id) REFERENCES EBX_DDS(script_id));
CREATE TABLE EBX_DDX (
	script_id INTEGER NOT NULL ,
	operation_id INTEGER NOT NULL ,
	execution_id INTEGER NOT NULL ,
	start_time DATETIME NOT NULL ,
	end_time DATETIME,
	error NVARCHAR(MAX),
	CONSTRAINT EBX_DDX_PK PRIMARY KEY  (execution_id, operation_id, script_id),
	FOREIGN KEY (script_id, operation_id) REFERENCES EBX_DDO(script_id, operation_id));
