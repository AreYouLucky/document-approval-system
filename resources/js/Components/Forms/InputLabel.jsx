export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block font-medium text-gray-800 roboto-thin text-sm dark:text-gray-50 mb-2
                ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
