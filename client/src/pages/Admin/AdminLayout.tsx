import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../utils/supabase'
import {
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlineNewspaper,
  HiOutlineHome,
  HiOutlineStar,
  HiOutlinePhotograph,
  HiOutlineMenu,
  HiOutlineChartBar,
  HiOutlineMail,
  HiOutlineCog,
  HiOutlineChatAlt,
  HiOutlineMenuAlt2,
  HiOutlineLogout,
  HiOutlineOfficeBuilding
} from 'react-icons/hi'
import './AdminDashboard.css'
import './AdminResponsiveTables.css'

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !session) {
          navigate('/admin/login')
          setLoading(false)
          return
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (user && !userError) {
          setAuthenticated(true)
          setUser(user)
        } else {
          navigate('/admin/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        navigate('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 782 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileMenuOpen])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/'
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  if (loading) {
    return (
      <div className="wp-admin">
        <div className="wp-admin-loading">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow" />
        <title>Admin Dashboard - Katy Murr</title>
      </Helmet>
      <div className={`wp-admin ${sidebarCollapsed ? 'folded' : ''}`}>
        {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="wp-admin-mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Top Bar */}
      <div className="wp-admin-bar">
        <div className="wp-admin-bar-left">
          <button 
            className="wp-admin-bar-menu-toggle"
            onClick={() => {
              // On mobile, toggle mobile menu
              if (window.innerWidth <= 782) {
                setMobileMenuOpen(!mobileMenuOpen)
              } else {
                // On desktop, toggle sidebar collapse
                setSidebarCollapsed(!sidebarCollapsed)
              }
            }}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <HiOutlineMenuAlt2 size={20} />
          </button>
          <a href="/" className="wp-admin-bar-site-name" target="_blank" rel="noopener noreferrer">
            Visit Site
          </a>
        </div>
        <div className="wp-admin-bar-right">
          <span className="wp-admin-bar-user">
            {user?.email}
          </span>
          <button onClick={handleLogout} className="wp-admin-bar-logout">
            <HiOutlineLogout size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
            Log Out
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`wp-admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="wp-admin-sidebar-header">
          <h1 className="wp-admin-sidebar-title">Katy Murr</h1>
          <p className="wp-admin-sidebar-subtitle">CMS</p>
        </div>
        <nav className="wp-admin-sidebar-menu">
          <Link
            to="/admin"
            className={`wp-admin-menu-item ${isActive('/admin') && !location.pathname.includes('/admin/') ? 'current' : ''}`}
            onClick={() => {
              if (window.innerWidth <= 782) {
                setMobileMenuOpen(false)
              }
            }}
          >
            <HiOutlineViewGrid size={20} />
            <span className="menu-text">Dashboard</span>
          </Link>
          <Link
            to="/admin/pages"
            className={`wp-admin-menu-item ${isActive('/admin/pages') ? 'current' : ''}`}
            onClick={() => {
              if (window.innerWidth <= 782) {
                setMobileMenuOpen(false)
              }
            }}
          >
            <HiOutlineDocumentText size={20} />
            <span className="menu-text">Pages</span>
          </Link>
          <Link
            to="/admin/blog"
            className={`wp-admin-menu-item ${isActive('/admin/blog') ? 'current' : ''}`}
            onClick={() => {
              if (window.innerWidth <= 782) {
                setMobileMenuOpen(false)
              }
            }}
          >
            <HiOutlineNewspaper size={20} />
            <span className="menu-text">Blog</span>
          </Link>
          <Link
            to="/admin/services"
            className={`wp-admin-menu-item ${isActive('/admin/services') ? 'current' : ''}`}
            onClick={() => {
              if (window.innerWidth <= 782) {
                setMobileMenuOpen(false)
              }
            }}
          >
            <HiOutlineHome size={20} />
            <span className="menu-text">Services</span>
          </Link>
          <Link
            to="/admin/references"
            className={`wp-admin-menu-item ${isActive('/admin/references') ? 'current' : ''}`}
            onClick={() => {
              if (window.innerWidth <= 782) {
                setMobileMenuOpen(false)
              }
            }}
          >
            <HiOutlineStar size={20} />
            <span className="menu-text">References</span>
          </Link>
          <Link
            to="/admin/media"
            className={`wp-admin-menu-item ${isActive('/admin/media') ? 'current' : ''}`}
            onClick={() => {
              if (window.innerWidth <= 782) {
                setMobileMenuOpen(false)
              }
            }}
          >
            <HiOutlinePhotograph size={20} />
            <span className="menu-text">Media</span>
          </Link>
          <Link
            to="/admin/client-logos"
            className={`wp-admin-menu-item ${isActive('/admin/client-logos') ? 'current' : ''}`}
            onClick={() => {
              if (window.innerWidth <= 782) {
                setMobileMenuOpen(false)
              }
            }}
          >
            <HiOutlineOfficeBuilding size={20} />
            <span className="menu-text">Client Logos</span>
          </Link>
          <Link
            to="/admin/menu"
            className={`wp-admin-menu-item ${isActive('/admin/menu') ? 'current' : ''}`}
            onClick={() => {
              if (window.innerWidth <= 782) {
                setMobileMenuOpen(false)
              }
            }}
          >
            <HiOutlineMenu size={20} />
            <span className="menu-text">Menu</span>
          </Link>
          <Link
            to="/admin/analytics"
            className={`wp-admin-menu-item ${isActive('/admin/analytics') ? 'current' : ''}`}
            onClick={() => {
              if (window.innerWidth <= 782) {
                setMobileMenuOpen(false)
              }
            }}
          >
            <HiOutlineChartBar size={20} />
            <span className="menu-text">Analytics</span>
          </Link>
          <Link
            to="/admin/newsletter"
            className={`wp-admin-menu-item ${isActive('/admin/newsletter') ? 'current' : ''}`}
            onClick={() => {
              if (window.innerWidth <= 782) {
                setMobileMenuOpen(false)
              }
            }}
          >
            <HiOutlineMail size={20} />
            <span className="menu-text">Newsletter</span>
          </Link>
          <Link
            to="/admin/settings"
            className={`wp-admin-menu-item ${isActive('/admin/settings') ? 'current' : ''}`}
            onClick={() => {
              if (window.innerWidth <= 782) {
                setMobileMenuOpen(false)
              }
            }}
          >
            <HiOutlineCog size={20} />
            <span className="menu-text">Settings</span>
          </Link>
          <Link
            to="/admin/contact"
            className={`wp-admin-menu-item ${isActive('/admin/contact') ? 'current' : ''}`}
            onClick={() => {
              if (window.innerWidth <= 782) {
                setMobileMenuOpen(false)
              }
            }}
          >
            <HiOutlineChatAlt size={20} />
            <span className="menu-text">Contact Messages</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="wp-admin-content">
        <Outlet />
      </div>
      </div>
    </>
  )
}

export default AdminLayout

