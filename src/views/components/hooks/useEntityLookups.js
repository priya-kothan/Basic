import React from 'react'
import { useQuery } from 'react-query'

import getAPIData from '../../../models/api/api'
import apiEndpoints from '../../../models/api/apiEndpoints'

function useEntityLookups(entityName, options) {
  const [lookupData, setLookupData] = React.useState({})

  useQuery(
    'entityLookupData',
    () =>
      getAPIData(
        apiEndpoints.GetEntity.method,
        `${apiEndpoints.GetEntity.url}?$expand=EntityField($filter=EntityFieldDataType/Name eq 'Lookup')`
      ).then((response) => response.data.value),
    {
      placeholderData: [
        {
          lookupIds: '',
          lookupNames: '',
          optionSets: [],
        },
      ],
      retry: false,
      onSuccess: (data) => {
        const resultData = {}
        let lookupName = null

        // Loop through all the Entities
        data.forEach((entity) => {
          resultData[entity.Name] = {} // output object
          resultData[entity.Name].lookupIds = [] // all entity ids which are mapped as lookup
          resultData[entity.Name].lookupNames = [] // all entity names which are mapped as lookup
          resultData[entity.Name].lookupEntityFieldIds = [] // all entity field ids which are mapped as lookup
          resultData[entity.Name].lookupEntityFieldNames = [] // all entity field names which are mapped as lookup
          resultData[entity.Name].optionSets = [
            { id: entity.Id, Name: entity.Name },
          ]

          // Include base entity
          if (options?.includeBaseEntityId)
            resultData[entity.Name].lookupIds.push(entity.Id)

          // Loop through all the Entity Fields
          entity.EntityField.forEach((entityField) => {
            resultData[entity.Name].lookupEntityFieldIds.push(entityField.Id)
            resultData[entity.Name].lookupEntityFieldNames.push(
              entityField.Name
            )

            lookupName =
              data.find((e) => e.Id === entityField.Lookup)?.Name || ''

            if (
              lookupName &&
              resultData[entity.Name].lookupIds.indexOf(entityField.Lookup) ===
                -1
            ) {
              resultData[entity.Name].lookupIds.push(entityField.Lookup)
              resultData[entity.Name].lookupNames.push(lookupName)
              resultData[entity.Name].optionSets.push({
                id: entityField.Lookup,
                Name: lookupName,
              })
            }
          })
        })

        setLookupData(resultData)
      },
    }
  )

  return entityName ? lookupData[entityName] : lookupData
}

export default useEntityLookups
