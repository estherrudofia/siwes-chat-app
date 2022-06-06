
const pWord = document.getElementById('password');
const formRegister = document.getElementById('loginRegister');

pWord.addEventListener('click', (e) => {
    e.preventDefault();
    e.target.value = '';
});

formRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = '/api/register';

})