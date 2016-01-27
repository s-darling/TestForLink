CREATE TABLE EBX_REL (
	update_id NVARCHAR(50) NOT NULL ,
	t_stamp BIGINT,
	product_info NVARCHAR(50),
	CONSTRAINT EBX_REL_PK PRIMARY KEY  (update_id));
