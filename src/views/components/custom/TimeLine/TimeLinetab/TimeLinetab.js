/* eslint-disable  */
import React, { Fragment } from 'react'
import useAppContext from '../../../hooks/useToast'
import(`../TimeLineItems/TimeLineItems`)
import { getCoreData } from '../../../../../models/api/api'
import getAPIData from '../../../../../models/api/api'
import TimeLinetabDesign from './TimeLinetabDesign'
import APIEndPoints from '../../../../../models/api/apiEndpoints'
import { useQueries, useQuery, useQueryClient } from 'react-query'

const TimeLineList = {
  dataSource: [
    {
      Name: 'All',
      DisplayName: 'All',
      ActivityField: [],
    },

    {
      Name: 'Phone',
      DisplayName: 'Phone call',
      ActivityField: [],
    },
    {
      Name: 'Letter',
      DisplayName: 'Letter',
      ActivityField: [],
    },
    {
      Name: 'Email',
      DisplayName: 'Email',
      ActivityField: [],
    },
    {
      Name: 'Task',
      DisplayName: 'Task',
      ActivityField: [],
    },
    {
      Name: 'Attachment',
      DisplayName: 'Attachment',
      ActivityField: [],
    },
  ],
}

const PlanedTimeLineList = {
  dataSource: [
    {
      Name: 'All',
      DisplayName: 'All',
      ActivityField: [],
    },

    {
      Name: 'Phone',
      DisplayName: 'Phone call',
      ActivityField: [],
    },
    {
      Name: 'Email',
      DisplayName: 'Email',
      ActivityField: [],
    },
    {
      Name: 'Letter',
      DisplayName: 'Letter',
      ActivityField: [],
    },
  ],
}
function activitydisplaytypeReducer(stateData, action) {
  switch (action.type) {
    case 'SET_OPTIONSETOPTIONS':
      return { ...stateData, optionSetData: action.optionSetData }
    case 'SET_ATTACHMENT':
      return { ...stateData, attachmentData: action.attachmentData }
    case 'SET_ACTIVITYDATA':
      return {
        ...stateData,
        activityData: action.activityData,
        activityData1: action.activityData1,
      }
    case 'SET_ACTIVITY':
      return { ...stateData, activity: action.activity }
    case 'SET_ATTACHMENTID':
      return { ...stateData, attachmentId: action.attachmentId }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const TimeLinetab = ({ state, sysParentEntityId, sysParentEntityType }) => {
  //Intitail Rendering for 0 index tab for upcomming and past
  useQueries([
    {
      queryKey: ['TimeLinetab', 'Closed'],
      queryFn: () =>
        getCoreData(
          APIEndPoints.GetTimeline.method,
          `${APIEndPoints.GetTimeline.url}?$expand=activity&$filter=Status eq 'Closed' or Status eq 'Complete' and sysParentEntityID eq '${sysParentEntityId}'`
        ).then((response) => response.data),
      onSuccess: (data) => {
        dispatch({
          type: 'SET_ACTIVITY',
          activity: { Name: 'All', Status: 'Closed' },
        })
        dispatch({
          type: 'SET_ACTIVITYDATA',
          activityData: data,
        })
      },
    },

    {
      queryKey: ['TimeLinetab', 'Pending'],
      queryFn: () =>
        getCoreData(
          APIEndPoints.GetTimeline.method,
          `${APIEndPoints.GetTimeline.url}?$expand=activity&$filter=Status eq 'Pending' and sysParentEntityID eq '${sysParentEntityId}'`
        ).then((response) => response.data),
      onSuccess: (data) => {
        dispatch({
          type: 'SET_ACTIVITY',
          activity: { Name: 'All', Status: 'Pending' },
        })
        dispatch({
          type: 'SET_ACTIVITYDATA',
          activityData: data,
        })
      },
    },
  ])

  const { showToastMessage, showLoading } = useAppContext()
  const [timelinepast, setTimelinepast] = React.useState(null)
  const [timelineupcomming, setTimelineupcomming] = React.useState(null)

  let TimeLineClosed = null
  let TimeLinePending = null
  let DynamicComponent = null
  let PastTabSchema = null
  let UpcomingTabSchema = null
  let tabselectedName = null
  let selectedType = null
  DynamicComponent = React.lazy(() => import(`../TimeLineItems/TimeLineItems`))

  let CompletedActivityfilter = ''

  const getDisabledValues = (Name, Status) => {
    let tabItems =
      Status == 'Closed' ? state[0].pastItems : state[0].upcommingItems
    const itemIndex = tabItems.findIndex((item) => item === Name)
    return itemIndex >= 0 ? false : true
  }

  const mergeactivityArr = (oldArr, newArr, tabName, Status) => {
    return tabName !== 'All' ?? tabName != 'Attachment'
      ? oldArr.map((field) => {
          let fieldName = field.Name
          let Activityitems =
            newArr && newArr.filter((item) => item.Name == fieldName)
          let disabled = { disabled: getDisabledValues(field.Name, Status) }
          field.ActivityField = [...Activityitems]
          return { ...field, ...disabled }
        })
      : tabName == 'All' ?? tabName == 'Attachment'
      ? oldArr.map((field) => {
          if (field.Name == 'All' ?? field.Name == 'Attachment')
            field.ActivityField = [...newArr]
          let disabled = { disabled: getDisabledValues(field.Name, Status) }
          return field.Name == 'All' ? { ...field } : { ...field, ...disabled }
        })
      : null
  }

  const onChangeHandler = (e, Index, Status) => {
    showLoading(true)
    tabselectedName = Index !== 0 ? e.target.innerText.replace(/ /g, '') : 'All'
    selectedType =
      tabselectedName != 'All' && tabselectedName != 'Attachment'
        ? stateData.optionSetData &&
          stateData.optionSetData.find(
            (item) => item['Name'] === tabselectedName
          )
        : tabselectedName == 'All'
        ? { Name: 'All' }
        : { Name: 'Attachment' }

    selectedType &&
      (Status == 'Closed'
        ? (selectedType.Status = 'Closed')
        : (selectedType.Status = 'Pending'),
      dispatch({
        type: 'SET_ACTIVITY',
        activity: selectedType,
      }))
    if (tabselectedName != 'Attachment') {
      tabselectedName === 'All'
        ? (CompletedActivityfilter =
            Status == 'Closed'
              ? `?$expand=activity&$filter=Status eq '${Status}' or Status eq 'Complete' and sysParentEntityID eq '${sysParentEntityId}'`
              : `?$expand=activity&$filter=Status eq '${Status}'  and sysParentEntityID eq '${sysParentEntityId}'`)
        : (CompletedActivityfilter =
            Status == 'Closed'
              ? `?$expand=activity&$filter=Status eq '${Status}' or Status eq 'Complete' and ActivityDisplayType eq ${selectedType.Value} and sysParentEntityID eq '${sysParentEntityId}'`
              : `?$expand=activity&$filter=Status eq '${Status}' and ActivityDisplayType eq ${selectedType.Value} and sysParentEntityID eq '${sysParentEntityId}'`)

      async function fetchActivityItems() {
        await getCoreData(
          APIEndPoints.GetTimeline.method,
          `${APIEndPoints.GetTimeline.url}${CompletedActivityfilter}`,
          APIEndPoints.GetTimeline.methodname
        )
          .then((response) => {
            dispatch({
              type: 'SET_ACTIVITYDATA',
              activityData: response.data,
            })
          })
          .catch((err) => {
            showLoading(false)
            showToastMessage(err.message, 'error')
          })
          .finally(() => {
            showLoading(false)
          })
      }
      fetchActivityItems()
    }

    if (tabselectedName == 'Attachment') {
      async function attachmentActivity() {
        await getCoreData(
          APIEndPoints.GetTimeline.method,
          `${APIEndPoints.GetTimeline.url}?$expand=Attachment&$filter=TimelineType eq ${stateData.attachmentId} and sysParentEntityID eq '${sysParentEntityId}'`,
          APIEndPoints.GetTimeline.methodname
        )
          .then((response) => {
            dispatch({
              type: 'SET_ATTACHMENT',
              attachmentData: response.data,
            })
          })
          .catch((err) => {
            showToastMessage(err.message, 'error')
          })
      }
      attachmentActivity()
    }
  }

  const initialState = {
    optionSetData: [],
    activityData: [],
    attachmentData: [],
    activity: {},
    attachmentId: 0,
  }
  const [stateData, dispatch] = React.useReducer(
    activitydisplaytypeReducer,
    initialState
  )

  React.useEffect(() => {
    showLoading(true)
    async function fetchData() {
      await Promise.all([
        getAPIData(
          APIEndPoints.GetOptionSetList.method,
          `${APIEndPoints.GetOptionSetList.url}?$filter=Name eq 'ActivityType'&$expand=optionsetoptions`,
          APIEndPoints.GetOptionSetList.methodname
        ),
        getAPIData(
          APIEndPoints.GetOptionSetList.method,
          `${APIEndPoints.GetOptionSetList.url}?$filter=Name eq 'TimeLinetype'&$expand=Optionsetoptions($filter=Name eq 'Attachment')`,
          APIEndPoints.GetOptionSetList.methodname
        ),
      ])
        .then(([resOptionset, resAttachment]) => {
          dispatch({
            type: 'SET_OPTIONSETOPTIONS',
            optionSetData: resOptionset.data.value[0].OptionSetOptions,
          })
          dispatch({
            type: 'SET_ATTACHMENTID',
            attachmentId: resAttachment.data.value[0].OptionSetOptions[0].Value,
          })

          showLoading(false)
        })
        .catch((err) => {
          showLoading(false)
          showToastMessage(err.message, 'error')
        })
        .finally(() => {
          showLoading(false)
        })
    }

    fetchData()
  }, [])

  React.useEffect(() => {
    let ActivityList = null
    TimeLineClosed = TimeLineList.dataSource
    TimeLinePending = PlanedTimeLineList.dataSource

    const { Name, Status } = stateData.activity
    if (Name && Name !== 'Attachment') {
      ActivityList =
        stateData.activityData &&
        stateData.activityData.map((tabitem, key) => {
          return tabitem.ActivityDisplayType &&
            tabitem.ActivityDisplayType == 'PhoneCall'
            ? {
                Name: 'Phone',
                CallDirection: tabitem.Activity
                  ? tabitem.Activity.CallDirection
                  : '',
                CallDuration: tabitem.Activity
                  ? tabitem.Activity.CallDuration
                  : '',
                CalledPhoneNo: tabitem.Activity
                  ? tabitem.Activity.CalledPhoneNo
                  : '',
                CallTimestamp: tabitem.Activity
                  ? tabitem.Activity.CallTimestamp
                  : '',
              }
            : tabitem.ActivityDisplayType &&
              tabitem.ActivityDisplayType == 'Letter'
            ? {
                Name: tabitem.Activity
                  ? tabitem.Activity.ActivityDisplayType
                  : '',
                PostalMethod: tabitem.Activity
                  ? tabitem.Activity.PostalMethod
                  : '',
                SubjectLine: tabitem.Activity
                  ? tabitem.Activity.SubjectLine
                  : '',
                PostedAddress: tabitem.Activity
                  ? tabitem.Activity.PostedAddress
                  : '',
              }
            : tabitem.ActivityDisplayType &&
              tabitem.ActivityDisplayType == 'Email'
            ? {
                Name: tabitem.Activity
                  ? tabitem.Activity.ActivityDisplayType
                  : '',
                EmailTo: tabitem.Activity ? tabitem.Activity.EmailTo : '',
                EmailCc: tabitem.Activity ? tabitem.Activity.EmailCc : '',
                EmailTimestamp: tabitem.Activity
                  ? tabitem.Activity.EmailTimestamp
                  : '',
                SubjectLine: tabitem.Activity
                  ? tabitem.Activity.SubjectLine
                  : '',
              }
            : tabitem.ActivityDisplayType &&
              tabitem.ActivityDisplayType == 'Task'
            ? {
                Name: tabitem.Activity
                  ? tabitem.Activity.ActivityDisplayType
                  : '',
                TaskTimestamp: tabitem.Activity
                  ? tabitem.Activity.TaskTimestamp
                  : '',
              }
            : {}
        })
    }

    if (Name === 'Attachment') {
      ActivityList =
        stateData.attachmentData &&
        stateData.attachmentData.map((tabitem, key1) => {
          const {
            Attachment: {
              AttachmentType: { Name },
              OriginalFileName,
              CreatedOn,
            },
          } = tabitem
          return {
            Name: 'Attachment',
            AttachmentType: Name,
            OriginalFileName: OriginalFileName,
            CreatedOn: CreatedOn,
          }
        })
    }

    ActivityList != null
      ? Status == 'Closed'
        ? (TimeLineClosed = mergeactivityArr(
            TimeLineClosed,
            ActivityList,
            Name,
            Status
          ))
        : (TimeLinePending = mergeactivityArr(
            TimeLinePending,
            ActivityList,
            Name,
            Status
          ))
      : ''

    if (Status == 'Closed') {
      setTimelinepast((Prev) => ({
        ...Prev,
        TimeLineClosed,
      }))
    } else {
      setTimelineupcomming((Prev) => ({
        ...Prev,
        TimeLinePending,
      }))
    }
    showLoading(false)
  }, [
    stateData.activityData,
    stateData.activityData1,
    stateData.attachmentData,
  ])

  PastTabSchema =
    timelinepast &&
    timelinepast.TimeLineClosed.map((tabItem, key) => {
      return {
        ItemTitle: tabItem.DisplayName,
        ItemContent: (
          <DynamicComponent
            title={tabItem.DisplayName}
            datasource={tabItem.ActivityField}
          />
        ),
        disabled: tabItem.DisplayName == 'All' ? false : tabItem.disabled,
      }
    })

  UpcomingTabSchema =
    timelineupcomming &&
    timelineupcomming.TimeLinePending.map((tabItem, key) => {
      return {
        ItemTitle: tabItem.DisplayName,
        ItemContent: (
          <DynamicComponent
            title={tabItem.DisplayName}
            datasource={tabItem.ActivityField}
          />
        ),
        disabled: tabItem.DisplayName == 'All' ? false : tabItem.disabled,
      }
    })
  return (
    <>
      {state[0].showUpcomming && UpcomingTabSchema ? (
        <TimeLinetabDesign
          dataSource={UpcomingTabSchema}
          heading="Upcomming"
          className="Upcomming__tabItems"
          selectedupcommingtabname={onChangeHandler}
          Status="Pending"
        />
      ) : null}
      {state[0].showPast && PastTabSchema ? (
        <TimeLinetabDesign
          dataSource={PastTabSchema}
          heading="Past"
          className="Past__tabItems"
          selectedpasttabname={onChangeHandler}
          Status="Closed"
        />
      ) : null}
    </>
  )
}

TimeLinetab.propTypes = {}

TimeLinetab.defaultProps = {}

export default TimeLinetab
