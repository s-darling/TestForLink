CREATE TABLE EBX_REP (
	repository_id NVARCHAR2(12) NOT NULL ,
	format_id NVARCHAR2(32) NOT NULL ,
	repository_label NVARCHAR2(64),
	 last_read NUMBER(24),
	last_write NUMBER(24),
	CONSTRAINT EBX_REP_PK PRIMARY KEY  (repository_id, format_id));
CREATE TABLE EBX_HOM (
	home_id INT NOT NULL ,
	parent_home_id INT NOT NULL ,
	home_name NVARCHAR2(32) NOT NULL ,
	home_type NVARCHAR2(1) NOT NULL ,
	creation_date NUMBER(24),
	termination_date NUMBER(24),
	last_read NUMBER(24),
	last_write NUMBER(24),
	CONSTRAINT EBX_HOM_PK PRIMARY KEY  (home_id));
CREATE TABLE EBX_ILR (
	instance_id INT NOT NULL ,
	reference NVARCHAR2(64) NOT NULL ,
	uuid NVARCHAR2(36) NOT NULL ,
	CONSTRAINT EBX_ILR_PK PRIMARY KEY  (instance_id));
CREATE TABLE EBX_IRV (
	instance_id INT NOT NULL ,
	revision_id INT NOT NULL ,
	parent_reference NVARCHAR2(64),
	content_type NVARCHAR2(1) NOT NULL ,
	record_id INT NOT NULL ,
	shared_revision NVARCHAR2(1),
	revision_date NUMBER(24),
	content VARBINARY (2048),
	CONSTRAINT EBX_IRV_PK PRIMARY KEY  (instance_id, revision_id, content_type, record_id));
CREATE TABLE EBX_HTI (
	home_id INT NOT NULL ,
	instance_id INT NOT NULL ,
	revision_id INT NOT NULL ,
	CONSTRAINT EBX_HTI_PK PRIMARY KEY  (home_id, instance_id));
CREATE TABLE EBX_TLR (
	table_rid INT NOT NULL ,
	instance_id INT NOT NULL ,
	content_type NVARCHAR2(1) NOT NULL ,
	xs_path NVARCHAR2(255),
	xs_id NVARCHAR2(32),
	CONSTRAINT EBX_TLR_PK PRIMARY KEY  (table_rid));
CREATE INDEX EBX_TIX ON EBX_TLR (instance_id, content_type);
CREATE TABLE EBX_BRV (
	table_rid INT NOT NULL ,
	bloc_id INT NOT NULL ,
	revision_id INT NOT NULL ,
	record_id INT NOT NULL ,
	shared_revision NVARCHAR2(1),
	revision_date NUMBER(24),
	content VARBINARY (2048),
	CONSTRAINT EBX_BRV_PK PRIMARY KEY  (table_rid, bloc_id, revision_id, record_id));
CREATE TABLE EBX_HTB (
	home_id INT NOT NULL ,
	table_rid INT NOT NULL ,
	bloc_id INT NOT NULL ,
	revision_id INT NOT NULL ,
	CONSTRAINT EBX_HTB_PK PRIMARY KEY  (home_id, table_rid, bloc_id));
CREATE INDEX EBX_BIX ON EBX_HTB (table_rid, bloc_id, revision_id);
