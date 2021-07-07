const appEnvironment = String(process.env.APP_ENV).toLowerCase()

const b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1_SignInSignUpDev',
    forgotPassword: 'B2C_1_ResetDev',
  },
  authorities: {
    signUpSignIn: {
      authority:
        'https://ffb2cdev.b2clogin.com/ffb2cdev.onmicrosoft.com/B2C_1_SignInSignUpDev',
    },
    forgotPassword: {
      authority:
        'https://ffb2cdev.b2clogin.com/ffb2cdev.onmicrosoft.com/B2C_1_ResetDev',
    },
  },
  authorityDomain: 'https://ffb2cdev.b2clogin.com',
}

function getMSALConfigs() {
  if (appEnvironment === 'qa')
    return {
      auth: {
        clientId: '1ead7d21-8ac9-4497-9625-03f1c99f7fc9',
        authority:
          'https://ffazureb2cqa.b2clogin.com/ffazureb2cqa.onmicrosoft.com/B2C_1_SignInSignUpQA',
        knownAuthorities: ['https://ffazureb2cqa.b2clogin.com/'],
        redirectUri: 'https://ffreactqa.azurewebsites.net/',
        postLogoutRedirectUri: 'https://ffreactqa.azurewebsites.net/',

        // navigateToLoginRequestUrl: true,
      },
      cache: {
        cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
        storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
      },
    }
  if (appEnvironment === 'uat')
    return {
      auth: {
        clientId: '9adaba00-fc6b-443c-8daa-52457f29003e',
        authority:
          'https://ffb2cuat.b2clogin.com/ffb2cuat.onmicrosoft.com/B2C_1_SignInSignUpUAT',
        knownAuthorities: ['https://ffb2cuat.b2clogin.com/'],
        redirectUri: 'https://ffreactuat.z33.web.core.windows.net/',
        postLogoutRedirectUri: 'https://ffreactuat.z33.web.core.windows.net/',
        // navigateToLoginRequestUrl: true,
      },
      cache: {
        cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
        storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
      },
    }

  return {
    auth: {
      clientId: '7f0ba9ba-209b-4839-9cd4-2de809fba1e4',
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      knownAuthorities: [b2cPolicies.authorityDomain],
      redirectUri: 'https://ffreactdev.z33.web.core.windows.net/',
      postLogoutRedirectUri: 'https://ffreactdev.z33.web.core.windows.net/',
      // redirectUri: 'http://localhost:3000/',
      // postLogoutRedirectUri: 'http://localhost:3000/',
      // navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
      storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
    },
  }
}

const msalConfig = getMSALConfigs()

export default { msalConfig, b2cPolicies }
