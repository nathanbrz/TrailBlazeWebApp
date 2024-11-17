import React from "react";

// Import profile photos
import profilePic_Destin from "../../../../public/images/landingPage/aboutUs/ProfilePic_Destin.jpg";
import profilePic_Riley from "../../../../public/images/landingPage/aboutUs/ProfilePic_Riley.jpg";
import profilePic_Yousef from "../../../../public/images/landingPage/aboutUs/ProfilePic_Yousef.jpg";
import profilePic_David from "../../../../public/images/landingPage/aboutUs/ProfilePic_David.jpg";
import profilePic_Rana from "../../../../public/images/landingPage/aboutUs/ProfilePic_Rana.jpg";
import profilePic_Nathan from "../../../../public/images/landingPage/aboutUs/ProfilePic_Nathan.jpg";
import profilePic_Cole from "../../../../public/images/landingPage/aboutUs/ProfilePic_Cole.jpg";

// Import LinkedIn and GitHub icons
import icon_linkedin from "../../../../public/images/landingPage/aboutUs/icon_linkedin.png";
import icon_github from "../../../../public/images/landingPage/aboutUs/icon_github.png";

// Team data
const teamMembers = [
  {
    id: 1,
    name: "Nathan De Oliveira",
    title: "PM, Frontend Dev, UI/UX Designer",
    description:
      "B.Sc., M.Eng.",
    imgSrc: profilePic_Nathan.src,
    url_linkedin:  "https://www.linkedin.com/in/nathando-se/",
    url_github: "https://github.com/nathanbrz"
  },
  {
    id: 2,
    name: "Destin Saba",
    title: "Backend Data Engineer",
    description: "B.Sc., M.Eng.",
    imgSrc: profilePic_Destin.src,
    url_linkedin:  "https://www.linkedin.com/in/destinsaba/",
    url_github: "https://github.com/destinsaba"
    
  },
  {
    id: 3,
    name: "Rana El Sadig",
    title: "Requirements Analyst, Backend Dev",
    description: "B.Sc., M.Eng.",
    imgSrc: profilePic_Rana.src,
    //url_linkedin:  "https://www.linkedin.com/in/destinsaba/", (no LinkedIn)
    url_github: "https://github.com/ranaelsa"
  },
  {
    id: 4,
    name: "Yousef Fatouraee",
    title: "Frontend Dev",
    description: "B.Sc., M.Eng.",
    imgSrc: profilePic_Yousef.src,
    url_linkedin:  "https://www.linkedin.com/in/youseffatouraee/",
    url_github: "https://github.com/ModulesSoft"
  },
  {
    id: 5,
    name: "Cole Cathcart",
    title: "Backend Data Engineer",
    description:
      "B.Sc., M.Eng.",
    imgSrc: profilePic_Cole.src,
    url_linkedin:  "https://www.linkedin.com/in/cole-cathcart/",
    url_github: "https://github.com/colecathcart"
  },
  {
    id: 6,
    name: "Riley Koppang",
    title: "Backend Dev",
    description:
      "B.Sc., M.Eng.",
    imgSrc: profilePic_Riley.src,
    url_linkedin:  "https://www.linkedin.com/in/riley-koppang/",
    url_github: "https://github.com/Koppang-Dev"
  },
  {
    id: 7,
    name: "David Nguyen",
    title: "Requirements and Design Analyst, Frontend Dev",
    description:
      "B.Sc., M.Eng.",
    imgSrc: profilePic_David.src,
    url_linkedin:  "https://www.linkedin.com/in/david-minh-nguyen/",
    url_github: "https://github.com/minhdavidnguyen"
  },
];

const TeamSection = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="mb-4 text-4xl">Meet our Team</h2>
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
                  {/*LinkedIn and GitHub icons*/}
                  <div className="d-flex justify-content-center mt-3">
                    {member.url_linkedin && (
                      <a
                        href={member.url_linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-2"
                        >
                          <img
                            src={icon_linkedin.src}
                            alt="LinkedIn"
                            style={{width: "24px", heigh: "24px"}}
                            />
                        </a>
                    )}
                    {member.url_github && (
                      <a
                        href={member.url_github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-2"
                        >
                          <img
                            src={icon_github.src}
                            alt="GitHub"
                            style={{width: "24px", heigh: "24px"}}
                            />
                        </a>
                    )}
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

export default TeamSection;