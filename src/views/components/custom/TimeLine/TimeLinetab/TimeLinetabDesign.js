/* eslint-disable  */
import React, { Fragment } from 'react'
import { FFTabs } from '../../../base/FFTabs/FFTabs'
import './TimeLinetab.css'

const TimeLinetabDesign = ({
  dataSource,
  heading,
  className,
  //selectedtabname,
  selectedupcommingtabname,
  selectedpasttabname,
  Status,
}) => {
  const onChangeHandler = (e, Index) => {
    Status === 'Pending'
      ? selectedupcommingtabname(e, Index, Status)
      : selectedpasttabname(e, Index, Status)
  }
  return (
    <div className="Wrapper__timelinetab">
      <div className="Wrapper__header">
        <span className="Wrapper__title">{heading}</span>
      </div>
      {dataSource && Status === 'Pending' ? (
        <div className={`${className}`}>
          <FFTabs
            id="red"
            dataSource={dataSource}
            onChangeHandler={onChangeHandler}
            cssClass={`${className}_tab`}
          ></FFTabs>
        </div>
      ) : null}
      {dataSource && Status === 'Closed' ? (
        <div className={`${className}`}>
          <FFTabs
            id="red"
            dataSource={dataSource}
            onChange={onChangeHandler}
            cssClass={`${className}`}
          ></FFTabs>
        </div>
      ) : null}
    </div>
  )
}

TimeLinetabDesign.propTypes = {}

TimeLinetabDesign.defaultProps = {}

export default React.memo(TimeLinetabDesign)
