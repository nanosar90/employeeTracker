use employee_DB;

insert into department (name)
values ('engineering'), ('human resources'), ('marketing');

insert into role (title, salary, department_id)
values ('manager', 100000.00, 1),
('engineer', 90000.00, 1),
('marketer', 60000.00, 3).
('Director', 75000.00, 2),
('Manager', 50000.00, 2),
('developer', 75000.00, 1),
('Manager', 80000.00, 3);

insert into employee (first_name, last_name, employee_id, manager_id)
values ('bill', 'mcgill', 1)
('trey', 'love', 2, 1)
('nate', 'blake', 3, )