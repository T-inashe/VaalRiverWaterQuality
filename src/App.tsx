import React from "react";
import VaalWaterDashboard from "./map";
import { Mail, Phone, Linkedin } from 'lucide-react';

export default function App() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#0f172a' }}>
      {/* Hero Section with Vaal River Image */}
      <section 
        id="landing" 
        className="relative min-h-screen flex flex-col items-center justify-center"
        style={{
          backgroundImage: 'url("/Vaal_river.jpg")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#0f172a'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 1 }}></div>

        {/* Content with Logos and Title in horizontal layout */}
        <div className="relative w-full px-8" style={{ zIndex: 10, maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3rem' }}>
            {/* Left Logo */}
            <div className="flex-shrink-0">
              <img src="/WhatsApp Image 2025-11-13 at 23.20.00.jpeg" alt="Wits Logo" style={{ height: '120px', width: 'auto', maxWidth: '200px', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))' }} />
            </div>

            {/* Center Title */}
            <div className="flex-1 text-center space-y-6" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)' }}>
                Spatiotemporal Assessment of Water Quality in the Vaal River Catchment
              </h1>
              <p className="text-xl md:text-2xl font-light text-white text-center" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}>
                Ntebogeng Raisibe Mothibe | Khuliso Masindi | Mary Evans
              </p>
            </div>

            {/* Right Logo */}
            <div className="flex-shrink-0">
              <img src="/wits_school_of_geoscience.png" alt="School of Geoscience" style={{ height: '100px', width: 'auto', maxWidth: '200px', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="relative min-h-screen " style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c4a6e 100%)',  padding:'3rem 0' }}>
        <VaalWaterDashboard />
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c4a6e 100%)' }}>
          <div className="w-full z-10" style={{ alignSelf: 'stretch', width: '100%' }}>
            <h2 className="text-4xl font-bold text-white text-center mb-12" style={{ textAlign: 'center' }}>Get In Touch</h2>
            <p className="text-xl text-white text-center mb-8" style={{ textAlign: 'center' }}>For more information contact us on:</p>
            
              <div
                className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 gap-8"
                style={{
                  margin: '0 auto',
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  alignItems: 'center',
                  columnGap: '2rem'
                }}
              >
              {/* Profile Picture */}
              <div className="flex-shrink-0" style={{ justifySelf: 'end' }}>
                <div
                  className="rounded-full overflow-hidden shadow-xl"
                  style={{ width: '128px', height: '128px', border: '2px solid #22d3ee', backgroundColor: '#0f172a' }}
                >
                  <img
                    src="/Ntebogeng_Raisibe_Mothibe.jpg"
                    alt="Ntebogeng Raisibe Mothibe"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', textAlign: 'left', justifySelf: 'start', margin: '2rem 0' }}>
                <h3 className="text-2xl font-bold text-white mb-4">Ntebogeng Raisibe Mothibe</h3>

                <div className="text-white" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone className="w-5 h-5 text-cyan-400" />
                  <span>(+27) 64 815 4264</span>
                </div>

                <div className="text-white" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <a 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-cyan-300 transition-colors"
                  >
                    2584720@students.wits.ac.za
                  </a>
                </div>

                <div className="text-white" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Linkedin className="w-5 h-5 text-cyan-400" />
                  <a
                    href="https://www.linkedin.com/in/NRMothibe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-cyan-300 transition-colors"
                  >
                    linkedin.com/in/NRMothibe
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-cyan-100/60 text-sm" style={{ textAlign: 'center' }}>
              <p>© 2024 University of the Witwatersrand, Johannesburg. All rights reserved.</p>
            </div>
          </div>
        </section>
    </div>
  );
}
