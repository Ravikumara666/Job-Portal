import React, { useState } from 'react'
import { Building2, Users, MapPin, Globe, Star, TrendingUp, Calendar, Award, Sparkles, Zap, Heart, Code, Leaf, DollarSign, Stethoscope, Cloud, BookOpen, Coffee } from 'lucide-react'
import NavBar from '../component/NavBar'

export default function Company() {
  const [hoveredCard, setHoveredCard  ]= useState(null)

  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-white/90 backdrop-blur-xl p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent mb-3">
            Elite Companies Portfolio
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover industry-leading companies driving innovation across various sectors with cutting-edge technology
          </p>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {companies.map((company) => {
            const IconComponent = company.icon
            return (
              <div
                key={company.id}
                className={`group relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 
                           hover:border-${company.accent}-400/50 transition-all duration-300 hover:scale-105 
                           hover:shadow-lg hover:shadow-${company.accent}-200/30 transform-gpu
                           ${hoveredCard === company.id ? 'rotate-1' : ''}`}
                onMouseEnter={() => setHoveredCard(company.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform: hoveredCard === company.id 
                    ? 'translateY(-4px) rotateX(3deg) rotateY(3deg)' 
                    : 'translateY(0) rotateX(0) rotateY(0)',
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${company.gradient} opacity-5 
                               rounded-xl group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Floating Icon */}
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-lg 
                               bg-gradient-to-br ${company.gradient} mb-3 group-hover:rotate-6 
                               transition-transform duration-300 shadow-sm`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>

                {/* Company Details */}
                <div className="relative space-y-2">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {company.name}
                    </h3>
                    <p className={`text-${company.accent}-600 font-medium text-xs uppercase tracking-wide line-clamp-1`}>
                      {company.industry}
                    </p>
                  </div>

                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                    {company.description}
                  </p>

                  {/* Compact Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="bg-gray-50/80 rounded-md p-2 group-hover:bg-gray-100/80 transition-colors">
                      <div className="flex items-center gap-1 mb-1">
                        <Users className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-gray-500 font-medium">{company.employees}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50/80 rounded-md p-2 group-hover:bg-gray-100/80 transition-colors">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-gray-500 font-medium">{company.revenue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(company.rating)
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-700 font-semibold text-xs">{company.rating}</span>
                    </div>
                    
                    <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${company.gradient} 
                                   text-white text-xs font-medium group-hover:shadow-sm 
                                   transition-shadow`}>
                      Top
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${company.gradient} opacity-0 
                               group-hover:opacity-3 rounded-xl transition-opacity duration-300 pointer-events-none`} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto mt-12 text-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Ready to Join the Innovation Leaders?
          </h3>
          <p className="text-gray-600 mb-4 max-w-xl mx-auto">
            Connect with these industry pioneers and discover opportunities that drive the future forward
          </p>
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium 
                           rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                           transform hover:scale-105 hover:shadow-lg hover:shadow-blue-200/50">
            Explore Opportunities
          </button>
        </div>
      </div>
    </div>
    </>
  )
  
} 

  const companies = [
    {
      id: 1,
      name: "TechFlow Solutions",
      industry: "Software Development",
      employees: "500-1000",
      location: "San Francisco, CA",
      founded: 2018,
      rating: 4.8,
      revenue: "$50M+",
      description: "Leading AI and machine learning solutions provider specializing in next-gen automation",
      icon: Code,
      gradient: "from-violet-600 via-purple-600 to-blue-600",
      accent: "violet"
    },
    {
      id: 2,
      name: "GreenEarth Energy",
      industry: "Renewable Energy",
      employees: "1000-5000",
      location: "Austin, TX",
      founded: 2015,
      rating: 4.6,
      revenue: "$200M+",
      description: "Sustainable solar and wind energy solutions for a cleaner tomorrow",
      icon: Leaf,
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      accent: "emerald"
    },
    {
      id: 3,
      name: "FinanceWave",
      industry: "Financial Services",
      employees: "200-500",
      location: "New York, NY",
      founded: 2020,
      rating: 4.7,
      revenue: "$25M+",
      description: "Digital banking and investment platform revolutionizing financial services",
      icon: DollarSign,
      gradient: "from-amber-500 via-yellow-500 to-orange-500",
      accent: "amber"
    },
    {
      id: 4,
      name: "HealthTech Pro",
      industry: "Healthcare Technology",
      employees: "300-700",
      location: "Boston, MA",
      founded: 2017,
      rating: 4.9,
      revenue: "$75M+",
      description: "Revolutionary medical diagnostic tools powered by advanced AI algorithms",
      icon: Stethoscope,
      gradient: "from-rose-500 via-red-500 to-pink-500",
      accent: "rose"
    },
    {
      id: 5,
      name: "CloudNet Systems",
      industry: "Cloud Computing",
      employees: "800-1200",
      location: "Seattle, WA",
      founded: 2016,
      rating: 4.5,
      revenue: "$120M+",
      description: "Enterprise cloud infrastructure solutions for scalable business growth",
      icon: Cloud,
      gradient: "from-sky-500 via-blue-500 to-cyan-500",
      accent: "sky"
    },
    {
      id: 6,
      name: "EduLearn Global",
      industry: "Education Technology",
      employees: "150-300",
      location: "Chicago, IL",
      founded: 2019,
      rating: 4.4,
      revenue: "$15M+",
      description: "Online learning and skill development platform for modern professionals",
      icon: BookOpen,
      gradient: "from-indigo-500 via-purple-500 to-violet-500",
      accent: "indigo"
    },
    {
      id: 7,
      name: "FoodDelight Co.",
      industry: "Food & Beverage",
      employees: "2000-3000",
      location: "Portland, OR",
      founded: 2014,
      rating: 4.3,
      revenue: "$300M+",
      description: "Premium organic food products and sustainable farming solutions",
      icon: Coffee,
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      accent: "orange"
    },
    {
      id: 8,
      name: "SpaceVenture Inc.",
      industry: "Aerospace",
      employees: "1500-2000",
      location: "Houston, TX",
      founded: 2016,
      rating: 4.8,
      revenue: "$400M+",
      description: "Commercial space exploration and satellite technology innovations",
      icon: Zap,
      gradient: "from-slate-600 via-gray-600 to-zinc-600",
      accent: "slate"
    },
    {
      id: 9,
      name: "GameStudio Elite",
      industry: "Gaming",
      employees: "100-200",
      location: "Los Angeles, CA",
      founded: 2021,
      rating: 4.6,
      revenue: "$10M+",
      description: "Immersive VR/AR gaming experiences and interactive entertainment",
      icon: Sparkles,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      accent: "pink"
    },
    {
      id: 10,
      name: "BioMed Innovations",
      industry: "Biotechnology",
      employees: "400-600",
      location: "San Diego, CA",
      founded: 2017,
      rating: 4.7,
      revenue: "$85M+",
      description: "Cutting-edge biotechnology research and pharmaceutical development",
      icon: Heart,
      gradient: "from-teal-500 via-cyan-500 to-blue-500",
      accent: "teal"
    },
    {
      id: 11,
      name: "AutoDrive Future",
      industry: "Automotive Tech",
      employees: "800-1000",
      location: "Detroit, MI",
      founded: 2019,
      rating: 4.5,
      revenue: "$150M+",
      description: "Autonomous vehicle technology and smart transportation systems",
      icon: TrendingUp,
      gradient: "from-gray-700 via-slate-700 to-zinc-700",
      accent: "gray"
    },
    {
      id: 12,
      name: "RetailMax Solutions",
      industry: "E-commerce",
      employees: "600-800",
      location: "Miami, FL",
      founded: 2018,
      rating: 4.4,
      revenue: "$90M+",
      description: "Advanced e-commerce platforms and retail analytics solutions",
      icon: Building2,
      gradient: "from-lime-500 via-green-500 to-emerald-500",
      accent: "lime"
    },
    {
      id: 13,
      name: "CyberShield Pro",
      industry: "Cybersecurity",
      employees: "250-400",
      location: "Washington, DC",
      founded: 2020,
      rating: 4.9,
      revenue: "$35M+",
      description: "Enterprise cybersecurity solutions and threat intelligence services",
      icon: Award,
      gradient: "from-red-600 via-rose-600 to-pink-600",
      accent: "red"
    },
    {
      id: 14,
      name: "DataMine Analytics",
      industry: "Data Science",
      employees: "200-350",
      location: "Denver, CO",
      founded: 2019,
      rating: 4.6,
      revenue: "$28M+",
      description: "Big data analytics and business intelligence consulting services",
      icon: TrendingUp,
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
      accent: "blue"
    },
    {
      id: 15,
      name: "CleanTech Dynamics",
      industry: "Environmental Tech",
      employees: "300-500",
      location: "San Jose, CA",
      founded: 2016,
      rating: 4.5,
      revenue: "$65M+",
      description: "Environmental technology solutions for sustainable industrial processes",
      icon: Leaf,
      gradient: "from-green-600 via-teal-600 to-cyan-600",
      accent: "green"
    }
  ]