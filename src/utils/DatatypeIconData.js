import React from 'react'
import PropTypes from 'prop-types'
import {
  LocalAtm,
  InsertDriveFile,
  TextFormat,
  CropOriginal,
  BorderAll,
  List,
  MailOutline,
  Phone,
  Timer,
  Language,
  CalendarToday,
  AccessTime,
  DateRange,
  Attachment,
  Info,
  Edit,
  VisibilityOutlined,
  PersonPinCircle,
  Map,
  Timeline,
} from '@material-ui/icons'

const Componentlist = [
  {
    LocalAtm,
  },
  {
    InsertDriveFile,
  },
  {
    TextFormat,
  },
  { CropOriginal },
  { BorderAll },
  { List },
  { MailOutline },
  { Phone },
  { Timer },
  { Language },
  { CalendarToday },
  { AccessTime },
  { DateRange },
  { Attachment },
  { Info },
  { Edit },
  { VisibilityOutlined },
  { PersonPinCircle },
  { Map },
  { Timeline },
]
const IconData2 = [
  {
    '4820a3dd-9b26-4d4d-944f-7fcb9ec06065': LocalAtm,
    DatatypeName: 'Currency',
    ExpressionType: ['Common'], // , 'String'],
    PropertyType: ['String'],
    ControlType: 'LogicText',
  },
  {
    '4fe2d2bf-f9b7-477f-988b-9ede6fb9d09c': InsertDriveFile,
    DatatypeName: 'File',
    ExpressionType: ['Contains'],
    PropertyType: [],
    ControlType: 'Text',
  },
  {
    '5b53f3d7-9534-483a-956c-66b8371b522b': TextFormat,
    DatatypeName: 'DecimalNumber',
    ExpressionType: ['Common', 'Numeric'],
    PropertyType: ['Math', 'Arithmetic'],
    ControlType: 'Decimal',
  },
  {
    '9e43e04c-de8f-472b-9f16-84d46fab60e3': CropOriginal,
    DatatypeName: 'Image',
    ExpressionType: ['Common', 'Contains'],
    PropertyType: [],
    ControlType: 'Text',
  },
  {
    '67ef0824-8610-4be5-89d1-72da9a8bb953': BorderAll,
    DatatypeName: 'Lookup',
    ExpressionType: ['Common', 'Contains'],
    PropertyType: [],
    ControlType: 'AutoComplete',
  },
  {
    'a595cbad-7ab9-4046-9294-325bc119d848': List,
    DatatypeName: 'MultiOptionSelect',
    ExpressionType: ['Common'],
    PropertyType: [],
    ControlType: 'MultiSelect',
  },
  {
    '4d44a962-078f-4f56-90cd-8838b43097b2': TextFormat,
    DatatypeName: 'MultiLineText',
    ExpressionType: ['Common'], // , 'String'],
    PropertyType: ['String'],
    ControlType: 'LogicText',
  },
  {
    '3e61381a-8931-4d45-9bce-124b6910310d': List,
    DatatypeName: 'OptionSet',
    ExpressionType: ['Common'],
    PropertyType: [],
    ControlType: 'MultiSelect',
  },
  {
    'a1e691af-f84a-4cc6-bc11-b991a613c944': List,
    DatatypeName: 'TwoOptions',
    ExpressionType: ['Common'],
    PropertyType: [],
    ControlType: 'SwitchButton',
  },
  {
    'e2d641a3-979d-4e7a-8e24-7bc47e417925': TextFormat,
    DatatypeName: 'Text',
    ExpressionType: ['Common'], // , 'String'],
    PropertyType: ['String'],
    ControlType: 'LogicText',
  },
  {
    '075869a6-f143-4117-bb6d-a9adfd7783c4': TextFormat,
    DatatypeName: 'URL',
    ExpressionType: ['Common'], // , 'String'],
    PropertyType: ['String'],
    ControlType: 'LogicText',
  },
  {
    'c4a1d022-181a-4f73-a828-cec2943d0c6b': MailOutline,
    DatatypeName: 'eMail',
    ExpressionType: ['Common'], // , 'String'],
    PropertyType: ['String'],
    ControlType: 'LogicText',
  },
  {
    'e396a5ca-02ae-41ab-8c6a-5f57366add5e': Phone,
    DatatypeName: 'Phone',
    ExpressionType: ['Common'], // , 'String'],
    PropertyType: ['String'],
    ControlType: 'LogicNumber',
  },
  {
    'b3b77292-a917-4faa-810e-7c0a645bc44b': TextFormat,
    DatatypeName: 'AutoNumber',
    ExpressionType: ['Common', 'Numeric'],
    PropertyType: ['Arithmetic'],
    ControlType: 'Number',
  },
  {
    'be6a65a0-42dc-44e2-ad67-eae7b08c89ca': Timer,
    DatatypeName: 'Duration',
    ExpressionType: ['Common', 'Numeric'],
    PropertyType: ['DateTime'],
    ControlType: 'Text',
  },
  {
    '105a1af8-a03b-4cb8-98c0-0200a68f0c50': TextFormat,
    DatatypeName: 'WholeNumber',
    ExpressionType: ['Common', 'Numeric'],
    PropertyType: ['Arithmetic'],
    ControlType: 'Number',
  },
  {
    '1d4572a9-d4e3-46d3-9aa4-347e07de74a6': Language,
    DatatypeName: 'Language',
    ExpressionType: ['Common', 'Contains'],
    PropertyType: [],
    ControlType: 'Text',
  },
  {
    '9982cd6a-c317-4a76-ab70-37644c883b21': CalendarToday,
    DatatypeName: 'DateAndTime',
    ExpressionType: ['Common', 'Numeric'],
    PropertyType: ['DateTime'],
    ControlType: 'DateandTime',
  },
  {
    '966c55ca-b0d1-4b84-9c7b-323914de7975': AccessTime,
    DatatypeName: 'Time',
    ExpressionType: ['Common', 'Numeric'],
    PropertyType: ['Time'],
    ControlType: 'Time',
  },
  {
    'c0165fc4-12a6-4fcf-b00f-9ac72ab6440f': DateRange,
    DatatypeName: 'Date',
    ExpressionType: ['Common', 'Numeric'],
    PropertyType: ['Date'],
    ControlType: 'Date',
  },
  {
    'ade660d0-2c83-4b6f-40c5-08d89b66343f': Attachment,
    DatatypeName: 'Attachment',
    ExpressionType: ['Common', 'Contains'],
    PropertyType: [],
    ControlType: 'Text',
  },
  {
    '5e511342-f9f0-4746-a640-3f8cd00799c3': TextFormat,
    DatatypeName: 'GUID',
    ExpressionType: ['Common'], // , 'String'],
    PropertyType: ['String'],
    ControlType: 'LogicText',
  },
  {
    'a9c5c8aa-16c0-48d1-f911-08d8fda71e06': PersonPinCircle,
    DatatypeName: 'Point',
    ExpressionType: ['Common'], // , 'String'],
    ControlType: 'Text',
    PropertyType: ['String'],
    // ControlType: 'LogicText',
  },
  {
    '0fe8ab72-b0e5-49fb-f912-08d8fda71e06': Map,
    DatatypeName: 'Polygon',
    ExpressionType: ['Common'], // , 'String'],
    ControlType: 'Text',
    PropertyType: ['String'],
    // ControlType: 'LogicText',
  },
  {
    'eef33ba4-21ba-43f2-f913-08d8fda71e06': Timeline,
    DatatypeName: 'LineString',
    ExpressionType: ['Common'], // , 'String'],
    ControlType: 'Text',
    PropertyType: ['String'],
    // ControlType: 'LogicText',
  },
]
export const DatatypeIconData = (IconId) => {
  const Icondata = IconData2.find((item) => Object.keys(item)[0] === IconId)
  const Icon = Icondata && Object.values(Icondata)[0]
  return Icon || ''
}
export const findIconData = (Iconname) => {
  const Icondata = Componentlist.find(
    (item) => Object.keys(item)[0] === Iconname
  )
  const Icon = Icondata && Object.values(Icondata)[0]
  return Icon || ''
}
export const MaterialIconAsync = ({ icon, onClickHandler, data }) => {
  return (
    icon &&
    React.createElement(icon, {
      style: { cursor: 'pointer' },
      onClick: (event) => {
        onClickHandler(event, data)
      },
    })
  )
}

export const DatatypeExpressionData = (IconId) => {
  const Expressiondata = IconData2.find(
    (item) => Object.keys(item)[0] === IconId
  )
  // const Expression = Expressiondata && Object.values(Expressiondata)[2]
  return Expressiondata || ''
}

MaterialIconAsync.propTypes = {
  icon: PropTypes.string,
}
MaterialIconAsync.defaultProps = {
  icon: null,
}
export default { DatatypeIconData, MaterialIconAsync, findIconData }
