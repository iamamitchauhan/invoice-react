import React from 'react'

const Error = ({ msg = "" }) => {
  return (
    <div>
      <p style={{ color: "red" }}>{msg}</p>
    </div>
  )
}

export default Error