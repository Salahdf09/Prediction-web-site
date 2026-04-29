import parent from '../../../assets/LandingImages/parents.png';
import student from '../../../assets/LandingImages/students.png';
import school from '../../../assets/LandingImages/school.png';
import './Services.css';


function Services() {
    return (
        <section className="services">
            <div className="services_text">
                <h2>Our Services</h2>
                <p>Our platform provides dedicated spaces,
                 each offering tailored tools to analyze  performance,
                 predict outcomes, and support academic decisions.</p>
            </div>

            <div className="services_images">
                <div className="carte">
                    <img src={parent} alt="Parent" className="service-pic" />
                    <h3>Parents</h3>
                    <p>Help you better understand and support your child’s 
                        academic journey.</p>
                </div>

                <div className="carte">
                    <img src={student} alt="Student" className="service-pic" />
                    <h3>Students</h3>
                    <p>Help you better understand your academic progress and
                         take control of your future.</p>
                </div>

                <div className="carte">
                    <img src={school} alt="School" className="service-pic" />
                    <h3>Schools</h3>
                    <p>Monitor student performance, identify trends and 
                        support better academic decisions through clear data insights.</p>
                </div>

                
            </div>

        </section>
    );
}

export default Services;