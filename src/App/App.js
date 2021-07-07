import React, { Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ConfirmProvider } from 'material-ui-confirm'
import authentication from '@kdpw/msal-b2c-react'
import { useQueries } from 'react-query'
import _ from 'lodash'
import ErrorBoundary from '../views/components/custom/ErrorBoundary/ErrorBoundary'
import Routes from '../views/Routes/Routes'
import useAppContext from '../views/components/hooks/useToast'
import useActionFields from '../views/components/hooks/useActionsFields'
import apiEndpoints from '../models/api/apiEndpoints'
import { getCoreData } from '../models/api/api'
import FFToast from '../views/components/base/FFToast/FFToast'
import FFBackdrop from '../views/components/base/FFBackdrop/FFBackdrop'
import ActionBar from '../views/components/custom/ActionBar/ActionBar'
import FFSpinner from '../views/components/base/FFSpinner/FFSpinner'
import FFPageHeader from '../views/components/base/FFPageHeader/FFPageHeader'
import usePageTitle from '../views/components/hooks/usePageTitle'
import getOrganisation from './organisation.json'
import MenuLayout from '../views/components/custom/Drawer/MenuLayout'
import TitleBar from '../views/components/custom/TitleBar/TitleBar'
import './App.css'

const App = ({ urlCapability }) => {
  const toastRef = React.useRef()
  const navMenuRef = React.useRef()
  const actionRef = React.useRef()
  const loadingRef = React.useRef()
  const pagetitleRef = React.useRef()

  const { Provider: AppContext } = useAppContext()
  const { Provider: ActionFieldsProvider } = useActionFields()
  const { Provider: PageTitleProvider } = usePageTitle()
  const token = authentication?.getIdToken()
  const [userId, setUserId] = React.useState('')
  const [IsLoading, setIsLoading] = React.useState(null)

  const organisation = urlCapability?.Organisation
    ? urlCapability.Organisation[0].Name?.trim()
    : 'NorthHerts'

  const organisationId = urlCapability?.Organisation[0]?.id
  const BrandingId = urlCapability?.Branding

  const bodyStyles = document.body.style

  function showToastMessage(message, status) {
    toastRef.current.setToastMessage(message, status)
  }

  function showLoading(state) {
    loadingRef.current.showLoading(state)
  }

  function setActionFields(actions) {
    actionRef.current.setActionFields(actions)
  }

  function setPageTitle(title) {
    pagetitleRef.current.setPageTitle(title)
  }

  function getEnvHost(hostUrl) {
    if (!hostUrl) return ''

    const url = new URL(hostUrl)
    const arrHostName = url.hostname.split('.')
    return arrHostName.length >= 0 ? `${arrHostName[0]}.onmicrosoft.com` : ''
  }

  const getNavgroup = (navgroupId, navItemId) => {
    navMenuRef.current.getNavgroup(navgroupId, navItemId)
  }

  React.useEffect(() => {
    import(
      `../assets/styles/${organisation?.toLowerCase() || 'northherts'}.css`
    )
    import(`../assets/styles/MenuItems.css`)
  }, [])
  useQueries([
    {
      queryKey: ['appPage', 'UserID'],
      queryFn: () =>
        getCoreData(
          'get',
          `${apiEndpoints.User.url}?$filter=B2CObjectId eq ${token.oid}`
        ).then((response) => response.data[0]?.id || ''),
      onSuccess: (data) => {
        setUserId(data)
      },
      enabled: !!token,
    },
    {
      queryKey: ['appPage', 'UpdateUser'],
      queryFn: () =>
        getCoreData(
          apiEndpoints.UpdateUser.method,
          apiEndpoints.UpdateUser.url,
          {
            EmailId: token.emails[0],
            Issuer: token.idp ? token.idp : getEnvHost(token.iss),
            ObjectId: token.oid,
          }
        ).then((response) => response.data),
      enabled: !!token,
    },
    {
      queryKey: ['appPage', 'menuItemsBranding'],
      queryFn: () =>
        getCoreData(
          apiEndpoints.Branding.method,
          BrandingId
            ? `${apiEndpoints.Branding.url}(${BrandingId})`
            : `${apiEndpoints.Branding.url}?$filter=Organisation eq '' and IsDefault eq true`
        )
          .then((response) => {
            setIsLoading(true)
            const result = response?.data[0]
            if (!_.isEmpty(result)) {
              bodyStyles.setProperty('--navbar-color', result?.NavBarColour)
              bodyStyles.setProperty(
                '--navbar-selected-color',
                result?.NavBarSelectColour
              )
              bodyStyles.setProperty('--navbar-text-color', result?.NavBarText)
              bodyStyles.setProperty(
                '--navbar-Icon-color',
                result?.NavBarIconColour
              )
              bodyStyles.setProperty('--accent-color', result?.AccentColour)
              bodyStyles.setProperty(
                '--titlebarIcon-color',
                result?.TitleBarIconColour
              )
              bodyStyles.setProperty('--titlebar-color', result?.TitleBarColour)
              bodyStyles.setProperty(
                '--ListHeaderText-Colour',
                result?.ListHeaderTextColour
              )
              bodyStyles.setProperty(
                '--RowBorder-Colour',
                result?.RowBorderColour
              )
              bodyStyles.setProperty(
                '--RelatedEntityLink-Colour',
                result?.RelatedEntityLinkColour
              )
              bodyStyles.setProperty(
                '--ListHighlight-colour',
                result?.ListHighlightColour
              )
              bodyStyles.setProperty(
                '--ListSelected-colour',
                result?.ListSelectedColour
              )
              bodyStyles.setProperty('--button-color', result?.ButtonColour)
              bodyStyles.setProperty(
                '--controlborder-colour',
                result?.ControlBorderColour
                  ? result?.ControlBorderColour
                  : '#000000'
              )
              bodyStyles.setProperty(
                '--controltext-colour',
                result?.ControlTextColour
                  ? result?.ControlTextColour
                  : '#000000'
              )
              bodyStyles.setProperty(
                '--controllabel-colour',
                result?.ControlLabelColour
                  ? result?.ControlLabelColour
                  : '#000000'
              )
              bodyStyles.setProperty(
                '--title-Bar-Name',
                `'${result?.Title}'` || ''
              )
            } else {
              bodyStyles.setProperty('--navbar-color', '#4c54bd')
              bodyStyles.setProperty('--navbar-selected-color', '#f9f9f9')
              bodyStyles.setProperty('--navbar-text-color', '#c7c7c7')
              bodyStyles.setProperty('--navbar-Icon-color', 'red')
              bodyStyles.setProperty('--accent-color', '#0b2265')
              bodyStyles.setProperty('--titlebarIcon-color', '#f9f9f9')
              bodyStyles.setProperty('--titlebar-color', '#4c54bd')
              bodyStyles.setProperty('--button-color', '#4c54bd')
              bodyStyles.setProperty('--controlborder-colour', '#000000')
              bodyStyles.setProperty('--controltext-colour', '#000000')
              bodyStyles.setProperty('--controllabel-colour', '#000000')
              bodyStyles.setProperty('--title-Bar-Name', '')
              bodyStyles.setProperty('--ListHighlight-colour', '#ECF0F1')
              bodyStyles.setProperty('--ListSelected--colour', '#52c1e5')
              bodyStyles.setProperty('--RelatedEntityLink-Colour', '#4c54bd')
            }
          })
          .catch(() => {
            setIsLoading(true)
          }),
    },
  ])
  return (
    <ErrorBoundary>
      {IsLoading ? (
        <div className="app-root">
          <Router>
            <AppContext
              value={{
                showToastMessage,
                showLoading,
                organisation,
                urlCapabilityData: urlCapability,
                organisationId: getOrganisation,
                userId,
                getNavgroup,
              }}
            >
              <ConfirmProvider>
                <div className="app-content">
                  <Suspense fallback={<FFSpinner />}>
                    <ActionFieldsProvider value={{ setActionFields }}>
                      <PageTitleProvider value={{ setPageTitle }}>
                        <TitleBar />
                        <FFToast ref={toastRef} />
                        <MenuLayout ref={navMenuRef} />
                        <FFPageHeader ref={pagetitleRef} />
                        <ActionBar ref={actionRef} />
                        <Routes />
                      </PageTitleProvider>
                    </ActionFieldsProvider>
                  </Suspense>
                </div>
              </ConfirmProvider>
            </AppContext>
            <FFBackdrop ref={loadingRef} />
          </Router>
        </div>
      ) : (
        <FFSpinner />
      )}
    </ErrorBoundary>
  )
}

export default App
