class User {
    constructor() {};

    //Denne metode både opretter og opdaterer en bruger
    static createUser(username, password, name, email, address, juice, coffee, sandwich) {
        fetch("http://localhost:3000/user/userprofile/", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    password: password,
                    name: name,
                    email: email,
                    address: address,
                    juice: juice,
                    coffee: coffee,
                    sandwich: sandwich,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => {
                if(response.ok) {
                    alert('Your user has been created');
                    response.json().then(user => {
                        User.setLoggedInUser(user);
                        location.href = "../html/index.html";
                    });
                } else {
                    alert('Could not create user');
                }
            })  
    }
//Opdaterer bruger her
    static updateUser(id, username, password, name, email, address, juice, coffee, sandwich) {
        fetch("http://localhost:3000/user/userprofile/"+ id, {
                method: "PUT",
                body: JSON.stringify({
                    id: id,
                    username: username,
                    password: password,
                    name: name,
                    email: email,
                    address: address,
                    juice: juice,
                    coffee: coffee,
                    sandwich: sandwich,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => { 
                if(response.ok) {
                    alert('Your user has been updated');
                    response.json().then(user => {
                        User.setLoggedInUser(user);
                        location.href = "../html/index.html";
                    });
                } else {
                    alert('Could not update user');
                }
            })  
    }

    //sletter brugeren, der er logget ind. Ved at brugeren slettes logges denne også ud
    static deleteUser(id) {
        fetch("http://localhost:3000/user/userprofile/" + id, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => {
                console.log(response);
                if(response.ok) {
                    alert("Your profile has been deleted.");
                    User.removeLoggedInUser();
                    location.href = "../html/login.html";
                } else {
                    alert('Could not delete user');
                }
            })  
    }


    //Denne metode henter bruger i local storage med username
    static getUser() {
        return JSON.parse(localStorage.getItem('auth'));
    }

    static setLoggedInUser(user) {
        localStorage.setItem('auth', JSON.stringify(user));
    }
 
    //Denne metode fjerner log in
    static removeLoggedInUser() {
        localStorage.removeItem('auth');
    }

    //Y juice
    static favoriteJuice (favoriteJuice) {
        const user = User.getUser();
        const readNewsUrl =`http://localhost:3000/user/${user.Id}/read/${favoriteJuice}`
        fetch(readNewsUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }
    //Y kaffe
    static favoriteCoffee (favoriteCoffee) {
        const user = User.getUser();
        const readNewsUrl =`http://localhost:3000/user/${user.Id}/read/${favoriteCoffee}`
        fetch(readNewsUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }
    //Y sandwich
    static favoriteSanwich (favoriteSandwich) {
        const user = User.getUser();
        const readNewsUrl =`http://localhost:3000/user/${user.Id}/read/${favoriteSandwich}`
        fetch(readNewsUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }
};

    
