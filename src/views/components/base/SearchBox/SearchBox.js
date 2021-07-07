import React from 'react'
import PropTypes from 'prop-types'
import { Search as SearchIcon } from '@material-ui/icons'
import { InputBase } from '@material-ui/core'

import './SearchBox.css'

const SearchBox = ({
  className,
  OnValueChange,
  OnSearchClick,
  searchicon,
  placeholder,
}) => {
  return (
    <div className={`searchbox searchbox_${className}`}>
      {searchicon === undefined ? (
        <div className="searchbox__icon" onClick={OnSearchClick}>
          <SearchIcon />
        </div>
      ) : (
        ''
      )}
      <InputBase
        placeholder={placeholder === undefined ? 'Search..' : placeholder}
        onChange={OnValueChange}
        className={`searchbox_input_${className}`}
      />
    </div>
  )
}

SearchBox.defaultProps = {
  className: '',
}

SearchBox.propTypes = {
  className: PropTypes.string,
}

export default SearchBox
