import React from 'react'

function File({item, index, handleClick}) {
  return (
        <li key={index}>
            <a target='_blank' className='filelist' href={item.url} rel="noreferrer">{item.name}
            </a>
            <button data-filename={item.name} type='button' onClick={(e) => handleClick(e.target.dataset.filename)} className='delete-file-btn'>&times;</button>
        </li>
  )
}

export default File
