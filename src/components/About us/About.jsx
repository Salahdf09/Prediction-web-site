import { useState } from 'react';
import pic1 from '../../Assets/Front_pic.png';
import pic2 from '../../Assets/about_pic2.jpg';
import pic3 from '../../Assets/about_pic3.jpg';
import './About.css';

const images = [pic1, pic2, pic3]

function About() {
  const [current, setCurrent] = useState(1)

const getPosition = (i) => {
  if (i === current) return "center";
  
  // left side
  if (i === current - 1) return "left";
  if (current === 0 && i === images.length - 1) return "left";
  
  // right side
  if (i === current + 1) return "right";
  if (current === images.length - 1 && i === 0) return "right";
  
  return "right"; // default
}

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
             {images.map((pic, i) => (
           <div
            key={i}
            className={`img-wrapper ${getPosition(i)}`}
            onClick={() => setCurrent(i)}
           >
            <img src={pic} alt={`about ${i + 1}`} className="about-img" />
             {i !== current && <div className="blur-overlay" />}
          </div>
        ))}

         </div> 

    </section>

    )
}

export default About;