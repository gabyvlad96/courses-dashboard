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

const Navigation = (props) => {
    const [searchInput, setSearchInput] = useState('');
    const [displayData, setDisplayData] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(async () => {
        setDisplayData(props.data);
    }, [props.data]);

    const handleSearchFieldChange = (e) => {
        const searchInput = e.target.value;
        setSearchInput(searchInput);
        let filteredList = null;
        if (props.dataType === "users") {
            filteredList = props.data.filter(person => 
                person.firstName.toLowerCase().includes(searchInput) || person.lastName.toLowerCase().includes(searchInput)
            );
        } else {
            filteredList = props.data.filter(courses => 
                courses.title.toLowerCase().includes(searchInput)
            );
        }
        setDisplayData(filteredList);
    }

    const onSelectItem = (value, ItemType, index) => {
        setSelectedItem(index)
        props.onItemClick(value, ItemType)
    }

    return (
        <div className="navigation-main">
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: 'calc(100% - 1rem)' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField value={searchInput} onChange={handleSearchFieldChange}  label="Search" variant="outlined" />
            </Box>
            <div className="list">
                <ul>
                    {displayData && displayData.map((item, i) => (
                        <Item
                            ItemType={props.dataType}
                            onItemClick={onSelectItem}
                            selected={selectedItem === i}
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
