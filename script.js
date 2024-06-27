let priceValue = null;
let vegValue = null;

document.getElementById('category').addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    const newfm = document.getElementById('newfm');
    newfm.innerHTML = '';

    if (selectedValue === 'prices') {
        let form = document.createElement('form');
        form.id = 'price-form';
        form.innerHTML = `
            <label for="price">Price:</label>
            <select id="price" name="price">
                <option value="0-200">0-200</option>
                <option value="200-300">200-300</option>
                <option value="300-500">300-500</option>
                <option value="500-700">500-700</option>
            </select>`;
        newfm.appendChild(form);
    } else if (selectedValue === 'Veg') {
        let form = document.createElement('form');
        form.id = 'veg-form';
        form.innerHTML = `
            <label for="veg">Veg/Non-veg:</label>
            <select id="veg" name="veg">
                <option value="Vege">Veg</option>
                <option value="Non-veg">Non-veg</option>
            </select>`;
        newfm.appendChild(form);
    }

});


document.getElementById('filter-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const city = document.getElementById('city').value;
    const category = document.getElementById('category').value;
    let price = null;
    let veg = null;

    if (category === 'prices' && document.getElementById('price')) {
        price = document.getElementById('price').value;
    }

    if (category === 'Veg' && document.getElementById('veg')) {
        veg = document.getElementById('veg').value;
    }

    console.log('City:', city);
    console.log('Category:', category);
    console.log('Price:', price);
    console.log('Veg:', veg);

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            console.log('Data:', data);

            const filteredData = filterData(data, city, category, price, veg);
            console.log('Filtered Data:', filteredData);

            displayResults(filteredData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});


function filterData(data, city, category, price, veg) {
    let filteredData = data.filter(item => item.City === city);
    console.log('Filtered by City:', filteredData);

    if (category !== 'all') {
        if (category === 'prices' && price) {
            const [minPrice, maxPrice] = price.split('-').map(Number);
            filteredData = filteredData.map(item => {
                item.Menu = item.Menu.map(menu => {
                    menu.Dishes = menu.Dishes.filter(dish => dish.price >= minPrice && dish.price <= maxPrice);
                    return menu;
                }).filter(menu => menu.Dishes.length > 0);
                return item;
            }).filter(item => item.Menu.length > 0);
        } else if (category === 'Veg' && veg) {
            const isVeg = veg === 'Vege';
            filteredData = filteredData.map(item => {
                item.Menu = item.Menu.map(menu => {
                    menu.Dishes = menu.Dishes.filter(dish => dish.isVeg === isVeg);
                    return menu;
                }).filter(menu => menu.Dishes.length > 0);
                return item;
            }).filter(item => item.Menu.length > 0); 
        }
    }

    return filteredData;
}
function displayResults(data) {
    const resultsContainer = document.querySelector('.results');
    resultsContainer.innerHTML = '';

    if (data.length === 0) {
        resultsContainer.textContent = 'No results found';
        return;
    }

    data.forEach(item => {
        const restaurantDiv = document.createElement('div');
        restaurantDiv.classList.add('restaurant');

        item.Menu.forEach(menu => {
            menu.Dishes.forEach(dish => {
                const dishDiv = document.createElement('div');
                dishDiv.classList.add('dish');

                let imagediv = document.createElement('div');
                imagediv.id = 'imgd';
                imagediv.style.margin = '10px';

                let image = `./images/${dish.name}.jpeg`;
                const img = document.createElement('img');
                img.src = image;
                img.alt = dish.name;
                imagediv.appendChild(img);
                dishDiv.appendChild(imagediv);

                let textdiv = document.createElement('div');
                textdiv.id = 'textd';

                const dishName = document.createElement('h3');
                dishName.textContent = `Name: ${dish.name}`;
                textdiv.appendChild(dishName);

                const dishDescription = document.createElement('p');
                dishDescription.textContent = `Description: ${dish.description}`;
                textdiv.appendChild(dishDescription);

                const dishPrice = document.createElement('p');
                dishPrice.textContent = `Price: ₹${dish.price}`;
                textdiv.appendChild(dishPrice);

                const name = document.createElement('p');
                name.textContent = `Restaurant: ${item.Name}`;
                textdiv.appendChild(name);

                dishDiv.appendChild(textdiv);

                restaurantDiv.appendChild(dishDiv);
            });
        });

        resultsContainer.appendChild(restaurantDiv);
    });
}

