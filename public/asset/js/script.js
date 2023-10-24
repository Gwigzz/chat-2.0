const btnCloseAlert = document.getElementById('btn-close-alert');
const boxAlert      = document.querySelector('.alert');
if(!!btnCloseAlert){
    btnCloseAlert.addEventListener('click', () => {
        boxAlert.style.display = 'none';
    });
}