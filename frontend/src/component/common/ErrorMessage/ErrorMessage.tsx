
interface ErrorMessageProps
{
    message: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <div style={{textAlign: 'center'}}>
            <p style={{ fontSize: '18px' }}>{message}</p>
        </div>
    )
}

export default ErrorMessage;