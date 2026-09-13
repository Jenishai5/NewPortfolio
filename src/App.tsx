import Hero from './components/Hero';
import Intro from './components/Intro';
import ProjectCarousel from './components/ProjectCarousel';
import HorizontalProjects from './components/HorizontalProjects';
import Bunny from './components/Bunny/Bunny';
import './App.css';

function App() {
  return (
    <>
      <Bunny />
      <Hero />

      <main className="main">
        <div className="main-left">
          <Intro />
        </div>
        <div className="main-right">
          <ProjectCarousel />
        </div>
      </main>

      <HorizontalProjects />
    </>
  );
}

export default App;
