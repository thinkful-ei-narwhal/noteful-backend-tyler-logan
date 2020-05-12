TRUNCATE notes;

INSERT INTO notes (name, description, modified,folder_id)
VALUES 
 ( 'cats', 'blarg 0', TIMESTAMP WITH TIME ZONE '2004-10-19 10:23:54+02', 1),
 ( 'dogs', 'blarg 1', TIMESTAMP WITH TIME ZONE '2004-10-19 10:23:54+02', 2),
 ( 'lizards', 'blarg 3', TIMESTAMP WITH TIME ZONE '2004-10-19 10:23:54+02', 3),
 ( 'dragons', 'blarg 2', TIMESTAMP WITH TIME ZONE '2004-10-19 10:23:54+02', 4),
 ( 'amphibians', 'blarg 4', TIMESTAMP WITH TIME ZONE '2004-10-19 10:23:54+02', 5)
;