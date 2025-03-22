

export default function Loading({message}) {

    const style1 = {
       
    };

    const style2 = {
       
    };

    return (
        <div className="flex-column align-items-center" style={style1}>
            <h2>{message}</h2>
            <div className="spinner-border" role="status" style={style2}>
            </div>
        </div>
    );
}