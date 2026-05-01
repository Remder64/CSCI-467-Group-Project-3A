USE auto_parts;

ALTER TABLE customerorders
    ADD COLUMN authNumber VARCHAR(50),
    ADD COLUMN transactionID VARCHAR(100),
    ADD COLUMN custName VARCHAR(100),
    ADD COLUMN custEmail VARCHAR(100),
    ADD COLUMN custAddress VARCHAR(200),
    ADD COLUMN custCity VARCHAR(100),
    ADD COLUMN custState VARCHAR(50),
    ADD COLUMN custZip VARCHAR(20),
    ADD COLUMN subtotal DECIMAL(10,2),
    ADD COLUMN shippingCharge DECIMAL(10,2) DEFAULT 0;

ALTER TABLE customerorders
    MODIFY COLUMN price float(10,2) NOT NULL,
    MODIFY weightLB float(10,2) NOT NULL;

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
    rateID      INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    minWeight   DECIMAL(6,2) NOT NULL,
    maxWeight   DECIMAL(6,2) NOT NULL,
    charge      DECIMAL(10,2) NOT NULL
);
