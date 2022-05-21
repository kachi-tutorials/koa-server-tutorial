# KOA SQL Server
Now that our server is up and running the next step is to connect it to a database. In this part we will be using a **SQL** database.

Before we start let's make sure we have [postgres](https://postgresapp.com/downloads.html) installed:
```
psql --version
```
# Setup
In this tutorial we will be using sequelize with postgres. So let's start by installing **postgres** and **sequelize**:

```
npm i pg sequelize
```
# Models
Once postgres is installed lets create our **models folder** and our first model and called it **event.models.js**. So let's run the following commands:

```
mkdir models
touch models/index.js
touch models/event.models.js
```
These commands will create a folder with two files named **index.js** and **event.models.js**. Let's first add the following code to **index.js**:

```
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
```
This file will connect us to our postgres database. Replace the **'database', 'username', 'password'** with your own postgres credentials. 

Now let's add the following to **event.models.js**:

```
const sequelize = require('.')
const { DataTypes } = require('sequelize');

const Event = sequelize.define('Events', {
  name: DataTypes.STRING,
  adultsOnly: DataTypes.BOOLEAN,
  attendees: DataTypes.INTEGER,
  description: DataTypes.STRING,
});

Event.sync();

module.exports = Event
```

We've just created a model named Event and defined the following types:

1. **Name** - this will be a string representing the name of the event.
2. **Adults Only** - this will be a boolean field 
3. **Attendees** - this will be a number representing the number of attendees
4. **Description** - this will also be a string field.

## Post Request
Let's update our post request in our **event.models.js**

The post request takes the request body and creates an object in our postgres database. If successful it will return **'Event Created!'**, if the request is unsuccessful then it will return a status **500 error**.

```
const postEvent = async ctx => {
    try {
        const { name, adultsOnly, attendees, description } = ctx.request.body;

        await Event.create({ name, adultsOnly, attendees, description });

        ctx.body = 'Event Created!'
        ctx.status = 201;
    } catch (err) {
        ctx.status = 500;
        throw (err)
    }
};
```
It should look something like this:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4ad3881exjy9rxez4zsg.png)


## Get Request
Let's update our get request in our **event.models.js**. We need to update our function to make it async and returns all the event items stored in our postgres.

```
const getEvents = async ctx => {
    try {
        const foundEvents = await Event.findAll();
        ctx.body = foundEvents;
        ctx.status = 200;
    } catch (err) {
        ctx.body = err;
        ctx.status = 500;
    }
};
```

If this works correctly you should get the following: 
```
[
    {
        "id": 1,
        "name": "test event",
        "adultsOnly": false,
        "attendees": 100,
        "description": "test event description",
        "createdAt": "2022-05-21T00:16:55.646Z",
        "updatedAt": "2022-05-21T00:16:55.646Z"
    }
]
```
