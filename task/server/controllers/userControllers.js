const User = require ('../models/userSchema');

const login = async (req, res) => {
  try{
    const {username, password} =req.body;
    if(!username || !password){
      return res.json({message: 'all fields are required'})
    }
    const user = await User.findOne({username});
     if(!user){
      return res.json({message:'Incorrect password or email' }) 
    }
  }

  
}
