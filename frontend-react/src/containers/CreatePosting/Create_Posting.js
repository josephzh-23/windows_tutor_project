
import { useState, useContext } from 'react';
import { axios } from './../../Reusable_React/react-axios-master/src/axios';
import "./Create_Posting.css"
import { UserContext } from './../../Reusable_React/UserContext';
import { useEffect } from 'react';
import { errorToast, successToast } from '../../Toaster.js';
import { validate_form } from '../../Reusable_Vanilla/validate_form.js';
const Create_Posting = () => {


  useEffect(() => {

    console.log('user name is ', authUser.username)
  })
  const { authUser } = useContext(UserContext)
  const deleteReminder = async (id) => {
    const response = await axios.delete(`/reminders/${id}`).catch((err) => {
      console.log("Error deleting: ", err);
    });

    // if (response) await getReminders();
  };


  // ALl the data in formData gets updated
  const handleChange = (e) => {

    //Handle special case for the subject
    // Since it will be in array format
  // So you can have > 1 subjects
    if (e.target.name == "subject") {

      var subjects = e.target.value.split(',')
      console.log(subjects)
      setFormData({
        ...formData, "subject": subjects
      })


    } else {

      setFormData({
        // This makes sure you keep the data 
        // that's already there
        ...formData,
      //  "body": "value of body"
        [e.target.name]: e.target.value.trim(),
      });
    }
  };
  const Posting = (props) => {
    const { reminder, time, id, onDelete } = props;

    return (
      <div className="reminder-wrapper">
        <div className="reminder-container">
          <div className="reminder-id">{id}</div>
          <div className="reminder">{reminder}</div>
          <div className="reminder-time">{time}</div>
        </div>
        <span className="reminder-remove" onClick={() => onDelete(id)}>
          ❌
        </span>
      </div>
    );
  }
  const [postings, set_postings] = useState([]);


  const [formData, setFormData] = useState({
    name: authUser.username
  });

  const noReminder = !postings || (postings && postings.length === 0);

  // const getReminders = async () => {
  //   const response = await axios.get("tutor/create_posting/").catch((err) => {
  //     console.log("Error:", err);
  //   });
  //   if (response && response.data) {
  //     set_postings(response.data);
  //   }
  // };

  // Fired when you hit "add" button 
  const add_posting = async (event) => {
    event.preventDefault();
      // Need to first validate the data object
    if(!validate_form(formData)){
        errorToast('Please fill out all the fields')
    }else{
   

    console.log(formData);


    // formData is the data
    const res = await axios.post("tutor/postings/", formData).catch((err) => {
      console.log("Error: ", err);
    });

    // If a response comes back
    if (res)
      //  await getReminders();

      if(res.status==200){

        
        successToast("Tutor posting created successfully")
      }
      else{
        errorToast("Something went wrong, sorry post can't be created")
      }
      console.log('the returned data is ', res);
      // setFormData({});
    }
  };

  return (
    <div className="App">
      <h3>Create Posting</h3>
      {!noReminder &&
        postings.map((reminder, idx) => (
          <Posting key={idx} {...reminder} onDelete={deleteReminder} />
        ))}
      <br />

      <form className="mb-5" onSubmit={add_posting}>
        {/* <label htmlFor="id">Id</label>
           
            <input name="id" placeholder="Id" */}

<div className="mb-4">
           <div> <label htmlFor="title">Please enter the title you want</label></div>
            <input name="title" onChange= {handleChange}/>
          </div>
        <div className="row">
       
          <div className="form-group col-3">
            <label htmlFor="subject"><b>Please enter the subject you want to teach
              , separated by comma</b></label>
            <div className="input-group">
              <textarea style={{ height: "100px" }} id="w3review" name="subject"
                onChange={handleChange} defaultValue="">

              </textarea>

            </div>
          </div>

          <div className="form-group col-sm-7">
            <label style={{ display: "block" }} htmlFor="body">Posting Description</label>

            <textarea id="w3review" name="body"
              onChange={handleChange} defaultValue="">

            </textarea>
          </div>
        </div>
        <div className="row">
          <div className="form-group col-sm-3">
            <label htmlFor="publishDateMin">Publish date available</label>
            <input type="date" onChange= {handleChange} className="form-control" id="publishDateMin" name="publish_date" />
          </div>



          <div className="col-sm-2">
            <label htmlFor="viewCountMin">Minimum Hourly rate</label>
            <input type="number" className="form-control" id="viewCountMin"
              placeholder="0" name="min_hourly_rate"
            />
          </div>
          <div className="col-sm-2">
            <label htmlFor="viewCountMax">Maximum Hourly rate</label>
            <input type="number" className="form-control" id="viewCountMax" placeholder="10000?" name="max_hourly_rate" />
          </div>
        </div>
        <button type="submit">Add</button>
      </form >
    </div>
  );

  
  
}


export default Create_Posting