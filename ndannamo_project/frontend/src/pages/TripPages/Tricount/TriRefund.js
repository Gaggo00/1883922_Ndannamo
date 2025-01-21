import React, {useState} from 'react';
import "./Tricount.css"


export const ScrollableRow = ({ blocks=[] }) => {
    const [scrollPosition, setScrollPosition] = useState(0);
  
    const handleScrollLeft = () => {
      setScrollPosition((prev) => Math.max(prev - 200, 0)); // Scroll indietro di 200px
    };
  
    const handleScrollRight = () => {
      setScrollPosition((prev) => prev + 200); // Scroll avanti di 200px
    };
  
    return (
      <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        {/* Freccia sinistra */}
        <button onClick={handleScrollLeft} style={{ marginRight: '10px', padding: '10px', cursor: 'pointer' }}>
          ◀
        </button>
  
        {/* Contenitore scrollabile */}
        <div
          style={{
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'row',
            whiteSpace: 'nowrap',
            width: '80%',
            transform: `translateX(-${scrollPosition}px)`,
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          {blocks.map((block, index) => (
            <div
              key={index}
              style={{
                display: 'inline-block',
                width: '150px',
                margin: '0 10px',
                padding: '10px',
                textAlign: 'center',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{block.nickname}</div>
              <div style={{ fontSize: '24px', color: '#555' }}>{block.amount}</div>
            </div>
          ))}
        </div>
  
        {/* Freccia destra */}
        <button onClick={handleScrollRight} style={{ marginLeft: '10px', padding: '10px', cursor: 'pointer' }}>
          ▶
        </button>
      </div>
    );
};
  

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
