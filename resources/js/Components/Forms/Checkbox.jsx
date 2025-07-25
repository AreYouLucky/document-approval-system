export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-400 text-blue-600 shadow-sm focus:ring-sky-500 ' +
                className
            }
        />
    );
}
