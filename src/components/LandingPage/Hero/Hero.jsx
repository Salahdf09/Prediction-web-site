import hero_pic from '../../../assets/LandingImages/Hero_pic.png';
import './Hero.css';

function Hero(){
    return(
        <section className="hero">
           <div className="hero_text"> 
            <h1 className="welcome">Welcome to the  <span className="light_yellow">Ultimate Learning</span><span className="dark_yellow">Experience</span></h1>
            <p className="text">Success is not predicted to limit you. It is predicted to progress you!</p>
            <button className="btn_explore">Start Learning Now</button>
           </div> 

        <img className="hero_pic"  src={hero_pic} alt="Hero Image" />
          
        </section>
    )
}

export default Hero;