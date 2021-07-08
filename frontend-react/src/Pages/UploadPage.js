
import axios from "axios";
import {useState} from "react"
const UploadPage  = () => {

    //Here formData is initalized as en empty objct
    const [formData, setFormData] = useState({})
    const fileSelectedHandler = event=>{
        // tis is the 1st file in a multi-file 
       console.log(event.target.files[0]);
       setFormData(event.target.files[0])
   }
    // const handleChange = (e) => {
    //     setFormData({...formData, [e.target.name]: e.target.value})
    // }
    const handleSubmit= (e)=>{
        e.preventDefault();
        console.log(formData);
        axios.post('http://localhost:8000/user/upload',formData)
        .then((response)=>{
            console.log(response)
        })
    }
    return ( 
        
        <form method="post" onSubmit={handleSubmit} className="joseph" encType ="multipart/form-data">
            <input type="file" name = "avatar" onChange={fileSelectedHandler}/>
                <button>Click on me to upload te picture </button>
            </form>
    
    );
}
 
export default UploadPage;