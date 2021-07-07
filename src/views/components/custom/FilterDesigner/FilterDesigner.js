/* eslint-disable */
import React, { useState, useEffect } from 'react'
import FilterComponent from './Components/FilterComponent'
import utils from '../../../../utils/utils'
import { DatatypeExpressionData } from '../../../../utils/DatatypeIconData'
import FFButton from '../../base/FFButton/FFButton'
import './FilterDesigner.css'
const generateID = () => Math.random().toString()

const defaultOperators = []
const Operators = {
  Common: [
    {
      Id: 'eq',
      Name: 'eq',
      DisplayName: 'Equals',
      ODataDesc: 'Equal to',
      operatortype: 'CommonExp',
    },
    {
      Id: 'ne',
      Name: 'ne',
      DisplayName: 'NotEquals',
      ODataDesc: 'Not Equal to',
      operatortype: 'CommonExp',
    },
  ],
  Contains: [
    {
      Id: 'contains',
      Name: 'contains',
      DisplayName: 'contains',
      ODataDesc: 'contains',
      operatortype: 'StringExp',
    },
  ],
  Numeric: [
    {
      Id: 'lt',
      Name: 'lt',
      DisplayName: 'Less than',
      ODataDesc: 'Less than',
      operatortype: 'NumericOpertionExp',
    },
    {
      Id: 'gt',
      Name: 'gt',
      DisplayName: 'Greater than',
      ODataDesc: 'Greater than',
      operatortype: 'NumericOpertionExp',
    },
    {
      Id: 'ge',
      Name: 'ge',
      DisplayName: 'Greater than or Equals',
      ODataDesc: 'Greater than or equal to',
      operatortype: 'NumericOpertionExp',
    },
    {
      Id: 'le',
      Name: 'le',
      DisplayName: 'Less than or Equals',
      ODataDesc: 'Less than or equal to',
      operatortype: 'NumericOpertionExp',
    },
  ],
  String: [
    {
      Id: 'startswith',
      Name: 'startswith',
      DisplayName: 'Starts with',
      ODataDesc: 'Starts with',
      operatortype: 'StringExp',
    },
    {
      Id: 'endswith',
      Name: 'endswith',
      DisplayName: 'End with',
      ODataDesc: 'End with',
      operatortype: 'StringExp',
    },
    {
      Id: 'contains',
      Name: 'contains',
      DisplayName: 'contains',
      ODataDesc: 'contains',
      operatortype: 'StringExp',
    },
    {
      Id: 'substringof',
      Name: 'substringof',
      DisplayName: 'Substringof',
      ODataDesc: 'Substring of value',
      operatortype: 'StringExp',
    },
    {
      Id: 'length',
      Name: 'length',
      DisplayName: 'length',
      ODataDesc: 'Length of string',
      operatortype: 'StringExp',
    },
    {
      Id: 'indexof',
      Name: 'indexof',
      DisplayName: 'indexof',
      ODataDesc: 'Index of string',
      operatortype: 'StringExp',
    },
    {
      Id: 'substring',
      Name: 'substring',
      DisplayName: 'substring',
      ODataDesc: 'substring',
      operatortype: 'StringExp',
    },
    {
      Id: 'tolower',
      Name: 'tolower',
      DisplayName: 'tolower',
      ODataDesc: 'Convert string to lower',
      operatortype: 'StringExp',
    },
    {
      Id: 'toupper',
      Name: 'toupper',
      DisplayName: 'toupper',
      ODataDesc: 'Convert string to uppper',
      operatortype: 'StringExp',
    },
    {
      Id: 'trim',
      Name: 'trim',
      DisplayName: 'trim',
      ODataDesc: 'Trim String',
      operatortype: 'StringExp',
    },
    {
      Id: 'concat',
      Name: 'concat',
      DisplayName: 'concat',
      ODataDesc: 'Concat two string',
      operatortype: 'StringExp',
    },
  ],
}

const Properties = {
  String: [
    {
      Id: 'length',
      Name: 'length',
      DisplayName: 'Length',
      ODataDesc: 'Length of string',
      operatortype: 'StringPrty',
    },
    {
      Id: 'tolower',
      Name: 'tolower',
      DisplayName: 'tolower',
      ODataDesc: 'Convert string to lower',
      operatortype: 'StringPrty',
    },
    {
      Id: 'toupper',
      Name: 'toupper',
      DisplayName: 'toupper',
      ODataDesc: 'Convert string to uppper',
      operatortype: 'StringPrty',
    },
    {
      Id: 'trim',
      Name: 'trim',
      DisplayName: 'Trim',
      ODataDesc: 'Trim String',
      operatortype: 'StringPrty',
    },
    {
      Id: 'substringof',
      Name: 'substringof',
      DisplayName: 'Substringof',
      ODataDesc: 'Substring of value',
      operatortype: 'StringPrty',
    },
    {
      Id: 'indexof',
      Name: 'indexof',
      DisplayName: 'Indexof',
      ODataDesc: 'Index of string',
      operatortype: 'StringPrty',
    },
    {
      Id: 'replace',
      Name: 'replace',
      DisplayName: 'Replace',
      ODataDesc: 'Replace',
      operatortype: 'StringPrty',
    },
    {
      Id: 'substring',
      Name: 'substring',
      DisplayName: 'Substring',
      ODataDesc: 'substring',
      operatortype: 'StringPrty',
    },

    {
      Id: 'concat',
      Name: 'concat',
      DisplayName: 'Concat',
      ODataDesc: 'Concat two string',
      operatortype: 'StringPrty',
    },
  ],
  Math: [
    {
      Id: 'round',
      Name: 'round',
      DisplayName: 'Round',
      ODataDesc: 'Round',
      operatortype: 'MathPrty',
    },
    {
      Id: 'floor',
      Name: 'floor',
      DisplayName: 'Floor',
      ODataDesc: 'Floor',
      operatortype: 'MathPrty',
    },
    {
      Id: 'ceiling',
      Name: 'ceiling',
      DisplayName: 'Ceiling',
      ODataDesc: 'Ceiling',
      operatortype: 'MathPrty',
    },
  ],
  Time: [
    {
      Id: 'hour',
      Name: 'hour',
      DisplayName: 'Hour',
      ODataDesc: 'Hour',
      operatortype: 'DateTimePrty',
    },
    {
      Id: 'minute',
      Name: 'minute',
      DisplayName: 'Minute',
      ODataDesc: 'Minute',
      operatortype: 'DateTimePrty',
    },
    {
      Id: 'second',
      Name: 'second',
      DisplayName: 'Second',
      ODataDesc: 'Second',
      operatortype: 'DateTimePrty',
    },
  ],
  Date: [
    {
      Id: 'day',
      Name: 'day',
      DisplayName: 'Day',
      ODataDesc: 'Day',
      operatortype: 'DateTimePrty',
    },
    {
      Id: 'month',
      Name: 'month',
      DisplayName: 'Month',
      ODataDesc: 'Month',
      operatortype: 'DateTimePrty',
    },
    {
      Id: 'year',
      Name: 'year',
      DisplayName: 'Year',
      ODataDesc: 'year',
      operatortype: 'DateTimePrty',
    },
  ],
  DateTime: [
    {
      Id: 'day',
      Name: 'day',
      DisplayName: 'Day',
      ODataDesc: 'Day',
      operatortype: 'DateTimePrty',
    },
    {
      Id: 'month',
      Name: 'month',
      DisplayName: 'Month',
      ODataDesc: 'Month',
      operatortype: 'DateTimePrty',
    },
    {
      Id: 'year',
      Name: 'year',
      DisplayName: 'Year',
      ODataDesc: 'year',
      operatortype: 'DateTimePrty',
    },
    {
      Id: 'hour',
      Name: 'hour',
      DisplayName: 'Hour',
      ODataDesc: 'Hour',
      operatortype: 'DateTimePrty',
    },
    {
      Id: 'minute',
      Name: 'minute',
      DisplayName: 'Minute',
      ODataDesc: 'Minute',
      operatortype: 'DateTimePrty',
    },
    {
      Id: 'second',
      Name: 'second',
      DisplayName: 'Second',
      ODataDesc: 'Second',
      operatortype: 'DateTimePrty',
    },
  ],
  Arithmetic: [
    {
      Id: 'add',
      Name: 'add',
      DisplayName: 'Add',
      ODataDesc: 'Add',
      operatortype: 'ArithmeticPrty',
    },
    {
      Id: 'sub',
      Name: 'sub',
      DisplayName: 'Sub',
      ODataDesc: 'Sub',
      operatortype: 'ArithmeticPrty',
    },
    {
      Id: 'mul',
      Name: 'mul',
      DisplayName: 'Mul',
      ODataDesc: 'Mul',
      operatortype: 'MatArithmeticPrtyhPrty',
    },
    {
      Id: 'div',
      Name: 'div',
      DisplayName: 'Div',
      ODataDesc: 'Div',
      operatortype: 'MatArithmeticPrtyhPrty',
    },
    {
      Id: 'mod',
      Name: 'mod',
      DisplayName: 'Mod',
      ODataDesc: 'Mod',
      operatortype: 'MatArithmeticPrtyhPrty',
    },
  ],
}

const defaultCombinators = [
  { Id: 'and', Name: 'and', DisplayName: 'AND' },
  { Id: 'or', Name: 'or', DisplayName: 'OR' },
  // { Id: 'not', Name: 'not', DisplayName: 'Not' },
  // { Id: 'contains', Name: 'contains', DisplayName: 'Contains' },
]

const preparedQueries = {
  generic: {
    id: `g-${generateID()}`,
    type: 'group',
    groupType: 'and',
    entity: '',
    entityType: '',
    filters: [],
  },
}

const FilterDesigner = ({
  EntityData,
  QueryData,
  handleChange,
  handleClick,
}) => {
  const tempQueryData =
    QueryData !== '' && QueryData !== undefined
      ? QueryData
      : preparedQueries.generic

  const [query, setQuery] = useState(tempQueryData)
  const [filterdata, setfilterdata] = useState([])
  const [resetOnFieldChange, setResetOnFieldChange] = useState(true)

  const handleQueryChange = (query) => {
    setQuery(query)
    handleChange && handleChange(query)
  }

  //const formatString = JSON.stringify(query, null, 2)
  const onClickHandle = () => {
    const formatString = JSON.stringify(query, null, 2)
    handleClick(formatString)
  }

  useEffect(() => {
    async function fetchData() {
      const relatedEntities = await utils.EntityLookupbinddept(EntityData)

      if (relatedEntities.length !== 0) {
        relatedEntities.map((entity, idx) => {
          const entityFielddata = entity.EntityField.map((entityField) => {
            if (entityField.DataTypeId) {
              const Expressiondata = DatatypeExpressionData(
                entityField.DataTypeId
              )
              let operatorsdata = []
              Expressiondata &&
                Expressiondata.ExpressionType.length !== 0 &&
                Expressiondata.ExpressionType.forEach((dataItem) => {
                  operatorsdata = [...operatorsdata, ...Operators[dataItem]]
                })
              let propertydata = [
                {
                  id: 'select',
                  Id: 'select',
                  Name: '',
                  DisplayName: 'None',
                  ODataDesc: '',
                  operatortype: '',
                },
              ]
              Expressiondata &&
                Expressiondata.PropertyType.length !== 0 &&
                Expressiondata.PropertyType.forEach((dataItem) => {
                  propertydata = [...propertydata, ...Properties[dataItem]]
                })

              if (idx === 0)
                if (
                  entityField.EntityFieldDataType.Name === 'OptionSet' ||
                  entityField.EntityFieldDataType.Name === 'TwoOptions'
                ) {
                  const tempoptionSetData =
                    (entityField.OptionSet &&
                      entityField.OptionSet.OptionSetOptions) ||
                    []

                  return {
                    ...entityField,
                    EntityType: 'BaseEntity',
                    Entity: entity.Name,
                    DataTypeName: entityField.EntityFieldDataType.Name,
                    operators: operatorsdata,
                    properties: propertydata,

                    OptionSetOptions: tempoptionSetData,

                    ControlType: Object.values(Expressiondata)[4],

                    defaultValue:
                      entityField.EntityFieldDataType.Name === 'TwoOptions'
                        ? false
                        : '',
                  }
                } else
                  return {
                    ...entityField,
                    EntityType: 'BaseEntity',
                    Entity: entity.Name,
                    DataTypeName: entityField.EntityFieldDataType.Name,
                    operators: operatorsdata,
                    properties: propertydata,
                    ControlType: Object.values(Expressiondata)[4],
                  }
              else {
                if (
                  entityField.EntityFieldDataType.Name === 'OptionSet' ||
                  entityField.EntityFieldDataType.Name === 'TwoOptions'
                ) {
                  const tempoptionSetData =
                    (entityField.OptionSet &&
                      entityField.OptionSet.OptionSetOptions) ||
                    []
                  return {
                    ...entityField,
                    EntityType: 'RelatedEntity',
                    Entity: entity.Name,
                    DataTypeName: entityField.EntityFieldDataType.Name,
                    operators: operatorsdata,
                    properties: propertydata,
                    OptionSetOptions: tempoptionSetData,
                    ControlType: Object.values(Expressiondata)[4],
                  }
                } else
                  return {
                    ...entityField,
                    EntityType: 'RelatedEntity',
                    Entity: entity.Name,
                    DataTypeName: entityField.EntityFieldDataType.Name,
                    operators: operatorsdata,
                    properties: propertydata,
                    ControlType: Object.values(Expressiondata)[4],
                  }
              }
            }
            return entityField
          })
          return (entity.EntityField = entityFielddata)
        })

        setfilterdata(relatedEntities)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="Filter">
      <div className="FilterDesigner">
        <form className="form-inline" style={{ marginTop: '1rem' }}>
          {filterdata.length !== 0 && (
            <FilterComponent
              query={query}
              onQueryChange={handleQueryChange}
              resetOnFieldChange={resetOnFieldChange}
              operators={defaultOperators}
              combinators={defaultCombinators}
              filterdata={filterdata}
              stringoperators={Operators.String}
            />
          )}
        </form>
      </div>
      {/* <pre>{formatString}</pre> */}
      <div className="FilterSaveBtn">
        <FFButton
          size="small"
          Field={{
            FieldValue: 'Save Filter',
            Variant: 'contained',
            FieldLabel: 'Save Filter',
            Type: 'primary',
          }}
          onClickHandler={onClickHandle}
        />
      </div>
    </div>
  )
}

export default FilterDesigner
