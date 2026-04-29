import icon_1 from '../../Assets/icon_1.png';
import icon_2 from '../../Assets/icon_2.png';
import icon_3 from '../../Assets/icon_3.png';
import icon_4 from '../../Assets/icon_4.png';
import icon_5 from '../../Assets/icon_5.png';
import half_circle from '../../Assets/half-circle.png'; 
import './HowItWorks.css';


function HowItWorks() {

   return (
    <div className="howItWorks">
        
        <img src={half_circle} alt="" className="hiw_arc_img" />

        <div className="hiw_right">
          
            <div className="hiw_mobile_title">
             <h2>Prediction model</h2>
             <h3>How the app works</h3>
            </div>

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