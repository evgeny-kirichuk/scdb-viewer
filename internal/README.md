Creating a CDC-enabled table
Let’s connect to your Scylla cluster and create a new CDC-enabled table. We will create an example table by issuing the following CQL query and insert some example data:
```
CREATE KEYSPACE quickstart_keyspace WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1};
```
```
CREATE TABLE quickstart_keyspace.orders(
   customer_id int,
   order_id int,
   product text,
   PRIMARY KEY(customer_id, order_id)) WITH cdc = {'enabled': true};
```
```
INSERT INTO quickstart_keyspace.orders(customer_id, order_id, product) VALUES (1, 1, 'pizza');
INSERT INTO quickstart_keyspace.orders(customer_id, order_id, product) VALUES (1, 2, 'cookies');
INSERT INTO quickstart_keyspace.orders(customer_id, order_id, product) VALUES (1, 3, 'tea');
```
If you already have a table you wish to use, but it does not have CDC enabled, you can turn it on by using the following CQL query:
```
ALTER TABLE keyspace.table_name with cdc = {'enabled': true};
```
To learn more about Scylla CDC, visit [Change Data Capture (CDC) page](https://opensource.docs.scylladb.com/stable/using-scylla/cdc/index.html).

