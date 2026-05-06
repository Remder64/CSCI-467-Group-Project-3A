/*
This is the database structure we used to run our website locally.
Run this sql query ONLY ONCE to create the database
*/
CREATE DATABASE IF NOT EXISTS auto_parts;
use auto_parts;

-- Table for quantity of an item on hand
CREATE TABLE IF NOT EXISTS inventory (
	partNumber	int PRIMARY KEY,
	quantityOnHand	int,
	description	varchar(50)
);

-- Table for customer orders
CREATE TABLE IF NOT EXISTS customerorders (
	orderID			int 			PRIMARY KEY 	AUTO_INCREMENT,
    date			date,
	time			time,
	status			varchar(15)		NOT NULL,
	price			float(10,2)		NOT NULL,
	weightLB		float(10,2)		NOT NULL,
	authNumber		varchar(50),
	transactionID	varchar(100),
	custName		varchar(100),
	custEmail		varchar(100),
	custAddress		varchar(200),
	custCity		varchar(100),
	custState		varchar(50),
	custZip			varchar(20),
	subtotal		decimal(10,2),
	shippingCharge	decimal(10,2) 	DEFAULT 0
);

-- Table for a specific order
CREATE TABLE IF NOT EXISTS orderitems (
    itemID      INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    orderID     INT NOT NULL,
    partNumber  INT NOT NULL,
    quantity    INT NOT NULL,
    unitPrice   DECIMAL(10,2) NOT NULL,
    weightEach  DECIMAL(6,2) NOT NULL,
    
    FOREIGN KEY (orderID) REFERENCES customerorders(orderid)
);

CREATE TABLE IF NOT EXISTS shippingrates (
    orderID     INT NOT NULL,
    weightLB    INT NOT NULL,
	chargemulti INT NOT NULL DEFAULT 1,
	shiptotal   INT NOT NULL,
    
    FOREIGN KEY (orderID) REFERENCES customerorders(orderid)
);

Describe inventory;
Describe customerorders;
Describe orderitems;