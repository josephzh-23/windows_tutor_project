
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { getCookie } from './../../getCookie';
import { errorToast, makeToast } from '../../Toaster.js';
import { backend_url } from './../../Contants';

const SearchFilter = () => {
    

  var csrfToken = getCookie('csrftoken')
  console.log(csrfToken);

    //Here formData is initalized as en empty objct
     // Each input will have a value with a key and value 
     const [values, setValues]  = useState({

      username: '',
      email:'',
      password:'',
      password2:''
  })


  const handleSubmit = (e)=>{

    e.preventDefault()
    
    axios(
      {
       method: 'POST',
     url: "http://127.0.0.1:8000/accounts/1/accountUpdate/",
     data:value,
       headers: {
          Authorization: "Token " + sessionStorage.getItem("token"),
         'Content-type':'application/json',
         'X-CSRFToken': csrfToken
       }
      })
      .then(res => {

         
          console.log(res.data);
          makeToast("error", res.data)
          // console.log("the resut ",extra.isFriend , extra.isSelf);
      }).catch(err => {
          console.log(err)
      })


  }
  const handleChange =e=>{

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
  }


  useEffect(()=>{

    console.log("search filter page");
  })
    return(


        <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
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
        </nav>
    
        <main role="main" className="container">
    
          <h3>Filter Tutors</h3>
          <form onSubmit={handleSubmit} method="post" >
            <div className="form-row">
                <div className="form-group col-12">
                    <div className="input-group">
                        <input className="form-control py-2 border-right-0 border" type="search" name="title_contains" placeholder="Title contains..." />
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
                        <input className="form-control py-2 border-right-0 border" type="search" name="id_exact" placeholder="ID exact..." />
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
              <div className="form-group col-md-2 col-lg-2">
                <label htmlFor="viewCountMin">Minimum View Count</label>
                <input type="number"  className="form-control" id="viewCountMin" placeholder="0" name="view_count_min"/>
              </div>
              <div className="form-group col-md-2 col-lg-2">
                <label htmlFor="viewCountMax">Maximum View Count</label>
                <input type="number" className="form-control" id="viewCountMax" placeholder="10000?" name="view_count_max"/>
              </div>
              <div className="form-group col-md-2 col-lg-2">
                <label htmlFor="publishDateMin">Publish date minimum</label>
                <input type="date" className="form-control" id="publishDateMin" name="date_min"/>
              </div>
              <div className="form-group col-md-2 col-lg-2">
                <label htmlFor="publishDateMax">Publish date maximum</label>
                <input type="date" className="form-control" id="publishDateMax" name="date_max"/>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="category">Category</label>
                <select id="category" className="form-control" name="category">
                  <option value="selected">Choose...</option>

                  {/* {% for cat in categories %} */}
                  {/* <option value="{{ cat }}">{{ cat }}</option> */}
                  {/* {% endfor %} */}
                </select>
              </div>
            </div>
           
        
          
            <div className="form-group">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="reviewed" name="reviewed"/>
                <label className="form-check-label" htmlFor="reviewed">
                  Reviewed
                </label>
              </div>
            </div>
            <div className="form-group">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="notReviewed" name="notReviewed"/>
                <label className="form-check-label" htmlFor="notReviewed">
                  Not reviewed
                </label>
              </div>
            </div>

            <button type="submit"  className="btn btn-primary">Search</button>
                     

        </form>
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
     */}
                </main>

                </div>
    )
}

export default SearchFilter