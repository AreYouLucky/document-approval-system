export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                ` inline-flex items-center rounded-md border border-transparent  px-4 py-2 text-xs font-semibold tracking-widest hover:text-white transition duration-150 ease-in-out hover:bg-sky-600  ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
