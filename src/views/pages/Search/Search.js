import React from 'react'
import usePageTitle from '../../components/hooks/usePageTitle'
import useActionFields from '../../components/hooks/useActionsFields'
import './Search.css'
import SearchLanding from '../../components/custom/SearchBar/SearchLanding/SearchLanding'
import { useHistory } from 'react-router-dom'

const Search = () => {
  const history = useHistory()
  const { setPageTitle } = usePageTitle()
  var searchValueData = history.location.state.searchtTerm
  const { setActionFields } = useActionFields()

  setPageTitle('Search Page')
  setActionFields({ actionFields: null })

  if (!searchValueData) return null
  return <SearchLanding searchValue={searchValueData} />
}

export default Search
