

const SearchFilter = () => {
    
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
          <form method="GET" action=".">
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
                <label for="viewCountMin">Minimum View Count</label>
                <input type="number"  className="form-control" id="viewCountMin" placeholder="0" name="view_count_min"/>
              </div>
              <div className="form-group col-md-2 col-lg-2">
                <label for="viewCountMax">Maximum View Count</label>
                <input type="number" className="form-control" id="viewCountMax" placeholder="10000?" name="view_count_max"/>
              </div>
              <div className="form-group col-md-2 col-lg-2">
                <label for="publishDateMin">Publish date minimum</label>
                <input type="date" className="form-control" id="publishDateMin" name="date_min"/>
              </div>
              <div className="form-group col-md-2 col-lg-2">
                <label for="publishDateMax">Publish date maximum</label>
                <input type="date" className="form-control" id="publishDateMax" name="date_max"/>
              </div>
              <div className="form-group col-md-4">
                <label for="category">Category</label>
                <select id="category" className="form-control" name="category">
                  <option selected>Choose...</option>
                  {/* {% for cat in categories %} */}
                  {/* <option value="{{ cat }}">{{ cat }}</option> */}
                  {/* {% endfor %} */}
                </select>
              </div>
            </div>
           
        
          
            <div className="form-group">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="reviewed" name="reviewed"/>
                <label className="form-check-label" for="reviewed">
                  Reviewed
                </label>
              </div>
            </div>
            <div className="form-group">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="notReviewed" name="notReviewed"/>
                <label className="form-check-label" for="notReviewed">
                  Not reviewed
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">Search</button>
                     

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