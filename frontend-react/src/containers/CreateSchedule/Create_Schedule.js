import { useEffect } from 'react';
// import "../../dist/jquery.schedule.css"
import "./JQuery_Schedule.css"
// import "../../dist/jquery.schedule.js"
import $ from 'jquery';
import { axios } from './../../Reusable_React/react-axios-master/src/axios';
import { errorToast, successToast } from '../../Toaster.js';
import { getCookie } from './../../Utilities/Util';
require('jquery-schedule')


const Create_Schedule = () => {

    
    var weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'frieday', 'satuday', 'sunday']
    var csrfToken = getCookie('csrftoken')
    var resourceUrl = "../../dist/jquery.schedule.js"

    // Contains an array of timeObj to be sent to backend
    var scheduleArray  = [] 

    class loaded_user_schedule{
        constructor(which_day, periodArray) {
            this.which_day = which_day
              this.periodArray = periodArray
             
          }

    }
    // Containing the time period and the day to be saved to backend
    /*
    Example of this: [ monday, array[3]]
    */
    class saved_time_obj {
        constructor(which_day, periodArray) {
          this.which_day = which_day
            this.periodArray = periodArray
           
        }
    }


    var scheduleArray = []

    useEffect(() => {
        

  
        getSchedules()
                   // Full options
                   window.$('#schedule').jqs({
                    mode: 'edit',
                    hour: 24,
                    days: 7,
                    periodDuration: 60,
                    data: [],
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
                    onRemovePeriod: function () { },
                    onDuplicatePeriod: function () { },
                    onClickPeriod: function () {
                        // console.log("I am added");
                    }
                });
    });



    
    const getSchedules = async () => {
        const res = await axios.get("schedule/getschedule/",{
          headers: {Authorization: `Token ${sessionStorage.getItem('token')}`
        }, 'X-CSRFToken': csrfToken}).catch((err) => {
          console.log("Error:", err);
        });
        if (res && res.data) {
    
          load_user_schedule(res.data)
          console.log(res);
    
        }
      };
    

      var load_user_schedule=(schedule)=>{

        schedule.forEach(eachDay=>{

            console.log(eachDay);

            // For 
            eachDay["tasks"].forEach(eachPeriod=>{


                var time_period
              var start_time =  eachPeriod.start_time
              var end_time = eachPeriod.end_time


            })
        })
                  // Full options
        // window.$('#schedule').jqs({
        //     mode: 'edit',
        //     hour: 24,
        //     days: 7,
        //     periodDuration: 60,
        //     data: [],
        //     periodOptions: true,
        //     periodColors: [],
        //     periodTitle: '',
        //     periodBackgroundColor: 'rgba(82, 155, 255, 0.5)',
        //     periodBorderColor: '#2a3cff',
        //     periodTextColor: '#000',
        //     periodRemoveButton: 'Remove',
        //     periodDuplicateButton: 'Duplicate',
        //     periodTitlePlaceholder: 'Title',
        //     daysList: [
        //         'Monday',
        //         'Tuesday',
        //         'Wednesday',
        //         'Thursday',
        //         'Friday',
        //         'Saturday',
        //         'Sunday'
        //     ],
        //     onInit: function () { },
        //     onAddPeriod: function () {

            

        //     },
        //     onRemovePeriod: function () { },
        //     onDuplicatePeriod: function () { },
        //     onClickPeriod: function () {
        //         // console.log("I am added");
        //     }
        // });

      }
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

            console.log('the time is basically ', period_array_per_day);

            // Build an obj
            var period_per_day = new saved_time_obj(weekdays[index], period_array_per_day )
            console.log('each time obj is', period_per_day);
         

            scheduleArray.push(period_per_day)

          
        })

        send_event_data(scheduleArray)
    }

    // Send user schedule data to backend 
    var send_event_data = async (schedule) => {

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
                successToast("Your schedule has been created successfully")
            }
            else {
                errorToast("Something went wrong, sorry post can't be created")
            }
        console.log('the returned data is ', res);
    }
    return (

        <div className="create-schedule">
            <div id="schedule">


            </div>
            <div className="joseph">
                <button onClick ={saveSchedule}className="btn">Save My Schedule</button>
            </div>

        </div>
    )


    var get_user_schedule=()=>{


    }

}

export default Create_Schedule