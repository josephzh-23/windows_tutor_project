import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const successToast = (msg)=>{

  Toast.fire({
    icon:"success",
    title: msg
  }
  )
}

const errorToast = (msg)=>{

  Toast.fire({
    icon:"error",
    title: msg
  }
  )
}
const makeToast = (type, msg) => {
    Toast.fire({
        icon:type, 
        title: msg
    })
}
export {successToast, makeToast, errorToast}