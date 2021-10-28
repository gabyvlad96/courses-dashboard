import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import './navigation.css';


const Item = ({value, ItemType, onItemClick, index, selected}) => {
    const onClick = () => {
        onItemClick(value, ItemType, index);
    }
    return (
        <li className={`navigation-item ${selected? 'selected-item' : ''}`} onClick={onClick}>
            {ItemType === "users"
                ? <span>{value.firstName} {value.lastName}</span>
                : <span>{value.title}</span>
            }
        </li>
    )
}

const Navigation = ({dataType, data, selectedItem, onItemClick}) => {
    const [searchInput, setSearchInput] = useState('');
    const [displayData, setDisplayData] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        setDisplayData(data);
        setSelectedIndex(selectedItem)
    }, [data, selectedItem]);

    const handleSearchFieldChange = (e) => {
        const searchInput = e.target.value;
        setSearchInput(searchInput);
        let filteredList = null;
        if (dataType === "users") {
            filteredList = data.filter(person => 
                person.firstName.toLowerCase().includes(searchInput) || person.lastName.toLowerCase().includes(searchInput)
            );
        } else {
            filteredList = data.filter(courses => 
                courses.title.toLowerCase().includes(searchInput)
            );
        }
        setDisplayData(filteredList);
    }

    const onSelectItem = (value, ItemType, index) => {
        setSelectedIndex(index)
        onItemClick(value, ItemType, index)
    }

    return (
        <div className="navigation-main">
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: 'calc(100% - 1rem)' }}}
                noValidate
                autoComplete="off"
            >
                <TextField value={searchInput} onChange={handleSearchFieldChange}  label="Search" variant="outlined" />
            </Box>
            <div className="list">
                <ul>
                    {displayData && displayData.map((item, i) => (
                        <Item
                            ItemType={dataType}
                            onItemClick={onSelectItem}
                            selected={selectedIndex === i}
                            value={item}
                            key={i}
                            index={i}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Navigation
