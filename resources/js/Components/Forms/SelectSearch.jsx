import { HiBuildingOffice2 } from "react-icons/hi2";


const SelectSearch = ({
    id,
    items,
    itemValue,
    itemName,
    name,
    value,
    className = '',
    isFocused,
    onChange,
    defaultValue = "",
    icon = <HiBuildingOffice2  className="w-4 h-4 text-gray-500 dark:text-gray-400" />, // Allow passing custom icons
}) => {
    return (
        <div className={`relative ${className}`}>
            {/* Icon positioned inside input */}
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                {icon}
            </div>

            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                autoFocus={isFocused}
                className="block w-full p-4 ps-10 text-sm text-gray-900 border-gray-300 rounded-lg bg-white   focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
                <option className="text-gray-400" value="">
                    {defaultValue === "" ? "Choose" : defaultValue}
                </option>
                {items.map((item) => (
                    <option key={item[itemValue]} value={item[itemValue]}>
                        {item[itemName]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectSearch;
