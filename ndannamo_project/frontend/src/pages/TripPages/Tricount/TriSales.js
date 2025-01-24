import React, {useState, useEffect, useRef} from 'react';
import SearchBar from '../../../components/SearchBar';
import TCListItem, { TCListHeader } from './TriListItem';

const TCSales = ({data, userId, handleSelection=()=>{}, handleAdd=()=>{}}) => {

    const [myTotalExpenses, setMyTotalExpenses] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [searchData, setSearchData] = useState([...data]);
    const [searchValue, setSearchValue] = useState("");
    const [selected, setSelected] = useState(-1);
    const itemsRefs = useRef([]);


    useEffect(() => {
        retriveExpenses(data);
        if (!searchValue || searchValue == "")
            setSearchData(data);
        else {
            const filteredItems = data.filter(
                (item) => checkExpensesSearch(item, searchValue.toLowerCase())
            );
            setSearchData(filteredItems);
        }
    }, [data]);


    function retriveExpenses(expensesData) {
        let totExpenses = 0;
        let myExpenses = 0;

        expensesData.map((expense) => {
            totExpenses += expense.amount;
            expense.amountPerUser.map((e) => {
                if (e.user == userId)
                    myExpenses += e.amount;
            })
        })

        setTotalExpenses(totExpenses);
        setMyTotalExpenses(myExpenses);
    }


    function checkExpensesSearch(value, searchTerm) {
        if (!value || !searchTerm) return false;
        return value.title.toLowerCase().includes(searchTerm.toLowerCase());
    }


    function handleItemSelection (event, index, item) {
        if (selected != -1 && itemsRefs.current[selected])
            itemsRefs.current[selected].setClicked(false);
        setSelected(index);
        handleSelection(event, item);
    }

    function addClicked () {
        if (selected != -1 && itemsRefs.current[selected]) {
            itemsRefs.current[selected].setClicked(false);
            setSelected(-1);
        }
        handleAdd();
    }


    return (
        <div className="tc-bottom">
            <div className="tc-main-recap">
                <div className="tc-recap">
                    <div>Le mie spese</div>
                    <div className="tc-recap-expenses">{myTotalExpenses.toFixed(2)}</div>
                </div>
                <div className="tc-recap">
                    <div>Spese totali</div>
                    <div className="tc-recap-expenses">{totalExpenses.toFixed(2)}</div>
                </div>
            </div>
            <div className="tc-middle">
                <div className="tc-title">Spese</div>
                <SearchBar
                    value={searchValue}
                    setValue={setSearchValue}
                    items={searchData}
                    setItems={setSearchData}
                    itemsAll={data}
                    checkItemSearch={checkExpensesSearch}
                />
            </div>
            <div className="tc-list">
                <TCListHeader names={["Name", "Expense", "Total", "Date", "Paid by"]}/>
                {searchData.map((item, index) => (
                    <TCListItem
                        key={index}
                        userId={userId}
                        expenseData={item}
                        ref={(el) => (itemsRefs.current[index] = el)}
                        onClick={(event) => handleItemSelection(event, index, item)}
                    />
                ))}
            </div>
            <div className="tc-button-container">
                <div className="tc-add-button" onClick={addClicked}>+ Add Spesa</div>
            </div>
        </div>
    )
}

export default TCSales;
