export const initialData = {
  header: {
    Properties: {
      HeaderName: 'New Form Name',
      Subtitle: 'New SubTitle Form Name',
    },
  },
  tabs: [
    {
      id: 1,
      Properties: {
        Name: 'Tab',
        DisplayName: 'Tab',
        Displayindex: 2,
        ExpandTabDafault: '',
        Hide: false,
        HidePhone: false,
        Layout: '1',
        Column1Width: '100',
        Column2Width: '100',
        Column3Width: '100',
      },
      columns: [
        {
          id: 'Column1',
          Properties: {
            Name: 'Column',
            DisplayName: 'Column',
            Width: 100,
            Hide: false,
            HideLabel: false,
            HidePhone: false,
            Lock: false,
          },
          sections: [
            {
              id: ' section1',
              Properties: {
                Name: 'Section',
                DisplayName: 'Section',
                Layout: '1',
                SectionColumn1Width: '100',
                SectionColumn2Width: '100',
                SectionColumn3Width: '100',
                SectionColumn4Width: '100',
              },
              sectionColumns: [
                {
                  id: 'SectionColumn1',
                  Properties: {
                    Name: 'SectionColumn',
                    DisplayName: 'SectionColumn',
                    Width: 100,
                  },
                  elements: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  currentTab: {
    id: 1,
    Properties: {
      Name: 'Tab',
      DisplayName: 'Tab',
      Displayindex: 2,
      ExpandTabDafault: '',
      Hide: false,
      HidePhone: false,
      Layout: '1',
      Column1Width: '100',
      Column2Width: '100',
      Column3Width: '100',
    },
    columns: [
      {
        id: 'Column1',
        Properties: {
          Name: 'Column',
          DisplayName: 'Column',
          Width: 100,
          Hide: false,
          HideLabel: false,
          HidePhone: false,
          Lock: false,
        },
        sections: [
          {
            id: ' Section1',
            Properties: {
              Name: 'Section',
              DisplayName: 'Section',
              Layout: '1',
              SectionColumn1Width: '100',
              SectionColumn2Width: '100',
              SectionColumn3Width: '100',
              SectionColumn4Width: '100',
            },
            sectionColumns: [
              {
                id: 'sectionColumn1',
                Properties: {
                  Name: 'sectionColumn',
                  DisplayName: 'sectionColumn',
                  Width: 100,
                },
                elements: [],
              },
            ],
          },
        ],
      },
    ],
  },
}

export const PropertiesPanelDataTablist = {
  tabs: [
    {
      Id: 'Properties',
      TabTitle: 'Properties',
      Sections: [
        {
          SectionTitle: 'Display Options',
          Fields: [
            {
              FieldName: 'DisplayName',
              FieldValue: '',
              FieldLabel: 'Label',
              Placeholder: 'Label',
              FieldType: 'Textbox',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: '',
              },
            },
            // {
            //   FieldName: 'Name',
            //   FieldValue: '',
            //   FieldLabel: 'Name',
            //   FieldType: 'Textbox',
            //   Placeholder: 'Name',
            //   Validation: {
            //     IsRequired: 'False',
            //     ValidationCondition: '',
            //   },
            // },
            {
              FieldName: 'ExpandTabDafault',
              FieldValue: false,
              FieldLabel: 'Expand this tab by Dafault',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'Hide',
              FieldValue: false,
              FieldLabel: 'Hide',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },

            {
              FieldName: 'HidePhone',
              FieldValue: false,
              FieldLabel: 'Hide only on Phone',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
          ],
        },
        {
          SectionTitle: 'Formatting',
          Fields: [
            {
              FieldName: 'Layout',
              FieldValue: '',
              FieldLabel: 'Layout :',
              Placeholder: '1 Column',
              FieldType: 'Textbox',
              Type: 'number',
              Validation: {
                IsRequired: 'True',
                ValidationText: '',
                ValidationCondition: 'isTabLayout',
              },
            },
            {
              FieldName: 'Column1Width',
              FieldValue: '',
              FieldLabel: 'Column 1 Width:',
              Placeholder: '25%',
              FieldType: 'Textbox',
              Type: 'number',
              Validation: {
                IsRequired: 'True',
                ValidationText: '',
                ValidationCondition: 'isColumn',
              },
            },
            {
              FieldName: 'Column2Width',
              FieldValue: '',
              FieldLabel: 'Column 2 Width :',
              Placeholder: '50%',
              FieldType: 'Textbox',
              Type: 'number',
              Validation: {
                IsRequired: 'True',
                ValidationText: '',
                ValidationCondition: 'isColumn',
              },
            },
            {
              FieldName: 'Column3Width',
              FieldValue: '',
              FieldLabel: 'Column 3 Width :',
              Placeholder: '25%',
              FieldType: 'Textbox',
              Type: 'number',
              Validation: {
                IsRequired: 'True',
                ValidationText: '',
                ValidationCondition: 'isColumn',
              },
            },
          ],
        },
      ],
    },
    { Id: 'Events', TabTitle: 'Events', Sections: [] },
  ],
}

export const PropertiesPanelDataColumnlist = {
  tabs: [
    {
      Id: 'Properties',
      TabTitle: 'Properties',
      Sections: [
        {
          SectionTitle: 'Display Options',
          Fields: [
            {
              FieldName: 'DisplayName',
              FieldValue: '',
              FieldLabel: 'Label :',
              Placeholder: 'Label',
              FieldType: 'Textbox',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: '',
              },
            },
            // {
            //   FieldName: 'Name',
            //   FieldValue: '',
            //   FieldLabel: 'Name :',
            //   Placeholder: 'Name',
            //   FieldType: 'Textbox',
            //   Validation: {
            //     IsRequired: 'False',
            //     ValidationCondition: '',
            //   },
            // },
            {
              FieldName: 'Hide',
              FieldValue: false,
              FieldLabel: 'Hide :',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'HideLabel',
              FieldValue: false,
              FieldLabel: 'Hide Label :',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },

            {
              FieldName: 'HidePhone',
              FieldValue: false,
              FieldLabel: 'Hide only on Phone :',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'Lock',
              FieldValue: false,
              FieldLabel: 'Lock :',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
          ],
        },
        {
          SectionTitle: 'Formatting',
          Fields: [
            {
              FieldName: 'Width',
              FieldValue: '',
              FieldLabel: 'Column Width :',
              Placeholder: '25%',
              FieldType: 'Textbox',
              Type: 'number',
              Validation: {
                IsRequired: 'True',
                ValidationText: '',
                ValidationCondition: 'isColumn',
              },
            },
          ],
        },
      ],
    },
    { Id: 'Events', TabTitle: 'Events', Sections: [] },
  ],
}

export const PropertiesPanelDataSectionlist = {
  tabs: [
    {
      Id: 'Properties',
      TabTitle: 'Properties',
      Sections: [
        {
          SectionTitle: 'Display Options',
          Fields: [
            {
              FieldName: 'DisplayName',
              FieldValue: '',
              FieldLabel: 'Label :',
              Placeholder: 'Label',
              FieldType: 'Textbox',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: '',
              },
            },
            // {
            //   FieldName: 'Name',
            //   FieldValue: '',
            //   FieldLabel: 'Name',
            //   FieldType: 'Textbox',
            //   Placeholder: 'Name',
            //   Validation: {
            //     IsRequired: 'False',
            //     ValidationCondition: '',
            //   },
            // },
            {
              FieldName: 'Hide',
              FieldValue: false,
              FieldLabel: 'Hide',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'HidePhone',
              FieldValue: false,
              FieldLabel: 'Hide only on Phone',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
          ],
        },
        {
          SectionTitle: 'Formatting',
          Fields: [
            {
              FieldName: 'Layout',
              FieldValue: '',
              FieldLabel: 'Layout :',
              Placeholder: '1 Section',
              FieldType: 'Textbox',
              Type: 'number',
              Validation: {
                IsRequired: 'True',
                ValidationText: '',
                ValidationCondition: 'isSectionLayout',
              },
            },
            {
              FieldName: 'SectionColumn1Width',
              FieldValue: '',
              FieldLabel: 'Column 1 Width:',
              Placeholder: '25%',
              FieldType: 'Textbox',
              Type: 'number',
              Validation: {
                IsRequired: 'True',
                ValidationText: '',
                ValidationCondition: 'isColumn',
              },
            },
            {
              FieldName: 'SectionColumn2Width',
              FieldValue: '',
              FieldLabel: 'Column 2 Width :',
              Placeholder: '50%',
              FieldType: 'Textbox',
              Type: 'number',
              Validation: {
                IsRequired: 'True',
                ValidationText: '',
                ValidationCondition: 'isColumn',
              },
            },
            {
              FieldName: 'SectionColumn3Width',
              FieldValue: '',
              FieldLabel: 'Column 3 Width :',
              Placeholder: '25%',
              FieldType: 'Textbox',
              Type: 'number',
              Validation: {
                IsRequired: 'True',
                ValidationText: '',
                ValidationCondition: 'isColumn',
              },
            },
            {
              FieldName: 'SectionColumn4Width',
              FieldValue: '',
              FieldLabel: 'Column 4 Width :',
              Placeholder: '25%',
              FieldType: 'Textbox',
              Type: 'number',
              Validation: {
                IsRequired: 'True',
                ValidationText: '',
                ValidationCondition: 'isColumn',
              },
            },
          ],
        },
      ],
    },
    { Id: 'Events', TabTitle: 'Events', Sections: [] },
  ],
}

export const PropertiesPanelDataElementlist = {
  tabs: [
    {
      Id: 'Properties',
      TabTitle: 'Properties',
      Sections: [
        {
          SectionTitle: 'Display Options',
          Fields: [
            {
              FieldName: 'DisplayName',
              FieldValue: '',
              FieldLabel: 'Label :',
              Placeholder: 'Label',
              FieldType: 'Textbox',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: '',
              },
            },
            // {
            //   FieldName: 'Name',
            //   FieldValue: '',
            //   FieldLabel: 'Name :',
            //   Placeholder: 'Name',
            //   FieldType: 'Textbox',
            //   Validation: {
            //     IsRequired: 'False',
            //     ValidationCondition: '',
            //   },
            // },
            {
              FieldName: 'Datatype',
              FieldValue: '',
              FieldLabel: 'Datatype :',
              Placeholder: 'Datatype',
              FieldType: 'Textbox',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: 'isColumn',
              },
            },

            {
              FieldName: 'Hide',
              FieldValue: false,
              FieldLabel: 'Hide :',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'HideLabel',
              FieldValue: false,
              FieldLabel: 'Hide Label :',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },

            {
              FieldName: 'HidePhone',
              FieldValue: false,
              FieldLabel: 'Hide only on Phone :',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'Lock',
              FieldValue: false,
              FieldLabel: 'Lock :',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'Entity',
              FieldValue: '',
              FieldLabel: 'Entity :',
              Placeholder: 'Entity',
              FieldType: 'Label',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: '',
              },
            },
          ],
        },
        {
          SectionTitle: 'Formatting',
          Fields: [
            {
              FieldName: 'Width',
              FieldValue: '',
              FieldLabel: 'Element Width :',
              FieldType: 'Textbox',
              Type: 'number',
              Placeholder: '20%',
              Validation: {
                IsRequired: 'True',
                ValidationText: '',
                ValidationCondition: 'isColumn',
              },
            },
          ],
        },
      ],
    },
    { Id: 'Events', TabTitle: 'Events', Sections: [] },
  ],
}

export const PropertiesPanelDataHeaderlist = {
  tabs: [
    {
      Id: 'Properties',
      TabTitle: 'Properties',
      Sections: [
        {
          SectionTitle: 'Display Options',
          Fields: [
            {
              FieldName: 'HeaderName',
              FieldValue: '',
              FieldLabel: 'HeaderName :',
              Placeholder: 'HeaderName',
              FieldType: 'Textbox',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: '',
              },
            },
          ],
        },
      ],
    },
    { Id: 'Events', TabTitle: 'Events', Sections: [] },
  ],
}

export const PropertiesPanelDataGridlist = {
  tabs: [
    {
      Id: 'Properties',
      TabTitle: 'Properties',
      Sections: [
        {
          SectionTitle: 'Display Options',
          Fields: [
            {
              FieldName: 'DisplayName',
              FieldValue: '',
              FieldLabel: 'Label :',
              Placeholder: 'Label',
              FieldType: 'Textbox',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: '',
              },
            },
            // {
            //   FieldName: 'Name',
            //   FieldValue: '',
            //   FieldLabel: 'Name',
            //   FieldType: 'Textbox',
            //   Placeholder: 'Name',
            //   Validation: {
            //     IsRequired: 'False',
            //     ValidationCondition: '',
            //   },
            // },
            {
              FieldName: 'Hide',
              FieldValue: false,
              FieldLabel: 'Hide',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'HidePhone',
              FieldValue: false,
              FieldLabel: 'Hide only on Phone',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'ListName',
              FieldValue: 'ListName',
              FieldLabel: 'ListName',
              FieldType: 'Dropdown',
              Placeholder: 'ListName',
              Variant: 'outlined',
              DefaultValue: '',
              Datasource: [
                { Name: 'Activity', Id: 'Activity', disabled: false },
                { Name: 'Payment', Id: 'Payment', disabled: false },
                { Name: 'Attachment', Id: 'Attachment', disabled: false },
              ],
              TextField: 'Name',
              ValueField: 'Id',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: '',
              },
            },
            {
              FieldName: 'ListId',
              FieldValue: 'ListId',
              FieldLabel: 'ListId',
              FieldType: 'Dropdown',
              Placeholder: 'ListName',
              Variant: 'outlined',
              DefaultValue: '',
              Datasource: [],
              TextField: 'Name',
              ValueField: 'Id',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: '',
              },
            },
          ],
        },
      ],
    },
    { Id: 'Events', TabTitle: 'Events', Sections: [] },
  ],
}

export const PropertiesPanelDataTimelinelist = {
  tabs: [
    {
      Id: 'Properties',
      TabTitle: 'Properties',
      Sections: [
        {
          SectionTitle: 'Display Options',
          Fields: [
            {
              FieldName: 'DisplayName',
              FieldValue: '',
              FieldLabel: 'Label :',
              Placeholder: 'Label',
              FieldType: 'Textbox',
              Validation: {
                IsRequired: 'true',
                ValidationText: '',
                // ValidationCondition: 'isTitle',
              },
            },
            // {
            //   FieldName: 'Name',
            //   FieldValue: '',
            //   FieldLabel: 'Name',
            //   FieldType: 'Textbox',
            //   Placeholder: 'Name',
            //   Validation: {
            //     IsRequired: 'False',
            //     ValidationCondition: '',
            //   },
            // },
            {
              FieldName: 'Hide',
              FieldValue: false,
              FieldLabel: 'Hide',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'HidePhone',
              FieldValue: false,
              FieldLabel: 'Hide only on Phone',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'ShowUpComing',
              FieldValue: false,
              FieldLabel: 'Show UpComing :',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'UpComingItems',
              FieldValue: [],
              FieldLabel: 'UpComing Items :',
              FieldType: 'MultiSelect',
              DefaultValue: '',
              ChildField: true,
              CSSClass: '',
              Disabled: true,
              DataSource: [
                { Id: 'Phone', Name: 'Phone' },
                { Id: 'Email', Name: 'Email' },
                { Id: 'Letter', Name: 'Letter' },
                // { id: 'Attachment', name: 'Attachment' },
                // { id: 'Notes', name: 'Notes' },
                // { id: 'Task', name: 'Task' },
              ],
              ValueField: 'Id',
              TextField: 'Name',
            },

            {
              FieldName: 'ShowPast',
              FieldValue: false,
              FieldLabel: 'Show Past :',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'PastItems',
              FieldValue: [],
              FieldLabel: 'Past Items :',
              FieldType: 'MultiSelect',
              DefaultValue: '',
              CSSClass: '',
              ChildField: true,
              Disabled: true,
              DataSource: [
                { Id: 'Phone', Name: 'Phone' },
                { Id: 'Email', Name: 'Email' },
                { Id: 'Letter', Name: 'Letter' },
                { Id: 'Attachment', Name: 'Attachment' },
                // { id: 'Notes', name: 'Notes' },
                { Id: 'Task', Name: 'Task' },
              ],
              ValueField: 'Id',
              TextField: 'Name',
            },
          ],
        },
      ],
    },
    { Id: 'Events', TabTitle: 'Events', Sections: [] },
  ],
}

export const PropertiesPanelDataActivitylist = {
  tabs: [
    {
      Id: 'Properties',
      TabTitle: 'Properties',
      Sections: [
        {
          SectionTitle: 'Display Options',
          Fields: [
            {
              FieldName: 'DisplayName',
              FieldValue: '',
              FieldLabel: 'Label :',
              Placeholder: 'Label',
              FieldType: 'Textbox',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: '',
              },
            },
            // {
            //   FieldName: 'Name',
            //   FieldValue: '',
            //   FieldLabel: 'Name',
            //   FieldType: 'Textbox',
            //   Placeholder: 'Name',
            //   Validation: {
            //     IsRequired: 'False',
            //     ValidationCondition: '',
            //   },
            // },
            {
              FieldName: 'Hide',
              FieldValue: false,
              FieldLabel: 'Hide',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'HidePhone',
              FieldValue: false,
              FieldLabel: 'Hide only on Phone',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
          ],
        },
      ],
    },
    { Id: 'Events', TabTitle: 'Events', Sections: [] },
  ],
}

export const PropertiesPanelDataPayment = {
  tabs: [
    {
      Id: 'Properties',
      TabTitle: 'Properties',
      Sections: [
        {
          SectionTitle: 'Display Options',
          Fields: [
            {
              FieldName: 'DisplayName',
              FieldValue: '',
              FieldLabel: 'Label :',
              Placeholder: 'Label',
              FieldType: 'Textbox',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: '',
              },
            },
            // {
            //   FieldName: 'Name',
            //   FieldValue: '',
            //   FieldLabel: 'Name',
            //   FieldType: 'Textbox',
            //   Placeholder: 'Name',
            //   Validation: {
            //     IsRequired: 'False',
            //     ValidationCondition: '',
            //   },
            // },
            {
              FieldName: 'Hide',
              FieldValue: false,
              FieldLabel: 'Hide',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
            {
              FieldName: 'HidePhone',
              FieldValue: false,
              FieldLabel: 'Hide only on Phone',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
          ],
        },
      ],
    },
    { Id: 'Events', TabTitle: 'Events', Sections: [] },
  ],
}

export const RightPanelDefault = {
  Properties: {
    Name: '',
    DisplayName: '',
    Layout: '',
    SectionColumn1Width: '',
    SectionColumn2Width: '',
    SectionColumn3Width: '',
    SectionColumn4Width: '',
    ExpandTabDafault: '',
    Hide: false,
    HidePhone: false,
    Width: 0,
    HideLabel: false,
    Lock: false,
    Column1Width: '',
    Column2Width: '',
    Column3Width: '',
    Datatype: '',
  },
}

export const RightPanelDesignDefault = {
  tabs: [
    {
      Id: 'Properties',
      TabTitle: 'Properties',
      Sections: [],
    },
    { Id: 'Events', TabTitle: 'Events', Sections: [] },
  ],
}
export const FormSettings = {
  tabs: [
    {
      Id: 'Properties',
      TabTitle: 'Properties',
      Sections: [
        {
          SectionTitle: 'Form Settings',
          Fields: [
            {
              FieldName: 'Criteria',
              FieldValue: 'AddFilter',
              FieldLabel: 'Add Filter',
              FieldType: 'Button',
              Variant: 'outlined',
              DefaultValue: '',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: '',
              },
            },
            {
              FieldName: 'Order',
              FieldValue: '',
              FieldLabel: 'FormOrder :',
              Placeholder: 'FormOrder',
              FieldType: 'Textbox',
              Type: 'number',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: '',
              },
            },
            {
              FieldName: 'UserSelectable',
              FieldValue: true,
              FieldLabel: 'UserSelectable',
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
            },
          ],
        },
      ],
    },
    { Id: 'Events', TabTitle: 'Events', Sections: [] },
  ],
}
