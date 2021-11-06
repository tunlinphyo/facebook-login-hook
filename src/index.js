import { useEffect, useState } from 'react'
import { loadScript, removeScript } from './util'

export default function useFacebookLogin({
  appId,
  version = 'v10.0',
  jsSrc = 'https://connect.facebook.net/en_US/sdk.js',
  onSuccess = () => {},
  onFailure = () => {}
}) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!appId) return onFailure({ error: 'Facebook App ID required.' })
    loadScript(
      document,
      'script',
      'facebook-login',
      jsSrc,
      () => {
        window.fbAsyncInit = function () {
          window.FB.init({
            appId,
            autoLogAppEvents: true,
            xfbml: true,
            version
          })
        }
        setLoaded(true)
      },
      () => {
        setLoaded(true)
        onFailure({ error: 'Facebook API coult not load.' })
      }
    )

    return () => {
      removeScript(document, 'facebook-login')
    }
  }, [])

  function signIn() {
    if (!window.FB) return onFailure({ error: 'Facebook API coult not load.' })
    window.FB.getLoginStatus(function (response) {
      statusChangeCallback(response)
    })
  }
  function statusChangeCallback(response) {
    if (response.authResponse) {
      onSuccess(response)
    } else {
      window.FB.login(function (response) {
        if (response.authResponse) {
          onSuccess(response)
        } else {
          onFailure({ error: 'User cancelled login or did not fully authorize.' })
        }
      })
    }
  }
  function signOut() {
    return new Promise((resolve) => {
      window.FB.logout(function (response) {
        resolve(response)
      })
    })
  }

  return { loaded, signIn, signOut }
}
