/** @jsx jsx */
import { jsx } from "@emotion/core"
import PropTypes from "prop-types"
import { Link as GatsbyLink } from "gatsby"

import colors from "../../theme/colors"

const Link = ({
  children,
  href,
  target,
  to,
  customCss,
  variant = `DEFAULT`,
  ...rest
}) => {
  const baseStyles = {
    alignItems: `center`,
    color: colors.purple[60],
    display: `inline-flex`,
  }

  const styles = {
    SIMPLE: {
      textDecoration: `none`,
      ":focus, :hover": {
        color: colors.purple[40],
        textDecoration: `underline`,
      },
    },
    DEFAULT: {
      textDecoration: `underline`,
      ":focus, :hover": {
        color: colors.purple[60],
        textDecoration: `underline`,
      },
    },
  }

  return href ? (
    <a
      href={href}
      target={target}
      rel={target === `_blank` ? `noopener noreferrer` : ``}
      css={{
        ...baseStyles,
        ...styles[variant],
        ...customCss,
      }}
      {...rest}
    >
      {children}
    </a>
  ) : (
    <GatsbyLink
      to={to}
      css={{
        ...baseStyles,
        ...styles[variant],
        ...customCss,
      }}
      {...rest}
    >
      {children}
    </GatsbyLink>
  )
}

Link.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  target: PropTypes.string,
  to: PropTypes.string,
  variant: PropTypes.oneOf([`DEFAULT`, `SIMPLE`]),
}

export default Link
