
drop table if exists auctions;
CREATE TABLE auctions(
  id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(100) NOT NULL,
  category VARCHAR(45) NOT NULL,
  starting_bid INT default 0,
  highest_bid INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO auctions (item_name, category, starting_bid, highest_bid)
VALUES ('Model 3', 'Tesla', 90000, 2000);