import React from 'react'

const Th = ({ name, sortBy, onSorting, children }) => {

  const onSort = () => {
    onSorting({
      name,
      order: sortBy.name === name ? sortBy.order === "ASC" ? "DESC" : "ASC" : "ASC"
    })
  }
  return (
    <th onClick={onSort}>{children} {sortBy.name === name ? sortBy.order : ""}</th>
  )
}

export default Th