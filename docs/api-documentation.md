# API Documentation

Use Authorization: Bearer YOUR_TOKEN for all routes except login.

## Login

POST http://localhost:8083/api/auth/login

```json
{
    "username":"admin",
    "password":"admin123"
}
```

## Products

GET http://localhost:8083/api/products  
GET http://localhost:8083/api/products?categoryId={id}&brandId={id}  
GET http://localhost:8083/api/products/{id}  
POST http://localhost:8083/api/products

```json
{
  "sku": "LAPTOP-001",
  "name": "Gaming Laptop",
  "description": "High-performance laptop",
  "price": 1299.99,
  "quantityOnHand": 20,
  "categoryId": 1,
  "brandId": 1
}
```

PUT http://localhost:8083/api/products/{id}

```json
{
  "sku": "LAPTOP-001",
  "name": "Gaming Laptop Pro",
  "description": "Updated high-performance laptop",
  "price": 1399.99,
  "quantityOnHand": 25,
  "categoryId": 1,
  "brandId": 1
}
```

DELETE http://localhost:8083/api/products/{id}

## Categories

GET http://localhost:8083/api/categories  
GET http://localhost:8083/api/categories/{id}  
POST http://localhost:8083/api/categories

```json
{
  "name": "Laptops",
  "description": "Notebooks and portable computers",
  "brandIds": [1, 2]
}
```

PUT http://localhost:8083/api/categories/{id}

```json
{
  "name": "Laptops",
  "description": "Updated description",
  "brandIds": [1]
}
```

DELETE http://localhost:8083/api/categories/{id}  
POST http://localhost:8083/api/categories/{id}/brands/{brandId}  
DELETE http://localhost:8083/api/categories/{id}/brands/{brandId}

## Brands

GET http://localhost:8083/api/brands  
GET http://localhost:8083/api/brands/{id}  
POST http://localhost:8083/api/brands

```json
{
  "name": "Apple",
  "description": "Apple Inc.",
  "categoryIds": [1]
}
```

PUT http://localhost:8083/api/brands/{id}

```json
{
  "name": "Apple Inc.",
  "description": "Cupertino electronics manufacturer",
  "categoryIds": [1]
}
```

DELETE http://localhost:8083/api/brands/{id}

## Expenses

GET http://localhost:8083/api/expenses  
GET http://localhost:8083/api/expenses?category={category}&startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}  
GET http://localhost:8083/api/expenses/{id}  
GET http://localhost:8083/api/expenses/total  
POST http://localhost:8083/api/expenses

```json
{
  "title": "Shop Electricity Bill",
  "category": "Utilities",
  "amount": 150.00,
  "expenseDate": "2026-10-20",
  "paymentMethod": "CASH",
  "referenceNumber": "INV-1029",
  "description": "Electricity bill for October"
}
```

PUT http://localhost:8083/api/expenses/{id}

```json
{
  "title": "Shop Electricity Bill",
  "category": "Utilities",
  "amount": 165.50,
  "expenseDate": "2026-10-20",
  "paymentMethod": "BANK_TRANSFER",
  "referenceNumber": "INV-1029-PAID",
  "description": "Updated October electricity bill"
}
```

DELETE http://localhost:8083/api/expenses/{id}


## Inventory

GET http://localhost:8083/api/inventory  
GET http://localhost:8083/api/inventory/{productId}  
POST http://localhost:8083/api/inventory

```json
{
  "productId": 1,
  "quantityOnHand": 25
}
```

PUT http://localhost:8083/api/inventory/{productId}

```json
{
  "quantityOnHand": 40
}
```

DELETE http://localhost:8083/api/inventory/{productId}

## Customers

GET http://localhost:8083/api/customers  
GET http://localhost:8083/api/customers/{id}  
POST http://localhost:8083/api/customers

```json
{
  "userId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+123456789"
}
```

PUT http://localhost:8083/api/customers/{id}

```json
{
  "userId": 1,
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+198765432"
}
```

DELETE http://localhost:8083/api/customers/{id}

## Employees

GET http://localhost:8083/api/employees  
GET http://localhost:8083/api/employees/{id}  
POST http://localhost:8083/api/employees

```json
{
  "userId": 2,
  "firstName": "Vathana",
  "lastName": "Roeun",
  "jobTitle": "Store Manager"
}
```

PUT http://localhost:8083/api/employees/{id}

```json
{
  "userId": 2,
  "firstName": "Vathana",
  "lastName": "Roeun",
  "jobTitle": "Senior Store Manager"
}
```

DELETE http://localhost:8083/api/employees/{id}

## Sales

POST http://localhost:8083/api/sales

```json
{
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```
