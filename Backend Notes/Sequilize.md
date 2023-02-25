
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

