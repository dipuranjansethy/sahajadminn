import React from 'react'

const Loader = () => {
  return (
         <div style={{width:"100%",height:"85vh",display:"flex",
     justifyContent:"center",alignItems:"center"}}>
        <i style={{fontSize:30,color:"#676"}} className="fa fa-spinner fa-spin"></i>
     </div>
  )
}

export default Loader
