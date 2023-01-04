import React from 'react'

function Button({value, handleClick, type = 'button', isPrimary}) {
    const classString = isPrimary ? 'button modal-primary-btn' : 'button';
  return (

    <input type={type} className={classString} value={value} onClick={handleClick} />
                            
  )
}

export default Button
