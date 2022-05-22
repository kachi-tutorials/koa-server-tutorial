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