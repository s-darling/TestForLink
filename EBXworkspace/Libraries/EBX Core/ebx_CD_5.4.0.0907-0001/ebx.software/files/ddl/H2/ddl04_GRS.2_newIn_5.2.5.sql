CREATE INDEX EBX_BRVIX ON EBX_BRV (table_rid, bloc_id, revision_id, shared_revision);
DROP INDEX EBX_BIX;
CREATE INDEX EBX_BIX ON EBX_HTB (home_id, table_rid, bloc_id, revision_id);
