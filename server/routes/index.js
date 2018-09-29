/* GET home page. */

module.exports = function (req, res, next) {

    var sess = req.session;
    if (sess.views) {
        console.log(sess.views);
        sess.views++
    } else {
        sess.views = 1;
    }
    // res.render('index', {title: "Home Page", csrfToken: req.csrfToken()});
    res.render('index', {title: "Home Page", csrfToken: sess.views});
};
