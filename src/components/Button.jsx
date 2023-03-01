import React from 'react'

const Button = ({ label = "", onClick, disabled = false }) => {

  return (
    <button disabled={disabled} onClick={onClick}>{label}</button>
  )
}

export default Button