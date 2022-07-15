# KOA Tutorial

**`Koa Js`** is a web framework designed by the team behind **`Express`**, which aims to be a smaller, more expressive, and more robust foundation for web applications and APIs.

In this tutorial, we'll be making a **`Koa Js`** server from scratch using **`Node Js`**.

## Installation

In order to follow this tutorial you will need to have [**`Node`**](https://nodejs.org/en/download/) installed - ideally at the LTS _(long term support)_ version.

Run the following command in your terminal to check if you have **`Node`** installed:

```bash
node --version
```

In this tutorial, I will be using [**Visual studio code**](https://code.visualstudio.com/) as the text editor and [**Postman**](https://www.postman.com/) for the **`HTTP requests`**, but feel free to use whichever tools you want.

## Set up

Let's start by running the following commands:

```bash
mkdir koa_tutorial
cd koa_tutorial
npm init -y
```

### What did we just do?

1. Created a directory called **`koa_tutorial`**.
2. Inside our **`koa_tutorial`** directory we should have a file named **`package.json`** with default values.

Now we have our **`package.json`** file, let's install our dependancies by running the following command in our terminal:

```bash
npm i koa koa-bodyparser @koa/cors koa-router
```

### What have we just installed?

- **`koa`** - this is of course our server!
- **`koa-bodyparser`** - this will handle our JSON data and file types.
- **`@koa/cors`** - this will allow our server port to interact our other ports.
- **`koa-router`** - enables us to have multiple routes.

Your **`package.json`** file should now look something like this:

```json
{
  "name": "koa_tutorial",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@koa/cors": "^3.3.0",
    "koa": "^2.13.4",
    "koa-bodyparser": "^4.3.0",
    "koa-router": "^11.0.1"
  }
}
```

Now we're ready to start creating your project!

## Adding an index file

Firstly, we'll be creating our **`index.js`** file, run the following command in your terminal:

```bash
touch index.js
```

Now add the following to our **`index.js`** file:

```javascript
const Koa = require("koa");
const parser = require("koa-bodyparser");
const cors = require("@koa/cors");
const App = new Koa();
const port = 8000;

App.use(parser())
  .use(cors())
  .listen(port, () => {
    console.log(`🚀 Server listening http://127.0.0.1:${port}/ 🚀`);
  });
```

Let's break this down what we've done:

1. We've imported our Koa server, parser and cors headers on the first three lines.
2. We created a new server by calling **`new Koa()`** and named the server **`App`**
3. We have declared the port we want our server to be run on (in our case port **`8000`**).
4. We enabled our parser and cors by calling them in the **`use`** function of **`Koa`**.
5. We've called **`listen`** from our **`App`** to signal when our port is running. In this case it will **`console log`** on the terminal when we run our server.

Now let's run our app to make sure everything is working.

Run this command in our terminal:

```bash
node index.js
```

If everything has gone according to plan, we should see the following on our terminal:

```bash
🚀 Server listening http://127.0.0.1:8000/ 🚀
```

To kill the server press _`Control + C`_.

## Adding an router.js file

Now it's time to make our **`Router`**. Run this command to make our **`router.js`** file:

```bash
touch router.js
```

Next, add the following code to our **`router.js`** file:

```javascript
const Router = require("koa-router");
const router = new Router();

router.get("/events_list", (ctx) => (ctx.body = "Events List!"));
router.post("/add_event", (ctx) => (ctx.body = "Event Posted!"));

module.exports = router;
```

What we've done is:

1. Created our Router in the first 2 lines.
2. Add two routes, **`events_list`** and **`add_event`**.

### Differences between Express Js and Koa Js:

Unlike **`Express`**, you won't need to declare a **`req` (request)** and **`res` (response)**. **Koa** takes them both in one go as **`ctx` (context)**.

So instead of using **`res.send('Events List!')`** to return a response, we declare the body being returned to the user with **`ctx.body`**.

### Update our index.js file

Now let's go back to our **`index.js`** file and import our **`router`**.

Update our **`index.js`** file with the following code:

```javascript
const Koa = require("koa");
const parser = require("koa-bodyparser");
const cors = require("@koa/cors");
const router = require("./router");
const App = new Koa();
const port = 8000;

App.use(parser())
  .use(cors())
  .use(router.routes())
  .listen(port, () => {
    console.log(`🚀 Server listening http://127.0.0.1:${port}/ 🚀`);
  });
```

Now we have two routes:

1. A **`GET`** request to [**`http://127.0.0.1:8000/events_list`**](http://127.0.0.1:8000/events_list) should return this response:

```
Events List!
```

2. A **`POST`** request to [**`http://127.0.0.1:8000/add_event`**](http://127.0.0.1:8000/add_event) should return this response:

```
Event Posted!
```

## Adding our controllers

Controllers are the way we prevent our **`router.js`** file from getting cluttered.

Lets start by creating our **`controllers`** directory and our first controller:

```
mkdir controllers
touch controllers/events.controllers.js
```

We'll call our first controller **`events.controllers.js`**.

Add the following code into our **`events.controllers.js`** file:

```javascript
const events_db = [];

const getEvents = (ctx) => {
  ctx.body = events_db;
  ctx.status = 200;
};

const addEvent = (ctx) => {
  events_db.push(ctx.request.body);
  ctx.body = "Event Created!";
  ctx.status = 201;
};

module.exports = {
  getEvents,
  addEvent
};
```

### What did we just do?

For now we're using an empty array named **`events_db`** to store our data.

- The **`GET`** request will return anything currently stored in the array.
- The **`POST`** request will push data into this array.

## Update our router

Now let's update our **`router.js`** file:

```javascript
const Router = require("koa-router");
const router = new Router();
const { getEvents, addEvent } = require("./controllers/events.controllers");

router.get("/events_list", getEvents);
router.post("/add_event", addEvent);

module.exports = router;
```

## Making our requests

Let's try and make a **`POST`** request to [**`http://127.0.0.1:8000/add_event`**](http://127.0.0.1:8000/add_event) with the following data:

```json
{
  "name": "test event",
  "adultsOnly": false,
  "attendees": 100,
  "description": "test description"
}
```

A successful **`POST`** request should return this response:

```
'Event Created!'
```

Finally a **`GET`** request to [**`http://127.0.0.1:8000/events_list`**](http://127.0.0.1:8000/events_list) should return the response:

```json
[
  {
    "name": "test event",
    "adultsOnly": false,
    "attendees": 100,
    "description": "test description"
  }
]
```

If you restart your server, this data should be gone as we are only temporarily storing it in an array.

And that's all she wrote! Thanks for reading!
