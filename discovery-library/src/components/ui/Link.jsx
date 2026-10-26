/* All internal links go through <Link>. It renders plain "#/route" hrefs like the
 * reference. To use React Router, change the body of <Link> to <RouterLink to={to} />. */

function Link({ to, children, ...rest }) {
  return <a href={`#${to}`} {...rest}>{children}</a>;
}

export default Link;