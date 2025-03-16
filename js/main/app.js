document.querySelectorAll('.size').forEach(sizeElement => {
    sizeElement.addEventListener('click', () => {
       
        sizeElement.parentElement.querySelectorAll('.size').forEach(s => s.classList.remove('active'));

       
        sizeElement.classList.add('active');
    });
});