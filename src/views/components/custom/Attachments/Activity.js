import React, { useState } from 'react'
import {
  useQuery,
  useQueries,
  useMutation,
  useIsFetching,
  useQueryClient,
} from 'react-query'

import { FFTabs } from '../../base/FFTabs/FFTabs'
import componentLookUp from '../../../../utils/componentLookup'
import getAPIData from '../../../../models/api/api'
import APIEndPoints from '../../../../models/api/apiEndpoints'
import ActivityManagement from './ActivityManagement'
import { ItemsList } from '../../../pages/Attachment/Activitydata'
import './Activity.css'

const Activity = ({ sysParentEntityId, sysParentEntityType }) => {
  const [Itemlist1, Setitemlist1] = useState(0)
  const [Activitydata, Setactivitydata] = useState(null)
  const [Activitydata1, Setactivitydata1] = useState(null)
  const [mergedArray, setmergedArray] = useState([])
  const [Attachmentdata, setAttachmentdata] = useState(null)
  const componentList = componentLookUp
  const Activitylistitem = ItemsList
  let TabSchema = null

  const [datatypeList, datatypeList1, Attachedmentfield] = useQueries([
    {
      queryKey: ['activity', 'datatypeList'],
      queryFn: () =>
        getAPIData(
          APIEndPoints.GetActivityType.method,
          `${APIEndPoints.GetActivityType.url}?$filter=Name%20eq%20%27ActivityType%27&$expand=optionsetoptions`,
          APIEndPoints.GetActivityType.methodname
        ).then((response) => response.data.value[0]),
    },
    {
      queryKey: ['activity', 'datatypeList1'],
      queryFn: () =>
        getAPIData(
          APIEndPoints.GetEntity.method,
          `${APIEndPoints.GetEntity.url}?$filter=Name%20eq%20%27activity%27&$expand=entityfield($expand=entityfielddatatype)`,
          APIEndPoints.GetEntity.methodname
        ).then((response) => response.data.value[0]),
    },
    {
      queryKey: ['activity', 'Attachedmentfield'],
      queryFn: () =>
        getAPIData(
          APIEndPoints.GetEntity.method,
          `${APIEndPoints.GetEntity.url}?$Filter=Name eq 'Attachment'&$expand=entityfield($expand=OptionSet($expand=OptionSetOptions),entityfielddatatype)`,
          APIEndPoints.GetEntity.methodname
        ).then((response) => response.data.value),
    },
  ])

  const onChangeHandler = (e, tabval) => {
    const tabname = tabval
    Setitemlist1(tabname)
  }

  const mergeDataTypeObjects = (arr1) => {
    return arr1.map((item1) => {
      const itemName = item1.DisplayName
      const datatypeidlist = datatypeList.data.OptionSetOptions.find(
        (item) => Object.values(item)[2] === itemName
      )
      const datatypeid = {
        datatypeid: datatypeidlist && Object.values(datatypeidlist)[3],
      }
      return { ...item1, ...datatypeid }
    })
  }

  const mergeEntityField = (arr1) => {
    return arr1.map((datatype) => {
      const itemName = datatype.Label
      const datatypeidlist = datatypeList1.data.EntityField.find(
        (item) => Object.values(item)[1] === itemName
      )
      const datatypename = {
        Fielddatatypeid: datatypeidlist.EntityFieldDataType.Name,
      }
      datatype = { ...datatype, ...datatypename }

      return { ...datatype }
    })
  }

  const AttachmententityField = (Attachedmentfielddata) => {
    return Attachedmentfielddata.map((datatype) => {
      const datatypename = {
        Fielddatatypeid: datatype.EntityFieldDataType?.Name,
      }
      datatype = { ...datatype, ...datatypename }
      return { ...datatype }
    })
  }

  const AttachmentArray = (Attachedmentfielddata) => {
    return Attachedmentfielddata.map((item1) => {
      const ffff = AttachmententityField(item1.EntityField)
      item1.EntityField = [...ffff, fileuploadcontrol]
      const sdds = item1
      return { ...item1 }
    })
  }

  const fileuploadcontrol = {
    Id: '794a6686-ad43-428c-7572-08d8910a9',
    Name: 'Fileuploadbutton',
    DisplayName: 'Fileuploadbutton',
    Fielddatatypeid: 'DropZone',
  }

  const mergedatatypes = (arr1) => {
    return arr1.map((item1) => {
      const ffff = mergeEntityField(item1.EntityField)
      item1.EntityField = [...ffff]
      return { ...item1 }
    })
  }

  React.useEffect(() => {
    if (
      datatypeList.isFetched &&
      datatypeList1.isFetched &&
      Attachedmentfield.isFetched
    ) {
      const finalDataTypegetdata = mergeDataTypeObjects(
        Activitylistitem.dataSource
      )
      const finalDataTypegetdata1 = mergedatatypes(finalDataTypegetdata)
      const AttachmentArraydata = AttachmentArray(Attachedmentfield.data)
      const obj = AttachmentArraydata[0]
      let arr = finalDataTypegetdata
      arr = [...arr, obj]
      Setactivitydata(arr)
    }
  }, [
    datatypeList.isFetching,
    datatypeList1.isFetching,
    Attachedmentfield.isFetching,
  ])

  // React.useEffect(() => {
  //   async function fetchdata() {
  //     const datatypeList = await getAPIData(
  //       APIEndPoints.GetActivityType.method,
  //       `${APIEndPoints.GetActivityType.url}?$filter=Name%20eq%20%27ActivityType%27&$expand=optionsetoptions`,
  //       APIEndPoints.GetActivityType.methodname
  //     )
  //     Activitylist =
  //       datatypeList.data && datatypeList.data.value[0].OptionSetOptions
  //     const finalDataTypegetdata = mergeDataTypeObjects(
  //       Activitylistitem.dataSource
  //     )
  //     const datatypeList1 = await getAPIData(
  //       APIEndPoints.GetEntity.method,
  //       `${APIEndPoints.GetEntity.url}?$filter=Name%20eq%20%27activity%27&$expand=entityfield($expand=entityfielddatatype)`,
  //       APIEndPoints.GetEntity.methodname
  //     )
  //     Fielddatatype = datatypeList1.data.value[0].EntityField

  //     const Attachedmentfield = await getAPIData(
  //       APIEndPoints.GetEntity.method,
  //       `${APIEndPoints.GetEntity.url}?$Filter=Name eq 'Attachment'&$expand=entityfield($expand=OptionSet($expand=OptionSetOptions),entityfielddatatype)`,
  //       APIEndPoints.GetEntity.methodname
  //     )
  //     const finalDataTypegetdata1 = mergedatatypes(finalDataTypegetdata)
  //     const AttachmentArraydata = AttachmentArray(Attachedmentfield.data.value)
  //     const obj = AttachmentArraydata[0]
  //     let arr = finalDataTypegetdata
  //     arr = [...arr, obj]
  //     Setactivitydata(arr)
  //   }
  //   fetchdata()
  // }, [])

  TabSchema =
    Activitydata &&
    Activitydata.map((tabItem, index) => {
      return {
        ItemTitle: tabItem.DisplayName,
        Itemphoneid: tabItem.phoneid,
        ItemContent: (
          <ActivityManagement
            selectedtab={Itemlist1}
            datatypeval={Activitydata1}
            tablistid={Activitydata}
            datasource={tabItem.EntityField}
            Attachmentdata={Attachmentdata}
            sysParentEntityId={sysParentEntityId}
            sysParentEntityType={sysParentEntityType}
          />
        ),
      }
    })

  return TabSchema ? (
    <div className="activity Wrapper-container">
      <div className="activityheader">
        <span className="Wrapper__title">Activity</span>
      </div>
      <div className="Tab-container">
        <FFTabs dataSource={TabSchema} onChangeHandler={onChangeHandler} />
      </div>
    </div>
  ) : null
}

Activity.propTypes = {}
Activity.defaultProps = {}
export default React.memo(Activity)
