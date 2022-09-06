// Array criado apenas para popular a página ======================
const items = Array.from({length: 100}, 
    (_, i) => `Item ${i+1}`);
// ================================================================




// Cógigo da PAGINAÇÃO:
const perPage = 10; // Quantidade de Itens por página.
const pageState = {
    currentPage: 1,    
    totalPages: Math.ceil(items.length / perPage),
    totalButton: 5,
    checkPage() {
        path('div.first').classList.remove('disabled');
        path('div.prev').classList.remove('disabled'); 
        path('div.next').classList.remove('disabled');
        path('div.last').classList.remove('disabled');

        if (this.currentPage <= 1) {
            path('div.first').classList.add('disabled');
            path('div.prev').classList.add('disabled');            
            this.currentPage = 1;
        }
        else if (this.currentPage >= this.totalPages) {
            path('div.next').classList.add('disabled');
            path('div.last').classList.add('disabled');
            this.currentPage = this.totalPages;
        }  
    }    
}

// Função para evitar redundância de código.
const path = (selector) => document.querySelector(selector);

const controls = {
    next() {
        pageState.currentPage += 1; 

        // Verificar se a Página Atual é IGUAL ao Total de páginas.
        pageState.checkPage();
        refreshPage();
    },
    prev() {
        pageState.currentPage -= 1;

        // Verificar se a Página Atual é IGUAL a página 1.
        pageState.checkPage();
        refreshPage();
    },
    goTo(pageNumber) {
        pageState.currentPage = pageNumber;
        
        // Vericar o Número da Página Atual.
        pageState.checkPage();
        refreshPage();
    }, 
    eventListener() {        
        path('div.first').addEventListener('click', () => this.goTo(1));
        path('div.prev').addEventListener('click', () => this.prev());
        path('div.next').addEventListener('click', () => this.next());
        path('div.last').addEventListener('click', () => this.goTo(pageState.totalPages));       
        
        // Vericar o Número da Página Atual.
        pageState.checkPage();
    }
}

const data = {
    create(item) {
        const li = document.createElement('li');
        li.classList.add('item');
        li.innerHTML = item;
        path('ul.list').appendChild(li);
    }, 
    update() {
        path('ul.list').innerHTML = '';

        let page = pageState.currentPage; 
        let start = (page-1) * perPage;
        let end = start + perPage;
        
        const pageItems = items.slice(start, end);
        
        pageItems.forEach(this.create);
    }
}

const numberButtons = {
    create(btnNumber) {
        const div = document.createElement('div');
        div.innerHTML = btnNumber;

        if (pageState.currentPage == btnNumber) {
            div.classList.add('active');
            div.style.cursor = 'default';
        }
        
        div.addEventListener('click', (event) => {
            const number = event.target.innerText;
            controls.goTo(+number);

            refreshPage();
        });

        path('div.numbers').appendChild(div);
    },
    update() {
        path('div.numbers').innerHTML = '';

        const { left, right } = this.buttonsVisible();
        for (let btn = left; btn <= right; btn++) {
            this.create(btn);
        }
    },
    buttonsVisible() {
        const { currentPage, totalButton, totalPages } = pageState;

        let left = (currentPage - Math.floor(totalButton/2));
        let right = (currentPage + Math.floor(totalButton/2));

        if (left < 1) {
            left = 1;
            right = totalButton;
        }

        if (right > totalPages) {
            left = totalPages - (totalButton - 1); 
            right = totalPages; 

            if (left < 1) {
                left = 1;
            }
        }

        return { left, right }

    } 
}

function refreshPage() {
    data.update();
    numberButtons.update();
}

function start() {
    refreshPage();
    controls.eventListener();  
}

start();