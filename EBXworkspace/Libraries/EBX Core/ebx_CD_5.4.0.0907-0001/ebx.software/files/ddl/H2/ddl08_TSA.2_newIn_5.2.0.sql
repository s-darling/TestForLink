CREATE TABLE EBX_LXS (
	master_txs_id INT NOT NULL ,
	list_path NVARCHAR2(512) NOT NULL ,
	aux_txs_id INT NOT NULL ,
	CONSTRAINT EBX_LXS_PK PRIMARY KEY  (master_txs_id, aux_txs_id));
