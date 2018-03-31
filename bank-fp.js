// UTILS
const _pipe = (a, b) => (arg) => b(a(arg));
const pipe = (...ops) => ops.reduce(_pipe);

// STATE
window.state = {
    accounts: [
        { name: "Milosz", money: 1000 },
        { name: "Jan", money: 0 },
        { name: "Agnieszka", money: 500 }
    ]
};

// PURE FUNCTIONS
const updateMoney = accountName => money => accounts =>
    accounts.map(a => a.name === accountName ? { ...a, money: a.money - money } : a );

const transfer = (bank, input) => {
    const fromAccount = bank.accounts.find(a => a.name === input.fromName);
    const adjustAccounts = pipe(
        updateMoney(input.fromName)(input.money), 
        updateMoney(input.toName)(-input.money)
    );
    return fromAccount.money >= input.money
        ? { accounts: adjustAccounts(bank.accounts) }
        : bank;
};

// IMPURE
const displayBank = bank => {
    const accountsEl = document.getElementById('accounts');
    accountsEl.innerHTML = '';
    bank.accounts.forEach(
        account => {
            const el = document.createElement('li');
            el.innerText = `${account.name}: $${account.money}`;
            accountsEl.appendChild(el);
        }
    ); 
};

const getState = () => window.state;

const updateState = bank => {
    window.state = bank; 
    return bank;
}

const collectInput = () => {
    const fromName = document.getElementById('from').value;
    const toName = document.getElementById('to').value;
    const money = parseInt(document.getElementById('money').value);
    return { fromName, toName, money }
};

// PIPELINE

document.getElementById('transfer').onclick = pipe(
    collectInput,
    input => transfer(getState(), input),
    updateState,
    displayBank
);

displayBank(window.state);