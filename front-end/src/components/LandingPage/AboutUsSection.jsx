import React from "react";

// Team data
const teamMembers = [
  {
    id: 1,
    name: "Nathan De Oliveira",
    title: "PM, Frontend Dev, UI/UX Designer",
    description:
      "Former co-founder of Opendoor. Early staff at Spotify and Clearbit.",
    imgSrc: "https://via.placeholder.com/150", // Replace with actual image URL
  },
  {
    id: 2,
    name: "Destin Saba",
    title: "Backend Data Engineer",
    description: "Lead engineering teams at Figma, Pitch, and Protocol Labs.",
    imgSrc: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Rana El Sadig",
    title: "Requirements Analyst, Backend Dev",
    description: "Former PM for Linear, Lambda School, and On Deck.",
    imgSrc: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Yousef Fatouraee",
    title: "Frontend Dev",
    description: "Lead backend dev at Clearbit. Former Clearbit and Loom.",
    imgSrc: "https://via.placeholder.com/150",
  },
  {
    id: 5,
    name: "Cole Cathcart",
    title: "Backend Data Engineer",
    description:
      "Founding design team at Figma. Former Pleo, Stripe, and Tile.",
    imgSrc: "https://via.placeholder.com/150",
  },
  {
    id: 6,
    name: "Riley Koppang",
    title: "Backend Dev",
    description:
      "Lead user research for Slack. Contractor for Netflix and Udacity.",
    imgSrc: "https://via.placeholder.com/150",
  },
  {
    id: 7,
    name: "David Nguyen",
    title: "Requirements and Design Analyst",
    description:
      "Lead user research for Slack. Contractor for Netflix and Udacity.",
    imgSrc: "https://via.placeholder.com/150",
  },
];

const TeamSection = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="mb-4 text-4xl">Meet our team</h2>
        <p className="text-muted mb-5">
          Our philosophy is simple — hire a team of diverse, passionate people
          and foster a culture that empowers you to do your best work.
        </p>

        <div className="row justify-content-center">
          {teamMembers.map((member) => (
            <div key={member.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <div className="d-flex justify-content-center mb-3">
                    <img
                      src={member.imgSrc}
                      alt={member.name}
                      className="rounded-circle mb-3 content-center"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <h5 className="card-title">{member.name}</h5>
                  <p className="mb-2 text-spice">{member.title}</p>
                  <p className="card-text text-muted">{member.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
