const appEnvironment = 'qa' || String(process.env.APP_ENV).toLowerCase()
function getServerConfiguration() {
  if (appEnvironment === 'qa')
    return {
      APIDomain: 'https://freeflowentitymanagerqa.azurewebsites.net',
      CoreService: 'https://freeflowcoreserviceqa.azurewebsites.net',
    }
  if (appEnvironment === 'uat')
    return {
      APIDomain: 'https://freeflowentitymanageruat.azurewebsites.net/',
      CoreService: 'https://freeflowcoreserviceuat.azurewebsites.net/',
    }

  return {
    APIDomain: 'https://freeflowentitymanager.azurewebsites.net/',
    CoreService: 'https://freeflowcoreservice.azurewebsites.net/',
  }
}
const serverConfig = getServerConfiguration()

export default { serverConfig }
