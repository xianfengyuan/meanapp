var Resource = require('resourcejs');
module.exports = function(app, route) {

  // Setup the controller for REST;
  Resource(app, '', route, app.models.user).rest({
    before: function(req, res, next) {
      req.modelQuery = this.model.where('id', req.params.id__regex);
      next();
    }
  });

  // Return middleware.
  return function(req, res, next) {
    next();
  };
};
