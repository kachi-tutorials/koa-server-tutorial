# KOA SQL Server
Now that our server is up and running the next step is to connect it to a database. In this part we will be using a none-relational database **MongoDB**.

Before we start let's make sure we have [mongodb](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/) installed:
```
mongod --version
```
# Setup
In this tutorial we will be using mongoose with MongoDB. So let's start by installing **mongoose**:

```
npm i mongoose
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
const mongoose = require('mongoose');

const settings = {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}

mongoose.connect(
    `mongodb://localhost:27017/database`, 
    settings
);

module.exports = mongoose;
```

This file will connect us to our mongoDB database.

Now let's add the following to **event.models.js**:

```
const mongoose = require('.');
const Schema = mongoose.Schema;

const eventsSchema = new Schema({
    name: String,
    adultsOnly: Boolean,
    attendees: Number,
    description: String,
});

const Events = mongoose.model('events', eventsSchema);

module.exports = Events;
```

Although MongoDB is non-relational, we've can set schemas using mongoose with the following types:

1. **Name** - this will be a string representing the name of the event.
2. **Adults Only** - this will be a boolean field 
3. **Attendees** - this will be a number representing the number of attendees
4. **Description** - this will also be a string field.

## Controllers

```
const events = require('../models/events');
```

## Post Request
Let's update our post request in our **event.models.js**

The post request takes the request body and creates an object in our mongo database. If successful it will return **'Event Created!'**, if the request is unsuccessful then it will return a status **500 error**.

```
const postEvent = async ctx => {
    try {
        await events.create(ctx.request.body);
        ctx.body = 'Event Created!'
        ctx.status = 201;
    } catch (e) {
        ctx.status = 500;
    }
};
```
It should look something like this:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gxzjtsd0img7gdmjx4vd.png)

## Get Request
Let's update our get request in our **event.models.js**. We need to update our function to make it async and returns all the event items stored in our mongoDB.

```
const getEvents = async ctx => {
    try {
        const foundEvents = await events.find();
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
        "_id": "62883741ecfe30464fa14817",
        "attendees": 100,
        "name": "test event",
        "adultsOnly": false,
        "description": "test event description",
        "__v": 0
    }
]
```
