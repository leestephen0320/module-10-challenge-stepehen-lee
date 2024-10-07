INSERT INTO department (department_name)
VALUES ('Idol'),
    ('Art'),
    ('Music'),
    ('Legal');

INSERT INTO roles (title,salary,department_id)
VALUES ('Idol Manager',800000,1),
    ('Top Idol',1000000,1),
    ('Art Director',600000,2),
    ('Artist',500000,2),
    ('Music Director',700000,3),
    ('Composer',450000,3),
    ('Legal Team Lead',1000000,4),
    ('Lawyer',700000,4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('M','Chan',1,null),
    ('Sora','Tokino',2,1),
    ('Ui','Shigure',3,null),
    ('Kay','Yu',4,3),
    ('Teddy','Loid',5,null),
    ('Len','Kagamine',6,5),
    ('Rin','Kagamine',6,5),
    ('Ya','Goo',7,null),
    ('Friend','A',8,8);