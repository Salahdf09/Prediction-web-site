import './Contact.css';

function Contact () {
    return (
    <section className="contact">

           <div className="contact-text">
            <h2>Contact Us</h2>
            <p>Reach out with any questions, usage inquiries or business proposals</p>
           </div>
         <form>
          <div className="contact-form">
             <div className="row1">
                <p>Title</p>
                <input type="text" className="title" />
             </div>

             <div className="row2">
               <div className="col1">
                 <p>First name</p>
                 <input type="text" className="small" placeholder="First name" />
               </div>
               <div className="col2">
                 <p>Last name</p>
                 <input type="text" className="small" placeholder="Last name" />
               </div>
             </div>

             <div className="row3">
               <div className="col1">
                 <p>Email</p>
                 <input type="email" className="small" placeholder="Your Email" />
               </div>
               <div className="col2">
                 <p>Phone</p>
                 <input type="text" className="small" placeholder="Your Phone" />
               </div>
             </div>

             <div className="row4">
                 <p>Message</p>
                 <textarea className="text-area" placeholder="Your Message"></textarea>
             </div>

            <button className="btn_submit">SUBMIT</button>
         </div>
       </form>
    </section>
    );
}

export default Contact;