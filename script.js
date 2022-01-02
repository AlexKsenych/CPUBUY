let processors = [];

class CPU {
    constructor(brend, model, socket, cores, cache, wattage, speed, price, id, imgUrl) {
        this.brend = brend;
        this.model = model;
        this.socket = socket;
        this.cores = cores;
        this.cache = cache;
        this.wattage = wattage;
        this.speed = speed;
        this.price = price;
        this.id = id;
        this.imgUrl = imgUrl;
        processors.push(this);
    }
}

if (localStorage.getItem('processorsArr')) {
    processors = [...JSON.parse(localStorage.getItem('processorsArr'))];
} else {
    new CPU('Intel', 'Core i5-11400F', '1200', 6, 12, 65, 2.6, 5299, 0, './img/processors/intel11400f.jpg');
    new CPU('Intel', 'Core i5-10400F', '1200', 6, 12, 65, 2.9, 4000, 1, './img/processors/intel10400f.jpg');
    new CPU('AMD', 'Ryzen 5 5600X', 'AM4', 3, 12, 65, 2.6, 6423, 2, './img/processors/ryzen5600x.jpg');
    new CPU('Intel', 'Core i5-11400F', '1200', 3, 12, 65, 2.6, 5299, 3, './img/processors/intel11400f.jpg');
    new CPU('AMD', 'Ryzen 9 5900X', 'AM4', 12, 64, 105, 3.7, 8000, 4, './img/processors/ryzen5900x.jpg');
    new CPU('Intel', 'Core i3-10100F', '1200', 4, 6, 65, 3.6, 3000, 5, './img/processors/intel10100f.jpg');
    new CPU('Intel', 'Core i5-11400F', '1200', 3, 12, 65, 2.6, 33, 6, './img/processors/intel11400f.jpg');
    new CPU('AMD', 'Ryzen 5 5600X', '1200', 3, 12, 65, 2.6, 500, 7, './img/processors/ryzen5600x.jpg');
    new CPU('AMD', 'Ryzen 5 5600X', '1200', 3, 12, 65, 2.6, 5299, 8, './img/processors/ryzen5600x.jpg');
    new CPU('Intel', 'Core i5-11400F', '1200', 3, 12, 65, 2.6, 124, 9, './img/processors/intel11400f.jpg');
}

function deleteItem(id) {
    let index = processors.findIndex(item => item.id === id);

    processors.splice(index, 1);
    showProccerors();
    document.querySelectorAll('input[type="checkbox"]').forEach(item => item.checked = false);
}

function changeItem(elem, ...rest) {
    const keys = ['imgUrl', 'model', 'socket', 'cores', 'cache', 'wattage', 'speed', 'price'];

    keys.forEach((item, i) => {
        elem[`${item}`] = rest[i];
    });

    showProccerors();
}

function sortDynamic(key, order = 'asc') {
    const sortOrder = order === 'asc' ? 1 : -1;

    return (a, b) => {
        const A = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
        const B = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];
        if ( A < B ) return sortOrder * -1;
        if ( A > B ) return sortOrder * 1;
        return 0;
    };
}

function showProccerors(brend = '', sort = 'default', order, arr = processors) {
    let proc = [...arr],
        items = '';
    
    let totalPrice = 0;
    let totalSpeed = 0;

    content.innerHTML = '';

    if (brend !== '') {
        proc = proc.filter(item => item.brend.toUpperCase() === brend.toUpperCase());
    }

    if (arr === processors && sort !== 'default') {
        proc.sort(sortDynamic(sort, order));
    }

    proc.forEach(item => {  
        items += `
        <div id="${item.id}" class="content__item">
            <img class="content__item__img" src=${item.imgUrl} alt=${item.model}>
            <div class="content__item__text">
                <div class="content__item__text__title">${item.brend} ${item.model}</div>
                <div class="content__item__text__descr">${item.speed} GHz | ${item.cores} cores | ${item.cache} MB</div>
                <div class="content__item__text__price">${item.price}$</div>
            </div>
            <button class="content__item__delete">
                <img class="content__item__delete__img" src="./img/icons/delete.svg" alt="delete">
            </button>
        </div>
        `;

        totalPrice += +item.price;
        totalSpeed += +item.speed;
    });

    filterPrice.innerHTML = totalPrice;
    filterSpeed.innerHTML = totalSpeed.toFixed(1);

    items += `
    <div id="addItem" class="content__addItem">
        <img src="./img/icons/plus.svg" alt="addItem" class="content__addItem__img">
    </div>
    `;

    content.innerHTML = items;

    document.querySelectorAll('.content__item').forEach(item => {
        const processor = processors.find(elem => elem.id === +item.id),
              keys = ['model', 'socket', 'cores', 'cache', 'wattage', 'speed', 'price', 'id', 'imgUrl'];

        item.addEventListener('click', (e) => {
            if (e.target.matches('button, button *')) return;

            document.querySelectorAll('.viewItem__container__specifications__info input').forEach((item, i) => {
                item.value = processor[keys[i]];
            });

            document.querySelector('.viewItem__container__product__input').value = processor.imgUrl;

            document.querySelector('.viewItem__brend').innerHTML = processor.brend;
            document.querySelector('.viewItem__container__product__img').src = processor.imgUrl;

            showModalWindow(viewItem);
        });
    });

    // each content item delete - delete item
    document.querySelectorAll('.content__item > .content__item__delete').forEach(item => {
        item.addEventListener('click', () => {
            deleteItem(+item.parentElement.id);
        });
    });

    // add item
    addItem.addEventListener('click', () => {
        showModalWindow(createItem);
    });

    localStorage.setItem('processorsArr',JSON.stringify(processors));
}

showProccerors();

function showModalWindow(modalWindow) {
    document.querySelector('.wrapper').style.display = 'block';
    modalWindow.style.display = 'block';
    document.body.style = 'overflow: hidden;';
    window.scroll(0,0);
}

function closeModalWindows() {
    document.querySelector('.wrapper').style.display = 'none';
    createItem.style.display = 'none';
    viewItem.style.display = 'none';
    document.body.style = 'overflow: visible;';

    document.querySelectorAll('.viewItem__container input').forEach(item => {
        item.disabled = true;
    });

    viewItemBtnImg.src = './img/icons/edit.svg';
    viewItemFormBtn.disabled = true;
}

// view item - toggle edit button
viewItemBtn.addEventListener('click', () => {
    let viewItemInputs = [...document.querySelectorAll('.viewItem__container input')];
    viewItemInputs.pop();
    viewItemInputs.forEach(item => {
        item.disabled = !item.disabled;
    });

    viewItemFormBtn.disabled = !viewItemFormBtn.disabled;

    viewItemBtnImg.src = viewItemBtnImg.src === 'http://127.0.0.1:5500/img/icons/edit.svg' ?
        viewItemBtnImg.src = './img/icons/close-edit.svg' :
        viewItemBtnImg.src = './img/icons/edit.svg';
});

// view item - edit item
document.querySelector('.viewItem__container').addEventListener('submit', e => {
    e.preventDefault();
    let arr = [];
    document.querySelectorAll('.viewItem__container input').forEach(item => {
        arr.push(item.value + '');
    });

    const elem = processors.find(item => item.id === +arr[8]);

    changeItem(elem, ...arr);
    closeModalWindows();
});

// header search - search items
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    document.querySelectorAll('input[type="checkbox"]').forEach(item => item.checked = false);

    const value = searchInput.value.toUpperCase(),
          regex = new RegExp(value);

    let arr = [];

    processors.forEach(item => {
        if (item.model.toUpperCase().search(regex) !== -1) {
            arr.push(item);
        }
    });
    showProccerors('', 'default', 'asc', arr);
});

// aside checkbox inputs logic
function asideCheckboxLogic() {
    const argumentsObj0 = {
        argumentsArr0: ['intel', 'price'],
        argumentsArr1: ['amd', 'price'],
        argumentsArr2: ['', 'price'],
        argumentsArr3: ['intel'],
        argumentsArr4: ['amd']
    },
          argumentsObj1 = {
        argumentsArr0: ['intel', 'price', 'desc'],
        argumentsArr1: ['amd', 'price', 'desc'],
        argumentsArr2: ['', 'price', 'desc'],
        argumentsArr3: ['intel'],
        argumentsArr4: ['amd']
    },
          argumentsObj2 = {
        argumentsArr0: ['intel', 'price'],
        argumentsArr1: ['intel', 'price', 'desc'],
        argumentsArr2: ['intel'],
        argumentsArr3: ['', 'price'],
        argumentsArr4: ['', 'price', 'desc']
    },
          argumentsObj3 = {
        argumentsArr0: ['amd', 'price'],
        argumentsArr1: ['amd', 'price', 'desc'],
        argumentsArr2: ['amd'],
        argumentsArr3: ['', 'price'],
        argumentsArr4: ['', 'price', 'desc']
    };

    function addCheckboxEvent(checkbox0, checkbox1, check, argumentsObj) {
        checkbox0.addEventListener('change', e => {
            searchInput.value = '';
        
            if (e.target.checked) {
                checkbox1.checked = false;
                if (check === 'brend' ? brendCheckbox0.checked :
                    filterCheckbox0.checked) return showProccerors(...argumentsObj.argumentsArr0);
                if (check === 'brend' ? brendCheckbox1.checked :
                    filterCheckbox1.checked) return showProccerors(...argumentsObj.argumentsArr1);
                return showProccerors(...argumentsObj.argumentsArr2);
            }
        
            if (!e.target.checked && !checkbox1.checked) {
                if (check === 'brend' ? brendCheckbox0.checked :
                    filterCheckbox0.checked) return showProccerors(...argumentsObj.argumentsArr3);
                if (check === 'brend' ? brendCheckbox1.checked :
                    filterCheckbox1.checked) return showProccerors(...argumentsObj.argumentsArr4);
                showProccerors();
            };
        });
    }

    addCheckboxEvent(filterCheckbox0, filterCheckbox1, 'brend', argumentsObj0);
    addCheckboxEvent(filterCheckbox1, filterCheckbox0, 'brend', argumentsObj1);
    addCheckboxEvent(brendCheckbox0, brendCheckbox1, 'filter', argumentsObj2);
    addCheckboxEvent(brendCheckbox1, brendCheckbox0, 'filter', argumentsObj3);
}

asideCheckboxLogic()

// view item - close windows
document.querySelector('.viewItem__close').addEventListener('click', () => {
    closeModalWindows();
});

// create item - close windows
document.querySelector('.createItem__close').addEventListener('click', () => {
    closeModalWindows();
});

// wrapper - close windows
document.querySelector('.wrapper').addEventListener('click', e => {
    if (e.target === document.querySelector('.wrapper')) {
        closeModalWindows();
    }
});

// create item form - add new item
document.querySelector('.createItem__form').addEventListener('submit', e => {
    e.preventDefault();
    let arr = [];
    document.querySelectorAll('.createItem__form__inputs__input').forEach(item => {
        arr.push(item.value);
        item.value = '';
    });

    const brand = selectIntel.checked ? 'Intel' : 'AMD',
          id = processors[processors.length - 1].id + 1,
          img = arr[7] ? arr[7] : brand === 'Intel' ?
          './img/logo/intel.svg' : './img/logo/amd_ryzen.svg';

    new CPU(brand, arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], id, img);

    showProccerors();
    document.querySelectorAll('input[type="checkbox"]').forEach(item => item.checked = false);

    closeModalWindows();
});

// create item - intel input
selectIntel.addEventListener('change', e => {
    if (e.target.checked) {
        SelectAmd.checked = false;
        SelectAmd.required = false;
        selectIntel.required = true;
    }
});

// create item - amd input
SelectAmd.addEventListener('change', e => {
    if (e.target.checked) {
        selectIntel.checked = false;
        selectIntel.required = false;
        SelectAmd.required = true;
    }
});

// hamburger - toggle aside
document.querySelector('.header__wrapper__hamburger').addEventListener('click', e => {
    e.currentTarget.classList.toggle('is-active');
    document.querySelector('.aside').classList.toggle('show');
});