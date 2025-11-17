// Данные пользователя
const userData = {
  username: "Иван Федоров",
  email: "vanafedorov40@gmail.com",
  bio: "Software Developer and Tech Enthusiast"
};

// Отображение данных пользователя
document.getElementById('username').textContent = userData.username;
document.getElementById('email').textContent = userData.email;
document.getElementById('bio').textContent = userData.bio;
