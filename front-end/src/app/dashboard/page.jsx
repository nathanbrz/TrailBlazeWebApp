import "../../styles/global_styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "../components/Dashboard/SearchBar";
import IntroSection from "../components/Dashboard/IntroSection";
import PlanListSection from "../components/Dashboard/PlanListSection";

export default function Hero() {
  return (
    <div>
      <SearchBar />
      <div>
        <IntroSection />
      </div>
      <div>
        <PlanListSection />
      </div>
    </div>
  );
}
