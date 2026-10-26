import Link from '../ui/Link';
import Reveal from '../ui/Reveal';

function CtaBand() {
  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <Reveal className="cta-band">
          <h2>Stuck on an assignment?</h2>
          <p>Book a one-to-one consultation with the library team and get help that fits your course.</p>
          <div className="row">
            <Link to="/consultation" className="btn btn-gold btn-lg">Book a Consultation</Link>
            <Link to="/referencing" className="btn btn-ghost btn-lg">Try the referencing guide</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default CtaBand;