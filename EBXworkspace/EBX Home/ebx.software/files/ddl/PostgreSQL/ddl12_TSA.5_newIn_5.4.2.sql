ALTER TABLE EBX_TXR ADD CONSTRAINT EBX_TXR_UNQ UNIQUE  (table_name_in_db);
ALTER TABLE EBX_TXS ADD CONSTRAINT EBX_TXS_XS_FK FOREIGN KEY (xs_id) REFERENCES EBX_XS(xs_id)
ALTER TABLE EBX_TXR ADD CONSTRAINT EBX_TXR_XS_FK FOREIGN KEY (xs_id) REFERENCES EBX_XS(xs_id)
ALTER TABLE EBX_TXR ADD CONSTRAINT EBX_TXR_TXS_FK FOREIGN KEY (txs_id) REFERENCES EBX_TXS(txs_id)
