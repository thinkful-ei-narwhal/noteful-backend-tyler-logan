BEGIN;

INSERT INTO notes (name, content, folder_id)
VALUES 
 ( 'rottweiler', 'big furry monster dog', 1),
 ( 'Henry', 'There''s like 20 of them', 2),
 ( 'Tabby', 'What other kind is there?', 3),
 ( 'Chupacabra', 'Okay this one is probably real', 4),
 ( 'Sun', 'best star', 5)
;

COMMIT;