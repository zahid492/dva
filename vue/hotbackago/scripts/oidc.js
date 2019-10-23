Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

var mgr = new Oidc.UserManager(oidcConfig);

mgr.events.addUserLoaded(function (user) {
    console.log("user loaded", user);
    mgr.getUser().then(function () {
        console.log("getUser loaded user after userLoaded event fired");
    });
});

mgr.events.addAccessTokenExpiring(function () {
    console.log("token expiring");
    log("token expiring");
    siginSilent();

});

mgr.events.addAccessTokenExpired(function () {
    console.log("token expired");
    log("token expired");
    startSignoutMainWindow();
});

function log(args) {
    console.log(args)
}

function clearState() {
    mgr.clearStaleState().then(function () {
        log("clearStateState success");
    }).catch(function (e) {
        log("clearStateState error", e.message);
    });
}

function getUser() {
    mgr.getUser().then(function (user) {
        log("got user: "+ user.expired);
        if (!user || user.expired) {
            removeUser();

            if (oidcConfig.silent_redirect_uri) {
                siginSilent();
            } else {
                startSigninMainWindow();
            }
        }

    }).catch(function (err) {
        log(err);
    });
}

function removeUser() {
    mgr.removeUser().then(function () {
        log("user removed");
        store.remove("oidc_user");
    }).catch(function (err) {
        log(err);
    });
}

function startSigninMainWindow() {
    mgr.signinRedirect().then(function () {
        log("signinRedirect done");
    }).catch(function (err) {
        log(err);
    });
}

function endSigninMainWindow() {
    mgr.signinRedirectCallback().then(function (user) {
        log("signed in", user);
        store.set("oidc_user", user);
        location.href = "/"
    }).catch(function (err) {
        log(err);
    });
}

function siginSilent() {
    mgr.signinSilent().then(function (user) {
        log("signed in", user);
    }).catch(function (err) {
        log(err);
    });
}

function startSignoutMainWindow() {
    mgr.signoutRedirect().then(function (resp) {
        log("signed out", resp);
    }).catch(function (err) {
        log(err);
    });
}

function endSignoutMainWindow() {
    mgr.signoutRedirectCallback().then(function (resp) {
        log("signed out", resp);
        location.href="./";
    }).catch(function (err) {
        log(err);
    });
}

function siginSilentCallback() {
    mgr.signinSilentCallback();
}