class CustomError extends Error{
    constructor(message, code){
        super(message);
        this.code = code
    }
}


export default CustomError

//FIXME:
// Memory handling in class and function - CallByValue and CallByRef