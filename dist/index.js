var react = require('react');

function loadScript(d, s, id, jsSrc, cb, onError) {
  var element = d.getElementsByTagName(s)[0];
  var fjs = element;
  var js = element;
  js = d.createElement(s);
  js.id = id;
  js.src = jsSrc;

  if (fjs && fjs.parentNode) {
    fjs.parentNode.insertBefore(js, fjs);
  } else {
    d.head.appendChild(js);
  }

  js.onerror = onError;
  js.onload = cb;
}
function removeScript(d, id) {
  var element = d.getElementById(id);

  if (element) {
    element.parentNode.removeChild(element);
  }
}

function useFacebookLogin(_ref) {
  var appId = _ref.appId,
      _ref$version = _ref.version,
      version = _ref$version === void 0 ? 'v10.0' : _ref$version,
      _ref$jsSrc = _ref.jsSrc,
      jsSrc = _ref$jsSrc === void 0 ? 'https://connect.facebook.net/en_US/sdk.js' : _ref$jsSrc,
      _ref$onSuccess = _ref.onSuccess,
      onSuccess = _ref$onSuccess === void 0 ? function () {} : _ref$onSuccess,
      _ref$onFailure = _ref.onFailure,
      onFailure = _ref$onFailure === void 0 ? function () {} : _ref$onFailure;

  var _useState = react.useState(false),
      loaded = _useState[0],
      setLoaded = _useState[1];

  react.useEffect(function () {
    if (!appId) return onFailure({
      error: 'Facebook App ID required.'
    });
    loadScript(document, 'script', 'facebook-login', jsSrc, function () {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: appId,
          autoLogAppEvents: true,
          xfbml: true,
          version: version
        });
      };

      setLoaded(true);
    }, function () {
      setLoaded(true);
      onFailure({
        error: 'Facebook API coult not load.'
      });
    });
    return function () {
      removeScript(document, 'facebook-login');
    };
  }, []);

  function signIn() {
    if (!window.FB) return onFailure({
      error: 'Facebook API coult not load.'
    });
    window.FB.getLoginStatus(function (response) {
      statusChangeCallback(response);
    });
  }

  function statusChangeCallback(response) {
    if (response.authResponse) {
      onSuccess(response);
    } else {
      window.FB.login(function (response) {
        if (response.authResponse) {
          onSuccess(response);
        } else {
          onFailure({
            error: 'User cancelled login or did not fully authorize.'
          });
        }
      });
    }
  }

  function signOut() {
    return new Promise(function (resolve) {
      window.FB.logout(function (response) {
        resolve(response);
      });
    });
  }

  return {
    loaded: loaded,
    signIn: signIn,
    signOut: signOut
  };
}

module.exports = useFacebookLogin;
//# sourceMappingURL=index.js.map
