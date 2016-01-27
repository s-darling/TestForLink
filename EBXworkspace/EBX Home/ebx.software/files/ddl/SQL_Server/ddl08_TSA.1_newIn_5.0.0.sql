CREATE TABLE EBX_XS (
	xs_id INTEGER IDENTITY ,
	xs_path NVARCHAR(512) NOT NULL ,
	state BIGINT NOT NULL ,
	last_write BIGINT,
	CONSTRAINT EBX_XS_PK PRIMARY KEY  (xs_id),
	CONSTRAINT EBX_XS_UNQ UNIQUE  (xs_path));

CREATE TABLE EBX_TXS (
	txs_id INTEGER IDENTITY ,
	table_path NVARCHAR(512) NOT NULL ,
	table_name_in_db NVARCHAR(512),
	table_name_in_db_for_HV NVARCHAR(512),
	state BIGINT NOT NULL ,
	state_hv BIGINT NOT NULL ,
	last_write BIGINT,
	xs_id INTEGER NOT NULL ,
	CONSTRAINT EBX_TXS_PK PRIMARY KEY  (txs_id),
	CONSTRAINT EBX_TXS_UNQ UNIQUE  (xs_id, table_path));

CREATE TABLE EBX_CXS (
	txs_id INTEGER NOT NULL ,
	cxs_id INTEGER NOT NULL ,
	column_path NVARCHAR(512) NOT NULL ,
	ctp_id INTEGER NOT NULL ,
	column_name_in_db NVARCHAR(512) NOT NULL ,
	state BIGINT NOT NULL ,
	last_write BIGINT,
	CONSTRAINT EBX_CXS_PK PRIMARY KEY  (txs_id, cxs_id));
CREATE TABLE EBX_IDX (
	txs_id INTEGER NOT NULL ,
	idx_id INTEGER IDENTITY ,
	index_name NVARCHAR(512),
	index_name_in_db NVARCHAR(512),
	flag_pk NVARCHAR(1) CHECK (flag_pk IN ( '0', '1' )),
	state BIGINT NOT NULL ,
	last_write BIGINT,
	CONSTRAINT EBX_IDX_PK PRIMARY KEY  (txs_id, idx_id));

CREATE TABLE EBX_ICX (
	idx_id INTEGER NOT NULL ,
	txs_id INTEGER NOT NULL ,
	cxs_id INTEGER NOT NULL ,
	column_order INTEGER NOT NULL ,
	CONSTRAINT EBX_ICX_PK PRIMARY KEY  (idx_id, txs_id, cxs_id));
CREATE TABLE EBX_CTP (
	ctp_id INTEGER IDENTITY ,
	column_type_name NVARCHAR(512) NOT NULL ,
	namespace NVARCHAR(512),
	CONSTRAINT EBX_CTP_PK PRIMARY KEY  (ctp_id),
	CONSTRAINT EBX_CTP_UNQ UNIQUE  (ctp_id, column_type_name));

CREATE TABLE EBX_FCT (
	fct_id INTEGER IDENTITY ,
	txs_id INTEGER NOT NULL ,
	cxs_id INTEGER NOT NULL ,
	facet_name NVARCHAR(512),
	value_string NVARCHAR(4000),
	value_int INTEGER,
	state BIGINT NOT NULL ,
	last_write BIGINT,
	CONSTRAINT EBX_FCT_PK PRIMARY KEY  (fct_id),
	CONSTRAINT EBX_FCT_UNQ UNIQUE  (fct_id, txs_id, cxs_id));

