import React from 'react'

import FFTextBox from '../../FFTextBox/FFTextBox'
import FFMultilineTextbox from '../../FFMultilineTextbox/FFMultilineTextbox'
import './EntityGridForm.css'

const EntityGridForm = () => {
  return (
    <div className="entitygrid-form">
      <FFTextBox
        name="Name"
        label="Name"
        className="entitygrid-form__name"
        Field={{
          FieldValue: 'Name',
          FieldLabel: 'Name',
          Validation: { IsRequired: 'False' },
        }}
      />
      <FFMultilineTextbox
        name="Description"
        label="Description"
        className="entitygrid-form__description"
        Field={{
          FieldValue: 'Description',
          FieldLabel: 'Description',
          Rows: '3',
          Variant: 'outlined',
          Placeholder: '',
          Validation: {
            IsRequired: 'False',
            ValidationCondition: '',
          },
        }}
      />
    </div>
  )
}

export default EntityGridForm
