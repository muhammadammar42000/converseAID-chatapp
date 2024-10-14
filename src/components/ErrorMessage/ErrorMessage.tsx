import React from 'react'
import _ from 'lodash'

const ErrorMessage = (val: any) => {
  const { touched, errors, name } = val
  let isTouched = _.get(touched, name)
  let errorMess = _.get(errors, name)
  if (isTouched && Boolean(errorMess)) {
    return (
      <p style={{ color: 'red', fontWeight: '400', fontSize: '14px' }}>
        {isTouched && Boolean(errorMess) ? isTouched && errorMess : null}
      </p>
    )
  }
  return null
}

export default ErrorMessage
