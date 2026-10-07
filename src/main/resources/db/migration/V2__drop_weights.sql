-- Weight comparison removed: drop the weight bars, their source links and the genus weight note.
drop table genus_weight_source;
drop table genus_weight;
alter table genus drop column weights_note_en;
alter table genus drop column weights_note_ja;
alter table genus drop column weights_note_ko;
