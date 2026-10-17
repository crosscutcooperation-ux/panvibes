import ClientEffects from './client-effects';
import './about.css';

export const metadata = {
  title: 'About Us | PanVibes Exim',
  description: 'Learn about PanVibes Exim, our global trade organization, founder, and leadership team.',
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <logistics-about />
      <main className="panvibes-content">
      <section className="company-introduction" aria-labelledby="company-title">
          <div className="container">
              <div className="company-copy">
                      <h2 id="company-title" className="split" data-wow-delay=".2s"><span className="company-title-accent">Globally</span> Export Import Organization</h2>
      
                      <p className="wow fadeInUp" data-wow-delay=".6s">
                        Panvibes Exim Pvt. Ltd. is shaping the future of global trade by connecting trusted Indian supply excellence with world markets that demand quality, consistency and innovation. We are more than an export company. we are a solutions partner for industries in food, nutrition, wellness and sustainable agriculture.
                        </p>
      
                      <p className="wow fadeInUp" data-wow-delay=".6s">
                         With a diverse portfolio covering Dehydrated Agro Products, Nutraceutical Ingredients, Organic Commodities, Specialty Chemicals and Super Spices, we serve clients who prioritize purity, traceability and long-term value creation. Our sourcing network is built on deep partnerships with certified farms, progressive manufacturing units, and research driven formulation facilities.
                         </p>
      
                      <p className="wow fadeInUp" data-wow-delay=".6s">
                         We lead with insight, innovation and integrity transforming raw potential into globally scaled supply chains. Every shipment reflects our commitment to quality precision, on-time delivery and regulatory compliance across
      international markets.
      </p>
      
              </div>
          </div>
      </section>
      
      
      <div className="founders-section" aria-labelledby="founders-title">
          <div className="container">
              <div className="row justify-content-center mb-40">
                  <div className="col-lg-8">
                      <div className="section-title text-center wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
                          <h2 id="founders-title"><span className="highlight-text1">Our</span> <span className="highlight-text">Founders</span></h2>
                          
                      </div>
                  </div>
              </div>
      
              <div className="row align-items-center gy-5">
                  <div className="col-lg-5 wow animate fadeInLeft" data-wow-delay="200ms" data-wow-duration="1500ms">
                      <div className="founder-img-wrapper ">
                          <div className="founder-img-area">
                              <img loading="lazy" decoding="async" src="/assets/panvibes/images/founder/pm.jpeg" alt="Prakash Mewada, founder of PanVibes Exim" />
                          </div>
                      </div>
                  </div>
                  <div className="col-lg-7 wow animate fadeInRight" data-wow-delay="200ms" data-wow-duration="1500ms">
                     
                      <div className="founder-content">
                           <h3>Prakash Mewada</h3>
                           <h4 className="founder-role">(Founder, PanVibes Exim Pvt Ltd & Gaamup Infra Ltd)</h4>
                          <p className="founder-intro">Prakash Sir is a dynamic entrepreneur and the visionary Founder of <strong>PanVibes Exim Pvt Ltd</strong> & <strong>GaamUP Infra Pvt Ltd,</strong> a reputed company known for its high-quality RMC (Ready Mix Concrete) plants and infrastructure solutions.</p>
                          
                          <p className="founder-intro">With years of hands-on experience in construction, manufacturing, and supply-chain operations, he has built a strong reputation for reliability, discipline, and long-term thinking. His journey reflects dedication, consistency, and a deep passion for creating sustainable growth across multiple industries.</p>
                          
                          <p className="founder-intro">At Panvibes Exim, he leads with a global mindset—focusing on ethical sourcing, trustworthy trade practices, and building long-standing international partnerships. His commitment to quality and transparency has shaped Panvibes Exim into a brand that prioritizes integrity above all.</p>
                          
                          <p className="founder-intro">Beyond business, Prakash Sir strongly believes in helping good-intentioned people and empowering those who want to grow. His leadership style is rooted in positivity, mentorship, and genuine support for others.</p>
                          
                          <p className="founder-intro">Under his guidance, Panvibes Exim is moving towards becoming a powerful global export-import company built on trust, vision, and continuous innovation.</p>
      
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      
      
      
      <div className="team-section" aria-labelledby="team-title">
          <div className="container">
              <div className="row justify-content-center mb-60">
      
                  <div className="col-lg-8">
                      <div className=" text-center wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
                          <h2 id="team-title">Emphasizes <span className="team-title-accent">Proactive</span> Ownership</h2>
                          <p className="team-subtitle">Driving Growth Through Strategy and Innovation</p>
                      </div>
                  </div>
              </div>
      
              <div className="row gy-4 justify-content-center">
                  
                  <div className="col-lg-3 col-md-4 col-sm-6 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
                      <div className="team-card">
                          <div className="team-img-wrapper">
                              <div className="team-img">
                                  <img loading="lazy" decoding="async" src="/assets/panvibes/images/founder/gm.jpeg" alt="Gautam Mewada" />
                                  <div className="social-overlay">
                                      <ul className="social-links">
                                          <li><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bx bxl-facebook"></i></a></li>
                                          <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="bx bxl-linkedin"></i></a></li>
                                          <li><a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="bx bxl-twitter"></i></a></li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                          <div className="team-content">
                              <h5>Gautam Mewada</h5>
                              <p>Director</p>
                          </div>
                      </div>
                  </div>
      
                  <div className="col-lg-3 col-md-4 col-sm-6 wow animate fadeInUp" data-wow-delay="300ms" data-wow-duration="1500ms">
                      <div className="team-card">
                          <div className="team-img-wrapper">
                              <div className="team-img">
                                  <img loading="lazy" decoding="async" src="/assets/panvibes/images/founder/pp.jpeg" alt="Prathamesh Patil" />
                                  <div className="social-overlay">
                                      <ul className="social-links">
                                          <li><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bx bxl-facebook"></i></a></li>
                                          <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="bx bxl-linkedin"></i></a></li>
                                          <li><a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="bx bxl-twitter"></i></a></li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                          <div className="team-content">
                              <h5>Prathamesh Patil</h5>
                              <p>Director</p>
                          </div>
                      </div>
                  </div>
      
                  <div className="col-lg-3 col-md-4 col-sm-6 wow animate fadeInUp" data-wow-delay="500ms" data-wow-duration="1500ms">
                      <div className="team-card">
                          <div className="team-img-wrapper">
                              <div className="team-img">
                                  <img loading="lazy" decoding="async" src="/assets/panvibes/images/founder/nk.jpeg" alt="Nitesh Kanse" />
                                  <div className="social-overlay">
                                      <ul className="social-links">
                                          <li><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bx bxl-facebook"></i></a></li>
                                          <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="bx bxl-linkedin"></i></a></li>
                                          <li><a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="bx bxl-twitter"></i></a></li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                          <div className="team-content">
                              <h5>Nitesh Kanse</h5>
                              <p>Chief Procurement Director (CPD)</p>
                          </div>
                      </div>
                  </div>
      
                  <div className="col-lg-3 col-md-4 col-sm-6 wow animate fadeInUp" data-wow-delay="500ms" data-wow-duration="1500ms">
                      <div className="team-card">
                          <div className="team-img-wrapper">
                              <div className="team-img">
                                  <img loading="lazy" decoding="async" src="/assets/panvibes/images/founder/om.jpeg" alt="Omkar Marakwar" />
                                  <div className="social-overlay">
                                      <ul className="social-links">
                                          <li><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bx bxl-facebook"></i></a></li>
                                          <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="bx bxl-linkedin"></i></a></li>
                                          <li><a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="bx bxl-twitter"></i></a></li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                          <div className="team-content">
                              <h5>Omkar Marakwar</h5>
                              <p>Chief Operations Director (COD)</p>
                          </div>
                      </div>
                  </div>
      
                  <div className="col-lg-3 col-md-4 col-sm-6 wow animate fadeInUp" data-wow-delay="500ms" data-wow-duration="1500ms">
                      <div className="team-card">
                          <div className="team-img-wrapper">
                              <div className="team-img">
                                  <img loading="lazy" decoding="async" src="/assets/panvibes/images/founder/bp.jpeg" alt="Bhavesh Patil" />
                                  <div className="social-overlay">
                                      <ul className="social-links">
                                          <li><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bx bxl-facebook"></i></a></li>
                                          <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="bx bxl-linkedin"></i></a></li>
                                          <li><a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="bx bxl-twitter"></i></a></li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                          <div className="team-content">
                              <h5>Bhavesh Patil</h5>
                              <p>Chief Logistics Director (CLD)</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
        <logistics-crane id="crane-lift"></logistics-crane>
        <section className="apart-section" id="what-sets-us-apart" aria-labelledby="apart-title">
          <div className="apart-sticky">
            <div className="apart-heading">
              <span className="apart-eyebrow">THE PANVIBES DIFFERENCE</span>
              <h2 id="apart-title"><span className="apart-title-line"><span className="apart-title-what">WHAT</span> <span className="apart-title-accent">SETS</span></span><span className="apart-title-line"><span className="apart-title-accent">US</span> <span>APART</span></span></h2>
            </div>
            <div className="apart-viewport" aria-label="What sets us apart cards">
              <div className="apart-track">
                <article className="apart-card is-active" tabIndex="0">
                  <img className="apart-image" src="/assets/apart/freight.jpg" alt="Stacked shipping containers at a freight terminal" loading="lazy" decoding="async" />
                  <div className="apart-card-content">
                    <svg className="apart-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M5 12.5 20 5l15 7.5v16L20 36 5 28.5v-16Zm0 0L20 20l15-7.5M20 20v16"/></svg>
                    <h3>End-to-End Supply and Logistics Support</h3>
                    <p>Comprehensive solutions covering every stage from sourcing to delivery for seamless operations.</p>
                  </div>
                </article>
                <article className="apart-card" tabIndex="0">
                  <img className="apart-image" src="/assets/apart/transport.jpg" alt="Cargo vessel and port cranes in the global supply network" loading="lazy" decoding="async" />
                  <div className="apart-card-content">
                    <svg className="apart-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="8" r="4"/><circle cx="7" cy="30" r="4"/><circle cx="33" cy="30" r="4"/><path d="M18 12 9 26m13-14 9 14M11 30h18"/></svg>
                    <h3>Verified Supplier &amp; Manufacturer Ecosystem</h3>
                    <p>A trusted network of pre-vetted partners ensuring reliability and authenticity.</p>
                  </div>
                </article>
                <article className="apart-card" tabIndex="0">
                  <img className="apart-image" src="/assets/apart/quality.jpg" alt="Quality testing in a laboratory" loading="lazy" decoding="async" />
                  <div className="apart-card-content">
                    <svg className="apart-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 4 34 9v10c0 9-6 14-14 17C12 33 6 28 6 19V9L20 4Z"/><path d="m13 20 5 5 9-10"/></svg>
                    <h3>High Consistency in Product Quality</h3>
                    <p>Stringent quality control processes guarantee uniform excellence across every batch.</p>
                  </div>
                </article>
                <article className="apart-card" tabIndex="0">
                  <img className="apart-image" src="/assets/apart/trade.jpg" alt="International trade documents and route maps" loading="lazy" decoding="async" />
                  <div className="apart-card-content">
                    <svg className="apart-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 4v31M7 12h26M10 12 5 24h10l-5-12Zm20 0-5 12h10l-5-12ZM13 35h14"/></svg>
                    <h3>Transparent and Ethical Trade Practices</h3>
                    <p>Committed to honesty, accountability, and fair dealings in every transaction.</p>
                  </div>
                </article>
                <article className="apart-card" tabIndex="0">
                  <img className="apart-image" src="/assets/apart/growth.jpg" alt="Port cranes and ships moving global trade forward" loading="lazy" decoding="async" />
                  <div className="apart-card-content">
                    <svg className="apart-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="m5 31 10-10 7 5L35 10M25 10h10v10"/></svg>
                    <h3>Focus on Long-Term Partnerships &amp; Business Growth</h3>
                    <p>Building sustainable relationships that foster mutual success and expansion.</p>
                  </div>
                </article>
              </div>
            </div>
            <div className="apart-progress" aria-hidden="true"><span></span></div>
            <p className="apart-hint">MOVE YOUR MOUSE OR SCROLL TO EXPLORE</p>
          </div>
        </section>
        </main>
      <ClientEffects />
    </div>
  );
}
