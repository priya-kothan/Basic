export const ItemsList = {
  dataSource: [
    {
      DisplayName: 'PhoneCall',
      Id: 'Phone Call',
      ShowID: '0',
      EntityField: [
        {
          Label: 'CallDirection',
          FieldValue: 'CallDirection',
          FieldLabel: 'CallDirection',
          FieldType: 'Phone',
          Name: 'CallDirection',
        },
        {
          Label: 'CallTimestamp',
          FieldValue: 'CallTimestamp',
          FieldLabel: 'CallTimestamp',
          FieldType: 'TextBox',
          Name: 'CallTimestamp',
        },
        {
          Label: 'CalledPhoneNo',
          FieldValue: 'CalledPhoneNo',
          FieldLabel: 'CalledPhoneNo',
          FieldType: 'TextBox',
          Name: 'CalledPhoneNo',
        },
        {
          Label: 'CallDuration',
          FieldValue: 'CallDuration',
          FieldLabel: 'CallDuration',
          FieldType: 'TextBox',
          Name: 'CallDuration',
        },

        {
          Label: 'DueDate',
          FieldValue: 'DueDate',
          FieldLabel: 'DueDate',
          FieldType: 'DateAndTime',
          Name: 'DueDate',
        },
        {
          Label: 'AssignedTo',
          FieldValue: 'AssignedTo',
          FieldLabel: 'AssignedTo',
          FieldType: 'TextBox',
          Name: 'AssignedTo',
        },
        {
          Label: 'Description',
          FieldValue: 'Description',
          FieldLabel: 'Description',
          FieldType: 'MultiLineText',
          Name: 'Description',
        },
      ],
    },
    {
      DisplayName: 'Letter',
      Id: 'Letter',
      ShowID: '1',
      EntityField: [
        {
          Name: 'PostalMethod',
          Label: 'PostalMethod',
          FieldValue: 'PostalMethod',
          FieldLabel: 'PostalMethod',
          FieldType: 'TextBox',
        },
        {
          Name: 'SubjectLine',
          Label: 'SubjectLine',
          FieldValue: 'SubjectLine',
          FieldLabel: 'SubjectLine',
          FieldType: 'TextBox',
        },

        {
          Label: 'DueDate',
          FieldValue: 'DueDate',
          FieldLabel: 'DueDate',
          FieldType: 'DateAndTime',
          Name: 'DueDate',
        },
        {
          Label: 'AssignedTo',
          FieldValue: 'AssignedTo',
          FieldLabel: 'AssignedTo',
          FieldType: 'TextBox',
          Name: 'AssignedTo',
        },
        {
          Name: 'PostedAddress',
          Label: 'PostedAddress',
          FieldValue: 'PostedAddress',
          FieldLabel: 'PostedAddress',
          FieldType: 'TextBox',
        },
        {
          Label: 'Description',
          FieldValue: 'Description',
          FieldLabel: 'Description',
          FieldType: 'MultiLineText',
          Name: 'Description',
        },
      ],
    },
    {
      DisplayName: 'Email',
      Id: 'Email',
      ShowID: '2',
      EntityField: [
        {
          Name: 'EmailTo',

          Label: 'EmailTo',
          FieldValue: 'EmailTo',
          FieldLabel: 'EmailTo',
          FieldType: 'eMail',
        },
        {
          Name: 'EmailCc',

          Label: 'EmailCc',
          FieldValue: 'EmailCc',
          FieldLabel: 'EmailCc',
          FieldType: 'eMail',
        },
        {
          Name: 'EmailDateTime',

          Label: 'EmailDateTime',
          FieldValue: 'EmailDateTime',
          FieldLabel: 'EmailDateTime',
          FieldType: 'TextBox',
        },
        {
          Name: 'SubjectLine',

          Label: 'SubjectLine',
          FieldValue: 'SubjectLine',
          FieldLabel: 'SubjectLine',
          FieldType: 'TextBox',
        },
        {
          Label: 'DueDate',
          FieldValue: 'DueDate',
          FieldLabel: 'DueDate',
          FieldType: 'DateAndTime',
          Name: 'DueDate',
        },
        {
          Label: 'AssignedTo',
          FieldValue: 'AssignedTo',
          FieldLabel: 'AssignedTo',
          FieldType: 'TextBox',
          Name: 'AssignedTo',
        },
        {
          Label: 'Description',
          FieldValue: 'Description',
          FieldLabel: 'Description',
          FieldType: 'MultiLineText',
          Name: 'Description',
        },
      ],
    },

    {
      DisplayName: 'Task',
      Id: 'Task',
      ShowID: '3',
      EntityField: [
        {
          Name: 'TaskTimestamp',
          Label: 'TaskTimestamp',
          FieldValue: 'TaskTimestamp',
          FieldLabel: 'TaskTimestamp',
          FieldType: 'TextBox',
        },
        {
          Label: 'DueDate',
          FieldValue: 'DueDate',
          FieldLabel: 'DueDate',
          FieldType: 'DateAndTime',
          Name: 'DueDate',
        },
        //   {
        //
        //       Label: 'Assigned to',
        //       FieldValue: 'AssignedTo',
        //       FieldLabel: 'AssignedTo',
        //       FieldType: 'TextBox',
        //     },
        //   },
        {
          Label: 'Description',
          FieldValue: 'Description',
          FieldLabel: 'Description',
          FieldType: 'MultiLineText',
          Name: 'Description',
        },
      ],
    },

    {
      DisplayName: 'Notes',
      Id: 'Notes',
      ShowID: '4',
      EntityField: [
        {
          Label: 'Description',
          FieldValue: 'Description',
          FieldLabel: 'Description',
          FieldType: 'MultiLineText',
          Name: 'Description',
        },
      ],
    },
  ],
}
