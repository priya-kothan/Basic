import React from 'react'
import { Add, ArrowDownward, Delete } from '@material-ui/icons'
import componentLookup from '../../../utils/componentLookup'
import useAppContext from '../../components/hooks/useToast'
import useActionFields from '../../components/hooks/useActionsFields'
import './Home.css'

const actionFields = [
  {
    actionComponent: componentLookup.ActionButton,
    componentProps: {
      Icon: Add,
      Label: 'New Entity',
      CSSName: '',
      onClick: () => {},
    },
  },
  {
    actionComponent: componentLookup.ActionButton,
    componentProps: {
      Icon: ArrowDownward,
      Label: 'Export Data',
      onClick: () => {},
    },
  },
  {
    actionComponent: componentLookup.ActionButton,
    componentProps: {
      Icon: Delete,
      Label: 'Delete',
      onClick: () => {},
    },
  },
]

const Home = () => {
  const { showToastMessage } = useAppContext()
  const { setActionFields } = useActionFields()

  setActionFields({ actionFields })

  function handleClick() {
    showToastMessage('Saved sucessfully.', 'success')
  }
  function handleClick1() {
    showToastMessage('sorry something went wrong ', 'error')
  }

  return (
    <div className="home">
      <button type="button" onClick={handleClick}>
        Click success
      </button>
      <br />
      <button type="button" onClick={handleClick1}>
        Click error
      </button>
    </div>
  )
}

export default Home
