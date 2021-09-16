//async /await / fetch


// THis how you use useEffect with async
useEffect(()=>{
async function fetchUsers(){
    const res = await fetch('https://jsonplaceholder.typicode.com/users');

    const data = await res.json()
    console.log(data);
}
fetchUsers()
})