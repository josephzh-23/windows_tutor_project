
import { useState, useContext } from 'react';
import FullCalendar, { formatDate } from '@fullcalendar/react'
import { axios } from './../../Reusable_React/react-axios-master/src/axios';
import "./Create_Posting.css"
import { UserContext } from './../../Reusable_React/UserContext';
import { useEffect } from 'react';
import { errorToast, successToast } from '../../Toaster.js';
import { validate_form } from '../../Reusable_Vanilla/validate_form.js';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

import interactionPlugin from '@fullcalendar/interaction';
import { INITIAL_EVENTS, createEventId } from '../../event-util.js';

// import Calendar from 'tui-calendar'; /* ES6 */
// import "tui-calendar/dist/tui-calendar.css";

// // If you use the default popups, use this.
// import 'tui-date-picker/dist/tui-date-picker.css';
// import 'tui-time-picker/dist/tui-time-picker.css';

//Code for using the calendar library here
const Create_Posting = () => {


  useEffect(() => {
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
    var calendarEl = document.getElementById('calendar');

    var calendar = new Calendar(calendarEl, {
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      initialDate: '2018-01-12',
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      dayMaxEvents: true, // allow "more" link when too many events
      events: [
        {
          title: 'All Day Event',
          start: '2018-01-01',
        },
        {
          title: 'Long Event',
          start: '2018-01-07',
          end: '2018-01-10'
        },
        {
          groupId: 999,
          title: 'Repeating Event',
          start: '2018-01-09T16:00:00'
        },
        {
          groupId: 999,
          title: 'Repeating Event',
          start: '2018-01-16T16:00:00'
        },
        {
          title: 'Conference',
          start: '2018-01-11',
          end: '2018-01-13'
        },
        {
          title: 'Meeting',
          start: '2018-01-12T10:30:00',
          end: '2018-01-12T12:30:00'
        },
        {
          title: 'Lunch',
          start: '2018-01-12T12:00:00'
        },
        {
          title: 'Meeting',
          start: '2018-01-12T14:30:00'
        },
        {
          title: 'Happy Hour',
          start: '2018-01-12T17:30:00'
        },
        {
          title: 'Dinner',
          start: '2018-01-12T20:00:00'
        },
        {
          title: 'Birthday Party',
          start: '2018-01-13T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2018-01-28'
        }
      ]
    });

    calendar.render();
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
    if (!validate_form(formData)) {
      errorToast('Please fill out all the fields')
    } else {


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
    }
  };

  var handleWeekendsToggle = () => {
    setState({
      weekendsVisible: !state.weekendsVisible
    })
  }

  var handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
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

  const renderSidebar=()=> {
    return (
      <div className='demo-app-sidebar'>
        <div className='demo-app-sidebar-section'>
          <h2>Instructions</h2>
          <ul>
            <li>Select dates and you will be prompted to create a new event</li>
            <li>Drag, drop, and resize events</li>
            <li>Click an event to delete it</li>
          </ul>
        </div>
        <div className='demo-app-sidebar-section'>
          <label>
            <input
              type='checkbox'
              checked={state.weekendsVisible}
              onChange={handleWeekendsToggle}
            ></input>
            toggle weekends
          </label>
        </div>
        <div className='demo-app-sidebar-section'>
          <h2>All Events ({state.currentEvents.length})</h2>
          <ul>
            {state.currentEvents.map(renderSidebarEvent)}
          </ul>
        </div>
      </div>
    )
  }

  return (


    <div className="App">

      {/* //Section for the calendar     */}
      <div className='demo-app'>
        {renderSidebar()}
        <div className='demo-app-main'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={state.weekendsVisible}
            initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
          eventAdd={function(){}}
          eventChange={function(){}}
          eventRemove={function(){}}
          */
          />
        </div>
      </div>



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

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  )
}

export default Create_Posting