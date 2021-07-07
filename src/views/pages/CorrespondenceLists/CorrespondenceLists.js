import React from 'react'
import { useQueryClient, useQuery } from 'react-query'
import { Add } from '@material-ui/icons'
import { useConfirm } from 'material-ui-confirm'
import _ from 'lodash'

import useActionFields from '../../components/hooks/useActionsFields'
import componentLookup from '../../../utils/componentLookup'
import apiEndPoints from '../../../models/api/apiEndpoints'
import getAPIData, { getCoreData } from '../../../models/api/api'
import useAppContext from '../../components/hooks/useToast'
import usePageTitle from '../../components/hooks/usePageTitle'
import FFGrid from '../../components/base/FFGrid/FFGrid'
import utils from '../../../utils/utils'
import './CorrespondenceLists.css'

const CorrespondenceLists = ({ history }) => {
  const queryClient = useQueryClient()
  const { setActionFields } = useActionFields()
  const { showToastMessage, showLoading } = useAppContext()
  const confirmalert = useConfirm()
  const { setPageTitle } = usePageTitle()

  setPageTitle(`Correspondence Template Lists`)
  const [Lookup, setLookup] = React.useState(null)
  const createFormButtonClick = () => {
    history.push({
      pathname: '/correspondenceEditor',
      state: {
        mode: 'Add',
        correspondenceId: null,
      },
    })
  }

  const actionFields = [
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Icon: Add,
        Label: 'Add a Template',
        CSSName: '',
        onClick: createFormButtonClick,
      },
    },
  ]
  setActionFields({ actionFields, showBackButton: false })

  const onEdit = (editData) => {
    history.push({
      pathname: '/correspondenceEditor',
      state: {
        mode: 'Edit',
        editData,
      },
    })
  }

  async function makeCopy(data) {
    showLoading(true)
    const postData = {
      ...utils.removeKeyFromObject(data, [
        '_attachments',
        '_etag',
        '_rid',
        '_self',
        '_ts',
        'CreatedOn',
        'id',
        'createdOn',
        'Id',
      ])[0],
      TemplateName: `${data.TemplateName} - Copy`,
      IsPublished: false,
    }

    getCoreData('post', apiEndPoints.GetsysCorrespondence.url, postData)
      .then(() => {
        showToastMessage('Saved Successfully', 'success')
      })
      .catch((err) => {
        showLoading(false)
        showToastMessage(JSON.stringify(err?.response?.data), 'error')
      })
      .finally(() => {
        showLoading(false)
        queryClient.invalidateQueries('correspondenceLists')
      })
  }

  const onCopy = (rowData) => {
    confirmalert({
      description: 'Are you sure to copy Correspondence Template?',
    }).then(() => makeCopy(rowData))
  }
  function correspondenceSchema(orginalArr) {
    let lookupEntityTextField
    if (!Lookup) return orginalArr
    if (!orginalArr || orginalArr.length <= 0) return []

    return orginalArr.map((obj) => {
      const entries = Object.entries(obj)
      lookupEntityTextField = entries.reduce((acc, [key, value]) => {
        if (typeof value === 'object')
          acc = { ...acc, [`${key}TextField`]: value.Name }
        return acc
      }, {})

      return {
        ...obj,
        ...lookupEntityTextField,
      }
    })
  }

  const correspondenceListsSchema = useQuery({
    queryKey: ['correspondenceLists', { type: 'schema' }],
    queryFn: () =>
      getAPIData(
        apiEndPoints.GetEntity.method,
        `${apiEndPoints.GetEntity.url}?$filter=Name eq 'CorrespondenceTemplate' &$expand=entityfield`
      ).then((response) => {
        if (_.isEmpty(response.data.value)) return []

        const LookFieldItems = response.data.value[0].EntityField.reduce(
          (acc, cur) => {
            if (cur.Lookup) acc.push(cur.Name)
            return acc
          },
          []
        ).join(',')
        setLookup(LookFieldItems)
        const correspondenceListsColumns = [
          {
            headerName: '',
            field: 'edit',
            cellRenderer: 'FFMoreVertIcon',
            width: 40,
            suppressMenu: false,
            suppressMovable: true,
            sortable: false,
            filter: false,
            resizable: false,
            lockVisible: true,
          },
          ...response.data.value[0].EntityField.reduce(
            (prevColumn, nextColumn) => {
              if (nextColumn.Name === 'TemplateContent') return prevColumn

              return prevColumn.concat({
                headerName: nextColumn.DisplayName,
                field: nextColumn.Lookup
                  ? `${nextColumn.Name}TextField`
                  : nextColumn.Name,
              })
            },
            []
          ),
        ]

        return correspondenceListsColumns
      }),
  })
  const correspondenceListsQuery = useQuery({
    queryKey: ['correspondenceLists', { type: 'data' }],
    queryFn: () =>
      getCoreData(
        apiEndPoints.GetsysCorrespondence.method,
        Lookup
          ? `${apiEndPoints.GetsysCorrespondence.url}?$expand=${Lookup}`
          : `${apiEndPoints.GetsysCorrespondence.url}`
      ).then((response) => {
        return correspondenceSchema(response.data)
      }),
    enabled: !!correspondenceListsSchema.isFetched,
    placeholderData: [],
  })

  return (
    <div className="correspondence-lists">
      <FFGrid
        dataSource={{
          columnDefs: correspondenceListsSchema.data,
          rowData: correspondenceListsQuery.data,
        }}
        onEdit={onEdit}
        onCopy={onCopy}
      />
    </div>
  )
}

export default CorrespondenceLists
