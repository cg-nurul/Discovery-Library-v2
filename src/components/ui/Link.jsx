import { forwardRef } from 'react';

/* All internal links go through <Link>. It renders plain "#/route" hrefs like the
 * reference. To use React Router, change the body of <Link> to <RouterLink to={to} />. */

const Link = forwardRef(function Link({ to, children, ...rest }, ref) {
  return (
    <a ref={ref} href={`#${to}`} {...rest}>
      {children}
    </a>
  );
});

export default Link;