
import { useState, useContext } from 'react';
import { axios } from './../../Reusable_React/react-axios-master/src/axios';
import "./Create_Posting.css"
import { UserContext } from './../../Reusable_React/UserContext';
import { useEffect } from 'react';
import { errorToast, successToast } from '../../Toaster.js';
import { validate_form } from '../../Reusable_Vanilla/validate_form.js';


import { INITIAL_EVENTS, createEventId } from '../../event-util.js';
import { getCookie } from '../../Reusable_Vanilla/Utilities/Util';

// import Calendar from 'tui-calendar'; /* ES6 */
// import "tui-calendar/dist/tui-calendar.css";

// // If you use the default popups, use this.
// import 'tui-date-picker/dist/tui-date-picker.css';
// import 'tui-time-picker/dist/tui-time-picker.css';

//Code for using the calendar library here
const Create_Posting = () => {
  var csrfToken = getCookie('csrftoken')

  useEffect(() => {


    // document.addEventListener('DOMContentLoaded', function() {
      var calendarEl = document.getElementById('calendar');
    

    // });
    getSchedules()
    // var calendar = new Calendar('#calendar', {
    //   defaultView: 'day',
    //   taskView: true,
    //   template: {
    //     monthDayname: function(dayname) {
    //       return '<span class="calendar-week-dayname-name">' + dayname.label + '</span>';
    //     }
    //   }
    // });
    // console.log('user name is ', authUser.username)
  

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

  const [state, setState] = useState({
    weekendsVisible: true,
    currentEvents: []
  })
  const [postings, set_postings] = useState([]);


  const [formData, setFormData] = useState({
    name: authUser.username
  });

  const noReminder = !postings || (postings && postings.length === 0);

  const getSchedules = async () => {
    const res = await axios.get("schedule/getschedule/",{
      headers: {Authorization: `Token ${sessionStorage.getItem('token')}`
    }, 'X-CSRFToken': csrfToken}).catch((err) => {
      console.log("Error:", err);
    });
    if (res && res.data) {

      // load_user_schedule(res)
      console.log(res);

    }
  };

  // Fired when you hit "add" button 
  const add_posting = async (event) => {
    event.preventDefault();
    // Need to first validate the data object
    // if (!validate_form(formData)) {
    //   errorToast('Please fill out all the fields')
    // } else {


      console.log(formData);


      // formData is the data
      const res = await axios.post("tutor/postings/", formData).catch((err) => {
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

  // var handleWeekendsToggle = () => {
  //   setState({
  //     weekendsVisible: !state.weekendsVisible
  //   })
  // }

  // var load_user_schedule = (days)=>{
  //   let calendarApi = selectInfo.view.calendar
  //   calendarApi.unselect() // clear date selection

  //   // // Add the events to the calendar here 
  //   days.forEach(day=>{

  //     day.forEach(task=>{
  //     calendarApi.addEvent({
  //       id: eventId,
  //       title:title,
  //       start: task.start_time,
  //       end: task.task_time,
  //       allDay: selectInfo.allDay
  //     })
  //     })
  //   })

  // }
  // var handleDateSelect = (selectInfo) => {

  //   console.log(selectInfo);
  //   let title = prompt('Please enter a new title for your event')
  //   let calendarApi = selectInfo.view.calendar

  //   calendarApi.unselect() // clear date selection

  //   var eventId = createEventId()


  //   if (title) {
  //     calendarApi.addEvent({
  //       id: eventId,
  //       title: title,
  //       start: selectInfo.startStr,
  //       end: selectInfo.endStr,
  //       allDay: selectInfo.allDay
  //     })


  //     // Also need to send data to backend 
  //     send_event_data(eventId, title, selectInfo)
  //   }
  // }

  var send_event_data = async(eventId,title, selectInfo)=>{

    
    // Parse the week day data here 
    var which_day = selectInfo.start.toString().substring(0,3)
  

     var strippedStart = stripDate(selectInfo.startStr)

     var strippedEnd = stripDate(selectInfo.endStr)
    var evtInfo = {
        'id': eventId, 
        'title': title,
        // 'start': selectInfo.start,
        'start': strippedStart,
        // 'end': selectInfo.end,
        'end': strippedEnd,

        'day': which_day
    }
    console.log(evtInfo);

    const res = await axios.post("schedule/create/", evtInfo,
    {
      headers: {Authorization: `Token ${sessionStorage.getItem('token')}`
    }, 'X-CSRFToken': csrfToken}).catch((err) => {
      console.log("Error: ", err);
    });

    // If a response comes back
    if (res)
      //  await getReminders();

      if (res.status == 200) {
        successToast("Your event has been created successfully")
      }
      else {
        errorToast("Something went wrong, sorry post can't be created")
      }
    console.log('the returned data is ', res);
  }

 var handleEventClick = (clickInfo) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  var handleEvents = (events) => {
    setState({
      currentEvents: events
    })
  }


  // A typical time: "2021-08-10T06:30:00-07:00"
  // what's wanted: "06:30:00"
  var stripDate=(time)=>{

    //Locate the 'T' letter to separate time 
    var start_idx = time.indexOf('T') +1

    // Get the 3rd '-' position
    var end_idx = getPos(time, '-', 3)
    console.log('the end index ', end_idx);
    
    var stripped_time = time.substring(start_idx, end_idx)
    return stripped_time
  }

  /*
    i: is the occurence (3rd occurence)
  */
  function getPos(str, subStr, i) {
    return str.split(subStr, i).join(subStr).length;
}

  return (


    


<div>
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
          <div id="calendar" style={{ height: "800px" }}></div>
          <div> <label htmlFor="title">Please enter the title you want</label></div>
          <input name="title" onChange={handleChange} />
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
            <input type="date" onChange={handleChange} className="form-control" id="publishDateMin" name="publish_date" />
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
function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}



export default Create_Posting