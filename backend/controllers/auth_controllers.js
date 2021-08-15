const passport = require("../passport/index.js")

exports.register = function(req, res, next) {
    passport.authenticate("local-register", function(error, user, info) {
    	if(error) {
        return res.status(500).json({
          message: error,
        });
      }
      req.logIn(user, function(error){
        if(error) {
          return res.status(500).json({
            message: "Fail",
          });
        }
        return res.json(true)
      })
  })(req, res, next);
}

exports.login = function(req, res, next) {
    passport.authenticate("local-login", function(error, user, info) {
        if(error) {
          return res.status(500).json({
            message: error
          });
        }
        req.logIn(user, function(error){
          if(error) {
            return res.status(500).json({
              message: "Fail"
            });
          }
          return res.json(user)
        })
    })(req, res, next);
}

exports.logout = function(req, res, next) {
    req.logout();
    req.session.destroy()
    req.session = null;
}

exports.islog = function(req, res, next) {
    if (req.user) {
        if (req.user.username === req.body.loggedInUser) { 
            return res.json(req.user.username) 
        }
        else { 
            return res.json(false) 
        }
    } else {
      return res.json(false) 
    }
}
