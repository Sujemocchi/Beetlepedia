-- Background-removed copy of a photo (path under static/assets/images, e.g. cutouts/elapus.webp).
alter table image add column cutout varchar(200);
