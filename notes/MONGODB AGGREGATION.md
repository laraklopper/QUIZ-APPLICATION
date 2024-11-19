MONGODB CRUD OPERATIONS
---

### 1. `$inc` 
- **Purpose**: Increment (or decrement) a field's value in a document.
- **Usage**: Often used in update operations to increase or decrease numerical values.

#### Example:
```javascript
db.inventory.updateOne(
  { _id: 1 }, // Filter
  { $inc: { quantity: 5, sold: -1 } } 
);
```

**Explanation**:
- If the `quantity` was 10, it will now be 15.
- If the `sold` was 3, it will now be 2.

Syntax
```
{ $inc: { <field1>: <amount1>, <field2>: <amount2>, ... } }
````
---

### 2. **`$nin`**
- **Purpose**: Matches documents where the field's value is **not in** the specified array of values.
- **Usage**: Typically used in queries for filtering.

#### Example:
```javascript
db.products.find(
  { category: { $nin: ["electronics", "appliances"] } }
);
```

**Explanation**:
- Returns all documents where `category` is not `electronics` or `appliances`.

---

### 3. **`$in`**

The $in operator selects documents where the field equals any value in the specified array

**_Syntax_**
`````
{ field: { $in: [<value1>, <value2>, ... <valueN> ] } }
``````

- **Purpose**: Matches documents where the field's value is **in** the specified array of values.
- **Usage**: Opposite of `$nin`, used to include specific values in a query.

#### Example:
```javascript
db.products.find(
  { category: { $in: ["books", "clothing"] } }
);
```
**Explanation**:
- Returns all documents where `category` is either `books` or `clothing`.

_**Syntax**_
``````
{ $set: { <newField>: <expression>, ... } }
`````````

---

### 4. **`$set`**
- **Purpose**: 
 	- Updates a document by setting the value of a field to a specified value. 
	- If the field doesn't exist, it will be added.
- **Usage**: Commonly used in update operations.

#### Example:
```javascript
db.users.updateOne(
  { username: "john_doe" }, // Filter
  { $set: { age: 30, city: "Cape Town" } } // Update or add fields
);
```

**Explanation**:
- If `age` and `city` fields already exist, their values are updated.
- If they don’t exist, they are added to the document.

**_Syntax_**

``````
{ $set: { <newField>: <expression>, ... } }
`````````

---

### 5. **`$eq`**
- **Purpose**: Matches documents where the field's value is **equal to** the specified value.
- **Usage**: Often used in queries to filter for exact matches.

#### Example:
```javascript
db.employees.find(
  { role: { $eq: "manager" } }
);
```

**Explanation**:
- Returns all documents where the `role` field is exactly `"manager"`.
- 
_**Syntax**_

`````````
{ $eq: [ <expression1>, <expression2> ] }
`````
---

Syntax
`````````
{ $eq: [ <expression1>, <expression2> ] }
`````
