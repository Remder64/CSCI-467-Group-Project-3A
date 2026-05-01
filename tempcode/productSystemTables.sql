Create database auto_parts;
use auto_parts;

-- run this to create tables

CREATE TABLE customerorders (
	orderid int not null primary key auto_increment,
    date date,
    time time,
    status varchar(15) NOT NULL,
    price float(10,2) NOT NULL,
    weightLB float(10,2) NOT NULL
);

create table inventory (
	partNumber int primary key,
    quantityOnHand int,
    description varchar(50)
);
