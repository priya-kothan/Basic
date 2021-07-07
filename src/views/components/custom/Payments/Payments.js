import React, { useState, useReducer } from 'react'
import { useQuery, useMutation } from 'react-query'
import { Close as CloseIcon } from '@material-ui/icons'
import { format } from 'date-fns'
import FFTextBox from '../../base/FFTextBox/FFTextBox'
import FFButton from '../../base/FFButton/FFButton'
import FFDatepicker from '../../base/FFDatePicker/FFDatepicker'
import CRUDModal from '../CRUDModal/CRUDModal'
import FFAutocomplete from '../../base/FFAutocomplete/FFAutocomplete'
import { getCoreData } from '../../../../models/api/api'
import ApiEndpoints from '../../../../models/api/apiEndpoints'
import useAppContext from '../../hooks/useToast'
import TransferPayment from './TransferPayment/TransferPayment'
import './Payments.css'

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
        paymentFields: {
          ...action.clear.paymentFields,
        },
        paymentType: {
          ...action.clear.paymentType,
        },
      }

    case 'paymentField': {
      return {
        ...state,
        paymentFields: {
          ...state.paymentFields,
          ...action.paymentFields,
        },
      }
    }
    case 'showCahsPayment':
      return {
        ...state,
        paymentFields: {
          ...action.paymentMode.paymentFields,
          AgentId: state.paymentFields.AgentId,
        },
        paymentType: {
          ...action.paymentMode.paymentType,
        },
      }
    case 'showChequePayment':
      return {
        ...state,
        paymentFields: {
          ...action.paymentMode.paymentFields,
          AgentId: state.paymentFields.AgentId,
        },
        paymentType: {
          ...action.paymentMode.paymentType,
        },
      }
    case 'getTransactionFields':
      return {
        ...state,
        transactionFields: {
          ...action.transactionFields,
        },
      }

    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const Payments = ({
  sysParentEntityId,
  sysParentEntityType,
  sysListColumnId,
}) => {
  const initialState = {
    paymentFields: {
      AgentId: '',
      ModeofPayment: '',
      Amount: '',
      ChequeDate: format(new Date(), 'yyyy-dd-MM HH:mm:ss'),
      ChequeNumber: '',
      AccountType: '',
      BankName: '',
      ReceiptNumber: '',
      ReceiptDate: format(new Date(), 'yyyy-dd-MM HH:mm:ss'),
      sysParentEntityID: sysParentEntityId,
      sysParentEntityType,
      FromAccount: '',
      ToAccount: '',
      Organisation: '',
    },
    isLoggedIn: false,
    showModal: false,
    modalData: null,
    paymentType: {
      initialScreenMode: true,
      cashPayment: false,
      chequePayment: false,
    },
    error: '',
  }

  const { showToastMessage, showLoading } = useAppContext()
  const [Paymentdata, SetPaymentdata] = useState(null)
  const [Paymentsort, SetPaymentsortdata] = useState(null)

  React.useEffect(() => {
    async function fetchdata() {
      const Paymentreponse = await getCoreData(
        'get',
        `/api/${sysParentEntityType}(${sysParentEntityId})?$expand=Payment`
      )
        .then((Paymentreponse) => {
          const paymentorderlist = Paymentreponse.data[0].Payment.sort(
            (a, b) => -b.PaymentDatetime.localeCompare(a.PaymentDatetime)
          )

          SetPaymentsortdata(paymentorderlist)
          SetPaymentdata(Paymentreponse.data[0])
        })
        .catch((err) => null)
    }
    fetchdata()
  }, [])
  const [state, dispatch] = useReducer(paymentReducer, initialState)
  function onhandleChage(event, propertyName) {
    // event.persist()
    if (!propertyName) return null
    if (propertyName.value == 'Cash')
      dispatch({
        type: 'showCahsPayment',
        paymentMode: {
          paymentType: { ...initialState.paymentType, cashPayment: true },
          paymentFields: {
            ...initialState.paymentFields,
            ChequeDate: '',
          },
        },
      })
    if (propertyName.value == 'Cheque')
      dispatch({
        type: 'showChequePayment',
        paymentMode: {
          paymentType: { ...initialState.paymentType, chequePayment: true },
          paymentFields: {
            ...initialState.paymentFields,
          },
        },
      })

    dispatch({
      type: 'paymentField',
      paymentFields: {
        [propertyName.id]:
          [propertyName.id] != 'Amount'
            ? propertyName.value
            : parseInt(propertyName.value),
      },
    })
  }

  function getPaymentType() {
    return [
      { Name: 'Cash', DisplayName: 'Cash Payment' },
      { Name: 'Cheque', DisplayName: 'Cheque Payment' },
    ]
  }

  const {
    showModal,
    paymentType: { initialScreenMode, cashPayment, chequePayment },
  } = state

  const mutationPayment = useMutation(postPaymentField, {
    onMutate: () => showLoading(true),
    onSuccess: (response) => {
      if (response?.data?.status === 'Success') {
        const transactionFields = {
          TransactionReferenceNo:
            response.data?.responseData[0]?.TransactionReferenceNo,
          TransactionStatus: 'Success',
        }
        if (transactionFields?.TransactionReferenceNo)
          mutationTransaction.mutate(transactionFields)
        else showToastMessage('Transaction failed')
      } else {
        showLoading(false)
        if (response.data[0]) {
          showToastMessage(JSON.stringify(response.data[0].Message), 'error')
        } else {
          showToastMessage('Saved successfully')

          location.reload()
        }
      }
    },
    onError: (err) => {
      showToastMessage(JSON.stringify(err?.response?.data), 'error')
      showLoading(false)
    },
  })

  const mutationTransaction = useMutation(
    (mutationData) => {
      return getCoreData('patch', ApiEndpoints.UpdatePayment.url, mutationData)
    },
    {
      onMutate: () => showLoading(true),
      onSuccess: (response) => {
        if (response.data) showToastMessage('Saved successfully')
        location.reload()
      },
      onError: (err) => {
        showToastMessage(JSON.stringify(err?.response?.data), 'error')
      },
      onSettled: () => {
        dispatch({
          type: 'HIDE_POPUP',
          clear: {
            paymentFields: initialState.paymentFields,
            paymentType: initialState.paymentType,
          },
        })
        showLoading(false)
      },
    }
  )

  async function postPaymentField(mutationData) {
    return await getCoreData(
      'POST',
      ApiEndpoints.InitiatePayment.url,
      mutationData
    )
  }
  async function onSaveClickHandler() {
    {
      const postData = {
        ...state.paymentFields,
        Organisation: Paymentdata?.Organisation,
      }
      mutationPayment.mutate(postData)
    }
  }
  const PaymentAccount = useQuery({
    queryKey: ['PaymentAccount', { type: 'data' }],
    queryFn: () =>
      getCoreData('get', `${ApiEndpoints.PaymentAccount.url}`).then(
        (response) => {
          const Result = Paymentdata?.Organisation
            ? response.data.filter(
                (item) =>
                  item?.Organisation?.toLowerCase() ===
                  Paymentdata?.Organisation?.toLowerCase()
              )
            : []

          return Result
        }
      ),
    enabled: !!Paymentdata,
  })

  if (!Paymentdata) return null
  return (
    <>
      <div className="div-container">
        <div className="div-field">
          <FFTextBox
            Field={{
              FieldValue: 'AmountOutstanding',
              FieldLabel: 'Outstanding Amount',
            }}
            variant="filled"
            disabled="true"
            value={
              Paymentdata &&
              `${Paymentdata.Currency || ''} ${
                Paymentdata.AmountOutstanding || '0'
              }`
            }
          />
        </div>
        <div className="div-field">
          <FFTextBox
            Field={{
              FieldValue: 'OriginalAmount',
              FieldLabel: 'Original Amount',
            }}
            variant="filled"
            disabled="true"
            value={
              Paymentdata &&
              `${Paymentdata.Currency || ''} ${
                Paymentdata.OriginalAmount || '0'
              }`
            }
          />
        </div>
        <div className="div-field">
          <FFTextBox
            Field={{
              FieldValue: 'AmountPaid',
              FieldLabel: 'Paid Amount',
            }}
            disabled="true"
            variant="filled"
            value={
              Paymentdata &&
              `${Paymentdata.Currency || ''} ${Paymentdata.AmountPaid || '0'}`
            }
          />
        </div>
        <div className="div-field">
          <FFTextBox
            Field={{
              FieldValue: 'PaymentDatetime',
              FieldLabel: 'Last Paid Date',
            }}
            disabled="true"
            variant="filled"
            value={
              Paymentsort[0] &&
              (Paymentsort[Paymentsort.length - 1].PaymentDatetime || '')
            }
          />
        </div>
        <div className="div-field">
          <FFButton
            id="RecordPayment_Btn"
            CSSClass="btn_RecordPayment"
            className="RecordPayment_Btn"
            type="button"
            Field={{
              FieldValue: 'Save Payment',
              FieldLabel: 'Save Payment',
              CSSClass: '',
              // Disabled: (state.paymentFields.ModeofPayment === undefined || state.paymentFields.ModeofPayment.trim() === '')
            }}
            onClickHandler={() => dispatch({ type: 'SHOW_POPUP' })}
          />
        </div>
        <div className="div-field">
          <TransferPayment
            sysParentEntityId={sysParentEntityId}
            sysParentEntityType={sysParentEntityType}
            sysListColumnId={sysListColumnId}
          />
        </div>
      </div>
      {mutationPayment.isLoading && mutationTransaction.isLoading ? (
        showLoading(true)
      ) : (
        <div className="Payment_Modal">
          <CRUDModal open={showModal} width="30%">
            <CRUDModal.Header>
              <CRUDModal.Title>Save Payment</CRUDModal.Title>
              <CRUDModal.Close
                onClick={() =>
                  dispatch({
                    type: 'HIDE_POPUP',
                    clear: {
                      paymentFields: initialState.paymentFields,
                      paymentType: initialState.paymentType,
                    },
                  })
                }
              >
                <CloseIcon />
              </CRUDModal.Close>
            </CRUDModal.Header>
            <CRUDModal.Content
              CSSClass={!cashPayment && !chequePayment ? 'payment-Content' : ''}
            >
              {(cashPayment || chequePayment) && (
                <FFTextBox
                  label="Agent ID"
                  Field={{
                    FieldValue: 'AgentId',
                    FieldLabel: 'Agent ID',
                  }}
                  value={state.paymentFields.AgentId || ''}
                  onChangeHandler={onhandleChage}
                />
              )}
              {initialScreenMode && (
                <FFAutocomplete
                  Field={{
                    FieldValue: 'ModeofPayment',
                    DefaultValue: '',
                    FieldLabel: 'Select payment type',
                    Datasource: getPaymentType(),
                    TextField: 'DisplayName',
                    ValueField: 'Name',
                  }}
                  value={state.paymentFields.ModeofPayment || ''}
                  onChangeHandler={onhandleChage}
                />
              )}
              {(cashPayment || chequePayment) && (
                <FFTextBox
                  label="Paid Amount"
                  Field={{
                    FieldValue: 'Amount',
                    FieldLabel: 'Paid Amount',
                  }}
                  value={state.paymentFields.Amount || ''}
                  onChangeHandler={onhandleChage}
                />
              )}
              {chequePayment && (
                <>
                  <FFDatepicker
                    label="Cheque date"
                    Field={{
                      FieldValue: 'ChequeDate',
                      FieldLabel: 'Cheque date',
                    }}
                    variant="filled"
                    onChangeHandler={onhandleChage}
                    value={state.paymentFields.ChequeDate || ''}
                  />

                  <FFTextBox
                    label="Cheque number"
                    Field={{
                      FieldValue: 'ChequeNumber',
                      FieldLabel: 'Cheque number',
                    }}
                    value={state.paymentFields.ChequeNumber || ''}
                    onChangeHandler={onhandleChage}
                  />

                  <FFTextBox
                    label="Account type"
                    Field={{
                      FieldValue: 'AccountType',
                      FieldLabel: 'Account Type',
                    }}
                    value={state.paymentFields.AccountType || ''}
                    onChangeHandler={onhandleChage}
                  />

                  <FFTextBox
                    label="Bank Name"
                    Field={{
                      FieldValue: 'BankName',
                      FieldLabel: 'Bank Name',
                    }}
                    value={state.paymentFields.BankName || ''}
                    onChangeHandler={onhandleChage}
                  />
                </>
              )}
              {(cashPayment || chequePayment) && (
                <>
                  <FFTextBox
                    label="Receipt number"
                    Field={{
                      FieldValue: 'ReceiptNumber',
                      FieldLabel: 'Receipt number',
                    }}
                    value={state.paymentFields.ReceiptNumber || ''}
                    onChangeHandler={onhandleChage}
                  />
                  <FFDatepicker
                    label="Receipt Date"
                    Field={{
                      FieldValue: 'ReceiptDate',
                      FieldLabel: 'Receipt Date',
                    }}
                    variant="filled"
                    onChangeHandler={onhandleChage}
                    value={state.paymentFields.ReceiptDate || ''}
                  />
                </>
              )}
              {(cashPayment || chequePayment) && PaymentAccount.isFetched ? (
                <>
                  <FFAutocomplete
                    Field={{
                      FieldValue: 'FromAccount',
                      DefaultValue: '',
                      FieldLabel: 'Select From Account',
                      Datasource: PaymentAccount?.data,
                      TextField: 'Name',
                      ValueField: 'id',
                    }}
                    value={state.paymentFields.FromAccount || ''}
                    onChangeHandler={onhandleChage}
                  />
                  <FFAutocomplete
                    Field={{
                      FieldValue: 'ToAccount',
                      DefaultValue: '',
                      FieldLabel: 'Select To Account',
                      Datasource: PaymentAccount?.data,
                      TextField: 'Name',
                      ValueField: 'id',
                    }}
                    value={state.paymentFields.ToAccount || ''}
                    onChangeHandler={onhandleChage}
                  />
                </>
              ) : null}
            </CRUDModal.Content>
            <CRUDModal.Footer>
              <FFButton
                variant="contained"
                Field={{
                  FieldValue: 'Save Payment',
                  FieldLabel: `Save Payment`,
                  CSSClass: 'savebutton',
                  Type: 'primary',
                  // Disabled: (state.paymentFields.AgentId )
                }}
                disableRipple
                disableElevation
                className={
                  !cashPayment && !chequePayment
                    ? 'before-addmodal__success'
                    : 'addmodal__success'
                }
                onClickHandler={onSaveClickHandler}
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
                id="AddField_Btn_Close"
                className="AddField_Btn_Close"
                onClickHandler={() =>
                  dispatch({
                    type: 'HIDE_POPUP',
                    clear: {
                      paymentFields: initialState.paymentFields,
                      paymentType: initialState.paymentType,
                    },
                  })
                }
              />
            </CRUDModal.Footer>
          </CRUDModal>
        </div>
      )}
    </>
  )
}
export default Payments
