import React from 'react'
import { useHistory } from 'react-router-dom'
import { KeyboardBackspace as KeyboardBackspaceIcon } from '@material-ui/icons'

import SearchBox from '../../base/SearchBox/SearchBox'
import ActionButton from '../../base/ActionButton/ActionButton'
import './ActionBar.css'

const ActionBar = (props, ref) => {
  const initialState = {
    actionFields: null,
    showBackButton: false,
    hideSearchBox: true,
  }
  const [state, setActionFields] = React.useState(initialState)
  const history = useHistory()

  React.useImperativeHandle(ref, () => ({
    setActionFields: (newState) =>
      setActionFields((currentState) => ({ ...currentState, ...newState })),
  }))

  return (
    <div className="actionbar">
      {state && state.showBackButton && (
        <ActionButton
          CSSName="actionbar__back"
          Icon={KeyboardBackspaceIcon}
          Label="Back"
          onClick={() => history && history.goBack()}
        />
      )}
      {state.actionFields &&
        state.actionFields.map((field) => {
          const Component = field.actionComponent.component || ActionButton

          return (
            <Component
              key={field.componentProps?.Label}
              CSSName={field.componentProps?.CSSName}
              Icon={field.componentProps?.Icon}
              Label={field.componentProps?.Label}
              onClick={field.componentProps?.onClick}
              disabled={field.componentProps?.disabled}
              variant="outlined"
              {...field.componentProps}
            />
          )
        })}
      {!state.hideSearchBox && <SearchBox className="actionbar" />}
    </div>
  )
}

export default React.forwardRef(ActionBar)
