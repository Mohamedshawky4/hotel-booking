import React from 'react'
import { assets } from '../assets/assets'

const StarRaiting = ({rating = 0}) => {
  // Ensure rating is a number and handle undefined/null values
  const numericRating = typeof rating === 'number' ? rating : 0;
  
  return (
    <>
      {Array(5).fill("").map((_, index) => (
        <img 
          key={index}
          src={numericRating > index ? assets.starIconFilled : assets.starIconOutlined} 
          alt="star icon" 
          className='w-4.5 h-4.5' 
        />
      ))}
    </>
  )
}

export default StarRaiting