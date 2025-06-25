import React from 'react'
import {Helmet} from 'react-helmet-async'

const Title = ({
    title= "Chat App",
    description= "this is a new chat App"
}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='descripition' content={description} />
    </Helmet>
  )
}
 
export default Title