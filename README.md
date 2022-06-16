## KOA Tutorial

KoaJs is a new web framework designed by the team behind Express, which aims to be a smaller, more expressive, and more robust foundation for web applications and APIs.

We'll be making a KoaJs server from scratch using NodeJs.

## Installation

In order to follow this tutorial you will need to following:

- You must have [Node](https://nodejs.org/en/download/) installed. Ideally at the LTS _(long term support)_ version.

Run the following command on your terminal to check if you have node installed:

```bash
node --version
```

In this tutorial I will be using [VS Code](https://code.visualstudio.com/) as the text editor and [Postman](https://www.postman.com/) for the HTTP requests, however you can choose your preferred editors and tools.

## Set up

Let's start by making our directory. Navigate to the directory you want to store your project and run the following command:

```bash
mkdir koa_tutorial
cd koa_tutorial
npm init -y
```

This should create a folder called **koa_tutorial** which contains a **package.json** file with the default values.

Now we have our package.json file, let's install all the dependancies that we will need for this tutorial. Run the following command:

```bash
npm i cors koa koa-bodyparser @koa/cors koa-router nodemon
```

Let's make sense of it. What have we just installed?

- **Koa** - this is of course our server!
- **Koa Body Parser** - this will handle our JSON data and file types.
- **Koa Cors** - this will allow our server to interact with our local hosts from different ports.
- **Koa Router** - enables us to have multiple routes.
- **Nodemon (optional)** - this package will prevent us from restarting our server every time we make a new changes to our code.

Your **package.json** file should now look something like this:

```
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
    "koa-router": "^10.1.1",
    "nodemon": "^2.0.15"
  }
}

```

Now we're ready to start creating your project!

## Index.js File

Lets start by creating our index file.

```
touch index.js
```

Let's add the following to our **index.js** file.

```
const Koa = require('koa');
const App = new Koa();
const parser = require('koa-bodyparser')
const cors = require('@koa/cors')
const port = 8000;

App.use(parser())
    .use(cors())

App.listen(port, () => {
    console.log(`🚀 Server listening http://127.0.0.1:${port}/ 🚀`)
});
```

Let's break this down what we've done:

1. We've imported our Koa server, parser and cors headers on the first three lines.
2. We created a new server by calling **new Koa()** and named the server **_App_**
3. We have declared the port we want our server to be run on (in our case port **8000**).
4. We enabled our parser and cors by calling them in the **_use_** function of **Koa**.
5. We add a **_listen_** to signal to us when our port is running. In this case it will return a console log on the terminal when we run our server.

So let's run our app to make sure. Let's just run this command in our terminal:

```bash
nodemon index.js
```

Nodemon will detect our **index.js** file and start our server. If everything has gone according to plan, we should see the following on our terminal:

```bash
[nodemon] starting `node index.js`
🚀 Server listening http://127.0.0.1:8000/ 🚀
```

## Adding a Router

Okay let's start making our routes. Run this command to make our **router.js** file:

```bash
touch router.js
```

Then inside our **router.js** file, let's add the following code:

```

const Router = require('koa-router')
const router = new Router()

router.get('/events_list', ctx => ctx.body = 'Events List!')
router.post('/post_event', ctx => ctx.body = 'Event Posted!')

module.exports = router
```

What we've done is add two routes, **events_list** and **post_event**.

Unlike Express, you won't need to declare a req (request) and res (response). Koa takes them both in one go as ctx (contenxt).

So instead of using res.send('Events List!') to return a response, we declare the body being returned to the user with **ctx.body**.

Now let's go back to our main index.js file and add our routes to our router.

```
const Koa = require('koa');
const app = new Koa();
const parser = require('koa-bodyparser')
const cors = require('@koa/cors')
const router = require('./router')
const port = 8000;

app.use(parser())
    .use(cors())
    .use(router.routes())

app.listen(port, () => {
    console.log(`🚀 Server listening http://127.0.0.1:${port}/ 🚀`)
});
```

Now we have two routes:

1. A GET request to [**http://127.0.0.1:8000/events_list**](http://127.0.0.1:8000/events_list) should return this response:

```
Events List!
```

2. A post request to [**http://127.0.0.1:8000/post_event**](http://127.0.0.1:8000/post_event) should return this response:

```
Event Posted!
```

## Adding Controllers

Controllers are the way we prevent our router file from getting cluttered.

Lets start by creating our **controllers** directory and our first controller:

```
mkdir controllers
touch controllers/events.js
```

We'll call our first controller **events.js**. Place the following code into our events.js file.

```
const events_db = []

const getEvents = ctx => {
    ctx.body = events_db;
    ctx.status = 200;
}

const postEvent = ctx => {
    events_db.push(ctx.request.body);
    ctx.body = 'Event Created!'
    ctx.status = 201;
};

module.exports = {
    getEvents,
    postEvent
}
```

What did we just do? For now we're using an empty array named **events_db** to store our data.

- The GET request will return anything currently stored in the array.
- The POST request will push data into this array.

Now let's edit our routes to use our controllers.

```
const Router = require('koa-router')
const router = new Router()
const { getEvents, postEvent } = require('./controllers/events')

router.get('/events_list', getEvents)
router.post('/post_event', postEvent)

module.exports = router
```

Now let's make a request. With the following data:

```
    {
        "name": "This event",
        "venue": "Victoria park"
    }
```

A post request to [**http://127.0.0.1:8000/post_event**](http://127.0.0.1:8000/post_event) should return this response:
![postman request](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rptygpqrtvz31qayy5gd.png)

```
'Event Created!'
```

A GET request to [**http://127.0.0.1:8000/events_list**](http://127.0.0.1:8000/events_list) should return the response:

```
[
    {
        "name": "This event",
        "venue": "Victoria park"
    }
]
```

If you restart your server, this data should be gone as we are only temporarily storing it in an array.

## Summary

What we've done is created a Koa server which can store and retrieve data! For now the data is temporary so in part 2, we'll pick up from there and add a SQL database to store the data!
