import React, {useState, useRef} from 'react';
import DatePicker from 'react-datepicker';
import { Bs1CircleFill, Bs2CircleFill, Bs3CircleFill, BsArrowRightCircleFill, BsArrowLeftCircleFill} from "react-icons/bs";
import AddList from '../AddList/AddList';
import TripService from '../../services/TripService';
import './TripCreation.css'
import 'react-datepicker/dist/react-datepicker.css';

function TripCreationForm() {

    const [inputValue, setInputValue] = useState('');
    const [step, setStep] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [filled, setFilled] = useState([0, 0, 0]);
    const [destinations, setDestinations] = useState([]);

    const datePickerRefL = useRef(null);
    const datePickerRefR = useRef(null);
    var lastPossibleDate = new Date();
    lastPossibleDate.setDate(lastPossibleDate.getDate() + 720)

    const openDatePickerL = () => {
      if (datePickerRefL.current) {
        datePickerRefL.current.setFocus(); // Focalizza il DatePicker per aprire il calendario
      }
    };

    const openDatePickerR = () => {
        if (datePickerRefR.current) {
            datePickerRefR.current.setFocus(); // Focalizza il DatePicker per aprire il calendario
        }
      };

    const steps = [
        { id: 0, Icon: Bs1CircleFill },
        { id: 1, Icon: Bs2CircleFill },
        { id: 2, Icon: Bs3CircleFill },
    ];

    const handleBack = () => {
        setStep(step - 1)
    }

    function _dateToString(date, format = 0, separator = '/', yearB = false) {
        var dateStr = "";
        var day = date.getDate().toString().padStart(2, '0');
        var month = date.getMonth().toString().padStart(2, '0');
        var year = date.getFullYear().toString()

        if (format == 0) {
            dateStr = month + separator + day
            if (yearB)
                dateStr = year.concat(separator, dateStr)
        }
        else if (format == 1) {
            dateStr = day + separator + month
            if (yearB)
                dateStr = dateStr.concat(separator, year)
        }
        else {
            dateStr = month + separator + day
            if (yearB)
                dateStr = dateStr.concat(separator, year)
        }
        
        return dateStr
    }

    const handleSubmit = () => {
        var new_filled = filled
        for (var i = 0; i <= step; i++)
            new_filled[i] = 1
        setFilled(new_filled)
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            TripService.create(inputValue, destinations, _dateToString(startDate, 0, '-', true), _dateToString(endDate, 0, '-', true));
        }
    };

    const handleStepButton = (new_step) => {
        setStep(new_step);
    }

    function changeStartDate(new_date) {
        if (new_date > endDate)
            setEndDate(new_date);
        setStartDate(new_date);
    }

    const getStepStyle = (id) => ({
        color: filled[id] > 0 ? 'green' : 'grey',
        size: id === step ? '60px' : '45px',
    });
    
    return (
        <div className="main-container">
            <label className="title">Start your journey</label>
            <div className="steps-container">
                {steps.map(({ id, Icon }) => (
                    <button className="button-step" key={id} disabled={filled[id] == 0 && (id > 0 && !filled[id - 1])} onClick={() => handleStepButton(id)}>
                        <Icon {...getStepStyle(id)} />
                    </button>
                ))}
            </div>
            <div className="form-container">
                {
                    step >= 1 &&
                    <button className='send' onClick={handleBack}><BsArrowLeftCircleFill size="32px"/></button>
                }
                {
                    step == 0 &&
                    <input
                        className="name-field"
                        type="text"
                        placeholder="Inserisci il nome" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    ||
                    step == 1 &&
                    <div className='date-container'>
                        <div className="single-date-container left" onClick={openDatePickerL}>
                            <label>Andata</label>
                            <DatePicker 
                                ref={datePickerRefL} className='date-field' selected={startDate}
                                onChange={(date) => {changeStartDate(date)}} dateFormat="dd/MM/yyyy" 
                                includeDateIntervals={[{start: new Date(), end: lastPossibleDate}]}
                            />
                        </div>
                        <div className="single-date-container right" onClick={openDatePickerR}>
                            <label>Ritorno</label>
                            <DatePicker
                                ref={datePickerRefR} className='date-field' selected={endDate}
                                onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy"
                                includeDateIntervals={[{start: startDate, end: lastPossibleDate}]}
                            />
                        </div>
                    </div>
                    ||
                    step == 2 &&
                    <AddList destinations={destinations} setDestinations={setDestinations}/>
                }
                <button className='send' onClick={handleSubmit}><BsArrowRightCircleFill size="32px"/></button>
            </div>
        </div>
    )
}

export default TripCreationForm;