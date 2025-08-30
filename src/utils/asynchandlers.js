const asynchandler = (requesthandler) => {
    return (req, res, next) => { //It returns a new function that Express will use as the route handler.
        Promise.resolve(requesthandler(req, res, next)).catch((err) => next(err)) //Runs your handler. If it’s an async function (which returns a promise), it will resolve/reject properly.
    }
}

//In Express, calling next(err) automatically forwards the error to your centralized error-handling middleware.

export{asynchandler}


// const asynchandler = (fn) => async(req, res, next) => {
//     try{
//        await fn(req, res, next)
//     }catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }