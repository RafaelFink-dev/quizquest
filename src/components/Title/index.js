import './title.css';

export default function Title({ children, name }){ //Quem ta dentro dele, por isso o filho
    return(
        <div className='title'>
            {children}
            <span>{name}</span>
        </div>
    )
}