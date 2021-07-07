import React from 'react'
import ReactDOM from 'react-dom'
import authentication from '@kdpw/msal-b2c-react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import apiEndpoints from './models/api/apiEndpoints'
import { getCoreData } from './models/api/api'

// import Auth from './App/Auth'
import App from './App/App'

// We are using below line to pull web.config file into dist folder.
const webpack = require('./assets/static/web.config')

const appEnvironment = String(process.env.APP_ENV).toLowerCase()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const renderReactDOM = (b2cDetails) => {
  return b2cDetails
    ? ReactDOM.render(
        <QueryClientProvider client={queryClient}>
          <App urlCapability={b2cDetails} />
          <ReactQueryDevtools position="bottom-right" />
        </QueryClientProvider>,
        document.getElementById('root')
      )
    : ReactDOM.render(
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools position="bottom-right" />
        </QueryClientProvider>,
        document.getElementById('root')
      )
}

// if (appEnvironment === 'local') renderReactDOM()
// else
getCoreData(
  apiEndpoints.GetSysURLCapability.method,
  `${apiEndpoints.GetSysURLCapability.url}(${location.host})?$expand=Organisation`
)
  .then((urlCapability) => {
    let signInPolicy = null

    // if (!urlCapability.data.length) alert('B2C is not configured')

    const b2cDetails = urlCapability.data[0]

    // if (!b2cDetails.SignInRequired) {
    //   signInPolicy = null
    // } else
    if (b2cDetails.PublicAccessEnabled) {
      if (b2cDetails.PublicSignUpEnabled && b2cDetails.SignInRequired)
        signInPolicy = b2cDetails.CitizenSignInSignUpPolicy
      else if (!b2cDetails.PublicSignUpEnabled && b2cDetails.SignInRequired)
        signInPolicy = b2cDetails.CitizenSignInPolicy
    } else if (
      !b2cDetails.PublicAccessEnabled &&
      !b2cDetails.PublicSignUpEnabled &&
      b2cDetails.SignInRequired
    )
      signInPolicy = b2cDetails.BackofficeSignInPolicy

    if (!b2cDetails.SignInRequired) renderReactDOM(b2cDetails)
    else if (signInPolicy) {
      authentication.initialize({
        instance: b2cDetails.Instance,
        tenant: b2cDetails.Tenant,
        signInPolicy,
        resetPolicy: b2cDetails.ResetPolicy,
        applicationId: b2cDetails.ApplicationId,
        cacheLocation: b2cDetails.CacheLocation,
        scopes: [b2cDetails.Scopes],
        redirectUri: b2cDetails.RedirectURL,
        postLogoutRedirectUri: b2cDetails.PostLogoutURL,
        validateAuthority: false,
        silentLoginOnly: false,
      })

      authentication.run(() => {
        renderReactDOM(b2cDetails)
      })
    } else renderReactDOM()
  })
  .catch(() => {
    renderReactDOM()
  })
