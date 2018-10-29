var Resource = require('resourcejs');
module.exports = function(app, route) {

  // Setup the controller for REST;
  Resource(app, '', route, app.models.login).rest();

  Resource(app, '', route, app.models.login).virtual({
    path: 'total-count',
    before: function(req, res, next) {
      req.modelQuery = app.models.login.count();
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
