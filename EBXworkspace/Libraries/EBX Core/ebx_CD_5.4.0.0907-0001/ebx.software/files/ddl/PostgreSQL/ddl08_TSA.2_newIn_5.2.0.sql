CREATE TABLE EBX_LXS (
	master_txs_id INTEGER NOT NULL ,
	list_path VARCHAR(512) NOT NULL ,
	aux_txs_id INTEGER NOT NULL ,
	CONSTRAINT EBX_LXS_PK PRIMARY KEY  (master_txs_id, aux_txs_id));
