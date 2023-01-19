// import ErrorHandler from "../Utils/errorHandler.js";

const authorization = (type) => {
  return (req, res, next) => {
    if (type !== req.user.type) {
      return res.json({success: false, msg: `Role (${req.user.type}) is not allowed to acccess this resource`})
    }
    next();
  };
};

export default authorization;
