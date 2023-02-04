import React from 'react'
import './ButtonAdd.scss'

function ButtonAdd({handleClick}) {
  return (
    <>
      <button className='btn btn-add' onClick={handleClick}>+</button>
    </>
  )
}

export default ButtonAdd
