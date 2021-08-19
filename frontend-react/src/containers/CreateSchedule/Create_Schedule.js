import { useEffect } from 'react';
// import "../../dist/jquery.schedule.css"
import "./JQuery_Schedule.css"
// import "../../dist/jquery.schedule.js"
import $ from 'jquery';
import { axios } from './../../Reusable_React/react-axios-master/src/axios';
import { errorToast, successToast } from '../../Toaster.js';
import { getCookie } from './../../Utilities/Util';
import { useHistory, useLocation } from 'react-router-dom';
import { useState } from 'react';

require('jquery-schedule')


const Create_Schedule = ({location}) => {

    //Determine whethter to create or edit schedule
    var [editMode, set_edit_mode] = useState(false)

    var [schedule_loading_array, loadSchedule] = useState([])
    class day_tasks_per_day{
        constructor(which_day, periodArray) {
            this.day = which_day
              this.periods = periodArray
             
          }
    } 
    var csrfToken = getCookie('csrftoken')

    // No need
    // var history = useHistory()

    var weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'frieday', 'satuday', 'sunday']

    var resourceUrl = "../../dist/jquery.schedule.js"

    // Contains an array of timeObj to be sent to backend
    var scheduleArray  = [] 

    // Containing the time period and the day to be saved to backend
    
    /*
    Example of this: [ monday, array[3]]
        [monday, ['8:00- 12:00', '1:00-3:00']]
    */
    class saved_time_obj {
        constructor(which_day, periodArray) {
          this.which_day = which_day
            this.periodArray = periodArray
           
        }
    }


    

    useEffect(() => {



       
        if(location.state!=null){
            set_edit_mode(location.state.editMode)
            fetchSchedules()
        }else{

          fetchSchedules()
        }

            
            
            
       
              
    });

  function init_empty_calendar(){

    // Step 1 dynaically add schedule elem
    window.$('#schedule').remove()
    var newSchedule = document.createElement('div')
    newSchedule.id= 'schedule'
    window.$('.create-schedule').append(newSchedule)
     // Step 2: load the data into the plugin 
              // Full options
    window.$('#schedule').jqs({
        mode: 'edit',
        hour: 24,
        days: 7,
        periodDuration: 60,
        data: schedule_loading_array,
        periodOptions: true,
        periodColors: [],
        periodTitle: '',
        periodBackgroundColor: 'rgba(82, 155, 255, 0.5)',
        periodBorderColor: '#2a3cff',
        periodTextColor: '#000',
        periodRemoveButton: 'Remove',
        periodDuplicateButton: 'Duplicate',
        periodTitlePlaceholder: 'Title',
        daysList: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ],
        onInit: function () { },
        onAddPeriod: function () {
  
        
  
        },
        onRemovePeriod: function () { 

            
        },
        onDuplicatePeriod: function () { },
        onClickPeriod: function () {
            // console.log("I am added");
        }
    });
  }
  



    
var load_user_schedule=(schedule)=>{

    // 1. Parse the data coming back in 
    schedule.forEach((eachDay, i)=>{
        // Construct a day obj
        var tasks_each_day = new day_tasks_per_day(i, [])
    
        // For 
        eachDay["tasks"].forEach(eachPeriod=>{

            // data: [
            //     {
            //       day: 0,
            //       periods: [
            //         ['20:00', '00:00'],
            //         ['20:00', '22:00'], // Invalid period, not displayed
            //         ['00:00', '02:00']
            //       ]
            //     }
  
          var taskArray = []
          // Time format must be below
          //["14:00", "19:00"]
          taskArray.push(eachPeriod.start_time.slice(0,5))
          taskArray.push(eachPeriod.end_time.slice(0,5))
            
            // Add task array to the array of the tasks_per_day obj
            tasks_each_day.periods.push(taskArray)
            // console.log('The existing tasks are ', tasks_each_day);
        })
  
        schedule_loading_array.push(tasks_each_day)
        console.log('Complete schedule ',schedule_loading_array);
  
  
    })
  
    //Recreate schedule element to hack reloading error
    window.$('#schedule').remove()
    var newSchedule = document.createElement('div')
    newSchedule.id= 'schedule'
    window.$('.create-schedule').append(newSchedule)
    
    // Step 2: load the data into the plugin 
              // Full options
    //  window.$('#schedule').empty()
    window.$('#schedule').jqs({
        mode: 'edit',
        hour: 24,
        days: 7,
        periodDuration: 60,
        data: schedule_loading_array,
        periodOptions: true,
        periodColors:[] ,
        periodTitle: '',
        periodBackgroundColor: 'rgba(82, 155, 255, 0.5)',
        periodBorderColor: '#2a3cff',
        periodTextColor: '#000',
        periodRemoveButton: 'Remove',
        periodDuplicateButton: 'Duplicate',
        periodTitlePlaceholder: 'Title',
        daysList: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ],
        onInit: function () { },
        onAddPeriod: function () {
  

  
        },
        onRemovePeriod: function () {

            // Update the tasks in each day 

         },
        onDuplicatePeriod: function () { },
        onClickPeriod: function () {
            // console.log("I am added");
        }
    });
   
    // loadSchedule(schedule_loading_array)
  
   
  }
  
    var fetchSchedules = async () => {
        const res = await axios.get("schedule/getschedule/",{
          headers: {Authorization: `Token ${sessionStorage.getItem('token')}`
        }, 'X-CSRFToken': csrfToken}).catch((err) => {
          console.log("Error:", err);
        });
        if (res && res.data) {
            console.log('the data received is', res.data);
    
        
        if(res.data.scheduleExists==true){
            set_edit_mode(true)
            console.log(res.scheduleExists);
          load_user_schedule(res.data.data)
          
          console.log('the data received is', res.data);
        }else{
            init_empty_calendar()
        }
    
        }
      };
    
   
  
    // A hack to avoid duplciate in the last 2 elem
    var check_time_duplicate = (second_last_elem, last_elem) => {

        if (second_last_elem != last_elem) {

            return false
        } else {
            return true
        }
    }






    var saveSchedule = async (e) => {

         e.preventDefault()
        update_schedule_array()
       if(editMode == true){ 
        replace_user_schedule(scheduleArray)
    
       }else{
        save_user_schedule(scheduleArray)
       }
    }

    //Triggered the stored data when user hits delete 
    // or add schedule in the UI 
    var update_schedule_array = ()=>{



        // Make sure only 7 days can exist in arr
        if(scheduleArray.length<7){
            // Retunr a list of days
            var daysSelected = window.$('.jqs').find('.jqs-day')
            // Cvrt jquery -> JS
            console.log('date object', daysSelected);
    
            // Loop thru the 'jsq-period' inside each 'jqs-day'
            // Here elem is an JS obj
            daysSelected.each((index, elem) => {
                // get time period per day
                var period_array_per_day = elem.innerText.split('\n')
    
                // If array size >1, and last 2
                // elem are duplicate -> chop off last elem
                if (period_array_per_day.length > 1) {
    
                    var size = period_array_per_day.length
                    if (check_time_duplicate(period_array_per_day
                    [size - 1], period_array_per_day[size - 2])) {
                        period_array_per_day.pop()
                    }
    
                }
    
                // console.log('the time is basically ', period_array_per_day);
    
                // Build an obj
                var period_per_day = new saved_time_obj(weekdays[index], period_array_per_day )
                // console.log('each time obj is', period_per_day);
             
    
                scheduleArray.push(period_per_day)
    
              
            })

            // console.log('the complete schedule is', scheduleArray)
        }

    }
    // For user creating schedule for the first time
    var save_user_schedule = async (schedule) => {

        console.log('final schedule is ', scheduleArray);

        const res = await axios.post("schedule/create/", schedule,
            {
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('token')}`
                }, 'X-CSRFToken': csrfToken
            }).catch((err) => {
                console.log("Error: ", err);
            });

        // If a response comes back
        if (res)
            //  await getReminders();

            if (res.status == 200) {
                successToast("Your schedule has been saved successfully")
            }
            else {
                errorToast("Something went wrong, sorry post can't be created")
            }
        console.log('the returned data is ', res);
    }

      // For user replacing existing schedule
      var replace_user_schedule = async (schedule) => {

        console.log('replace is called');

        const res = await axios.post("schedule/replace/", schedule,
            {
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('token')}`
                }, 'X-CSRFToken': csrfToken
            }).catch((err) => {
                console.log("Error: ", err);
            });

        // If a response comes back
        if (res)
            //  await getReminders();

            if (res.status == 200) {
                successToast("Your schedule has been saved successfully")
            }
            else {
                errorToast("Something went wrong, sorry post can't be created")
            }
        console.log('the returned data is ', res);
    }
    return (

        <div className="create-schedule">
            {/* <div id="schedule"></div> */}
            <div className="joseph">
                <button onClick ={saveSchedule}className="btn">
                    {editMode? "Edit your schedule" : "Create your schedule"}
                </button>
            </div>

        </div>
    )


}

export default Create_Schedule