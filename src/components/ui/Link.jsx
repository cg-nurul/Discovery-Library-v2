import { forwardRef } from 'react';
import { resolveUrl } from '../../data/urls';

/**
 * Universal Link component.
 * Routes directly to WordPress destination URLs without navigating to internal subpages.
 */
const Link = forwardRef(function Link({ to, href, children, ...rest }, ref) {
  const targetHref = resolveUrl(to || href);
  return (
    <a ref={ref} href={targetHref} {...rest}>
      {children}
    </a>
  );
});

export default Link;