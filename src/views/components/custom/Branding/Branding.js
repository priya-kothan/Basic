import React from 'react'

import FreeflowLogo from './FreeflowLogo/FreeflowLogo'
import componentLookup from '../../../../utils/componentLookup'
import useToast from '../../hooks/useToast'
import './Branding.css'

const Branding = () => {
  let { organisation } = useToast()

  if (!organisation) return <FreeflowLogo />

  organisation = organisation.toLowerCase()

  const BrandLogo =
    componentLookup[`${organisation}Logo`]?.component || FreeflowLogo

  return (
    <div className="branding">
      <BrandLogo />
    </div>
  )
}

export default Branding
