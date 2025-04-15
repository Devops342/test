const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => 
{
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];

  
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try 
  {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.isAdmin = (req, res, next) => {
  console.log(req.user)
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied: Admins only' });
  next();
};
