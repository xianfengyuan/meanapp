var Resource = require('resourcejs');
module.exports = function(app, route) {

  // Setup the controller for REST;
  Resource(app, '', route, app.models.receipt).rest();

  Resource(app, '', route, app.models.receipt).virtual({
    path: 'max-payment',
    before: function(req, res, next) {
      req.modelQuery = app.models.receipt.aggregate().group({
        _id: null,
        maxPayment: {
          $max: '$payment'
        }
      });
      return next();
    }
  }).virtual({
    path: 'total-count',
    before: function(req, res, next) {
      req.modelQuery = app.models.receipt.count();
      return next();
    }
  });

  // Return middleware.
  return function(req, res, next) {
    next();
  };
};
