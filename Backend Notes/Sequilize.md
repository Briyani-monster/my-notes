
Website for [docs](https://www.sequelize.org)


installing 
`npm install --save sequelize`

database instalation
```
# One of the following:  
$ npm install --save pg pg-hstore # Postgres  
$ npm install --save mysql2  
$ npm install --save mariadb  
$ npm install --save sqlite3  
$ npm install --save tedious # Microsoft SQL Server  
$ npm install --save oracledb # Oracle Database
```

also need body parser to parse values

#### database connection folder
`database.js`
```
const { Sequelize } = require('sequelize');  
  
# Option 1: Passing a connection URI  

const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite  
const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres  
  
# Option 2: Passing parameters separately (sqlite)  
const sequelize = new Sequelize({  
dialect: 'sqlite',  
storage: 'path/to/database.sqlite'  
});  
  
# Option 3: Passing parameters separately (other dialects)  
const sequelize = new Sequelize('database', 'username', 'password', {  
host: 'localhost',  
dialect: /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */  
});

module.export=sequelize;
```


### Testing the connection
```
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
```

# 1.   MODELS Basics


it is a essence of sequelize.
abstraction view of table in database
`MODEL NAME` should always be singular


MODELS FOLDER
`Userjs`

```
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('..database.js');

const User = sequelize.define('User', {
  //  Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}, {
  // Other model options go here
  tableName:"userTable"
});

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true
```


`to sync table`

`user.sync()` or `sequelize.sync()` This creates the table if it doesn't exist (and does nothing if it already exists)

-   `User.sync({ force: true })` - This creates the table, dropping it first if it already existed

-   `User.sync({ alter: true })` - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.

### Database safety check[​](https://sequelize.org/docs/v6/core-concepts/model-basics/#database-safety-check "Direct link to Database safety check")

As shown above, the `sync` and `drop` operations are destructive. Sequelize accepts a `match` option as an additional safety check, which receives a RegExp:

```
// This will run .sync() only if database name ends with '_test'sequelize.sync({ force: true, match: /_test$/ });
```

`droping table`

`await User.drop();`

`sequelize.drop();`



`TimeStamps`

sequelize always add `createdAt` and `updatedAt`  to every model

using `DataTypes.DATE`
This behavior can be disabled for a model with the `timestamps: false` option:

```
sequelize.define('User', {  // ... (attributes)}, {  timestamps: false});
```

## Column declaration shorthand syntax[​](https://sequelize.org/docs/v6/core-concepts/model-basics/#column-declaration-shorthand-syntax "Direct link to Column declaration shorthand syntax")

If the only thing being specified about a column is its data type, the syntax can be shortened:

```
// This:sequelize.define('User', {  name: {    type: DataTypes.STRING  }});// Can be simplified to:sequelize.define('User', { name: DataTypes.STRING });
```


## Default Values[​](https://sequelize.org/docs/v6/core-concepts/model-basics/#default-values "Direct link to Default Values")

By default, Sequelize assumes that the default value of a column is `NULL`. This behavior can be changed by passing a specific `defaultValue` to the column definition:

```
sequelize.define('User', {  name: {    type: DataTypes.STRING,    defaultValue: "John Doe"  }});
```

Some special values, such as `DataTypes.NOW`, are also accepted:

```
sequelize.define('Foo', {  bar: {    type: DataTypes.DATETIME,    defaultValue: DataTypes.NOW    // This way, the current date/time will be used to populate this column (at the moment of insertion)  }});
```


## Data Types[​](https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types "Direct link to Data Types")

Every column you define in your model must have a data type. Sequelize provides [a lot of built-in data types](https://github.com/sequelize/sequelize/blob/v6/src/data-types.js). To access a built-in data type, you must import `DataTypes`:

```
const { DataTypes } = require("sequelize"); // Import the built-in data types
```

### Strings[​](https://sequelize.org/docs/v6/core-concepts/model-basics/#strings "Direct link to Strings")

```
DataTypes.STRING             // VARCHAR(255)DataTypes.STRING(1234)       // VARCHAR(1234)DataTypes.STRING.BINARY      // VARCHAR BINARYDataTypes.TEXT               // TEXTDataTypes.TEXT('tiny')       // TINYTEXTDataTypes.CITEXT             // CITEXT          PostgreSQL and SQLite only.DataTypes.TSVECTOR           // TSVECTOR        PostgreSQL only.
```

### Boolean[​](https://sequelize.org/docs/v6/core-concepts/model-basics/#boolean "Direct link to Boolean")

```
DataTypes.BOOLEAN            // TINYINT(1)
```

### Numbers[​](https://sequelize.org/docs/v6/core-concepts/model-basics/#numbers "Direct link to Numbers")

```
DataTypes.INTEGER            // INTEGERDataTypes.BIGINT             // BIGINTDataTypes.BIGINT(11)         // BIGINT(11)DataTypes.FLOAT              // FLOATDataTypes.FLOAT(11)          // FLOAT(11)DataTypes.FLOAT(11, 10)      // FLOAT(11,10)DataTypes.REAL               // REAL            PostgreSQL only.DataTypes.REAL(11)           // REAL(11)        PostgreSQL only.DataTypes.REAL(11, 12)       // REAL(11,12)     PostgreSQL only.DataTypes.DOUBLE             // DOUBLEDataTypes.DOUBLE(11)         // DOUBLE(11)DataTypes.DOUBLE(11, 10)     // DOUBLE(11,10)DataTypes.DECIMAL            // DECIMALDataTypes.DECIMAL(10, 2)     // DECIMAL(10,2)
```

#### Unsigned & Zerofill integers - MySQL/MariaDB only[​](https://sequelize.org/docs/v6/core-concepts/model-basics/#unsigned--zerofill-integers---mysqlmariadb-only "Direct link to Unsigned & Zerofill integers - MySQL/MariaDB only")

In MySQL and MariaDB, the data types `INTEGER`, `BIGINT`, `FLOAT` and `DOUBLE` can be set as unsigned or zerofill (or both), as follows:

```
DataTypes.INTEGER.UNSIGNED
DataTypes.INTEGER.ZEROFILL
DataTypes.INTEGER.UNSIGNED.ZEROFILL
// You can also specify the size i.e. INTEGER(10) instead of simply INTEGER// Same for BIGINT, FLOAT and DOUBLE
```

### Dates[​](https://sequelize.org/docs/v6/core-concepts/model-basics/#dates "Direct link to Dates")

```
DataTypes.DATE       // DATETIME for mysql / sqlite, TIMESTAMP WITH TIME ZONE for postgresDataTypes.DATE(6)    // DATETIME(6) for mysql 5.6.4+. Fractional seconds support with up to 6 digits of precisionDataTypes.DATEONLY   // DATE without time
```

### UUIDs[​](https://sequelize.org/docs/v6/core-concepts/model-basics/#uuids "Direct link to UUIDs")

For UUIDs, use `DataTypes.UUID`. It becomes the `UUID` data type for PostgreSQL and SQLite, and `CHAR(36)` for MySQL. Sequelize can generate UUIDs automatically for these fields, simply use `DataTypes.UUIDV1` or `DataTypes.UUIDV4` as the default value:

```
{  type: DataTypes.UUID,  defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1}
```

### Others[​](https://sequelize.org/docs/v6/core-concepts/model-basics/#others "Direct link to Others")

There are other data types, covered in a [separate guide](https://sequelize.org/docs/v6/other-topics/other-data-types/).


# 2.  Model instance

	1. build and save
		1.  const jane=User.build({name:"Jane"})
		2. await jane.save()


	2. create which saves and build
		1. const jane=User.create({name:"Jane"})


## `Note: logging instances`

```
console.log(jane.toJSON());
```

## Updating an instances

```
1. create and adding value

	const jane = await User.create({ name: "Jane" });  
	console.log(jane.name); // "Jane"  
	jane.name = "Ada";  
	// the name is still "Jane" in the database  
	await jane.save();  
	// Now the name was updated to "Ada" in the database!
```

```
2. set method

	const jane = await User.create({ name: "Jane" });  
	jane.set({  
		name: "Ada",  
		favoriteColor: "blue"  
	});  
	// As above, the database still has "Jane" and "green"  
	await jane.save();  
	// The database now has "Ada" and "blue" for name and favorite color
```

```
3. update method
	const jane = await User.create({ name: "Jane" });  
	jane.favoriteColor = "blue"  
	await jane.update({ name: "Ada" })  
	// The database now has "Ada" for name, but still has the default "green" for favorite color  
	await jane.save()  
	// Now the database has "Ada" for name and "blue" for favorite color
```

## Deleting an instance[​](https://sequelize.org/docs/v6/core-concepts/model-instances/#deleting-an-instance "Direct link to Deleting an instance")

You can delete an instance by calling [`destroy`](https://sequelize.org/api/v6/class/src/model.js~Model.html#instance-method-destroy):

```
const jane = await User.create({ name: "Jane" });
console.log(jane.name); // "Jane"await jane.destroy();// Now this entry was removed from the database
```

## Reloading an instance[​](https://sequelize.org/docs/v6/core-concepts/model-instances/#reloading-an-instance "Direct link to Reloading an instance")

You can reload an instance from the database by calling [`reload`](https://sequelize.org/api/v6/class/src/model.js~Model.html#instance-method-reload):

```
const jane = await User.create({ name: "Jane" });console.log(jane.name); // "Jane"jane.name = "Ada";// the name is still "Jane" in the databaseawait jane.reload();console.log(jane.name); // "Jane"
```

The reload call generates a `SELECT` query to get the up-to-date data from the database.

## Incrementing and decrementing integer values[​](https://sequelize.org/docs/v6/core-concepts/model-instances/#incrementing-and-decrementing-integer-values "Direct link to Incrementing and decrementing integer values")

In order to increment/decrement values of an instance without running into concurrency issues, Sequelize provides the [`increment`](https://sequelize.org/api/v6/class/src/model.js~Model.html#instance-method-increment) and [`decrement`](https://sequelize.org/api/v6/class/src/model.js~Model.html#instance-method-decrement) instance methods.

```
const jane = await User.create({ name: "Jane", age: 100 });const incrementResult = await jane.increment('age', { by: 2 });// Note: to increment by 1 you can omit the `by` option and just do `user.increment('age')`// In PostgreSQL, `incrementResult` will be the updated user, unless the option// `{ returning: false }` was set (and then it will be undefined).// In other dialects, `incrementResult` will be undefined. If you need the updated instance, you will have to call `user.reload()`.
```

You can also increment multiple fields at once:

```
const jane = await User.create({ name: "Jane", age: 100, cash: 5000 });await jane.increment({  'age': 2,  'cash': 100});// If the values are incremented by the same amount, you can use this other syntax as well:await jane.increment(['age', 'cash'], { by: 2 });
```

Decrementing works in the exact same way.

# 3. MODEL QUERYING