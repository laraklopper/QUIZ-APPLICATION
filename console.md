# CONSOLE MESSAGES

In JavaScript, `console` messages are used for debugging and logging information to the browser's console. 

---

### 1. `console.log()`  
Used for general output of messages.

```js
console.log("This is a log message");
```

---

### 2. `console.info()`  
Similar to `console.log()`, but styled differently in some browsers.

```js
console.info("This is an info message");
```

---

### 3. `console.warn()`  
Used to log warnings – usually styled in yellow/orange.

```js
console.warn("This is a warning");
```

---

### 4. `console.error()`  
Used to log error messages – usually styled in red.

```js
console.error("This is an error message");
```

---

### 5. `console.table()`  
Displays tabular data in a table format.

```js
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 }
];
console.table(users);
```

---

### 6. `console.debug()`  
For debugging messages (may be hidden by default in some browsers unless dev tools are configured to show verbose logs).

```js
console.debug("Debugging message");
```

---

### 7. `console.group()` and `console.groupEnd()`  
Used to group related log messages together.

```js
console.group("User Info");
console.log("Name: user");
console.log("Age: 27");
console.groupEnd();
```

---

### 8. `console.time()` and `console.timeEnd()`  
Used to measure how long something takes to execute.

```js
console.time("loopTime");
for (let i = 0; i < 1000000; i++) {}
console.timeEnd("loopTime");
```

---

### 9. `console.assert()`  
Logs a message only if the assertion fails.

```js
console.assert(2 + 2 === 5, "Math is broken!");
```

## SUMMARY
---

| **Console Method**      | **Use Case**                      | **Explanation**                                                                 |
|------------------------|----------------------------------|---------------------------------------------------------------------------------|
| `console.log()`         | General info, form submission     | Logs standard messages or variables, like "Form submitted with name"     |
| `console.warn()`        | Validation warnings               | Shows a yellow warning in the console when a required field is missing         |
| `console.error()`       | API error handling, login fail    | Outputs an error in red if something fails, e.g., a failed `fetch` or login    |
| `console.table()`       | Display array/object data         | Shows structured data in a table for easy readability (e.g., list of users)    |
| `console.debug()`       | Debug function values             | Outputs detailed info (often hidden unless "verbose" logs are enabled)         |
| `console.time()`        | Measure how long a task takes     | Starts a timer—useful for performance testing or debugging slow code           |
| `console.timeEnd()`     | Stop the timer                    | Ends the timer and logs the elapsed time                                       |
| `console.group()`       | Group related logs                | Creates an expandable/collapsible group in the console for organized logs      |
| `console.groupEnd()`    | End the log group                 | Closes the group opened by `console.group()`                                   |
| `console.assert()`      | Conditional logging (on fail)     | Only logs if the given expression is false, great for catching logic issues    |
