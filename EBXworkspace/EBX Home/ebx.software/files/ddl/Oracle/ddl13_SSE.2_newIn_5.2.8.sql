CREATE TABLE EBX_DDT (
	script_id NUMBER(10) NOT NULL ,
	txs_id NUMBER(10) NOT NULL ,
	CONSTRAINT EBX_DDT_PK PRIMARY KEY  (script_id, txs_id),
	 FOREIGN KEY (script_id) REFERENCES EBX_DDS(script_id),
	 FOREIGN KEY (txs_id) REFERENCES EBX_TXS(txs_id));
