const SelectInput = ({
    id,
    items,
    itemValue,
    itemName,
    name,
    value,
    className='',
    isFocused,
    onChange,
    defaultValue = "",
}) => {
    return (
        <div className={`relative ${className}`}>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className="bg-gray-50 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                autoFocus={isFocused}
            >
                <option  className="text-gray-400">
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

export default SelectInput;
