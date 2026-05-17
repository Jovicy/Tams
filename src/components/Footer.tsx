import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="border-t border-border py-12 md:py-16 bg-card">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
                <div className='md:col-span-2'>
                    {/* Logo */}
                    <Link to="/" className="flex items-center mb-4">
                        <span className='font-playfair text-2xl font-extrabold text-primary'>
                            Tamara Jewelries
                        </span>
                    </Link>
                    <p className='text-muted-text text-sm max-w-sm'>Elevating the gold buying experience for Nigerians. Secure, transparent, and flexible payment options for luxury jewelry.</p>
                </div>
                <div>
                    <h4 className='font-semibold text-foreground mb-4 font-playfair'>Shop</h4>
                    <ul className="">
                        <Link to="/shop" className='text-sm text-muted-text hover:text-primary transition block mb-2'>
                            <li>All Jewelry</li>
                        </Link>
                        <Link to="/plans" className='text-sm text-muted-text hover:text-primary transition block mb-2'>
                            <li>Payment Plans</li>
                        </Link>
                    </ul>
                </div>
                <div>
                    <h4 className='font-semibold text-foreground mb-4 font-playfair'>Legal</h4>
                    <ul className="">
                        <Link to="/terms" className='text-sm text-muted-text hover:text-primary transition block mb-2'>
                            <li>Terms of Service</li>
                        </Link>
                        <Link to="/privacy" className='text-sm text-muted-text hover:text-primary transition block mb-2'>
                            <li>Privacy Policy</li>
                        </Link>
                        <Link to="/refunds" className='text-sm text-muted-text hover:text-primary transition block mb-2'>
                            <li>Refund Policy</li>
                        </Link>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border/50 text-sm text-muted-foreground text-center">
                <p>&copy; {new Date().getFullYear()} Tamara Jewelries. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer