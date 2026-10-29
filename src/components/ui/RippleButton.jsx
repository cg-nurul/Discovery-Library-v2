import { useState, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from './Link';
import './RippleButton.css';

/**
 * Material Design Ripple Button Component
 * Recreates the ripple effect from https://motion.dev/examples/react-material-design-ripple
 * with customizable theme color.
 */
const RippleButton = forwardRef(function RippleButton(
  {
    as: Component = Link,
    to,
    onClick,
    children,
    className = '',
    rippleColor = 'var(--em, #19D68A)',
    ...rest
  },
  ref
) {
  const [ripples, setRipples] = useState([]);
  const internalRef = useRef(null);

  const setButtonRef = (node) => {
    internalRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const handlePointerDown = (e) => {
    const el = internalRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate maximum distance to the furthest corner to ensure full button coverage
    const maxX = Math.max(x, rect.width - x);
    const maxY = Math.max(y, rect.height - y);
    const radius = Math.hypot(maxX, maxY);
    const size = radius * 2;

    const newRipple = {
      id: Date.now() + Math.random(),
      x: x - radius,
      y: y - radius,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);
  };

  const removeRipple = (id) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Component
      ref={setButtonRef}
      to={to}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      className={`ripple-btn ${className}`.trim()}
      {...rest}
    >
      <span className="ripple-container" aria-hidden="true">
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.span
              key={r.id}
              className="ripple-wave"
              style={{
                left: r.x,
                top: r.y,
                width: r.size,
                height: r.size,
                backgroundColor: rippleColor,
              }}
              initial={{ scale: 0, opacity: 0.45 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.1, 0.5, 0.2, 1] }}
              onAnimationComplete={() => removeRipple(r.id)}
            />
          ))}
        </AnimatePresence>
      </span>
      <span className="ripple-label">{children}</span>
    </Component>
  );
});

export default RippleButton;
