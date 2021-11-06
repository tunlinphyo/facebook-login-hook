# facebook-login-hook

> Facebook login with hook

[![NPM](https://img.shields.io/npm/v/facebook-login-hook.svg)](https://www.npmjs.com/package/facebook-login-hook) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save facebook-login-hook
```

## Usage

```jsx
import React, { useState } from 'react'

import useFacebookLogin from 'facebook-login-hook'

export default function Component ({ onSuccess, onError, onSignout }) {
  const [ loggedin, setLoggedin ] = useState(false)

  const { signIn, signOut, loaded } = useFacebookLogin({
    appId: FACEBOOK_APP_ID,
    version: FACEBOOK_APP_VERSION,
    onSuccess: handleSuccess,
    onFailure: handleFailure,
  })

  async function handleSuccess(response) {
    setLoggedin(true)
    const user = await getUserData(response)
    onSuccess(user)
  }
  function handleFailure(error) {
    onError(error)
  }
  async function handleSignout() {
    const result = await signOut()
    onSignout(result)
  }

  function getUserData(response) {
    return new Promise(resolve => {
      FB.api('/me', (response) => {
        resolve(response)
      })
    })
  }
  return (
    {
      loggedin ? (
        <button disabled={!loaded} onClick={signIn}>
          login with facebook
        </button>
      ) : (
        <button disabled={!loaded} onClick={handleSignout}>
          logout from facebook
        </button>
      )
    }
  )
}
```

## License

MIT © [Tun Lin Phyo](https://github.com/tunlinphyo)
