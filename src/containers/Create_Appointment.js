import { useEffect, useState } from "react"

import $ from "jquery"
import axios from "axios"
import { errorToast, successToast } from "../Toaster"
import { getCookie } from "../getCookie"


/*
    Here will also pass in the tutor's info and studen's info
    for receiver and sender 
*/
export const Create_Appointment=()=>{
  var csrfToken = getCookie('csrftoken')

  // Each input will have a value with a key and value 
  const [values, setValues]  = useState({

    date: null,
    startTime:'',
    endTime:'', 

})

    var handleChange =(e)=>{

      // This will set things based on the target name 
        setValues({
          ...values,
          [e.target.name]: e.target.value
        })

        // Can also do 
        // const {name, value} = e.target
        // setValues({
        //   ...values,
        //   [name]:value
        // })
        console.log(values);
    }

    useEffect(()=>{
        // window.$( function() {
            window.$("#datepicker").datepicker();
        //   } );
    


    },[])


      // Fired when you hit "add" button 
  const handleSubmit = async (event) => {
    event.preventDefault();

    values.date= window.$('#datepicker').val()

    
  
    // Need to first validate the data object
    // if (!validate_form(formData)) {
    //   errorToast('Please fill out all the fields')
    // } else {


      console.log(values);


      // formData is the data
      const res = await axios.post("http://localhost:8000/payments/create-appointment/", values,
      {
        headers: {
            Authorization: `Token ${sessionStorage.getItem('token')}`
        }, 'X-CSRFToken': csrfToken
    }
      ).catch((err) => {
        console.log("Error: ", err);
      });

      // If a response comes back
      if (res)
        //  await getReminders();

        if (res.status == 200) {


          successToast("Tutor posting created successfully")
        }
        else {
          errorToast("Something went wrong, sorry post can't be created")
        }
      console.log('the returned data is ', res);
      // setFormData({});
    // }
  };
  function dissectDate(date) {
    var matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(date);
    if (matches == null) return false;
    var d = matches[2];
    var m = matches[1] - 1;
    var y = matches[3];
    var composedDate = new Date(y, m, d);
   return composedDate;
}
return(

    <form onSubmit={handleSubmit} className='form'>

    <p>Date: <input type="text" name="date" id="datepicker"  value={values.date}
                onChange={handleChange}/></p>
                
    <label htmlFor="fname">Start time</label><br/>
    <input type="time" name="startTime" id="startTime"      value={values.startTime}
                onChange={handleChange}/><br/>

    <label htmlFor="lname">End time</label><br/>
    <input type="time" id="lname"  name="endTime"  value={values.endTime}
                onChange={handleChange}/>

        <div>
            <button className='form-input-btn' type='submit'  style={{marginBottom: '500px'}}>
             Create appointment 
            </button>
            </div>
  </form> 
)
}