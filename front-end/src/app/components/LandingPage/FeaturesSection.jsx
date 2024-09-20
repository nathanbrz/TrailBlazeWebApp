import React from 'react';

const FeaturesSection = () => {
  // Data for the cards
  const features = [
    {
      id: 1,
      title: 'Clarity gives you the blocks & components you need to create a truly professional.',
      imgSrc: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'Clarity gives you the blocks & components you need to create a truly professional.',
      imgSrc: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      title: 'Clarity gives you the blocks & components you need to create a truly professional.',
      imgSrc: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="mb-4">Features for your effortless planning</h2>
        <p className="text-muted mb-5">The blocks & components you need</p>

        <div className="row">
          {features.map((feature) => (
            <div key={feature.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <p className="card-text text-muted mb-4">
                    {feature.title}
                  </p>
                  <div className="d-flex justify-content-center rounded-lg">
                    <img
                      src={feature.imgSrc}
                      alt="Placeholder"
                      style={{ width: '150px', height: '150px' }}
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