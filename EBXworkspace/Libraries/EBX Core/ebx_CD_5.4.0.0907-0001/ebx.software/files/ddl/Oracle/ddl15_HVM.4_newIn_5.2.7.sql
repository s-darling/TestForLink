CREATE TABLE EBX_HV_MERGE (
	tx_id NUMBER(10) NOT NULL ,
	merged_home_id NUMBER(10) NOT NULL ,
	begin_time NUMBER NOT NULL ,
	end_time NUMBER NOT NULL ,
	CONSTRAINT EBX_HV_MERGE_PK PRIMARY KEY  (tx_id, merged_home_id));
