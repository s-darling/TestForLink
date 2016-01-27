CREATE TABLE EBX_REP (
	repository_id NVARCHAR(12) NOT NULL ,
	format_id NVARCHAR(32) NOT NULL ,
	repository_label NVARCHAR(64),
	 last_read BIGINT,
	last_write BIGINT,
	CONSTRAINT EBX_REP_PK PRIMARY KEY  (repository_id, format_id));
CREATE TABLE EBX_HOM (
	home_id INTEGER NOT NULL ,
	parent_home_id INTEGER NOT NULL ,
	home_name NVARCHAR(32) NOT NULL ,
	home_type NVARCHAR(1) NOT NULL ,
	creation_date BIGINT,
	termination_date BIGINT,
	last_read BIGINT,
	last_write BIGINT,
	CONSTRAINT EBX_HOM_PK PRIMARY KEY  (home_id));
CREATE TABLE EBX_ILR (
	instance_id INTEGER NOT NULL ,
	reference NVARCHAR(64) NOT NULL ,
	uuid NVARCHAR(36) NOT NULL ,
	CONSTRAINT EBX_ILR_PK PRIMARY KEY  (instance_id));
CREATE TABLE EBX_IRV (
	instance_id INTEGER NOT NULL ,
	revision_id INTEGER NOT NULL ,
	parent_reference NVARCHAR(64),
	content_type NVARCHAR(1) NOT NULL ,
	record_id INTEGER NOT NULL ,
	shared_revision NVARCHAR(1),
	revision_date BIGINT,
	content VARBINARY(2048),
	CONSTRAINT EBX_IRV_PK PRIMARY KEY  (instance_id, revision_id, content_type, record_id));
CREATE TABLE EBX_HTI (
	home_id INTEGER NOT NULL ,
	instance_id INTEGER NOT NULL ,
	revision_id INTEGER NOT NULL ,
	CONSTRAINT EBX_HTI_PK PRIMARY KEY  (home_id, instance_id));
CREATE TABLE EBX_TLR (
	table_rid INTEGER NOT NULL ,
	instance_id INTEGER NOT NULL ,
	content_type NVARCHAR(1) NOT NULL ,
	xs_path NVARCHAR(255),
	xs_id NVARCHAR(32),
	CONSTRAINT EBX_TLR_PK PRIMARY KEY  (table_rid));
CREATE INDEX EBX_TIX ON EBX_TLR (instance_id, content_type);
CREATE TABLE EBX_BRV (
	table_rid INTEGER NOT NULL ,
	bloc_id INTEGER NOT NULL ,
	revision_id INTEGER NOT NULL ,
	record_id INTEGER NOT NULL ,
	shared_revision NVARCHAR(1),
	revision_date BIGINT,
	content VARBINARY(2048),
	CONSTRAINT EBX_BRV_PK PRIMARY KEY  (table_rid, bloc_id, revision_id, record_id));
CREATE TABLE EBX_HTB (
	home_id INTEGER NOT NULL ,
	table_rid INTEGER NOT NULL ,
	bloc_id INTEGER NOT NULL ,
	revision_id INTEGER NOT NULL ,
	CONSTRAINT EBX_HTB_PK PRIMARY KEY  (home_id, table_rid, bloc_id));
CREATE INDEX EBX_BIX ON EBX_HTB (table_rid, bloc_id, revision_id);
