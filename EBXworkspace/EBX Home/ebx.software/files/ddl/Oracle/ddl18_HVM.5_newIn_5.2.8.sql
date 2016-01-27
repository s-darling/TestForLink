ALTER TABLE EBX_HV_TX MODIFY (user_id  NOT NULL);
ALTER TABLE EBX_HV_TX MODIFY (session_id  NOT NULL);
ALTER TABLE EBX_HV_TX MODIFY (action_id  NOT NULL);
DROP INDEX EBX_TXIX;
ALTER TABLE EBX_HV_TX MODIFY (home_id  NOT NULL);
CREATE INDEX EBX_TXIX ON EBX_HV_TX (home_id, timestamp, tx_id);
ALTER TABLE EBX_HV_TX_STAT MODIFY (instance_id  NOT NULL);
ALTER TABLE EBX_HV_TX_STAT MODIFY (txs  NOT NULL);
ALTER TABLE EBX_HV_TX_STAT MODIFY (nb_creates  NOT NULL);
ALTER TABLE EBX_HV_TX_STAT MODIFY (nb_updates  NOT NULL);
ALTER TABLE EBX_HV_TX_STAT MODIFY (nb_deletes  NOT NULL);