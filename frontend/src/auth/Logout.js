function Logout(){
    function handleLogout(){
        localStorage.removeItem("token")
        window.location.reload()
    }
    return(
        <button onClick={handleLogout}>Log out</button>
    )
}

export default Logout;