import React from 'react'

const DesignerContext = React.createContext({
  designerData: null,
  designerDispatcher: () => null,
})

const useCalculatedFieldsContext = () => {
  const { designerData, designerDispatcher } = React.useContext(DesignerContext)

  return {
    ContextProvider: DesignerContext.Provider,
    designerData,
    designerDispatcher,
  }
}

export default useCalculatedFieldsContext
