// Functino will run the callback 
// and return the promise
export function build_promise(callback){

    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            callback()
            const error = false
            if(!error){
                resolve()
            }else{
                reject('Error, something went wrong')
            }
        }, 0)

    })
}
// An example of a function that returns promise
