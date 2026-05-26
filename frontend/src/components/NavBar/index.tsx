import { NavLink, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import logo from '../../assets/logo.png'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/promotions', label: 'Promotions' },
]

function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="mr-4 flex shrink-0 items-center">
          <img src={logo} alt="Smart Shopping Assistant Logo" className="h-8 w-auto" />
        </Link>

        <nav className="flex flex-1 items-center gap-0.5" aria-label="Main navigation">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 text-[1.0625rem] transition-colors',
                  isActive
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground font-normal hover:text-foreground',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <Button
          className="ml-auto shrink-0"
          nativeButton={false}
          render={<NavLink to="/cart" />}
        >
          Cart
        </Button>
      </div>
    </header>
  )
}

export default NavBar
