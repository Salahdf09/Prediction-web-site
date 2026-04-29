import './Footer.css';


function Footer() {

      return (
        
        <footer className="footer">
          <div className='footer-part1'>
           <h2>STAY INFORMED</h2>
           <div className='email-subscription'>
             <input type="email" placeholder="example@email.com" />
             <button><span className='btn-text'>SUBSCRIBE</span></button>
           </div>
         </div>

         <div className='line'></div>

         <div className='footer-part2'>
            <div className='general'>
               <h2>General</h2>
               <p>Feedbacks</p>
               <p>Symphony</p>
               <p>Contact Us</p>
            </div>
            <div className='aboutUs'>
               <h2>About Us</h2>
               <p>Our Vision</p>
               <p>Our Services</p>
            </div>

         </div>
         


        </footer>
      )

}

export default Footer;