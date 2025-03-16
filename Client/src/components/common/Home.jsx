import { useContext, useEffect, useState } from 'react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion';

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj)

  const { isSignedIn, user, isLoaded } = useUser()
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onSelectRole(e) {
    setError('')
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;
    let res = null;
    try {
      if (selectedRole === 'author') {
        res = await axios.post('http://localhost:4000/author-api/author', currentUser)
        let { message, payload } = res.data;
        if (message === 'author') {
          setCurrentUser({ ...currentUser, ...payload })
          localStorage.setItem("currentuser", JSON.stringify(payload))
        } else {
          setError(message);
        }
      }
      if (selectedRole === 'user') {
        res = await axios.post('http://localhost:4000/user-api/user', currentUser)
        let { message, payload } = res.data;
        if (message === 'user') {
          setCurrentUser({ ...currentUser, ...payload })
          localStorage.setItem("currentuser", JSON.stringify(payload))
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (isSignedIn === true) {
      setCurrentUser({
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      });
    }
  }, [isLoaded])

  useEffect(() => {
    if (currentUser?.role === "user" && error.length === 0) {
      navigate(`/user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0) {
      navigate(`/author-profile/${currentUser.email}`);
    }
  }, [currentUser]);

  return (
    <div className='container'>
      {isSignedIn === false && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <motion.img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTG1LW-o46L89kVB2prwNmWNpXYH5nU-2qeg&s" 
          alt="Tech Insights" 
          className="img-fluid mx-auto d-block w-100 mb-4" 
          style={{ maxWidth: "600px" }} 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        <marquee behavior="scroll" direction="left" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          Your Destination for Innovation, Learning & Growth
        </marquee>
        
        <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
          Technology is rapidly evolving, shaping the way we work, learn, and innovate. At Tech Insights Hub, we bring you:
        </motion.p>
          <motion.ul className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
            <li>🔥 Latest trends in AI, Machine Learning, and Data Science</li>
            <li>💻 Hands-on coding tutorials and software development insights</li>
            <li>🔐 Cybersecurity updates and best practices for digital safety</li>
            <li>📊 Business intelligence, data analytics, and visualization techniques</li>
            <li>🚀 Career tips, industry insights, and expert guidance to help you grow</li>
          </motion.ul>
          <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2.5 }}>
            Whether you're a student, developer, or tech enthusiast, you'll find valuable content to enhance your skills and stay ahead in the ever-changing world of technology.
          </motion.p>
        </motion.div>
      )}

      {isSignedIn === true && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <div className='d-flex justify-content-evenly align-items-center bg-info p-3'>
            <motion.img src={user.imageUrl} width="100px" className='rounded-circle' alt="" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} />
            <motion.p className="display-6" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>{user.firstName}</motion.p>
            <motion.p className="lead" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>{user.emailAddresses[0].emailAddress}</motion.p>
          </div>
          <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>Select role</motion.p>
          {error.length !== 0 && (
            <motion.p className="text-danger fs-5" style={{ fontFamily: "sans-serif" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
              {error}
            </motion.p>
          )}
          <div className='d-flex role-radio py-3 justify-content-center'>
            <motion.div className="form-check me-4" whileHover={{ scale: 1.1 }}>
              <input type="radio" name="role" id="author" value="author" className="form-check-input" onChange={onSelectRole} />
              <label htmlFor="author" className="form-check-label">Author</label>
            </motion.div>
            <motion.div className="form-check" whileHover={{ scale: 1.1 }}>
              <input type="radio" name="role" id="user" value="user" className="form-check-input" onChange={onSelectRole} />
              <label htmlFor="user" className="form-check-label">User</label>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Home
