export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-sm roboto-thin text-red-600 ' + className}
        >
            {message}
        </p>
    ) : null;
}
