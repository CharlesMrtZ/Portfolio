const cards = document.querySelectorAll('.card');
const listas = document.querySelectorAll('.lista');

let draggedCard = null;

cards.forEach(card => {
    card.addEventListener('dragstart', () => {
        draggedCard = card;
        setTimeout(() => {
            card.style.display = 'none';
        }, 0);
        console.log("pegou o card");
        
    });

    card.addEventListener('dragend', () => {
        draggedCard = null;
        setTimeout(() => {
            card.style.display = 'block';
        }, 0);
        console.log("soltouo card");
    });
});

listas.forEach(lista => {
    lista.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    lista.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedCard) {
            lista.appendChild(draggedCard);
        }
    });
});