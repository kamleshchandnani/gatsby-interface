/** @jsx jsx */
import { jsx } from "@emotion/core"
import React, {
  Fragment,
  useState,
  useRef,
  createContext,
  useMemo,
  useCallback,
  useEffect,
} from "react"
import PropTypes from "prop-types"

import cardStyles from "../../../theme/styles/card"
import colors from "../../../theme/colors"
import fonts from "../../../theme/fonts"
import fontSizes from "../../../theme/fontSizes"
import { spaces, breakpoints, radius } from "../../../utils/presets"
import { Heading } from "../Heading"
import { Button } from "../Button"
import toggleTipIcon from "./assets/toggleTipIcon.svg"
import { capitalizeString } from "../../../utils/helpers/"
import { CheckIcon } from "../../icons"
import { ToggleTip } from "../ToggleTip"

const VARIANTS = [`PRIMARY`, `SECONDARY`]

const PricingCardContext = createContext()

function PricingCard({
  children,
  plans,
  selectedPlan,
  interval = `MONTHLY`,
  cta,
  variant = `PRIMARY`,
  visibleOnMobile = 0,
  ...rest
}) {
  const [state, setState] = useState({
    plans,
    selectedPlan,
    interval,
    cta,
    variant,
    visibleOnMobile,
  })

  useEffect(() => {
    setState({ ...state, interval })
  }, [interval])

  useEffect(() => {
    setState({ ...state, selectedPlan })
  }, [selectedPlan])

  const makeVisibleOnMobile = useCallback(
    item =>
      setState(oldState => {
        return {
          ...oldState,
          visibleOnMobile: item,
        }
      }),
    []
  )

  const value = useMemo(() => {
    return { ...state, makeVisibleOnMobile }
  }, [state])

  return (
    <PricingCardContext.Provider value={value}>
      {children ? (
        children
      ) : (
        <PricingCard.Frame {...rest}>
          {plans && (
            <Fragment>
              <PricingCard.Nav />
              <PricingCard.Plans>
                {plans.map((plan, idx) => (
                  <PricingCard.Plan key={plan.name} idx={idx}>
                    <PricingCard.Icon plan={plan} />
                    <PricingCard.Heading plan={plan} />
                    <PricingCard.Intro plan={plan} />
                    <PricingCard.PriceTag plan={plan} />
                    <PricingCard.Details plan={plan} />
                    <PricingCard.Cta plan={plan} />
                  </PricingCard.Plan>
                ))}
              </PricingCard.Plans>
            </Fragment>
          )}
          {cta && <PricingCard.UnifiedCta />}
        </PricingCard.Frame>
      )}
    </PricingCardContext.Provider>
  )
}

PricingCard.propTypes = {
  plans: PropTypes.array.isRequired,
  variant: PropTypes.oneOf(VARIANTS),
}

PricingCard.Frame = ({ children, ...rest }) => {
  const { variant } = PricingCard.useContext()

  return (
    <div
      css={{
        boxShadow: `0px 2px 4px rgba(46, 41, 51, 0.08), 0px 4px 8px rgba(71, 63, 79, 0.16)`,
        backgroundColor:
          variant === `SECONDARY` ? colors.purple[90] : colors.white,
        display: `flex`,
        position: `relative`,
        width: `100%`,
        flexDirection: `column`,
        borderRadius: radius.large,

        [`@media(min-width: ${breakpoints.tablet}px)`]: {},
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

PricingCard.Nav = ({ ...rest }) => {
  const {
    plans,
    visibleOnMobile,
    makeVisibleOnMobile,
  } = PricingCard.useContext()

  return plans.length > 1 ? (
    <nav
      css={{
        display: `flex`,
        width: `100%`,
        justifyContent: `space-around`,
        borderBottom: `1px solid ${colors.standardLine}`,

        [`@media(min-width: ${breakpoints.tablet}px)`]: {
          display: `none`,
        },
      }}
    >
      {plans.map((plan, idx) => (
        <button
          key={idx}
          onClick={() => makeVisibleOnMobile(idx)}
          css={{
            background: `transparent`,
            border: `none`,
            color: visibleOnMobile === idx ? plan.color : colors.grey[70],
            cursor: `pointer`,
            fontFamily: fonts.header.join(`,`),
            fontSize: fontSizes[2],
            padding: `${spaces.m} ${spaces.s} ${spaces.s}`,
            position: `relative`,

            ":after": {
              background: plan.color,
              content: `""`,
              display: visibleOnMobile === idx ? `block` : `none`,
              width: `100%`,
              height: `2px`,
              position: `absolute`,
              bottom: 0,
              left: 0,
            },
          }}
        >
          {plan.name && capitalizeString({ str: plan.name })}
        </button>
      ))}
    </nav>
  ) : null
}

PricingCard.Plans = ({ children, ...rest }) => (
  <div
    css={{
      display: `flex`,
      position: `relative`,
      width: `100%`,
      overflow: `hidden`,
      height: `100%`,
    }}
    {...rest}
  >
    {children}
  </div>
)

PricingCard.Plan = ({ children, idx, ...rest }) => {
  const { visibleOnMobile, plans } = PricingCard.useContext()

  return (
    <div
      css={{
        padding: `${spaces.l} ${spaces.l} 0 `,
        display: visibleOnMobile === idx ? `flex` : `none`,
        flexDirection: `column`,
        alignItems: `center`,
        flexShrink: 0,
        width: `100%`,

        [`&:not(:first-child)`]: {
          borderLeft: `1px solid ${colors.standardLine}`,
        },

        [`@media(min-width: ${breakpoints.tablet}px)`]: {
          display: `flex`,
          flexShrink: 1,
          flexBasis: `calc(100% / ${plans.length})`,
        },
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

PricingCard.Heading = ({ plan, ...rest }) => {
  const { variant } = PricingCard.useContext()
  const { name, color } = plan

  if (!name) {
    return null
  }
  return (
    <Heading
      css={{
        color: color
          ? color
          : variant === `SECONDARY`
          ? colors.white
          : colors.purple[40],
        fontSize: fontSizes[4],
      }}
    >
      {capitalizeString({ str: name })}
    </Heading>
  )
}

PricingCard.Icon = ({ plan, ...rest }) => {
  const { name, icon } = plan

  if (!icon) {
    return null
  }

  return (
    <div
      css={{
        alignItems: `center`,
        display: `flex`,
        height: `50px`,
        justifyContent: `center`,
        marginBottom: spaces.xs,
        width: `50px`,
      }}
      {...rest}
    >
      <img src={icon} alt={name} css={{ margin: 0 }} />
    </div>
  )
}

PricingCard.Intro = ({ plan, ...rest }) => {
  const { variant } = PricingCard.useContext()
  const { intro } = plan

  if (!intro) {
    return null
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: intro }}
      css={{
        textAlign: `center`,
        fontFamily: fonts.system.join(`,`),
        marginTop: spaces.m,
        fontSize: fontSizes[1],
        color: variant === `SECONDARY` ? colors.purple[30] : colors.grey[60],
        lineHeight: 1.4,

        p: {
          margin: 0,
        },
      }}
    />
  )
}

PricingCard.PriceTag = ({ plan, children, ...rest }) => {
  const { interval } = PricingCard.useContext()
  const { price } = plan

  if (!price) {
    return null
  }

  return (
    <div
      css={{
        fontFamily: fonts.header.join(`,`),
        marginTop: spaces.l,
        lineHeight: 1,
      }}
    >
      <span
        css={{
          color: colors.grey[50],
          fontSize: fontSizes[2],
          display: `inline-block`,
          transform: `translate(-.1rem, -.7rem)`,
        }}
      >
        $
      </span>
      <strong
        css={{
          fontSize: fontSizes[8],
        }}
      >
        {price[interval]}
      </strong>

      <span
        css={{
          fontFamily: fonts.system.join(`,`),
          color: colors.grey[50],
          fontSize: fontSizes[0],
          display: `inline-block`,
          transform: `translateX(.2rem)`,
        }}
      >
        / month
      </span>
    </div>
  )
}

PricingCard.Details = ({ plan, ...rest }) => {
  const { variant } = PricingCard.useContext()
  const { details } = plan
  const [tipVisible, setTipVisible] = useState(false)

  if (!details) {
    return null
  }

  const showTip = e => {
    if (
      e.type === `click` ||
      (e.type === `keydown` && (e.keyCode === 32 || e.keyCode === 13))
    )
      setTipVisible(true)
  }
  return (
    details && (
      <div
        css={{
          fontSize: fontSizes[1],
          color: variant === `SECONDARY` ? colors.purple[30] : colors.grey[50],
          width: `100%`,
          marginTop: spaces.l,
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
        }}
      >
        <ul
          css={{
            listStyle: `none`,
            padding: 0,
            margin: 0,
            width: `auto`,
          }}
        >
          {details.map((item, idx) => (
            <li
              key={`detail${idx}`}
              css={{
                display: `flex`,
                margin: `${spaces.xs} 0`,
                position: `relative`,
                lineHeight: 1.3,
              }}
            >
              <CheckIcon
                css={{
                  width: `1.5em`,
                  height: `1.5em`,
                  fill:
                    variant === `SECONDARY`
                      ? colors.purple[50]
                      : colors.grey[30],
                  marginRight: spaces.xs,
                  flexShrink: 0,
                  flexGrow: 0,
                  transform: `translateY(-.2em)`,
                }}
              />
              <div
                dangerouslySetInnerHTML={{ __html: item.text }}
                css={{
                  position: `relative`,
                  outline: `none`,
                  p: {
                    display: `inline`,
                  },
                }}
              />
              {item.tip && (
                <ToggleTip
                  tip={item.tip}
                  customCss={{ marginLeft: spaces.xs }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  )
}

PricingCard.Cta = ({ children, plan, ...rest }) => {
  const { selectedPlan } = PricingCard.useContext()
  const { cta, color, name } = plan

  if (!cta) {
    return null
  }

  const { label, to, onClick, comment } = cta

  return selectedPlan !== name ? (
    <div
      css={{
        width: `100%`,
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `flex-end`,
        marginTop: spaces[`2xl`],
        flexGrow: 1,
        paddingBottom: spaces[`4xl`],
      }}
    >
      {label && (to || onClick) && (
        <Button
          to={to}
          onClick={() => onClick(name)}
          css={{
            width: `100%`,
            background: color ? colors.white : colors.purple[50],
            color: color ? color : colors.white,
            borderColor: color ? color : colors.purple[50],
            ":hover": {
              color: colors.white,
              background: color ? color : colors.purple[50],
              borderColor: color ? color : colors.purple[50],
            },
          }}
        >
          {label}
        </Button>
      )}
      {children}
    </div>
  ) : (
    <div
      css={{
        width: `100%`,
        display: `flex`,
        alignItems: `flex-end`,
        justifyContent: `center`,
        marginTop: spaces[`2xl`],
        flexGrow: 1,
        paddingBottom: spaces[`4xl`],
      }}
    >
      <div
        css={{
          width: `3rem`,
          height: `3rem`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          background: colors.green[50],
          borderRadius: `50%`,
        }}
      >
        <CheckIcon css={{ fill: colors.white, width: `70%`, height: `70%` }} />
      </div>
    </div>
  )
}

PricingCard.UnifiedCta = ({ children, ...rest }) => {
  const { cta } = PricingCard.useContext()

  if (!cta) {
    return null
  }

  const { label, to, comment } = cta

  return (
    <div
      css={{
        flexDirection: `column`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        padding: `${spaces.xl} ${spaces.l} ${spaces.l}`,
      }}
      {...rest}
    >
      {label && to && (
        <Button to={to} tone={`SUCCESS`} css={{ minWidth: `45%` }}>
          {label}
        </Button>
      )}
      {comment && (
        <span
          dangerouslySetInnerHTML={{ __html: comment }}
          css={{
            fontFamily: fonts.header.join(`,`),
            color: colors.grey[50],
            fontSize: fontSizes[2],
            margin: 0,
            marginTop: spaces.xs,
            textAlign: `center`,
          }}
        />
      )}
      {children}
    </div>
  )
}

PricingCard.useContext = () => {
  const context = React.useContext(PricingCardContext)
  if (!context) {
    throw new Error(
      `PricingCard compound components cannot be rendered outside the main component`
    )
  }
  return context
}

export default PricingCard
