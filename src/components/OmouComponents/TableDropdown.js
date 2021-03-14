import React, { useState } from 'react';
import './TableDropdown.scss';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const TableDropdown = ({ title, items }) => {
    const [open, setOpen] = useState(false);
    const [selection, setSelection] = useState([]);
    const toggle = () => setOpen(!open);

    const handleOnClick = (item) => {
        if (!selection.some((current) => current.id === item.id)) {
            setSelection([item]);
        } else {
        }
    };

    return (
        <div className='dd-wrapper'>
            <div
                tabIndex={0}
                className='dd-header'
                role='button'
                onKeyPress={() => toggle(!open)}
                onClick={() => toggle(!open)}
            >
                <div className='dd-header__title'>
                    <p className='dd-header_title--bold'>{title}</p>
                </div>
                <div className='dd-header__action'>
                    <span>{open ? '' : <ExpandMoreIcon />}</span>
                </div>
            </div>
            {open && (
                <ul className='dd-list'>
                    {items.map((item) => (
                        <li className='dd-list-item' key={item.id}>
                            <button
                                type='button'
                                onClick={() => handleOnClick(item.value)}
                            >
                                <span>{item.title}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TableDropdown;
