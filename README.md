# stashaway-assessment

# Introduction
This repo is about stashaway take home assessment

# Installation
The Project is run using yarn, hence yarn need to be installed

## Installation steps
Install Packages
```bash
  yarn install
```

Run DB migrations
```bash
  yarn knex migrate:latest
```

Run DB Seeding
```bash
  yarn knex seed:run
```

Start Node
```bash
  yarn dev
```

To run tests, run the following command

```bash
  yarn test
```


## API Reference
#### Add Deposit

```http
  POST /deposit/add-deposit
```

| Parameter | Type     | Description                       | Example  |
| :-------- | :------- | :-------------------------------- | :------- |
| `user_id`      | `string` | **Required**. User ID | 1
| `bank_name`      | `string` | **Required**. Bank name | cimb
| `bank_card_number`      | `string` | **Required**. Bank Card Number | 1234123412341234
| `deposit_amount`      | `string` | **Required**. Deposit Amount | 10500
| `deposit_type`      | `string` | **Required**. Deposit Type | one_time
| `deposit_date`      | `string` | **Required**. Deposit Date | 2023-04-23
| `deposit_to_plans`      | `array` | **Required**. Deposit Portfolios | [{"amount": 10000, "portfolio": "general"},{"amount": 500,"portfolio": "retirement"}]

#### Request 
```bash
{
    "user_id": "1",
    "bank_name": "cimb",
    "bank_card_number": "1234123412341234",
    "deposit_amount": 10500,
    "deposit_type": "one_time",
    "deposit_date": "2023-04-23",
    "deposit_to_plans": [
        {
            "amount": 10000,
            "portfolio": "general"
        },
        {
            "amount": 500,
            "portfolio": "retirement"
        }
    ]
}
```

#### Response
```bash
{
    "message": "Deposit added successfully",
    "data": {
        "deposit_allocation_balance": {
            "general": 11.12,
            "retirement": 122
        }
    }
}
```
