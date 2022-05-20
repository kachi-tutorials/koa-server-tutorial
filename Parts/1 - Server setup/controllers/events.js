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
        ctx.body = 'Event Created!'
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