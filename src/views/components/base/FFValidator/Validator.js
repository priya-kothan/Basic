import './Validator.css'

const validator = {
  isTitle: function isTitle(Title) {
    const regex = /^[a-zA-Z]+$/
    if (Title === '') {
      return 'Title is a mandatory please enter the value'
    }
    if (!regex.test(Title)) {
      return 'Title must contain only alphabets characters'
    }
    if (Title.length < 2) {
      return 'Title must be longer than two characters'
    }
    return ''
  },

  isFirstName: function isFirstName(FirstName) {
    const regex = /\S/
    if (FirstName === '') {
      return 'FirstName is a mandatory please enter the value'
    }
    if (!regex.test(FirstName)) {
      return 'FirstName must contain only alphabets characters'
    }
    if (FirstName.length < 2) {
      return 'FirstName must be longer than two characters'
    }
    return ''
  },
  isLastName: function isLastName(LastName) {
    const regex = /\S/

    if (LastName === '') {
      return 'LastName is a mandatory please enter the value'
    }
    if (!regex.test(LastName)) {
      return 'LastName must contain only alphabets characters'
    }
    if (LastName.length < 2) {
      return 'LastName must be longer than two characters'
    }
    return ''
  },
  isAddressLine1: function isAddressLine1(AddressLine1) {
    const regex = /\S/

    if (AddressLine1 === '') {
      return 'AddressLine1 is a mandatory please enter the value'
    }
    if (!regex.test(AddressLine1)) {
      return 'AddressLine1 must contain only alphabets-numeric characters'
    }
    if (AddressLine1.length < 2) {
      return 'AddressLine1 must be longer than two characters'
    }
    return ''
  },
  isAddressLine2: function isAddressLine2(AddressLine2) {
    const regex = /\S/

    if (AddressLine2 === '') {
      return 'AddressLine2 is a mandatory please enter the value'
    }
    if (!regex.test(AddressLine2)) {
      return 'AddressLine2 must contain only alphabets-numeric characters'
    }
    if (AddressLine2.length < 2) {
      return 'AddressLine2 must be longer than two characters'
    }
    return ''
  },

  isAddNotes: function isAddNotes(Notes) {
    const regex = /\S/

    if (Notes === '') {
      return 'Notes is a mandatory please enter the value'
    }
    if (!regex.test(Notes)) {
      return 'Notes must contain only alphabets-numeric characters'
    }
    if (Notes.length < 2) {
      return 'Notes must be longer than two characters'
    }
    return ''
  },

  isEmail: function isEmail(email) {
    const regex = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/

    if (email === '') {
      return 'EmailAddress is a mandatory please enter the value'
    }
    if (!regex.test(email)) {
      return 'Enter Valid EmailAddress'
    }
    if (email.length < 2) {
      return 'EmailAddress must be longer than two characters'
    }
    return ''
  },
  isPhonenumber: function isPhonenumber(Phonenumber) {
    const regex = /^[0-9]+$/
    if (Phonenumber === '') {
      return 'Phonenumber is a mandatory please enter the value'
    }
    if (!regex.test(Phonenumber)) {
      return 'PhoneNumber must contain only Numeric characters'
    }
    if (Phonenumber.length < 10) {
      return 'PhoneNumber must be Ten characters'
    }
    return ''
  },

  isPostcode: function isPostcode(Postcode) {
    const regex = /^[a-zA-Z0-9_]+$/
    if (Postcode === '') {
      return 'Postcode is a mandatory please enter the value'
    }
    if (!regex.test(Postcode)) {
      return 'PostCode must contain only alphabets-numeric characters'
    }
    if (Postcode.length < 5) {
      return 'PostCode must be longer than five characters'
    }
    return ''
  },

  istowncity: function istowncity(towncity) {
    // var regex = /\S/
    if (towncity === 'All') {
      return 'Please Select any one options'
    }
    if (towncity.length < 2) {
      return 'Notes must be longer than two characters'
    }
    return ''
  },
  isPrimaryAddress: function isPrimaryAddress(PrimaryAddress) {
    if (PrimaryAddress === false) {
      return 'Mark at least one address as Primary'
    }
    return ''
  },
  isTabLayout: function isTabLayout(tablayout) {
    if (tablayout.length > 1) {
      return 'Layout must be one characters'
    }
    if (tablayout.length <= 0) {
      return 'Layout must be one characters'
    }
    if (parseInt(tablayout, 10) === 0) {
      return 'Layout must be greater than value zero'
    }
    if (parseInt(tablayout, 10) > 3) {
      return 'Layout must be Less and equal to three'
    }
    return ''
  },
  isSectionLayout: function isSectionLayout(sectionlayout) {
    if (sectionlayout.length > 1) {
      return 'Layout must be one characters'
    }
    if (sectionlayout.length <= 0) {
      return 'Layout must be one characters'
    }
    if (parseInt(sectionlayout, 10) === 0) {
      return 'Layout must be greater than value zero'
    }
    if (parseInt(sectionlayout, 10) > 4) {
      return 'Layout must be Less and equal to four'
    }
    return ''
  },
  isColumn: function isColumn(column) {
    if (column.length <= 0) {
      return 'Column must be one characters'
    }
    if (column.length > 3) {
      return 'Column must be not longer than three characters'
    }
    return ''
  },
}

function getValidator(Fieldtype) {
  return validator[Fieldtype]
}

export default getValidator
