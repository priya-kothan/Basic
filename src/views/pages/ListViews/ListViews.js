import React from 'react'
import PropTypes from 'prop-types'
import {
  Add,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from '@material-ui/icons'

import componentLookup from '../../../utils/componentLookup'
import useActionFields from '../../components/hooks/useActionsFields'
import useAppContext from '../../components/hooks/useToast'
import usePageTitle from '../../components/hooks/usePageTitle'
import getAPIData, { getCoreData } from '../../../models/api/api'
import APIEndPoints from '../../../models/api/apiEndpoints'
import FFGrid from '../../components/base/FFGrid/FFGrid'
import FFTextBox from '../../components/base/FFTextBox/FFTextBox'
import FFButton from '../../components/base/FFButton/FFButton'
import CRUDModal from '../../components/custom/CRUDModal/CRUDModal'

import listViewsData from './ListViews.json'
import './ListViews.css'

function stateReducer(state, action) {
  switch (action.type) {
    case 'SHOW_POPUP':
      return {
        ...state,
        showModal: true,
        modalData: null,
        title: '',
        // entity: '',
        listName: '',
        mode: 'ADD',
      }
    case 'HIDE_POPUP':
      return { ...state, showModal: false }
    case 'SET_APIDATA':
      return {
        ...state,
        gridDatasource: action.gridDatasource,
        entityData: action.entityData,
        showLoading: false,
      }
    case 'EDIT_POPUP':
      return {
        ...state,
        showModal: true,
        modalData: action.modalData,
        title: action.modalData.Title,
        // entity: action.modalData.SysEntity,
        listName: action.modalData.ListName,
        mode: 'EDIT',
      }
    case 'SHOW_LOADING':
      return { ...state, showLoading: true }
    case 'ADD_NEW':
      return {
        ...state,
        ...action,
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const ListViews = ({ history, location }) => {
  const initialState = {
    gridDatasource: {},
    showModal: false,
    modalData: null,
    showLoading: true,
    title: '',
    entity: location.state.entity,
    listName: '',
    mode: '',
  }
  const [state, dispatch] = React.useReducer(stateReducer, initialState)
  const { setActionFields } = useActionFields()
  const { showToastMessage, showLoading } = useAppContext()
  const { setPageTitle } = usePageTitle()

  showLoading(state.showLoading)
  setPageTitle('List Views')

  const actionFields = [
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Label: 'Back to Entities',
        Icon: ArrowBackIcon,
        CSSName: '',
        onClick: () => history.goBack(),
      },
    },
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Icon: Add,
        Label: 'Add List',
        CSSName: '',
        onClick: () => dispatch({ type: 'SHOW_POPUP' }),
      },
    },
  ]
  setActionFields({ actionFields, showBackButton: false })

  const gridOverlay = (params) => {
    if (state.showGridOverlay) params.api.showLoadingOverlay()
    else params.api.hideOverlay()
  }

  const onViewNameCellClickHandler = React.useCallback(
    (event) => {
      const columnIndex = event.columnApi.columnController.columnDefs.findIndex(
        (column) => column.field === event.column.colId
      )
      if (columnIndex === 0 && history)
        history.push({
          pathname: `/sysListDesigner`,
          state: {
            data: event.data,
            entity: event.data.SysEntity,
            title: event.data.Title,
            listName: event.data.ListName || '',
            mode: 'EDIT',
          },
        })
    },
    [history]
  )

  const onEditClickHandler = (rowData) => {
    dispatch({ type: 'EDIT_POPUP', modalData: rowData })
  }

  const onDeleteClickHandler = () => {
    showToastMessage('Delete')
  }

  React.useEffect(() => {
    async function fetchData() {
      const sysListColumn = getCoreData(
        APIEndPoints.GetSysList.method,
        `${APIEndPoints.GetSysList.url}?$filter=SysEntity eq '${state.entity}'`
      )
      const entityList = getAPIData(
        APIEndPoints.GetEntity.method,
        APIEndPoints.GetEntity.url
      )

      await Promise.all([sysListColumn, entityList])
        .then((responses) => {
          dispatch({
            type: 'SET_APIDATA',
            gridDatasource: {
              ...listViewsData,
              rowData: responses[0].data,
              onCellClicked: onViewNameCellClickHandler,
            },
            entityData: responses[1].data.value,
          })
        })
        .catch((err) => {
          showLoading(false)
          showToastMessage(err.message)
        })
        .finally(() => {
          showLoading(false)
        })

      return () => {
        showLoading(false)
      }
    }
    fetchData()
  }, [onViewNameCellClickHandler, showToastMessage])

  const {
    gridDatasource,
    showModal,
    modalData,
    entityData,
    title,
    entity,
    listName,
    mode,
  } = state

  return (
    <>
      <div className="listviews">
        <FFGrid
          dataSource={gridDatasource}
          onGridReady={gridOverlay}
          onEdit={onEditClickHandler}
          onDelete={onDeleteClickHandler}
        />
      </div>
      <CRUDModal open={showModal}>
        <CRUDModal.Header CSSClass="listviews_CRUD_header">
          <CRUDModal.Title>List View</CRUDModal.Title>
          <CRUDModal.Close onClick={() => dispatch({ type: 'HIDE_POPUP' })}>
            <CloseIcon />
          </CRUDModal.Close>
        </CRUDModal.Header>
        <CRUDModal.Content CSSClass="listviews_CRUD_content">
          <FFTextBox
            label="Title"
            Field={{
              FieldValue: 'Title',
              FieldLabel: 'Title',
              DefaultValue: modalData?.Title,
            }}
            value={title}
            className="ListTitle"
            onChangeHandler={(event, properties) =>
              dispatch({ type: 'ADD_NEW', title: properties.value })
            }
          />
          {/* <FFDropdown
            Field={{
              FieldValue: 'SysEntity',
              DefaultValue: '',
              FieldLabel: 'Entity',
              Datasource: entityData,
              TextField: 'DisplayName',
              ValueField: 'Name',
              Disabled: mode === 'EDIT',
            }}
            value={entity}
            onChangeHandler={(event, properties) =>
              dispatch({ type: 'ADD_NEW', entity: properties.value })
            }
          /> */}
          <FFTextBox
            label="List Name"
            Field={{
              FieldValue: 'ListName',
              FieldLabel: 'List Name',
              DefaultValue: modalData?.listName,
              Disabled: mode === 'EDIT',
            }}
            value={listName}
            className="ListListName"
            onChangeHandler={(event, properties) =>
              dispatch({ type: 'ADD_NEW', listName: properties.value })
            }
          />
        </CRUDModal.Content>
        <CRUDModal.Footer>
          <FFButton
            Field={{
              Variant: 'contained',
              Disabled: !title || !listName,
              FieldLabel: 'Continue',
              Type: 'primary',
            }}
            className="addmodal__success"
            onClickHandler={() =>
              history.push({
                pathname: `/sysListDesigner`,
                state: {
                  entity,
                  title,
                  listName,
                  data: modalData,
                  mode,
                },
              })
            }
          />
          <FFButton
            Field={{
              Variant: 'contained',
              FieldLabel: 'Cancel',
              Type: 'secondary',
            }}
            className="addmodal__cancel"
            onClickHandler={() => dispatch({ type: 'HIDE_POPUP' })}
          />
        </CRUDModal.Footer>
      </CRUDModal>
    </>
  )
}

ListViews.defaultProps = {
  history: null,
}

ListViews.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}

export default ListViews
