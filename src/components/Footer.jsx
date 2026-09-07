export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <p className="footer-brand">Contoso Gear</p>
          <p className="footer-note">
            A sample storefront. No real orders are placed and no payment is taken.
          </p>
        </div>
        <div className="footer-cols">
          <div>
            <h4>Shop</h4>
            <p>Audio</p>
            <p>Wearables</p>
            <p>Peripherals</p>
          </div>
          <div>
            <h4>Support</h4>
            <p>Shipping</p>
            <p>Returns</p>
            <p>Warranty</p>
          </div>
          <div>
            <h4>Company</h4>
            <p>About</p>
            <p>Careers</p>
            <p>Press</p>
          </div>
        </div>
      </div>
      <p className="footer-legal">© {new Date().getFullYear()} Contoso Gear — demo application.</p>
    </footer>
  )
}
