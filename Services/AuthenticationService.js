/**
 * Created by greenj on 8/13/16.
 */

module.exports = function(User){
    return {
        Authenticate: function(userid, password, done) {
            User.findOne({ email: userid }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                user.comparePassword(password, function(err,isMatch)
                    {
                        if(err ){
                            return done(err);
                        }
                        else if(!isMatch){
                            return done(null, false);
                        }
                        user.password = null;
                        return done(null, user);
                    });
            });
        },
        IsAuthenticated: function(req, res, next){
            if(!req.isAuthenticated()){
                return res.status(401).send({"error": "Not Authenticated"});
            }
            return next();
        }
    }
}