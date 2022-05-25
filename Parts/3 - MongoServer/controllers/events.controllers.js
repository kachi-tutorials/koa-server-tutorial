const Events = require('../models/events.models');

const getEvents = async ctx => {
    try {
        const results = await Events.find()
        ctx.body = results
        ctx.status = 200
    } catch (err) {
        console.log(err)
    }
}

const postEvent = async ctx => {
    try {
        await Events.create(ctx.request.body);
        ctx.body = 'Event Created!'
        ctx.status = 201;
    } catch (e) {
        ctx.status = 500;
    }
};

module.exports = {
    getEvents,
    postEvent
}