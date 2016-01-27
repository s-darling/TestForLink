CREATE TABLE EBX_REL (
	update_id NVARCHAR2(50) NOT NULL ,
	t_stamp NUMBER(24),
	product_info NVARCHAR2(50),
	CONSTRAINT EBX_REL_PK PRIMARY KEY  (update_id));
