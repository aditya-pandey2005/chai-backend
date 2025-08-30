import { asynchandler } from "../utils/asynchandlers";

const registerUser = asynchandler( async(req, res) => {
    res.status(200).json({
        message: "ok"
    })
})

export {registerUser}