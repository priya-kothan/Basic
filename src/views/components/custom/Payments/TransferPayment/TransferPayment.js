import React, { useState, useReducer } from 'react'
import { Close as CloseIcon } from '@material-ui/icons'
import FFButton from '../../../base/FFButton/FFButton'
import FFGrid from '../../../base/FFGrid/FFGrid'
import { getCoreData } from '../../../../../models/api/api'
import APIEndPoints from '../../../../../models/api/apiEndpoints'
import useAppContext from '../../../hooks/useToast'
import CRUDModal from '../../CRUDModal/CRUDModal'
import PaymentGrid from '../PaymentGrid/PaymentGrid'
import './TransferPayment.css'

function paymentReducer(state, action) {
  switch (action.type) {
    case 'SHOW_POPUP':
      return {
        ...state,
        showModal: true,
        mode: 'ADD',
      }
    case 'HIDE_POPUP':
      return {
        ...state,
        showModal: false,
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}
const TransferPayment = ({
  sysParentEntityType,
  sysParentEntityId,
  disabled,
  sysListColumnId,
}) => {
  const initialState = {
    isLoggedIn: false,
    showModal: false,
    modalData: null,
    error: '',
    disabled: true,
  }
  const [state, dispatch] = useReducer(paymentReducer, initialState)
  const [TransferPaymentDropdownData, setTransferPaymentDropdownData] =
    useState([])
  const [TransferPaymentDropdownvalues, setTransferPaymentDropdownvalues] =
    useState('')
  const { showModal } = state
  const [PaymentData, setPaymentData] = useState(null)
  const [PaymentValue, setPaymentValue] = useState(null)
  const [PaymentTransfer, setPaymentTransfer] = useState(null)
  const { showToastMessage, showLoading } = useAppContext()

  const transferPaymentId = (id) => {
    const payemtFields = {
      ...PaymentTransfer,
      ...{
        sysParentEntityID: id,
      },
    }
    setPaymentTransfer(payemtFields)
    setTransferPaymentDropdownData(!!payemtFields.sysParentEntityID)
  }

  function onRowSelected(event) {
    const PaymentListID = this.api.getSelectedNodes()
    const { sysParentEntityType } = event.data
    const paymentDatas = {
      ...PaymentValue,
      ...{
        Paymentid:
          PaymentListID[0] && PaymentListID[0].id ? PaymentListID[0].id : null,
        sysParentEntityType,
      },
    }
    setPaymentValue(paymentDatas)
    setTransferPaymentDropdownvalues(!!paymentDatas.Paymentid)
  }

  const PaymentTransferData = {
    ...PaymentTransfer,
    ...PaymentValue,
  }

  if (
    TransferPaymentDropdownData === true &&
    TransferPaymentDropdownvalues === true
  ) {
    disabled = false
  } else {
    disabled = true
  }

  async function handleTransferInputChanged() {
    showLoading(true)
    if (PaymentTransferData) {
      Promise.all([
        getCoreData(
          'post',
          `${APIEndPoints.PostPaymentTransfer.url}`,
          PaymentTransferData
        ),
      ])
        .then(() => {
          showLoading(false)
          showToastMessage('Payment Transfer Successful', 'success')
          window.location.reload()
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
  }

  React.useEffect(() => {
    async function fetchdata() {
      const TransferData = await getCoreData(
        'get',
        `/api/${sysParentEntityType}(${sysParentEntityId})?$expand=Payment&$filter=AmountPaid ne 0`
      )
        .then((TransferData) => {
          setPaymentData(TransferData.data[0].Payment)
        })
        .catch((err) => null)
    }
    fetchdata()
  }, [])

  const Griddata = {
    columnDefs: [
      {
        width: 5,
        suppressMenu: true,
        suppressMovable: true,
      },
      {
        headerName: 'sysParentEntity Type',
        field: 'sysParentEntityType',
        width: 200,
        checkboxSelection: true,
      },
      {
        headerName: 'sysParentEntity ID',
        field: 'sysParentEntityID',
        width: 300,
      },
      {
        headerName: 'Amount',
        field: 'Amount',
        width: 100,
      },
      { headerName: 'Currency', field: 'Currency', width: 100 },
      { headerName: 'PaymentBy', field: 'PaymentBy', width: 100 },
      { headerName: 'PaymentType', field: 'PaymentType', width: 100 },
      {
        headerName: 'PaymentStatus',
        field: 'PaymentStatus',
        width: 100,
      },
      {
        headerName: 'TransactionId',
        field: 'TransactionId',
        width: 350,
      },
      {
        headerName: 'PaymentDatetime',
        field: 'PaymentDatetime',
        width: 350,
      },
    ],
    rowData: PaymentData || [],
    rowSelection: 'single',
    onRowSelected,
  }
  return (
    <>
      <div className="div-container-transfer">
        <div className="div-field-transfer">
          <FFButton
            id="RecordTransfer_Btn"
            CSSClass="btn_RecordTransfer"
            className="RecordTransfer_Btn"
            type="button"
            Field={{
              FieldValue: 'Transfer Payment',
              FieldLabel: 'Transfer Payment',
              CSSClass: '',
            }}
            onClickHandler={() => dispatch({ type: 'SHOW_POPUP' })}
          />
        </div>
        <div className="transferPayment_Model">
          <CRUDModal open={showModal} width="30%">
            <CRUDModal.Header>
              <CRUDModal.Title>Transfer Payment</CRUDModal.Title>
              <CRUDModal.Close
                onClick={() =>
                  dispatch({
                    type: 'HIDE_POPUP',
                  })
                }
              >
                <CloseIcon />
              </CRUDModal.Close>
            </CRUDModal.Header>
            <CRUDModal.Content>
              <span>Payment List</span>
              <FFGrid dataSource={Griddata} />
              <span>Transfer Payment To</span>
              <PaymentGrid
                sysListId={sysListColumnId}
                sysParentEntityId={sysParentEntityId}
                sysParentEntityType={sysParentEntityType}
                transferPaymentId={transferPaymentId}
              />
            </CRUDModal.Content>
            <CRUDModal.Footer>
              <FFButton
                id="RecordTransferFooter_Btn"
                CSSClass="btn_RecordTransfer"
                className="RecordTransferFooter_Btn"
                type="button"
                Field={{
                  FieldValue: 'Transfer Payment',
                  FieldLabel: 'Transfer Payment',
                  CSSClass: '',
                  Disabled: disabled,
                }}
                onClickHandler={handleTransferInputChanged}
              />
              <FFButton
                Field={{
                  FieldValue: 'Cancel',
                  FieldLabel: `Cancel`,
                  CSSClass: 'Cancelbutton',
                  Type: 'secondary',
                }}
                CSSClass="Cancel"
                variant="contained"
                id="transfer_Btn_Close"
                className="transfer_Btn_Close"
                onClickHandler={() =>
                  dispatch({
                    type: 'HIDE_POPUP',
                  })
                }
              />
            </CRUDModal.Footer>
          </CRUDModal>
        </div>
      </div>
    </>
  )
}
export default TransferPayment
