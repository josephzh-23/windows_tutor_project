//Will contain all the data returned from the react search page

import React from "react";
import { useHistory } from 'react-router-dom';

const Result = ({ journal: posting }) => {
  let history = useHistory();
  const mystyle = {

    borderRadius:"50%",
    color: "white",
    height:"30%",
    width:"30%",
    fontFamily: "Arial",
    display:"block"
  };

  return (
    <div className = "d-flex" mt="30dp">

    
      <div className = "justify-content-start">
      <list> <b>Title:</b> {posting.title}{" "}</list>



      {/* <b>Author:</b> {posting.author.name}{" "} */}
      <li><b>Author:</b> {posting.author}{" "}</li>

      <li>  <b>Subjects:</b>
        {posting.subject.map(c => {
          return <div key={c}>{c} </div>;
        })}
      </li>
      <li><b>Publish date:</b> {posting.publish_date}{" "}
      </li>

      <li>   <b>Price per hour:</b> {posting.price_per_hour}{" "}
      </li>

      <li> <b>Reviewed: </b>
        {`${posting.reviewed}`}{" "}</li>


      <hr />
    </div>

    <div className = "justify-content-end">
    <img style={mystyle} src={`http://localhost:8000${posting.image}`}/> 


    {/* Make an appointment should take you to the tutor profile page
    Where you can see tutor schedule  */}
      <button style = {{display:"block"}}onClick ={history.push(`/profile/?userId=`)}style={{display:"block"}}>Make an appointment</button> 

      </div>
    </div>

    
  );
};

export default Result;