import { Datepicker } from "flowbite-react";

const SelectDate = ({ className, onChange, ...props }) => {
    return (
        <Datepicker
            className={`border-gray-400 ${className}`}
            placeholder="Select date"
            onChange={(date) => {
                if (!date) return;
                const localDate = new Date(date);
                const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;

                onChange({ target: { value: formattedDate } });
            }}
            {...props}
        />
    );
};

export default SelectDate;
