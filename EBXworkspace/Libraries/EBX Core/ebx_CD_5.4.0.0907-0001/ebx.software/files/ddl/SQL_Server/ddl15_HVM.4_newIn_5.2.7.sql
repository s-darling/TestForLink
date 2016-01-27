CREATE TABLE EBX_HV_MERGE (
	tx_id INTEGER NOT NULL ,
	merged_home_id INTEGER NOT NULL ,
	begin_time BIGINT NOT NULL ,
	end_time BIGINT NOT NULL ,
	CONSTRAINT EBX_HV_MERGE_PK PRIMARY KEY  (tx_id, merged_home_id));
