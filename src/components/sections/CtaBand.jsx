import Link from '../ui/Link';
import Reveal from '../ui/Reveal';
import SpecularButton from '../ui/SpecularButton';

function CtaBand() {
  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <Reveal className="cta-band">
          <h2>Stuck on an assignment?</h2>
          <p>Book a one-to-one consultation with the library team and get help that fits your course.</p>
          <div className="row">
            <SpecularButton
              as={Link}
              to="/consultation"
              className="btn btn-gold btn-lg"
              radius={14}
              lineColor="#ffffff"
              baseColor="#ffd860"
              intensity={1.2}
            >
              Book a Consultation
            </SpecularButton>
            <Link to="/referencing" className="btn btn-ghost btn-lg">Try the referencing guide</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default CtaBand;