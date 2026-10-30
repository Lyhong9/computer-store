ALTER TABLE customer_order_items DROP CONSTRAINT IF EXISTS fkop6tb1apto95njcywn6oy8avo;
ALTER TABLE customer_order_items ADD CONSTRAINT fkop6tb1apto95njcywn6oy8avo FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

