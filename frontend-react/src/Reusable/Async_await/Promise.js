export function build_promise(callback){
// Functino will run the callback 
// and return the promise
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
