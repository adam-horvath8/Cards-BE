import jwt, { JwtPayload } from "jsonwebtoken";

const isAuthorized = (req, res, next) => {
  console.log(req.headers);
  
  const token = req.headers.authorization;

  console.log(token);
  

  if (!token) {
    return res.status(401).json({ message: "Access token not found " });
  }

  try {
    const decodedAccessToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = { id: decodedAccessToken.userId };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};

export default isAuthorized;
