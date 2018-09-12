var Resource = require('resourcejs');
module.exports = function(app, route) {

  // Setup the controller for REST;
  Resource(app, '', route, app.models.receipt).rest(/*{
    before: function(req, res, next) {
      req.query.limit = 999999;
      next();
    }
  }*/);

  Resource(app, '', route, app.models.receipt).virtual({
    path: 'max-payment',
    before: function(req, res, next) {
      req.modelQuery = app.models.receipt.aggregate().group({
        _id: null,
        maxPayment: {
          $max: '$payment'
        }
      });
      next();
    }
  }).virtual({
    path: 'total-count',
    before: function(req, res, next) {
      req.modelQuery = app.models.receipt.count();
      next();
    },
    after: function(req, res, next) {
      var count = res.resource.item;
      res.resource.item = [
        {
          _id: null,
          total: count
        }
      ];
      next();
    }
  });

  // Return middleware.
  return function(req, res, next) {
    next();
  };
};
