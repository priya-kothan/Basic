const APIEndPoints = {
  GetEntityFieldDataType: {
    url: '/api/EntityFieldDataType',
    method: 'get',
    methodname: 'EntityFieldDataType',
  },
  GetEntity: {
    url: '/api/Entity',
    method: 'get',
    methodname: 'Entity',
  },
  GetEntityOrderby: {
    url: '/api/Entity?$orderby=Name',
    method: 'get',
    methodname: 'Entity',
  },
  PostEntity: {
    url: '/api/Entity',
    method: 'post',
    methodname: 'Entity Post',
  },
  PutEntity: {
    url: '/api/Entity',
    method: 'put',
    methodname: 'Entity Put',
  },
  DeleteEntity: {
    url: '/api/Entity',
    method: 'delete',
    methodname: 'Entity Delete',
  },
  GetOptionSet: {
    url: '/api/OptionSet?$expand=EntityFieldDataType',
    method: 'get',
    methodname: 'OptionSet',
  },
  GetOptionSetList: {
    url: '/api/OptionSet',
    method: 'get',
    methodname: 'OptionSet',
  },
  GetEntityField: {
    url: '/api/EntityField?$expand=EntityFieldDataType,EntityFieldRequired,OptionSet&$filter=EntityId eq ',
    method: 'get',
    methodname: 'EntityField',
  },
  InsertEntityField: {
    url: '/api/EntityField',
    method: 'post',
    methodname: 'EntityField',
  },
  InsertOptionSet: {
    url: '/api/OptionSet',
    method: 'post',
    methodname: 'InsertOptionSet',
  },
  InsertOptionSetOptions: {
    url: '/api/OptionSetOptions',
    method: 'post',
    methodname: 'InsertOptionSetOptions',
  },

  UpdateOptionSet: {
    url: '/api/OptionSet',
    method: 'put',
    methodname: 'UpdateOptionSet',
  },
  UpdateOptionSetOptions: {
    url: '/api/OptionSetOptions',
    method: 'put',
    methodname: 'UpdateOptionSetOptions',
  },

  DeleteOptionSet: {
    url: '/api/OptionSet',
    method: 'delete',
    methodname: 'DeleteOptionSet',
  },

  DeleteOptionSetOptions: {
    url: '/api/OptionSetOptions',
    method: 'delete',
    methodname: 'DeleteOptionSetOptions',
  },

  InsertBulkOptionSetOptions: {
    url: '/api/OptionSetOptions/InsertBulkData',
    method: 'post',
    methodname: 'InsertBulkOptionSetOptions',
  },

  DeleteBulkDataOptionSetOptions: {
    url: '/api/OptionSetoptions/DeleteBulkData',
    method: 'delete',
    methodname: 'DeleteBulkDataOptionSetOptions',
  },
  GetEntityFieldRequired: {
    url: '/api/EntityFieldRequired',
    method: 'get',
    methodname: 'EntityFieldRequired',
  },
  GetEntityFields: {
    url: '/api/EntityField',
    method: 'get',
  },
  DeleteEntityField: {
    url: '/api/EntityField',
    method: 'Delete',
    methodname: 'EntityField',
  },
  UpdateEntityField: {
    url: '/api/EntityField',
    method: 'put',
    methodname: 'EntityField',
  },
  GetEntityFieldOptionset: {
    url: '/api/OptionSet',
    method: 'get',
    methodname: 'OptionSet',
  },
  GetSysList: {
    url: '/api/List',
    method: 'get',
    methodname: 'SysList',
  },
  GetSysListColumn: {
    url: '/api/ListColumn',
    method: 'get',
  },
  CreateSysListColumn: {
    url: '/api/ListColumn',
    method: 'post',
  },

  GetMenuItem: {
    url: '/api/MenuItem',
    method: 'get',
    methodname: 'MenuItem',
  },

  GetSysForm: {
    url: '/api/Form',
    method: 'get',
  },
  GetinputEntityField: {
    url: 'api/Entity',
    method: 'get',
    methodname: 'EntityField',
  },
  GetSysForms: {
    url: 'api/Form',
    method: 'get',
  },
  GetActivityType: {
    url: '/api/OptionSet',
    method: 'get',
    methodname: 'sysMenuItem',
  },
  PostActivity: {
    url: '/api/Activity',
    method: 'Post',
    methodname: 'sysMenuItem',
  },
  PostAttachment: {
    url: 'api/Attachment',
    method: 'Post',
    methodname: '',
  },
  GetTimeline: {
    url: '/api/Timeline',
    method: 'get',
    methodname: 'GetTimeline',
  },
  UpdateUser: {
    url: '/api/Entity/UpdateUser',
    method: 'patch',
  },
  GetsysCorrespondence: {
    url: 'api/CorrespondenceTemplate',
    method: 'get',
    methodname: 'sysCorrespondenceTemplate',
  },
  InitiatePayment: {
    url: 'api/Payment/InitiatePayment',
    method: 'Post',
    methodname: 'InitiatePayment',
  },
  UpdatePayment: {
    url: 'api/Payment/UpdatePayment',
    method: 'Post',
    methodname: 'UpdatePayment',
  },
  GetSysURLCapability: {
    url: 'api/URLCapability',
    method: 'get',
  },
  PostPaymentTransfer: {
    url: 'api/Payment/TransferPayment',
    method: 'Post',
  },
  JsonToODataQuery: {
    url: 'api/Conversion/JsonToODataQuery',
    method: 'Post',
  },
  GetSysFormById: {
    url: 'api/GetSysFormById',
    method: 'Post',
    methodname: 'GetSysFormById',
  },
  SearchBarQuery: {
    url: 'api/Search',
    method: 'get',
  },
  PaymentAccount: {
    url: 'api/PaymentAccount',
    method: 'get',
  },

  GetAllEntityField: {
    url: 'api/EntityField',
    method: 'get',
    methodname: 'EntityField',
  },

  UserFavourites: {
    url: 'api/UserFavourites',
    method: 'post',
    methodname: 'UserFavourites',
  },

  User: {
    url: 'api/User',
    method: 'get',
    methodname: 'User',
  },
  AppResource: {
    url: '/api/AppResource',
    method: 'get',
  },

  Branding: {
    url: '/api/Branding',
    method: 'get',
  },
  GetUserFavourites: {
    url: '/api/userFavourites',
    method: 'get',
    methodname: 'userFavourites',
  },
  DeleteUserFavourites: {
    url: '/api/UserFavourites',
    method: 'delete',
    methodname: 'UserFavourites Delete',
  },
}

export default APIEndPoints
