# KOA Tutorial
Koa is a new web framework designed by the team behind Express, which aims to be a smaller, more expressive, and more robust foundation for web applications and APIs. 

We'll be making a koa server from scratch using node js. 

## Installation

In order to follow this tutorial you will need to following:

- You must have [Node](https://nodejs.org/en/download/) installed and ideally at the **LTS** *(long term support)* version.

To check if you have node installed run the following command on your terminal:
```bash
node --version
```
We will be using [**Postman**](https://www.postman.com/) for the http requests, however you can choose your preferred editors and tools.

## Set up
Let's start by making the directory. Navigate to the directory you want to store your project and run the following commands:

```bash
mkdir koa_tutorial
cd koa_tutorial
npm init -y
```
This should create a folder called **koa_tutorial** which contains a **package.json** file with default values. 

Now we have our package.json file, let's install all the dependancies that we will need for this tutorial. Run the following command:
```bash
npm i cors koa koa-bodyparser @koa/cors koa-router nodemon
```
Let's make sense of it.  What have we just installed?
- **Koa** - this is of course our server!
- **Koa Body Parser** - this will handle our JSON data and file types.
- **Koa Cors** - this will allow our server to interact with our local hosts from different ports
- **Koa Router** - in order for us to declare our server routes, we will need to install this package.
- **Nodemon (optional)** - this package will prevent us from restarting our server every time we make a new changes to our code. 

Once your packages have been installed your **package.json** file should look something like this:
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
Before we continue, let's create a **.gitignore** file.
```
touch .gitignore
```
We'll just be adding one line to this file:
```
node_modules
```
This will prevent our node_modules from being pushed to git when we deploy our server later.

Now we're ready to start creating your project!

## Creating our server files
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

1. We've imported our Koa and declared it on line 2.
2. We've then imported our body parser to handle our json content and cors then enable our clients to listen to our server.
2. We then declare the port we want our server to be run on *(in our case port **8000**)*
3. We enable our body and cors by calling them in the ***use*** function of **Koa**.
4. We add a ***listen*** to enable our port. In this case it will return a console log on the terminal when we run our server.

So let's run our app to make sure. Let's just run this command in our terminal:
```bash
nodemon index.js
```
Nodemon will detect our index.js file and start our server. If everything is working, we should see the following on our terminal:

```bash
[nodemon] starting `node index.js`
🚀 Server listening http://127.0.0.1:8000/ 🚀
```

# Adding a Router

Okay let's start making our routes. 

Run this command to make our **router.js** file:

```bash
touch router.js
```

Then inside our **router.js** file, let's add the following code:
```
const Router = require('koa-router')
const router = new Router()

router.get('/events_list', ctx => ctx.body ='Events List!')
router.post('/post_event', ctx => ctx.body ='Event Posted!')

module.exports = router

```

Now let's go back to our main index.js file and add our router.

```
const Koa = require('koa');
const App = new Koa();
const parser = require('koa-bodyparser')
const cors = require('@koa/cors')
const router = require('./router')
const port = 8000;

App.use(parser())
    .use(cors())
    .use(router.routes())

App.listen(port, () => {
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

# Adding Controllers
Lets start by creating our **controllers** directory and our first controller: 
```
mkdir controllers
touch controllers/events.controllers.js
```
We'll call our first controller **events.js**. For now we'll be using a simple 
```
const events_db = []

const getEvents = ctx => {
    try {
        ctx.body = events_db;
        ctx.status = 200;
    } catch (err) {
        ctx.body = err;
        ctx.status = 500;
    }
}

const postEvent = ctx => {
    try {
        events_db.push(ctx.request.body);
        ctx.status = 201;
    } catch (err) {
        ctx.status = 500;
        throw (err)
    }
};

module.exports = {
    getEvents,
    postEvent
}
```

Now let's edit our routes to use our controllers.

```
const Router = require('koa-router')
const router = new Router()
const { getEvents, postEvent } = require('./controllers/events.controllers')

router.get('/events_list', getEvents)
router.post('/post_event', postEvent)

module.exports = router
```

Now let's make a request.

A post request to [**http://127.0.0.1:8000/post_event**](http://127.0.0.1:8000/post_event) should return this response:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rptygpqrtvz31qayy5gd.png)

```
'Event Created!'
```
A GET request to [**http://127.0.0.1:8000/events_list**](http://127.0.0.1:8000/events_list) should return the response:

```
[
    {
        "name": "Social Event",
        "adultsOnly": false,
        "attendees": 100,
        "description": "social event description"
    }
]
```