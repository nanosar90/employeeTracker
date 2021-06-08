drop database if exists employee_DB;

CREATE DATABASE employee_DB;

use employee_DB;

create table department (
    id INT NOT NULL AUTO_INCREMENT primary key,
    name varchar(30) not null
);

create table role (
    id INT NOT NULL AUTO_INCREMENT primary key,
    title varchar(30) not null,
    salary decimal not null,
    foreign key(deparment_id) references department(id)
);

create table employee (
    id INT NOT NULL AUTO_INCREMENT primary key,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    foreign key(role_id) references employee(id),
    foreign key(manager_id) references employee(id)
);
