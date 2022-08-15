import './Toast.css';

interface IToastProps {
  message: string;
}

export default function Toast({ message }: IToastProps) {
  return (
    <span className='Toast'>{message}</span>
  );
}