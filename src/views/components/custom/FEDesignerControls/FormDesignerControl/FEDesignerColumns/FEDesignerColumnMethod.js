/* eslint-disable  */
import uuid from 'uuid/v4'

const newElementMethod = (
  data,
  destination,
  draggableId,
  indexdatas,
  EntityName
) => {
  const draggableIds = draggableId.split('~')[0]
  const Datatype = draggableId.split('~')[1]

  const elementdata = {
    id: uuid(),
    Properties: {
      Datatype: Datatype,
      DisplayName: draggableIds,
      Name: draggableIds,
      Maxlenght: 5,
      Width: 100,
      Entity: EntityName,
    },
  }

  data.columns[indexdatas.destinationindex.colindex].sections[
    indexdatas.destinationindex.sectindex
  ].sectionColumns[indexdatas.destinationindex.sectcolindex].elements.splice(
    destination.index,
    0,
    elementdata
  )
  return data
}

const newSectionMethod = (data, destination, draggableId) => {
  switch (draggableId) {
    case '435d042b-3d8f-4331-759b-08d8910a9d72':
      const sectiondata = {
        id: uuid(),
        Properties: {
          Name: 'Section',
          DisplayName: 'Section',
          Layout: '1',
          SectionColumn1Width: '100',
          SectionColumn2Width: '0',
          SectionColumn3Width: '0',
          SectionColumn4Width: '0',
        },
        sectionColumns: [
          {
            id: uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 100,
            },
            elements: [],
          },
        ],
      }

      const newSection = data.columns.map((item) => {
        if (item.id === destination.droppableId) {
          item.sections.splice(destination.index, 0, sectiondata)
        }
        return item
      })

      const finalsection = {
        ...data,
        columns: newSection,
      }
      return finalsection
    case '435d042b-3d8f-4331-759b-08d8910a9d73':
      const sectiontwodata = {
        id: uuid(),
        Properties: {
          Name: 'Section',
          DisplayName: 'Section',
          Layout: '2',
          // SectionColumn1Width: '50',
          // SectionColumn2Width: '50',
          SectionColumn1Width: '100',
          SectionColumn2Width: '100',
          SectionColumn3Width: '0',
          SectionColumn4Width: '0',
        },
        sectionColumns: [
          {
            id: uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 50,
            },
            elements: [],
          },
          {
            id: uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 50,
            },
            elements: [],
          },
        ],
      }
      const newSection2 = data.columns.map((item) => {
        if (item.id === destination.droppableId) {
          item.sections.splice(destination.index, 0, sectiontwodata)
        }
        return item
      })
      const finalsection2 = {
        ...data,
        columns: newSection2,
      }
      return finalsection2
    case '435d042b-3d8f-4331-759b-08d8910a9d74':
      const sectionthreedata = {
        id: uuid(),
        Properties: {
          Name: 'Section',
          DisplayName: 'Section',
          Layout: '3',
          // SectionColumn1Width: '33.34',
          // SectionColumn2Width: '33.33',
          // SectionColumn3Width: '33.33',
          SectionColumn1Width: '100',
          SectionColumn2Width: '100',
          SectionColumn3Width: '100',
          SectionColumn4Width: '0',
        },
        sectionColumns: [
          {
            id: uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 100,
            },
            elements: [],
          },
          {
            id: uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 100,
            },
            elements: [],
          },
          {
            id: uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 100,
            },
            elements: [],
          },
        ],
      }
      const newSection3 = data.columns.map((item) => {
        if (item.id === destination.droppableId) {
          item.sections.splice(destination.index, 0, sectionthreedata)
        }
        return item
      })
      const finalsection3 = {
        ...data,
        columns: newSection3,
      }
      return finalsection3
    case '435d042b-3d8f-4331-759b-08d8910a9d75':
      const sectionfourdata = {
        id: uuid(),
        Properties: {
          Name: 'Section',
          DisplayName: 'Section',
          Layout: '4',
          // SectionColumn1Width: '25',
          // SectionColumn2Width: '25',
          // SectionColumn3Width: '25',
          // SectionColumn4Width: '25',
          SectionColumn1Width: '100',
          SectionColumn2Width: '100',
          SectionColumn3Width: '100',
          SectionColumn4Width: '100',
        },
        sectionColumns: [
          {
            id: uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 100,
            },
            elements: [],
          },
          {
            id: uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 100,
            },
            elements: [],
          },
          {
            id: uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 100,
            },
            elements: [],
          },
          {
            id: uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 100,
            },
            elements: [],
          },
        ],
      }
      const newSection4 = data.columns.map((item) => {
        if (item.id === destination.droppableId) {
          item.sections.splice(destination.index, 0, sectionfourdata)
        }
        return item
      })
      const finalsection4 = {
        ...data,
        columns: newSection4,
      }
      return finalsection4
    case 'Grid':
      const Griddata = {
        id: 'Grid~' + uuid(),
        Properties: {
          Name: 'Grid',
          DisplayName: 'Grid',
          Width: 100,
          Layout: '1',
          Hide: false,
          HidePhone: false,
          ListId: '',
          ListName: '',
          SectionColumn1Width: '100',
          SectionColumn2Width: '0',
          SectionColumn3Width: '0',
          SectionColumn4Width: '0',
        },
        sectionColumns: [
          {
            id: 'Grid~' + uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 100,
            },
            elements: [],
          },
        ],
      }

      const newGriddata = data.columns.map((item) => {
        if (item.id === destination.droppableId) {
          item.sections.splice(destination.index, 0, Griddata)
        }
        return item
      })

      const finalGriddata = {
        ...data,
        columns: newGriddata,
      }
      return finalGriddata
    case 'Timeline':
      const Timelinendata = {
        id: 'Timeline~' + uuid(),
        Properties: {
          Name: 'Timeline',
          DisplayName: 'Timeline',
          Width: 100,
          Hide: false,
          HidePhone: false,
          ShowUpComing: false,
          UpComingItems: [],
          ShowPast: false,
          PastItems: [],
          Layout: '1',
          SectionColumn1Width: '100',
          SectionColumn2Width: '0',
          SectionColumn3Width: '0',
          SectionColumn4Width: '0',
        },
        sectionColumns: [
          {
            id: 'Timeline~' + uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 100,
            },
            elements: [],
          },
        ],
      }

      const newTimelinendata = data.columns.map((item) => {
        if (item.id === destination.droppableId) {
          item.sections.splice(destination.index, 0, Timelinendata)
        }
        return item
      })

      const finalTimelinendata = {
        ...data,
        columns: newTimelinendata,
      }
      return finalTimelinendata
    case 'Activity':
      const Activitydata = {
        id: 'Activity~' + uuid(),
        Properties: {
          Name: 'Activity',
          DisplayName: 'Activity',
          Hide: false,
          HidePhone: false,
          Width: 100,
          Layout: '1',
          SectionColumn1Width: '100',
          SectionColumn2Width: '0',
          SectionColumn3Width: '0',
          SectionColumn4Width: '0',
        },
        sectionColumns: [
          {
            id: 'Activity~' + uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 100,
            },
            elements: [],
          },
        ],
      }

      const newActivitydata = data.columns.map((item) => {
        if (item.id === destination.droppableId) {
          item.sections.splice(destination.index, 0, Activitydata)
        }
        return item
      })

      const finalActivitydata = {
        ...data,
        columns: newActivitydata,
      }
      return finalActivitydata

    case 'Payment':
      const Paymentdata = {
        id: 'Payment~' + uuid(),
        Properties: {
          Name: 'Payment',
          DisplayName: 'Payment',
          Hide: false,
          HidePhone: false,
          Width: 100,
          Layout: '1',
          SectionColumn1Width: '100',
          SectionColumn2Width: '0',
          SectionColumn3Width: '0',
          SectionColumn4Width: '0',
        },
        sectionColumns: [
          {
            id: 'Payment~' + uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 100,
            },
            elements: [],
          },
        ],
      }

      const newPaymentdata = data.columns.map((item) => {
        if (item.id === destination.droppableId) {
          item.sections.splice(destination.index, 0, Paymentdata)
        }
        return item
      })

      const finalPaymentdata = {
        ...data,
        columns: newPaymentdata,
      }
      return finalPaymentdata

    default:
      return data
  }

  return data
}

export const FEMElementMethod = (
  data,
  source,
  destination,
  draggableId,
  EntityName
) => {
  if (
    destination.droppableId.split('~')[0] !== 'Grid' &&
    destination.droppableId.split('~')[0] !== 'Activity' &&
    destination.droppableId.split('~')[0] !== 'Timeline' &&
    destination.droppableId.split('~')[0] !== 'Payment'
  ) {
    const draggableIds = draggableId.split('~')[0]
    const indexdatas = findindex(
      data.columns,
      source,
      destination,
      draggableIds
    )

    if (source.droppableId === 'newElements') {
      const addText = newElementMethod(
        data,
        destination,
        draggableId,
        indexdatas,
        EntityName
      )
      return addText
    }

    const destinationindex = destination.index
    const sourceindex = source.index

    if (source.droppableId === destination.droppableId) {
      data.columns[indexdatas.destinationindex.colindex].sections[
        indexdatas.destinationindex.sectindex
      ].sectionColumns[indexdatas.destinationindex.sectcolindex].elements.move(
        sourceindex,
        destinationindex
      )

      return data
    } else if (source.droppableId !== destination.droppableId) {
      const oldelementdata =
        data.columns[indexdatas.sourceindex.colindex].sections[
          indexdatas.sourceindex.sectindex
        ].sectionColumns[indexdatas.sourceindex.sectcolindex].elements[
          indexdatas.draggableindex.eleindex
        ]

      data.columns[indexdatas.sourceindex.colindex].sections[
        indexdatas.sourceindex.sectindex
      ].sectionColumns[indexdatas.sourceindex.sectcolindex].elements.splice(
        indexdatas.draggableindex.eleindex,
        1
      )

      data.columns[indexdatas.destinationindex.colindex].sections[
        indexdatas.destinationindex.sectindex
      ].sectionColumns[
        indexdatas.destinationindex.sectcolindex
      ].elements.splice(destination.index, 0, oldelementdata)
      return data
    }
  }
  return data
}

export const FESectionMethod = (data, source, destination, draggableId) => {
  if (source.droppableId === 'newSections') {
    const addText = newSectionMethod(data, destination, draggableId)
    return addText
  }

  const indexdatas = findindex(data.columns, source, destination, draggableId)

  const destinationindex = destination.index
  const sourceindex = source.index

  if (source.droppableId === destination.droppableId) {
    data.columns[indexdatas.sourceindex.colindex].sections.move(
      sourceindex,
      destinationindex
    )
    return data
  } else if (source.droppableId !== destination.droppableId) {
    const oldsectiondata =
      data.columns[indexdatas.sourceindex.colindex].sections[
        indexdatas.draggableindex.sectindex
      ]

    data.columns[indexdatas.sourceindex.colindex].sections.splice(
      indexdatas.draggableindex.sectindex,
      1
    )

    data.columns[indexdatas.destinationindex.colindex].sections.splice(
      destination.index,
      0,
      oldsectiondata
    )

    if (data.columns[indexdatas.sourceindex.colindex].sections.length === 0) {
      const newsection = {
        id: uuid(),
        Properties: {
          Name: 'Section',
          DisplayName: 'Section',
          Layout: '1',
          SectionColumn1Width: '100',
          SectionColumn2Width: '0',
          SectionColumn3Width: '0',
          SectionColumn4Width: '0',
        },
        sectionColumns: [
          {
            id: uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 100,
            },
            elements: [],
          },
        ],
      }

      data.columns[indexdatas.sourceindex.colindex].sections.splice(
        0,
        0,
        newsection
      )
    }

    return data
  }
  return data
}

export const FETabCreation = (data, source, destination, draggableId) => {
  switch (draggableId) {
    case '435d042b-3d8f-4331-759b-08d8910a9d61':
      const newTab1 = {
        id: data.tabs.length + 1,
        //name: `Tab`,
        Properties: {
          Name: `Tab`,
          DisplayName: `Tab`,
          Displayindex: 1,
          ExpandTabDafault: false,
          Hide: false,
          HidePhone: false,
          Layout: '1',
          Column1Width: '100',
          Column2Width: '0',
          Column3Width: '0',
        },
        columns: [
          {
            id: uuid(),
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
                id: uuid(),
                Properties: {
                  Name: 'Section',
                  DisplayName: 'Section',
                  Layout: '1',
                  SectionColumn1Width: '100',
                  SectionColumn2Width: '0',
                  SectionColumn3Width: '0',
                  SectionColumn4Width: '0',
                },
                sectionColumns: [
                  {
                    id: uuid(),
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
      }
      return newTab1
    case '435d042b-3d8f-4331-759b-08d8910a9d62':
      const newTab2 = {
        id: data.tabs.length + 1,
        // name: `Tab`,
        Properties: {
          Name: `Tab`,
          DisplayName: `Tab`,
          Displayindex: 1,
          ExpandTabDafault: false,
          Hide: false,
          HidePhone: false,
          Layout: '2',
          Column1Width: '50',
          Column2Width: '50',
          Column3Width: '0',
        },
        columns: [
          {
            id: uuid(),
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
                id: uuid(),
                Properties: {
                  Name: 'Section',
                  DisplayName: 'Section',
                  Layout: '1',
                  SectionColumn1Width: '100',
                  SectionColumn2Width: '0',
                  SectionColumn3Width: '0',
                  SectionColumn4Width: '0',
                },
                sectionColumns: [
                  {
                    id: uuid(),
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
          {
            id: uuid(),
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
                id: uuid(),
                Properties: {
                  Name: 'Section',
                  DisplayName: 'Section',
                  Width: 100,
                  Layout: '1',
                  SectionColumn1Width: '100',
                  SectionColumn2Width: '0',
                  SectionColumn3Width: '0',
                  SectionColumn4Width: '0',
                },
                sectionColumns: [
                  {
                    id: uuid(),
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
      }
      return newTab2
    case '435d042b-3d8f-4331-759b-08d8910a9d63':
      const newTab3 = {
        id: data.tabs.length + 1,
        //name: `Tab`,
        Properties: {
          Name: `Tab`,
          DisplayName: `Tab`,
          Displayindex: 1,
          ExpandTabDafault: false,
          Hide: false,
          HidePhone: false,
          Layout: '3',
          Column1Width: '34',
          Column2Width: '33',
          Column3Width: '33',
        },
        columns: [
          {
            id: uuid(),
            Properties: {
              Name: 'Column',
              DisplayName: 'Column',
              Width: 100,
            },
            sections: [
              {
                id: uuid(),
                Properties: {
                  Name: 'Section',
                  DisplayName: 'Section',
                  Layout: '1',
                  SectionColumn1Width: '100',
                  SectionColumn2Width: '0',
                  SectionColumn3Width: '0',
                  SectionColumn4Width: '0',
                },
                sectionColumns: [
                  {
                    id: uuid(),
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
          {
            id: uuid(),
            Properties: {
              Name: 'Column',
              DisplayName: 'Column',
              Width: 100,
            },
            sections: [
              {
                id: uuid(),
                Properties: {
                  Name: 'Section',
                  DisplayName: 'Section',
                  Width: 100,
                  Layout: '1',
                  SectionColumn1Width: '100',
                  SectionColumn2Width: '0',
                  SectionColumn3Width: '0',
                  SectionColumn4Width: '0',
                },
                sectionColumns: [
                  {
                    id: uuid(),
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
          {
            id: uuid(),
            Properties: {
              Name: 'Column',
              DisplayName: 'Column',
              Width: 100,
            },
            sections: [
              {
                id: uuid(),
                Properties: {
                  Name: 'Section',
                  DisplayName: 'Section',
                  Layout: '1',
                  SectionColumn1Width: '100',
                  SectionColumn2Width: '0',
                  SectionColumn3Width: '0',
                  SectionColumn4Width: '0',
                },
                sectionColumns: [
                  {
                    id: uuid(),
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
      }
      return newTab3
    default:
      return data
  }
}

Array.prototype.move = function (old_index, new_index) {
  if (new_index >= this.length) {
    var k = new_index - this.length
    while (k-- + 1) {
      this.push(undefined)
    }
  }
  this.splice(new_index, 0, this.splice(old_index, 1)[0])
}

function findindex(data, source, destination, draggableId) {
  const beforedata = data
  const sourceindex = {
    colindex: null,
    sectindex: null,
    sectcolindex: null,
    eleindex: null,
  }

  const destinationindex = {
    colindex: null,
    sectindex: null,
    sectcolindex: null,
    eleindex: null,
  }

  const draggableindex = {
    colindex: null,
    sectindex: null,
    sectcolindex: null,
    eleindex: null,
  }

  const combinedata = {
    sourceindex: sourceindex,
    destinationindex: destinationindex,
    draggableindex: draggableindex,
  }

  function recurse(data, current) {
    for (const key in data) {
      let value = data[key]
      if (value !== undefined) {
        if (value && typeof value === 'object') {
          if (Object.prototype.toString.call(value) !== '[object Array]') {
            if (current === 'columns') {
              if (value.id && value.id === source.droppableId) {
                sourceindex.colindex = parseInt(key)
              }
              if (value.id && value.id === destination.droppableId) {
                destinationindex.colindex = parseInt(key)
              }
              if (value.id && value.id === draggableId) {
                draggableindex.colindex = parseInt(key)
              }
            } else if (current === 'sections') {
              if (value.id && value.id === source.droppableId) {
                sourceindex.sectindex = parseInt(key)
              }
              if (value.id && value.id === destination.droppableId) {
                destinationindex.sectindex = parseInt(key)
              }
              if (value.id && value.id === draggableId) {
                draggableindex.sectindex = parseInt(key)
              }
            } else if (current === 'sectionColumns') {
              if (value.id && value.id === source.droppableId) {
                sourceindex.sectcolindex = parseInt(key)
              }
              if (value.id && value.id === destination.droppableId) {
                destinationindex.sectcolindex = parseInt(key)
              }
              if (value.id && value.id === draggableId) {
                draggableindex.sectcolindex = parseInt(key)
              }
            } else if (current === 'elements') {
              if (value.id && value.id === source.droppableId) {
                sourceindex.eleindex = parseInt(key)
              }
              if (value.id && value.id === destination.droppableId) {
                destinationindex.eleindex = parseInt(key)
              }
              if (value.id && value.id === draggableId) {
                draggableindex.eleindex = parseInt(key)
              }
            }
          } else if (
            Object.prototype.toString.call(value) === '[object Array]'
          ) {
            const findsourceindex = value.find(
              (item) => item.id === source.droppableId
            )
            if (findsourceindex !== undefined) {
              if (key === 'sections') {
                sourceindex.colindex = parseInt(current)
              } else if (key === 'sectionColumns') {
                sourceindex.sectindex = parseInt(current)
                sourceindex.colindex = findColumnsindex(
                  beforedata,
                  current,
                  data
                )
              } else if (key === 'elements') {
                sourceindex.sectcolindex = parseInt(current)
              }
            }

            const finddestinationindex = value.find(
              (item) => item.id === destination.droppableId
            )
            if (finddestinationindex !== undefined) {
              if (key === 'sections') {
                destinationindex.colindex = parseInt(current)
              } else if (key === 'sectionColumns') {
                destinationindex.sectindex = parseInt(current)
                destinationindex.colindex = findColumnsindex(
                  beforedata,
                  current,
                  data
                )
              } else if (key === 'elements') {
                destinationindex.sectcolindex = parseInt(current)
              }
            }
          }

          recurse(value, key)
        }
      }
    }
  }
  recurse(data, 'columns')
  return combinedata
}

function findColumnsindex(data, currentindex, source) {
  const colindex = data.map((item, index) => {
    if (item.sections.length !== 0)
      if (
        item.sections[parseInt(currentindex)] &&
        item.sections[parseInt(currentindex)].id === source.id
      ) {
        return index
      }
    return undefined
  })

  const newcolindex = colindex.filter(function (element) {
    return element !== undefined
  })

  return newcolindex[0]
}

export const onChangeCreation = (data, ColumnCount, ItemSelected) => {
  if (ItemSelected.selecteditem === 'Tab') {
    switch (parseInt(ColumnCount)) {
      case 1:
        if (data.columns.length === parseInt(ColumnCount)) return data
        else if (data.columns.length >= parseInt(ColumnCount)) {
          data.columns.length = 1
          data.Properties.Column1Width = 100
          data.columns[0].Properties.Width = 100
          return data
        }
      case 2:
        if (data.columns.length === parseInt(ColumnCount)) return data
        else if (data.columns.length >= parseInt(ColumnCount)) {
          data.columns.length = 2
          let colwidth = 100 / data.columns.length

          for (let i = 1; i <= data.columns.length; i++) {
            let colkey = 'Column' + i + 'Width'
            data.Properties[colkey] = colwidth
            data.columns[i - 1].Properties.Width = colwidth
          }

          return data
        } else if (data.columns.length <= parseInt(ColumnCount)) {
          const newcolumn = {
            id: uuid(),
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
                id: uuid(),
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
                    id: uuid(),
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
          }

          data.columns.push(newcolumn)

          let colwidth = 100 / data.columns.length

          for (let i = 1; i <= data.columns.length; i++) {
            let colkey = 'Column' + i + 'Width'
            data.Properties[colkey] = colwidth
            data.columns[i - 1].Properties.Width = colwidth
          }

          return data
        }
        return
      case 3:
        if (data.columns.length === parseInt(ColumnCount)) return data
        else if (data.columns.length >= parseInt(ColumnCount)) {
          data.columns.length = 3
          for (let i = 1; i <= data.columns.length; i++) {
            let colkey = 'Column' + i + 'Width'
            if (i == 1) {
              let colwidth = parseFloat(100 / data.columns.length).toFixed(2)

              let colwidthfinal = parseFloat(
                parseFloat(colwidth) + parseFloat(0.01)
              ).toFixed(2)
              data.Properties[colkey] = colwidthfinal
              data.columns[i - 1].Properties.Width = colwidthfinal
            } else {
              let colwidth = parseFloat(100 / data.columns.length).toFixed(2)
              data.Properties[colkey] = colwidth
              data.columns[i - 1].Properties.Width = colwidth
            }
          }

          return data
        } else if (data.columns.length <= parseInt(ColumnCount)) {
          const pushlength = parseInt(ColumnCount) - data.columns.length
          for (let i = 1; i <= pushlength; i++) {
            const newcolumn = {
              id: uuid(),
              Properties: {
                Name: 'Column' + (data.columns.length + 1),
                DisplayName: 'Column' + (data.columns.length + 1),
                Width: 100,
                Hide: false,
                HideLabel: false,
                HidePhone: false,
                Lock: false,
              },
              sections: [
                {
                  id: uuid(),
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
                      id: uuid(),
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
            }
            data.columns.push(newcolumn)
          }

          for (let i = 1; i <= data.columns.length; i++) {
            let colkey = 'Column' + i + 'Width'
            if (i == 1) {
              let colwidth = parseFloat(100 / data.columns.length).toFixed(2)

              let colwidthfinal = parseFloat(
                parseFloat(colwidth) + parseFloat(0.01)
              ).toFixed(2)
              data.Properties[colkey] = colwidthfinal
              data.columns[i - 1].Properties.Width = colwidthfinal
            } else {
              let colwidth = parseFloat(100 / data.columns.length).toFixed(2)
              data.Properties[colkey] = colwidth
              data.columns[i - 1].Properties.Width = colwidth
            }
          }

          return data
        }
      default:
        return data
    }
  } else if (ItemSelected.selecteditem === 'Section') {
    switch (parseInt(ColumnCount)) {
      case 1:
        if (data.sectionColumns.length === parseInt(ColumnCount)) return data
        else if (data.sectionColumns.length >= parseInt(ColumnCount)) {
          data.sectionColumns.length = 1
          data.Properties.SectionColumn1Width = 100
          data.sectionColumns[0].Properties.Width = 100
          return data
        }
      case 2:
        if (data.sectionColumns.length === parseInt(ColumnCount)) return data
        else if (data.sectionColumns.length >= parseInt(ColumnCount)) {
          data.sectionColumns.length = 2

          let sectwidth = 100 / data.sectionColumns.length

          for (let i = 1; i <= data.sectionColumns.length; i++) {
            let sectioncol = 'SectionColumn' + i + 'Width'
            data.Properties[sectioncol] = sectwidth
            data.sectionColumns[i - 1].Properties.Width = sectwidth
          }

          return data
        } else if (data.sectionColumns.length <= parseInt(ColumnCount)) {
          const newsectioncolumn = {
            id: uuid(),
            Properties: {
              Name: 'sectionColumn',
              DisplayName: 'sectionColumn',
              Width: 100,
            },
            elements: [],
          }

          data.sectionColumns.push(newsectioncolumn)

          let sectwidth = 100 / data.sectionColumns.length

          for (let i = 1; i <= data.sectionColumns.length; i++) {
            let sectioncol = 'SectionColumn' + i + 'Width'
            data.Properties[sectioncol] = sectwidth
            data.sectionColumns[i - 1].Properties.Width = sectwidth
          }

          return data
        }
        return
      case 3:
        if (data.sectionColumns.length === parseInt(ColumnCount)) return data
        else if (data.sectionColumns.length >= parseInt(ColumnCount)) {
          data.sectionColumns.length = 3
          for (let i = 1; i <= data.sectionColumns.length; i++) {
            let sectioncol = 'SectionColumn' + i + 'Width'
            if (i == 1) {
              let sectwidth = parseFloat(
                100 / data.sectionColumns.length
              ).toFixed(2)

              let sectwidthfinal = parseFloat(
                parseFloat(sectwidth) + parseFloat(0.01)
              ).toFixed(2)
              data.Properties[sectioncol] = sectwidthfinal
              data.sectionColumns[i - 1].Properties.Width = sectwidthfinal
            } else {
              let sectwidth = parseFloat(
                100 / data.sectionColumns.length
              ).toFixed(2)
              data.Properties[sectioncol] = sectwidth
              data.sectionColumns[i - 1].Properties.Width = sectwidth
            }
          }

          return data
        } else if (data.sectionColumns.length <= parseInt(ColumnCount)) {
          const pushlength = parseInt(ColumnCount) - data.sectionColumns.length
          for (let i = 1; i <= pushlength; i++) {
            const newsectioncolumn = {
              id: uuid(),
              Properties: {
                Name: 'sectionColumn',
                DisplayName: 'sectionColumn',
                Width: 100,
              },
              elements: [],
            }
            data.sectionColumns.push(newsectioncolumn)
          }

          for (let i = 1; i <= data.sectionColumns.length; i++) {
            let sectioncol = 'SectionColumn' + i + 'Width'
            if (i == 1) {
              let sectwidth = parseFloat(
                100 / data.sectionColumns.length
              ).toFixed(2)

              let sectwidthfinal = parseFloat(
                parseFloat(sectwidth) + parseFloat(0.01)
              ).toFixed(2)
              data.Properties[sectioncol] = sectwidthfinal
              data.sectionColumns[i - 1].Properties.Width = sectwidthfinal
            } else {
              let sectwidth = parseFloat(
                100 / data.sectionColumns.length
              ).toFixed(2)
              data.Properties[sectioncol] = sectwidth
              data.sectionColumns[i - 1].Properties.Width = sectwidth
            }
          }

          return data
        }
      case 4:
        if (data.sectionColumns.length === parseInt(ColumnCount)) return data
        else if (data.sectionColumns.length <= parseInt(ColumnCount)) {
          const pushlength = parseInt(ColumnCount) - data.sectionColumns.length
          for (let i = 1; i <= pushlength; i++) {
            const newsectioncolumn = {
              id: uuid(),
              Properties: {
                Name: 'sectionColumn',
                DisplayName: 'sectionColumn',
                Width: 100,
              },
              elements: [],
            }
            data.sectionColumns.push(newsectioncolumn)
          }

          for (let i = 1; i <= data.sectionColumns.length; i++) {
            let sectioncol = 'SectionColumn' + i + 'Width'
            if (i == 1) {
              let sectwidth = parseFloat(
                100 / data.sectionColumns.length
              ).toFixed(2)

              let sectwidthfinal = parseFloat(
                parseFloat(sectwidth) + parseFloat(0.01)
              ).toFixed(2)
              data.Properties[sectioncol] = sectwidthfinal
              data.sectionColumns[i - 1].Properties.Width = sectwidthfinal
            } else {
              let sectwidth = parseFloat(
                100 / data.sectionColumns.length
              ).toFixed(2)
              data.Properties[sectioncol] = sectwidth
              data.sectionColumns[i - 1].Properties.Width = sectwidth
            }
          }

          return data
        }
      default:
        return data
    }
    return data
  }
}

export const onChangeCreationWidth = (data, name, value, ItemSelected) => {
  if (ItemSelected.selecteditem === 'Tab') {
    switch (name) {
      case 'Column1Width':
        data.columns[0].Properties.Width = value
        return data
      case 'Column2Width':
        data.columns[1].Properties.Width = value
        return data
      case 'Column3Width':
        data.columns[2].Properties.Width = value
        return data
      default:
        return data
    }
  } else if (ItemSelected.selecteditem === 'Section') {
    switch (name) {
      case 'SectionColumn1Width':
        data.sectionColumns[0].Properties.Width = value
        return data
      case 'SectionColumn2Width':
        data.sectionColumns[1].Properties.Width = value
        return data
      case 'SectionColumn3Width':
        data.sectionColumns[2].Properties.Width = value
        return data
      case 'SectionColumn4Width':
        data.sectionColumns[3].Properties.Width = value
        return data
      default:
        return data
    }
  }
  return data
}

export const FEAddJsonItem = (selecteditem) => {
  switch (selecteditem) {
    case 'Tab':
      const newTab1 = {
        id: 1,
        //name: `Tab`,
        Properties: {
          Name: `Tab`,
          DisplayName: `Tab`,
          Displayindex: 1,
          ExpandTabDafault: false,
          Hide: false,
          HidePhone: false,
          Layout: '1',
          Column1Width: '100',
          Column2Width: '0',
          Column3Width: '0',
        },
        columns: [
          {
            id: uuid(),
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
                id: uuid(),
                Properties: {
                  Name: 'Section',
                  DisplayName: 'Section',
                  Layout: '1',
                  SectionColumn1Width: '100',
                  SectionColumn2Width: '0',
                  SectionColumn3Width: '0',
                  SectionColumn4Width: '0',
                },
                sectionColumns: [
                  {
                    id: uuid(),
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
      }
      return newTab1
    case 'Column':
      const column1 = {
        id: uuid(),
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
            id: uuid(),
            Properties: {
              Name: 'Section',
              DisplayName: 'Section',
              Layout: '1',
              SectionColumn1Width: '100',
              SectionColumn2Width: '0',
              SectionColumn3Width: '0',
              SectionColumn4Width: '0',
            },
            sectionColumns: [
              {
                id: uuid(),
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
      }
      return column1
    case 'Section':
      const newsection1 = {
        id: uuid(),
        Properties: {
          Name: 'Section',
          DisplayName: 'Section',
          Layout: '1',
          SectionColumn1Width: '100',
          SectionColumn2Width: '0',
          SectionColumn3Width: '0',
          SectionColumn4Width: '0',
        },
        sectionColumns: [
          {
            id: uuid(),
            Properties: {
              Name: 'SectionColumn',
              DisplayName: 'SectionColumn',
              Width: 100,
            },
            elements: [],
          },
        ],
      }
      return newsection1
  }
}
