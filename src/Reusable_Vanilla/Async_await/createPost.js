
const posts = []
function createPost(post){

    return new Promise((resolve, reject)=>{

        setTimeout(()=>{
            posts.push(post)
            const error = false
            if(!error){
                resolve()
            }else{
                reject('Error, something went wrong')
            }
        }, 2000)
    })
}