import React from 'react'

const ActionContext = React.createContext({
  setActionFields: () => {},
})

const useActionsFields = () => {
  const { setActionFields } = React.useContext(ActionContext)
  const { Provider } = ActionContext

  return { setActionFields, Provider }
}

export default useActionsFields
