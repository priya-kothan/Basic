import React, { useState, useEffect, Fragment } from 'react'
import { Add } from '@material-ui/icons'
import { useConfirm } from 'material-ui-confirm'
import FormDesignerGrid from '../../components/custom/FEDesignerControls/FormDesignerGrid'
import useActionFields from '../../components/hooks/useActionsFields'
import componentLookup from '../../../utils/componentLookup'
import APIEndPoints from '../../../models/api/apiEndpoints'
import { getCoreData } from '../../../models/api/api'
import useAppContext from '../../components/hooks/useToast'
import usePageTitle from '../../components/hooks/usePageTitle'
import './FormDesigner.css'

const FormDesigner = ({ history }) => {
  const [searchData, setsearchData] = useState([])
  const { setActionFields } = useActionFields()
  const { showToastMessage, showLoading } = useAppContext()
  const confirmalert = useConfirm()
  const { setPageTitle } = usePageTitle()

  const entityname = history.location.state && history.location.state.entity
  const pageTitle = `FormDesigner - ${entityname}`

  setPageTitle(pageTitle)

  const createFormButtonClick = () => {
    history.push({
      pathname: '/CreateFormDesigner',
      state: {
        entity: entityname,
        mode: 'Add',
        formId: null,
      },
    })
  }

  const actionFields = [
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Icon: Add,
        Label: 'New Form',
        CSSName: '',
        onClick: createFormButtonClick,
      },
    },
  ]
  setActionFields({ actionFields, showBackButton: true })

  useEffect(() => {
    async function fetchdata() {
      showLoading(true)
      const CoreDatalist = getCoreData(
        APIEndPoints.GetSysForm.method,
        `${APIEndPoints.GetSysForm.url}?$Filter=SysEntity eq '${entityname}'`
      )
      const [sysFormData] = await Promise.all([CoreDatalist])
      setsearchData([sysFormData.data])
      showLoading(false)
    }
    fetchdata()
  }, [])

  const onedit = (e) => {
    history.push({
      pathname: '/CreateFormDesigner',
      state: {
        entity: entityname,
        mode: 'Edit',
        formId: e.id,
      },
    })
  }
  async function fetchdata() {
    showLoading(true)
    const CoreDatalist = getCoreData(
      APIEndPoints.GetSysForm.method,
      `${APIEndPoints.GetSysForm.url}?$Filter=SysEntity eq '${entityname}'`
    )
    const [sysFormData] = await Promise.all([CoreDatalist])
    setsearchData([sysFormData.data])
    showLoading(false)
  }

  const deleterecord = async (id) => {
    showLoading(true)
    Promise.all([
      getCoreData('Delete', `${APIEndPoints.GetSysForm.url}(${id})`),
    ])
      .then(() => {
        showToastMessage('Deleted Successfully', 'success')
        fetchdata()
      })
      .catch((err) => {
        showLoading(false)
        const errorMessage = JSON.stringify(err?.response?.data)
        showToastMessage(errorMessage, 'error')
      })
      .finally(() => {
        showLoading(false)
      })
  }
  const onDelete = (e) => {
    confirmalert({
      description: 'Are you sure to remove Form ?',
    }).then(() => deleterecord(e.id))
  }

  return (
    <>
      <div className="FormDesigner">
        <FormDesignerGrid
          onEdit={onedit}
          onDelete={onDelete}
          searchData={{ ...searchData }}
        />
      </div>
    </>
  )
}

export default FormDesigner
