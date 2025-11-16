// Настройка Firebase остается прежней
npm install firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyCuPn6pWRDmy92Fc7TqCoxDy-E2-KZSYE4",
  authDomain: "my-anime-website-50b6c.firebaseapp.com",
  projectId: "my-anime-website-50b6c",
  storageBucket: "my-anime-website-50b6c.firebasestorage.app",
  messagingSenderId: "383424700016",
  appId: "1:383424700016:web:5672a1f4cb05c28cdb1eb5",
  measurementId: "G-5KCLYG12ER"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Логика аутентификации остается неизменной
function signIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User signed in:', user);
        })
        .catch((error) => {
            console.error('Error signing in:', error);
        });
}

function signUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User created:', user);
        })
        .catch((error) => {
            console.error('Error creating account:', error);
        });
}

function googleSignIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log('Google user signed in:', user);
        }).catch((error) => {
            console.error('Error with Google Sign In:', error);
        });
}

// Функция для динамического вывода популярных аниме
async function loadFeaturedAnime() {
    const response = await fetch('https://api.jikan.moe/v4/top/anime');
    const data = await response.json();

    console.log('Получены данные:', data); // Выведет ответ в консоль

    if (!response.ok || !data.top || data.top.length === 0) {
        console.error('Ничего не найдено!', data);
        return;
    }


    data.top.slice(0, 6).forEach(anime => {
        const card = document.createElement('div');
        card.classList.add('anime-card');
        card.dataset.animeId = anime.mal_id;

        const image = document.createElement('img');
        image.src = anime.image_url;
        image.alt = anime.title;

        const title = document.createElement('h3');
        title.textContent = anime.title;

        const synopsis = document.createElement('p');
        synopsis.textContent = anime.synopsis.substring(0, 100) + "...";

        const moreInfoBtn = document.createElement('button');
        moreInfoBtn.textContent = 'More Info';
        moreInfoBtn.addEventListener('click', () => openDetailModal(anime.mal_id));

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(synopsis);
        card.appendChild(moreInfoBtn);

        featuredSection.appendChild(card);
    });
}

// Модальное окно для деталей
async function openDetailModal(id) {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
    const data = await response.json();

    if (data.data) {
        const details = data.data;
        let modalHtml = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center;">
                <div style="background: white; max-width: 600px; padding: 20px; border-radius: 10px;">
                    <h2>${details.title}</h2>
                    <p>Рейтинг: ${details.score}</p>
                    <p>Жанры: ${details.genres.map(genre => genre.name).join(', ')}</p>
                    <p>Описание:<br/>${details.synopsis}</p>
                    <button onclick="closeModal()">Close</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    } else {
        console.error('Ошибка при получении данных.', data.errors);
    }
}

// Закрытие модального окна
function closeModal() {
    const modal = document.querySelector('div[position=fixed]');
    modal.remove();
}

// Главный запуск
document.addEventListener('DOMContentLoaded', async () => {
    loadFeaturedAnime(); // Загружаем популярное аниме сразу после загрузки страницы
});