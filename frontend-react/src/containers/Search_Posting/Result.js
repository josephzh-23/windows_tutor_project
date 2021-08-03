//Will contain all the data returned from the react search page

import React from "react";

const Result = ({ journal: posting }) => {
  return (
    <div mt="30dp">
   

         <list> <b>Title:</b> {posting.title}{" "}</list>
  
         
  
          {/* <b>Author:</b> {posting.author.name}{" "} */}
          <li><b>Author:</b> {posting.author}{" "}</li>
   
                  <li>  <b>Subjects:</b>
          {posting.subject.map(c         => {
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
  );
};

export default Result;