module.exports = function(app) {
    var api = '/api';


    app.get(api + '/customer/:id', getCustomer);
    app.get(api + '/customers', getCustomers);


};
function getCustomer(req, res, next) {

    res.send("Hey dude you requesting me ?? " + req.params.id);
}

function getCustomers(req, res, next) {

    res.send('You requesting all of me!!!');
}
