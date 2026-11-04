import Link from '../ui/Link';
import Reveal from '../ui/Reveal';
import SpecularButton from '../ui/SpecularButton';
import RippleButton from '../ui/RippleButton';
import Icon from '../ui/Icon';
import { SITE_URLS } from '../../data';

function CtaBand() {
  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <Reveal className="cta-band">
          <h2>
            <span>
              Stuck on an <span className="hl-word hl-gold">assignment?</span>
            </span>
            <span className="cta-inline-illu" aria-hidden="true">
              <Icon name="animatedBooks" className="cta-inline-books" />
            </span>
          </h2>
          <p>Book a one-to-one consultation with the library team and get help that fits your course.</p>
          <div className="row">
            <SpecularButton
              as={Link}
              to={SITE_URLS.contact}
              className="btn btn-gold btn-lg"
              radius={14}
              lineColor="#ffffff"
              baseColor="#ffd860"
              intensity={1.2}
            >
              Book a Consultation
            </SpecularButton>
            <RippleButton
              as={Link}
              to={SITE_URLS.referencing}
              className="btn btn-ghost btn-lg"
              rippleColor="var(--em)"
            >
              Try the referencing guide
            </RippleButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default CtaBand;