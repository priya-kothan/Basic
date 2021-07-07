import React from 'react'

import FFTextBox from '../views/components/base/FFTextBox/FFTextBox'
import FFSwitch from '../views/components/base/FFSwitch/FFSwitch'
import FFDropdown from '../views/components/base/FFDropdown/FFDropdown'
import FFAutocomplete from '../views/components/base/FFAutocomplete/FFAutocomplete'
import FFDatePicker from '../views/components/base/FFDatePicker/FFDatepicker'
import FFDateTimepicker from '../views/components/base/FFDateTimepicker/FFDateTimepicker'
import ActionButton from '../views/components/base/ActionButton/ActionButton'
import FreeflowLogo from '../views/components/custom/Branding/FreeflowLogo/FreeflowLogo'
import WestMinsterLogo from '../views/components/custom/Branding/WestMinsterLogo/WestMinsterLogo'
import ReadingLogo from '../views/components/custom/Branding/ReadingLogo/ReadingLogo'
import WirralLogo from '../views/components/custom/Branding/WirralLogo/WirralLogo'
import SearchBar from '../views/components/custom/SearchBar/SearchBar'

import ExcelImage from '../assets/DefaultIcons/Excel.png'
import FileImage from '../assets/DefaultIcons/File.png'
import MusicImage from '../assets/DefaultIcons/Music.png'
import PdfImage from '../assets/DefaultIcons/Pdf.png'
import VideoImage from '../assets/DefaultIcons/Video.png'
import WordImage from '../assets/DefaultIcons/Word.png'
import ZipImage from '../assets/DefaultIcons/Zip.png'

const componentLookUp = {
  ActionButton: {
    componentName: 'ActionButton',
    componentPath: 'base/ActionButton/ActionButton',
    component: ActionButton,
  },
  Checkbox: {
    componentName: 'Checkbox',
    componentPath: 'base/FFCheckbox/FFCheckbox',
  },
  Textbox: {
    componentName: 'Textbox',
    componentPath: 'base/FFTextBox/FFTextBox',
  },
  Switch: {
    componentName: 'Switch',
    componentPath: 'custom/Switch/SwitchButton',
  },
  Text: {
    componentName: 'Textbox',
    componentPath: 'base/FFTextBox/FFTextBox',
    component: FFTextBox,
  },
  TwoOptions: {
    componentName: 'Switch',
    componentPath: 'base/FFSwitch/FFSwitch',
    component: FFSwitch,
  },
  Dropdown: {
    componentName: 'Dropdown',
    componentPath: 'base/FFDropdown/FFDropdown',
    component: FFDropdown,
  },
  TextBox: 'base/FFTextBox/FFTextBox',
  DateAndTime: {
    componentName: 'DateAndTime',
    componentPath: 'base/FFDatePicker/FFDatePicker',
    component: FFDateTimepicker,
  },
  MultiLineText: 'base/FFMultilineTextbox/FFMultilineTextbox',
  Select: 'base/FFSelect/FFSelect',
  Phone: 'base/FFTextBox/FFTextBox',
  eMail: 'base/FFTextBox/FFTextBox',
  DropZone: 'base/FFTextBox/FFTextBox',
  WholeNumber: 'base/FFTextBox/FFTextBox',
  Lookup: {
    componentName: 'Autocomplete',
    componentPath: 'base/FFAutocomplete/FFAutocomplete',
    component: FFAutocomplete,
  },
  OptionSet: {
    componentName: 'Dropdown',
    componentPath: 'base/FFDropdown/FFDropdown',
    component: FFDropdown,
  },
  Duration: 'base/FFTextBox/FFTextBox',
  Date: {
    componentName: 'DatePicker',
    componentPath: 'base/FFDatePicker/FFDatePicker',
    component: FFDatePicker,
  },
  northhertsLogo: {
    componentName: 'Dropdown',
    componentPath: 'base/FFDropdown/FFDropdown',
    component: FreeflowLogo,
  },
  westminsterLogo: {
    componentName: 'Dropdown',
    componentPath: 'base/FFDropdown/FFDropdown',
    component: WestMinsterLogo,
  },
  readingLogo: {
    componentName: 'Dropdown',
    componentPath: 'base/FFDropdown/FFDropdown',
    component: ReadingLogo,
  },
  wirralLogo: {
    componentName: 'Dropdown',
    componentPath: 'base/FFDropdown/FFDropdown',
    component: WirralLogo,
  },
  SearchBar: {
    componentName: 'SearchBar',
    componentPath: 'custom/SearchBar/SearchBar',
    component: SearchBar,
  },
  ExcelImage: {
    componentName: 'ExcelImage',
    componentPath: '',
    component: (
      <img src={ExcelImage} alt="Excel" className="FileViewType-image" />
    ),
  },
  MusicImage: {
    componentName: 'MusicImage',
    componentPath: '',
    component: (
      <img src={MusicImage} alt="Music" className="FileViewType-image" />
    ),
  },
  PdfImage: {
    componentName: 'PdfImage',
    componentPath: '',
    component: <img src={PdfImage} alt="Pdf" className="FileViewType-image" />,
  },
  VideoImage: {
    componentName: 'VideoImage',
    componentPath: '',
    component: (
      <img src={VideoImage} alt="Video" className="FileViewType-image" />
    ),
  },
  WordImage: {
    componentName: 'WordImage',
    componentPath: '',
    component: (
      <img src={WordImage} alt="Word" className="FileViewType-image" />
    ),
  },
  ZipImage: {
    componentName: 'ZipImage',
    componentPath: '',
    component: <img src={ZipImage} alt="Zip" className="FileViewType-image" />,
  },
  FileImage: {
    componentName: 'FileImage',
    componentPath: '',
    component: (
      <img src={FileImage} alt="File" className="FileViewType-image" />
    ),
  },
}

export default componentLookUp
