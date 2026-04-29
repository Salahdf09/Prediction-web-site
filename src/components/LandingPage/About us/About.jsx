import pic1 from '../../../assets/LandingImages/Front_pic.png';
import pic2 from '../../../assets/LandingImages/about_pic2.jpg';
import pic3 from '../../../assets/LandingImages/about_pic3.jpg';
import './About.css';

function About(){
    return (
     <section className="about">
         <div className="about_text"> 
            <h1 className="AboutUs">About Us</h1>
            <p className="paragraph">Welcome to our educational website! Our mission is to help students understand their 
                academic trajectory, learn, grow and make informed decisions about their future. Explore our website to
                 discover a world of knowledge and opportunities.</p>
            <button className="about_btn">Learn More</button>
         </div> 

         <div className="about_images"> 
            <img className="pic1"  src={pic1} alt="pic1" />
            <img className="pic2"  src={pic2} alt="pic2" />
            <img className="pic3"  src={pic3} alt="pi3" />

         </div> 

    </section>

    )
}

export default About;