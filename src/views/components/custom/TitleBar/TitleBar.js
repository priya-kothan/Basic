/*eslint-disable */
import React, {
  Fragment,
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
} from 'react'
import {
  ExitToApp as ExitToAppIcon,
  RotateLeft as ResetPassword,
  Search as Search,
  Add as AddIcon,
  Settings as SettingsIcon,
  FilterDrama as FilterDramaIcon,
  Flag as FlagIcon,
} from '@material-ui/icons'
import authentication from '@kdpw/msal-b2c-react'
import { useConfirm } from 'material-ui-confirm'
import FFAvatar from '../../base/FFAvatar/FFAvatar'
import useToast from '../../hooks/useToast'
import useAppContext from '../../hooks/useToast'
import { useHistory } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import './TitleBar.css'

const TitleBar = (props, ref = {}) => {
  const [title, setTitle] = useState('')

  const token = authentication?.getIdToken()
  let { urlCapabilityData } = useToast()
  const history = useHistory()
  const [searchValue, setSearchValue] = useState('')
  const confirmalert = useConfirm()
  const { showToastMessage } = useAppContext()

  function onLogoutClickHandler() {
    confirmalert({
      description: 'Are you sure you want to Logout?',
    })
      .then(() => {
        authentication.signOut()
        showToastMessage('You have logout successfully', 'success')
      })
      .catch((err) => {})
      .finally(() => {})
  }
  function onResetClickHandler() {
    if (confirm('Are you sure you want to Reset Password?')) {
      //var oldUrl = window.location.href
      //var newUrl = oldUrl.replace('B2C_1_SignInSignUpDev', 'B2C_1_ResetDev')
      // var newUrl =
      //   'https://ffb2cdev.b2clogin.com/ffb2cdev.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ResetDev&client_id=7f0ba9ba-209b-4839-9cd4-2de809fba1e4&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fffreactdev.z33.web.core.windows.net%2F&scope=openid&response_type=id_token&prompt=login'
      // var newUrl =
      //   'https://ffazureb2cqa.b2clogin.com/ffazureb2cqa.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ResetQA&client_id=1ead7d21-8ac9-4497-9625-03f1c99f7fc9&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fffreactqa.z33.web.core.windows.net%2F&scope=openid&response_type=id_token&prompt=login'
      // var newUrl =
      //   'https://ffb2cuat.b2clogin.com/ffb2cuat.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ResetUAT&client_id=9adaba00-fc6b-443c-8daa-52457f29003e&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fffreactuat.z33.web.core.windows.net%2F&scope=openid&response_type=id_token&prompt=login'

      // https: window.location.href = newUrl
      https: window.location.href = urlCapabilityData?.ResetPasswordURL || ''
    }
  }

  function GetSearchValue(searchValue) {
    setSearchValue(searchValue)
    history.push({
      pathname: `/search`,
      search: `?searchterm=${searchValue}`,
      state: { searchtTerm: searchValue && searchValue },
    })
  }

  useImperativeHandle(ref, () => ({
    setPageTitle(title) {
      setTitle(title)
    },
  }))

  return (
    <div className="titleBar-root">
      <div className="titleBar-title"></div>
      <div className="titleBar-Search">
        <SearchBar onClick={GetSearchValue} />
      </div>

      <div className="titleBar-icon">
        <div>
          <AddIcon className="titleBar-iconList" />
        </div>
        <div>
          <SettingsIcon className="titleBar-iconList" />
        </div>
        <div>
          <FilterDramaIcon className="titleBar-iconList" />
        </div>
        <div>
          <FlagIcon className="titleBar-iconList" />
        </div>
      </div>
      <div className="titleBarUser-avatar">
        <FFAvatar className="Main-Avatar" altText={token?.name || 'Admin'} />
        <div className="titleBarUser-info">
          <div className="mainDivTitleBar">
            <div>
              <FFAvatar className="L-Avatar" altText={token?.name || 'Admin'} />
            </div>
            <div>
              <div className="subTitleName">{token?.name || 'Admin'}</div>
              {authentication.getIdToken() && (
                <div className="titleBarPage-logout" title="Logout">
                  <ExitToAppIcon onClick={onLogoutClickHandler} />
                  <div onClick={onLogoutClickHandler} className="innerDiv">
                    Logout
                  </div>
                </div>
              )}
              {authentication.getIdToken() && (
                <div className="titleBarPage-logout" title="Reset Password">
                  <ResetPassword onClick={onResetClickHandler} />{' '}
                  <div onClick={onResetClickHandler} className="innerDiv">
                    Reset Password
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* {authentication.getIdToken() && (
            <span className="titleBarPage-logout" title="Logout">
              <ExitToAppIcon onClick={onLogoutClickHandler} />
            </span>
          )}
          <br />
          {authentication.getIdToken() && (
            <span className="titleBarPage-logout" title="Reset Password">
              <ResetPassword onClick={onResetClickHandler} />
            </span>
          )} */}
        </div>
      </div>
      {/* {authentication.getIdToken() && (
        <span className="titleBarPage-logout" altText="Logout">
          <ExitToAppIcon onClick={onLogoutClickHandler} />
        </span>
      )}
      {authentication.getIdToken() && (
        <span className="titleBarPage-logout" altText="Reset Password">
          <ResetPassword onClick={onResetClickHandler} />
        </span>
      )} */}
    </div>
  )
}

export default forwardRef(TitleBar)
