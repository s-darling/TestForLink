CREATE TABLE EBX_XS (
	xs_id NUMBER(10) NOT NULL ,
	xs_path NVARCHAR2(512) NOT NULL ,
	state NUMBER(2) NOT NULL ,
	last_write NUMBER(24),
	CONSTRAINT EBX_XS_PK PRIMARY KEY  (xs_id),
	CONSTRAINT EBX_XS_UNQ UNIQUE  (xs_path));
CREATE SEQUENCE EBX_XS_SEQ START WITH 1 INCREMENT BY 1;
CREATE TABLE EBX_TXS (
	txs_id NUMBER(10) NOT NULL ,
	table_path NVARCHAR2(512) NOT NULL ,
	table_name_in_db NVARCHAR2(512),
	table_name_in_db_for_HV NVARCHAR2(512),
	state NUMBER(2) NOT NULL ,
	state_hv NUMBER(2) NOT NULL ,
	last_write NUMBER(24),
	xs_id NUMBER(10) NOT NULL ,
	CONSTRAINT EBX_TXS_PK PRIMARY KEY  (txs_id),
	CONSTRAINT EBX_TXS_UNQ UNIQUE  (xs_id, table_path));
CREATE SEQUENCE EBX_TXS_SEQ START WITH 1 INCREMENT BY 1;
CREATE TABLE EBX_CXS (
	txs_id NUMBER(10) NOT NULL ,
	cxs_id NUMBER(10) NOT NULL ,
	column_path NVARCHAR2(512) NOT NULL ,
	ctp_id NUMBER(10) NOT NULL ,
	column_name_in_db NVARCHAR2(512) NOT NULL ,
	state NUMBER(2) NOT NULL ,
	last_write NUMBER(24),
	CONSTRAINT EBX_CXS_PK PRIMARY KEY  (txs_id, cxs_id));
CREATE TABLE EBX_IDX (
	txs_id NUMBER(10) NOT NULL ,
	idx_id NUMBER(10) NOT NULL ,
	index_name NVARCHAR2(512),
	index_name_in_db NVARCHAR2(512),
	flag_pk NVARCHAR2(1) CHECK (flag_pk IN ( '0', '1' )),
	state NUMBER(2) NOT NULL ,
	last_write NUMBER(24),
	CONSTRAINT EBX_IDX_PK PRIMARY KEY  (txs_id, idx_id));
CREATE SEQUENCE EBX_IDX_SEQ START WITH 1 INCREMENT BY 1;
CREATE TABLE EBX_ICX (
	idx_id NUMBER(10) NOT NULL ,
	txs_id NUMBER(10) NOT NULL ,
	cxs_id NUMBER(10) NOT NULL ,
	column_order NUMBER(10) NOT NULL ,
	CONSTRAINT EBX_ICX_PK PRIMARY KEY  (idx_id, txs_id, cxs_id));
CREATE TABLE EBX_CTP (
	ctp_id NUMBER(10) NOT NULL ,
	column_type_name NVARCHAR2(512) NOT NULL ,
	namespace NVARCHAR2(512),
	CONSTRAINT EBX_CTP_PK PRIMARY KEY  (ctp_id),
	CONSTRAINT EBX_CTP_UNQ UNIQUE  (ctp_id, column_type_name));
CREATE SEQUENCE EBX_CTP_SEQ START WITH 1 INCREMENT BY 1;
CREATE TABLE EBX_FCT (
	fct_id NUMBER(10) NOT NULL ,
	txs_id NUMBER(10) NOT NULL ,
	cxs_id NUMBER(10) NOT NULL ,
	facet_name NVARCHAR2(512),
	value_string NVARCHAR2(2000),
	value_int NUMBER(10),
	state NUMBER(2) NOT NULL ,
	last_write NUMBER(24),
	CONSTRAINT EBX_FCT_PK PRIMARY KEY  (fct_id),
	CONSTRAINT EBX_FCT_UNQ UNIQUE  (fct_id, txs_id, cxs_id));
CREATE SEQUENCE EBX_FCT_SEQ START WITH 1 INCREMENT BY 1;
