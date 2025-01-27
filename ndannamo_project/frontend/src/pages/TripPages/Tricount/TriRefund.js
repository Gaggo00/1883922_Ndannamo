import React, {useState, useEffect, useRef} from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import "./Tricount.css"
import { TCListHeader } from './TriListItem';


export const ScrollableRow = ({ blocks=[] }) => {
    const containerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    useEffect(() => {
        checkArrows();
    }, [blocks]);

    const checkArrows = () => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        console.log({ scrollLeft, scrollWidth, clientWidth });
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
    };
  
    const scroll = (direction) => {
        const container = containerRef.current;
        if (!container) return;

        const scrollAmount = 200; // Adjust the scroll distance as needed
        const newScrollPosition = direction === "left"
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount;

        container.scrollTo({
            left: newScrollPosition,
            behavior: "smooth",
        });

        setTimeout(() => {
            checkArrows();
        }, 200);
    };
  
    const stylePositive = {fontWeight: '600', color: 'green'}
    const styleNegative = {fontWeight: '600', color: 'red'}
    const styleZero = {fontWeight: '600'}

    return (
        <div className="tc-balance-container">
            {/* Freccia sinistra */}
            <button onClick={() => scroll('left')} className='tc-arrows'>
                <BsChevronCompactLeft style={showLeftArrow ? {} : {visibility: 'hidden'}}/>
            </button>
            <div className="tc-scrollable-b-container" ref={containerRef}>
                {blocks.map((block, index) => (
                    <div key={index} className='tc-balance-item'>
                        <div>{block.nickname}</div>
                        <div style={block.amount < 0 ? styleNegative : block.amount > 0 ? stylePositive : styleZero}>
                            {block.amount}
                        </div>
                    </div>
                ))}
            </div>
            {/* Freccia destra */}
            <button onClick={() => scroll('rigth')} className='tc-arrows'>
                <BsChevronCompactRight style={showRightArrow ? {} : {visibility: 'hidden'}}/>
            </button>
        </div>
    );
};


export const TriBalance = ({ id, nickname, amount, onClick = ()=>{} }) => {

    const upStyle = {
        "color": "green",
    }

    const downStyle = {
        "color": "red",
    }

    function handleClick() {
        onClick(id);
    }

    return (
        <div className='tc-item' onClick={handleClick}>
            <div className="tc-column tc-name">{nickname}</div>
            <div
                className="tc-column tc-total"
                style= {amount > 0 ? upStyle : amount < 0 ? downStyle : {}}
            >
                {amount}
            </div>
        </div>
    )
}
  

const TriRefund = ({ by, to, amount, toNick, byNick }) => {

    return (
        <div className='tc-item-n-h'>
            <div className="tc-column tc-name">{byNick}</div>
            <div className="tc-column tc-expense">{toNick}</div>
            <div className="tc-column tc-total">{amount}</div>
            <div className="tc-column tc-date">
                <button>Paid</button>
                <button>Pay</button>
            </div>
        </div>
    );
};

class Refound {
    constructor(params = {}) {
        this.amount = params.amount ?? 0;
        this.by = params.by ?? -1;
        this.to = params.to ?? -1;
    }
}

export const TCRefund = ({user, expenses, users=[]}) => {

    const [refunds, setRefunds] = useState([]);
    const [balances, setBalances] = useState([]);


    useEffect(() => {
        const newBalances = calcBalance(expenses);
        setBalances(newBalances);
        const newRefunds = calcRefund(newBalances);
        setRefunds(newRefunds);
    }, [expenses]);


    function calcBalance(newExpenses) {
        var dict = {}
        const balances = []

        users.map((u) => {
            dict[u[0]] = 0.0;
        })

        newExpenses.map((e) => {
            dict[e.paidBy] += e.amount;
            e.amountPerUser.map((userAmount) => {
                dict[userAmount.user] -= userAmount.amount;
                dict[userAmount.user] = parseFloat(dict[userAmount.user].toFixed(2))
            })
        })

        const sorted = Object.entries(dict)
            .map(([key, value]) => [Number(key), value])
            .sort(([, valueA], [, valueB]) => valueB - valueA);
        sorted.map((value) => {
            const newBalance = {amount: value[1], id: value[0], nickname: users[value[0]][1]};
            balances.push(newBalance);
        })

        return balances;
    }


    function calcRefund(newBalances) {
        const newRefounds = [];
        const copyBalances = newBalances.map(balance => ({ ...balance }));

        if (newBalances.length <= 0)
            return [];

        var lastValue = copyBalances.pop();
        lastValue.amount *= -1;
        let i = 0;
        while (newBalances[i].amount > 0) {
            var toRefound = newBalances[i].amount;
            while (toRefound > 0) {
                if (lastValue.amount == 0) {
                    lastValue = copyBalances.pop();
                    lastValue.amount *= -1;
                }
                if (lastValue.amount < 0)
                    break;
                var refoundValue = 0
                if (toRefound > lastValue.amount)
                    refoundValue = lastValue.amount;
                else
                    refoundValue = toRefound;
                toRefound -= refoundValue;
                lastValue.amount -= refoundValue;
                const refound = new Refound({to: newBalances[i].id, amount: refoundValue, by: lastValue.id})
                newRefounds.push(refound);
            }

            i += 1;
        }
        return newRefounds;
    }

    function retriveSalesByUser(userId, expenses) {
        const expenseByUser = [];

        expenses.map((e) => {
            if (e.paidBy == userId) {
                expenseByUser.push(e);
            }
            else {
                for (let i = 0; i < e.amountPerUser.length; i++) {
                    if (e.amountPerUser[i].user == userId)
                        expenseByUser.push(e);
                }
            }
        })

        return expenseByUser;
    }


    function onBalanceClik(userId) {
        console.log(userId);
    }


    return (
        <div className="tc-bottom">
            <TCListHeader names={["Nickname", "Balance"]}/>
            <div className="tc-list">
                <div className="tc-list-inner" style={{maxHeight: '150px'}}>
                    {balances
                        .sort((a, b) => (a.id === user ? -1 : b.id === user ? 1 : 0))
                        .map((b, index) => (
                            <TriBalance
                                key={index}
                                id={b.id}
                                nickname={b.nickname}
                                amount={b.amount}
                                onClick={onBalanceClik}
                            />
                    ))}
                </div>
            </div>
            <div className="tc-middle">
                <div className="tc-title">Refund</div>
            </div>
            <div className="tc-list">
                <TCListHeader names={["By", "To", "Amount", ""]}/>
                {refunds.map((r, index) => (
                    <TriRefund
                        key={index}
                        by={r.by}
                        to={r.to}
                        amount={r.amount}
                        toNick={users[r.to][1]}
                        byNick={users[r.by][1]}
                    />
                ))}
            </div>
        </div>
    );
}

export default TriRefund;
