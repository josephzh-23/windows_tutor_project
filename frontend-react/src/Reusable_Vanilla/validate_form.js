export const validate_form = (values)=>{

    var error
  
    for (const [key, value] of Object.entries(values)) {
      console.log(`${key}: ${value}`);
      
      error = (value===null)? true: false
      
    }
    console.log('error val is', error);
    return error 
  }