import icon_1 from '../../../assets/LandingImages/icon_1.png';
import icon_2 from '../../../assets/LandingImages/icon_2.png';
import icon_3 from '../../../assets/LandingImages/icon_3.png';
import icon_4 from '../../../assets/LandingImages/icon_4.png';
import icon_5 from '../../../assets/LandingImages/icon_5.png';
import './HowItWorks.css';


function HowItWorks() {

   return (
    <div className="howItWorks">
        <div className="hiw_left">

          <svg className="dashed-arc" viewBox="0 0 300 600">
           <path
            d="M 0 30 A 270 270 0 0 1 0 570"
             fill="none"
            stroke="#132C41"
            strokeWidth="2.5"
            strokeDasharray="8 6"
          />
           <circle cx="155" cy="80"  r="7" fill="#132C41"/>
           <line x1="150" y1="80" x2="300" y2="30" stroke="#132C41" strokeWidth="1.5"/>
           <circle cx="238" cy="165" r="7" fill="#132C41"/>
           <line x1="240" y1="165" x2="420" y2="150" stroke="#132C41" strokeWidth="1.5"/>
           <circle cx="270" cy="290" r="7" fill="#132C41"/>
           <line x1="270" y1="290" x2="420" y2="290" stroke="#132C41" strokeWidth="1.5"/>
           <circle cx="250" cy="400" r="7" fill="#132C41"/>
           <line x1="250" y1="400" x2="420" y2="430" stroke="#132C41" strokeWidth="1.5"/>
           <circle cx="182" cy="500" r="7" fill="#132C41"/>
           <line x1="180" y1="500" x2="300" y2="550" stroke="#132C41" strokeWidth="1.5"/>

         </svg>

        <div className="half_circle"></div>

       <div className="hiw_text">
         <h2>Prediction model</h2>   
         <h3>How the app works</h3>
       </div>

     </div>

        <div className="hiw_right">
            <div className="step1">
              <div className="step-number">01</div>
              <div className="step-card">
                <div className="step-text">
                   <h3>Student submits work</h3>
                   <p>The student submits their academic work and grades to the platform.</p>
                </div>
               <img src={icon_1} alt="icone" className="step-icone"/>
             </div>
             </div>

            <div className="step2">
              <div className="step-number">02</div>
              <div className="step-card">
                 <div className="step-text">
                  <h3>Data extraction</h3>
                  <p>Our algorithm extracts and processes the key data from the student's work.</p>
                 </div>
                  <img src={icon_2} alt="icone" className="step-icone"/>
             </div>
             </div>

            <div className="step3">
              <div className="step-number">03</div>
              <div className="step-card">
                 <div className="step-text">
                    <h3>AI analysis</h3>
                    <p>The data is analyzed and interpreted to understand the student's academic level.</p>
                  </div>
               <img src={icon_3} alt="icone" className="step-icone"/>
             </div>
             </div>

            <div className="step4">
              <div className="step-number">04</div>
              <div className="step-card">
                 <div className="step-text">
                   <h3>Grading and review</h3>
                   <p>Our AI grading model evaluates and validates the student's performance accurately.</p>
                  </div>
                <img src={icon_4} alt="icone" className="step-icone"/>
             </div>
             </div>
            

            <div className="step5">
              <div className="step-number">05</div>
              <div className="step-card">
                 <div className="step-text">
                    <h3>Grades and feedback generated</h3>
                    <p>The student receives their final grades and personalized feedback.</p>
                  </div>
                <img src={icon_5} alt="icone" className="step-icone"/>
              </div>
             </div>

           </div>

      </div>
   )

}

export default HowItWorks;