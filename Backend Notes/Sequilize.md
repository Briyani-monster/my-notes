
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
const jane = await User.create({ name: "Jane", age: 100, cash: 5000 });

await jane.increment({  'age': 2,  'cash': 100});// If the values are incremented by the same amount, you can use this other syntax as well:

await jane.increment(['age', 'cash'], { by: 2 });
```

Decrementing works in the exact same way.



# 3. MODEL QUERYING

## Simple INSERT queries[​](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-insert-queries "Direct link to Simple INSERT queries")

First, a simple example:

```
// Create a new userconst jane = await User.create({ firstName: "Jane", lastName: "Doe" });

console.log("Jane's auto-generated ID:", jane.id);
```

The [`Model.create()`](https://sequelize.org/api/v6/class/src/model.js~Model.html#static-method-create) method is a shorthand for building an unsaved instance with [`Model.build()`](https://sequelize.org/api/v6/class/src/model.js~Model.html#static-method-build) and saving the instance with [`instance.save()`](https://sequelize.org/api/v6/class/src/model.js~Model.html#instance-method-save).

It is also possible to define which attributes can be set in the `create` method. This can be especially useful if you create database entries based on a form which can be filled by a user. Using that would, for example, allow you to restrict the `User` model to set only an username but not an admin flag (i.e., `isAdmin`):

```
const user = await User.create({  
						username: 'alice123',  
						isAdmin: true
					}, { fields: ['username'] });
	// let's assume the default of isAdmin is false
	
	console.log(user.username); // 'alice123'
	console.log(user.isAdmin); // false
```

## Simple SELECT queries[​](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-select-queries "Direct link to Simple SELECT queries")

You can read the whole table from the database with the [`findAll`](https://sequelize.org/api/v6/class/src/model.js~Model.html#static-method-findAll) method:

```
// Find all users

const users = await User.findAll();

console.log(users.every(user => user instanceof User)); // true

console.log("All users:", JSON.stringify(users, null, 2));
```


## Specifying attributes for SELECT queries[​](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#specifying-attributes-for-select-queries "Direct link to Specifying attributes for SELECT queries")

To select only some attributes, you can use the `attributes` option:

```
Model.findAll({  attributes: ['foo', 'bar']});
```

```
SELECT foo, bar FROM ...
```

Attributes can be renamed using a nested array:

```
Model.findAll({  attributes: ['foo', ['bar', 'baz'], 'qux']});
```

```
SELECT foo, bar AS baz, qux FROM ...
```

You can use [`sequelize.fn`](https://sequelize.org/api/v6/class/src/sequelize.js~Sequelize.html#static-method-fn) to do aggregations:

```
Model.findAll({  attributes: [
				'foo',
				[sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats'],    
				'bar']
				});
```

```
SELECT foo, COUNT(hats) AS n_hats, bar FROM ...
```

When using aggregation function, you must give it an alias to be able to access it from the model. In the example above you can get the number of hats with `instance.n_hats`.

Sometimes it may be tiresome to list all the attributes of the model if you only want to add an aggregation:

```
// This is a tiresome way of getting the number of hats (along with every column)

Model.findAll({  attributes: [    
'id', 'foo', 'bar', 'baz', 'qux', 'hats',   // We had to list all attributes...    [sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats'] 
// To add the aggregation...  
]});
// This is shorter, and less error prone because it still works if you add / remove attributes from your model later

Model.findAll({  attributes: {include: [
		[sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats']
		]  }});
```

```
SELECT id, foo, bar, baz, qux, hats, COUNT(hats) AS n_hats FROM ...
```

Similarly, it's also possible to remove a selected few attributes:

```
Model.findAll({  attributes: { exclude: ['baz'] }});
```

```
-- Assuming all columns are 'id', 'foo', 'bar', 'baz' and 'qux'SELECT id, foo, bar, qux FROM ...
```


## Applying WHERE clauses[​](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#applying-where-clauses "Direct link to Applying WHERE clauses")

The `where` option is used to filter the query. There are lots of operators to use for the `where` clause, available as Symbols from [`Op`](https://sequelize.org/api/v6/variable/index.html#static-variable-Op).

### The basics[​](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#the-basics "Direct link to The basics")

```
Post.findAll({  where: {    
				authorId: 2
				}});
// SELECT * FROM post WHERE authorId = 2;
```

Observe that no operator (from `Op`) was explicitly passed, so Sequelize assumed an equality comparison by default. The above code is equivalent to:

```
const { Op } = require("sequelize");

Post.findAll({  where: {    
				authorId: {      
				[Op.eq]: 2    
				}}});

// SELECT * FROM post WHERE authorId = 2;
```

Multiple checks can be passed:

```
Post.findAll({  where: {authorId: 12,status: 'active'  }});

// SELECT * FROM post WHERE authorId = 12 AND status = 'active';
```

Just like Sequelize inferred the `Op.eq` operator in the first example, here Sequelize inferred that the caller wanted an `AND` for the two checks. The code above is equivalent to:

```
const { Op } = require("sequelize");
Post.findAll({  where: {    
				[Op.and]: [      
				{authorId:12},      
				{ status: 'active' }    
				]  }});

// SELECT * FROM post WHERE authorId = 12 AND status = 'active';
```

An `OR` can be easily performed in a similar way:

```
const { Op } = require("sequelize");

Post.findAll({  where: {    
				[Op.or]: [      
				{ authorId: 12 },      
				{ authorId: 13 }    ]  }});
				
// SELECT * FROM post WHERE authorId = 12 OR authorId = 13;
```

Since the above was an `OR` involving the same field, Sequelize allows you to use a slightly different structure which is more readable and generates the same behavior:

```
const { Op } = require("sequelize");

Post.destroy({  where: {
				authorId: {      
				[Op.or]: [12, 13]    }  }});
				
// DELETE FROM post WHERE authorId = 12 OR authorId = 13;
```



### Operators[​](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators "Direct link to Operators")

Sequelize provides several operators.

```
const { Op } = require("sequelize");

Post.findAll({
  where: {
    [Op.and]: [{ a: 5 }, { b: 6 }],            // (a = 5) AND (b = 6)
    [Op.or]: [{ a: 5 }, { b: 6 }],             // (a = 5) OR (b = 6)
    someAttribute: {
      // Basics
      [Op.eq]: 3,                              // = 3
      [Op.ne]: 20,                             // != 20
      [Op.is]: null,                           // IS NULL
      [Op.not]: true,                          // IS NOT TRUE
      [Op.or]: [5, 6],                         // (someAttribute = 5) OR (someAttribute = 6)

      // Using dialect specific column identifiers (PG in the following example):
      [Op.col]: 'user.organization_id',        // = "user"."organization_id"

      // Number comparisons
      [Op.gt]: 6,                              // > 6
      [Op.gte]: 6,                             // >= 6
      [Op.lt]: 10,                             // < 10
      [Op.lte]: 10,                            // <= 10
      [Op.between]: [6, 10],                   // BETWEEN 6 AND 10
      [Op.notBetween]: [11, 15],               // NOT BETWEEN 11 AND 15

      // Other operators

      [Op.all]: sequelize.literal('SELECT 1'), // > ALL (SELECT 1)

      [Op.in]: [1, 2],                         // IN [1, 2]
      [Op.notIn]: [1, 2],                      // NOT IN [1, 2]

      [Op.like]: '%hat',                       // LIKE '%hat'
      [Op.notLike]: '%hat',                    // NOT LIKE '%hat'
      [Op.startsWith]: 'hat',                  // LIKE 'hat%'
      [Op.endsWith]: 'hat',                    // LIKE '%hat'
      [Op.substring]: 'hat',                   // LIKE '%hat%'
      [Op.iLike]: '%hat',                      // ILIKE '%hat' (case insensitive) (PG only)
      [Op.notILike]: '%hat',                   // NOT ILIKE '%hat'  (PG only)
      [Op.regexp]: '^[h|a|t]',                 // REGEXP/~ '^[h|a|t]' (MySQL/PG only)
      [Op.notRegexp]: '^[h|a|t]',              // NOT REGEXP/!~ '^[h|a|t]' (MySQL/PG only)
      [Op.iRegexp]: '^[h|a|t]',                // ~* '^[h|a|t]' (PG only)
      [Op.notIRegexp]: '^[h|a|t]',             // !~* '^[h|a|t]' (PG only)

      [Op.any]: [2, 3],                        // ANY (ARRAY[2, 3]::INTEGER[]) (PG only)
      [Op.match]: Sequelize.fn('to_tsquery', 'fat & rat') // match text search for strings 'fat' and 'rat' (PG only)

      // In Postgres, Op.like/Op.iLike/Op.notLike can be combined to Op.any:
      [Op.like]: { [Op.any]: ['cat', 'hat'] }  // LIKE ANY (ARRAY['cat', 'hat'])

      // There are more postgres-only range operators, see below
    }
  }
});
```

# Model Querying - Finders

## `findAll`[​](https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findall "Direct link to findall")

The `findAll` method is already known from the previous tutorial. It generates a standard `SELECT` query which will retrieve all entries from the table (unless restricted by something like a `where` clause, for example).

## `findByPk`[​](https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findbypk "Direct link to findbypk")

The `findByPk` method obtains only a single entry from the table, using the provided primary key.

```
const project = await Project.findByPk(123);if (project === null) {  console.log('Not found!');} else {  console.log(project instanceof Project); // true  // Its primary key is 123}
```


## `findOne`[​](https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone "Direct link to findone")

The `findOne` method obtains the first entry it finds (that fulfills the optional query options, if provided).

```
const project = await Project.findOne({ where: { title: 'My Title' } });if (project === null) {  console.log('Not found!');} else {  console.log(project instanceof Project); // true  console.log(project.title); // 'My Title'}
```


## `findOrCreate`[​](https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findorcreate "Direct link to findorcreate")

The method `findOrCreate` will create an entry in the table unless it can find one fulfilling the query options. In both cases, it will return an instance (either the found instance or the created instance) and a boolean indicating whether that instance was created or already existed.

The `where` option is considered for finding the entry, and the `defaults` option is used to define what must be created in case nothing was found. If the `defaults` do not contain values for every column, Sequelize will take the values given to `where` (if present).

Let's assume we have an empty database with a `User` model which has a `username` and a `job`.

```
const [user, created] = await User.findOrCreate({
  where: { username: 'sdepold' },
  defaults: {
    job: 'Technical Lead JavaScript'
  }
});
console.log(user.username); // 'sdepold'
console.log(user.job); // This may or may not be 'Technical Lead JavaScript'
console.log(created); // The boolean indicating whether this instance was just created
if (created) {
  console.log(user.job); // This will certainly be 'Technical Lead JavaScript'
}
```

## `findAndCountAll`[​](https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findandcountall "Direct link to findandcountall")

The `findAndCountAll` method is a convenience method that combines `findAll` and `count`. This is useful when dealing with queries related to pagination where you want to retrieve data with a `limit` and `offset` but also need to know the total number of records that match the query.

When `group` is not provided, the `findAndCountAll` method returns an object with two properties:

-   `count` - an integer - the total number records matching the query
-   `rows` - an array of objects - the obtained records

When `group` is provided, the `findAndCountAll` method returns an object with two properties:

-   `count` - an array of objects - contains the count in each group and the projected attributes
-   `rows` - an array of objects - the obtained records

```
const { count, rows } = await Project.findAndCountAll({
  where: {
    title: {
      [Op.like]: 'foo%'
    }
  },
  offset: 10,
  limit: 2
});
console.log(count);
console.log(rows);
```