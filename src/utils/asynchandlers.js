const asynchandler = (requesthandler) => {
    (req, res, next) => {
        Promise.resolve(requesthandler(req, res, next)).catch((err) => next(err))
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