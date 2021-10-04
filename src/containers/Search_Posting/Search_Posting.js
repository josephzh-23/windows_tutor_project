
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { getCookie } from '../../getCookie';
import { errorToast, makeToast } from '../../Toaster.js';
import { backend_url } from '../../Contants';
import Result from './Result';
import { displayLoadingSpinner } from '../../Reusable_Vanilla/Utilities/Util';
import useComponentVisible from '../../Reusable_React/Custom_hook/useComponentVisible';

const Search_Posting = () => {
    

  var csrfToken = getCookie('csrftoken')
  console.log(csrfToken);

  // This will be uesd to hold the data returned from the axios request 
  const [postings, setPostings] = useState([]);
    const [isLoading, setLoading] = useState(
      false)
    //Here formData is initalized as en empty objct
     // Each input will have a value with a key and value 
     const [formData, setFormData]  = useState({

      title_contains: '',
      id_exact:'', 
      title_or_author:"", 
      hourly_rate_count_min:"", 
      hourly_rate_count_max:''
      // date_min,
      // date_max,
      // subject,
      // reviewed,
      // not_reviewed
  })

  // Used to show the results here 
 
  const returned_results = (postings) => (
    <ul style={{ listStyleType: "none" }}>
      {postings.map(j => {
        return <Result journal={j} key={j.id} />;
      })}
    </ul>
  );


  // 
  const handleSubmit = (e)=>{

    e.preventDefault()
    console.log(e.target.elements.length);
    // Build the form data here

    const form = e.target
    // const formData = new FormData(e.target)

    // const data = {};
   
 
    
    var formData = serializeForm(form)                                                                                                          
    // Need to first validate the data object
    // if(!validate_info(data)){
    //     errorToast('Please fill out all the fields')
    // }
    
    // else{

      setLoading(true)
    axios(
      {
       method: 'POST',
     url: "http://127.0.0.1:8000/accounts/search_posting/",
     data:serializeForm(form),
       headers: {
          Authorization: "Token " + sessionStorage.getItem("token"),
         'Content-type':'application/json',
         'X-CSRFToken': csrfToken
       }
      })
      .then(res => {
          console.log(res.data);
          setLoading(false)
          setPostings(res.data)


          // console.log("the resut ",extra.isFriend , extra.isSelf);
      }).catch(err => {
        setLoading(false)
          console.log(err)
      })

    // }
  }


  var serializeForm = function (form) {
    var obj = {};
    var formData = new FormData(form);
    for (var key of formData.keys()) {
      obj[key] = formData.get(key);
    }
    return obj;
  };
const validate_info = (values)=>{

  var error

  for (const [key, value] of Object.entries(values)) {
    console.log(`${key}: ${value}`);
    
    error = (value===null)? true: false
    
  }
  console.log('error val is', error);
  return error 
}


  // For this project here, we will skip using handleChange()
  const handleChange =e=>{

      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })

      // Can also do 
      // const {name, value} = e.target
      // setValues({
      //   ...values,
      //   [name]:value
      // })
  }


  useEffect(()=>{

    console.log("search filter page");
  })

  const handleSubmitDummy = (e) => {
    e.preventDefault();
  }

  const FilterForm = () => {
    return (
      <form className="search-tutor-student-filter-form p-3" onSubmit={handleSubmitDummy} >
          <div className="form-row">
              <div className="form-group col-12">
                  <div className="input-group">
                      <input className="form-control py-2 border-right-0 border" 
                      type="search" name="title_contains" placeholder="Title contains..."
                        />
                      <span className="input-group-append">
                          <div className="input-group-text bg-transparent">
                              <i className="fa fa-search"></i>
                          </div>
                      </span>
                  </div>
              </div>        
          </div>
          <div className="form-row">
              <div className="form-group col-12">
                  <div className="input-group">
                      <input className="form-control py-2 border-right-0 border" type="search"
                        name="id_exact" placeholder="ID exact..." 
                      //  onChange= {handleChange}
                      value= {formData.id_exact}/>
                      <span className="input-group-append">
                          <div className="input-group-text bg-transparent">
                              <i className="fa fa-search"></i>
                          </div>
                      </span>
                  </div>
              </div>        
          </div>
          <div className="form-row">
              <div className="form-group col-12">
                  <div className="input-group">
                      <input className="form-control py-2 border-right-0 border" type="search" name="title_or_author" placeholder="Title or author..." />
                      <span className="input-group-append">
                          <div className="input-group-text bg-transparent">
                              <i className="fa fa-search"></i>
                          </div>
                      </span>
                  </div>
              </div>        
          </div>
          
          <div className="form-row">
            <div className="form-group col-md-6">
              <label h mlFor="viewCountMin">Minimum Hourly rate</label>
              <input type="number"  className="form-control" id="viewCountMin" 
              placeholder="0" name="min_hourly_rate"
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="viewCountMax">Maximum Hourly rate </label>
              <input type="number" className="form-control" id="viewCountMax" placeholder="10000?" name="max_hourly_rate"/>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="publishDateMin">Publish date minimum</label>
              <input type="date" className="form-control" id="publishDateMin" name="date_min"/>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="publishDateMax">Publish date maximum</label>
              <input type="date" className="form-control" id="publishDateMax" name="date_max"/>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group col-md-6">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="reviewed" name="reviewed"/>
                <label className="form-check-label" htmlFor="reviewed">
                  Reviewed
                </label>
              </div>
            </div>
            <div className="form-group col-md-6">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="notReviewed" name="notReviewed"/>
                <label className="form-check-label" htmlFor="notReviewed">
                  Not reviewed
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary m-0" onClick={ () => setIsComponentVisible(false) }>Apply</button>
      </form>
    )
  }

  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  return (
       
    <div className="search-tutor-student-container">
      { isLoading ?
        displayLoadingSpinner(true) : displayLoadingSpinner(false)
      }
      {/* <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <a className="nav-link" href="#">Bootstrap</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">React</a>
                </li>
              </ul>
          </div>
      </nav> */}
    
      <main role="main" className="">
  
        <h3>Filter Tutors</h3>
        <div className="filter-component" ref= { ref }>
          <button className="btn btn-secondary m-0" onClick={ () => setIsComponentVisible(true) }>Filter</button>
          <div className="filter-form-container">
            { isComponentVisible && <FilterForm /> }
          </div>
        </div>
        
        <form onSubmit={handleSubmit} method="post" >
          <div className="search">
            <div className="row">
              <div className="col-md-5">
                <div className="search-1"> <i className="fa fa-search"></i> <input type="text" placeholder="Subject" /> </div>
              </div>
              <div className="col-md-7">
                <div>
                  <div className="search-2"> <i className="fa fa-map-marker"></i> <input type="text" placeholder="Address" /> <button type="submit" className="btn btn-primary">Search</button> </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        { (postings.length!=0) &&
        returned_results(postings)}
          {/* <hr /> */}
    
          {/* <div className="row">
            <ul>
              {/* {% for journal in queryset %} */}
                {/* <li> */}
                  {/* {{ journal.title }} */}
                  {/* <span>Author: {{ journal.author.name }}</span>
                  <span> */}
                    {/* {% for cat in journal.categories.all %}
                      {{ cat }}
                    {% endfor %} */}
                  {/* </span>
                  <span>Publish date: {{ journal.publish_date }}</span>
                  <span>View count: {{ journal.views }}</span>
                  <span>Reviewed: {{ journal.reviewed }}</span> */}
                {/* </li> */}
                {/* <hr /> */}
              {/* {% endfor %} */}
            {/* </ul>
          </div> */}
          {/* */} 
      
      </main>
    </div>
  )
}

export default Search_Posting