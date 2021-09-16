
// Used to get the generic query string frmo the window 

export const getQueryStrings= (queryParam)=> {
    // console.log(window.location.search);
    const urlParams = new URLSearchParams(window.location.search)

    const value = urlParams.get(queryParam)
    return value
  }
