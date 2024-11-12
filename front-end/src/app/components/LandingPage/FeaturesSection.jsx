import React from 'react';

// Import photos 
import landingPage_Feature1 from "../../../../public/images/feature1.png";
import landingPage_Feature2 from "../../../../public/images/feature2.png";
import landingPage_Feature3 from "../../../../public/images/feature3.png";

const FeaturesSection = () => {
  // Data for the feature cards
  const features = [
    {
      id: 1,
      title: 'User Authentication',
      subtitle: 'Signup and login with authentication tokens',
      imgSrc: landingPage_Feature1.src,
    },
    {
      id: 2,
      title: 'Trip Management',
      subtitle: 'Create, update, and delete trips',
      imgSrc: landingPage_Feature2.src,
    },
    {
      id: 3,
      title: 'Dynamic Design',
      subtitle: 'Mobile-friendly interface',
      imgSrc: landingPage_Feature3.src,
    },
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h1 className="mb-4 text-4xl">Features for Your Effortless Planning</h1>
        <p className="text-muted mb-5">The blocks & components you need</p>

        <div className="row justify-content-center">
          {features.map((feature) => (
            <div key={feature.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <p className="mb-2 text-spice">{feature.title}</p>
                  <p className="card-text text-muted mb-4">{feature.subtitle}</p>
                  <div className="d-flex justify-content-center rounded-lg">
                    <img
                      src={feature.imgSrc}
                      alt="Placeholder"
                      style={{ width: '80px', height: '80px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;