import React, {useState, useEffect, useRef} from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import "./Tricount.css"


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


export const TriBalance = ({ id, nickname, amount }) => {

    function handleClick() {
        console.log(id);
    }

    return (
      <div className='tc-item' onClick={handleClick}>
          <div className="tc-column tc-name">{nickname}</div>
          <div className="tc-column tc-total">{amount}</div>
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

export default TriRefund;
