import rawStockData from './stock-data.js';

const stockListElement = document.querySelector('.stock-list');
const stockData = rawStockData.map(({ symbol, price, change, change_percent }) => {
    const changePrepared = Number(change).toFixed(2);
    const changePercentValue = Number(change_percent.substring(0, change_percent.length - 1)).toFixed(2);
    const changePercentPrepared = `${changePercentValue > 0 ? '+' : ''}${changePercentValue}%`;
    return {
        symbol: symbol,
        price: price,
        gainState: changePercentValue > 0 ? 'stock-item-gain-up' : 'stock-item-gain-down',
        change: changePrepared,
        changePercent: changePercentPrepared,
        gainValue: changePercentPrepared,
        gainSwapped: true
    };
});

function createFromTemplate({ symbol, price, index, gainState, gainValue }) {
    return `<li aria-label="stock-item" class="stock-item">
    <span aria-label="full-company-name" class="stock-item-full-company-name">${symbol}</span>
    <div class="stock-item-numbers">
        <span aria-label="full-company-name" class="stock-item-number stock-item-price">${price}</span>
        <button data-index=${index} aria-label="stock-percent-rise" class="stock-item-number stock-item-gain ${gainState}">
            <span>${gainValue}</span>
        </button>
    </div>
</li>`;
}
function createStockListItem(stockItem, index) {
    const html = createFromTemplate(Object.assign({ index }, stockItem));
    const div = document.createElement('div');
    div.innerHTML = html;

    const button = div.querySelector('button');
    button.addEventListener('click', onGainClick);

    return div;
}
function onGainClick({ target: { firstChild } }) {
    const index = target.dataset.index;
    firstChild.innerHTML = stocks[index].gainSwapped
        ? stocks[index].change
        : stocks[index].changePercent;
    stocks[index].gainSwapped = !stocks[index].gainSwapped;
}

const dynamicStocksFragment = new DocumentFragment();
stockData.forEach((stockItem, index) => {
    dynamicStocksFragment.appendChild(createStockListItem(stockItem, index));
});

stockListElement.appendChild(dynamicStocksFragment);

fetch('http://localhost:3030/api/v1/prices?company=WIX,AAPL,MSFT,GOOG')
    .then(res => res.json())
    .then(res => {
        const fragment = new DocumentFragment();
        const items = Array.prototype.map.call(res, item => {
            stockData.push({
                
            });


            return createStockListItem({
                symbol: item.name,
                price: item.price,
                index: '123'
            });
        })
    })
    .catch(console.error);
