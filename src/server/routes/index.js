/**
 * This module controls my rest demo routes
 * @app
 */
module.exports = function(app) {
    let api = '/api';
    let data = '/../../data/';
    let jsonfileservice = require('./utils/jsonfileservice')();

    //default rest requests
    app.get(api + '/customer/:id', getCustomer);
    app.get(api + '/customers', getCustomers);

    //rest api to support query of backend data for products
    app.get(api + '/products',getProducts);
    app.get(api + '/productById/:id',getProduct);

    //post the data
    app.post(api + '/products',setProduct);

    function getCustomer(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'customers.json');
        var customer = json.filter(function(c) {
            return c.id === parseInt(req.params.id);
        });
        res.send(customer[0]);
    }

    function getCustomers(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'customers.json');
        res.send(json);
    }

    /**
     * Get the fake customer data from the Json file
     * @req the request
     * @res the response
     */
    function getProducts(req, res) {
        let json = jsonfileservice.getJsonFromFile(data + 'products.json');
        res.send(json);
    }

    /**
     * Get the filtered fake customer data based on ID
     * @req  the request
     * @res  the response
     */
    function getProduct(req, res) {
        let json = jsonfileservice.getJsonFromFile(data + 'products.json');
        console.log('Hello from get product');
        let product = json.filter(function(c) {
            return c.productId === parseInt(req.params.id);
        });
        res.send(product[0]);
    }

    /**
     * Post the product back to the file
     */
    function setProduct(req, res) {

        let json = jsonfileservice.saveJsonToFile(data + 'products.json', req.body);
        res.send(json);
    }
};
