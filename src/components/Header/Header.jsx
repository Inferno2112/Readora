import React from 'react'
import {Container, Logo, LogoutBtn} from '../index'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
  },
  {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
  },
  {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
  },
  ]


  return (
  <header className="sticky top-0 z-50 bg-zinc-900 backdrop-blur border-b border-white/10">
    <Container>
      <nav className="flex items-center py-4">
        
        {/* Logo */}
        <div className="mr-6 flex items-center">
          <Link to="/">
            <Logo width="80px" />
          </Link>
        </div>

        {/* Nav Items */}
        <ul className="ml-auto flex items-center gap-2">
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className="
                    px-5 py-2 rounded-full text-sm font-medium
                    text-gray-300
                    hover:text-black hover:bg-yellow-400
                    transition-all duration-200
                  "
                >
                  {item.name}
                </button>
              </li>
            ) : null
          )}

          {/* Logout */}
          {authStatus && (
            <li className="ml-2">
              <LogoutBtn />
            </li>
          )}

          
        </ul>
      </nav>
    </Container>
  </header>
);

}

export default Header