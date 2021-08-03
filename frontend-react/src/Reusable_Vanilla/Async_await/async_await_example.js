async function init(){
    await createPost({title: 'Post three', body: 'This is post three'})

    // will get called if createPost successful
    getPosts()
}

init()