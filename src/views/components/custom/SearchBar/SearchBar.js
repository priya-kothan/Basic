import PropTypes from 'prop-types'
import _ from 'lodash'
import React from 'react'
import { Search, Grid, Label } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { Search as BTNSearch } from '@material-ui/icons'
import APIEndPoints from '../../../../models/api/apiEndpoints'
import { getCoreData } from '../../../../models/api/api'
import useAppContext from '../../hooks/useToast'

import './SearchBar.css'

const SearchBar = ({ onClick, SearchName }) => {
  const initialState = {
    isLoading: false,
    result: [],
    value: '',
    dataSource: null,
    searchName: SearchName,
    errMsg: '',
  }
  const [state, setState] = React.useState(initialState)
  const [searchTearm, setsearchTearm] = React.useState(state.value)
  const { showLoading } = useAppContext()
  const history = useHistory()

  const categoryLayoutRenderer = ({ categoryContent, resultsContent }) => (
    <div className="mainDiv">
      <div className="subDiv">
        <div className="category_name">
          {categoryContent} {`(${resultsContent?.length})`}{' '}
          <div className="viewMore" onClick={handleSearchResult}>
            View More
          </div>
        </div>
        <div className="results">
          {resultsContent.sort((a, b) => b - a).slice(0, 5)}
        </div>
      </div>
    </div>
  )

  categoryLayoutRenderer.propTypes = {
    categoryContent: PropTypes.node,
    resultsContent: PropTypes.node,
  }

  const categoryRenderer = ({ name }) => <Label as="span" content={name} />

  categoryRenderer.propTypes = {
    name: PropTypes.string,
  }

  const resultRenderer = ({ SearchValue }) => <Label content={SearchValue} />

  resultRenderer.propTypes = {
    name: PropTypes.string,
  }

  const handleResultSelect = (e, { result }) => {
    let searchdata = ''

    const filterData =
      state.dataSource.length > 0
        ? state.dataSource.forEach((item, idx) => {
            const data = item[Object.keys(item)]
            const newdata = data.results.find((item1) => item1.id === result.id)
            if (typeof newdata !== 'undefined') {
              searchdata = data
              return true
            }
          })
        : ''

    history.push({
      pathname: `/formViewer`,
      search: `?entityName=${searchdata.name}&entityId=${result.id}&listId=`,
    })
  }

  const handleSearchChange = async (e, { value }) => {
    setState({
      isLoading: true,
      result: [],
      value,
      searchName: value,
      errMsg: '',
    })
  }

  const { isLoading, value, result, searchName, errMsg } = state

  function listenEnter(e) {
    if (e.key === 'Enter') {
      onClick(e.target.value)
    }
  }

  const handleSearchResult = () => {
    if (typeof value !== 'undefined' && value != '') {
      onClick(value)
    }
  }

  React.useEffect(() => {
    const timeId = setTimeout(() => {
      setsearchTearm(state.value)
    }, 1000)
    return () => {
      clearTimeout(timeId)
    }
  }, [state.value])

  React.useEffect(() => {
    if (searchTearm != '') {
      // showLoading(true)
      const getSearchData = async () => {
        const searchData = await getCoreData(
          APIEndPoints.SearchBarQuery.method,
          `${APIEndPoints.SearchBarQuery.url}?$term=${searchTearm}`
        ).then((response) => response.data)

        let filteredResults = []
        if (searchData && searchData?.length === 0) {
          setState((Prev) => ({
            ...Prev,
            errMsg: 'No results found.',
          }))
        } else {
          filteredResults =
            searchData &&
            searchData?.reduce((pre, cur) => {
              return { ...pre, ...cur }
            })
        }

        setState((Prev) => ({
          ...Prev,
          isLoading: false,
          result: filteredResults,
          dataSource: searchData,
          searchName: searchTearm,
        }))
        // showLoading(false)
      }

      getSearchData()
    }
  }, [searchTearm])

  return (
    <Grid>
      <Grid.Column width={8}>
        <div className="searchIcon">
          <Search
            className={
              result.length == 0 && errMsg == ''
                ? 'childern__hidden'
                : 'childern__visible'
            }
            category
            categoryLayoutRenderer={categoryLayoutRenderer}
            categoryRenderer={categoryRenderer}
            loading={isLoading}
            onResultSelect={handleResultSelect}
            onSearchChange={handleSearchChange}
            resultRenderer={resultRenderer}
            results={result}
            value={value || state.searchName}
            onKeyDown={listenEnter}
            input="text"
            placeholder="Search...."
            noResultsMessage={errMsg}
          />
        </div>
        <div className="SearchBarIcon">
          <BTNSearch onClick={handleSearchResult} />
        </div>
      </Grid.Column>
    </Grid>
  )
}

export default SearchBar
