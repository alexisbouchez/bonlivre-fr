import Container from "../layouts/Container";
import SearchBar from "../layouts/SearchBar";

const Hero: React.FC = () => (
  <div className="fullheight flex items-center">
    <Container>
      <h2 className="mt-8 text-center font-sans text-4xl">
        <i>Sauvegardez</i>, <i>notez</i> et <i>commentez</i> <br />
        vos <b>lectures</b>
      </h2>
      <SearchBar />
    </Container>
  </div>
);

export default Hero;
