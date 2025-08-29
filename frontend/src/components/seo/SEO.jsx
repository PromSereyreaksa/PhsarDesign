import { Helmet } from 'react-helmet-async'

/**
 * SEO Component for managing meta tags and structured data
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'PhsarDesign',
  siteName = 'PhsarDesign - Creative Freelancing Platform',
  locale = 'en_US',
  twitterCard = 'summary_large_image',
  twitterHandle = '@PhsarDesign',
  canonicalUrl,
  robots = 'index,follow',
  structuredData,
  ...props
}) => {
  const defaultTitle = 'PhsarDesign - Creative Freelancing Platform'
  const defaultDescription = 'Connect with talented artists and designers for your creative projects. Find freelance services in graphic design, illustration, 3D modeling, and more.'
  const defaultImage = '/images/og-default.jpg'
  const siteUrl = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://phsardesign.com')
  
  const seo = {
    title: title ? `${title} | ${siteName}` : defaultTitle,
    description: description || defaultDescription,
    image: image || defaultImage,
    url: url || siteUrl
  }

  // Generate structured data for better SEO
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": siteName,
      "url": siteUrl,
      "description": seo.description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/marketplace?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }

    if (structuredData) {
      return Array.isArray(structuredData) 
        ? [baseData, ...structuredData]
        : [baseData, structuredData]
    }

    return baseData
  }

  return (
    <Helmet {...props}>
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={seo.url} />
      <meta property="twitter:title" content={seo.title} />
      <meta property="twitter:description" content={seo.description} />
      <meta property="twitter:image" content={seo.image} />
      {twitterHandle && <meta property="twitter:creator" content={twitterHandle} />}

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#A95BAB" />
      <meta name="msapplication-TileColor" content="#A95BAB" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>

      {/* Preconnect to external domains for better loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link rel="preconnect" href="https://res.cloudinary.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//res.cloudinary.com" />
    </Helmet>
  )
}

/**
 * Pre-configured SEO components for different page types
 */
export const HomeSEO = () => (
  <SEO
    title="Home"
    description="Discover talented artists and creative professionals on PhsarDesign. Connect with freelancers for graphic design, illustration, 3D modeling, and more creative services."
    keywords="freelance, creative services, graphic design, illustration, 3D modeling, artists, designers"
    structuredData={{
      "@type": "Organization",
      "name": "PhsarDesign",
      "url": import.meta.env.VITE_SITE_URL || window.location.origin,
      "logo": `${import.meta.env.VITE_SITE_URL || window.location.origin}/logo.png`,
      "sameAs": [
        "https://twitter.com/PhsarDesign",
        "https://facebook.com/PhsarDesign",
        "https://instagram.com/PhsarDesign"
      ]
    }}
  />
)

export const MarketplaceSEO = ({ category }) => (
  <SEO
    title={category ? `${category} Services` : "Marketplace"}
    description={`Find and hire ${category ? category.toLowerCase() : 'creative'} freelancers on PhsarDesign. Browse portfolios and connect with talented professionals.`}
    keywords={`${category ? category.toLowerCase() + ', ' : ''}freelance marketplace, creative services, hire freelancers`}
  />
)

export const ProfileSEO = ({ user, type = 'artist' }) => {
  if (!user) return <SEO />
  
  const fullName = `${user.firstName} ${user.lastName}`
  const userType = type === 'artist' ? 'Artist' : 'Client'
  
  return (
    <SEO
      title={`${fullName} - ${userType} Profile`}
      description={user.bio || `View ${fullName}'s profile on PhsarDesign. ${userType} specializing in creative services.`}
      keywords={`${fullName}, ${type}, ${user.specialties || 'creative services'}, portfolio`}
      type="profile"
      structuredData={{
        "@type": "Person",
        "name": fullName,
        "description": user.bio,
        "image": user.avatarURL,
        "url": `${import.meta.env.VITE_SITE_URL || window.location.origin}/profile/${user.slug}`,
        "jobTitle": user.specialties || `${userType}`
      }}
    />
  )
}

export const JobSEO = ({ job }) => {
  if (!job) return <SEO />
  
  return (
    <SEO
      title={job.title}
      description={job.description}
      keywords={`${job.skillRequired}, freelance job, ${job.category?.name}`}
      type="article"
      structuredData={{
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "datePosted": job.createdAt,
        "validThrough": job.deadline,
        "employmentType": "CONTRACTOR",
        "hiringOrganization": {
          "@type": "Organization",
          "name": job.client?.organizationName || "PhsarDesign Client"
        },
        "baseSalary": {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": {
            "@type": "QuantitativeValue",
            "value": job.budget
          }
        }
      }}
    />
  )
}

export default SEO
